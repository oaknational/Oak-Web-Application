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
import SchoolPicker from "../../../../../../../../../../../components/SchoolPicker";
import useSchoolPicker from "../../../../../../../../../../../components/SchoolPicker/useSchoolPicker";
import RadioGroup from "../../../../../../../../../../../components/RadioButtons/RadioGroup";
import Radio from "../../../../../../../../../../../components/RadioButtons/Radio";
import Breadcrumbs from "../../../../../../../../../../../components/Breadcrumbs";

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

const LessonDownloadsPage: NextPage<LessonDownloadsPageProps> = ({
  curriculumData,
}) => {
  const {
    title,
    slug,
    keyStageTitle,
    keyStageSlug,
    subjectSlug,
    subjectTitle,
    downloads,
    unitSlug,
    unitTitle,
  } = curriculumData;
  const [selectedRadio, setSelectedRadio] = useState("");
  const { inputValue, setInputValue, selectedValue, setSelectedValue, data } =
    useSchoolPicker();

  const onSchoolPickerInputChange = (value: React.SetStateAction<string>) => {
    if (selectedRadio && selectedValue) {
      setSelectedRadio("");
    }
    setInputValue(value);
  };

  const onRadioChange = (e: string) => {
    if (selectedValue) {
      setInputValue("");
    }
    setSelectedRadio(e);
  };

  const { register, formState } = useForm<DownloadFormProps>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const { errors } = formState;

  const [acceptedTCs, setAcceptedTCs] = useState<boolean>(false);

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
        <Box $mv={[24, 48]}>
          <Breadcrumbs
            breadcrumbs={[
              { href: "/beta/teachers/", label: "Home" },
              {
                href: `/beta/teachers/key-stages/${keyStageSlug}/subjects`,
                label: keyStageTitle,
              },
              {
                href: `/beta/teachers/key-stages/${keyStageSlug}/subjects/${subjectSlug}/units`,
                label: subjectTitle,
              },
              {
                href: `/beta/teachers/key-stages/${keyStageSlug}/subjects/${subjectSlug}/units/${unitSlug}`,
                label: unitTitle,
              },
              {
                href: `/beta/teachers/key-stages/${keyStageSlug}/subjects/${subjectSlug}/units/${unitSlug}/lessons/${slug}`,
                label: title,
              },
              {
                href: `/beta/teachers/key-stages/${keyStageSlug}/subjects/${subjectSlug}/units/${unitSlug}/lessons/${slug}/downloads`,
                label: "Downloads",
                disabled: true,
              },
            ]}
          />
        </Box>
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
          <Heading tag="h3" $font={"heading-7"} $mt={0} $mb={24}>
            Find your school in the field below (required)
          </Heading>
          <SchoolPicker
            inputValue={inputValue}
            setInputValue={onSchoolPickerInputChange}
            schools={data}
            label={"Name of school:"}
            setSelectedValue={setSelectedValue}
          />
          <Box $mt={12} $ml={24} $mb={32}>
            <P $mb={12} $font={"body-2"}>
              Or select one of the following:
            </P>
            <Flex>
              <RadioGroup
                aria-label={"home school or my school isn't listed"}
                value={selectedRadio}
                onChange={onRadioChange}
              >
                <Radio data-testid={"radio-download"} value={"homeschool"}>
                  Homeschool
                </Radio>
                <Radio value={"notListed"}>My school isn’t listed</Radio>
              </RadioGroup>
            </Flex>
          </Box>
          <Heading
            tag="h3"
            $font={"heading-7"}
            $mt={16}
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
            <Hr $color={"oakGrey3"} $mt={48} $mb={96} />
            <Flex $justifyContent={"right"}>
              <P
                $color={"oakGrey4"}
                $font={"body-2"}
                data-testid="selectedResourcesCount"
              >
                {`${selectedResourcesToDownloadCount}/${allResourcesToDownloadCount} files selected`}
              </P>
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
