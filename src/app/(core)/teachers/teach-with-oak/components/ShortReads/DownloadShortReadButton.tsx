import Link from "next/link";
import {
  OakSmallTertiaryInvertedButton,
  parseSpacing,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { useReturnToLessonProps } from "../../getReturnToLessonLink";

import { resolveOakHref } from "@/common-lib/urls";

const ShortReadDownloadButton = styled(OakSmallTertiaryInvertedButton)`
  div {
    padding-left: ${parseSpacing("spacing-0")};
  }
`;

export const DownloadShortReadButton = ({
  shortReadType,
}: {
  shortReadType: string;
}) => {
  const returnToLessonProps = useReturnToLessonProps();

  return (
    <ShortReadDownloadButton
      iconName="download"
      isTrailingIcon
      aria-label={`Download ${shortReadType} guide (PDF)`}
      element={Link}
      href={resolveOakHref({
        page: "teach-with-oak-download",
        ...(returnToLessonProps && { query: returnToLessonProps }),
      })}
    >
      {`Download ${shortReadType} guide (PDF)`}
    </ShortReadDownloadButton>
  );
};
