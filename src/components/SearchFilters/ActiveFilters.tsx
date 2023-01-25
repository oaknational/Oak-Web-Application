import { FC } from "react";

import { useSearchQuery, KeyStage } from "../../context/Search/SearchContext";
import Flex from "../Flex";
import Button from "../Button";
import { P } from "../Typography";

const ActiveFilters: FC = () => {
  const { keyStages, setKeyStages } = useSearchQuery();

  const onRemoveFilterClick = (keyStage: KeyStage) => {
    const newKeyStages = new Set(keyStages);
    newKeyStages.delete(keyStage);
    setKeyStages(newKeyStages);
  };

  return (
    <Flex
      $alignItems={["flex-start", "center"]}
      $flexDirection={["column", "row"]}
    >
      <P $mr={20} $color={["oakGrey4", "black"]}>
        Active filters:
      </P>
      <Flex $alignItems={"center"}>
        {Array.from(keyStages).map((keyStage: KeyStage) => (
          <Button
            label={`KS${keyStage}`}
            onClick={() => onRemoveFilterClick(keyStage)}
            variant="buttonStyledAsLink"
            icon="Cross"
            $iconPosition="trailing"
            $mr={16}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default ActiveFilters;
