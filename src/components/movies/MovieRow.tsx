import Card from "./Card.tsx";
import axios from "axios";
import {useEffect, useState} from "react";

type Movie = {
    id: string;
    title: string;
    poster: string;
    media_type: "movie";
};

export default function MovieRow({
                                     title,
                                     theme,
                                     time,
                                 }: {
    title: string;
    theme: string;
    time: string;
}) {
    const headersTMDB = {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
        "Content-Type": "application/json",
    };

    const [movies, setMovies] = useState<any[]>([]);

    let url = "";
    if (theme === "trending") {
        url = `https://api.themoviedb.org/3/trending/movie/${time}`;
    } else {
        url = `https://api.themoviedb.org/3/movie/${theme}`;
    }

    useEffect(() => {
        async function fetchTrending() {
            try {
                const response = await axios.get(url, {headers: headersTMDB});
                setMovies(response.data.results);
            } catch (error) {
                console.error(error);
            }
        }

        fetchTrending();
    }, [url]);

    const movieInfo: Movie[] = movies.map((movie) => ({
        id: movie.id,
        title: movie.title,
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        media_type: "movie",
    }));

    return (
        <div className="flex flex-col gap-8 w-full ml-20 pr-20 mt-20">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-10 bg-red-600 rounded-full"></span>
                {title}
            </h2>


            <div className="flex flex-row gap-8 w-full p-4 overflow-x-auto duration-150 overflow-x">
                {movieInfo.map((movie) => (
                    <Card
                        key={movie.id}
                        id={movie.id}
                        title={movie.title}
                        poster={movie.poster}
                        mediaType={movie.media_type}
                    />
                ))}
            </div>
        </div>
    );
}
