import { ButtonVariant } from "@/components/SharedComponents/Button/common";
import ButtonAsLink, {
  ButtonAsLinkProps,
} from "@/components/SharedComponents/Button/ButtonAsLink";
import Flex, { FlexProps } from "@/components/SharedComponents/Flex.deprecated";

/**
 * CurriculumHeaderTabNav is a 'nav' component which renders a tab nav specific to curriculum pages.
 *
 * ## Usage
 *
 * It is only used in the CurriculumHeader component so far.
 */
const CurriculumHeaderTabNav = ({
  label,
  links,
  variant = "flat",
  ...flexProps
}: FlexProps & {
  label: string;
  links: ButtonAsLinkProps[];
  variant?: ButtonVariant;
}) => {
  return (
    <Flex
      as="nav"
      aria-label={label}
      $mv={0}
      $pv={0}
      $overflowY={"hidden"}
      $overflowX={"auto"}
      {...flexProps}
    >
      {links.map((link, i) => (
        <ButtonAsLink
          {...link}
          size="large"
          variant={variant}
          aria-current={link.isCurrent ? "page" : undefined}
          key={`CurriculumHeaderTabNav-${link.page}-${i}`}
          $font={["heading-7", "heading-6"]}
          $pt={[3, 0]}
          $ph={20}
        />
      ))}
    </Flex>
  );
};

export default CurriculumHeaderTabNav;
