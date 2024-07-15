import { FC, useEffect, useRef, useState } from "react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import CurriculumDownloadView from "../CurriculumDownloadView";
import SuccessMessage from "../SuccessMessage";

import Box from "@/components/SharedComponents/Box";
// import { wrapPreRelease } from "@/hooks/usePrereleaseFlag";
import { CurriculumSelectionSlugs } from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";

function ScrollIntoViewWhenVisisble({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, [ref]);
  return <div ref={ref}>{children}</div>;
}

interface CurriculumDownloadTabProps {
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  cache: number;
}

const CurriculumDownloadTab: FC<CurriculumDownloadTabProps> = ({
  curriculumSelectionSlugs,
  cache,
}) => {
  const [isDone, setIsDone] = useState(false);

  const onDownloadComplete = () => {
    setIsDone(true);
  };

  if (isDone) {
    return (
      <ScrollIntoViewWhenVisisble>
        <SuccessMessage
          title="Thanks for downloading"
          message="We hope you find the resources useful. Click the question mark in the bottom-right corner to share your feedback."
          buttonProps={{
            label: "Back to downloads",
            onClick: () => {
              setIsDone(false);
            },
          }}
        />
      </ScrollIntoViewWhenVisisble>
    );
  }

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <Box $maxWidth={1280} $mh={"auto"} $ph={18} $pb={[48]} $width={"100%"}>
        <CurriculumDownloadView
          curriculumSelectionSlugs={curriculumSelectionSlugs}
          cache={cache}
          onDownloadComplete={onDownloadComplete}
        />
      </Box>
    </OakThemeProvider>
  );
};

export default CurriculumDownloadTab;
