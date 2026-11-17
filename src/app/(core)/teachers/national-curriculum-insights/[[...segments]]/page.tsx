import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound, permanentRedirect, redirect } from "next/navigation";

import { getNationalCurriculumInsightsRouteData } from "./helpers/getRouteData";
import { NationalCurriculumInsightsView } from "./components/View";

import {
  nationalCurriculumInsightsGuidanceHref,
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

type SearchParams = Record<string, string | string[] | undefined>;

const getGuidanceRedirectHref = (searchParams: SearchParams = {}) => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) {
      continue;
    }
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) {
      query.append(key, item);
    }
  }

  const href = nationalCurriculumInsightsGuidanceHref();
  return query.size ? `${href}?${query}` : href;
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
  searchParams?: Promise<SearchParams>;
}) => {
  const { segments } = await params;
  const route = parseNationalCurriculumInsightsRoute(segments);
  if (!route) {
    return notFound();
  }

  const { isEnabled: previewMode } = await draftMode();
  // Keep public visitors on guidance until the Insights hub is ready to launch.
  if (!previewMode && route.kind !== "guidance") {
    return redirect(getGuidanceRedirectHref(await searchParams));
  }

  const data = await getNationalCurriculumInsightsRouteData(route, {
    previewMode,
  });
  if (!data) {
    return notFound();
  }

  if (route.kind === "guidance") {
    permanentRedirect(getGuidanceRedirectHref(await searchParams));
  }

  return <NationalCurriculumInsightsView data={data} />;
};

export default NationalCurriculumInsightsPage;
