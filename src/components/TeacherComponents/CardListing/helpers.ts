export type HighlightType = "primary" | "secondary" | "tertiary";

export const getCardListingTextColour = ({
  disabled,
  highlightType = "primary",
  hasChildCards,
}: {
  disabled?: boolean;
  highlightType?: HighlightType;
  hasChildCards: boolean;
}) => {
  if (disabled) {
    return "text-disabled";
  } else if (hasChildCards) {
    return undefined;
  } else if (highlightType === "secondary") {
    return "text-inverted";
  }

  return "text-primary";
};

export const getCardListingBackgroundColour = (
  highlightType: HighlightType = "primary",
) => {
  switch (highlightType) {
    case "secondary":
      return "bg-inverted";
    case "tertiary":
      return "bg-decorative1-very-subdued";
    case "primary":
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
