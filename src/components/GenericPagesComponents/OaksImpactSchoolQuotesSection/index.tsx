import z from "zod";
import { OakGrid, OakGridArea, OakHeading } from "@oaknational/oak-components";

import { NewGutterMaxWidth } from "../NewGutterMaxWidth";
import { OaksImpactSchoolQuote } from "../OaksImpactSchoolQuote";

import { oaksImpactPageSchoolQuotesSchema } from "@/common-lib/cms-types";

export type OaksImpactSchoolQuotesSectionProps = z.infer<
  typeof oaksImpactPageSchoolQuotesSchema
>;

export function OaksImpactSchoolQuotesSection({
  heading,
  cards,
}: Readonly<OaksImpactSchoolQuotesSectionProps>) {
  return (
    <NewGutterMaxWidth>
      <OakHeading
        tag={"h2"}
        $font={["heading-5", "heading-3"]}
        $textAlign={["left", "center"]}
        $mt={["spacing-56", "spacing-80"]}
        $mb={["spacing-24", "spacing-40"]}
      >
        {heading}
      </OakHeading>
      <OakGrid
        as="ul"
        $rg={"spacing-16"}
        $cg={"spacing-16"}
        $pl={"spacing-0"}
        $mv={"spacing-0"}
      >
        {cards.map((item) => (
          <OakGridArea as="li" key={item.quote.organisation} $colSpan={[12, 6]}>
            <OaksImpactSchoolQuote {...item} />
          </OakGridArea>
        ))}
      </OakGrid>
    </NewGutterMaxWidth>
  );
}
