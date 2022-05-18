import { LS_KEY_BOOKMARKS } from "../../config/localStorageKeys";
import useLocalStorage from "../../hooks/useLocalStorage";

import { Bookmark } from "./bookmarksContext";

// Shallow compare function
const areBookmarksEqual = (old: Bookmark[], _new: Bookmark[]) => {
  return (
    old.length === _new.length &&
    old.reduce<boolean>(
      (accum, curr, i) => accum && curr.lesson.id === _new[i]?.lesson.id,
      true
    )
  );
};
const useBookmarksCache = () => {
  return useLocalStorage<Bookmark[]>(LS_KEY_BOOKMARKS, [], areBookmarksEqual);
};

export default useBookmarksCache;
