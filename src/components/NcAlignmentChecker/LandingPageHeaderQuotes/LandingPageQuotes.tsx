import {
  OakCarousel,
  OakGrid,
  OakGridArea,
  OakQuote,
} from "@oaknational/oak-components";

import { NcAlignmentCheckerLandingPageBlock } from "@/common-lib/cms-types";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";

export default function NcAlignmentCheckerLandingPageQuotes(
  block: NcAlignmentCheckerLandingPageBlock<"NcAlignmentCheckerLandingPageQuotes">,
) {
  return (
    <NewGutterMaxWidth>
      <OakGrid>
        <OakGridArea $colStart={[1, 2, 3]} $colSpan={[12, 10, 8]}>
          <OakCarousel
            backLabel="Back"
            containerLabel="Quotes"
            content={block.quotes.map((quote) => {
              const authorImageSrc = quote.image?.asset?.url
                ? getProxiedSanityAssetUrl(quote.image.asset.url)
                : undefined;

              return (
                <OakQuote
                  key={quote.text}
                  authorImageSrc={authorImageSrc}
                  authorName={quote.attribution ?? undefined}
                  authorTitle={[quote.role, quote.organisation]
                    .filter(Boolean)
                    .join(" at ")}
                  color="transparent"
                  hasLeftBorder={false}
                  quote={quote.text}
                />
              );
            })}
            fwdLabel="Forward"
          />
        </OakGridArea>
      </OakGrid>
    </NewGutterMaxWidth>
  );
}
