import { createContext } from "react";

export type SearchTerm = {
  text: string;
  setText?: (text: string) => void;
};

export const SearchContext = createContext<SearchTerm>({ text: "" });
