// Contains mock lesson data for rendering Storybook stories for My Library components

// Base lessons data
const baseLessons = [
  {
    slug: "journey-to-the-centre-of-the-earth-explaining-how-a-writer-uses-sentence-structures-for-effect",
    order: 1,
    title:
      "Considering how Verne uses sentences in 'Journey to the Centre of the Earth'",
    lesson_uid: "LESS-SXDKH-H1472",
  },
  {
    slug: "crafting-sentence-structures-to-create-specific-effects",
    order: 2,
    title:
      "Emulating how Verne uses sentences in 'Journey to the Centre of the Earth'",
    lesson_uid: "LESS-HROSF-P1473",
  },
  {
    slug: "using-punctuation-and-sentence-structures-to-create-impact",
    order: 3,
    title:
      "'The War of the Worlds': How punctuation and sentence structures create impact",
    lesson_uid: "LESS-LJDDZ-N1474",
  },
  {
    slug: "using-punctuation-to-create-specific-effects",
    order: 4,
    title:
      "Using punctuation to create specific effects in descriptive writing",
    lesson_uid: "LESS-PDDEL-L1475",
  },
  {
    slug: "semantic-fields",
    order: 5,
    title: "Using semantic fields in a piece of creative writing",
    lesson_uid: "LESS-BFVFW-W1477",
  },
];

export const completeUnitLessons = baseLessons.map((lesson) => ({
  ...lesson,
  _state: "published",
}));

export const incompleteUnitLessons = baseLessons.map((lesson) => ({
  ...lesson,
  _state: "new",
}));
