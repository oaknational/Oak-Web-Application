import ButtonAsLink, { ButtonAsLinkProps } from "../Button/ButtonAsLink";
import Flex, { FlexProps } from "../Flex";

/**
 * TabularNav is a 'nav' component which renders 'minimal' (text-link) link
 * buttons as children. The 'current' item is styled different to differentiate
 * it.
 *
 * ## Usage
 *
 * Used for example in the 'unit listing' page to filter by 'tier' (where
 * tiers are available).
 */
const TabularNav = ({
  label,
  links,
  ...flexProps
}: FlexProps & {
  label: string;
  links: ButtonAsLinkProps[];
}) => {
  return (
    <Flex as="nav" aria-label={label} $pv={4} {...flexProps}>
      {links.map((link, i) => {
        return (
          <ButtonAsLink
            {...link}
            size="small"
            variant="minimal"
            key={`TabularNav-${link.page}-${i}`}
            $mr={[24, 24]}
          />
        );
      })}
    </Flex>
  );
};

export default TabularNav;
