export type HighlightColorVariant = "secondary" | "tertiary";

export const getCardListingTextColour = ({
  disabled,
  highlightColorVariant: hightlightColorVariant,
  hasChildCards,
}: {
  disabled?: boolean;
  highlightColorVariant?: HighlightColorVariant;
  hasChildCards: boolean;
}) => {
  if (disabled) {
    return "text-disabled";
  } else if (hasChildCards) {
    return undefined;
  } else if (hightlightColorVariant === "secondary") {
    return "text-inverted";
  }

  return "text-primary";
};

export const getCardListingBackgroundColour = (
  highlightColorVariant?: HighlightColorVariant,
) => {
  switch (highlightColorVariant) {
    case "secondary":
      return "bg-inverted";
    case "tertiary":
      return "bg-decorative1-very-subdued";
    default:
      return "bg-primary";
  }
};

export const getCardListingLinkProps = ({
  disabled,
  href,
  onClickLink,
}: {
  disabled?: boolean;
  href: string;
  onClickLink?: () => void;
}) => {
  // If the card is disabled use a div for the container,
  if (disabled) {
    return { "data-disabled": true, as: "div" as const };
  } else {
    // otherwise use a link element
    return { href, onClick: onClickLink };
  }
};
