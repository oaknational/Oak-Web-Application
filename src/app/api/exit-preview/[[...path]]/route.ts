import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  // Strip `/api/preview/` from the pathname
  const redirectLocation = "/" + pathname.split("/").slice(3).join("/");
  const draft = await draftMode();
  draft.disable();
  redirect(redirectLocation);
}
