import { FC } from "react";
import { useRouter } from "next/router";

import Box from "../Box";
import Flex from "../Flex";
import Pagination, { PaginationProps } from "../Pagination";
import { Heading, LI, Span, UL } from "../Typography";
import { HeadingTag } from "../Typography/Heading";
import OakLink from "../OakLink";

import UnitListItem from "./UnitListItem";
import { UnitListItemProps } from "./UnitListItem/UnitListItem";

export type Tier = {
  title: "Foundation" | "Core" | "Higher";
  slug: "foundation" | "core" | "higher";
  unitCount: number;
};

export type UnitListProps = {
  units: UnitListItemProps[];
  paginationProps: PaginationProps;
  headingTag: HeadingTag;
  tiers?: Tier[];
};
/**
 * Contains a list of Units
 * displays an upcoming webinar at the top.
 *
 * ## Usage
 *
 * Use `useUnitList()` to get props to pass to `<UnitList />`
 */
const UnitList: FC<UnitListProps> = (props) => {
  const { units, paginationProps, headingTag, tiers } = props;
  const router = useRouter();

  return (
    <Flex $flexDirection="column">
      <Heading $mb={24} tag={headingTag}>
        Units
      </Heading>
      <Flex $mb={32}>
        {tiers &&
          tiers.map(({ title, slug, unitCount }) => (
            // @todo change page to unit when slug page when it exists
            <OakLink
              path={router.pathname}
              selectedTier={{ tier: slug }}
              page={"unit-tiers"}
            >
              <Span
                $font={"heading-7"}
                $mr={32}
              >{`${title} (${unitCount})`}</Span>
            </OakLink>
          ))}
      </Flex>

      {units.length ? (
        <>
          <UL $reset>
            {units.map((item, i) => (
              <LI key={`UnitList-UnitListItem-${i}`}>
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
