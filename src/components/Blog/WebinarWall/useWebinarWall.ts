import { LS_KEY_WEBINAR_WALL_INTERACTED } from "../../../config/localStorageKeys";
import useLocalStorage from "../../../hooks/useLocalStorage";

const useWebinarWall = () => {
  const [hasInteracted, setHasInteracted] = useLocalStorage(
    LS_KEY_WEBINAR_WALL_INTERACTED,
    false
  );

  return {
    onClick: () => setHasInteracted(true),
    shouldShowWall: !hasInteracted,
  };
};

export default useWebinarWall;
