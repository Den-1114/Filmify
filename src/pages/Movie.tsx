import Navbar from "../components/Navbar"
import {useParams, Link} from "react-router-dom"
import {useEffect, useState, useRef, useContext} from "react"
import axios from "axios"
import {GlobalContext} from "../GlobalContext.ts"

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
}

type Episode = {
    id: number
    episode_number: number
    name: string
}

export default function Movie() {
    const context = useContext(GlobalContext)
    if (!context) throw new Error("GlobalContext must be used inside GlobalProvider")
    const {servers} = context

    const {id, mediaType} = useParams<{ id: string; mediaType: string }>()

    const headersTMDB = {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
        "Content-Type": "application/json",
    }

    const [movie, setMovie] = useState<Movie | null>(null)
    const [episodes, setEpisodes] = useState<Episode[]>([])

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isSeasonOpen, setIsSeasonOpen] = useState(false)
    const [isEpisodeOpen, setIsEpisodeOpen] = useState(false)

    const [selectedSeason, setSelectedSeason] = useState(1)
    const [selectedEpisode, setSelectedEpisode] = useState(1)

    const dropdownRef = useRef<HTMLDivElement>(null)

    // Fetch movie / show info
    useEffect(() => {
        async function fetchMovie() {
            const res = await axios.get(
                `https://api.themoviedb.org/3/${mediaType}/${id}`,
                {headers: headersTMDB}
            )
            setMovie(res.data)
        }

        fetchMovie()
    }, [id, mediaType])

    // Fetch episodes when season changes
    useEffect(() => {
        if (mediaType !== "tv") return

        async function fetchEpisodes() {
            const res = await axios.get(
                `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}`,
                {headers: headersTMDB}
            )
            setEpisodes(res.data.episodes)
        }

        fetchEpisodes()
    }, [id, selectedSeason, mediaType])

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    if (!movie) {
        return (
            <div className="bg-[#121212] min-h-screen text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        )
    }

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
              {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
            </span>
                    </div>

                    <p className="text-gray-300 text-lg mb-8 max-w-3xl leading-relaxed overflow-hidden"
                       style={{
                           display: '-webkit-box',
                           WebkitLineClamp: 1, // roughly 60px / line height
                           WebkitBoxOrient: 'vertical',
                       }}>
                        {movie.overview}
                    </p>

                    <div className="flex flex-row gap-4 relative" ref={dropdownRef}>

                        {/* Watch Dropdown */}
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 bg-red-600 px-8 py-3.5 rounded-lg font-bold text-white hover:bg-red-700 transition"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                            Watch Now
                            <svg className={`w - 4 h-4 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div
                                className="absolute top-full mt-2 left-0 w-56 bg-[#18181b] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-40 overflow-y-auto">
                                {servers.map(server => {

                                    if (mediaType !== "tv") {
                                        return (<Link
                                                key={server.id}
                                                to={`/watch/${id}/${mediaType}/?serverId=${server.id}`}
                                                className="px-4 py-3 hover:bg-gray-800 text-gray-200 hover:text-white transition"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                {server.name}
                                            </Link>
                                        )
                                    } else if (mediaType === "tv") {
                                        return (
                                            <Link
                                                key={server.id}
                                                to={`/watch/${id}/${mediaType}/?serverId=${server.id}&season=${selectedSeason}&episode=${selectedEpisode}`}
                                                className="px-4 py-3 hover:bg-gray-800 text-gray-200 hover:text-white transition"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                {server.name}
                                            </Link>
                                        )
                                    }
                                })}
                            </div>
                        )}

                        {/* Season Dropdown */}
                        {mediaType === "tv" && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsSeasonOpen(!isSeasonOpen)}
                                    className="flex items-center gap-2 bg-red-600 px-8 py-3.5 rounded-lg font-bold text-white hover:bg-red-700 transition"
                                >
                                    Season {selectedSeason}
                                    <svg
                                        className={`w - 4 h-4 ml-2 transition-transform ${isSeasonOpen ? 'rotate-180' : ''}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </button>
                                {isSeasonOpen && (
                                    <div
                                        className="absolute mt-2 w-40 bg-[#18181b] border border-gray-700 rounded-xl shadow-lg z-50 flex flex-col max-h-40 overflow-y-auto">
                                        {Array.from({length: movie.number_of_seasons}, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setSelectedSeason(i + 1)
                                                    setSelectedEpisode(1)
                                                    setIsSeasonOpen(false)
                                                }}
                                                className="px-4 py-2 text-left hover:bg-gray-800"
                                            >
                                                Season {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Episode Dropdown */}
                        {mediaType === "tv" && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsEpisodeOpen(!isEpisodeOpen)}
                                    className="flex items-center gap-2 bg-red-600 px-8 py-3.5 rounded-lg font-bold text-white hover:bg-red-700 transition"
                                >
                                    Episode {selectedEpisode}
                                    <svg
                                        className={`w - 4 h-4 ml-2 transition-transform ${isEpisodeOpen ? 'rotate-180' : ''}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </button>

                                {isEpisodeOpen && (
                                    <div
                                        className="absolute mt-2 w-40 bg-[#18181b] border border-gray-700 rounded-xl shadow-lg z-50 flex flex-col max-h-40 overflow-y-auto">
                                        {episodes.map(ep => (
                                            <button
                                                key={ep.id}
                                                onClick={() => {
                                                    setSelectedEpisode(ep.episode_number)
                                                    setIsEpisodeOpen(false)
                                                }}
                                                className="px-4 py-2 text-left hover:bg-gray-800"
                                            >
                                                Episode {ep.episode_number}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
