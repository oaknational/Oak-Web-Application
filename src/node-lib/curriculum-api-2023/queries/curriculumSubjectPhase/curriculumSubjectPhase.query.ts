import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import curriculumSubjectPhaseSchema from "./curriculumSubjectPhase.schema";

const curriculumSubjectPhaseQuery = (sdk: Sdk) => async () => {
  const res = await sdk.curriculumSubjectPhase();
  const [programme] = res.programmes;

  if (!programme) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }

  return curriculumSubjectPhaseSchema.parse(res);
};

export default curriculumSubjectPhaseQuery;
