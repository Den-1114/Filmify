import Card from "./Card.tsx";
import {useEffect, useState} from "react";
import api from "../../api.ts";

type Movie = {
    id: string;
    title: string;
    poster: string;
    media_type: "movie";
};

type MovieRowProps = {
    title: string;
    theme: string;
    time: string;
}

export default function MovieRow({title, theme, time}: MovieRowProps) {
    const [movies, setMovies] = useState<any[]>([]);

    useEffect(() => {
        api.get(`/rows/${theme}/${time}`)
            .then(res => setMovies(res.data.results))
            .catch(err => console.log(err));

    }, []);

    const movieInfo: Movie[] = movies.map((movie) => ({
        id: movie.id,
        title: movie.title,
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        media_type: "movie",
    }));

    return (
        <div className="flex flex-col gap-8 w-full ml-20 pr-20 mt-20">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 ">
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
