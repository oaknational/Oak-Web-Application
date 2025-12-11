import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  SelectedArea,
  siteAreas,
} from "@/components/AppComponents/AppHeader/AppHeader";

const useSelectedArea = () => {
  const pathname = usePathname();

  const [clientArea, setClientArea] = useState<SelectedArea>(
    siteAreas.teachers,
  );

  useEffect(() => {
    // This prevents a hydration error. See: https://nextjs.org/docs/app/api-reference/functions/use-pathname#avoid-hydration-mismatch-with-rewrites
    const clientArea = pathname?.includes("/pupils")
      ? siteAreas.pupils
      : siteAreas.teachers;
    setClientArea(clientArea);
  }, [pathname]);

  return clientArea;
};

export default useSelectedArea;
