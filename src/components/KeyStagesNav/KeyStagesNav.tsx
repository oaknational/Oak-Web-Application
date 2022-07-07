import Link from "next/link";
import { FC } from "react";

import ButtonAsLink from "../Button/ButtonAsLink";
import Flex from "../Flex";
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
 * Used on teachers home page.
 */
const KeyStagesNav: FC<KeyStageNavProps> = ({ keyStages }) => {
  return (
    <nav aria-label="links to key stages and year groups.">
      <Flex flexDirection={["column", "row", "row"]}>
        {keyStages.map((keyStage) => (
          <Flex
            key={keyStage.name}
            mr={[12, 12, 64]}
            alignItems={"center"}
            flexDirection={"column"}
          >
            <ButtonAsLink
              icon={"ArrowRight"}
              iconPosition="trailing"
              label={keyStage.name}
              href={keyStage.url}
              mb={16}
            />
            {keyStage.years.map((year: KeyStageYear, index) => (
              <P key={index} mb={16}>
                <Link href={year.url}>{year.name}</Link>
              </P>
            ))}
          </Flex>
        ))}
      </Flex>
    </nav>
  );
};

export default KeyStagesNav;
