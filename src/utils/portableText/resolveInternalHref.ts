import { CTAInternalLinkEntry } from "../../node-lib/cms/sanity-client/schemas";
import { assertUnreachable } from "../assertUnreachable";

export const resolveInternalHref = (
  entry: CTAInternalLinkEntry
): string | null => {
  switch (entry.contentType) {
    case "aboutCorePage":
      return `/about-us`;
    case "planningCorePage":
      return `/lesson-planning`;
    case "supportCorePage":
      return `/support`;
    case "curriculumCorePage":
      return `/develop-your-curriculum`;
    case "webinar":
      return entry.slug ? `/webinars/${entry.slug}` : null;
    case "webinarListingPage":
      return `/webinars`;
    case "newsPost":
      return entry.slug ? `/blog/${entry.slug}` : null;
    case "newsListingPage":
      return `/blog`;
    case "policyPage":
      return entry.slug ? `/legal/${entry.slug}` : null;
    case "attachment":
      return entry.file.asset.url;
    default:
      console.log(`Error resolving internal href for`, entry);
      assertUnreachable(entry, new Error("Error resolving internal href"));
  }
};
