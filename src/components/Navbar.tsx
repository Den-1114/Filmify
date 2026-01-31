import {useState} from "react";
import axios from "axios";

// Define a type for the movie to avoid using 'any'
interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    name: string;
    media_type: string;
}

export default function Navbar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // NOTE: In production, move this key to an environment variable (.env)
    const headersTMDB = {
        "Authorization": `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
        "Content-Type": "application/json",
    };
    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setResults([]); // Clear previous results while loading

        try {
            const response = await axios.get(
                "https://api.themoviedb.org/3/search/multi",
                {
                    headers: headersTMDB,
                    params: {query},
                }
            );

            const filteredResults = response.data.results.filter(
                (item: Movie) => item.media_type === "movie" || item.media_type === "tv"
            );

            setResults(filteredResults);
            console.log(response.data.results);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResultClick = (id: number, mediaType: string) => {
        window.location.href = `/video/${id}/${mediaType}`;
        setQuery("");
        setResults([]);
        setIsFocused(false);
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
    };

    const showDropdown = (results.length > 0 || isLoading) && isFocused;

    return (
        // Main Navbar Container
        <nav
            className="fixed top-0 w-full z-50 flex flex-row items-center justify-between px-6 py-4 ">

            {/* Logo Area */}
            <button
                onClick={() => window.location.href = '/'}
                className="p-2 bg-zinc-800 hover:bg-red-600 rounded-full text-white transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
            </button>

            {/* Overlay to close dropdown when clicking outside */}
            {showDropdown && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
                    onClick={() => setIsFocused(false)}
                />
            )}

            {/* Search Container (Centered & constrained width) */}
            <div className="flex-1 max-w-2xl mx-4 relative z-50">
                <form onSubmit={handleSearch} className="relative group">
                    {/* Search Icon */}
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                            className="w-5 h-5 text-gray-400 group-focus-within:text-red-600 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        className="w-full bg-zinc-900/80 backdrop-blur-md text-white border border-white/10 pl-11 pr-24 py-3 rounded-full
                       focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none placeholder:text-zinc-500
                       transition-all duration-300 shadow-lg"
                    />

                    {/* Right Side Actions inside Input */}
                    <div className="absolute inset-y-0 right-1.5 flex items-center gap-2">
                        {/* Clear Button (X) */}
                        {query && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}

                        {/* Search Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-red-600 text-white px-5 py-1.5 rounded-full text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
                        >
                            {isLoading ? "..." : "Search"}
                        </button>
                    </div>
                </form>

                {/* Results Dropdown */}
                {showDropdown && (
                    <div
                        className="absolute top-full mt-2 w-full bg-[#18181b] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">

                        {/* Loading Indicator inside dropdown */}
                        {isLoading && (
                            <div className="p-4 text-center text-gray-400 text-sm">
                                Searching TMDb...
                            </div>
                        )}

                        {/* No Results Found */}
                        {!isLoading && results.length === 0 && query.length > 0 && (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No movies found for "{query}"
                            </div>
                        )}

                        {/* Results List */}
                        {!isLoading && results.length > 0 && (
                            <div className="max-h-[60vh] overflow-y-auto">
                                {results.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="flex items-center gap-4 p-3 hover:bg-white/5 transition cursor-pointer border-b border-white/5 last:border-none group/item"
                                        onClick={() => handleResultClick(movie.id, movie.media_type)}
                                    >
                                        {/* Poster */}
                                        <div className="w-10 h-14 shrink-0 bg-zinc-800 rounded overflow-hidden">
                                            {movie.poster_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                                    alt={movie.title}
                                                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div
                                                    className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                                    No IMG
                                                </div>
                                            )}
                                        </div>

                                        {/* Text Info */}
                                        <div className="flex flex-col text-left overflow-hidden">
                                            <span
                                                className="text-white text-sm font-medium truncate group-hover/item:text-red-500 transition-colors">
                                                {movie.title}{movie.name}
                                            </span>
                                            <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                                               {movie.release_date ? movie.release_date.split("-")[0] : "TBA"}
                                            </span>
                                                <span
                                                    className="text-xs text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                                               {
                                                   movie.media_type === "tv"
                                                       ? "Series"
                                                       : movie.media_type === "movie"
                                                           ? "Movie"
                                                           : movie.media_type === "person"
                                                               ? "Person"
                                                               : "Unknown"
                                               }

                                            </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Spacer div to balance the flex layout (so search stays centered) */}
            <div className="hidden md:block w-12"/>
        </nav>
    );
}