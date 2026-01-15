import { useEffect, useState } from "react";
import {
  isValidIconName,
  OakFlex,
  OakPupilJourneyYearButton,
  OakUL,
  OakLI,
  OakHeading,
  OakSvg,
  OakBox,
  OakGrid,
  OakLeftAlignedButton,
  OakSubjectIconButton,
  OakPrimaryInvertedButton,
} from "@oaknational/oak-components";

import useSelectedArea from "@/hooks/useSelectedArea";
import { resolveOakHref, ResolveOakHrefProps } from "@/common-lib/urls";
import {
  TeachersSubNavData,
  PupilsSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

type TopNavDropdownProps = {
  selectedMenu: keyof TeachersSubNavData | keyof PupilsSubNavData;
  teachers: TeachersSubNavData;
  pupils: PupilsSubNavData;
};

const getIconName = (subjectSlug: string) => {
  const iconName = `subject-${subjectSlug}`;
  return isValidIconName(iconName) ? iconName : "question-mark";
};

const getSubjectLinkProps = ({
  programmeCount,
  subjectSlug,
  programmeSlug,
  keyStageSlug,
}: {
  programmeCount: number;
  subjectSlug: string;
  programmeSlug: string | null;
  keyStageSlug?: string;
}): ResolveOakHrefProps => {
  return programmeCount > 1 && keyStageSlug
    ? // If there are multiple programmes, link to the programme listing page
      {
        page: "programme-index",
        subjectSlug,
        keyStageSlug,
      }
    : // If there is only one programme, link to the unit listing page for that programme
      {
        page: "unit-index",
        programmeSlug: programmeSlug!,
      };
};

const SubjectButtons = ({
  selectedMenu,
  subjects,
  nonCurriculumSubjects,
  keyStageSlug,
  keyStageTitle,
}: {
  selectedMenu: keyof TeachersSubNavData;
  subjects: TeachersSubNavData[
    | "primary"
    | "secondary"]["keystages"][number]["subjects"];
  nonCurriculumSubjects?: TeachersSubNavData[
    | "primary"
    | "secondary"]["keystages"][number]["subjects"];
  keyStageSlug: string;
  keyStageTitle: string;
}) => {
  return (
    <OakUL
      $display={"flex"}
      $flexGrow={1}
      $flexWrap={"wrap"}
      $gap={"spacing-16"}
      $reset
    >
      {(subjects &&
        subjects.length > 0 &&
        subjects.map((subject) => {
          const { programmeCount, subjectSlug, programmeSlug } = subject;

          return (
            <OakLI key={subjectSlug}>
              <OakSubjectIconButton
                variant={"horizontal"}
                key={subjectSlug}
                element="a"
                subjectIconName={getIconName(subjectSlug)}
                href={resolveOakHref(
                  getSubjectLinkProps({
                    programmeCount,
                    subjectSlug,
                    programmeSlug,
                    keyStageSlug,
                  }),
                )}
                phase={selectedMenu as "primary" | "secondary"}
              >
                {subject.title}
              </OakSubjectIconButton>
            </OakLI>
          );
        })) ??
        null}
      {nonCurriculumSubjects &&
        nonCurriculumSubjects.length > 0 &&
        nonCurriculumSubjects.map((subject) => {
          const { programmeCount, subjectSlug, programmeSlug } = subject;

          return (
            <OakLI key={subject.subjectSlug}>
              <OakSubjectIconButton
                variant={"horizontal"}
                key={subjectSlug}
                element="a"
                subjectIconName={getIconName(subjectSlug)}
                href={resolveOakHref(
                  getSubjectLinkProps({
                    programmeCount,
                    subjectSlug,
                    programmeSlug,
                    keyStageSlug,
                  }),
                )}
                phase={"non-curriculum"}
              >
                {subject.title}
              </OakSubjectIconButton>
            </OakLI>
          );
        })}
      <OakLI>
        <OakPrimaryInvertedButton
          element="a"
          iconName="arrow-right"
          isTrailingIcon
          href={resolveOakHref({ page: "subject-index", keyStageSlug })}
        >
          All {keyStageTitle} subjects
        </OakPrimaryInvertedButton>
      </OakLI>
    </OakUL>
  );
};

const TeachersPhaseSection = ({
  selectedMenu,
  menuData,
}: {
  selectedMenu: keyof TeachersSubNavData;
  menuData: TeachersSubNavData["primary" | "secondary"];
}) => {
  const defaultKeystage =
    menuData.keystages[0]?.slug || (selectedMenu === "primary" ? "ks1" : "ks3");

  const [selectedKeystage, setSelectedKeystage] =
    useState<
      TeachersSubNavData["primary" | "secondary"]["keystages"][number]["slug"]
    >(defaultKeystage);

  useEffect(() => {
    setSelectedKeystage(defaultKeystage);
  }, [defaultKeystage]);

  const subjects =
    menuData.keystages
      .find((k) => k.slug === selectedKeystage)
      ?.subjects.filter((subject) => !subject.nonCurriculum) ?? undefined;

  const nonCurriculumSubjects =
    menuData.keystages
      .find((k) => k.slug === selectedKeystage)
      ?.subjects.filter((subject) => subject.nonCurriculum) ?? undefined;
  console.log({ subjects, nonCurriculumSubjects });
  return (
    <OakFlex $gap={"spacing-40"}>
      <OakFlex $flexDirection={"column"} $gap={"spacing-8"}>
        {menuData.keystages.map((keystage) => (
          <OakLeftAlignedButton
            key={keystage.slug}
            iconName="chevron-right"
            isTrailingIcon
            rightAlignIcon
            width={"spacing-160"}
            selected={selectedKeystage === keystage.slug}
            onClick={() => setSelectedKeystage(keystage.slug)}
            aria-current={
              selectedKeystage === keystage.slug ? "true" : undefined
            }
          >
            {keystage.title.replace("KS", "Key stage ")}
          </OakLeftAlignedButton>
        ))}
      </OakFlex>
      {subjects && (
        <SubjectButtons
          selectedMenu={selectedMenu}
          subjects={subjects}
          nonCurriculumSubjects={nonCurriculumSubjects}
          keyStageSlug={selectedKeystage}
          keyStageTitle={
            menuData.keystages.find((k) => k.slug === selectedKeystage)
              ?.title || ""
          }
        />
      )}
    </OakFlex>
  );
};

const TeachersLinksSection = ({
  selectedMenu,
  menuData,
}: {
  selectedMenu: "guidance" | "aboutUs";
  menuData: TeachersSubNavData["guidance" | "aboutUs"];
}) => {
  const sectionTitles = {
    guidance: "Guidance",
    aboutUs: "About us",
  };

  return (
    <OakFlex $flexDirection={"column"} $gap={"spacing-40"}>
      <OakBox $width={"fit-content"} $position={"relative"}>
        <OakHeading tag="h2">{sectionTitles[selectedMenu]}</OakHeading>
        <OakSvg
          $position={"absolute"}
          $color={"mint"}
          $height={"spacing-8"}
          name={"underline"}
        />
      </OakBox>
      <OakGrid
        as="ul"
        $gridTemplateColumns={["1fr 1fr 1fr"]}
        $cg={"spacing-40"}
        $rg={"spacing-8"}
        $pa={"spacing-0"}
        $ma={"spacing-0"}
        style={{ listStyleType: "none" }}
      >
        {menuData.map((link) => (
          <OakLI key={link.slug}>
            <OakLeftAlignedButton
              element={"a"}
              key={link.slug}
              href={resolveOakHref({
                page: link.slug,
              } as ResolveOakHrefProps)}
              iconName={link.external ? "external" : undefined}
              isTrailingIcon={link.external}
              aria-label={
                link.external ? `${link.title} (opens in a new tab)` : undefined
              }
              width={"spacing-160"}
            >
              {link.title}
            </OakLeftAlignedButton>
          </OakLI>
        ))}
      </OakGrid>
    </OakFlex>
  );
};

const PupilsSection = ({
  selectedMenu,
  pupils,
}: {
  selectedMenu: keyof PupilsSubNavData;
  pupils: PupilsSubNavData;
}) => {
  const menuYears = pupils[selectedMenu].years;

  return (
    <OakUL $display={"flex"} $gap={"spacing-16"} $reset>
      {menuYears.map((year) => (
        <OakLI key={year.slug}>
          <OakPupilJourneyYearButton
            phase={selectedMenu}
            key={year.slug}
            element="a"
            href={resolveOakHref({
              page: "pupil-subject-index",
              yearSlug: year.slug,
            })}
          >
            {year.title}
          </OakPupilJourneyYearButton>
        </OakLI>
      ))}
    </OakUL>
  );
};

const TopNavDropdown = (props: TopNavDropdownProps) => {
  const { selectedMenu, teachers, pupils } = props;

  const activeArea = useSelectedArea();

  return (
    <OakFlex $pa={"spacing-40"}>
      {activeArea === "TEACHERS" &&
        (selectedMenu === "primary" || selectedMenu === "secondary") && (
          <TeachersPhaseSection
            selectedMenu={selectedMenu}
            menuData={teachers[selectedMenu]}
          />
        )}
      {activeArea === "TEACHERS" &&
        (selectedMenu === "guidance" || selectedMenu === "aboutUs") && (
          <TeachersLinksSection
            selectedMenu={selectedMenu}
            menuData={teachers[selectedMenu]}
          />
        )}
      {activeArea === "PUPILS" &&
        (selectedMenu === "primary" || selectedMenu === "secondary") && (
          <PupilsSection
            selectedMenu={selectedMenu as keyof PupilsSubNavData}
            pupils={pupils}
          />
        )}
    </OakFlex>
  );
};

export default TopNavDropdown;
