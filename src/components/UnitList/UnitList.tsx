import { FC } from "react";
import Box from "../Box";

import Flex from "../Flex";
import Pagination, { PaginationProps } from "../Pagination";
import { Hr, LI, UL } from "../Typography";
import UnitListItem from "./UnitListItem";
import { UnitListItemProps } from "./UnitListItem/UnitListItem";

export type UnitListProps = {
  units: UnitListItemProps[];
  paginationProps: PaginationProps;
};
/**
 * Contains a list of UnitListItem with dividers between them. Optionally
 * displays an upcoming webinar at the top.
 *
 * ## Usage
 *
 * Use `useUnitList()` to get props to pass to `<UnitList />`
 */
const UnitList: FC<UnitListProps> = (props) => {
  const { units, paginationProps } = props;

  return (
    <Flex
      $flexDirection="column"
      $alignItems="flex-start"
      $minHeight={[0, 840]}
    >
      {units.length ? (
        <>
          <UL $reset>
            {units.map((item, i) => (
              <LI key={`UnitList-UnitListItem-${i}`}>
                {i !== 0 && <Hr thickness={4} $mv={32} />}
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
