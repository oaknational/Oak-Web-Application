import React, { FC } from "react";
import { OakLI, OakUL, OakFlex } from "@oaknational/oak-components";

import UnitListItem, {
  UnitListItemProps,
  SpecialistListItemProps,
} from "@/components/TeacherComponents/UnitListItem/UnitListItem";
import Box from "@/components/SharedComponents/Box";
import Pagination, {
  PaginationProps,
} from "@/components/SharedComponents/Pagination";
import { UnitListingData } from "@/node-lib/curriculum-api";
import UnitListOptionalityCard from "@/components/TeacherComponents/UnitListOptionalityCard";
import { UnitOption } from "@/components/TeacherComponents/UnitListOptionalityCard/UnitListOptionalityCard";
import {
  SpecialistUnit,
  SpecialistUnitListingData,
} from "@/node-lib/curriculum-api-2023/queries/specialistUnitListing/specialistUnitListing.schema";

export type Tier = {
  title: string;
  slug: string;
  unitCount: number | null;
};

type PageSize = { pageSize: number };
type CurrenPageItemsProps = Omit<UnitListItemProps, "index" | "onClick">[];

export type UnitListProps = (UnitListingData | SpecialistUnitListingData) & {
  currentPageItems: CurrenPageItemsProps[] | SpecialistUnit[][];
  paginationProps: PaginationProps & PageSize;
  onClick: (props: UnitListItemProps | SpecialistListItemProps) => void;
};

const UnitList: FC<UnitListProps> = (props) => {
  const { units, paginationProps, currentPageItems, onClick } = props;
  const { currentPage, pageSize, firstItemRef } = paginationProps;

  const isUnitOption = (
    x: Omit<UnitListItemProps, "onClick" | "index">[] | SpecialistUnit[],
  ): x is UnitOption[] => {
    if (x[0]) {
      return "keyStageTitle" in x[0];
    } else {
      return false;
    }
  };

  return (
    <OakFlex $flexDirection="column">
      {currentPageItems.length ? (
        <>
          <OakUL aria-label="A list of units" $reset>
            {currentPageItems.map((item, index) => (
              <OakLI
                key={`UnitList-UnitListItem-${item[0]?.slug}`}
                data-testid="unit-list-item"
              >
                {item.length > 1 && isUnitOption(item) ? (
                  <>
                    <UnitListOptionalityCard
                      unitOptions={item}
                      index={index + pageSize * (currentPage - 1)}
                      onClick={onClick}
                    />
                  </>
                ) : (
                  <OakFlex>
                    {" "}
                    {item.map((unitOption) => {
                      return (
                        <UnitListItem
                          {...unitOption}
                          key={`UnitList-UnitListItem-UnitListOption-${unitOption.slug}`}
                          hideTopHeading
                          index={index + pageSize * (currentPage - 1)}
                          firstItemRef={index === 0 ? firstItemRef : null}
                          onClick={onClick}
                        />
                      );
                    })}
                  </OakFlex>
                )}
              </OakLI>
            ))}
          </OakUL>
        </>
      ) : null}
      {units.length > 5 ? (
        <Box $width="100%" $mt={[0, "auto"]} $pb={[30, 44]} $pt={[46, 36]}>
          <Pagination
            pageName={props.subjectTitle}
            {...paginationProps}
            firstItemRef={firstItemRef}
          />
        </Box>
      ) : (
        <Box $pb={32} />
      )}
    </OakFlex>
  );
};

export default UnitList;
