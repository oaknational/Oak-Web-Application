import { useEffect } from "react";
import { useRouter } from "next/router";

export default function GoogleClassroomClosePopup() {
  const router = useRouter();
  useEffect(() => {
    if (router.query.authtoken) {
      window.opener.postMessage(
        {
          type: "auth_complete",
          success: true,
          authToken: router.query.authtoken, // we wont need this once we have a token store/db
        },
        "*",
      );
      window.close();
    }
  }, [router.query.authtoken]);
  return <></>;
}
