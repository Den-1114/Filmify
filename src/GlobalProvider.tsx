import type { ReactNode } from "react";
import { GlobalContext } from "./GlobalContext";
import type {Server} from "./GlobalContext";

type GlobalProviderProps = {
  children: ReactNode;
};

export function GlobalProvider({ children }: GlobalProviderProps) {
  const servers: Server[] = [
    { name: "Videasy", id: "0", url: "https://player.videasy.net/" },
    { name: "Vidking", id: "1", url: "https://www.vidking.net/embed/" },
    { name: "Vidsrc", id: "1", url: "https://vidsrc.cc/v2/embed/" },
    { name: "Vidlink", id: "2", url: "https://vidlink.pro/" },
    { name: "Vidfast", id: "3", url: "https://vidfast.pro/" }
  ];

  

  return (
    <GlobalContext.Provider value={{ servers }}>
      {children}
    </GlobalContext.Provider>
  );
}
