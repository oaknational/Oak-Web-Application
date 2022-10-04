import { createContext, FC, useCallback, useState } from "react";

import { Breadcrumb } from "../../components/Breadcrumbs";

type BreadcrumbContext = {
  breadcrumbs: Array<Breadcrumb>;
  updateBreadcrumbs: (newBreadcrumbs: Array<Breadcrumb>) => void;
};

export const breadcrumbContext = createContext<BreadcrumbContext | null>(null);

export const BreadcrumbProvider: FC = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState(new Array<Breadcrumb>());

  const updateBreadcrumbs = useCallback(
    (newBreadcrumbs: Array<Breadcrumb>) => {
      setBreadcrumbs(newBreadcrumbs);
    },
    [setBreadcrumbs]
  );

  const breadcrumbValue = {
    breadcrumbs,
    updateBreadcrumbs,
  };

  return (
    <breadcrumbContext.Provider value={breadcrumbValue}>
      {children}
    </breadcrumbContext.Provider>
  );
};

export default BreadcrumbProvider;
