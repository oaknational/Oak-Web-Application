type curriculumPreviousDownloadsFixtureProps = {
  documents: {
    category: string;
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
        subject: "Expressive Arts and Design",
        slug: "early-years-foundation-stage-expressive-arts-and-design",
      },
      {
        category: "EYFS",
        subject: "Literacy",
        slug: "early-years-foundation-stage-literacy",
      },
      {
        category: "EYFS",
        subject: "Maths",
        slug: "early-years-foundation-stage-maths",
      },
      {
        category: "EYFS",
        subject: "PSED",
        slug: "early-years-foundation-stage-psed",
      },
      {
        category: "EYFS",
        subject: "Understanding the World",
        slug: "early-years-foundation-stage-understanding-the-world",
      },
      {
        category: "KS1",
        subject: "Art & Design",
        slug: "key-stage-1-art",
      },
      {
        category: "KS1",
        subject: "Design & Technology",
        slug: "key-stage-1-design-technology",
      },
      {
        category: "KS1",
        subject: "Drama",
        slug: "key-stage-1-drama",
      },
      {
        category: "KS1",
        subject: "English",
        slug: "key-stage-1-english",
      },
      {
        category: "KS1",
        subject: "History",
        slug: "key-stage-1-history",
      },
      {
        category: "KS1",
        subject: "Maths",
        slug: "key-stage-1-maths",
      },
      {
        category: "KS1",
        subject: "Music",
        slug: "key-stage-1-music",
      },
      {
        category: "KS1",
        subject: "Physical Education",
        slug: "key-stage-1-physical-education",
      },
      {
        category: "KS1",
        subject: "Religious Education",
        slug: "key-stage-1-religious-education",
      },
      {
        category: "KS1",
        subject: "RSHE (PSHE)",
        slug: "key-stage-1-rshe-pshe",
      },
      {
        category: "KS1",
        subject: "Science",
        slug: "key-stage-1-science",
      },
      {
        category: "KS2",
        subject: "Art & Design",
        slug: "key-stage-2-art",
      },
      {
        category: "KS2",
        subject: "Computing",
        slug: "key-stage-2-computing",
      },
      {
        category: "KS2",
        subject: "Design & Technology",
        slug: "key-stage-2-design-technology",
      },
      {
        category: "KS2",
        subject: "Drama",
        slug: "key-stage-2-drama",
      },
      {
        category: "KS2",
        subject: "English",
        slug: "key-stage-2-english",
      },
      {
        category: "KS2",
        subject: "English Grammar",
        slug: "key-stage-2-english-grammar",
      },
      {
        category: "KS2",
        subject: "English Reading for Pleasure",
        slug: "key-stage-2-english-reading-for-pleasure",
      },
      {
        category: "KS2",
        subject: "English Spelling",
        slug: "key-stage-2-english-spelling",
      },
      {
        category: "KS2",
        subject: "French",
        slug: "key-stage-2-french",
      },
      {
        category: "KS2",
        subject: "Geography",
        slug: "key-stage-2-geography",
      },
      {
        category: "KS2",
        subject: "History",
        slug: "key-stage-2-history",
      },
      {
        category: "KS2",
        subject: "Maths",
        slug: "key-stage-2-maths",
      },
      {
        category: "KS2",
        subject: "Music",
        slug: "key-stage-2-music",
      },
      {
        category: "KS2",
        subject: "Physical Education",
        slug: "key-stage-2-physical-education",
      },
      {
        category: "KS2",
        subject: "Religious Education",
        slug: "key-stage-2-religious-education",
      },
      {
        category: "KS2",
        subject: "RSHE (PSHE)",
        slug: "key-stage-2-rshe-pshe",
      },
      {
        category: "KS2",
        subject: "Science",
        slug: "key-stage-2-science",
      },
      {
        category: "KS2",
        subject: "Spanish",
        slug: "key-stage-2-spanish",
      },
      {
        category: "KS3",
        subject: "Art & Design",
        slug: "key-stage-3-art",
      },
      {
        category: "KS3",
        subject: "Citizenship",
        slug: "key-stage-3-citizenship",
      },
      {
        category: "KS3",
        subject: "Computing",
        slug: "key-stage-3-computing",
      },
      {
        category: "KS3",
        subject: "Design & Technology",
        slug: "key-stage-3-design-technology",
      },
      {
        category: "KS3",
        subject: "Drama",
        slug: "key-stage-3-drama",
      },
      {
        category: "KS3",
        subject: "English",
        slug: "key-stage-3-english",
      },
      {
        category: "KS3",
        subject: "French",
        slug: "key-stage-3-french",
      },
      {
        category: "KS3",
        subject: "Geography",
        slug: "key-stage-3-geography",
      },
      {
        category: "KS3",
        subject: "German",
        slug: "key-stage-3-german",
      },
      {
        category: "KS3",
        subject: "History",
        slug: "key-stage-3-history",
      },
      {
        category: "KS3",
        subject: "Latin",
        slug: "key-stage-3-latin",
      },
      {
        category: "KS3",
        subject: "Maths",
        slug: "key-stage-3-maths",
      },
      {
        category: "KS3",
        subject: "Music",
        slug: "key-stage-3-music",
      },
      {
        category: "KS3",
        subject: "Physical Education",
        slug: "key-stage-3-physical-education",
      },
      {
        category: "KS3",
        subject: "Religious Education",
        slug: "key-stage-3-religious-education",
      },
      {
        category: "KS3",
        subject: "RSHE (PSHE)",
        slug: "key-stage-3-rshe-pshe",
      },
      {
        category: "KS3",
        subject: "Science",
        slug: "key-stage-3-science",
      },
      {
        category: "KS3",
        subject: "Spanish",
        slug: "key-stage-3-spanish",
      },
      {
        category: "KS4",
        subject: "Art & Design",
        slug: "key-stage-4-art",
      },
      {
        category: "KS4",
        subject: "Biology",
        slug: "key-stage-4-biology",
      },
      {
        category: "KS4",
        subject: "Chemistry",
        slug: "key-stage-4-chemistry",
      },
      {
        category: "KS4",
        subject: "Citizenship",
        slug: "key-stage-4-citizenship",
      },
      {
        category: "KS4",
        subject: "Combined Science",
        slug: "key-stage-4-combined-science",
      },
      {
        category: "KS4",
        subject: "Computing",
        slug: "key-stage-4-computing",
      },
      {
        category: "KS4",
        subject: "Computing (Non-GCSE)",
        slug: "key-stage-4-computing-non-gcse",
      },
      {
        category: "KS4",
        subject: "English",
        slug: "key-stage-4-english",
      },
      {
        category: "KS4",
        subject: "French",
        slug: "key-stage-4-french",
      },
      {
        category: "KS4",
        subject: "Geography",
        slug: "key-stage-4-geography",
      },
      {
        category: "KS4",
        subject: "German",
        slug: "key-stage-4-german",
      },
      {
        category: "KS4",
        subject: "History",
        slug: "key-stage-4-history",
      },
      {
        category: "KS4",
        subject: "Latin",
        slug: "key-stage-4-latin",
      },
      {
        category: "KS4",
        subject: "Maths",
        slug: "key-stage-4-maths",
      },
      {
        category: "KS4",
        subject: "Physics",
        slug: "key-stage-4-physics",
      },
      {
        category: "KS4",
        subject: "Religious Education",
        slug: "key-stage-4-religious-education",
      },
      {
        category: "KS4",
        subject: "RSHE (PSHE)",
        slug: "key-stage-4-rshe-pshe",
      },
      {
        category: "KS4",
        subject: "Spanish",
        slug: "key-stage-4-spanish",
      },
      {
        category: "Specialist",
        subject: "Communication and Language",
        slug: "specialist-communication-and-language",
      },
      {
        category: "Specialist",
        subject: "Creative Arts",
        slug: "specialist-creative-arts",
      },
      {
        category: "Specialist",
        subject: "Independent Living",
        slug: "specialist-independent-living",
      },
      {
        category: "Specialist",
        subject: "Numeracy",
        slug: "specialist-numeracy",
      },
      {
        category: "Specialist",
        subject: "Physical Development",
        slug: "specialist-physical-development",
      },
      {
        category: "Therapies",
        subject: "Physical Therapy",
        slug: "specialist-physical-therapy",
      },
      {
        category: "Specialist",
        subject: "Speech and Language Therapy",
        slug: "specialist-speech-and-language-therapy",
      },
      {
        category: "Specialist",
        subject: "Occupational Therapy",
        slug: "specialist-occupational-therapy",
      },
      {
        category: "Specialist",
        subject: "Sensory Integration",
        slug: "specialist-sensory-integration",
      },
    ],
    ...partial,
  };
};

export default curriculumPreviousDownloadsFixture;
