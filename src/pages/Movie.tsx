import Navbar from "../components/Navbar";
import {useParams} from "react-router-dom";
import {useEffect, useState, useRef} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

type Movie = {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
};


export default function Movie() {
    const {id} = useParams<{ id: string }>();
    const headersTMDB = {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2NjODEzMDk5NWExOGM3ZGJjYmRjOTUxMzViYjY4NSIsIm5iZiI6MTczNDM1NjYzNC42MTEsInN1YiI6IjY3NjAyZTlhZGY4MjljNDBiY2Q4ZGUwNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.y-sNKWYMQQLdIPO91aCqRMDR3M2E0WsvbI7SViHM2pQ`,
        "Content-Type": "application/json",
    };

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [movie, setMovie] = useState<Movie | null>(null);
    useEffect(() => {
        async function fetchMovie() {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}`,
                    {headers: headersTMDB}
                );
                setMovie(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchMovie();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    if (!movie) {
        return (
            <div className="bg-[#121212] min-h-screen text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    // List of available servers
    const servers = [
        {name: "Server 1", id: "1"},
        {name: "Server 2", id: "2"},
        {name: "Server 3", id: "3"},
        {name: "Server 4", id: "4"}
    ];

    // Close dropdown if clicked outside

    return (
        <div className="bg-[#121212] min-h-screen text-white pb-20">
            <div
                className="relative h-[70vh] w-full bg-cover bg-center"
                style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                }}
            >
                <div className="absolute inset-0 bg-linear-to-t from-[#121212] via-black/50 to-transparent"/>
                <div className="flex flex-col items-center justify-center w-full gap-4 pt-8">
                    <Navbar/>
                </div>
            </div>

            <div
                className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-8 md:items-start -mt-32 md:-mt-48">
                <div className="shrink-0 mx-auto md:mx-0">
                    <img
                        className="w-48 md:w-72 rounded-xl shadow-2xl border-4 border-[#121212]"
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                        alt="Movie Poster"
                    />
                </div>

                <div className="flex flex-col items-center md:items-start text-center md:text-left pt-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md">
                        {movie.title}
                    </h1>

                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6 text-sm font-medium">
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full">
                    ⭐ {movie.vote_average}
                </span>
                        <span className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-full">
                    {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                </span>
                    </div>

                    <p className="text-gray-300 text-lg mb-8 max-w-3xl leading-relaxed">
                        {movie.overview}
                    </p>

                    <div className="flex flex-row gap-4 relative" ref={dropdownRef}>

                        {/* 1. The Trigger Button */}
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 bg-red-600 px-8 py-3.5 rounded-lg font-bold text-white hover:bg-red-700 transition duration-300 shadow-lg hover:shadow-red-900/20"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                            Watch Now
                            {/* Arrow Icon that rotates when open */}
                            <svg
                                className={`w-4 h-4 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                        </button>

                        {/* 2. The Dropdown Menu */}
                        {isDropdownOpen && (
                            <div
                                className="absolute top-full mt-2 left-0 w-56 bg-[#18181b] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
                                {servers.map((server) => (
                                    <Link
                                        key={server.id}
                                        to={`/watch/${id}?serverId=${server.id}`} // Passes ?server=... to URL
                                        className="px-4 py-3 hover:bg-gray-800 text-gray-200 hover:text-white transition text-left flex justify-between items-center group"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <span>{server.name}</span>
                                        <svg
                                            className="w-4 h-4 opacity-0 group-hover:opacity-100 text-red-500 transition-opacity"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}