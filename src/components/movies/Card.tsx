export default function Card({ title, poster, id, mediaType }: { title: string; poster: string; id: string, mediaType: string }) {
    return (
        <div
            className="hover:scale-[99%] duration-150 max-w-44 cursor-pointer"
            onClick={() => {
                window.location.href = `/video/${id}/${mediaType}/`;
            }}
        >
            <div className="w-32 sm:w-40 md:w-44 lg:w-48 h-48 sm:h-60 md:h-64 lg:h-72 rounded-md overflow-hidden">
                <img src={poster} className="w-full h-full object-cover" alt="IMAGE" />
            </div>

            <div className="mt-2 flex flex-col w-full">
                <h1 className="text-xl font-bold wrap-break-words whitespace-normal">
                    {title}
                </h1>
            </div>
        </div>
    );
}
