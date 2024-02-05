import { FC } from "react";
import { OakPrimaryNav, OakBox } from "@oaknational/oak-components";

import aboutNavLinks from "@/browser-lib/fixtures/aboutNav";
import useIsCurrent from "@/components/SharedComponents/useIsCurrent/useIsCurrent";
import SummaryCard, {
  SummaryCardProps,
} from "@/components/SharedComponents/Card/SummaryCard";
import GenericSummaryCardNavButton from "@/components/GenericPagesComponents/GenericSummaryCardNavButton";

type GenericSummaryCardProps = Pick<
  SummaryCardProps,
  "title" | "heading" | "summaryPortableText" | "summaryCardImage"
>;
/**
 * Extension of SummaryCard which includes navigation for "About Us" subpages
 *
 * ## Usage
 *
 * Belongs at the top of each "About Us" sub-page
 */


const GenericSummaryCard: FC<GenericSummaryCardProps> = (props) => {

  const oakNavItems = aboutNavLinks.map(link => ({
    href: link.href,
    children: link.label,
    isCurrent: useIsCurrent({ href: link.href }),
  }));

  return (
    <SummaryCard
      {...props}
      imageContainerProps={{
        $minHeight: 220,
        $mr: 32,
        $minWidth: 166,
      }}
    >
      {/* old mobile nav to be ported over to oak-components */}
      <OakBox $mt="space-between-m2" $display={["flex", "none"]}>
        <GenericSummaryCardNavButton
          buttons={aboutNavLinks}
          ariaLabel="about us"
        />
      </OakBox>

      {/* desktop nav coming from oak-components */}
      <OakBox $mt="space-between-m2" $display={["none", "flex"]}>
        <OakPrimaryNav 
          navItems={oakNavItems}
          ariaLabel="about us"
        />
      </OakBox>
    </SummaryCard>
  );
};

export default GenericSummaryCard;
