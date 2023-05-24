import { FC } from "react";

import Flex from "../Flex";
import Button from "../Button";
import { P, Span } from "../Typography";
import { UseSearchFiltersReturnType } from "../../context/Search/useSearchFilters";

type ActiveFiltersProps = {
  searchFilters: UseSearchFiltersReturnType;
};
const ActiveFilters: FC<ActiveFiltersProps> = (props) => {
  const { searchFilters } = props;
  const { keyStageFilters, subjectFilters } = searchFilters;

  const activeFilters = [
    ...keyStageFilters.filter((keyStage) => keyStage.checked),
    ...subjectFilters.filter((subject) => subject.checked),
  ];

  const maxActiveFilters = 4;
  const slicedActiveFilters = activeFilters.slice(0, maxActiveFilters);

  return (
    <Flex
      $alignItems={["flex-start", "center"]}
      $flexDirection={["column", "row"]}
      $minHeight={44}
    >
      <P $mr={20} $mt={8} $mb={8} $color={["oakGrey4", "black"]}>
        Active filters: {activeFilters.length === 0 && "no filters set"}
      </P>
      <Flex $flexWrap={"wrap"} $alignItems={"center"}>
        {slicedActiveFilters.map(({ slug, title, shortCode, onChange }) => (
          <Button
            label={shortCode || title}
            aria-label={`Remove ${title} filter`}
            key={`active-filter-${title}-${slug}`}
            onClick={onChange}
            variant="buttonStyledAsLink"
            icon="cross"
            $iconPosition="trailing"
            $mr={16}
          />
        ))}
        {activeFilters.length > maxActiveFilters && (
          <Span $font="body-1-bold">...</Span>
        )}
      </Flex>
    </Flex>
  );
};

export default ActiveFilters;
