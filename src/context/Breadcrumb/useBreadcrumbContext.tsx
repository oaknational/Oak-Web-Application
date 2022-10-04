import { useContext } from "react";

import { breadcrumbContext } from "./BreadcrumbProvider";

const useBreadcrumbContext = () => {
  const breadcrumbValue = useContext(breadcrumbContext);

  if (!breadcrumbValue) {
    throw new Error(
      "useBreadcrumbContext() called outside of breadcrumb provider"
    );
  }

  return breadcrumbValue;
};

export default useBreadcrumbContext;
