import {
  OakFlex,
  OakPupilJourneyYearButton,
  OakUL,
  OakLI,
  OakHeading,
  OakSvg,
  OakBox,
  OakGrid,
  OakLeftAlignedButton,
} from "@oaknational/oak-components";

import useSelectedArea from "@/hooks/useSelectedArea";
import { resolveOakHref } from "@/common-lib/urls";
import {
  TeachersSubNavData,
  PupilsSubNavData,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

type TopNavDropdownProps = {
  selectedMenu: keyof TeachersSubNavData | keyof PupilsSubNavData;
  teachers: TeachersSubNavData;
  pupils: PupilsSubNavData;
};

const TeacherPhaseSection = () => {
  return <div>Phase</div>;
};

const TeacherLinksSection = ({
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
              as="a"
              key={link.slug}
              href={resolveOakHref({ page: link.slug })}
              iconName={link.external ? "external" : undefined}
              isTrailingIcon={link.external}
              aria-label={
                link.external ? `${link.title} (opens in a new tab)` : undefined
              }
              $width={"spacing-160"}
            >
              {link.title}
            </OakLeftAlignedButton>
          </OakLI>
        ))}
      </OakGrid>
    </OakFlex>
  );
};

const PupilButtons = ({
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

  console.log({ selectedMenu, activeArea, teachers, pupils });
  return (
    <OakFlex $pa={"spacing-40"}>
      {activeArea === "TEACHERS" &&
        (selectedMenu === "primary" || selectedMenu === "secondary") && (
          <>
            {/* <OakFlex $flexDirection={"column"} $gap={"spacing-8"}>
            {sectionData?.[0]?.keystages.map((keystage) => (
              <OakSmallPrimaryInvertedButton
                key={keystage.title}
                iconName="chevron-right"
                isTrailingIcon
              >
                {keystage.title}
              </OakSmallPrimaryInvertedButton>
            ))}
          </OakFlex> */}
            <TeacherPhaseSection />
          </>
        )}
      {/* <OakFlex>
        {keystageData?.subjects?.map((subject) => <div>{subject.title}</div>)}
      </OakFlex> */}
      {activeArea === "TEACHERS" &&
        (selectedMenu === "guidance" || selectedMenu === "aboutUs") && (
          <TeacherLinksSection
            selectedMenu={selectedMenu}
            menuData={teachers[selectedMenu]}
          />
        )}
      {activeArea === "PUPILS" &&
        (selectedMenu === "primary" || selectedMenu === "secondary") && (
          <PupilButtons
            selectedMenu={selectedMenu as keyof PupilsSubNavData}
            pupils={pupils}
          />
        )}
    </OakFlex>
  );
};

export default TopNavDropdown;
