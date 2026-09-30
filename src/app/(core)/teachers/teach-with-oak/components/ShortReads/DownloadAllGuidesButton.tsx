import { OakPrimaryButton } from "@oaknational/oak-components";
import Link from "next/link";

import { useReturnToLessonProps } from "../../getReturnToLessonLink";

import { resolveOakHref } from "@/common-lib/urls";

export const DownloadAllGuidesButton = () => {
  const returnToLessonProps = useReturnToLessonProps();

  return (
    <OakPrimaryButton
      iconName="download"
      isTrailingIcon
      aria-label={"Download all guides"}
      element={Link}
      href={resolveOakHref({
        page: "teach-with-oak-download",
        ...(returnToLessonProps && { query: returnToLessonProps }),
      })}
    >
      Download all guides
    </OakPrimaryButton>
  );
};
