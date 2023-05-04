import { FC } from "react";

import { ProgrammesBySubject } from "../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects";
import Grid, { GridArea } from "../Grid";

import SubjectCardListItem from "./SubjectCardListItem";

export type SubjectCardListProps = {
  subjects: ProgrammesBySubject[];
  isAvailable: boolean;
};

const SubjectCardList: FC<SubjectCardListProps> = ({
  subjects,
  isAvailable,
}) => {
  return (
    <Grid $rg={16} $cg={16} $gridAutoRows={"1fr"} $mb={72}>
      {subjects.map((programmes) => {
        return (
          <GridArea
            key={`subject-list-item-${programmes[0].subjectSlug}`}
            $colSpan={[6, 3, 2]}
          >
            <SubjectCardListItem
              programmes={programmes}
              isAvailable={isAvailable}
            />
          </GridArea>
        );
      })}
    </Grid>
  );
};

export default SubjectCardList;
