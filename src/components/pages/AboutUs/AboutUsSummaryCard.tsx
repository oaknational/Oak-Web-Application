import { reducedAboutNavLinks } from "../../../browser-lib/fixtures/aboutNav";
import { AboutBoardPage, AboutWhoWeArePage } from "../../../node-lib/cms";
import ButtonLinkNav from "../../ButtonLinkNav/ButtonLinkNav";
import SummaryCard from "../../Card/SummaryCard";

/**
 * # AboutUsSummaryCard
 *
 * Extension of SummaryCard which includes navigation for "About Us" subpages
 *
 * ## Usage
 *
 * Belongs at the top of each "About Us" sub-page
 */
const AboutUsSummaryCard = ({
  title,
  heading,
  summaryPortableText,
}: Pick<
  AboutWhoWeArePage | AboutBoardPage,
  "title" | "heading" | "summaryPortableText"
>) => {
  return (
    <SummaryCard
      title={title}
      heading={heading}
      summary={summaryPortableText}
      imageProps={{
        src: "/images/oak-logo.svg",
        alt: "",
      }}
      imageContainerProps={{
        $minHeight: 220,
        $mr: 32,
      }}
    >
      <ButtonLinkNav
        $mt={36}
        buttons={reducedAboutNavLinks}
        ariaLabel="about us"
      />
    </SummaryCard>
  );
};

export default AboutUsSummaryCard;
