import { OakFlex, OakFlexProps } from "@oaknational/oak-components";

import ButtonAsLink, {
  ButtonAsLinkProps,
} from "@/components/SharedComponents/Button/ButtonAsLink";

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
}: OakFlexProps & {
  label: string;
  links: ButtonAsLinkProps[];
}) => {
  return (
    <OakFlex
      as="nav"
      aria-label={label}
      $pv={"inner-padding-ssx"}
      {...flexProps}
    >
      {links.map((link, i) => {
        return (
          <ButtonAsLink
            {...link}
            size="small"
            variant="minimal"
            aria-current={link.isCurrent ? "page" : undefined}
            key={`TabularNav-${link.page}-${i}`}
            $mr={[24, 24]}
          />
        );
      })}
    </OakFlex>
  );
};

export default TabularNav;
