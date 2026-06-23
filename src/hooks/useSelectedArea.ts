import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const siteAreas = {
  teachers: "TEACHERS",
  pupils: "PUPILS",
} as const;

export type SelectedArea = (typeof siteAreas)[keyof typeof siteAreas];

const useSelectedArea = () => {
  const pathname = usePathname();
  const initialClientArea = pathname?.includes("/pupils")
    ? siteAreas.pupils
    : siteAreas.teachers;

  const [clientArea, setClientArea] = useState<SelectedArea>(initialClientArea);
  useEffect(() => {
    // This prevents a hydration error. See: https://nextjs.org/docs/app/api-reference/functions/use-pathname#avoid-hydration-mismatch-with-rewrites
    const clientArea = pathname?.includes("/pupils")
      ? siteAreas.pupils
      : siteAreas.teachers;
    if (initialClientArea !== clientArea) {
      setClientArea(clientArea);
    }
  }, [pathname, initialClientArea]);

  return clientArea;
};

export default useSelectedArea;
