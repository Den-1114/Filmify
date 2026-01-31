import {useState, useEffect, useCallback} from 'react';
import {ChevronLeft, ChevronRight, Play, Info} from 'lucide-react';
import axios from "axios";

interface MovieSlide {
    id: number;
    backdrop_path: string;
    title: string;
    overview: string;
}


export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const [slides, setSlides] = useState<MovieSlide[]>([]);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const headersTMDB = {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
        "Content-Type": "application/json",
    };


    // Auto-rotate logic
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (isAutoPlaying) {
            interval = setInterval(() => {
                setCurrent((prev) => (prev + 1) % slides.length);
            }, 7000);
        }

        return () => clearInterval(interval);
    }, [isAutoPlaying, slides.length]);

    useEffect(() => {
        axios.get(
            "https://api.themoviedb.org/3/trending/movie/day",
            {headers: headersTMDB}
        )
            .then((res) => {setSlides(res.data.results)})
            .catch((err) => console.error(err));

        console.log(slides);
    }, []);

    const nextSlide = useCallback(() => {
        if (slides.length === 0) return;

        setCurrent((prev) => (prev + 1) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    }, [slides.length]);

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const goToSlide = (index: number) => {
        setCurrent(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    if (!slides) {
        return (
            <div className="bg-[#121212] min-h-screen text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        )
    }

    return (
        <section className="h-[80vh] w-full overflow-hidden bg-black text-white shadow-2xl mb-52">
            {slides.map((slide, index) => {
                const isActive = index === current;

                return (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                    >
                        {/* Background Image with Zoom & Blur Effect */}
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={`https://image.tmdb.org/t/p/original${slide.backdrop_path}`}
                                alt={slide.title}
                                className={`h-full w-full object-cover transition-all duration-10000 ease-linear ${
                                    isActive
                                        ? "scale-100 blur-0 brightness-100"
                                        : "scale-125 blur-sm brightness-50"
                                }`}
                            />
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent"/>

                        {/* Content Container */}
                        <div className="absolute bottom-20 left-8 md:left-30 max-w-xl z-20">
                            {/* Title */}
                            <h1
                                className={`text-4xl md:text-6xl font-extrabold mb-4 transform transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                                    isActive
                                        ? "translate-y-0 opacity-100 delay-300"
                                        : "translate-y-12 opacity-0"
                                }`}
                            >
                                {slide.title}
                            </h1>

                            {/* Description */}
                            <p
                                className={`text-lg md:text-xl text-gray-200 mb-8 leading-relaxed transform transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                                    isActive
                                        ? "translate-y-0 opacity-100 delay-500"
                                        : "translate-y-12 opacity-0"
                                }`}
                            >
                                {slide.overview}
                            </p>

                            {/* Buttons */}
                            <div
                                className={`flex gap-4 transform transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                                    isActive
                                        ? "translate-y-0 opacity-100 delay-700"
                                        : "translate-y-12 opacity-0"
                                }`}
                            >
                                <button
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold duration-200"
                                    onClick={() => {window.location.href = `/watch/${slide.id}/movie`}}
                                >
                                    <Play size={20} fill="currentColor"/> Play Now
                                </button>
                                <button
                                    className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
                                    onClick={() => {window.location.href = `/video/${slide.id}/movie`}}
                                >
                                    <Info size={20}/> More Info
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/30 hover:scale-110 transition-all duration-300"
                aria-label="Previous Slide"
            >
                <ChevronLeft size={32}/>
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/30 hover:scale-110 transition-all duration-300"
                aria-label="Next Slide"
            >
                <ChevronRight size={32}/>
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-8 left-8 md:left-30 flex gap-3 z-30">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToSlide(i)}
                        className={`h-1 rounded-full transition-all duration-300 ${
                            i === current ? "w-8 bg-white" : "w-4 bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};
