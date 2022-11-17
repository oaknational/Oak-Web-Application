import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getFlagValue = (_name: string) => Math.random() < 0.5;

const getPersonalizationRewrite = (
  request: NextRequest
): string | undefined => {
  // Do some funky stuff checking if feature flags exist for a path,
  // and are enabled

  if (request.nextUrl.pathname === "/contact-us") {
    const variantValue = getFlagValue("hubspot-forms");
    return `/contact-us/variant--hubspotForms:${variantValue}`;
  }
};

export function middleware(request: NextRequest) {
  const rewrite = getPersonalizationRewrite(request);

  if (rewrite) {
    return NextResponse.rewrite(new URL(rewrite, request.url));
  }

  // Netlify middleware doesn't work outside deno context, I think
  // setPageProp is just doing a rewrite on __NEXT_DATA JSON in the
  // page, rather than a server side render w/ updated props though
  // const middlewareRequest = new MiddlewareRequest(request);
  // const response = await middlewareRequest.next();
  // response.setPageProp("variants", { foo: "bar" });
}
