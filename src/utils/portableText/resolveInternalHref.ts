import { CTA } from "../../node-lib/cms";
import { CTAInternalLinkEntry } from "../../node-lib/cms/sanity-client/schemas";
import { assertUnreachable } from "../assertUnreachable";

export const resolveInternalHref = (entry: CTAInternalLinkEntry): string => {
  switch (entry.contentType) {
    case "homepage":
      return `/`;
    case "aboutCorePage":
      return `/about-us`;
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

export const getCTAHref = (cta: CTA): string => {
  if (cta.linkType === "internal") {
    return resolveInternalHref(cta.internal);
  } else {
    return cta.external;
  }
};
