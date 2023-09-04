import { groupBy } from "lodash";

import OakError from "../../../../errors/OakError";
import { Sdk } from "../../sdk";

import subjectListingSchema, {
  SubjectListingPageData,
} from "./subjectListing.schema";

const subjectListingQuery =
  (sdk: Sdk) => async (args: { keyStageSlug: string }) => {
    const res = await sdk.subjectListing(args);
    const [keyStageSubjects] = res.keyStageSubjects;

    if (!keyStageSubjects) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const { subjects } = keyStageSubjects;

    const groupedSubjects = Object.values(
      groupBy(
        subjects,
        (subject: SubjectListingPageData["subjects"][number]) =>
          subject.subjectSlug,
      ),
    );

    const subjectsWithProgrammeCount = groupedSubjects.map((subject) => {
      return {
        ...subject[0],
        programmeCount: subject.length,
      };
    });

    return subjectListingSchema.parse({
      ...keyStageSubjects,
      subjects: subjectsWithProgrammeCount,
    });
  };

export default subjectListingQuery;
