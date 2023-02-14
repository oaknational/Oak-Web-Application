import { useState } from "react";
import { NextPage, GetServerSideProps, GetServerSidePropsResult } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import AppLayout from "../../../../../../../../../../../components/AppLayout";
import Flex from "../../../../../../../../../../../components/Flex";
import Box from "../../../../../../../../../../../components/Box";
import MaxWidth from "../../../../../../../../../../../components/MaxWidth/MaxWidth";
import TitleCard from "../../../../../../../../../../../components/Card/TitleCard";
import {
  Heading,
  Hr,
  P,
} from "../../../../../../../../../../../components/Typography";
import OakLink from "../../../../../../../../../../../components/OakLink";
import Input from "../../../../../../../../../../../components/Input";
import Checkbox from "../../../../../../../../../../../components/Checkbox";
import DownloadCard from "../../../../../../../../../../../components/DownloadCard";
import BrushBorders from "../../../../../../../../../../../components/SpriteSheet/BrushSvgs/BrushBorders";
import { getSeoProps } from "../../../../../../../../../../../browser-lib/seo/getSeoProps";
import Grid, {
  GridArea,
} from "../../../../../../../../../../../components/Grid";
import curriculumApi, {
  type TeachersKeyStageSubjectUnitsLessonsDownloadsData,
} from "../../../../../../../../../../../node-lib/curriculum-api";

export type LessonDownloadsPageProps = {
  curriculumData: TeachersKeyStageSubjectUnitsLessonsDownloadsData;
};

const schema = z.object({
  email: z
    .string()
    .email({
      message: "Email not valid",
    })
    .optional()
    .or(z.literal("")),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept terms and conditions" }),
  }),
});

type DownloadFormValues = z.infer<typeof schema>;
export type DownloadFormProps = {
  onSubmit: (values: DownloadFormValues) => Promise<string | void>;
  email: string;
  terms: boolean;
};

const LessonDownloadsPage: NextPage<LessonDownloadsPageProps> = ({
  curriculumData,
}) => {
  const { title, keyStageTitle, keyStageSlug, subjectSlug, subjectTitle } =
    curriculumData;
  const { register, formState } = useForm<DownloadFormProps>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const { errors } = formState;

  const [acceptedTCs, setAcceptedTCs] = useState<boolean>(false);

  const [resourcesToDownload, setResourcesToDownload] = useState<{
    [key: string]: boolean;
  }>({});

  const onResourceToDownloadToggle = (toggledResource: string) => {
    setResourcesToDownload({
      ...resourcesToDownload,
      [toggledResource]: resourcesToDownload[toggledResource] ? false : true,
    });
  };

  return (
    <AppLayout
      seoProps={getSeoProps({
        title: "Lesson downloads", // @todo add real data
        description: "Lesson downloads",
      })}
    >
      <MaxWidth $ph={[12]} $maxWidth={[480, 840, 1280]}>
        <Flex $mb={8} $display={"inline-flex"} $mt={50}>
          <TitleCard
            page={"lesson"}
            keyStage={keyStageTitle}
            keyStageSlug={keyStageSlug}
            subject={subjectTitle}
            subjectSlug={subjectSlug}
            title={`Downloads: ${title}`}
            iconName={"Rocket"}
          />
        </Flex>
        <Box $maxWidth={[null, 420, 420]} $mb={96}>
          <Heading tag="h2" $font={"heading-5"} $mb={16} $mt={[24, 48]}>
            Your details
          </Heading>
          <Heading
            tag="h3"
            $font={"heading-7"}
            $mt={0}
            $mb={24}
            data-testid="email-heading"
          >
            For regular updates from Oak (optional)
          </Heading>
          <Input
            id={"email"}
            label="Email address:"
            placeholder="Enter email address here"
            {...register("email")}
            error={errors.email?.message}
          />
          <P $font="body-3" $mt={-24} $mb={40}>
            Join our community to get free lessons, resources and other helpful
            content. Unsubscribe at any time. Our{" "}
            <OakLink page={"privacy-policy"} $isInline>
              privacy policy
            </OakLink>
            .
          </P>
          <Box
            $position={"relative"}
            $background={"pastelTurquoise"}
            $pv={8}
            $ph={8}
            $mb={24}
          >
            <BrushBorders
              hideOnMobileH
              hideOnMobileV
              color={"pastelTurquoise"}
            />
            <Checkbox
              labelText={"I accept terms and conditions (required)"}
              id={"terms"}
              name={"termsAndConditions"}
              checked={acceptedTCs}
              onChange={() => setAcceptedTCs(!acceptedTCs)}
              $mb={0}
              required
              error={errors.terms?.message}
            />
          </Box>
          <P $font="body-3">
            Read our{" "}
            <OakLink page={"terms-and-conditions"} $isInline>
              terms &amp; conditions
            </OakLink>
            .
          </P>
        </Box>

        <Grid $mt={32}>
          <GridArea $colSpan={[12]}>
            <Flex>
              <Heading tag="h2" $font={"heading-5"}>
                Lesson resources
              </Heading>
            </Flex>
            <Hr $color={"oakGrey3"} $mt={30} $mb={48} />
          </GridArea>
          <GridArea $colSpan={[6, 3, 2]}>
            <DownloadCard
              id={"downloadElement1"}
              name={"lessonResourcesToDownload"}
              checked={resourcesToDownload["downloadElement1"] || false}
              onChange={() => onResourceToDownloadToggle("downloadElement1")}
              title={"Intro quiz questions"}
              resourceType="quiz"
            />
          </GridArea>
          <GridArea $colSpan={[6, 3, 2]}>
            <DownloadCard
              id={"downloadElement2"}
              name={"lessonResourcesToDownload"}
              checked={resourcesToDownload["downloadElement2"] || false}
              onChange={() => onResourceToDownloadToggle("downloadElement2")}
              title={"Intro quiz answers"}
              resourceType="quiz"
            />
          </GridArea>
          <GridArea $colSpan={[6, 3, 2]}>
            <DownloadCard
              id={"downloadElement3"}
              name={"lessonResourcesToDownload"}
              checked={resourcesToDownload["downloadElement3"] || false}
              onChange={() => onResourceToDownloadToggle("downloadElement3")}
              title={"Presentation"}
              resourceType="presentation"
            />
          </GridArea>
          <GridArea $colSpan={[6, 3, 2]}>
            <DownloadCard
              id={"downloadElement4"}
              name={"lessonResourcesToDownload"}
              checked={resourcesToDownload["downloadElement4"] || false}
              onChange={() => onResourceToDownloadToggle("downloadElement4")}
              title={"Worksheet"}
              resourceType="worksheet"
            />
          </GridArea>
          <GridArea $colSpan={[6, 3, 2]}>
            <DownloadCard
              id={"downloadElement5"}
              name={"lessonResourcesToDownload"}
              checked={resourcesToDownload["downloadElement5"] || false}
              onChange={() => onResourceToDownloadToggle("downloadElement5")}
              title={"Exit quiz questions"}
              resourceType="quiz"
            />
          </GridArea>
          <GridArea $colSpan={[6, 3, 2]}>
            <DownloadCard
              id={"downloadElement6"}
              name={"lessonResourcesToDownload"}
              checked={resourcesToDownload["downloadElement6"] || false}
              onChange={() => onResourceToDownloadToggle("downloadElement6")}
              title={"Exit quiz answers"}
              resourceType="quiz"
            />
          </GridArea>
        </Grid>
      </MaxWidth>
    </AppLayout>
  );
};

export type URLParams = {
  lessonSlug: string;
  keyStageSlug: string;
  subjectSlug: string;
  unitSlug: string;
};

export const getServerSideProps: GetServerSideProps<
  LessonDownloadsPageProps,
  URLParams
> = async (context) => {
  if (!context.params) {
    throw new Error("No context.params");
  }
  const { lessonSlug, keyStageSlug, subjectSlug, unitSlug } = context.params;

  const curriculumData =
    await curriculumApi.teachersKeyStageSubjectUnitLessonsDownloads({
      lessonSlug,
      keyStageSlug,
      subjectSlug,
      unitSlug,
    });

  if (!curriculumData) {
    return {
      notFound: true,
    };
  }

  const results: GetServerSidePropsResult<LessonDownloadsPageProps> = {
    props: {
      curriculumData,
    },
  };
  return results;
};

export default LessonDownloadsPage;
