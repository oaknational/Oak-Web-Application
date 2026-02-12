import { Sdk } from "../../sdk";

import { getPupilsNavData } from "./getPupilsNavData";
import { getTeachersNavData } from "./getTeachersNavData";
import { topNavResponseSchema } from "./topNav.schema";

import errorReporter from "@/common-lib/error-reporter";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import OakError from "@/errors/OakError";

const topNavQuery = (sdk: Sdk) => async (): Promise<TopNavProps> => {
  const res = await sdk.topNav();
  const parsed = topNavResponseSchema.safeParse(res);

  if (!parsed?.success) {
    const error = new OakError({
      code: "curriculum-api/internal-error",
    });
    errorReporter("curriculum-api-2023::topNav")(error, {
      severity: "error",
      res,
      errorMessage: parsed.error,
    });
    return {
      teachers: null,
      pupils: null,
    };
  }

  const teachersNavData = {
    primary: getTeachersNavData(parsed.data, "primary"),
    secondary: getTeachersNavData(parsed.data, "secondary"),
    curriculum: {
      title: "Curriculum",
      slug: "curriculum-landing-page" as const,
    },
    aboutUs: {
      title: "About us",
      slug: "about-us" as const,
      children: [
        { title: "Who we are", slug: "about-who-we-are" as const },
        { title: "Leadership", slug: "about-leadership" as const },
        { title: "Board", slug: "about-board" as const },
        { title: "Partners", slug: "about-partners" as const },
        { title: "Work with us", slug: "about-work-with-us" as const },
        { title: "Contact us", slug: "contact" as const },
      ],
    },
    guidance: {
      title: "Guidance",
      slug: "guidance" as const,
      children: [
        { title: "Plan a lesson", slug: "lesson-planning" as const },
        { title: "Support your team", slug: "support-your-team" as const },
        { title: "Blogs", slug: "blog-index" as const },
        { title: "Webinars", slug: "webinar-index" as const },
        { title: "Help", slug: "help" as const, external: true },
      ],
    },
    aiExperiments: {
      title: "AI experiments",
      slug: "labs" as const,
      external: true,
    },
  };

  const pupilsNavData = {
    primary: getPupilsNavData(parsed.data, "primary"),
    secondary: getPupilsNavData(parsed.data, "secondary"),
  };

  return {
    teachers: teachersNavData,
    pupils: pupilsNavData,
  };
};

export default topNavQuery;
