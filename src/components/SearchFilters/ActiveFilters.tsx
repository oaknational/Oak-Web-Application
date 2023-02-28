import { FC } from "react";
import { useRouter } from "next/router";

import { useSearchQuery, KeyStage } from "../../context/Search/SearchContext";
import Flex from "../Flex";
import Button from "../Button";
import { P } from "../Typography";

const ActiveFilters: FC = () => {
  const { keyStages, setKeyStages } = useSearchQuery();
  const router = useRouter();

  const onRemoveFilterClick = (keyStage: KeyStage) => {
    const newKeyStages = new Set(keyStages);
    newKeyStages.delete(keyStage);
    setKeyStages(newKeyStages);

    // shallow push with new params
    const chosenKeyStagesArray = Array.from(newKeyStages);
    const chosenKeyStagesString = chosenKeyStagesArray.join(",");
    router.query.keystages = chosenKeyStagesString;
    router.push(router, undefined, { shallow: true });
  };

  return (
    <Flex
      $alignItems={["flex-start", "baseline"]}
      $flexDirection={["column", "row"]}
    >
      <P $mr={20} $mt={8} $mb={8} $color={["oakGrey4", "black"]}>
        Active filters:
      </P>
      <Flex $alignItems={"center"}>
        {Array.from(keyStages).map((keyStage: KeyStage) => (
          <Button
            label={`KS${keyStage}`}
            aria-label={`Active filter for KS${keyStage}`}
            key={`active-filter-ks-${keyStage}`}
            onClick={() => onRemoveFilterClick(keyStage)}
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
