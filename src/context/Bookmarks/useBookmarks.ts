import { useContext } from "react";

import bookmarksContext from "./bookmarksContext";

const useBookmarks = () => {
  const bookmarksContextValue = useContext(bookmarksContext);
  if (!bookmarksContextValue) {
    throw new Error("useBookmarks called outside of BookmarksProvider");
  }
  return bookmarksContextValue;
};

export default useBookmarks;
