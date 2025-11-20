import { NextPage } from "next";
import { notFound } from "next/navigation";
import {
  oakDefaultTheme,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakMaxWidth,
  OakP,
  OakSmallSecondaryButton,
  OakThemeProvider,
} from "@oaknational/oak-components";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { EYFSProgramme } from "@/node-lib/curriculum-api-2023/queries/eyfsListing/eyfsListing.query";

type Props = { curriculumData: EYFSProgramme };
const EYFSPage: NextPage<Props> = (props: Props) => {
  const { curriculumData } = props;
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakMaxWidth>
        <OakGrid>
          <OakGridArea $colSpan={[12, 9]} $mt={"spacing-48"}>
            {Object.entries(curriculumData).map(([slug, programme]) => (
              <OakFlex
                key={slug}
                $flexDirection={"column"}
                $gap={"spacing-12"}
                $mb={"spacing-24"}
              >
                <OakHeading tag="h2" $font={"heading-light-2"}>
                  {programme.programmeFields?.subject ?? ""}
                </OakHeading>
                {Object.entries(programme.units).map(([slug, unit]) => (
                  <OakFlex
                    key={slug}
                    $flexDirection={"column"}
                    $gap={"spacing-12"}
                    $mb={"spacing-16"}
                    $borderRadius={"border-radius-m"}
                    $background={"pink30"}
                    $pa={"spacing-12"}
                  >
                    <OakHeading tag="h3">{unit.unitData.title}</OakHeading>
                    {unit.lessons.map((lesson) => (
                      <OakFlex
                        $flexDirection="column"
                        key={lesson.slug}
                        $borderRadius={"border-radius-m"}
                        $background={"white"}
                        $pa={"spacing-12"}
                      >
                        <OakFlex $gap={"spacing-12"} $alignItems={"center"}>
                          <OakP $font={"body-2-bold"}>{lesson.title}</OakP>
                          <OakSmallSecondaryButton
                            isTrailingIcon
                            iconName="download"
                          >
                            Download lesson
                          </OakSmallSecondaryButton>
                        </OakFlex>
                        {lesson.description && (
                          <OakP $font={"body-3"}>{lesson.description}</OakP>
                        )}
                      </OakFlex>
                    ))}
                  </OakFlex>
                ))}
              </OakFlex>
            ))}
          </OakGridArea>
        </OakGrid>
      </OakMaxWidth>
    </OakThemeProvider>
  );
};

export const getStaticProps = async () => {
  try {
    const curriculumData = await curriculumApi2023.eyfsListing();
    return {
      props: { curriculumData },
    };
  } catch {
    return {
      notFound,
    };
  }
};

export default EYFSPage;
