import { FC } from "react";
import { OakGrid, OakGridArea } from "@oak-academy/oak-components";

import SubjectCardListItem from "./SubjectCardListItem";

import { KeyStageSubjectData } from "@/node-lib/curriculum-api-2023/queries/subjectListing/subjectListing.schema";

export type KeyStageSubject = [KeyStageSubjectData, ...KeyStageSubjectData[]];

export type SubjectCardListProps = {
  subjects: KeyStageSubject[];
  keyStageSlug: string;
  keyStageTitle: string;
  isAvailable: boolean;
};

const SubjectCardList: FC<SubjectCardListProps> = ({
  subjects,
  isAvailable,
  keyStageSlug,
  keyStageTitle,
}) => {
  return (
    <OakGrid
      $rg={"space-between-s"}
      $cg={"space-between-s"}
      $gridAutoRows={"1fr"}
      $mb={"space-between-xxl"}
    >
      {subjects.map((subject) => {
        return (
          <OakGridArea
            key={`subject-list-item-${subject[0].subjectSlug}`}
            $colSpan={[6, 3, 2]}
          >
            <SubjectCardListItem
              subject={subject}
              keyStageSlug={keyStageSlug}
              keyStageTitle={keyStageTitle}
              isAvailable={isAvailable}
            />
          </OakGridArea>
        );
      })}
    </OakGrid>
  );
};

export default SubjectCardList;
