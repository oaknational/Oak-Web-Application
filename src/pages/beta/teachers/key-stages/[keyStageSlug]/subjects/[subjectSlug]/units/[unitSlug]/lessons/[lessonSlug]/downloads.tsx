import { ChangeEvent, useState } from "react";
import { NextPage, GetServerSideProps, GetServerSidePropsResult } from "next";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";
import { z } from "zod";

import AppLayout from "../../../../../../../../../../../components/AppLayout";
import Flex from "../../../../../../../../../../../components/Flex";
import Box from "../../../../../../../../../../../components/Box";
import MaxWidth from "../../../../../../../../../../../components/MaxWidth/MaxWidth";
import TitleCard from "../../../../../../../../../../../components/Card/SubjectUnitLessonTitleCard";
import {
  Heading,
  Hr,
  P,
} from "../../../../../../../../../../../components/Typography";
import OakLink from "../../../../../../../../../../../components/OakLink";
import Button from "../../../../../../../../../../../components/Button";
import Input from "../../../../../../../../../../../components/Input";
import { getSeoProps } from "../../../../../../../../../../../browser-lib/seo/getSeoProps";
import Grid, {
  GridArea,
} from "../../../../../../../../../../../components/Grid";
import curriculumApi, {
  type TeachersKeyStageSubjectUnitsLessonsDownloadsData,
} from "../../../../../../../../../../../node-lib/curriculum-api";
import downloadSelectedLessonResources from "../../../../../../../../../../../components/DownloadComponents/helpers/downloadLessonResources";
import useDownloadExistenceCheck from "../../../../../../../../../../../components/DownloadComponents/hooks/useDownloadExistenceCheck";
import type {
  ResourcesToDownloadArrayType,
  DownloadResourceType,
} from "../../../../../../../../../../../components/DownloadComponents/downloads.types";
import SchoolPicker from "../../../../../../../../../../../components/SchoolPicker";
import useSchoolPicker from "../../../../../../../../../../../components/SchoolPicker/useSchoolPicker";
import RadioGroup from "../../../../../../../../../../../components/RadioButtons/RadioGroup";
import Radio from "../../../../../../../../../../../components/RadioButtons/Radio";
import TermsAndConditionsCheckbox from "../../../../../../../../../../../components/DownloadComponents/TermsAndConditionsCheckbox";
import Breadcrumbs from "../../../../../../../../../../../components/Breadcrumbs";
import { lessonBreadcrumbArray } from "../[lessonSlug]";
import DownloadCardGroup from "../../../../../../../../../../../components/DownloadComponents/DownloadCard/DownloadCardGroup";

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
  downloads: z.array(z.string()),
});

type DownloadFormValues = z.infer<typeof schema>;
export type DownloadFormProps = {
  onSubmit: (values: DownloadFormValues) => Promise<string | void>;
  email: string;
  terms: boolean;
  downloads: DownloadResourceType[];
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

  const { register, formState, control, watch, setValue } =
    useForm<DownloadFormProps>({
      resolver: zodResolver(schema),
      mode: "onBlur",
    });

  const { errors } = formState;
  const selectedResources = watch().downloads || [];

  const [isAttemptingDownload, setIsAttemptingDownload] =
    useState<boolean>(false);

  const getInitialResourcesToDownloadState = () => {
    const initialResourcesToDownloadState: ResourcesToDownloadArrayType = [];

    downloads?.forEach((download) => {
      if (download.exists && !download.forbidden) {
        initialResourcesToDownloadState.push(download.type);
      }
    });

    return initialResourcesToDownloadState;
  };

  const [resourcesToDownload, setResourcesToDownload] =
    useState<ResourcesToDownloadArrayType>(
      getInitialResourcesToDownloadState()
    );

  const onSelectAllClick = () => setValue("downloads", resourcesToDownload);
  const onDeselectAllClick = () => setValue("downloads", []);

  const allResourcesToDownloadCount = resourcesToDownload.length;
  const selectedResourcesToDownloadCount = selectedResources?.length;

  const debouncedDownloadResources = debounce(
    () => {
      setIsAttemptingDownload(true);
      downloadSelectedLessonResources(slug, selectedResources);
    },
    4000,
    { leading: true }
  );

  const onFormSubmit = async () => {
    await debouncedDownloadResources();
    setTimeout(() => setIsAttemptingDownload(false), 4000);
  };

  useDownloadExistenceCheck({
    lessonSlug: slug,
    resourcesToCheck: resourcesToDownload,
    onComplete: setResourcesToDownload,
  });

  return (
    <AppLayout
      seoProps={getSeoProps({
        title: "Lesson downloads", // @todo add real data
        description: "Lesson downloads",
      })}
    >
      <MaxWidth $ph={[12]} $maxWidth={[480, 840, 1280]}>
        <Box $mv={[24, 48]}>
          {" "}
          <Breadcrumbs
            breadcrumbs={[
              ...lessonBreadcrumbArray(
                keyStageTitle,
                keyStageSlug,
                subjectSlug,
                subjectTitle,
                unitSlug,
                unitTitle
              ),
              {
                oakLinkProps: {
                  page: "lesson-overview",
                  keyStage: keyStageSlug,
                  subject: subjectSlug,
                  unit: unitSlug,
                  slug: slug,
                },
                label: title,
              },
              {
                oakLinkProps: {
                  page: "downloads",
                  keyStage: keyStageSlug,
                  subject: subjectSlug,
                  unit: unitSlug,
                  slug: slug,
                },
                label: "Downloads",
                disabled: true,
              },
            ]}
          />
        </Box>

        <Flex $mb={8} $display={"inline-flex"} $mt={0}>
          <TitleCard
            page={"lesson"}
            keyStage={keyStageTitle}
            keyStageSlug={keyStageSlug}
            subject={subjectTitle}
            subjectSlug={subjectSlug}
            title={`Downloads: ${title}`}
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
            hasError={false}
            inputValue={inputValue}
            setInputValue={onSchoolPickerInputChange}
            schools={data}
            label={"Name of school"}
            setSelectedValue={setSelectedValue}
            required={true}
          />
          <Box $mt={12} $ml={24} $mb={32}>
            <P $mb={12} $font={"body-2"}>
              Or select one of the following:
            </P>
            <Flex>
              <RadioGroup
                validationState={"valid"}
                errorMessage={
                  "Please select/search a school or an option from above"
                }
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
            label="Email address"
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
          <Controller
            control={control}
            name="terms"
            render={({ field: { value, onChange, name, onBlur } }) => {
              const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                return onChange(e.target.checked);
              };
              return (
                <TermsAndConditionsCheckbox
                  name={name}
                  checked={value}
                  onChange={onChangeHandler}
                  onBlur={onBlur}
                  id={"terms"}
                />
              );
            }}
          />
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
          <DownloadCardGroup control={control} downloads={downloads} />

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
                label={"Download .zip"}
                onClick={() => {
                  onFormSubmit();
                }}
                background={"teachersHighlight"}
                icon="download"
                $iconPosition="trailing"
                iconBackground="teachersYellow"
                disabled={
                  isAttemptingDownload || selectedResourcesToDownloadCount === 0
                }
                $mt={8}
                $mb={16}
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
