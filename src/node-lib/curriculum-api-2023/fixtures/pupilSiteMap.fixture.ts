import { PupilsSitemapBrowseData } from "../queries/pupilsSitemap/pupilSitemap.schema";

export const mockedSiteMapResponse: PupilsSitemapBrowseData = {
  programmes: [
    { programmeSlug: "music-secondary-year-7" },
    { programmeSlug: "maths-primary-year-1-l" },
    { programmeSlug: "maths-secondary-year-10-core-l" },
    { programmeSlug: "rshe-pshe-secondary-year-9-l" },
    { programmeSlug: "chemistry-secondary-year-10-l" },
  ],
  units: [
    {
      programmeSlug: "english-primary-year-5",
      unitSlug: "shakespeares-macbeth-narrative-and-soliloquy-writing",
    },
    {
      programmeSlug: "english-primary-year-3",
      unitSlug: "the-bfg-reading-and-narrative-writing",
    },
    {
      programmeSlug: "science-secondary-year-8",
      unitSlug: "fuels-and-energetics",
    },
    {
      programmeSlug: "english-primary-year-6",
      unitSlug: "a-kind-of-spark-narrative-writing",
    },
    {
      programmeSlug: "english-primary-year-6",
      unitSlug: "when-the-sky-falls-narrative-and-diary-writing",
    },
  ],
  lessons: [
    {
      programmeSlug: "history-secondary-year-7",
      unitSlug:
        "the-norman-conquest-how-do-we-know-about-the-impact-of-the-conquest-on-england",
      lessonSlug: "1066-and-claims-to-the-throne",
    },
    {
      programmeSlug: "history-secondary-year-7-l",
      unitSlug: "how-did-a-norman-become-king-of-england-ccc3",
      lessonSlug: "1066-and-the-succession-crisis-6crp2r",
    },
    {
      programmeSlug: "history-secondary-year-7",
      unitSlug: "king-john-and-magna-carta-why-was-magna-carta-revived",
      lessonSlug: "1215-and-magna-carta",
    },
    {
      programmeSlug: "religious-education-secondary-year-7-l",
      unitSlug: "judaism-beliefs-and-teachings-6de4",
      lessonSlug: "13-principles-of-faith-6wwkje",
    },
    {
      programmeSlug: "physical-education-secondary-year-7-l",
      unitSlug:
        "outdoor-and-adventurous-activity-following-instructions-and-problem-solving-skil",
      lessonSlug: "1-5-6grkae",
    },
  ],
};
