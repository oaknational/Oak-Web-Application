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
import Button from "../../../../../../../../../../../components/Button";
import Input from "../../../../../../../../../../../components/Input";
import Checkbox from "../../../../../../../../../../../components/Checkbox";
import DownloadCard, {
  type DownloadResourceType,
} from "../../../../../../../../../../../components/DownloadCard";
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

export type ResourcesToDownloadType = {
  [key in DownloadResourceType]: boolean;
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

type ResourceTypes = {
  [key: string]: boolean;
};

export const createAndClickHiddenDownloadLink = (url: string) => {
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.setAttribute("download", "test.pdf");
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  return;
};

const LessonDownloadsPage: NextPage<LessonDownloadsPageProps> = ({
  curriculumData,
}) => {
  const {
    title,
    keyStageTitle,
    keyStageSlug,
    subjectSlug,
    subjectTitle,
    slug,
    downloads,
  } = curriculumData;
  const { register, formState } = useForm<DownloadFormProps>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const { errors } = formState;

  const [acceptedTCs, setAcceptedTCs] = useState<boolean>(false);

  const checkExistenceOfSelectedResources = async (
    lessonSlug: string,
    resourceTypesString: string
  ) => {
    if (!process.env.VERCEL_API_URL) {
      throw new TypeError("process.env.VERCEL_API_URL must be defined");
    }

    const checkResourcesExistEndpoint = `${process.env.VERCEL_API_URL}/api/downloads/lesson/${lessonSlug}/check-files?selection=${resourceTypesString}`;
    const res = await fetch(checkResourcesExistEndpoint);
    const { data, error } = await res.json();

    if (!res.ok && error) {
      console.log("checkResourcesExist error", error);
      throw new Error(error);
    } else if (!res.ok) {
      throw new Error("API error");
    }
    console.log("all resources exist");
    return data;
  };

  const downloadSelectedResources = async (
    lessonSlug: string,
    resourceTypes: ResourceTypes
  ) => {
    if (Object.keys(resourceTypes)?.length === 0) {
      console.log("no resources to download");
      return;
    }

    const resourceTypesAsArray = Object.entries(resourceTypes);
    const selectedResourceTypesAsArray = resourceTypesAsArray
      .filter(([, value]) => value === true)
      .map(([key]) => key);

    const selection = selectedResourceTypesAsArray.join(",");

    if (!process.env.VERCEL_API_URL) {
      throw new TypeError("process.env.VERCEL_API_URL must be defined");
    }

    const downloadEnpoint = `${process.env.VERCEL_API_URL}/api/downloads/lesson/${lessonSlug}?selection=${selection}`;

    const doSelectedResourcesExist = await checkExistenceOfSelectedResources(
      lessonSlug,
      selection
    );
    const res = doSelectedResourcesExist && (await fetch(downloadEnpoint));
    const { data, error } = await res.json();

    if (!res.ok && error) {
      throw new Error(error);
    } else if (!res.ok) {
      throw new Error("API error");
    }

    createAndClickHiddenDownloadLink(data.url);
    return data;
  };
  const getInitialResourcesToDownloadState = () => {
    const initialResourcesToDownloadState = {} as ResourcesToDownloadType;

    downloads?.forEach((download) => {
      if (download.exists) {
        initialResourcesToDownloadState[download.type as DownloadResourceType] =
          false;
      }
    });

    return initialResourcesToDownloadState;
  };

  const [resourcesToDownload, setResourcesToDownload] = useState<{
    [key in DownloadResourceType]: boolean;
  }>(getInitialResourcesToDownloadState());

  const onResourceToDownloadToggle = (
    toggledResource: DownloadResourceType
  ) => {
    setResourcesToDownload({
      ...resourcesToDownload,
      [toggledResource]: resourcesToDownload[toggledResource] ? false : true,
    });
  };

  const onSelectAllClick = () => {
    const allResourcesToDownloadKeys = Object.keys(resourcesToDownload);
    const updatedResourcesToDownload = {} as ResourcesToDownloadType;
    allResourcesToDownloadKeys?.forEach((resourceToDownload) => {
      updatedResourcesToDownload[resourceToDownload as DownloadResourceType] =
        true;
    });
    setResourcesToDownload(updatedResourcesToDownload);
  };

  const onDeselectAllClick = () => {
    const allResourcesToDownloadKeys = Object.keys(resourcesToDownload);
    const updatedResourcesToDownload = {} as ResourcesToDownloadType;
    allResourcesToDownloadKeys?.forEach((resourceToDownload) => {
      updatedResourcesToDownload[resourceToDownload as DownloadResourceType] =
        false;
    });
    setResourcesToDownload(updatedResourcesToDownload);
  };

  const allResourcesToDownloadCount = Object.keys(resourcesToDownload).length;
  const selectedResourcesToDownloadCount = Object.keys(
    resourcesToDownload
  ).filter(
    (resource) => resourcesToDownload[resource as DownloadResourceType] === true
  ).length;

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
            <Flex
              $alignItems={["left", "center"]}
              $flexDirection={["column", "row"]}
            >
              <Heading tag="h2" $font={"heading-5"} $mb={[16, 8]}>
                Lesson resources
              </Heading>
              <Box $ml={[0, 48]}>
                <Button
                  label="Select all"
                  variant="minimal"
                  onClick={() => onSelectAllClick()}
                />
                <Button
                  label="Deselect all"
                  variant="minimal"
                  onClick={() => onDeselectAllClick()}
                  $ml={24}
                />
              </Box>
            </Flex>
            <Hr $color={"oakGrey3"} $mt={[18, 30]} $mb={48} />
          </GridArea>
          {downloads?.map((download) => {
            if (download.exists && !download.forbidden) {
              return (
                <GridArea
                  $colSpan={[6, 3, 2]}
                  key={download.type}
                  data-testid={"lessonResourcesToDownload"}
                >
                  <DownloadCard
                    id={download.type}
                    name={"lessonResourcesToDownload"}
                    label={download.label}
                    extension={download.ext}
                    resourceType={download.type as DownloadResourceType}
                    checked={resourcesToDownload[download.type] || false}
                    onChange={() =>
                      onResourceToDownloadToggle(`${download.type}`)
                    }
                  />
                </GridArea>
              );
            }
          })}
          <GridArea $colSpan={[12]}>
            <Hr $color={"oakGrey3"} $mt={48} $mb={[48, 96]} />
            <Flex $justifyContent={"right"} $alignItems={"center"}>
              <P
                $color={"oakGrey4"}
                $font={"body-2"}
                data-testid="selectedResourcesCount"
                $mr={24}
              >
                {`${selectedResourcesToDownloadCount}/${allResourcesToDownloadCount} files selected`}
              </P>
              <Button
                label="Download .zip"
                onClick={() => {
                  downloadSelectedResources(slug, resourcesToDownload);
                }}
                background={"teachersHighlight"}
                icon="Download"
                $iconPosition="trailing"
                iconBackground="teachersYellow"
                $mt={8}
                $mb={8}
                $mr={8}
                $ml={8}
              />
            </Flex>
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
