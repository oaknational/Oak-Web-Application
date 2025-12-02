"use client";

import { GoogleClassroomAuthSuccessView } from "@oaknational/google-classroom-addon/ui";
import { useSearchParams } from "next/navigation";

function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const session = searchParams?.get("s") ?? null;
  if (!session) return <>An error occurred.</>;
  return (
    <GoogleClassroomAuthSuccessView session={decodeURIComponent(session)} />
  );
}

export default AuthSuccessPage;
