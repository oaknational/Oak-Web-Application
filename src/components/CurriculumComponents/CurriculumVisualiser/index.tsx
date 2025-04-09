import React, { FC, useState, useRef, useEffect, useMemo } from "react";
import { OakBox } from "@oaknational/oak-components";

import Alert from "../OakComponentsKitchen/Alert";
import { CurricYearCard } from "../CurricYearCard";
import { CurricVisualiserUnitList } from "../CurricVisualiserUnitList";

import { areLessonsAvailable } from "@/utils/curriculum/lessons";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import useAnalytics from "@/context/Analytics/useAnalytics";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";
import UnitModal from "@/components/CurriculumComponents/UnitModal/UnitModal";
import UnitsTabSidebar from "@/components/CurriculumComponents/UnitsTabSidebar";
import {
  getSuffixFromFeatures,
  getYearGroupTitle,
  getYearSubheadingText,
} from "@/utils/curriculum/formatting";
import { anchorIntersectionObserver } from "@/utils/curriculum/dom";
import { isVisibleUnit } from "@/utils/curriculum/isVisibleUnit";
import { sortYears } from "@/utils/curriculum/sorting";
import { createTeacherProgrammeSlug } from "@/utils/curriculum/slugs";
import { filteringFromYears } from "@/utils/curriculum/filtering";
import {
  CurriculumFilters,
  Unit,
  YearData,
  Lesson,
  Thread,
} from "@/utils/curriculum/types";
import { CurriculumUnit } from "@/node-lib/curriculum-api-2023";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";

type CurriculumVisualiserProps = {
  unitData: Unit | null;
  ks4OptionSlug?: string | null;
  yearData: YearData;
  filters: CurriculumFilters;
  mobileHeaderScrollOffset?: number;
  setUnitData: (unit: Unit) => void;
  setVisibleMobileYearRefID: (refID: string) => void;
  threadOptions: Thread[];
  ks4Options: SubjectPhasePickerData["subjects"][number]["ks4_options"];
};

// Function component

const CurriculumVisualiser: FC<CurriculumVisualiserProps> = ({
  unitData,
  ks4OptionSlug,
  yearData,
  mobileHeaderScrollOffset,
  setUnitData,
  filters,
  setVisibleMobileYearRefID,
  threadOptions,
  ks4Options,
}) => {
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  function filterIncludes(key: keyof CurriculumFilters, ids: string[]) {
    const filterValues = filters[key];
    return ids.every((id) => {
      return filterValues.includes(id);
    });
  }

  const selectedThread = useMemo(() => {
    return threadOptions.find((thread) => thread.slug === filters.threads[0]);
  }, [threadOptions, filters]);

  // Selection state helpers
  const [displayModal, setDisplayModal] = useState(false);
  const [unitOptionsAvailable, setUnitOptionsAvailable] =
    useState<boolean>(false);
  const [currentUnitLessons, setCurrentUnitLessons] = useState<Lesson[]>([]);
  const [unitVariantID, setUnitVariantID] = useState<number | null>(null);

  const itemEls = useRef<(HTMLDivElement | null)[]>([]);
  /* Intersection observer to update year filter selection when
  scrolling through the visualiser on mobile */
  useEffect(() => {
    const options = { rootMargin: "-50% 0px 0px 0px" };
    const yearsLoaded = Object.keys(yearData).length;
    // All refs have been created for year groups & data is loaded
    if (yearsLoaded > 0 && itemEls.current.length === yearsLoaded) {
      // const io = new IntersectionObserver(, options);
      const io = new IntersectionObserver(
        anchorIntersectionObserver(setVisibleMobileYearRefID),
        options,
      );

      itemEls.current.forEach((el) => {
        if (el) {
          io.observe(el);
        }
      });
      return () => {
        io.disconnect();
      };
    }
  }, [setVisibleMobileYearRefID, yearData]);

  const trackModalOpenEvent = (
    unit: CurriculumUnit,
    isHighlighted: boolean,
    isOpen: boolean,
  ) => {
    if (isOpen && unit) {
      track.unitOverviewAccessed({
        unitName: unit.title,
        unitSlug: unit.slug,
        subjectTitle: unit.subject,
        subjectSlug: unit.subject_slug,
        yearGroupName: `Year ${unit.year}`,
        yearGroupSlug: unit.year,
        threadTitle: selectedThread?.title ?? null,
        threadSlug: selectedThread?.slug ?? null,
        platform: "owa",
        product: "curriculum visualiser",
        engagementIntent: "use",
        componentType: "unit_info_button",
        eventVersion: "2.0.0",
        analyticsUseCase,
        unitHighlighted: isHighlighted, // bool
        isUnitPublished: areLessonsAvailable(unit.lessons), // bool
      });
    }
  };

  const handleOpenModal = (
    unitOptions: boolean,
    unit: Unit,
    isHighlighted: boolean,
  ) => {
    const newDisplayModal = !displayModal;
    setDisplayModal(newDisplayModal);
    trackModalOpenEvent(unit, isHighlighted, newDisplayModal);
    setUnitOptionsAvailable(unitOptions);
    setUnitData({ ...unit });
    setCurrentUnitLessons(unit.lessons ?? []);
  };

  const handleCloseModal = () => {
    setDisplayModal(false);
    setCurrentUnitLessons([]);
  };

  const yearTypes: ("core" | "non_core")[] = [];
  if (ks4Options?.find((opt) => opt.slug === "core")) {
    yearTypes.push("core");
  }
  if (ks4OptionSlug && ks4OptionSlug !== "core") {
    yearTypes.push("non_core");
  }

  const yearSelectors = yearTypes.flatMap((type) => {
    return Object.keys(yearData)
      .map((year) => ({ year, type }))
      .filter(({ year }) => {
        if (type === "non_core") {
          if (year === "10" || year === "11") {
            return true;
          } else {
            return false;
          }
        } else if (type === "core") {
          if (year === "10" || year === "11") {
            return (
              yearData[year]!.pathways.findIndex(
                (item) => item.pathway_slug === "core",
              ) > -1
            );
          }
        }
        return true;
      })
      .filter(({ year }) => filterIncludes("years", [year]))
      .sort((a, b) => sortYears(a.year, b.year));
  });

  const unitsByYearSelector = yearSelectors
    .map(({ year, type }) => {
      const yearItem = yearData[year] as YearData[string];

      const yearBasedFilters = filteringFromYears(yearData[year]!, filters);
      const isExamboard = type === "non_core";

      const filteredUnits = yearItem.units.filter((unit: Unit) => {
        if (isExamboard && unit.pathway_slug === "core") {
          return false;
        }
        if (
          ["10", "11"].includes(year) &&
          !isExamboard &&
          unit.pathway_slug !== "core"
        ) {
          return false;
        }
        return isVisibleUnit(yearBasedFilters, year, unit);
      });

      return {
        selector: { type, year },
        yearItem,
        units: filteredUnits,
      };
    })
    .filter(({ units }) => {
      return units.length > 0;
    });

  return (
    <OakBox id="content" data-testid="curriculum-visualiser">
      {unitsByYearSelector.flatMap((data, index) => {
        const { year, type } = data.selector;
        const { isSwimming } = data.yearItem;
        const { units } = data;
        const ref = (element: HTMLDivElement) => {
          itemEls.current[index] = element;
        };

        const actions = units[0]?.actions;

        const yearTitle = getYearGroupTitle(
          yearData,
          year,
          getSuffixFromFeatures(actions),
        );

        const yearSubheadingText = getYearSubheadingText(
          yearData,
          year,
          filters,
          type,
        );

        return (
          <OakBox id={year} ref={ref} key={`${year}-${type}`}>
            <AnchorTarget
              $paddingTop={mobileHeaderScrollOffset}
              id={`year-${year}`}
            />
            <CurricYearCard
              isExamboard={type === "non_core"}
              yearTitle={yearTitle}
              yearSubheading={yearSubheadingText}
              additional={
                isSwimming && (
                  <Alert
                    $mb="space-between-s"
                    type="info"
                    message="Swimming and water safety units should be selected based on the ability and experience of your pupils."
                  />
                )
              }
            >
              <CurricVisualiserUnitList
                units={units}
                filters={filters}
                year={year}
                yearData={yearData}
                onOpenModal={handleOpenModal}
              />
            </CurricYearCard>
          </OakBox>
        );
      })}
      {displayModal && (
        <UnitsTabSidebar
          displayModal={displayModal}
          onClose={handleCloseModal}
          lessons={currentUnitLessons}
          programmeSlug={createTeacherProgrammeSlug(
            unitData,
            ks4OptionSlug,
            filters.tiers[0],
            unitData?.pathway_slug ?? undefined,
          )}
          unitOptionsAvailable={unitOptionsAvailable}
          unitSlug={unitData?.slug}
          unitData={unitData}
          unitVariantID={unitVariantID}
        >
          <UnitModal
            setCurrentUnitLessons={setCurrentUnitLessons}
            setUnitVariantID={setUnitVariantID}
            unitData={unitData}
            yearData={yearData}
            displayModal={displayModal}
            setUnitOptionsAvailable={setUnitOptionsAvailable}
            unitOptionsAvailable={unitOptionsAvailable}
            selectedThread={selectedThread?.slug ?? null}
          />
        </UnitsTabSidebar>
      )}
    </OakBox>
  );
};
export default CurriculumVisualiser;
