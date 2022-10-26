import { CTA, CTAInternalLinkEntry } from "../../common-lib/cms-types";
import { assertUnreachable } from "../assertUnreachable";

export const resolveInternalHref = (entry: CTAInternalLinkEntry): string => {
  switch (entry.contentType) {
    case "homepage":
      return `/`;
    case "aboutCorePage":
    case "aboutCorePage.whoWeAre":
      return `/about-us/who-we-are`;
    case "aboutCorePage.board":
      return `/about-us/board`;
    case "aboutCorePage.leadership":
      return `/about-us/leadership`;
    case "aboutCorePage.partners":
      return `/about-us/partners`;
    case "aboutCorePage.workWithUs":
      return `/about-us/work-with-us`;
    case "planningCorePage":
      return `/lesson-planning`;
    case "supportCorePage":
      return `/support`;
    case "curriculumCorePage":
      return `/develop-your-curriculum`;
    case "contactCorePage":
      return `/contact-us`;
    case "landingPage":
      return `/lp/${entry.slug}`;
    case "webinar":
      return `/webinars/${entry.slug}`;
    case "webinarListingPage":
      return `/webinars`;
    case "newsPost":
      return `/blog/${entry.slug}`;
    case "newsListingPage":
      return `/blog`;
    case "policyPage":
      return `/legal/${entry.slug}`;
    case "attachment":
      return entry.file.asset.url;
    default:
      assertUnreachable(entry, new Error("Error resolving internal href"));
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
