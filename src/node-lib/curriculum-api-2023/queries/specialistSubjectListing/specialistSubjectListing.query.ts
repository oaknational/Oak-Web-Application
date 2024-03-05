import { BatchResult, Sdk, getBatchedRequests } from "../../sdk";
import { SpecialistUnitsAndLessonCountDocument } from "../../generated/sdk";

import {
  SpecialistProgramme,
  SpecialistSubject,
  programmesSchema,
  specialistSubjectSchema,
  specialistUnitsAndLessonCountSchema,
} from "./specialistSubjectListing.schema";

import OakError from "@/errors/OakError";

export const getBatchRequestVariables = (programmes: SpecialistProgramme[]) => {
  return programmes.reduce(
    (acc, programme) => {
      const subjectSlug = programme.combined_programme_fields.subject_slug;
      if (!acc.find((s) => s.subjectSlug === subjectSlug)) {
        const subject = {
          subjectSlug: subjectSlug,
          subjectTitle: programme.combined_programme_fields.subject,
        };
        acc.push(subject);
      }
      return acc;
    },
    [] as Array<Partial<SpecialistSubject>>,
  );
};

export const getExpandedSubjects = (
  batchRequestVariables: Array<Partial<SpecialistSubject>>,
  data: BatchResult,
) => {
  const expandedSubjects = batchRequestVariables.map((p, i) => {
    const res = data[i]?.data;
    if (res) {
      const { unitCount, lessonCount, programmeCount } =
        specialistUnitsAndLessonCountSchema.parse(res);
      p.lessonCount = lessonCount.aggregate.count;
      p.unitCount = unitCount.aggregate.count;
      p.programmeCount = programmeCount.aggregate.count;
      const parsedSubject = specialistSubjectSchema.parse(p);
      return parsedSubject;
    } else {
      throw new OakError({ code: "curriculum-api/not-found" });
    }
  });

  return expandedSubjects;
};

const populateSubjectsWithBatchResponses = async (
  programmes: SpecialistProgramme[],
) => {
  const variables = getBatchRequestVariables(programmes);
  const batchRequests = variables.map((c) => {
    return {
      document: SpecialistUnitsAndLessonCountDocument,
      variables: { _contains: { subject_slug: c.subjectSlug } },
    };
  });

  const data = await getBatchedRequests(batchRequests);

  return getExpandedSubjects(variables, data);
};

export const filterProgrammesBySubject = (
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

  const allSubjects = await populateSubjectsWithBatchResponses(
    therapyProgrammes.concat(specialistProgrammes),
  );

  return {
    therapies: filterProgrammesBySubject(allSubjects, therapyProgrammes),
    specialist: filterProgrammesBySubject(allSubjects, specialistProgrammes),
  };
};

export default specialistSubjectListingQuery;
