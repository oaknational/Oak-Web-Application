import { FC } from "react";

import aboutNavLinks from "../../../browser-lib/fixtures/aboutNav";
import ButtonLinkNav from "../../ButtonLinkNav/ButtonLinkNav";
import SummaryCard, { SummaryCardProps } from "../../Card/SummaryCard";

type AboutUsSummaryCardProps = Pick<
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
const AboutUsSummaryCard: FC<AboutUsSummaryCardProps> = (props) => {
  return (
    <SummaryCard
      {...props}
      imageContainerProps={{
        $minHeight: 220,
        $mr: 32,
        $minWidth: 166,
      }}
    >
      <ButtonLinkNav $mt={36} buttons={aboutNavLinks} ariaLabel="about us" />
    </SummaryCard>
  );
};

export default AboutUsSummaryCard;
