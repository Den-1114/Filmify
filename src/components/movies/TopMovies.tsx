import Card from "./Card.tsx";
import {useEffect, useState} from "react";
import axios from "axios";

type Movie = {
    id: number
    title: string
    overview: string
    backdrop_path: string
    poster_path: string
    vote_average: number
    release_date: string
    number_of_episodes: number
    number_of_seasons: number
    media_type: string
}

export default function TopMovies() {

    const [top10, setTop10] = useState<Movie[]>([]);

    useEffect(() => {
        async function getTop10() {
            const res = await axios.get("https://api.themoviedb.org/3/trending/movie/day");
            setTop10(res.data.results.slice(0, 10))
        }

        getTop10()
    }, []);

    return (
        <div className="ml-8">
            <div className="flex items-center gap-2 sm:gap-4 p-6 w-fit select-none overflow-hidden">

                <h3 className="font-bold text-outline text-6xl sm:text-8xl lg:text-9xl lg:ml-2.5 top10"><span
                    className="ml-0 md:-ml-2 letter-shadow-r lg:-ml-3">T</span><span
                    className="-ml-2 letter-shadow-r lg:-ml-3">O</span><span
                    className="mr-1 -ml-2 letter-shadow-r lg:-ml-3">P</span><span
                    className="-ml-2 letter-shadow-r lg:ml-3">1</span><span
                    className="letter-shadow-r -ml-2 md:-ml-2.5 lg:-ml-5">0</span></h3>

                <div className="flex flex-col justify-center pl-1 sm:pl-2">
                    <h3 className="text-white font-bold text-xs sm:text-xl lg:text-2xl tracking-[0.3em] sm:tracking-[0.5em] leading-tight">
                        MOVIES
                    </h3>
                    <h3 className="text-white font-bold text-xs sm:text-xl lg:text-2xl tracking-[0.3em] sm:tracking-[0.5em] leading-tight">
                        TODAY
                    </h3>
                </div>
            </div>
            <div className="flex flex-row gap-8 w-full p-4 overflow-x-auto duration-150 overflow-x">
                {top10.map((movie: Movie, index: number) => (
                    <div key={movie.id} className="relative flex items-end gap-4 ">
                        <p className="font-bold text-red-600 text-8xl sm:text-9xl text-outline hover:scale-105 duration-200">
                            <span className="letter-shadow-r">{index + 1}</span>
                        </p>

                        <Card
                            title={movie.title}
                            poster={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                            id={movie.id.toString()}
                            mediaType="movie"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}