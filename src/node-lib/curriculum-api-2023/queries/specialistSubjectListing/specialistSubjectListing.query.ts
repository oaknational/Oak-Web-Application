import { Sdk, getBatchedRequests } from "../../sdk";
import { SpecialistUnitsAndLessonCountDocument } from "../../generated/sdk";

import {
  SpecialistProgramme,
  SpecialistSubject,
  programmesSchema,
  specialistUnitsAndLessonCountSchema,
} from "./specialistSubjectListing.schema";

import OakError from "@/errors/OakError";

const getBatchRequestVariables = (programmes: SpecialistProgramme[]) => {
  return programmes.reduce((acc, programme) => {
    const subjectSlug = programme.combined_programme_fields.subject_slug;
    if (!acc.find((s) => s.subjectSlug === subjectSlug)) {
      const subject = {
        subjectSlug: subjectSlug,
        subjectTitle: programme.combined_programme_fields.subject,
        unitCount: 0,
        lessonCount: 0,
        programmeCount: 0,
      };
      acc.push(subject);
    }
    return acc;
  }, [] as Array<SpecialistSubject>);
};

const populateSubjectsWithBatchResponses = async (
  programmes: SpecialistProgramme[],
) => {
  const counts = getBatchRequestVariables(programmes);
  const batchRequests = counts.map((c) => {
    return {
      document: SpecialistUnitsAndLessonCountDocument,
      variables: { _contains: { subject_slug: c.subjectSlug } },
    };
  });

  const data = await getBatchedRequests(batchRequests);

  return counts.map((p, i) => {
    const res = data[i]?.data;
    if (res) {
      const { unitCount, lessonCount, programmeCount } =
        specialistUnitsAndLessonCountSchema.parse(res);
      p.lessonCount = lessonCount.aggregate.count;
      p.unitCount = unitCount.aggregate.count;
      p.programmeCount = programmeCount.aggregate.count;
      return p;
    } else {
      throw new OakError({ code: "curriculum-api/not-found" });
    }
  });
};

const getProgrammesFromList = (
  programmes: SpecialistSubject[],
  source: SpecialistProgramme[],
) => {
  return programmes.filter((p) =>
    source.find(
      (s) => s.combined_programme_fields.subject_slug === p.subjectSlug,
    ),
  );
};

const specialistSubjectListingQuery = (sdk: Sdk) => async () => {
  const res = await sdk.specialistSubjectListing();
  const { therapyProgrammes, specialistProgrammes } =
    programmesSchema.parse(res);

  if (!therapyProgrammes || !specialistProgrammes) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }

  const programmes = await populateSubjectsWithBatchResponses(
    therapyProgrammes.concat(specialistProgrammes),
  );

  return {
    therapies: getProgrammesFromList(programmes, therapyProgrammes),
    specialist: getProgrammesFromList(programmes, specialistProgrammes),
  };
};

export default specialistSubjectListingQuery;
