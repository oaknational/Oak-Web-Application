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
    aboutUs: [
      { title: "Who we are", slug: "about-who-we-are" },
      { title: "Board", slug: "about-board" },
      { title: "Work with us", slug: "about-work-with-us" },
      { title: "Leadership", slug: "about-leadership" },
      { title: "Partners", slug: "about-partners" },
      { title: "Contact us", slug: "contact" },
    ],
    guidance: [
      { title: "Plan a lesson", slug: "lesson-planning" },
      { title: "Blogs", slug: "blog-index" },
      { title: "Help", slug: "help", external: true },
      { title: "Support your team", slug: "support-your-team" },
      { title: "Webinars", slug: "webinar-index" },
    ],
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
