import React, { FC } from "react";

import UnitListItem, {
  UnitListItemProps,
} from "@/components/UnitAndLessonLists/UnitList/UnitListItem/UnitListItem";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";
import Pagination, {
  PaginationProps,
} from "@/components/SharedComponents/Pagination";
import { LI, UL } from "@/components/SharedComponents/Typography";
import { UnitListingData } from "@/node-lib/curriculum-api";
import OptionalityCard from "@/components/OptionalityCard/OptionalityCard";

export type Tier = {
  title: string;
  slug: string;
  unitCount: number | null;
};

type PageSize = { pageSize: number };
type CurrenPageItemsProps = Omit<UnitListItemProps, "index" | "onClick">[];

export type UnitListProps = UnitListingData & {
  currentPageItems: CurrenPageItemsProps[];
  paginationProps: PaginationProps & PageSize;
  onClick: (props: UnitListItemProps) => void;
};

const UnitList: FC<UnitListProps> = (props) => {
  const { units, paginationProps, currentPageItems, onClick } = props;
  const { currentPage, pageSize, firstItemRef } = paginationProps;
  return (
    <Flex $flexDirection="column">
      {currentPageItems.length ? (
        <>
          <UL aria-label="A list of units" $reset>
            {currentPageItems.map((item, index) => (
              <LI key={`UnitList-UnitListItem-${item[0]?.slug}`}>
                {item.length > 1 ? (
                  <>
                    <OptionalityCard
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
