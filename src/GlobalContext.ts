import { createContext } from "react";

export type Server = {
  name: string;
  id: string;
  url: string;
};

type GlobalContextType = {
  servers: Server[];
};

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);
