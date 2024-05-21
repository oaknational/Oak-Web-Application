import { BatchResult, Sdk, getBatchedRequests } from "../../sdk";
import { SubjectListingCountDocument } from "../../generated/sdk"; // Import the SubjectListingCountsDocument from the appropriate file

import subjectListingSchema, {
  subjectLisitingRawSchema,
  subjectUnitsAndLessonCountSchema,
} from "./subjectListing.schema";

import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import OakError from "@/errors/OakError";

const expandSubjects = (
  batchRequestVariables: Array<Partial<Subject>>,
  data: BatchResult,
) => {
  const expandedSubjects = batchRequestVariables.map((p, i) => {
    const res = data[i]?.data;
    if (res) {
      const { unitCount, lessonCount } =
        subjectUnitsAndLessonCountSchema.parse(res);
      p.lessonCount = lessonCount.aggregate.count;
      p.unitCount = unitCount.aggregate.count;
      return p;
    } else {
      throw new OakError({ code: "curriculum-api/not-found" });
    }
  });

  return expandedSubjects;
};

const populateSubjectsResponses = async (programmes: Subject[]) => {
  const batchRequests = programmes.map((programme) => {
    return {
      document: SubjectListingCountDocument,
      variables: { programmeSlug: programme.programmeSlug },
    };
  });
  const data = await getBatchedRequests(batchRequests);
  return expandSubjects(programmes, data);
};

const cleanSubjectData = (subjects: Array<Partial<Subject>>) => {
  return subjects.reduce(
    (acc, cur) => {
      const existingSubject = acc.find(
        (s) => s.subjectSlug === cur.subjectSlug,
      );
      if (
        !existingSubject ||
        (existingSubject &&
          cur.programmeSlug &&
          isSlugLegacy(cur.programmeSlug))
      ) {
        const sub = { ...cur, programmeCount: 1 };
        acc.push(sub);
      } else if (existingSubject.programmeCount && existingSubject) {
        existingSubject.programmeCount += 1;
      }
      return acc;
    },
    [] as Array<Partial<Subject>>,
  );
};

type Subject = {
  subjectSlug: string;
  subjectTitle: string;
  programmeSlug: string;
  programmeCount: number;
  unitCount?: number;
  lessonCount?: number;
};

const subjectListingQuery =
  (sdk: Sdk) => async (args: { keyStageSlug: string; isLegacy: boolean }) => {
    const res = await sdk.subjectListing(args);

    const { subjects, key_stages } = subjectLisitingRawSchema.parse(res);

    const parsedAndFilteredSubjects: Subject[] = subjects.map((subject) => {
      const subjectNew = {
        subjectSlug: subject.programme_fields.subject_slug,
        subjectTitle: subject.programme_fields.subject,
        programmeSlug: subject.programme_slug,
        programmeCount: 1,
      };
      return subjectNew;
    });

    const data = await populateSubjectsResponses(parsedAndFilteredSubjects);

    const parsedSubjects = cleanSubjectData(data);

    const keyStages = key_stages.map((keyStage) => {
      const keyStageNew = {
        slug: keyStage.slug,
        title: keyStage.description,
        shortCode: keyStage.keystage,
        displayOrder: keyStage.display_order,
      };
      return keyStageNew;
    });

    if (!subjects || subjects.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const returnData = {
      subjects: parsedSubjects,
      keyStageSlug: subjects[0]?.programme_fields.keystage_slug,
      keyStageTitle: subjects[0]?.programme_fields.keystage_description,
      keyStages: keyStages,
    };

    return subjectListingSchema.parse({
      ...returnData,
    });
  };

export default subjectListingQuery;
