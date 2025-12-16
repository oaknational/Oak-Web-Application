import { Sdk } from "../../sdk";

import { getPupilsNavData } from "./getPupilsNavData";
import { getTeachersNavData } from "./getTeachersNavData";
import { TopNav, topNavResponseSchema } from "./topNav.schema";

import OakError from "@/errors/OakError";

const topNavQuery = (sdk: Sdk) => async (): Promise<TopNav> => {
  const res = await sdk.topNav();

  const parsed = topNavResponseSchema.safeParse(res);

  if (!parsed || !parsed.success) {
    throw new OakError({
      code: "curriculum-api/internal-error",
    });
  }

  const teachersNavData = {
    primary: getTeachersNavData(parsed.data, "primary"),
    secondary: getTeachersNavData(parsed.data, "secondary"),
    aboutUs: [],
    guidance: [],
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
