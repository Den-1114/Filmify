import Card from "./Card.tsx";

type Movie = {
    id: number
    name: string
    title: string
    overview: string
    backdrop_path: string
    poster_path: string
    vote_average: number
    release_date: string
    number_of_episodes: number
    number_of_seasons: number
    media_type: string
}

type MovieRowProps = {
    title: string;
    mediaType: string;
    Cards: Movie[];
};

export default function MovieRowBasic({title, mediaType, Cards}: MovieRowProps) {
    console.log(Cards);

    return (
        <div className="flex flex-col gap-8 w-full ml-10 pr-20 mt-20">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-10 bg-red-600 rounded-full"></span>
                {title}
            </h2>
            <div className="flex flex-col gap-8 w-full justify-center items-center">
                <div className="flex flex-row flex-wrap gap-8 p-4">
                    {Cards.map((card) => (
                        <Card
                            key={card.id}
                            title={mediaType === "movie" ? card.title : card.name}
                            poster={`https://image.tmdb.org/t/p/original${card.poster_path}`}
                            mediaType={mediaType}
                            id={String(card.id)}
                        />
                    ))}
                </div>
            </div>
        </div>

    );
}
