import { NextRequest, NextResponse } from "next/server";

import {
  getConsentFromCookie,
  getExperimentCookieKey,
  getDistinctIdFromCookie,
} from "./cookieHelpers";

import getServerConfig from "@/node-lib/getServerConfig";

const posthogApiKey = getServerConfig("posthogApiKey");

const controlGroupKeys = new Set(["control"]);
const testGroupKeys = new Set(["test"]);

/**
 * A middleware function designed to be used when running A/B experiments in Posthog
 * to enable variant page caching
 */

export default async function experimentMiddleware({
  request,
  featureFlag,
}: {
  request: NextRequest;
  featureFlag: string;
}) {
  // We don't have access to the consent client here so we need to read the statistics policy value
  // from the cookie to determine whether to enable the experiment
  const consentState = getConsentFromCookie(request);
  if (!consentState || consentState !== "granted") {
    return NextResponse.next();
  }

  const experimentCookie = getExperimentCookieKey(featureFlag);
  const experimentCookieValue = request.cookies.get(experimentCookie)?.value;
  const rewriteUrl = new URL(
    request.nextUrl.pathname + "/variant",
    request.url,
  );

  if (experimentCookieValue) {
    // The user has already been placed into an experiment group so we direct them
    // to the appropriate variant based on their experiment cookie value
    if (testGroupKeys.has(experimentCookieValue)) {
      return NextResponse.rewrite(rewriteUrl);
    }

    if (controlGroupKeys.has(experimentCookieValue)) {
      return NextResponse.next();
    }
  }

  // No cookie yet — evaluate the flag in Posthog
  const distinctId = getDistinctIdFromCookie(request);

  if (distinctId) {
    return await constructResponseForVariant({
      distinctId,
      featureFlag,
      experimentCookie,
      rewriteUrl,
    });
  }

  return NextResponse.next();
}

const getExperimentVariant = async ({
  distinctId,
  featureFlag,
}: {
  distinctId: string;
  featureFlag: string;
}) => {
  try {
    const phRes = await fetch(
      `${getServerConfig("posthogApiHost")}/decide?v=3`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: posthogApiKey,
          distinct_id: distinctId,
        }),
      },
    );

    if (phRes.status !== 200) {
      throw new Error("Posthog fetch error");
    }

    const data = await phRes.json();
    const variant = data?.featureFlags?.[featureFlag];
    return variant;
  } catch (error) {
    // Fall back to the control route. Avoid errorReporter here because it depends on
    // browser-only modules that aren't compatible with the edge middleware runtime.
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[experimentMiddleware] posthog decide request failed", {
      featureFlag,
      error: errorMessage,
    });
  }
};

const constructResponseForVariant = async ({
  distinctId,
  featureFlag,
  experimentCookie,
  rewriteUrl,
}: {
  distinctId: string;
  featureFlag: string;
  experimentCookie: string;
  rewriteUrl: URL;
}) => {
  const variant = await getExperimentVariant({ distinctId, featureFlag });

  if (!variant) {
    // Decide request failed (or returned no variant) — don't set a cookie so we can retry later.
    return NextResponse.next();
  }

  const isTest = testGroupKeys.has(variant);
  const response = isTest
    ? NextResponse.rewrite(rewriteUrl)
    : NextResponse.next();

  response.cookies.set(experimentCookie, isTest ? "test" : "control", {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return response;
};
