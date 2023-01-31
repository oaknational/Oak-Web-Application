import { FC } from "react";

import Box from "../../Box";
import Flex from "../../Flex";
import Pagination, { PaginationProps } from "../../Pagination";
import { LI, UL } from "../../Typography";
import { TeachersKeyStageSubjectUnitsData } from "../../../node-lib/curriculum-api";

import UnitListItem from "./UnitListItem";
import { UnitListItemProps } from "./UnitListItem/UnitListItem";

export type Tier = {
  title: string;
  slug: string;
  unitCount: number | null;
};

type PageSize = { pageSize: number };
type CurrenPageItemsProps = Omit<UnitListItemProps, "index">;

export type UnitListProps = TeachersKeyStageSubjectUnitsData & {
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
  const { currentPage, pageSize } = paginationProps;

  return (
    <Flex $flexDirection="column">
      {currentPageItems.length ? (
        <>
          <UL $reset>
            {currentPageItems.map((item, index) => (
              <LI key={`UnitList-UnitListItem-${item.slug}`}>
                <UnitListItem
                  {...item}
                  hideTopHeading
                  index={index + pageSize * (currentPage - 1)}
                />
              </LI>
            ))}
          </UL>
        </>
      ) : null}
      {units.length > 5 && (
        <Box $width="100%" $mt={[0, "auto"]} $pt={48}>
          <Pagination {...paginationProps} />
        </Box>
      )}
    </Flex>
  );
};

export default UnitList;
