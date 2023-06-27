import { FC } from "react";

import Box from "../../Box";
import Flex from "../../Flex";
import Pagination, { PaginationProps } from "../../Pagination";
import { LI, UL } from "../../Typography";
import { UnitListingData } from "../../../node-lib/curriculum-api";

import UnitListItem from "./UnitListItem";
import { UnitListItemProps } from "./UnitListItem/UnitListItem";

export type Tier = {
  title: string;
  slug: string;
  unitCount: number | null;
};

type PageSize = { pageSize: number };
type CurrenPageItemsProps = Omit<UnitListItemProps, "index">;

export type UnitListProps = UnitListingData & {
  currentPageItems: CurrenPageItemsProps[];
  paginationProps: PaginationProps & PageSize;
};
/**
 * Contains a list of units
 *
 * ## Usage
 * Used on subject, unit and search results page
 */
const UnitList: FC<UnitListProps> = (props) => {
  const { units, paginationProps, currentPageItems } = props;
  const { currentPage, pageSize, firstItemRef } = paginationProps;

  return (
    <Flex $flexDirection="column">
      {currentPageItems.length ? (
        <>
          <UL aria-label="A list of units" $reset>
            {currentPageItems.map((item, index) => (
              <LI key={`UnitList-UnitListItem-${item.slug}`}>
                <UnitListItem
                  {...item}
                  hideTopHeading
                  index={index + pageSize * (currentPage - 1)}
                  firstItemRef={index === 0 ? firstItemRef : null}
                />
              </LI>
            ))}
          </UL>
        </>
      ) : null}
      {units.length > 5 && (
        <Box $width="100%" $mt={[0, "auto"]} $pt={48}>
          <Pagination {...paginationProps} firstItemRef={firstItemRef} />
        </Box>
      )}
    </Flex>
  );
};

export default UnitList;
