import { FC } from "react";

import { ProgrammesArray } from "../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects";
import Grid, { GridArea } from "../Grid";

import SubjectCardListItem from "./SubjectCardListItem";

export type SubjectCardListProps = {
  subjects: ProgrammesArray[];
  isAvailable: boolean;
};

const SubjectCardList: FC<SubjectCardListProps> = ({
  subjects,
  isAvailable,
}) => {
  return (
    <Grid $rg={16} $cg={16} $gridAutoRows={"1fr"} $mb={72}>
      {subjects.map((subject) => {
        return (
          <GridArea
            key={`subject-list-item-${subject[0].slug}`}
            $colSpan={[6, 3, 2]}
          >
            <SubjectCardListItem subject={subject} isAvailable={isAvailable} />
          </GridArea>
        );
      })}
    </Grid>
  );
};

export default SubjectCardList;
