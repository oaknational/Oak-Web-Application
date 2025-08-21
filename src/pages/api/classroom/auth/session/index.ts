import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest & { user?: object },
  res: NextApiResponse,
) {
  //todo: this function should take the users logged in login_hint, and check if there is an active session for it
  // if its expired attempt to refresh it
  // either prompt for a re login or return true
  const user = req.user;
  if (user) res.status(200).json({ user, authenticated: true });
  else res.status(200).json({ user: null, authenticated: false });
}
