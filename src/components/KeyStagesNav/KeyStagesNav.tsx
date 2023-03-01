import { FC } from "react";

import ButtonAsLink from "../Button/ButtonAsLink";
import Flex from "../Flex";
import OakLink from "../OakLink";
import { P } from "../Typography";

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
      <Flex $flexDirection={["column", "row", "row"]}>
        {keyStages.map((keyStage) => (
          <Flex
            key={keyStage.name}
            $mr={[12, 12, 64]}
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
              <P key={index} $mb={16}>
                <OakLink page={null} href={year.url}>
                  {year.name}
                </OakLink>
              </P>
            ))}
          </Flex>
        ))}
      </Flex>
    </nav>
  );
};

export default KeyStagesNav;
