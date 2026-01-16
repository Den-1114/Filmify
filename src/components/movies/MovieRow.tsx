import Card from "./Card.tsx";
import axios from "axios";
import {useEffect, useState} from "react";

export default function MovieRow({title, theme, time}: { title: string, theme: string, time: string }) {
    const headersTMDB = {
        "Authorization": `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
        "Content-Type": "application/json",
    };

    const [Movies, setMovies] = useState([]);
    let url = "";
    if (theme === "trending") {
        url = `https://api.themoviedb.org/3/trending/movie/${time}`;
    } else {
        url = `https://api.themoviedb.org/3/movie/${theme}`;
    }
    useEffect(() => {
        async function fetchTrending() {
            try {
                const response = await axios.get(
                    url,
                    {headers: headersTMDB}
                );
                setMovies(response.data.results); // TMDB returns results in `results`
            } catch (error) {
                console.error(error);
            }
        }

        fetchTrending();
    }, []);

    const movieInfo = Movies.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        backdrop: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    }));


    return (
        <div className="flex flex-col gap-8 w-full ml-20 pr-20 mt-20">
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="flex flex-row gap-8 w-full p-4 overflow-x-auto duration-150 overflow-x">
                {movieInfo.map((movie: any) => (
                    <Card key={movie.id} id={movie.id} title={movie.title} poster={movie.poster} />
                ))}
            </div>
        </div>
    )
}
