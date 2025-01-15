import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import { CTA, CTAInternalLinkEntry, Link } from "@/common-lib/cms-types";
import { resolveOakHref } from "@/common-lib/urls";
import { assertUnreachable } from "@/utils/assertUnreachable";

/**
 * Mapping of CMS content types to oak pages
 */
export const resolveInternalHref = (entry: CTAInternalLinkEntry): string => {
  switch (entry.contentType) {
    case "homepage":
      return `/`;
    case "aboutCorePage":
    case "aboutCorePage.whoWeAre":
      return resolveOakHref({ page: "about-who-we-are" });
    case "aboutCorePage.board":
      return resolveOakHref({ page: "about-board" });
    case "aboutCorePage.leadership":
      return resolveOakHref({ page: "about-leadership" });
    case "aboutCorePage.partners":
      return resolveOakHref({ page: "about-partners" });
    case "aboutCorePage.workWithUs":
      return resolveOakHref({ page: "about-work-with-us" });
    case "planningCorePage":
      return resolveOakHref({ page: "lesson-planning" });
    case "supportCorePage":
      return resolveOakHref({ page: "support-your-team" });
    case "contactCorePage":
      return resolveOakHref({ page: "contact" });
    case "landingPage":
      return resolveOakHref({ page: "landing-page", lpSlug: entry.slug });
    case "webinar":
      return resolveOakHref({
        page: "webinar-single",
        webinarSlug: entry.slug,
      });
    case "webinarListingPage":
      return resolveOakHref({ page: "webinar-index" });
    case "newsPost":
      return resolveOakHref({ page: "blog-single", blogSlug: entry.slug });
    case "newsListingPage":
      return resolveOakHref({ page: "blog-index" });
    case "policyPage":
      return resolveOakHref({ page: "legal", legalSlug: entry.slug });
    case "attachment":
      return getProxiedSanityAssetUrl(entry.file.asset.url);
    default: {
      const entryJSON = JSON.stringify(entry, null, 2);

      assertUnreachable(
        entry,
        new Error(
          `Error resolving internal href; unexpected entry:\n${entryJSON}`,
        ),
      );
    }
  }
};

export const getLinkHref = (ctaOrLink: CTA | Link): string => {
  if (ctaOrLink.linkType === "internal") {
    return resolveInternalHref(ctaOrLink.internal);
  } else if (ctaOrLink.linkType === "external") {
    return ctaOrLink.external;
  }
  return `#${ctaOrLink.anchor}`;
};
