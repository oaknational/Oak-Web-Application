import React, { FC } from "react";

import UnitListItem, {
  UnitListItemProps,
  SpecialistListItemProps,
} from "@/components/TeacherComponents/UnitListItem/UnitListItem";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";
import Pagination, {
  PaginationProps,
} from "@/components/SharedComponents/Pagination";
import { LI, UL } from "@/components/SharedComponents/Typography";
import { UnitListingData } from "@/node-lib/curriculum-api";
import UnitListOptionalityCard from "@/components/TeacherComponents/UnitListOptionalityCard";
import {
  SpecialistUnit,
  SpecialistUnitListingData,
} from "@/components/TeacherViews/SpecialistUnitListing/SpecialistUnitListing.view";
import { UnitOption } from "@/components/TeacherComponents/UnitListOptionalityCard/UnitListOptionalityCard";

export type Tier = {
  title: string;
  slug: string;
  unitCount: number | null;
};

type PageSize = { pageSize: number };
type CurrenPageItemsProps = Omit<UnitListItemProps, "index" | "onClick">[];

export type UnitListProps = (UnitListingData | SpecialistUnitListingData) & {
  currentPageItems: CurrenPageItemsProps[] | SpecialistUnit[];
  paginationProps: PaginationProps & PageSize;
  onClick: (props: UnitListItemProps | SpecialistListItemProps) => void;
};

const UnitList: FC<UnitListProps> = (props) => {
  const { units, paginationProps, currentPageItems, onClick } = props;
  const { currentPage, pageSize, firstItemRef } = paginationProps;

  const isUnitOption = (
    x: Omit<UnitListItemProps, "onClick" | "index">[] | SpecialistUnit,
  ): x is UnitOption[] => {
    if (x[0]) {
      return "keyStageTitle" in x;
    } else {
      return false;
    }
  };

  return (
    <Flex $flexDirection="column">
      {currentPageItems.length ? (
        <>
          <UL aria-label="A list of units" $reset>
            {currentPageItems.map((item, index) => (
              <LI key={`UnitList-UnitListItem-${item[0]?.slug}`}>
                {item.length > 1 && isUnitOption(item) ? (
                  <>
                    <UnitListOptionalityCard
                      unitOptions={item}
                      index={index + pageSize * (currentPage - 1)}
                      onClick={onClick}
                    />
                  </>
                ) : (
                  <Flex>
                    {" "}
                    {item.map((unitOption) => {
                      return (
                        <UnitListItem
                          {...unitOption}
                          hideTopHeading
                          index={index + pageSize * (currentPage - 1)}
                          firstItemRef={index === 0 ? firstItemRef : null}
                          onClick={onClick}
                        />
                      );
                    })}
                  </Flex>
                )}
              </LI>
            ))}
          </UL>
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
    </Flex>
  );
};

export default UnitList;
