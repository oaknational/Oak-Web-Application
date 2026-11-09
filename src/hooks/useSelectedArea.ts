import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { match } from "path-to-regexp";

export const siteAreas = {
  teachers: "TEACHERS",
  pupils: "PUPILS",
} as const;

export type SelectedArea = (typeof siteAreas)[keyof typeof siteAreas];

const matchPupilsArea = match("/pupils", { end: false });

const useSelectedArea = () => {
  const pathname = usePathname();
  const areaFromPathname =
    pathname && matchPupilsArea(pathname)
      ? siteAreas.pupils
      : siteAreas.teachers;

  const [clientArea, setClientArea] = useState<SelectedArea>(areaFromPathname);
  useEffect(() => {
    // This prevents a hydration error. See: https://nextjs.org/docs/app/api-reference/functions/use-pathname#avoid-hydration-mismatch-with-rewrites
    setClientArea(areaFromPathname);
  }, [areaFromPathname]);

  return clientArea;
};

export default useSelectedArea;
