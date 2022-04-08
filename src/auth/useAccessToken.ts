import useLocalStorage from "../hooks/useLocalStorage";

const useAccessToken = () => {
  return useLocalStorage<string | null>("accessToken", null);
};

export default useAccessToken;
