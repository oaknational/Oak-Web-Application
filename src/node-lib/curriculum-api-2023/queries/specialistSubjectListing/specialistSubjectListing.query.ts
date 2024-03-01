import { GraphQLClient } from "graphql-request";

import { Sdk } from "../../sdk";
import { SpecialistUnitsAndLessonCountDocument } from "../../generated/sdk";

import {
  SpecialistProgramme,
  SpecialistSubject,
  programmesSchema,
  specialistUnitsAndLessonCountSchema,
} from "./specialistSubjectListing.schema";

import OakError from "@/errors/OakError";
import getServerConfig from "@/node-lib/getServerConfig";

const getCountVariables = (programmes: SpecialistProgramme[]) => {
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

const populateSubjectCounts = async (programmes: SpecialistProgramme[]) => {
  const curriculumApiUrl = getServerConfig("curriculumApi2023Url");
  const curriculumApiAuthType = getServerConfig("curriculumApiAuthType");
  const curriculumApiAuthKey = getServerConfig("curriculumApi2023AuthKey");
  type Headers = { "x-oak-auth-type": string; "x-oak-auth-key": string };
  const headers: Headers = {
    "x-oak-auth-type": curriculumApiAuthType,
    "x-oak-auth-key": curriculumApiAuthKey,
  };
  const graphqlClient = new GraphQLClient(curriculumApiUrl, { headers });

  const counts = getCountVariables(programmes);
  const batchRequests = counts.map((c) => {
    return {
      document: SpecialistUnitsAndLessonCountDocument,
      variables: { _contains: { subject_slug: c.subjectSlug } },
    };
  });

  const data = await graphqlClient.batchRequests(batchRequests);

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

const specialistSubjectListingQuery = (sdk: Sdk) => async () => {
  const res = await sdk.specialistSubjectListing();
  const { therapyProgrammes, specialistProgrammes } =
    programmesSchema.parse(res);

  if (!therapyProgrammes || !specialistProgrammes) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }

  const programmes = await populateSubjectCounts(
    therapyProgrammes.concat(specialistProgrammes),
  );

  return {
    therapies: programmes.filter((p) =>
      therapyProgrammes.find(
        (t) => t.combined_programme_fields.subject_slug === p.subjectSlug,
      ),
    ),
    specialist: programmes.filter((p) =>
      specialistProgrammes.find(
        (s) => s.combined_programme_fields.subject_slug === p.subjectSlug,
      ),
    ),
  };
};

export default specialistSubjectListingQuery;
