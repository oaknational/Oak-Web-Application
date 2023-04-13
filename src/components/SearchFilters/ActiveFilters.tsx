import { FC } from "react";

import Flex from "../Flex";
import Button from "../Button";
import { P } from "../Typography";
import { UseKeyStageFiltersReturnType } from "../../context/Search/useKeyStageFilters";

type ActiveFiltersProps = {
  keyStageFilters: UseKeyStageFiltersReturnType;
};
const ActiveFilters: FC<ActiveFiltersProps> = (props) => {
  const { keyStageFilters } = props;

  const activeFilters = keyStageFilters.filter((keyStage) => keyStage.checked);

  return (
    <Flex
      $alignItems={["flex-start", "center"]}
      $flexDirection={["column", "row"]}
      $minHeight={44}
    >
      <P $mr={20} $mt={8} $mb={8} $color={["oakGrey4", "black"]}>
        Active filters: {activeFilters.length === 0 && "no filters set"}
      </P>
      <Flex $alignItems={"center"}>
        {activeFilters.map(({ slug, title, shortCode, onChange }) => (
          <Button
            label={shortCode}
            aria-label={`Remove ${title} filter`}
            key={`active-filter-ks-${slug}`}
            onClick={onChange}
            variant="buttonStyledAsLink"
            icon="cross"
            $iconPosition="trailing"
            $mr={16}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default ActiveFilters;
