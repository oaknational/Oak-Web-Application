"use client";

import { GoogleClassroomAuthSuccessView } from "@oaknational/google-classroom-addon/ui";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const session = searchParams?.get("s") ?? null;
  const accessToken = searchParams?.get("at") ?? null;
  if (!session || !accessToken) return <Suspense>An error occurred.</Suspense>;
  return (
    <Suspense>
      <GoogleClassroomAuthSuccessView
        session={decodeURIComponent(session)}
        accessToken={decodeURIComponent(accessToken)}
      />
    </Suspense>
  );
}

export default AuthSuccessPage;
