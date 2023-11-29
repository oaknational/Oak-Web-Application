type curriculumPreviousDownloadsFixtureProps = {
  documents: {
    categories: string[];
    subject: string;
    path: string;
  }[];
};

const curriculumPreviousDownloadsFixture = (
  partial?: Partial<curriculumPreviousDownloadsFixtureProps>,
): curriculumPreviousDownloadsFixtureProps => {
  return {
    documents: [
      {
        categories: ["EYFS", "KS1", "KS2"],
        subject: "English",
        path: "primary/oak-2021-primary-eyfs-ks1-ks2-english.pdf",
      },
      {
        categories: ["EYFS", "KS1", "KS2"],
        subject: "Maths",
        path: "primary/oak-2021-primary-eyfs-ks1-ks2-maths.pdf",
      },
      {
        categories: ["EYFS", "KS1", "KS2"],
        subject: "Music",
        path: "primary/oak-2021-primary-eyfs-ks1-ks2-music.pdf",
      },
      {
        categories: ["EYFS", "KS1", "KS2"],
        subject: "RHE (PSHE)",
        path: "primary/oak-2021-primary-eyfs-ks1-ks2-rhe-pshe.pdf",
      },
      {
        categories: ["EYFS"],
        subject: "Understanding the world",
        path: "primary/oak-2021-primary-eyfs-understanding-the-world.pdf",
      },
      {
        categories: ["KS1", "KS2"],
        subject: "Geography",
        path: "primary/oak-2021-primary-ks1-ks2-geography.pdf",
      },
      {
        categories: ["KS1", "KS2"],
        subject: "History",
        path: "primary/oak-2021-primary-ks1-ks2-history.pdf",
      },
      {
        categories: ["KS1", "KS2"],
        subject: "RE",
        path: "primary/oak-2021-primary-ks1-ks2-re.pdf",
      },
      {
        categories: ["KS1", "KS2"],
        subject: "Science",
        path: "primary/oak-2021-primary-ks1-ks2-science.pdf",
      },
      {
        categories: ["KS2"],
        subject: "Computing",
        path: "primary/oak-2021-primary-ks2-computing.pdf",
      },
      {
        categories: ["KS3"],
        subject: "English",
        path: "secondary/oak-2021-secondary-ks3-english.pdf",
      },
      {
        categories: ["KS3"],
        subject: "Geography",
        path: "secondary/oak-2021-secondary-ks3-geography.pdf",
      },
      {
        categories: ["KS3"],
        subject: "History",
        path: "secondary/oak-2021-secondary-ks3-history.pdf",
      },
      {
        categories: ["KS3", "KS4"],
        subject: "Citizenship",
        path: "secondary/oak-2021-secondary-ks3-ks4-citizenship.pdf",
      },
      {
        categories: ["KS3", "KS4"],
        subject: "Computing",
        path: "secondary/oak-2021-secondary-ks3-ks4-computing.pdf",
      },
      {
        categories: ["KS3", "KS4"],
        subject: "French",
        path: "secondary/oak-2021-secondary-ks3-ks4-french.pdf",
      },
      {
        categories: ["KS3", "KS4"],
        subject: "German",
        path: "secondary/oak-2021-secondary-ks3-ks4-german.pdf",
      },
      {
        categories: ["KS3", "KS4"],
        subject: "RE",
        path: "secondary/oak-2021-secondary-ks3-ks4-re.pdf",
      },
      {
        categories: ["KS3", "KS4"],
        subject: "Science",
        path: "secondary/oak-2021-secondary-ks3-ks4-science.pdf",
      },
      {
        categories: ["KS3", "KS4"],
        subject: "Spanish",
        path: "secondary/oak-2021-secondary-ks3-ks4-spanish.pdf",
      },
      {
        categories: ["KS3"],
        subject: "Maths",
        path: "secondary/oak-2021-secondary-ks3-maths.pdf",
      },
      {
        categories: ["KS3"],
        subject: "Music",
        path: "secondary/oak-2021-secondary-ks3-music.pdf",
      },
      {
        categories: ["KS3", "KS4"],
        subject: "Latin",
        path: "secondary/oak-2021-secondary-ks3-ks4-latin.pdf",
      },
      {
        categories: ["KS4"],
        subject: "English",
        path: "secondary/oak-2021-secondary-ks4-english.pdf",
      },
      {
        categories: ["KS4"],
        subject: "Geography",
        path: "secondary/oak-2021-secondary-ks4-geography.pdf",
      },
      {
        categories: ["KS4"],
        subject: "History",
        path: "secondary/oak-2021-secondary-ks4-history.pdf",
      },
      {
        categories: ["KS4"],
        subject: "Maths",
        path: "secondary/oak-2021-secondary-ks4-maths.pdf",
      },
      {
        categories: ["Specialist"],
        subject: "Communication and Language",
        path: "specialist/oak-2021-specialist-communication-and-language.pdf",
      },
      {
        categories: ["Specialist"],
        subject: "Creative Arts",
        path: "specialist/oak-2021-specialist-creative-arts.pdf",
      },
      {
        categories: ["Specialist"],
        subject: "Early Development",
        path: "specialist/oak-2021-specialist-early-development.pdf",
      },
      {
        categories: ["Specialist"],
        subject: "Independent Living",
        path: "specialist/oak-2021-specialist-independent-living.pdf",
      },
      {
        categories: ["Specialist"],
        subject: "Numeracy",
        path: "specialist/oak-2021-specialist-numeracy.pdf",
      },
      {
        categories: ["Specialist"],
        subject: "Occupational Therapy",
        path: "specialist/oak-2021-specialist-occupational-therapy.pdf",
      },
      {
        categories: ["Specialist"],
        subject: "Physical Development",
        path: "specialist/oak-2021-specialist-physical-development.pdf",
      },
      {
        categories: ["Specialist"],
        subject: "Physical Therapy",
        path: "specialist/oak-2021-specialist-physical-therapy.pdf",
      },
      {
        categories: ["Specialist"],
        subject: "Sensory Integration",
        path: "specialist/oak-2021-specialist-sensory-stories.pdf",
      },
      {
        categories: ["Specialist"],
        subject: "Speech and Language Therapy",
        path: "specialist/oak-2021-specialist-speech-and-language-therapy.pdf",
      },
      {
        categories: ["KS3", "KS4"],
        subject: "RSHE",
        path: "secondary/oak-2021-secondary-ks3-ks4-rshe.pdf",
      },
      {
        categories: ["KS1", "KS2"],
        subject: "Design and Technology",
        path: "primary/oak-2021-primary-ks1-ks2-design-and-technology.pdf",
      },
      {
        categories: ["KS3"],
        subject: "Design and Technology",
        path: "secondary/oak-2021-secondary-ks3-design-and-technology.pdf",
      },
      {
        categories: ["KS1", "KS2"],
        subject: "Drama",
        path: "primary/oak-2021-primary-ks1-ks2-drama.pdf",
      },
      {
        categories: ["KS2"],
        subject: "French",
        path: "primary/oak-2021-primary-ks2-french.pdf",
      },
      {
        categories: ["KS1", "KS2"],
        subject: "PE",
        path: "primary/oak-2021-primary-ks1-ks2-pe.pdf",
      },
      {
        categories: ["KS3"],
        subject: "PE",
        path: "secondary/oak-2021-secondary-ks3-pe.pdf",
      },
      {
        categories: ["KS2"],
        subject: "Spanish",
        path: "primary/oak-2021-primary-ks2-spanish.pdf",
      },
      {
        categories: ["KS1", "KS2"],
        subject: "Art & Design",
        path: "primary/oak-2021-primary-ks1-ks2-art.pdf",
      },
      {
        categories: ["KS3"],
        subject: "Drama",
        path: "secondary/oak-2021-secondary-ks3-drama.pdf",
      },
      {
        categories: ["KS3", "KS4"],
        subject: "Art & Design",
        path: "secondary/oak-2021-secondary-ks3-ks4-art.pdf",
      },
      {
        categories: ["KS2"],
        subject: "Water Safety",
        path: "primary/oak-2021-primary-ks2-water-safety.pdf",
      },
    ],
    ...partial,
  };
};

export default curriculumPreviousDownloadsFixture;
