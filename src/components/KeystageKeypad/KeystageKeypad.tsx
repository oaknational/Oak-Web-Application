import { FC } from "react";

import Grid, { GridArea } from "../Grid";
import OakLink from "../OakLink";
import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders";
import { Heading } from "../Typography";

export type KeypadItem = {
  title: string;
  href: string;
};

export type KeystageKeypadProps = {
  keystages: KeypadItem[];
  years?: KeypadItem[];
};

const KeypadLink: FC<KeypadItem> = (props) => {
  const { title, href } = props;
  return (
    <GridArea $colSpan={[3, 3, 3]}>
      <OakLink
        $background={"white"}
        $position={"relative"}
        $justifyContent={"center"}
        $alignItems={"center"}
        $height={28}
        $display={"flex"}
        href={href}
        page={null}
      >
        <BrushBorders color={"white"} />
        <Heading $font={"heading-7"} tag={"h4"}>
          {title}
        </Heading>
      </OakLink>
    </GridArea>
  );
};

/**
 * Navigation to keystage and years.
 * ## Usage
 * Used on teachers home page and menu.
 */
const KeystageKeypad: FC<KeystageKeypadProps> = ({ keystages, years }) => {
  return (
    <nav aria-label="key stages and year groups">
      <Heading $color={"oakGrey4"} $mb={20} tag="h3" $font={"heading-light-7"}>
        Key Stage
      </Heading>
      <Grid $mb={years ? 48 : 24} $cg={24} $ph={8}>
        {keystages.map((keystage) => (
          <KeypadLink key={`keystage:${keystage.title}`} {...keystage} />
        ))}
      </Grid>
      {years && (
        <>
          <Heading
            $color={"oakGrey4"}
            $mb={20}
            tag="h3"
            $font={"heading-light-7"}
          >
            Year
          </Heading>
          <Grid $rg={24} $mb={24} $cg={24} $ph={8}>
            {years.map((years) => (
              <KeypadLink key={`year:${years.title}`} {...years} />
            ))}
          </Grid>
        </>
      )}
    </nav>
  );
};

export default KeystageKeypad;
