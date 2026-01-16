import {useParams} from "react-router-dom";
import {useSearchParams} from "react-router-dom";

import {useContext} from "react";
import {GlobalContext} from "../GlobalContext.ts";

export default function Watch() {
    const [searchParams] = useSearchParams();
    const {id} = useParams<{ id: string }>();
    const serverId = searchParams.get("serverId");
    const context = useContext(GlobalContext);
    if (!context) throw new Error("GlobalContext must be used inside GlobalProvider");
    const {servers} = context;
    const url = servers[Number(serverId)]?.url;

    console.log(url);

    const handleBack = () => {
        window.location.href = `/movie/${id}`;
    }

    return (
        <div className="w-screen h-screen bg-black relative flex flex-col">
            <div
                className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-start pointer-events-none">
                <button
                    className="pointer-events-auto bg-black/50 hover:bg-black/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 transition flex items-center gap-2"

                    onClick={handleBack}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Movie
                </button>
            </div>

            <iframe
                className="w-full h-full border-none"
                src={`${url}${id}`}
                title="Movie Player"
                allowFullScreen
                scrolling="no"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
        </div>
    )
}
