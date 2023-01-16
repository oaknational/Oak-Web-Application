import { FC } from "react";

import Box from "../Box";
import Flex from "../Flex";
import Pagination, { PaginationProps } from "../Pagination";
import { Heading, LI, UL } from "../Typography";
import { HeadingTag } from "../Typography/Heading";
import TabularNav from "../TabularNav";
import { TeachersKeyStageSubjectUnitsData } from "../../node-lib/curriculum-api";

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
  headingTag: HeadingTag;
};
/**
 * Contains a list of units
 *
 * ## Usage
 * Used on subject, unit and search results page
 */
const UnitList: FC<UnitListProps> = (props) => {
  const {
    units,
    paginationProps,
    headingTag,
    tiers = [],
    keyStageSlug,
    subjectSlug,
    currentPageItems,
    tierSlug,
  } = props;

  const { currentPage, pageSize } = paginationProps;
  return (
    <Flex $flexDirection="column">
      <Flex $flexDirection={["column-reverse", "column"]}>
        <Heading $font={["heading-6", "heading-5"]} $mb={24} tag={headingTag}>
          Units
        </Heading>

        {tiers.length > 0 && (
          <nav aria-label="tiers">
            <TabularNav
              $mb={[10, 16]}
              label="tiers"
              links={tiers.map(({ title, slug, unitCount }) => ({
                label: `${title} (${unitCount})`,
                keyStage: keyStageSlug,
                subject: subjectSlug,
                search: { tier: slug },
                page: "unit-index",
                isCurrent: slug === tierSlug,
              }))}
            />
          </nav>
        )}
      </Flex>

      {currentPageItems.length ? (
        <>
          <UL $reset>
            {currentPageItems.map((item, index) => (
              <LI key={`UnitList-UnitListItem-${item.slug}`}>
                <UnitListItem
                  {...item}
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
