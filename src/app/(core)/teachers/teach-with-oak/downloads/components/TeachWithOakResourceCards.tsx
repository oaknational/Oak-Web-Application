"use client";
import {
  OakGrid,
  OakGridArea,
  OakResourceCard,
} from "@oaknational/oak-components";
import styled from "styled-components";

import {
  TeachWithOakShortReadTypes,
  TeachWithOakShortReadsDownloads,
} from "@/components/TeacherComponents/hooks/downloadAndShareHooks/teachWithOakShortReads.schema";

const StyledResourceCard = styled(OakResourceCard)`
  height: 100%;
`;

const teachWithOakShortReadsMap: Record<TeachWithOakShortReadTypes, string> = {
  explanation: "Explanation",
  "check-for-understanding": "Check for understanding (CfU)",
  feedback: "Feedback",
  practice: "Practice",
};

export const TeachWithOakResourceCards = ({
  resources,
}: {
  resources: TeachWithOakShortReadsDownloads;
}) => {
  return (
    <OakGrid $rg={"spacing-16"} $cg={"spacing-16"}>
      {resources.map((shortRead) => (
        <OakGridArea key={shortRead.type} $colSpan={[12, 12, 6]}>
          <StyledResourceCard
            id={shortRead.type}
            value={shortRead.type}
            title={`${teachWithOakShortReadsMap[shortRead.type]} at Oak guide`}
            description="PDF"
            iconName={`lc-${shortRead.type}`}
            showSelectionControl={false}
            fileSize={shortRead.fileSize}
          />
        </OakGridArea>
      ))}
    </OakGrid>
  );
};
