import { useId } from "react";

const usePostCategoryList = () => {
  const labelId = useId();
  return {
    labelId,
  };
};

export default usePostCategoryList;
