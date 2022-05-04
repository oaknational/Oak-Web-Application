import { createContext } from "react";

export type UserId = string;

export type OakUser = {
  email: string;
  id: UserId;
};

export type OakAuth = {
  user: OakUser | null;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  signInWithEmailCallback: () => Promise<void>;
};

const authContext = createContext<OakAuth | null>(null);

export default authContext;
