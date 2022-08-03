export default async (request, context) => {
    const subdomain = request.url.match(/https:\/\/(.*?)\-\-/);
    const redirected = request.headers.get("x-cloudflare-redirect");
  
    console.log("redirect", redirected);
    if (subdomain && !redirected) {
      console.log(
        "Redirected to Cloudflare - ",
        `https://${subdomain[1]}.netlify.thenational.academy/`
      );
      return Response.redirect(`https://${subdomain[1]}.netlify.thenational.academy/`);
    } else {
      console.log("Request allowed through");
      let res = await context.next();
      return res;
    }
  };