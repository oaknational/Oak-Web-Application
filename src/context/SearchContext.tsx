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
  keyStages: Set<string>;
  setKeyStages: (keystage: Set<string>) => void;
};

export const searchContext = createContext<SearchTerm>({
  text: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setText: () => {},
  keyStages: new Set(),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setKeyStages: () => {},
});
