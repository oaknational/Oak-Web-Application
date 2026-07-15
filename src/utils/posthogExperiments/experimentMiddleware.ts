import { NextRequest, NextResponse } from "next/server";

import { getExperimentCookieKey } from "./getExperimentCookieKey";

import getServerConfig from "@/node-lib/getServerConfig";

const posthogApiKey = getServerConfig("posthogApiKey");

const controlGroupKeys = new Set(["control"]);
const testGroupKeys = new Set(["test"]);

export default async function experimentMiddleware({
  request,
  featureFlag,
}: {
  request: NextRequest;
  featureFlag: string;
}) {
  const cookie = getExperimentCookieKey(featureFlag);
  const existing = request.cookies.get(cookie)?.value;
  const rewriteUrl = new URL(
    request.nextUrl.pathname + "/variant",
    request.url,
  );

  if (existing) {
    if (testGroupKeys.has(existing)) {
      return NextResponse.rewrite(rewriteUrl);
    }

    if (controlGroupKeys.has(existing)) {
      return NextResponse.next();
    }
  }

  // No cookie yet — evaluate the flag
  const posthogCookie = request.cookies.get(`ph_${posthogApiKey}_posthog`);
  const cookieValue = posthogCookie ? JSON.parse(posthogCookie.value) : {};
  const distinctId = cookieValue["distinct_id"];

  if (distinctId) {
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

    if (!phRes.ok) return null;

    const data = await phRes.json();
    const variant = data?.featureFlags?.["test-flag"] ?? null;

    const isTest = variant === "test";
    const res = isTest ? NextResponse.rewrite(rewriteUrl) : NextResponse.next();

    res.cookies.set(cookie, isTest ? "test" : "control", {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      path: "/",
    });
    return res;
  }

  return NextResponse.next();
}
