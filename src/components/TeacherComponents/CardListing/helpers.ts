export const getCardListingDefaultTextColour = ({
  disabled,
  isHighlighted,
  hasChildCards,
}: {
  disabled?: boolean;
  isHighlighted?: boolean;
  hasChildCards: boolean;
}) => {
  if (disabled) {
    return "text-disabled";
  } else if (isHighlighted && !hasChildCards) {
    return "text-inverted";
  }

  // use the default colour value for the component
  return undefined;
};

export const getCardListingBorderColour = ({
  showBorder,
  isHighlighted,
}: {
  showBorder?: boolean;
  isHighlighted: boolean;
}) => {
  if (showBorder) {
    if (isHighlighted) {
      return "border-neutral-stronger";
    } else {
      return "border-neutral-lighter";
    }
  } else {
    return undefined;
  }
};

export const getCardListingLinkProps = ({
  disabled,
  hasChildCards,
  href,
  onClickLink,
}: {
  disabled?: boolean;
  hasChildCards: boolean;
  href: string;
  onClickLink?: () => void;
}) => {
  // If the card is disabled or has child cards use a div for the container,
  if (disabled || hasChildCards) {
    return { "data-disabled": true, as: "div" as const };
  } else {
    // otherwise use a link element
    return { href, onClick: onClickLink };
  }
};
