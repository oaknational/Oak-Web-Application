import { CTA, CTAInternalLinkEntry } from "../../common-lib/cms-types";
import { resolveOakHref } from "../../common-lib/urls";
import { assertUnreachable } from "../assertUnreachable";

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
    case "curriculumCorePage":
      return resolveOakHref({ page: "develop-your-curriculum" });
    case "contactCorePage":
      return resolveOakHref({ page: "contact" });
    case "landingPage":
      return resolveOakHref({ page: "landing-page", slug: entry.slug });
    case "webinar":
      return resolveOakHref({ page: "webinar-single", slug: entry.slug });
    case "webinarListingPage":
      return resolveOakHref({ page: "webinar-index" });
    case "newsPost":
      return resolveOakHref({ page: "blog-single", slug: entry.slug });
    case "newsListingPage":
      return resolveOakHref({ page: "blog-index" });
    case "policyPage":
      return resolveOakHref({ page: "legal", slug: entry.slug });
    case "attachment":
      return entry.file.asset.url;
    default: {
      const entryJSON = JSON.stringify(entry, null, 2);

      assertUnreachable(
        entry,
        new Error(
          `Error resolving internal href; unexpected entry:\n${entryJSON}`
        )
      );
    }
  }
};

export const anchorMap = {
  formBlock: "form-block",
} as const;

export type anchorKeys = keyof typeof anchorMap;

export const getCTAHref = (cta: CTA): string => {
  if (cta.linkType === "internal") {
    return resolveInternalHref(cta.internal);
  } else if (cta.linkType === "external") {
    return cta.external;
  }
  return `#${anchorMap[cta.anchor]}`;
};
