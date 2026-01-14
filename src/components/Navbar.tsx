import {useState} from "react";
import axios from "axios";

export default function Navbar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);

    const headersTMDB = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2NjODEzMDk5NWExOGM3ZGJjYmRjOTUxMzViYjY4NSIsIm5iZiI6MTczNDM1NjYzNC42MTEsInN1YiI6IjY3NjAyZTlhZGY4MjljNDBiY2Q4ZGUwNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.y-sNKWYMQQLdIPO91aCqRMDR3M2E0WsvbI7SViHM2pQ",
        "Content-Type": "text/plain",
    }

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query.trim()) return;

        try {
            const response = await axios.get(
                "https://api.themoviedb.org/3/search/movie",
                {
                    headers: headersTMDB,
                    params: {query},
                }
            );
            setResults(response.data.results);
        } catch (err) {
            console.error(err);
        }
    };

    const handleResultClick = (id: number) => {
        window.location.href = `/movie/${id}`;
        setQuery("");
        setResults([]);
    };

    return (
        <div className="relative flex flex-col items-center w-full z-50">

            {/* Invisible overlay to close dropdown */}
            {results.length > 0 && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setResults([])}
                />
            )}

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex relative z-50">
                {window.location.pathname !== "/" && (
                    <button
                        type="button"
                        className="bg-red-700 text-white px-6 rounded-l-full font-semibold hover:bg-red-800 transition"
                        onClick={() => (window.location.href = "/")}
                    >
                        Home
                    </button>
                )}

                <input
                    type="text"
                    placeholder="Search movies..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={`w-64 md:w-96 bg-black/40 backdrop-blur-md text-white border border-white/20 px-6 py-2.5 focus:ring-2 focus:ring-red-600 outline-none placeholder:text-gray-400 duration-150
            ${window.location.pathname === "/" ? "rounded-l-full" : "rounded-l-none"}`}
                />

                <button
                    type="submit"
                    className="bg-red-600 text-white px-6 rounded-r-full font-semibold hover:bg-red-700 transition"
                >
                    Search
                </button>
            </form>

            {/* Results Dropdown */}
            {results.length > 0 && (
                <div
                    className="absolute top-14 w-full md:w-96 bg-[#18181b] border border-gray-700 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50">

                    {results.map((movie) => (
                        <div
                            key={movie.id}
                            className="flex items-center gap-3 p-3 hover:bg-gray-800 transition cursor-pointer border-b border-gray-800 last:border-none"
                            onClick={() => handleResultClick(movie.id)}
                        >
                            {movie.poster_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-10 h-14 object-cover rounded"
                                />
                            ) : (
                                <div
                                    className="w-10 h-14 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
                                    ?
                                </div>
                            )}

                            <div className="flex flex-col text-left">
                                <span className="text-white text-sm font-medium line-clamp-1">
                                    {movie.title}
                                </span>
                                <span className="text-gray-400 text-xs">
                                    {movie.release_date?.split("-")[0] || "N/A"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
