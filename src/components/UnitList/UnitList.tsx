import { FC } from "react";

import Box from "../Box";
import Flex from "../Flex";
import Pagination, { PaginationProps } from "../Pagination";
import { Heading, LI, Span, UL } from "../Typography";
import { HeadingTag } from "../Typography/Heading";
import OakLink from "../OakLink";

import UnitListItem from "./UnitListItem";
import { UnitListItemProps } from "./UnitListItem/UnitListItem";

export type Tier = {
  title: string;
  slug: string;
  unitCount: number;
};

export type UnitListProps = {
  units: UnitListItemProps[];
  keyStageSlug: string;
  subjectSlug: string;
  paginationProps: PaginationProps;
  headingTag: HeadingTag;
  tiers?: Tier[];
};
/**
 * Contains a list of units
 *
 * ## Usage
 * Used on subject unit page and search results
 */
const UnitList: FC<UnitListProps> = (props) => {
  const {
    units,
    paginationProps,
    headingTag,
    tiers,
    keyStageSlug,
    subjectSlug,
  } = props;

  return (
    <Flex $flexDirection="column">
      <Flex $flexDirection={["column-reverse", "column"]}>
        <Heading $font={["heading-6", "heading-5"]} $mb={24} tag={headingTag}>
          Units
        </Heading>

        {tiers && (
          <Flex $mb={[24, 32]}>
            {tiers.map(({ title, slug, unitCount }) => (
              <OakLink
                keyStage={keyStageSlug}
                subject={subjectSlug}
                search={{ tier: slug }}
                page={"unit-index"}
              >
                <Span
                  $font={"heading-7"}
                  $mr={[12, 32]}
                >{`${title} (${unitCount})`}</Span>
              </OakLink>
            ))}
          </Flex>
        )}
      </Flex>

      {units.length ? (
        <>
          <UL $reset>
            {units.map((item) => (
              <LI key={`UnitList-UnitListItem-${item.slug}`}>
                <UnitListItem {...item} />
              </LI>
            ))}
          </UL>
        </>
      ) : null}
      {units.length > 20 && (
        <Box $width="100%" $mt={[0, "auto"]} $pt={48}>
          <Pagination {...paginationProps} />
        </Box>
      )}
    </Flex>
  );
};

export default UnitList;
