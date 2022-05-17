import { useContext } from "react";

import authContext from "./authContext";

const useAuth = () => {
  const auth = useContext(authContext);
  if (!auth) {
    throw new Error("useAuth called outside of AuthProvider");
  }
  return auth;
};

export default useAuth;
