import { auth0 } from "@/node-lib/auth/auth0";

export const runtime = "edge";
export const GET = auth0.handleAuth();
