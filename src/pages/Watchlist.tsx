import { Navbar } from "../components/Navbar"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Trash2, Bookmark, Play, Film, Tv, Calendar, Star } from "lucide-react"
import { useAuth } from "../lib/hooks.ts"
import { getWatchlist, deleteFromWatchlist, clearWatchlist } from "../lib/db.ts"
import api from "../api.ts"

type WatchlistItem = {
    id: number
    video_id: number
    media_type: string
    user_id: string
    added_at: string
}

type MediaDetails = {
    id: number
    title?: string
    name?: string
    poster_path: string
    backdrop_path: string
    vote_average: number
    release_date?: string
    first_air_date?: string
    overview: string
}

type WatchlistWithDetails = WatchlistItem & {
    details: MediaDetails | null
}

export default function Watchlist() {
    const [watchlist, setWatchlist] = useState<WatchlistWithDetails[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<number | null>(null)
    const [clearing, setClearing] = useState(false)

    const { user } = useAuth()

    useEffect(() => {
        if (!user) return

        fetchWatchlist()
    }, [user])

    async function fetchWatchlist() {
        setLoading(true)
        try {
            const watchlistData = await getWatchlist(user!.id)

            if (!watchlistData || watchlistData.length === 0) {
                setWatchlist([])
                setLoading(false)
                return
            }

            const watchlistWithDetails = await Promise.all(
                watchlistData.map(async (item: WatchlistItem) => {
                    try {
                        const res = await api.get(`/${item.media_type}/${item.video_id}`)
                        return { ...item, details: res.data }
                    } catch (err) {
                        console.error(`Failed to fetch details for ${item.video_id}`, err)
                        return { ...item, details: null }
                    }
                })
            )

            setWatchlist(watchlistWithDetails.filter(item => item.details !== null))
        } catch (err) {
            console.error("Error fetching watchlist:", err)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(watchlistId: number) {
        setDeleting(watchlistId)
        try {
            await deleteFromWatchlist(watchlistId)
            setWatchlist(prev => prev.filter(item => item.id !== watchlistId))
        } catch (err) {
            console.error("Error deleting watchlist item:", err)
        } finally {
            setDeleting(null)
        }
    }

    async function handleClearAll() {
        if (!user) return
        if (!confirm("Are you sure you want to clear your entire watchlist?")) return

        setClearing(true)
        try {
            await clearWatchlist(user.id)
            setWatchlist([])
        } catch (err) {
            console.error("Error clearing watchlist:", err)
        } finally {
            setClearing(false)
        }
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    function getTitle(details: MediaDetails) {
        return details.title || details.name || "Unknown"
    }

    function getReleaseDate(details: MediaDetails) {
        return details.release_date || details.first_air_date || "N/A"
    }

    if (!user) {
        return (
            <div className="bg-[#121212] min-h-screen text-white">
                <div className="flex flex-col items-center justify-center w-full gap-4 pt-8">
                    <Navbar />
                </div>
                <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                    <Bookmark className="w-16 h-16 text-gray-600" />
                    <h2 className="text-2xl font-bold text-gray-400">Please sign in to view your watchlist</h2>
                    <Link
                        to="/login"
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#121212] min-h-screen text-white pb-20">
            {/* Header Section */}
            <div
                className="relative h-[40vh] w-full bg-linear-to-b from-red-900/30 to-[#121212]"
            >
                <div className="absolute inset-0 bg-linear-to-t from-[#121212] via-black/50 to-transparent" />
                <div className="flex flex-col items-center justify-center w-full gap-4 pt-8">
                    <Navbar />
                </div>

                {/* Title Section */}
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-4 mb-4">
                            <Bookmark className="w-10 h-10 text-red-500" />
                            <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-md">
                                My Watchlist
                            </h1>
                        </div>
                        <p className="text-gray-400 text-lg">
                            {watchlist.length} {watchlist.length === 1 ? "title" : "titles"} saved to watch later
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-6 mt-8">
                {/* Clear All Button */}
                {watchlist.length > 0 && (
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={handleClearAll}
                            disabled={clearing}
                            className="flex items-center gap-2 bg-gray-800 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Trash2 className="w-4 h-4" />
                            {clearing ? "Clearing..." : "Clear Watchlist"}
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center h-[40vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && watchlist.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[40vh] gap-4">
                        <Bookmark className="w-20 h-20 text-gray-700" />
                        <h2 className="text-2xl font-bold text-gray-500">Your watchlist is empty</h2>
                        <p className="text-gray-600 text-center max-w-md">
                            Add movies and TV shows to your watchlist to keep track of what you want to watch
                        </p>
                        <Link
                            to="/"
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                            Browse Content
                        </Link>
                    </div>
                )}

                {/* Watchlist Grid */}
                {!loading && watchlist.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {watchlist.map((item) => (
                            <div
                                key={item.id}
                                className="bg-[#18181b] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition group"
                            >
                                {/* Backdrop Image */}
                                <div className="relative h-40 overflow-hidden">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w780${item.details?.backdrop_path}`}
                                        alt={getTitle(item.details!)}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] to-transparent" />

                                    {/* Media Type Badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                                            {item.media_type === "movie" ? (
                                                <>
                                                    <Film className="w-3 h-3" /> Movie
                                                </>
                                            ) : (
                                                <>
                                                    <Tv className="w-3 h-3" /> TV Show
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    {/* Play Button Overlay */}
                                    <Link
                                        to={`/video/${item.video_id}/${item.media_type}`}
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <div className="bg-red-600 hover:bg-red-700 p-4 rounded-full transition">
                                            <Play className="w-6 h-6 fill-white text-white" />
                                        </div>
                                    </Link>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <Link to={`/video/${item.video_id}/${item.media_type}`}>
                                        <h3 className="text-lg font-bold mb-2 hover:text-red-500 transition line-clamp-1">
                                            {getTitle(item.details!)}
                                        </h3>
                                    </Link>

                                    {/* Meta Info */}
                                    <div className="flex flex-wrap gap-2 mb-3 text-xs">
                                        <span className="flex items-center gap-1 text-yellow-400">
                                            <Star className="w-3 h-3 fill-yellow-400" />
                                            {Math.round(item.details!.vote_average * 10) / 10}
                                        </span>
                                        <span className="flex items-center gap-1 text-gray-400">
                                            <Calendar className="w-3 h-3" />
                                            {getReleaseDate(item.details!).split("-")[0]}
                                        </span>
                                    </div>

                                    {/* Overview */}
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                        {item.details?.overview || "No description available."}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Bookmark className="w-3 h-3" />
                                            Added {formatDate(item.added_at)}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            disabled={deleting === item.id}
                                            className="text-gray-500 hover:text-red-500 transition disabled:opacity-50"
                                            title="Remove from watchlist"
                                        >
                                            {deleting === item.id ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-red-500"></div>
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}