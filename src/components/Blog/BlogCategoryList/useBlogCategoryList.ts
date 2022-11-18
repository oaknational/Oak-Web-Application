import { useId } from "react";

const useBlogCategoryList = () => {
  const labelId = useId();
  return {
    labelId,
  };
};

export default useBlogCategoryList;
