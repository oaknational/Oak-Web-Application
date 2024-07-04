import { auth } from "auth";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname === "/downloads/restricted") {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/downloads/restricted"],
};
