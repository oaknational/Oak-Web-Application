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
    // Determine if the request is coming from the proxying Cloudflare worker.
    redirected = request.headers.get("x-cloudflare-redirect") || false;

    console.log(
      `Subdomain identified: ${subdomain}\nRedirected from Cloudflare: ${redirected}`
    );
  } catch (err) {
    console.error("Subdomain matching failed.");
    console.error(err, request.url);
  }

  const url = new URL(request.url);

  const isIpx = url.pathname.startsWith("/_ipx");
  console.log("Testing IPX", isIpx, " : ", url.pathname);

  if (subdomain && !redirected && !isIpx) {
    const redirectTargetUrl = new URL(
      `https://${subdomain}.netlify.thenational.academy/`
    ).href;
    console.log("Redirected to Cloudflare - ", redirectTargetUrl);

    return Response.redirect(redirectTargetUrl);
  } else {
    console.log(`Request allowed through - ${request?.url}`);
    const res = await context.next();
    return res;
  }
}

export default redirectNetlifySubdomains;
