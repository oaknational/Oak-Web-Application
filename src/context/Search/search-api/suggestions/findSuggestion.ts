import Fuse from "fuse.js";

import { SearchSuggestion } from "../../useSearch";

interface SubjectData {
  title: string;
  slug: string;
  description: string;
  keyStages: string[]; // GUESSED: Approximate key stages based on UK curriculum standards
  aliases: string[];
}

// NOTE: Subject list contains a mix of CONFIRMED data from Oak fixtures and GUESSED data
// CONFIRMED subjects from fixtures: computing, english, maths, science, biology, chemistry, citizenship, music, financial-education
// GUESSED subjects: history, geography, art, pe, drama, french, spanish, german, design-technology, pshe, re, physics
// GUESSED key stages: Based on typical UK curriculum availability - needs confirmation
// GUESSED descriptions: All descriptions are guessed and should be confirmed with actual Oak content
const OAK_SUBJECTS: SubjectData[] = [
  // CONFIRMED subjects from fixtures
  {
    title: "Computing",
    slug: "computing",
    description:
      "Our computing curriculum develops computational thinking and digital literacy, with carefully sequenced units that build programming skills, understanding of technology, and safe digital citizenship over time.", // GUESSED description
    keyStages: ["ks1", "ks2", "ks3", "ks4"], // GUESSED key stages
    aliases: ["ICT", "computer science"],
  },
  {
    title: "English",
    slug: "english",
    description:
      "Our English curriculum provides a rich foundation in reading, writing, and spoken language, with carefully sequenced units that build vocabulary, comprehension, and communication skills over time.", // GUESSED description
    keyStages: ["ks1", "ks2", "ks3", "ks4"], // GUESSED key stages
    aliases: [],
  },
  {
    title: "Maths",
    slug: "maths",
    description:
      "Our maths curriculum builds mathematical fluency and problem-solving skills, with carefully sequenced units that develop number sense, reasoning, and mathematical understanding over time.", // GUESSED description
    keyStages: ["ks1", "ks2", "ks3", "ks4"], // GUESSED key stages
    aliases: ["mathematics", "math"],
  },
  {
    title: "Science",
    slug: "science",
    description:
      "Our science curriculum inspires curiosity about the natural world, with carefully sequenced units that build scientific knowledge, investigation skills, and understanding of key concepts over time.", // GUESSED description
    keyStages: ["ks1", "ks2", "ks3", "ks4"], // GUESSED key stages
    aliases: [],
  },
  {
    title: "Biology",
    slug: "biology",
    description:
      "Our biology curriculum explores the living world in depth, with carefully sequenced units that build understanding of life processes, ecosystems, and biological principles over time.", // GUESSED description
    keyStages: ["ks3", "ks4"], // GUESSED key stages
    aliases: [],
  },
  {
    title: "Chemistry",
    slug: "chemistry",
    description:
      "Our chemistry curriculum reveals the building blocks of matter, with carefully sequenced units that build understanding of chemical reactions, elements, and molecular science over time.", // GUESSED description
    keyStages: ["ks3", "ks4"], // GUESSED key stages
    aliases: [],
  },
  {
    title: "Citizenship",
    slug: "citizenship",
    description:
      "Our citizenship curriculum prepares young people for active participation in society, with carefully sequenced units that build understanding of democracy, rights, and civic responsibility over time.", // GUESSED description
    keyStages: ["ks3", "ks4"], // GUESSED key stages
    aliases: [],
  },
  {
    title: "Music",
    slug: "music",
    description:
      "Our music curriculum develops musical understanding and creativity, with carefully sequenced units that build performance skills, musical knowledge, and appreciation of diverse musical traditions over time.", // GUESSED description
    keyStages: ["ks1", "ks2", "ks3", "ks4"], // GUESSED key stages
    aliases: [],
  },
  {
    title: "Financial Education",
    slug: "financial-education",
    description:
      "Our financial education curriculum equips students with essential money management skills, with carefully sequenced units that build understanding of personal finance and economic literacy over time.", // GUESSED description
    keyStages: ["ks4"], // GUESSED key stages
    aliases: [],
  },

  // GUESSED subjects - need confirmation these exist in Oak
  {
    title: "History",
    slug: "history",
    description:
      "Our history curriculum provides a rich, connected story of the past, with carefully sequenced units that build knowledge, vocabulary, and enquiry skills over time.", // GUESSED
    keyStages: ["ks1", "ks2", "ks3", "ks4"], // GUESSED
    aliases: [],
  },
  {
    title: "Geography",
    slug: "geography",
    description:
      "Our geography curriculum explores our world and place within it, with carefully sequenced units that build understanding of physical and human geography, geographical skills, and global awareness over time.", // GUESSED
    keyStages: ["ks1", "ks2", "ks3", "ks4"], // GUESSED
    aliases: [],
  },
  {
    title: "Art",
    slug: "art",
    description:
      "Our art curriculum develops creative expression and visual literacy, with carefully sequenced units that build artistic skills, knowledge of art history, and appreciation of diverse artistic traditions over time.", // GUESSED
    keyStages: ["ks1", "ks2", "ks3", "ks4"], // GUESSED
    aliases: ["art and design", "visual arts"],
  },
  {
    title: "Physics",
    slug: "physics",
    description:
      "Our physics curriculum explores the fundamental laws of the universe, with carefully sequenced units that build understanding of forces, energy, waves, and the physical world around us over time.", // GUESSED
    keyStages: ["ks3", "ks4"], // GUESSED
    aliases: [],
  },
  {
    title: "PE",
    slug: "physical-education",
    description:
      "Our PE curriculum promotes physical literacy and healthy lifestyles, with carefully sequenced units that build movement skills, understanding of health and fitness, and appreciation of sport over time.", // GUESSED
    keyStages: ["ks1", "ks2", "ks3", "ks4"], // GUESSED
    aliases: ["physical education", "phys ed"],
  },
  {
    title: "Drama",
    slug: "drama",
    description:
      "Our drama curriculum develops performance skills and creative expression, with carefully sequenced units that build understanding of theatre, character development, and storytelling techniques over time.", // GUESSED
    keyStages: ["ks1", "ks2", "ks3", "ks4"], // GUESSED
    aliases: ["theatre", "performing arts"],
  },
  {
    title: "French",
    slug: "french",
    description:
      "Our French curriculum opens doors to French language and culture, with carefully sequenced units that build vocabulary, grammar, and communication skills in French over time.", // GUESSED
    keyStages: ["ks2", "ks3", "ks4"], // GUESSED
    aliases: ["français"],
  },
  {
    title: "Spanish",
    slug: "spanish",
    description:
      "Our Spanish curriculum opens doors to Spanish language and culture, with carefully sequenced units that build vocabulary, grammar, and communication skills in Spanish over time.", // GUESSED
    keyStages: ["ks2", "ks3", "ks4"], // GUESSED
    aliases: ["español"],
  },
  {
    title: "German",
    slug: "german",
    description:
      "Our German curriculum opens doors to German language and culture, with carefully sequenced units that build vocabulary, grammar, and communication skills in German over time.", // GUESSED
    keyStages: ["ks2", "ks3", "ks4"], // GUESSED
    aliases: ["deutsch"],
  },
  {
    title: "Design Technology",
    slug: "design-technology",
    description:
      "Our design technology curriculum develops practical problem-solving skills, with carefully sequenced units that build understanding of design processes, materials, and engineering principles over time.", // GUESSED
    keyStages: ["ks1", "ks2", "ks3", "ks4"], // GUESSED
    aliases: ["DT", "design and technology"],
  },
  {
    title: "PSHE",
    slug: "rshe-pshe",
    description:
      "Our PSHE curriculum supports personal development and wellbeing, with carefully sequenced units that build understanding of relationships, health, and life skills over time.", // GUESSED
    keyStages: ["ks1", "ks2", "ks3", "ks4"], // GUESSED
    aliases: ["personal social health education", "personal development"],
  },
  {
    title: "RE",
    slug: "religious-education",
    description:
      "Our RE curriculum explores diverse beliefs and values, with carefully sequenced units that build understanding of world religions, ethics, and philosophical thinking over time.", // GUESSED
    keyStages: ["ks1", "ks2", "ks3", "ks4"], // GUESSED
    aliases: ["religious education", "religion", "religious studies"],
  },
];

const fuse = new Fuse(OAK_SUBJECTS, {
  keys: ["title", "slug", "aliases"],
  threshold: 0.2, // Lower = more strict matching
  minMatchCharLength: 2,
});

function mapKeyStageToTitle(keyStage: string): string {
  switch (keyStage) {
    case "ks1":
      return "Key stage 1";
    case "ks2":
      return "Key stage 2";
    case "ks3":
      return "Key stage 3";
    case "ks4":
      return "Key stage 4";
    case "eyfs":
      return "Early Years";
    default:
      return keyStage.toUpperCase();
  }
}

function createKeyStageLinks(keyStages: string[], subjectSlug: string) {
  return keyStages.map((ks) => ({
    slug: ks,
    title: mapKeyStageToTitle(ks),
    href: `/teachers/key-stages/${ks}/subjects/${subjectSlug}/programmes`,
  }));
}

export const findSuggestion = (query: string): SearchSuggestion | null => {
  if (!query.trim() || query.length < 2) {
    return null;
  }

  const results = fuse.search(query);

  if (!results[0]) {
    return null;
  }

  const bestMatch = results[0].item;

  return {
    type: "subject" as const,
    title: bestMatch.title,
    description: bestMatch.description,
    slug: bestMatch.slug,
    keyStages: createKeyStageLinks(bestMatch.keyStages, bestMatch.slug),
  };
};
