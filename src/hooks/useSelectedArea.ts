"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  SelectedArea,
  siteAreas,
} from "@/components/AppComponents/AppHeader/AppHeader";

const useSelectedArea = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  console.log("diego pathname useselectedarea", pathname);
  const serverBasedSelectedArea = pathname?.includes("/pupils")
    ? siteAreas.pupils
    : siteAreas.teachers;

  const [clientArea, setClientArea] = useState<SelectedArea>(
    serverBasedSelectedArea,
  );

  useEffect(() => {
    const fullPath = searchParams?.toString();
    // This prevents a hydration error. The server contains information on the requested path, but not when it's a 404 or 500 error.
    // For example if we are on /pupils/thisPageDoesNotExist, on the server pathname is /404 and asPath is undefined .
    // We have to wait until we are client-side and then we can query asPath to get the url that we are on.
    // For info - One solution to this is to set getServerSideProps on the 404 & 500 pages. This means the asPath would be set and the pages would be ssr.
    // But that also makes the 404 & 500 pages a larger load on the server in a large incident, therefore I think it's better to keep them as fully static pages.
    const clientBasedSelectedArea = fullPath?.includes("/pupils")
      ? siteAreas.pupils
      : siteAreas.teachers;

    if (serverBasedSelectedArea !== clientBasedSelectedArea) {
      setClientArea(clientBasedSelectedArea);
    }
  }, [searchParams, serverBasedSelectedArea]);

  return clientArea;
};

export default useSelectedArea;
