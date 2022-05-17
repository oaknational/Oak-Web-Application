# React Context

Documentation for a consistent standard for writing and using react context.

## File structure

Each piece of context should have its own folder in `src/context`. Within that there should be separate files, each with their own default export, as follows:

```bash
src/
  - context/
    - Auth/
      - authContext.tsx
      - AuthProvider.tsx
      - index.test.tsx
      - index.tsx
      - useAccessToken.tsx
      - useAuth.tsx
      - useUser.tsx
    - Bookmarks/
      - bookmarksContext.tsx # const bookmarksContext = createContext<BookmarksContext | null>(null);
      - BookmarksProvider.tsx # provides state and methods for this context
      - index.test.tsx # tests for this context
      - index.tsx # file for exports (so we can import ... from "context/Bookmarks")
      - useBookmarks.ts # hook to get state and methods
      - useBookmarksCache.ts
      - useToggleBookmark.ts # specific hook with own logic
    - ...
```
