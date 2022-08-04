export default async (request, context) => {
  // Don't need to match the thenational.academy domain here, just for speed of testing.
  const subdomain = request.url.match(
    /(?:https:\/\/)?([^.]+)?(?:\.netlify)?\.(?:thenational\.academy|netlify\.app)/
  )[1];
  const redirected = request.headers.get("x-cloudflare-redirect");

  console.log("redirect", redirected);
  if (subdomain && !redirected) {
    console.log(
      "Redirected to Cloudflare - ",
      `https://${subdomain}.netlify.thenational.academy/`
    );
    return Response.redirect(
      `https://${subdomain}.netlify.thenational.academy/`
    );
  } else {
    console.log("Request allowed through");
    let res = await context.next();
    return res;
  }
};
