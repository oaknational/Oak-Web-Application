import { FC } from "react";

import { BookmarksContext, bookmarksContext } from "../../context/Bookmarks";

import { asyncNoop } from "./noop";

export type MockedBookmarksProviderProps = {
  value?: Partial<BookmarksContext>;
};
const MockedBookmarksProvider: FC<MockedBookmarksProviderProps> = ({
  children,
  value: propsValue,
}) => {
  const value = {
    bookmarks: [],
    loading: false,
    error: null,
    addBookmark: asyncNoop,
    removeBookmark: asyncNoop,
    refetchBookmarks: asyncNoop,
    isBookmarked: () => false,
    ...propsValue,
  };
  return (
    <bookmarksContext.Provider value={value}>
      {children}
    </bookmarksContext.Provider>
  );
};

export default MockedBookmarksProvider;
