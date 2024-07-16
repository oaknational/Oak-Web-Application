import { HandlerError, IdentityProviderError } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

import getServerConfig from "@/node-lib/getServerConfig";
import { auth0 } from "@/node-lib/auth/auth0";

export default auth0.handleAuth({
  async login(req: NextApiRequest, res: NextApiResponse) {
    await auth0.handleLogin(req, res, {
      authorizationParams: {
        prompt: "login",
        audience: getServerConfig("auth0Audience"),
        scope: "openid profile email",
      },
      returnTo: req.query?.returnTo?.toString() ?? "/",
    });
  },
  async callback(req: NextApiRequest, res: NextApiResponse) {
    try {
      await auth0.handleCallback(req, res);
    } catch (error) {
      let message = "Failed to login";
      if (
        error instanceof HandlerError &&
        error.cause instanceof IdentityProviderError
      ) {
        message = error.cause.errorDescription ?? message;
      }
      res.redirect(`/401?message=${message}`);
    }
  },
});
