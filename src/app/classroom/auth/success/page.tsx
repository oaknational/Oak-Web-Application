"use client";

import { GoogleClassroomAuthSuccessView } from "@oaknational/google-classroom-addon/ui";
import { useSearchParams } from "next/navigation";

function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const session = searchParams?.get("s") ?? null;
  const accessToken = searchParams?.get("at") ?? null;
  if (!session || !accessToken) return <>An error occurred.</>;
  return (
    <GoogleClassroomAuthSuccessView
      session={decodeURIComponent(session)}
      accessToken={decodeURIComponent(accessToken)}
    />
  );
}

export default AuthSuccessPage;
