"use client";

import { GoogleClassroomAuthSuccessView } from "@oaknational/google-classroom-addon/ui";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthSuccessContent() {
  const searchParams = useSearchParams();
  const session = searchParams?.get("s") ?? null;
  const accessToken = searchParams?.get("at") ?? null;

  if (!session || !accessToken) {
    return <div>An error occurred.</div>;
  }

  return (
    <GoogleClassroomAuthSuccessView
      session={decodeURIComponent(session)}
      accessToken={decodeURIComponent(accessToken)}
    />
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={null}>
      <AuthSuccessContent />
    </Suspense>
  );
}
