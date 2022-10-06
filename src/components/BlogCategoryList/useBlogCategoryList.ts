import { useId } from "react-aria";

const useBlogCategoryList = () => {
  const labelId = useId();
  return {
    labelId,
  };
};

export default useBlogCategoryList;
