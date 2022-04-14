import { createContext } from "react";

export enum KeyStages {
  foundation = "foundation",
  keystage1 = "1",
  keystage2 = "2",
  keystage3 = "3",
  keystage4 = "4",
}

export type SearchTerm = {
  text: string;
  setText: (text: string) => void;
  keystage: string;
  setKeystage: (keystage: string) => void;
};

export const SearchContext = createContext<SearchTerm>({
  text: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setText: () => {},
  keystage: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setKeystage: () => {},
});
