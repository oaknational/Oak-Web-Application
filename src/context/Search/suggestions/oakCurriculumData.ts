export type CurriculumData = {
  title: string;
  slug: string;
  aliases?: string[];
};

export type SubjectData = CurriculumData & {
  description: string;
  keyStages: CurriculumData[];
  examBoards: CurriculumData[];
  years: CurriculumData[];
};

export const OAK_KEYSTAGES: CurriculumData[] = [
  {
    slug: "early-years-foundation-stage",
    title: "EYFS",
    aliases: [
      "early years",
      "early years foundation",
      "early years foundation stage",
    ],
  },
  {
    slug: "ks1",
    title: "Key Stage 1",
    aliases: ["keystage 1"],
  },
  {
    slug: "ks2",
    title: "Key Stage 2",
    aliases: ["keystage 2"],
  },
  {
    slug: "ks3",
    title: "Key Stage 3",
    aliases: ["keystage 3"],
  },
  {
    slug: "ks4",
    title: "Key Stage 4",
    aliases: ["keystage 4"],
  },
];

const oakKeystagesWithoutEyfs = OAK_KEYSTAGES.filter(
  (ks) => ks.slug !== "early-years-foundation-stage",
);

export const OAK_YEARS: CurriculumData[] = [
  {
    slug: "reception",
    title: "Reception",
  },
  {
    slug: "year-1",
    title: "Year 1",
    aliases: ["y1", "year1"],
  },
  {
    slug: "year-2",
    title: "Year 2",
    aliases: ["y2", "year2"],
  },
  {
    slug: "year-3",
    title: "Year 3",
    aliases: ["y3", "year3"],
  },
  {
    slug: "year-4",
    title: "Year 4",
    aliases: ["y4", "year4"],
  },
  {
    slug: "year-5",
    title: "Year 5",
    aliases: ["y5", "year5"],
  },
  {
    slug: "year-6",
    title: "Year 6",
    aliases: ["y6", "year6"],
  },
  {
    slug: "year-7",
    title: "Year 7",
    aliases: ["y7", "year7"],
  },
  {
    slug: "year-8",
    title: "Year 8",
    aliases: ["y8", "year8"],
  },
  {
    slug: "year-9",
    title: "Year 9",
    aliases: ["y9", "year9"],
  },
  {
    slug: "year-10",
    title: "Year 10",
    aliases: ["y10", "year10"],
  },
  {
    slug: "year-11",
    title: "Year 11",
    aliases: ["y11", "year11"],
  },
  {
    slug: "all-years",
    title: "All years",
  },
];

const yearsWithoutAllAndR = OAK_YEARS.filter(
  (y) => y.slug !== "r" && y.slug !== "all-years",
);

export const OAK_EXAMBOARDS: CurriculumData[] = [
  {
    slug: "aqa",
    title: "AQA",
  },
  {
    slug: "edexcel",
    title: "Edexcel",
  },
  {
    slug: "edexcelb",
    title: "Edexcel B",
  },
  {
    slug: "eduqas",
    title: "Eduqas",
  },
  {
    slug: "ocr",
    title: "OCR",
  },
];

export const OAK_SUBJECTS: SubjectData[] = [
  {
    title: "Art and design",
    slug: "art",
    description:
      "Our curriculum instils a passion for art, craft and design.  Pupils study a broad and diverse range of art and artists, as well as learning the knowledge and skills to develop their own reflective art practice.",
    keyStages: oakKeystagesWithoutEyfs,
    examBoards: [],
    years: [
      {
        slug: "year-1",
        title: "Year 1",
      },
      {
        slug: "year-2",
        title: "Year 2",
      },
      {
        slug: "year-3",
        title: "Year 3",
      },
      {
        slug: "year-4",
        title: "Year 4",
      },
      {
        slug: "year-5",
        title: "Year 5",
      },
      {
        slug: "year-6",
        title: "Year 6",
      },
      {
        slug: "year-7",
        title: "Year 7",
      },
      {
        slug: "year-8",
        title: "Year 8",
      },
      {
        slug: "year-9",
        title: "Year 9",
      },
      {
        slug: "year-10",
        title: "Year 10",
      },
    ],
    aliases: ["art and design", "art & design", "visual arts"],
  },
  {
    title: "Citizenship",
    slug: "citizenship",
    description:
      "Our curriculum aims to provide pupils with the knowledge and skills needed to play an effective role in public and democratic life. Pupils learn foundational concepts and are encouraged to think critically and debate on political and social issues.",
    keyStages: [
      {
        slug: "ks3",
        title: "Key Stage 3",
      },
      {
        slug: "ks4",
        title: "Key Stage 4",
      },
    ],
    examBoards: [],
    years: [
      {
        slug: "year-7",
        title: "Year 7",
      },
      {
        slug: "year-8",
        title: "Year 8",
      },
      {
        slug: "year-9",
        title: "Year 9",
      },
      {
        slug: "year-10",
        title: "Year 10",
      },
      {
        slug: "year-11",
        title: "Year 11",
      },
    ],
    aliases: ["civics", "citizenship education"],
  },
  {
    title: "Computing",
    slug: "computing",
    description:
      "Our curriculum enables pupils to become confident and efficient users of technology and establishes the important knowledge in computing to provide a foundation for the technical nature of the subject.",
    keyStages: oakKeystagesWithoutEyfs,
    examBoards: [
      {
        slug: "aqa",
        title: "AQA",
      },
      {
        slug: "ocr",
        title: "OCR",
      },
    ],
    years: yearsWithoutAllAndR,
    aliases: ["ict", "computer science", "cs", "computers"],
  },
  {
    title: "Design and technology",
    slug: "design-technology",
    description:
      "Our curriculum develops pupils’ knowledge of and skills in design applied through the designing and making of prototypes.  Pupils solve real world problems in context led units and evaluate their work and the work of others.",
    keyStages: oakKeystagesWithoutEyfs,
    examBoards: [],
    years: yearsWithoutAllAndR,
    aliases: ["design and technology", "design & technology", "dt", "d&t"],
  },
  {
    title: "Drama",
    slug: "drama",
    description: "",
    keyStages: [
      {
        slug: "ks1",
        title: "Key Stage 1",
      },
      {
        slug: "ks2",
        title: "Key Stage 2",
      },
      {
        slug: "ks3",
        title: "Key Stage 3",
      },
    ],
    examBoards: [],
    years: [
      {
        slug: "year-1",
        title: "Year 1",
      },
      {
        slug: "year-3",
        title: "Year 3",
      },
      {
        slug: "year-7",
        title: "Year 7",
      },
      {
        slug: "year-8",
        title: "Year 8",
      },
      {
        slug: "year-9",
        title: "Year 9",
      },
    ],
    aliases: [],
  },
  {
    title: "English",
    slug: "english",
    description:
      "Our curriculum enables pupils to manipulate language so that they can build their own meaning, sentences and structures.  They will become confident and effective communicators with a clear understanding of language and culture.",
    keyStages: oakKeystagesWithoutEyfs,
    examBoards: [
      {
        slug: "aqa",
        title: "AQA",
      },
      {
        slug: "edexcel",
        title: "Edexcel",
      },
      {
        slug: "eduqas",
        title: "Eduqas",
      },
    ],
    years: yearsWithoutAllAndR,
    aliases: [
      "ela",
      "english language arts",
      "literacy",
      "reading",
      "writing",
      "english language",
    ],
  },
  {
    title: "French",
    slug: "french",
    description:
      "Our curriculum enables pupils to manipulate language so that they can build their own meaning, sentences and structures.  They will become confident and effective communicators with a clear understanding of language and culture. ",
    keyStages: [
      {
        slug: "ks2",
        title: "Key Stage 2",
      },
      {
        slug: "ks3",
        title: "Key Stage 3",
      },
      {
        slug: "ks4",
        title: "Key Stage 4",
      },
    ],
    examBoards: [
      {
        slug: "aqa",
        title: "AQA",
      },
      {
        slug: "edexcel",
        title: "Edexcel",
      },
    ],
    years: [
      {
        slug: "year-3",
        title: "Year 3",
      },
      {
        slug: "year-4",
        title: "Year 4",
      },
      {
        slug: "year-5",
        title: "Year 5",
      },
      {
        slug: "year-7",
        title: "Year 7",
      },
      {
        slug: "year-8",
        title: "Year 8",
      },
      {
        slug: "year-9",
        title: "Year 9",
      },
      {
        slug: "year-10",
        title: "Year 10",
      },
      {
        slug: "year-11",
        title: "Year 11",
      },
    ],
    aliases: ["mfl french", "modern foreign languages french"],
  },
  {
    title: "Geography",
    slug: "geography",
    description:
      "Our curriculum aims to develop pupils’ understanding and curiosity of the world and their place in it. Through carefully structured learning they will analyse geographical patterns and address the social and environmental challenges the world faces.",
    keyStages: oakKeystagesWithoutEyfs,
    examBoards: [
      {
        slug: "aqa",
        title: "AQA",
      },
      {
        slug: "edexcelb",
        title: "Edexcel B",
      },
    ],
    years: yearsWithoutAllAndR,
    aliases: ["geog"],
  },
  {
    title: "German",
    slug: "german",
    description:
      "Our curriculum enables pupils to manipulate language so that they can build their own meaning, sentences and structures.  They will become confident and effective communicators with a clear understanding of language and culture. ",
    keyStages: [
      {
        slug: "ks3",
        title: "Key Stage 3",
      },
      {
        slug: "ks4",
        title: "Key Stage 4",
      },
    ],
    examBoards: [
      {
        slug: "aqa",
        title: "AQA",
      },
      {
        slug: "edexcel",
        title: "Edexcel",
      },
    ],
    years: [
      {
        slug: "year-7",
        title: "Year 7",
      },
      {
        slug: "year-8",
        title: "Year 8",
      },
      {
        slug: "year-9",
        title: "Year 9",
      },
      {
        slug: "year-10",
        title: "Year 10",
      },
      {
        slug: "year-11",
        title: "Year 11",
      },
    ],
    aliases: ["mfl german", "modern foreign languages german"],
  },
  {
    title: "History",
    slug: "history",
    description:
      "Our curriculum inspires curiosity about the past and develops pupils’ understanding of history as a discipline. It helps pupils understand historical concepts, methods of enquiry, and how different aspects of the past have been interpreted. ",
    keyStages: oakKeystagesWithoutEyfs,
    examBoards: [
      {
        slug: "aqa",
        title: "AQA",
      },
      {
        slug: "edexcel",
        title: "Edexcel",
      },
    ],
    years: yearsWithoutAllAndR,
    aliases: ["hist"],
  },
  {
    title: "Latin",
    slug: "latin",
    description: "",
    keyStages: [
      {
        slug: "ks3",
        title: "Key Stage 3",
      },
      {
        slug: "ks4",
        title: "Key Stage 4",
      },
    ],
    examBoards: [],
    years: [
      {
        slug: "year-7",
        title: "Year 7",
      },
      {
        slug: "year-8",
        title: "Year 8",
      },
      {
        slug: "year-9",
        title: "Year 9",
      },
      {
        slug: "year-10",
        title: "Year 10",
      },
    ],
    aliases: [],
  },
  {
    title: "Maths",
    slug: "maths",
    description:
      "Our curriculum develops pupils’ understanding of mathematics over time so that they become competent and confident in identifying and performing the mathematics they need both at school and in their daily lives.",
    keyStages: OAK_KEYSTAGES,
    examBoards: [],
    years: [
      {
        slug: "year-1",
        title: "Year 1",
      },
      {
        slug: "year-2",
        title: "Year 2",
      },
      {
        slug: "year-3",
        title: "Year 3",
      },
      {
        slug: "year-4",
        title: "Year 4",
      },
      {
        slug: "year-5",
        title: "Year 5",
      },
      {
        slug: "year-6",
        title: "Year 6",
      },
      {
        slug: "year-7",
        title: "Year 7",
      },
      {
        slug: "year-8",
        title: "Year 8",
      },
      {
        slug: "year-9",
        title: "Year 9",
      },
      {
        slug: "year-10",
        title: "Year 10",
      },
      {
        slug: "year-11",
        title: "Year 11",
      },
      {
        slug: "reception",
        title: "Reception",
      },
    ],
    aliases: ["mathematics", "math"],
  },
  {
    title: "Music",
    slug: "music",
    description:
      "Our curriculum develops pupils as musicians, fostering a deeper understanding of the subject as a platform for a lifelong connection with music. Pupils develop their musicianship and experience a diverse range of musicians and styles.",
    keyStages: [
      {
        slug: "ks1",
        title: "Key Stage 1",
      },
      {
        slug: "ks2",
        title: "Key Stage 2",
      },
      {
        slug: "ks3",
        title: "Key Stage 3",
      },
    ],
    examBoards: [],
    years: [
      {
        slug: "year-1",
        title: "Year 1",
      },
      {
        slug: "year-2",
        title: "Year 2",
      },
      {
        slug: "year-3",
        title: "Year 3",
      },
      {
        slug: "year-4",
        title: "Year 4",
      },
      {
        slug: "year-5",
        title: "Year 5",
      },
      {
        slug: "year-6",
        title: "Year 6",
      },
      {
        slug: "year-7",
        title: "Year 7",
      },
      {
        slug: "year-8",
        title: "Year 8",
      },
      {
        slug: "year-9",
        title: "Year 9",
      },
    ],
    aliases: [],
  },
  {
    title: "Physical education",
    slug: "physical-education",
    description:
      "Our curriculum develops pupils’ physical, psychological, social and emotional wellbeing. Competence and confidence are built alongside a focus on being active across a diverse range of sports and activities, encouraging lifelong participation.",
    keyStages: oakKeystagesWithoutEyfs,
    examBoards: [
      {
        slug: "aqa",
        title: "AQA",
      },
      {
        slug: "edexcel",
        title: "Edexcel",
      },
      {
        slug: "ocr",
        title: "OCR",
      },
    ],
    years: [
      {
        slug: "year-1",
        title: "Year 1",
      },
      {
        slug: "year-2",
        title: "Year 2",
      },
      {
        slug: "year-3",
        title: "Year 3",
      },
      {
        slug: "year-4",
        title: "Year 4",
      },
      {
        slug: "all-years",
        title: "All years",
      },
      {
        slug: "year-5",
        title: "Year 5",
      },
      {
        slug: "year-6",
        title: "Year 6",
      },
      {
        slug: "year-7",
        title: "Year 7",
      },
      {
        slug: "year-8",
        title: "Year 8",
      },
      {
        slug: "year-9",
        title: "Year 9",
      },
      {
        slug: "year-10",
        title: "Year 10",
      },
      {
        slug: "year-11",
        title: "Year 11",
      },
    ],
    aliases: ["pe", "phys ed", "physical education", "physical wellbeing"],
  },
  {
    title: "RSHE (PSHE)",
    slug: "rshe-pshe",
    description:
      "Our curriculum aims to equip pupils with the knowledge and skills necessary to make informed decisions about their wellbeing, health, and relationships.  We adhere to statutory guidance, ensuring that teachers are able to deliver correct and well-informed content.",
    keyStages: oakKeystagesWithoutEyfs,
    examBoards: [],
    years: yearsWithoutAllAndR,
    aliases: [
      "pshe",
      "rshe",
      "personal social health education",
      "relationships sex health education",
      "personal development",
      "sex education",
    ],
  },
  {
    title: "Religious education",
    slug: "religious-education",
    description:
      "Our curriculum prepares pupils to navigate the diversity of religious and non-religious worldviews that they may encounter. They will study these worldviews in human life, their teaching and traditions as well as the day-to-day experience of followers. ",
    keyStages: oakKeystagesWithoutEyfs,
    examBoards: [
      {
        slug: "aqa",
        title: "AQA",
      },
      {
        slug: "eduqas",
        title: "Eduqas",
      },
      {
        slug: "edexcelb",
        title: "Edexcel B",
      },
    ],
    years: yearsWithoutAllAndR,
    aliases: ["religious education", "re", "religion", "religious studies"],
  },
  {
    title: "Science",
    slug: "science",
    description:
      "Our curriculum aims to develop an interest in passion for science by exploring answers to big questions. We combine substantive and disciplinary knowledge to make practical skills, mathematical proficiency, and scientific practices meaningful.",
    keyStages: [
      {
        slug: "ks1",
        title: "Key Stage 1",
      },
      {
        slug: "ks2",
        title: "Key Stage 2",
      },
      {
        slug: "ks3",
        title: "Key Stage 3",
      },
    ],
    examBoards: [],
    years: [
      {
        slug: "year-1",
        title: "Year 1",
      },
      {
        slug: "year-2",
        title: "Year 2",
      },
      {
        slug: "year-3",
        title: "Year 3",
      },
      {
        slug: "year-4",
        title: "Year 4",
      },
      {
        slug: "year-5",
        title: "Year 5",
      },
      {
        slug: "year-6",
        title: "Year 6",
      },
      {
        slug: "year-7",
        title: "Year 7",
      },
      {
        slug: "year-8",
        title: "Year 8",
      },
      {
        slug: "year-9",
        title: "Year 9",
      },
    ],
    aliases: ["sciences", "general science"],
  },
  {
    title: "Biology",
    slug: "biology",
    description:
      "Our curriculum aims to develop an interest in passion for science by exploring answers to big questions. We combine substantive and disciplinary knowledge to make practical skills, mathematical proficiency, and scientific practices meaningful.",
    keyStages: [
      {
        slug: "ks4",
        title: "Key Stage 4",
      },
    ],
    examBoards: [
      {
        slug: "aqa",
        title: "AQA",
      },
      {
        slug: "edexcel",
        title: "Edexcel",
      },
      {
        slug: "ocr",
        title: "OCR",
      },
    ],
    years: [
      {
        slug: "year-10",
        title: "Year 10",
      },
      {
        slug: "year-11",
        title: "Year 11",
      },
    ],
    aliases: ["bio", "biology science"],
  },
  {
    title: "Chemistry",
    slug: "chemistry",
    description:
      "Our curriculum aims to develop an interest in passion for science by exploring answers to big questions. We combine substantive and disciplinary knowledge to make practical skills, mathematical proficiency, and scientific practices meaningful.",
    keyStages: [
      {
        slug: "ks4",
        title: "Key Stage 4",
      },
    ],
    examBoards: [
      {
        slug: "aqa",
        title: "AQA",
      },
      {
        slug: "edexcel",
        title: "Edexcel",
      },
      {
        slug: "ocr",
        title: "OCR",
      },
    ],
    years: [
      {
        slug: "year-10",
        title: "Year 10",
      },
      {
        slug: "year-11",
        title: "Year 11",
      },
    ],
    aliases: ["chem", "chemistry science"],
  },
  {
    title: "Combined science",
    slug: "combined-science",
    description:
      "Our curriculum aims to develop an interest in passion for science by exploring answers to big questions. We combine substantive and disciplinary knowledge to make practical skills, mathematical proficiency, and scientific practices meaningful.",
    keyStages: [
      {
        slug: "ks4",
        title: "Key Stage 4",
      },
    ],
    examBoards: [
      {
        slug: "aqa",
        title: "AQA",
      },
      {
        slug: "edexcel",
        title: "Edexcel",
      },
      {
        slug: "ocr",
        title: "OCR",
      },
    ],
    years: [
      {
        slug: "year-10",
        title: "Year 10",
      },
      {
        slug: "year-11",
        title: "Year 11",
      },
    ],
    aliases: ["combined sciences", "double award science", "trilogy science"],
  },
  {
    title: "Physics",
    slug: "physics",
    description:
      "Our curriculum aims to develop an interest in passion for science by exploring answers to big questions. We combine substantive and disciplinary knowledge to make practical skills, mathematical proficiency, and scientific practices meaningful.",
    keyStages: [
      {
        slug: "ks4",
        title: "Key Stage 4",
      },
    ],
    examBoards: [
      {
        slug: "aqa",
        title: "AQA",
      },
      {
        slug: "edexcel",
        title: "Edexcel",
      },
      {
        slug: "ocr",
        title: "OCR",
      },
    ],
    years: [
      {
        slug: "year-10",
        title: "Year 10",
      },
      {
        slug: "year-11",
        title: "Year 11",
      },
    ],
    aliases: ["physics science", "phys"],
  },
  {
    title: "Spanish",
    slug: "spanish",
    description:
      "Our curriculum enables pupils to manipulate language so that they can build their own meaning, sentences and structures.  They will become confident and effective communicators with a clear understanding of language and culture. ",
    keyStages: [
      {
        slug: "ks2",
        title: "Key Stage 2",
      },
      {
        slug: "ks3",
        title: "Key Stage 3",
      },
      {
        slug: "ks4",
        title: "Key Stage 4",
      },
    ],
    examBoards: [
      {
        slug: "aqa",
        title: "AQA",
      },
      {
        slug: "edexcel",
        title: "Edexcel",
      },
    ],
    years: [
      {
        slug: "year-3",
        title: "Year 3",
      },
      {
        slug: "year-4",
        title: "Year 4",
      },
      {
        slug: "year-5",
        title: "Year 5",
      },
      {
        slug: "year-6",
        title: "Year 6",
      },
      {
        slug: "year-7",
        title: "Year 7",
      },
      {
        slug: "year-8",
        title: "Year 8",
      },
      {
        slug: "year-9",
        title: "Year 9",
      },
      {
        slug: "year-10",
        title: "Year 10",
      },
      {
        slug: "year-11",
        title: "Year 11",
      },
    ],
    aliases: ["mfl spanish", "modern foreign languages spanish"],
  },
  {
    title: "Cooking and nutrition",
    slug: "cooking-nutrition",
    description:
      "Our curriculum equips pupils with practical food skills and develops their understanding of healthy and sustainable diets.  They are taught to make informed decisions and to celebrate food as an important part of different cultures.",
    keyStages: [
      {
        slug: "ks1",
        title: "Key Stage 1",
      },
      {
        slug: "ks2",
        title: "Key Stage 2",
      },
      {
        slug: "ks3",
        title: "Key Stage 3",
      },
    ],
    examBoards: [],
    years: [
      {
        slug: "year-1",
        title: "Year 1",
      },
      {
        slug: "year-2",
        title: "Year 2",
      },
      {
        slug: "year-3",
        title: "Year 3",
      },
      {
        slug: "year-4",
        title: "Year 4",
      },
      {
        slug: "year-5",
        title: "Year 5",
      },
      {
        slug: "year-6",
        title: "Year 6",
      },
      {
        slug: "year-7",
        title: "Year 7",
      },
      {
        slug: "year-8",
        title: "Year 8",
      },
      {
        slug: "year-9",
        title: "Year 9",
      },
    ],
    aliases: ["food technology", "food and nutrition", "food tech", "cooking"],
  },
  {
    title: "Financial education",
    slug: "financial-education",
    description: "",
    keyStages: oakKeystagesWithoutEyfs,
    examBoards: [],
    years: yearsWithoutAllAndR,
    aliases: [
      "financial literacy",
      "money management",
      "finance education",
      "personal finance",
    ],
  },
];
