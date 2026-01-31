import {User} from "lucide-react";

export default function CastSection({cast, crew}: { cast: any[]; crew: any[] }) {
    if (!cast.length && !crew.length) return null;

    console.log(cast.length)

    console.log(cast);

    return (
        <div className="w-full space-y-10 ml-10 pr-20 mt-20">
            {/* Cast Section */}
            {cast.length > 0 && (
                <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-1 h-10 bg-red-600 rounded-full"></span>
                        Top Cast
                    </h2>

                    {/* Scroll Container with scrollbar hiding logic */}
                    <div
                        className="flex overflow-x-auto pt-6 pb-6 gap-6 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                        {cast.slice(0, 15).map((person) => (
                            <div
                                key={person.id}
                                className="flex-none w-28 sm:w-32 snap-start group text-center"
                                onClick={() => {
                                    window.open(`https://www.themoviedb.org/person/${person.id}`, '_blank')
                                }}
                            >
                                {/* Circular image container with red border */}
                                <div
                                    className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-3 rounded-full overflow-hidden bg-[#18181b] shadow-lg ring-3 ring-red-600 transition-all duration-300 group-hover:ring-red-500 group-hover:ring-4 group-hover:shadow-red-600/30 group-hover:shadow-xl">
                                    {person.profile_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                                            alt={person.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div
                                            className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                                            <User size={32}/>
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-semibold text-sm truncate text-gray-100" title={person.name}>
                                    {person.name}
                                </h3>
                                <p className="text-xs text-gray-400 truncate" title={person.character}>
                                    {person.character}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Crew Section - Grid Layout */}
            {crew.length > 0 && (
                <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-1 h-10 bg-red-600 rounded-full"></span>
                        Featured Crew
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-6">
                        {crew.slice(0, 10).map((person) => (
                            <div key={`${person.id}-${person.job}`}
                                 className="bg-[#18181b] p-3 rounded-lg border border-gray-800">
                                <p className="font-bold text-sm text-gray-200 truncate">{person.name}</p>
                                <p className="text-xs text-gray-500">{person.job}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};