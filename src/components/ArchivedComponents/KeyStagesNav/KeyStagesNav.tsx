import { FC } from "react";
import { OakP, OakFlex } from "@oaknational/oak-components";

import OwaLink from "@/components/SharedComponents/OwaLink";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";

export type KeyStageYear = {
  name: string;
  url: string;
};

export type KeyStageNavItem = {
  name: string;
  url: string;
  years: KeyStageYear[];
};

type KeyStageNavProps = {
  keyStages: KeyStageNavItem[];
};

/**
 * Navigation to keystage including year links.
 * ## Usage
 * Used on teachers home page.
 */
const KeyStagesNav: FC<KeyStageNavProps> = ({ keyStages }) => {
  return (
    <nav aria-label="key stages and year groups">
      <OakFlex $flexDirection={["column", "row", "row"]}>
        {keyStages.map((keyStage) => (
          <OakFlex
            key={keyStage.name}
            $mr={["space-between-xs", "space-between-xs", "space-between-xl"]}
            $alignItems={"center"}
            $flexDirection={"column"}
          >
            <ButtonAsLink
              icon={"arrow-right"}
              $iconPosition="trailing"
              label={keyStage.name}
              href={keyStage.url}
              $mb={16}
              page={null}
            />
            {keyStage.years.map((year: KeyStageYear, index) => (
              <OakP key={index} $mb="space-between-s">
                <OwaLink page={null} href={year.url}>
                  {year.name}
                </OwaLink>
              </OakP>
            ))}
          </OakFlex>
        ))}
      </OakFlex>
    </nav>
  );
};

export default KeyStagesNav;
