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

export const getCardListingLinkProps = ({
  disabled,
  href,
  onClickLink,
}: {
  disabled?: boolean;
  href: string;
  onClickLink?: () => void;
}) => {
  // If the card is disabled or has child cards use a div for the container,
  if (disabled) {
    return { "data-disabled": true, as: "div" as const };
  } else {
    // otherwise use a link element
    return { href, onClick: onClickLink };
  }
};
