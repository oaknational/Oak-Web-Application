import type { Context } from "https://edge.netlify.com";

/**
 * Given a request at the Netlify edge, check if the subdomain matches the pattern
 * `<nested_subdomain>.netlify.netlify.app`
 * if so, redirect to the same nested subdomain on our canonical TLD.
 *
 * The intention is to automatically force PR and preview deployments to
 * only be accessible through our managed TLD.
 *
 * Not deployed on production.
 *
 * Note: this function is interpreted in a deno environment.
 */
async function redirectNetlifySubdomains(
  request: Request,
  context: Context
): Promise<Response> {
  let subdomain;
  let redirected;

  console.log(`Request URL: ${request?.url}`);

  try {
    const subdomainMatches = request?.url?.match(
      /(?:https:\/\/)?([^.]+)?(?:\.netlify)?\.(?:netlify\.app)/
    );
    if (Array.isArray(subdomainMatches)) {
      subdomain = subdomainMatches[1];
    }
    // Determine if the request is coming from the proxying Cloudflare worker.
    redirected = request.headers.get("x-cloudflare-redirect") || false;

    console.log(
      `Subdomain identified: ${subdomain}\nRedirected from Cloudflare: ${redirected}`
    );
  } catch (err) {
    console.error("Subdomain matching failed.");
    console.error(err, request.url);
  }

  // Netlify makes some requests internally for optimisation functions,
  // skip the redirect for these.
  const allowListPathStarts = [
    "/_ipx",
    "/_next",
    "/.netlify",
    "/images",
    "/site.webmanifest",
  ];
  const urlPath = new URL(request.url).pathname;
  const isOnAllowList = allowListPathStarts.some((allowPath) =>
    urlPath.startsWith(allowPath)
  );
  console.log(`URL is on allow list: ${isOnAllowList}`);

  if (subdomain && !redirected && !isOnAllowList) {
    const redirectTargetUrl = new URL(
      `https://${subdomain}.netlify.thenational.academy/`
    ).href;
    console.log("Redirected to Cloudflare - ", redirectTargetUrl);

    return Response.redirect(redirectTargetUrl);
  } else {
    console.log(`Request allowed through`);
    const res = await context.next();
    return res;
  }
}

export default redirectNetlifySubdomains;
