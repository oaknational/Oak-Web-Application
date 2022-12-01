import { FC } from "react";

import { KeyStageProps } from "../../../pages/beta/key-stages/[keyStageSlug]";
import SubjectCardLink, {
  SubjectCardLinkProps,
} from "../../Card/SubjectCardLink";
import Flex from "../../Flex";
import Grid, { GridArea } from "../../Grid";
import MaxWidth from "../../MaxWidth/MaxWidth";
import Typography, { Heading } from "../../Typography";

type SubjectListingProps = KeyStageProps;

export type SubjectListGridProps = {
  subjectListGridData: SubjectCardLinkProps[];
};

const SubjectListGrid: FC<SubjectListGridProps> = ({ subjectListGridData }) => {
  return (
    <Grid $rg={16} $cg={16} $gridAutoRows={"1fr"} $mb={72}>
      {subjectListGridData.map((subject: SubjectCardLinkProps) => {
        return (
          <GridArea $colSpan={[6, 3, 2]}>
            <SubjectCardLink {...subject} />{" "}
          </GridArea>
        );
      })}
    </Grid>
  );
};

const SubjectListingPage: FC<SubjectListingProps> = (props) => {
  const { subjectListData, unavailableSubjectListData } = props.keyStageData;
  return (
    <Flex $flexDirection={"column"}>
      <MaxWidth $ph={[12]}>
        <Flex $pv={20}>
          <Typography $font={"body-2"}>
            {subjectListData.length} subjects
          </Typography>
        </Flex>
        <Heading $font={"heading-5"} tag={"h5"} $mb={30}>
          All subjects
        </Heading>
        <SubjectListGrid subjectListGridData={subjectListData} />
        <Heading $font={"heading-7"} tag={"h6"} $mv={16}>
          Coming soon
        </Heading>
        <SubjectListGrid subjectListGridData={unavailableSubjectListData} />
      </MaxWidth>
    </Flex>
  );
};

export default SubjectListingPage;
