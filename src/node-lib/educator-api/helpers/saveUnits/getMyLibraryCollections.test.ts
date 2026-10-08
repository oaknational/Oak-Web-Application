import { UserlistContentApiResponse } from "../../queries/getUserListContent/getUserListContent.types";

import { buildCollectionData } from "./getMyLibraryCollections";

import userListContentFixture from "@/node-lib/educator-api/fixtures/userListContent.fixture";

const mockProgrammeData: UserlistContentApiResponse =
  userListContentFixture("programme1");

const mockProgrammeDataWithSubjectCategories: UserlistContentApiResponse = {
  ...userListContentFixture("programme1-Literacy", {
    subject: "English",
    subjectSlug: "english",
    subjectCategory: "Literacy",
  }),
  ...userListContentFixture("programme1-reading-writing-and-oracy", {
    subject: "English",
    subjectSlug: "english",
    subjectCategory: "Reading, writing & oracy",
  }),
  ...userListContentFixture("programme2", {
    units: [
      {
        unitSlug: "bio-unit1",
        unitTitle: "Bio Unit 1",
        optionalityTitle: null,
        savedAt: "2023-10-01T00:00:00Z",
        unitOrder: 1,
        yearOrder: 1,
        year: "1",
        yearSlug: "year-1",
        lessons: [
          {
            slug: "bio-lesson-1",
            title: "Bio Lesson 1",
            state: "published",
            order: 1,
          },
        ],
      },
    ],
    subject: "Biology",
    subjectSlug: "biology",
  }),
};

const mockProgrammeDataWithPathways: UserlistContentApiResponse =
  userListContentFixture("programme1", {
    keystage: "KS4",
    keystageSlug: "ks4",
    subject: "Maths",
    subjectSlug: "maths",
    pathway: "Core",
    phaseSlug: "secondary",
  });

const mockProgrammeDataWithParentSubject: UserlistContentApiResponse =
  userListContentFixture("programme1", {
    keystage: "KS4",
    keystageSlug: "ks4",
    subject: "Biology",
    subjectSlug: "biology",
    examboard: "AQA",
    examboardSlug: "aqa",
    subjectParent: "Science",
    phaseSlug: "secondary",
  });

const unit1 = {
  unitSlug: "unit1",
  unitTitle: "Unit 1",
  optionalityTitle: null,
  savedAt: "2023-10-01T00:00:00Z",
  unitOrder: 1,
  yearOrder: 1,
  year: "1",
  yearSlug: "year-1",
  lessons: [
    {
      slug: "lesson1",
      title: "Lesson 1",
      state: "published",
      order: 1,
    },
  ],
};

describe("buildCollectionData", () => {
  it("returns collection data with the correct structure", () => {
    expect(buildCollectionData(mockProgrammeData)).toEqual([
      {
        keystage: "KS1",
        keystageSlug: "ks1",
        programmeSlug: "programme1",
        programmeTitle: "Maths KS1",
        subject: "Maths",
        subjectSlug: "maths",
        subjectPhaseSlug: "maths-primary",
        subheading: "KS1",
        uniqueProgrammeKey: "programme1",
        units: [unit1],
        subjectCategoryQuery: undefined,
      },
    ]);
  });

  it("handles subjects with subject categories", () => {
    expect(buildCollectionData(mockProgrammeDataWithSubjectCategories)).toEqual(
      [
        {
          keystage: "KS1",
          keystageSlug: "ks1",
          programmeSlug: "programme2",
          programmeTitle: "Biology KS1",
          subject: "Biology",
          subjectSlug: "biology",
          subheading: "KS1",
          uniqueProgrammeKey: "programme2",
          units: [
            {
              unitSlug: "bio-unit1",
              unitTitle: "Bio Unit 1",
              optionalityTitle: null,
              savedAt: "2023-10-01T00:00:00Z",
              unitOrder: 1,
              yearOrder: 1,
              year: "1",
              yearSlug: "year-1",
              lessons: [
                {
                  slug: "bio-lesson-1",
                  title: "Bio Lesson 1",
                  state: "published",
                  order: 1,
                },
              ],
            },
          ],
          subjectCategoryQuery: undefined,
          subjectPhaseSlug: "biology-primary",
        },
        {
          keystage: "KS1",
          keystageSlug: "ks1",
          programmeSlug: "programme1-Literacy",
          programmeTitle: "English: Literacy KS1",
          subject: "English",
          subjectSlug: "english",
          subjectPhaseSlug: "english-primary",
          subheading: "Literacy KS1",
          uniqueProgrammeKey: "programme1-Literacy",
          units: [unit1],
          subjectCategoryQuery: "literacy",
        },
        {
          keystage: "KS1",
          keystageSlug: "ks1",
          programmeSlug: "programme1-reading-writing-and-oracy",
          programmeTitle: "English: Reading, writing & oracy KS1",
          subheading: "Reading, writing & oracy KS1",
          subject: "English",
          subjectCategoryQuery: "reading-writing-and-oracy",
          subjectPhaseSlug: "english-primary",
          subjectSlug: "english",
          uniqueProgrammeKey: "programme1-reading-writing-and-oracy",
          units: [unit1],
        },
      ],
    );
  });

  it("handles programmes with pathways", () => {
    expect(buildCollectionData(mockProgrammeDataWithPathways)).toEqual([
      {
        keystage: "KS4",
        keystageSlug: "ks4",
        programmeSlug: "programme1",
        programmeTitle: "Maths Core KS4",
        subject: "Maths",
        subjectSlug: "maths",
        subjectPhaseSlug: "maths-secondary",
        subheading: "Core KS4",
        uniqueProgrammeKey: "programme1",
        units: [unit1],
        subjectCategoryQuery: undefined,
      },
    ]);
  });

  it("handles programmes with parent subjects", () => {
    expect(buildCollectionData(mockProgrammeDataWithParentSubject)).toEqual([
      {
        keystage: "KS4",
        keystageSlug: "ks4",
        programmeSlug: "programme1",
        programmeTitle: "Biology AQA KS4",
        subheading: "AQA KS4",
        subject: "Biology",
        subjectCategoryQuery: undefined,
        subjectPhaseSlug: "science-secondary-aqa",
        subjectSlug: "biology",
        uniqueProgrammeKey: "programme1",
        units: [unit1],
      },
    ]);
  });

  it("returns an empty list when nothing is saved", () => {
    expect(buildCollectionData({})).toEqual([]);
  });
});
