import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";

import { getNationalCurriculumInsightsRouteData } from "./getNationalCurriculumInsightsData";
import { NationalCurriculumInsightsView } from "./NationalCurriculumInsightsView";

import {
  nationalCurriculumInsightsRouteHref,
  parseNationalCurriculumInsightsRoute,
} from "@/common-lib/urls/nationalCurriculumInsights";

const robots: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ segments?: string[] }>;
}): Promise<Metadata> => {
  const route = parseNationalCurriculumInsightsRoute((await params).segments);

  return {
    title: "National curriculum insights",
    robots,
    ...(route
      ? {
          alternates: {
            canonical: nationalCurriculumInsightsRouteHref(route),
          },
        }
      : {}),
  };
};

const NationalCurriculumInsightsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ segments?: string[] }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { segments } = await params;
  const route = parseNationalCurriculumInsightsRoute(segments);
  if (!route) {
    return notFound();
  }

  const { isEnabled: previewMode } = await draftMode();
  const data = await getNationalCurriculumInsightsRouteData(route, {
    previewMode,
  });
  if (!data) {
    return notFound();
  }

  if (route.kind === "guidance") {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries((await searchParams) ?? {})) {
      for (const item of Array.isArray(value)
        ? value
        : value === undefined
          ? []
          : [value]) {
        query.append(key, item);
      }
    }
    permanentRedirect(
      `${nationalCurriculumInsightsRouteHref(route)}${query.size ? `?${query}` : ""}`,
    );
  }

  return <NationalCurriculumInsightsView data={data} />;
};

export default NationalCurriculumInsightsPage;
