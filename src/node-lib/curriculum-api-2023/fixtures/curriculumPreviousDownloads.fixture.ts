export const DOWNLOAD_CATEGORIES = [
  "EYFS",
  "KS1",
  "KS2",
  "KS3",
  "KS4",
  "Therapies",
  "Specialist",
  "EYFS",
] as const;

export type DownloadCategory = (typeof DOWNLOAD_CATEGORIES)[number];
type curriculumPreviousDownloadsFixtureProps = {
  documents: {
    category: DownloadCategory;
    icon: string;
    subject: string;
    slug: string;
  }[];
};

const curriculumPreviousDownloadsFixture = (
  partial?: Partial<curriculumPreviousDownloadsFixtureProps>,
): curriculumPreviousDownloadsFixtureProps => {
  return {
    documents: [
      {
        category: "EYFS",
        icon: "art",
        subject: "Expressive Arts and Design",
        slug: "early-years-foundation-stage-expressive-arts-and-design",
      },
      {
        category: "EYFS",
        icon: "english",
        subject: "Literacy",
        slug: "early-years-foundation-stage-literacy",
      },
      {
        category: "EYFS",
        icon: "maths",
        subject: "Maths",
        slug: "early-years-foundation-stage-maths",
      },
      {
        category: "EYFS",
        icon: "rshe-pshe",
        subject: "PSED",
        slug: "early-years-foundation-stage-psed",
      },
      {
        category: "EYFS",
        icon: "understanding-the-world",
        subject: "Understanding the World",
        slug: "early-years-foundation-stage-understanding-the-world",
      },
      {
        category: "KS1",
        icon: "art",
        subject: "Art & Design",
        slug: "key-stage-1-art",
      },
      {
        category: "KS1",
        icon: "design-technology",
        subject: "Design & Technology",
        slug: "key-stage-1-design-technology",
      },
      {
        category: "KS1",
        icon: "drama",
        subject: "Drama",
        slug: "key-stage-1-drama",
      },
      {
        category: "KS1",
        icon: "music",
        subject: "Music",
        slug: "key-stage-1-music",
      },
      {
        category: "KS1",
        icon: "physical-education",
        subject: "Physical Education",
        slug: "key-stage-1-physical-education",
      },
      {
        category: "KS1",
        icon: "religious-education",
        subject: "Religious Education",
        slug: "key-stage-1-religious-education",
      },
      {
        category: "KS1",
        icon: "rshe-pshe",
        subject: "RSHE (PSHE)",
        slug: "key-stage-1-rshe-pshe",
      },
      {
        category: "KS2",
        icon: "art",
        subject: "Art & Design",
        slug: "key-stage-2-art",
      },
      {
        category: "KS2",
        icon: "computing",
        subject: "Computing",
        slug: "key-stage-2-computing",
      },
      {
        category: "KS2",
        icon: "design-technology",
        subject: "Design & Technology",
        slug: "key-stage-2-design-technology",
      },
      {
        category: "KS2",
        icon: "drama",
        subject: "Drama",
        slug: "key-stage-2-drama",
      },
      {
        category: "KS2",
        icon: "french",
        subject: "French",
        slug: "key-stage-2-french",
      },
      {
        category: "KS2",
        icon: "geography",
        subject: "Geography",
        slug: "key-stage-2-geography",
      },
      {
        category: "KS2",
        icon: "music",
        subject: "Music",
        slug: "key-stage-2-music",
      },
      {
        category: "KS2",
        icon: "physical-education",
        subject: "Physical Education",
        slug: "key-stage-2-physical-education",
      },
      {
        category: "KS2",
        icon: "religious-education",
        subject: "Religious Education",
        slug: "key-stage-2-religious-education",
      },
      {
        category: "KS2",
        icon: "rshe-pshe",
        subject: "RSHE (PSHE)",
        slug: "key-stage-2-rshe-pshe",
      },
      {
        category: "KS2",
        icon: "spanish",
        subject: "Spanish",
        slug: "key-stage-2-spanish",
      },
      {
        category: "KS3",
        icon: "art",
        subject: "Art & Design",
        slug: "key-stage-3-art",
      },
      {
        category: "KS3",
        icon: "citizenship",
        subject: "Citizenship",
        slug: "key-stage-3-citizenship",
      },
      {
        category: "KS3",
        icon: "computing",
        subject: "Computing",
        slug: "key-stage-3-computing",
      },
      {
        category: "KS3",
        icon: "design-technology",
        subject: "Design & Technology",
        slug: "key-stage-3-design-technology",
      },
      {
        category: "KS3",
        icon: "drama",
        subject: "Drama",
        slug: "key-stage-3-drama",
      },
      {
        category: "KS3",
        icon: "french",
        subject: "French",
        slug: "key-stage-3-french",
      },
      {
        category: "KS3",
        icon: "geography",
        subject: "Geography",
        slug: "key-stage-3-geography",
      },
      {
        category: "KS3",
        icon: "german",
        subject: "German",
        slug: "key-stage-3-german",
      },
      {
        category: "KS3",
        icon: "latin",
        subject: "Latin",
        slug: "key-stage-3-latin",
      },
      {
        category: "KS3",
        icon: "music",
        subject: "Music",
        slug: "key-stage-3-music",
      },
      {
        category: "KS3",
        icon: "physical-education",
        subject: "Physical Education",
        slug: "key-stage-3-physical-education",
      },
      {
        category: "KS3",
        icon: "religious-education",
        subject: "Religious Education",
        slug: "key-stage-3-religious-education",
      },
      {
        category: "KS3",
        icon: "rshe-pshe",
        subject: "RSHE (PSHE)",
        slug: "key-stage-3-rshe-pshe",
      },
      {
        category: "KS3",
        icon: "spanish",
        subject: "Spanish",
        slug: "key-stage-3-spanish",
      },
      {
        category: "KS4",
        icon: "art",
        subject: "Art & Design",
        slug: "key-stage-4-art",
      },
      {
        category: "KS4",
        icon: "biology",
        subject: "Biology",
        slug: "key-stage-4-biology",
      },
      {
        category: "KS4",
        icon: "chemistry",
        subject: "Chemistry",
        slug: "key-stage-4-chemistry",
      },
      {
        category: "KS4",
        icon: "citizenship",
        subject: "Citizenship",
        slug: "key-stage-4-citizenship",
      },
      {
        category: "KS4",
        icon: "combined-science",
        subject: "Combined Science",
        slug: "key-stage-4-combined-science",
      },
      {
        category: "KS4",
        icon: "computing",
        subject: "Computing",
        slug: "key-stage-4-computing",
      },
      {
        category: "KS4",
        icon: "computing",
        subject: "Computing (Non-GCSE)",
        slug: "key-stage-4-computing-non-gcse",
      },
      {
        category: "KS4",
        icon: "french",
        subject: "French",
        slug: "key-stage-4-french",
      },
      {
        category: "KS4",
        icon: "geography",
        subject: "Geography",
        slug: "key-stage-4-geography",
      },
      {
        category: "KS4",
        icon: "german",
        subject: "German",
        slug: "key-stage-4-german",
      },
      {
        category: "KS4",
        icon: "latin",
        subject: "Latin",
        slug: "key-stage-4-latin",
      },
      {
        category: "KS4",
        icon: "physics",
        subject: "Physics",
        slug: "key-stage-4-physics",
      },
      {
        category: "KS4",
        icon: "religious-education",
        subject: "Religious Education",
        slug: "key-stage-4-religious-education",
      },
      {
        category: "KS4",
        icon: "rshe-pshe",
        subject: "RSHE (PSHE)",
        slug: "key-stage-4-rshe-pshe",
      },
      {
        category: "KS4",
        icon: "spanish",
        subject: "Spanish",
        slug: "key-stage-4-spanish",
      },
      {
        category: "Specialist",
        icon: "communication-and-language",
        subject: "Communication and Language",
        slug: "specialist-communication-and-language",
      },
      {
        category: "Specialist",
        icon: "creative-arts",
        subject: "Creative Arts",
        slug: "specialist-creative-arts",
      },
      {
        category: "Specialist",
        icon: "independent-living",
        subject: "Independent Living",
        slug: "specialist-independent-living",
      },
      {
        category: "Specialist",
        icon: "numeracy",
        subject: "Numeracy",
        slug: "specialist-numeracy",
      },
      {
        category: "Specialist",
        icon: "physical-development",
        subject: "Physical Development",
        slug: "specialist-physical-development",
      },
      {
        category: "Therapies",
        icon: "physical-therapy",
        subject: "Physical Therapy",
        slug: "specialist-physical-therapy",
      },
      {
        category: "Specialist",
        icon: "speech-and-language-therapy",
        subject: "Speech and Language Therapy",
        slug: "specialist-speech-and-language-therapy",
      },
      {
        category: "Specialist",
        icon: "occupational-therapy",
        subject: "Occupational Therapy",
        slug: "specialist-occupational-therapy",
      },
      {
        category: "Specialist",
        icon: "sensory-integration",
        subject: "Sensory Integration",
        slug: "specialist-sensory-integration",
      },
    ],
    ...partial,
  };
};

export default curriculumPreviousDownloadsFixture;
