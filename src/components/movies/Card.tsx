export default function Card({title, poster, id, mediaType}: {
    title: string;
    poster: string;
    id: string,
    mediaType: string
}) {
    return (
        <div
            className="group relative shrink-0 hover:scale-105 duration-200 w-32 sm:w-40 md:w-44 lg:w-48 h-48 sm:h-60 md:h-64 lg:h-72 cursor-pointer rounded-lg overflow-hidden shadow-md"
            onClick={() => {
                window.location.href = `/video/${id}/${mediaType}/`;
            }}
        >
            {/* Poster Image */}
            <img
                src={poster}
                className="w-full h-full object-cover"
                alt={title}
            />

            {/* Title Overlay*/}
            <div
                className="absolute bottom-0 w-full p-3 bg-linear-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                <h1 className="text-white text-sm font-bold leading-tight drop-shadow-md">
                    {title}
                </h1>
            </div>
        </div>
    );
}