// import type { Context } from "https://edge.netlify.com";

/**
 * Given a request at the Netlify edge to the default domain,
 * check if it comes from a Cloudflare load balancer. If so,
 * let it through, else redirect the user to a Cloudflare
 * controlled canonical domain for the deployment.
 *
 * Note: this function is interpreted in a deno environment.
 */
async function redirectNetlifySubdomains(
  request: Request
  // context: Context
): Promise<Response | undefined> {
  const requestUrl = request?.url;
  console.log(`Request URL: ${requestUrl}`);

  const isRequestToDefaultDomain = requestUrl.startsWith(
    "https://oak-web-application.netlify.app"
  );

  // Request isn't to the default domain, ignore it.
  if (!isRequestToDefaultDomain) {
    console.log("Not default domain, ignoring");
    return;
  }

  const isFromCloudflare = false;
  // Determine if the request is coming from the proxying Cloudflare worker.
  // redirected = request.headers.get("x-cloudflare-redirect") || false;
  // Hopefully there are some `cf-something` headers that indicate the
  // request came from Cloudflare.
  console.log("headers", new Map(request.headers));

  // The request is from Cloudflare, ignore it.
  if (isFromCloudflare) {
    console.log("Allowing Cloudflare");
    return;
  }

  // The request is to the default domain and is not from Cloudflare,
  // redirect to the canonical domain.
  console.log("redirecting");
  return await Response.redirect("https://owa.thenational.academy");
}

export default redirectNetlifySubdomains;
