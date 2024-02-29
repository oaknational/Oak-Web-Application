import { Sdk } from "../../sdk";

import {
  SpecialistProgramme,
  SpecialistSubject,
  programmesSchema,
} from "./specialistSubjectListing.schema";
import specialistUnitsAndLessonCountsQuery from "./sepecialistUnitsAndLessonCount.query";

import OakError from "@/errors/OakError";

const getSubjects = async (sdk: Sdk, programmes: SpecialistProgramme[]) => {
  return programmes.reduce(
    async (subjects, programme) => {
      const awaitedSubjects = await subjects;
      const subjectSlug = programme.combined_programme_fields.subject_slug;
      if (!awaitedSubjects.some((s) => s.subjectSlug === subjectSlug)) {
        const { unitCount, lessonCount } =
          await specialistUnitsAndLessonCountsQuery(sdk)({
            subject: subjectSlug,
          });

        const subject = {
          subjectSlug: subjectSlug,
          subjectTitle: programme.combined_programme_fields.subject,
          unitCount: unitCount.aggregate.count,
          lessonCount: lessonCount.aggregate.count,
        };
        awaitedSubjects.push(subject);
      }

      return awaitedSubjects;
    },
    Promise.resolve([] as Array<SpecialistSubject>),
  );
};

const specialistSubjectListingQuery = (sdk: Sdk) => async () => {
  const res = await sdk.specialistSubjectListing();
  const { therapyProgrammes, specialistProgrammes } =
    programmesSchema.parse(res);

  if (!therapyProgrammes || !specialistProgrammes) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }

  return {
    therapies: await getSubjects(sdk, therapyProgrammes),
    specialist: await getSubjects(sdk, specialistProgrammes),
  };
};

export default specialistSubjectListingQuery;
