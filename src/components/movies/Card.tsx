import { useState } from "react"
import { Link } from "react-router-dom"
import { Play } from "lucide-react"

type CardProps = {
    title: string
    poster: string
    id: string
    mediaType: string
    rating?: number
    year?: string
    overview?: string
    backdrop?: string
}

export default function Card({
    title,
    poster,
    id,
    mediaType,
    year,
    overview
}: CardProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isHovered, setIsHovered] = useState(false)


    return (
        <Link
            to={`/video/${id}/${mediaType}/`}
            className="group relative shrink-0 w-32 sm:w-40 md:w-44 lg:w-48 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Card Container */}
            <div className="relative h-48 sm:h-60 md:h-64 lg:h-72 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-2">

                {/* Skeleton Loader */}
                {!isLoaded && (
                    <div className="absolute inset-0 bg-gray-800 animate-pulse">
                        <div className="absolute inset-0 bg-linear-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer" />
                    </div>
                )}

                {/* Poster Image */}
                <img
                    src={poster}
                    alt={title}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                        isLoaded ? "opacity-100" : "opacity-0"
                    } ${isHovered ? "scale-110" : "scale-100"}`}
                    onLoad={() => setIsLoaded(true)}
                />

                {/* Gradient Overlay - Always visible */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />



                {/* Play Button - Center */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-red-600 hover:bg-red-700 p-4 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg shadow-red-500/50">
                        <Play className="w-6 h-6 fill-white text-white" />
                    </div>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {/* Year */}
                    {year && (
                        <span className="text-gray-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {year.split("-")[0]}
                        </span>
                    )}

                    {/* Title */}
                    <h3 className="text-white text-sm font-bold leading-tight line-clamp-2 drop-shadow-lg">
                        {title}
                    </h3>

                    {/* Overview - Shows on hover */}
                    {overview && (
                        <p className="text-gray-300 text-xs mt-1 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                            {overview}
                        </p>
                    )}
                </div>

                {/* Border Glow Effect */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-red-500/50 transition-colors duration-300" />
            </div>
        </Link>
    )
}