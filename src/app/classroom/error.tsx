/* istanbul ignore file */
"use client";
import { useEffect } from "react";

import errorReporter from "@/common-lib/error-reporter";
import GoogleClassroomErrorView from "@/components/GoogleClassroom/GoogleClassroomErrorView";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    errorReporter("classroom::error-boundary")(error);
  }, [error]);

  return <GoogleClassroomErrorView statusCode={500} />;
}
