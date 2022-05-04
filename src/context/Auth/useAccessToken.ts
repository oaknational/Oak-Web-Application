import { LS_KEY_ACCESS_TOKEN } from "../../config/localStorageKeys";
import useLocalStorage from "../../hooks/useLocalStorage";

const useAccessToken = () => {
  return useLocalStorage<string | null>(LS_KEY_ACCESS_TOKEN, null);
};

export default useAccessToken;
