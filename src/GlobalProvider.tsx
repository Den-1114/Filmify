import type { ReactNode } from "react";
import { GlobalContext } from "./GlobalContext";
import type {Server} from "./GlobalContext";

type GlobalProviderProps = {
  children: ReactNode;
};

export function GlobalProvider({ children }: GlobalProviderProps) {
  const servers: Server[] = [
    { name: "Server 1", id: "0", url: "https://player.videasy.net/" },
    { name: "Server 2", id: "1", url: "https://vidsrc.cc/v2/embed/" },
    { name: "Server 3", id: "2", url: "https://vidlink.pro/" },
    { name: "Server 4", id: "3", url: "https://vidfast.pro/" }
  ];

  return (
    <GlobalContext.Provider value={{ servers }}>
      {children}
    </GlobalContext.Provider>
  );
}
