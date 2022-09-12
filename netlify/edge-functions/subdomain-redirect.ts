import type { Context } from "https://edge.netlify.com";

async function redirectNetlifySubdomains(
  request: Request,
  context: Context
): Promise<Response> {
  let subdomain;
  let redirected;
  try {
    subdomain = request.url.match(
      /(?:https:\/\/)?([^.]+)?(?:\.netlify)?\.(?:netlify\.app)/
    )[1];
    redirected = request.headers.get("x-cloudflare-redirect");
  } catch (err) {
    console.error("woops", request.url);
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
    let res = await context.next();
    return res;
  }
}

export default redirectNetlifySubdomains;
