import { Sdk } from "../../sdk";

import { getPupilsNavData } from "./getPupilsNavData";
import { getTeachersNavData } from "./getTeachersNavData";
import {
  topNavResponseSchema,
  TeachersSubNavData,
  PupilsSubNavData,
} from "./topNav.schema";

import { cacheData } from "@/node-lib/cache";
import errorReporter from "@/common-lib/error-reporter";
import { resolveOakHref } from "@/common-lib/urls";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import OakError from "@/errors/OakError";

const topNavQuery = (sdk: Sdk) => {
  const cachedTopNav = cacheData(sdk.topNav, [
    "curriculum-api",
    "top-nav-query",
  ]);

  /**
   * @param withCache - whether to cache the query results (only officially supported under app router)
   */
  return async (options?: { withCache?: boolean }): Promise<TopNavProps> => {
    let res: Awaited<ReturnType<typeof sdk.topNav>>;

    if (options?.withCache) {
      res = await cachedTopNav();
    } else {
      res = await sdk.topNav();
    }

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

    const curriculumPhaseOptionsWithoutCore = parsed.data.phaseOptions.map(
      (subject) => ({
        ...subject,
        ks4_options:
          subject.ks4_options?.filter(({ slug }) => slug !== "core") ?? null,
      }),
    );

    const teachersNavData: TeachersSubNavData = {
      primary: getTeachersNavData(
        parsed.data,
        "primary",
        curriculumPhaseOptionsWithoutCore,
      ),
      secondary: getTeachersNavData(
        parsed.data,
        "secondary",
        curriculumPhaseOptionsWithoutCore,
      ),
      guidance: {
        title: "Guidance",
        slug: "guidance",
        children: [
          {
            title: "Plan a lesson",
            slug: "lesson-planning",
            href: resolveOakHref({ page: "lesson-planning" }),
          },
          {
            title: "Blogs",
            slug: "blog-index",
            href: resolveOakHref({ page: "blog-index" }),
          },
          {
            title: "Webinars",
            slug: "webinar-index",
            href: resolveOakHref({ page: "webinar-index" }),
          },
          {
            title: "Help",
            slug: "help",
            href: resolveOakHref({ page: "help" }),
            external: true,
          },
        ],
      },
      aboutUs: {
        title: "About us",
        slug: "aboutUs",
        children: [
          {
            title: "Who we are",
            slug: "about-who-we-are",
            href: resolveOakHref({ page: "about-who-we-are" }),
          },
          {
            title: "Meet the team",
            slug: "about-meet-the-team",
            href: resolveOakHref({ page: "about-meet-the-team" }),
          },
          {
            title: "Oak's curricula",
            slug: "about-oaks-curricula",
            href: resolveOakHref({ page: "about-oaks-curricula" }),
          },
          {
            title: "Get involved",
            slug: "about-get-involved",
            href: resolveOakHref({ page: "about-get-involved" }),
          },
          {
            title: "Contact us",
            slug: "contact",
            href: resolveOakHref({ page: "contact" }),
          },
        ],
      },
      aiExperiments: {
        title: "AI experiments",
        slug: "labs",
        href: resolveOakHref({ page: "labs" }),
        external: true,
      },
    };

    const pupilsNavData: PupilsSubNavData = {
      primary: getPupilsNavData(parsed.data, "primary"),
      secondary: getPupilsNavData(parsed.data, "secondary"),
      help: {
        title: "Help using Oak",
        slug: "help",
        href: resolveOakHref({ page: "pupil-help" }),
        external: true,
      },
    };

    return {
      teachers: teachersNavData,
      pupils: pupilsNavData,
    };
  };
};

export default topNavQuery;
