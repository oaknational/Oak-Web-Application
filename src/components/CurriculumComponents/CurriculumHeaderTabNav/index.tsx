import { ComponentTypeValueType, PhaseValueType } from "@/browser-lib/avo/Avo";
import { ButtonVariant } from "@/components/SharedComponents/Button/common";
import ButtonAsLink, {
  ButtonAsLinkProps,
} from "@/components/SharedComponents/Button/ButtonAsLink";
import Flex, { FlexProps } from "@/components/SharedComponents/Flex.deprecated";
import useAnalytics from "@/context/Analytics/useAnalytics";

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
  trackingData: {
    subjectTitle: string;
    subjectSlug: string;
    phaseSlug: PhaseValueType;
  };
}) => {
  const { subjectTitle, subjectSlug, phaseSlug } = flexProps.trackingData;
  const { track } = useAnalytics();

  const getComponentType = (pageSlug: string | null) => {
    const tab = pageSlug?.split("-")[1];
    return `${tab === "overview" ? "explainer" : tab}_tab` as ComponentTypeValueType;
  };

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
      <ul style={{ display: "contents" }}>
        {links.map((link, i) => (
          <li style={{ display: "contents" }}>
            <ButtonAsLink
              {...link}
              size="large"
              variant={variant}
              aria-current={link.isCurrent ? "page" : undefined}
              key={`CurriculumHeaderTabNav-${link.page}-${i}`}
              $font={["heading-7", "heading-6"]}
              $pt={[3, 0]}
              $ph={20}
              data-testid="header-nav-tab"
              onClick={() => {
                track.curriculumVisualiserTabAccessed({
                  subjectTitle: subjectTitle,
                  subjectSlug: subjectSlug,
                  platform: "owa",
                  product: "curriculum visualiser",
                  engagementIntent: "explore",
                  componentType: getComponentType(link.page),
                  eventVersion: "2.0.0",
                  analyticsUseCase: "Teacher",
                  phase: phaseSlug,
                });
              }}
            />
          </li>
        ))}
      </ul>
    </Flex>
  );
};

export default CurriculumHeaderTabNav;
