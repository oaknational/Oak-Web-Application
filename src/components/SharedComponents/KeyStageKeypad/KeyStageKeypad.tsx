import { FC } from "react";
import {
  OakFlex,
  OakHeading,
  OakLI,
  OakPrimaryButton,
  OakPrimaryInvertedButton,
  OakUL,
} from "@oaknational/oak-components";
import Link from "next/link";

import useIsCurrent from "@/components/SharedComponents/useIsCurrent/useIsCurrent";
import { KeyStagesData } from "@/node-lib/curriculum-api-2023";
import { resolveOakHref } from "@/common-lib/urls";

type KeyStageOnClick = {
  trackingOnClick: (
    filterValue: string,
    activeFilters: Record<string, string[]>,
  ) => void;
};

export type KeypadItem = KeyStagesData["keyStages"][number];

export type KeyStageKeypadProps = {
  title: string;
  titleTag?: "h2" | "h3";
  keyStages: KeypadItem[];
} & KeyStageOnClick;

const KeypadLink: FC<KeypadItem & KeyStageOnClick> = (props) => {
  const { shortCode, slug, title, trackingOnClick } = props;
  const isCurrent = useIsCurrent({ keyStageSlug: slug });

  const ButtonVariant = isCurrent ? OakPrimaryButton : OakPrimaryInvertedButton;

  return (
    <ButtonVariant
      element={Link}
      href={resolveOakHref({ page: "subject-index", keyStageSlug: slug })}
      aria-current={isCurrent ? "page" : undefined}
      aria-label={title}
      onClick={() => trackingOnClick(slug, {})}
    >
      {shortCode}
    </ButtonVariant>
  );
};

/**
 * Navigation to keystage and years.
 * ## Usage
 * Used on teachers home page and menu.
 */
const KeyStageKeypad: FC<KeyStageKeypadProps> = ({
  title,
  titleTag = "h2",
  keyStages,
  trackingOnClick,
}) => {
  keyStages.sort((a, b) =>
    a.displayOrder && b.displayOrder ? a.displayOrder - b.displayOrder : 0,
  );

  return (
    <OakFlex
      as="nav"
      $gap="spacing-16"
      $flexDirection="column"
      aria-label="key stages and year groups"
    >
      <OakHeading tag={titleTag} $font={"heading-7"}>
        {title}
      </OakHeading>
      <OakUL $display={"flex"} $gap="spacing-16" $flexWrap={"wrap"}>
        {keyStages.map((ks) => (
          <OakLI $listStyle={"none"} key={`key-stage-li-${ks.slug}`}>
            <KeypadLink {...ks} trackingOnClick={trackingOnClick} />
          </OakLI>
        ))}
      </OakUL>
    </OakFlex>
  );
};

export default KeyStageKeypad;
