import { useContext } from "react";

import { blogContext } from "./BlogProvider";

const useBlogContext = () => {
  const value = useContext(blogContext);

  if (!value) {
    throw new Error(
      "useBlogContext() called outside of blog categories provider"
    );
  }

  return value;
};

export default useBlogContext;
