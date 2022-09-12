import type { Context } from "https://edge.netlify.com";

/**
 * Given a request at the Netlify edge, check if the subdomain matches the pattern
 * `<nested_subdomain>.netlify.netlify.app`
 * if so, redirect to the same nested subdomain on our canonical TLD.
 *
 * The intention is to automatically force PR and preview deployments to
 * only be accessible through our managed TLD.
 *
 * Note: this function is interpreted in a deno environment.
 */
async function redirectNetlifySubdomains(
  request: Request,
  context: Context
): Promise<Response> {
  let subdomain;
  let redirected;
  try {
    const subdomainMatches = request?.url?.match(
      /(?:https:\/\/)?([^.]+)?(?:\.netlify)?\.(?:netlify\.app)/
    );
    if (Array.isArray(subdomainMatches)) {
      subdomain = subdomainMatches[1];
    }
    // Only redirect once, to avoid infinite redirect loops.
    // Although this header has to come from Cloudflare, so
    // don't think this can happen in the current implementation.
    redirected = request.headers.get("x-cloudflare-redirect");
  } catch (err) {
    console.error("Subdomain matching failed.");
    console.error(err, request.url);
  }

  console.log("redirect", redirected);
  if (subdomain && !redirected) {
    const redirectTargetUrl = new URL(
      `https://${subdomain}.netlify.thenational.academy/`
    ).href;
    console.log("Redirected to Cloudflare - ", redirectTargetUrl);
    return Response.redirect(redirectTargetUrl);
  } else {
    console.log("Request allowed through");
    const res = await context.next();
    return res;
  }
}

export default redirectNetlifySubdomains;
