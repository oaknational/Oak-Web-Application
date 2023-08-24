import { FC } from "react";

import Grid, { GridArea } from "../Grid";

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
    <Grid $rg={16} $cg={16} $gridAutoRows={"1fr"} $mb={72}>
      {subjects.map((subject) => {
        return (
          <GridArea
            key={`subject-list-item-${subject[0].subjectSlug}`}
            $colSpan={[6, 3, 2]}
          >
            <SubjectCardListItem
              subject={subject}
              keyStageSlug={keyStageSlug}
              keyStageTitle={keyStageTitle}
              isAvailable={isAvailable}
            />
          </GridArea>
        );
      })}
    </Grid>
  );
};

export default SubjectCardList;
