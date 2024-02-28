import { FC } from "react";

import aboutNavLinks from "@/browser-lib/fixtures/aboutNav";
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
  return (
    <SummaryCard
      {...props}
      imageContainerProps={{
        $minHeight: 220,
        $mr: 32,
        $minWidth: 166,
      }}
    >
      <GenericSummaryCardNavButton
        $mt="space-between-m2"
        buttons={aboutNavLinks}
        ariaLabel="about us"
      />
    </SummaryCard>
  );
};

export default GenericSummaryCard;
