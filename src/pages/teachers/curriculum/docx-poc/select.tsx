import { useState } from "react";
import {
  OakBox,
  OakHeading,
  OakPrimaryButton,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import AppLayout from "@/components/SharedComponents/AppLayout";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Box from "@/components/SharedComponents/Box";
import Autocomplete, {
  AutocompleteItem,
} from "@/components/CurriculumComponents/OakComponentsKitchen/Autocomplete";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

type CurriculumItem = {
  subjectSlug: string;
  subjectTitle: string;
  phaseSlug: string;
  phaseTitle: string;
  examboardSlug: string | null;
  examboardTitle: string | null;
  state: string;
};

export default function Page({
  curriculumList,
}: {
  curriculumList: CurriculumItem[];
}) {
  const [selectedCurriculumIndex, setSelectedCurriculumIndex] =
    useState<string>("");
  const router = useRouter();

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: "Curriculum downloads - DOCX POC",
          description: "Curriculum downloads - DOCX POC",
        }),
      }}
      $background={"grey20"}
    >
      <OakThemeProvider theme={oakDefaultTheme}>
        <Flex $justifyContent={"center"} $background={"mint"}>
          <MaxWidth $ph={16}>
            <OakHeading
              tag="h1"
              $font={"heading-2"}
              $mt="space-between-l"
              $mb="space-between-s"
            >
              Curriculum downloads
            </OakHeading>
            <Box $maxWidth={960} $mb={40}>
              <Flex
                $flexDirection={"column"}
                $maxWidth={510}
                $mt={40}
                $gap={10}
              >
                <OakBox $mb="space-between-m">
                  <Autocomplete
                    inputProps={{
                      label: "Choose curriculum",
                      id: "curriculum",
                      error: undefined,
                    }}
                    onChange={(value) => {
                      setSelectedCurriculumIndex(value);
                    }}
                    value={selectedCurriculumIndex}
                  >
                    {curriculumList.map((item, index) => {
                      let text = `${item.subjectTitle} - ${item.phaseTitle} - ${item.state}`;
                      if (item.examboardSlug) {
                        text += ` - ${item.examboardTitle}`;
                      }
                      const element = <>{text}</>;
                      return (
                        <AutocompleteItem key={index} textValue={text}>
                          {element}
                        </AutocompleteItem>
                      );
                    })}
                  </Autocomplete>
                </OakBox>
              </Flex>

              <OakPrimaryButton
                disabled={!selectedCurriculumIndex}
                onClick={() => {
                  const curriculum =
                    curriculumList[parseInt(selectedCurriculumIndex, 10)];
                  if (!curriculum) {
                    return;
                  }

                  router.push(
                    `/teachers/curriculum/docx-poc/${curriculum.subjectSlug}/${
                      curriculum.phaseSlug
                    }/${curriculum.state}${
                      curriculum.examboardSlug
                        ? `/${curriculum.examboardSlug}`
                        : ""
                    }`,
                  );
                }}
                iconName="arrow-right"
              >
                Go to download page
              </OakPrimaryButton>
            </Box>
          </MaxWidth>
        </Flex>
      </OakThemeProvider>
    </AppLayout>
  );
}

export const getServerSideProps = async () => {
  const subjectPhaseOptions =
    await curriculumApi2023.subjectPhaseOptionsIncludeNew();
  const curriculumList: CurriculumItem[] = [];

  // Flatten the subject, phase and examboard into a list of curriculum items
  // Note: Examboards are only applicable to secondary phase
  // TODO: Refactor this to use a more generic approach, having to do it this way as the current MV here isn't ideal.
  // The SubjectPhasePicker does a similar thing with examboards and this MV.
  subjectPhaseOptions.forEach((subject) => {
    subject.phases.forEach((phase) => {
      if (phase.slug === "primary" || !subject.examboards) {
        curriculumList.push({
          subjectSlug: subject.slug,
          subjectTitle: subject.title,
          phaseSlug: phase.slug,
          phaseTitle: phase.title,
          examboardSlug: null,
          examboardTitle: null,
          state: subject.state,
        });
      } else if (phase.slug === "secondary") {
        subject.examboards.forEach((examboard) => {
          curriculumList.push({
            subjectSlug: subject.slug,
            subjectTitle: subject.title,
            phaseSlug: phase.slug,
            phaseTitle: phase.title,
            examboardSlug: examboard.slug,
            examboardTitle: examboard.title,
            state: subject.state,
          });
        });
      }
    });
  });

  return {
    props: { curriculumList },
  };
};
