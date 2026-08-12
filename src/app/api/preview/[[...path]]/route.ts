import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import getServerConfig from "@/node-lib/getServerConfig";

const reportError = errorReporter("/api/preview/[[...preview]]");

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const secret = searchParams.get("secret");
  const disableDraftMode = searchParams.get("disable");
  const userAgent = req.headers.get("user-agent");
  const isDetectify = userAgent?.toLocaleLowerCase().includes("detectify");

  if (secret !== getServerConfig("sanityPreviewSecret") && !disableDraftMode) {
    const error = new OakError({
      code: "preview/invalid-token",
      meta: {
        badToken: `${secret}`,
        userAgent,
      },
    });

    if (!isDetectify) {
      reportError(error);
      return new Response(error.message, { status: 500 });
    }
  }

  const pathname = req.nextUrl.pathname;
  // Strip `/api/preview/` from the pathname
  const redirectLocation = "/" + pathname.split("/").slice(3).join("/");
  const draft = await draftMode();

  if (disableDraftMode) {
    draft.disable();
  } else {
    draft.enable();
  }

  redirect(redirectLocation);
}
