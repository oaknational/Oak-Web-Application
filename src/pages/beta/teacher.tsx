import { FC, useState } from "react";

import keyStagesNavData from "../../browser-lib/fixtures/keyStagesNav";
import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Card from "../../components/Card";
import Flex from "../../components/Flex";
import Grid from "../../components/Grid";
import GridArea from "../../components/Grid/GridArea";
import Input from "../../components/Input";
import KeyStagesNav from "../../components/KeyStagesNav/KeyStagesNav";
import AppLayout from "../../components/AppLayout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import { Heading, P } from "../../components/Typography";

const TeacherHome: FC = () => {
  const [value, setValue] = useState("");
  return (
    <AppLayout seoProps={DEFAULT_SEO_PROPS} $background={"grey1"}>
      <MaxWidth>
        <Grid $cg={16} $rg={[16, 48, 80]}>
          <GridArea $colSpan={[12, 12, 8]}>
            <Heading
              $font={"heading-1"}
              tag={"h1"}
              $mt={64}
              $mb={16}
              data-testid="home-page-title"
            >
              Big inspiring heading
            </Heading>
            <Heading $font="heading-4" tag={"h2"} data-testid="home-page-title">
              Subheading giving further interesting info and details about other
              cool things
            </Heading>
          </GridArea>
          <GridArea $colSpan={[12, 12, 4]}>
            <Card>
              <Heading tag={"h3"} $font="heading-4">
                Training new teachers
              </Heading>
              <P>16/08</P>
            </Card>
          </GridArea>
          <GridArea $colSpan={[12, 12, 12]}>
            <Input
              icon="Search"
              label="Search"
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search for subjects, lessons, quizes, lessons plans and much much more..."
              value={value}
              id={""}
            />
            <Flex $mt={32} $justifyContent={"center"}>
              <KeyStagesNav keyStages={keyStagesNavData} />
            </Flex>
          </GridArea>
        </Grid>
      </MaxWidth>
    </AppLayout>
  );
};

export default TeacherHome;
