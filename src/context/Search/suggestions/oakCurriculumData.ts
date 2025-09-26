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
  },
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
];

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
      "Our art and design curriculum is mapped to ensure that pupils explore knowledge, skills, content, processes, behaviours and attributes that will help them grow into young artists that are independent, capable and able to confidently engage with art in the world around them. \nPupils are exposed to a range of media, skills, and techniques, including links to real-world creative industries. We encourage art analysis and discussions with a careful selection of artworks by a wide range of artists, makers and designers’ past and present. Artists and artworks are contextualised and presented in ways that allow pupils to understand how art shapes and is shaped by the wider world. \nPupils will develop their ability to make and engage with art through structured, sequential threads of learning that are embedded to ensure they are securely learned. There will be a growing conviction of their ability to make and share responses to art and themes and to make art, craft and design they value.",
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
    ],
    aliases: ["art and design", "art & design", "visual arts"],
  },
  {
    title: "Citizenship",
    slug: "citizenship",
    description:
      "Our curriculum ensures pupils are equipped with the knowledge, skills and understanding to play an effective role in public and democratic life. Pupils study the subject through the foundational citizenship concepts of power, democracy, rights, law and justice, diversity and equality, finance and economy, and active citizenship. Pupils engage in inquiry and critical thinking on political and social issues as they explore multiple perspectives, weigh evidence and engage in debates about topical issues from climate change to misinformation, how democracy can evolve and competing rights are balanced. It supports pupils to deepen citizenship knowledge and understanding as they practise research, deliberation, argumentation, decision-making, advocate for different viewpoints and take action to make a positive difference in their communities and the wider world.",
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
      "We want pupils to leave Y11, ready to progress to higher levels of study or to a professional career with the following:\n● A strong grasp of how to use technology safely, respectfully and responsibly including social media and mobile devices\n● Multiple experiences to develop their skills, capabilities and creativity in computer science, digital media and information technology across a range of digital tools and devices\n● A strong understanding of how to apply analytical, computational and problem solving skills to a wide range of situations\n● Multiple experiences of programming where they have had the opportunity to encounter design, write and debug increasingly complex and modular programs\n● A strong awareness of current and emerging technologies and the impact these technologies may have on themselves and wider society",
    keyStages: OAK_KEYSTAGES,
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
    years: OAK_YEARS.filter((y) => y.slug !== "r" && y.slug !== "all-years"),
    aliases: ["ict", "computer science", "computers"],
  },
  {
    title: "Design and technology",
    slug: "design-technology",
    description:
      "Our curriculum is designed using authentic context-led units. It is centred around the knowledge of designing, making, evaluating, and technology and its interaction with society.\n\nThrough careful sequencing of the curriculum, pupils will develop their design and technology capability with increased confidence and autonomy. Knowledge and skills are applied through the manufacture of prototypes using a variety of materials, processes, and systems suitable to a context. Pupils will appreciate how technology works and, through critique, consider its impact on the world.\n\nPupils communicate and iterate both physically and digitally, mastering strategies including design thinking. Through repeat exposure to user and earth-centred design, pupils develop a sense of environmental consciousness, challenge stereotypes, and gain inspiration from the world around them.",
    keyStages: OAK_KEYSTAGES,
    examBoards: [],
    years: OAK_YEARS.filter((y) => y.slug !== "r" && y.slug !== "all-years"),
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
      "Our curriculum is thoughtfully designed to instil confidence and ignite a genuine passion for the language. It systematically nurtures pupils’ critical skills and knowledge until they are firmly grounded, enabling them to write with purpose and read with fluency and enjoyment.\n\nEvery facet of the English domain - spoken language, reading, writing, spelling, handwriting, grammar, vocabulary development, and poetry - is meticulously addressed, both as discrete and interwoven threads. Pupils engage in repeated and diversified practice, steadily progressing through well-defined steps, ensuring that learning is applicable across various contexts.\n\nWe take pride in nurturing students' sense of identity and self-esteem through a rich tapestry of diverse texts, instilling in them a dual identity as both readers and writers. All pupils emerge as exceptional communicators, regardless of their initial starting points, ready for further study and lifelong engagement with reading.",
    keyStages: OAK_KEYSTAGES,
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
    years: OAK_YEARS.filter((y) => y.slug !== "r" && y.slug !== "all-years"),
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
      "Our curriculum is innovatively designed to demystify language learning and spark interest in French. Rich content and clear communicative aims provide a meaningful opening to other cultures, whilst key language ideas connect lessons and units. We have chosen to teach the most frequently used words as these will be useful to learners whatever their context.\nAll elements of linguistic competence are meticulously interwoven through plentiful practice, first in listening and reading to build understanding, then in speaking and writing to develop manipulation and support independent context-rich effective communication. \n\nOver time, pupils apply their phonics, vocabulary and grammar knowledge through repeated practice in a variety of contexts. As a result, all pupils become effective communicators and learn new ways of thinking about language. They are motivated to study further and  use their language skills to exploit fully opportunities as global citizens. ",
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
      "Our geography curriculum is designed to develop pupils' geographical knowledge to better understand the world. It is structured around a carefully planned progression, allowing pupils to apply their geographical knowledge across a range of regional and thematic units. Key concepts and locations are revisited in increasingly complex contexts, helping pupils develop a deep knowledge and understanding of places, their locations, and their connections with the rest of the world. \n\nThe curriculum integrates mapwork, GIS, and graphical skills into units, enabling pupils to analyse geographical information over time and space.  This adaptable curriculum connects learning to real-world contexts, empowering students with the knowledge to grapple with complex issues, such as climate change and sustainability, and allow them to better understand their surroundings at both a local and global scale.\n\n",
    keyStages: OAK_KEYSTAGES,
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
    years: OAK_YEARS.filter((y) => y.slug !== "r" && y.slug !== "all-years"),
    aliases: ["geog"],
  },
  {
    title: "German",
    slug: "german",
    description:
      "Our curriculum is innovatively designed to demystify language learning and spark interest in German. Rich content and clear communicative aims provide a meaningful opening to other cultures, whilst key language ideas connect lessons and units. We have chosen to teach the most frequently used words as these will be useful to learners whatever their context.\nAll elements of linguistic competence are meticulously interwoven through plentiful practice, first in listening and reading to build understanding, then in speaking and writing to develop manipulation and support independent context-rich effective communication. \n\nOver time, pupils apply their phonics, vocabulary and grammar knowledge through repeated practice in a variety of contexts. As a result, all pupils become confident communicators and learn new ways of thinking about language. Regardless of their starting points, they are ready for further study and to use their language skills as global citizens. \n",
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
      "Our history curriculum is anchored in both substantive and disciplinary knowledge. By exploring British, European, and World history chronologically, it equips students to comprehend not just what transpired across extensive spans of time and geography, but also the intricate connections that link the events, civilizations, and developments they encounter.\nWe embrace the core objectives of the national curriculum and place a specific emphasis on knowledge, vocabulary, and diversity. Throughout our curriculum, we employ rigorous historical enquiry to shape students' disciplinary and substantive journeys. By incorporating a rich array of historical narratives, we secure knowledge retention and coherence across phases. Broad themes unite the curriculum, grounded in universal concepts that extend across its entirety.",
    keyStages: OAK_KEYSTAGES,
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
    years: OAK_YEARS.filter((y) => y.slug !== "r" && y.slug !== "all-years"),
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
      "Our curriculum provides adaptable, coherently sequenced units to allow pupils to develop a deep, sustained understanding of mathematics at Key Stages 3 and 4. Evidence informed approaches including variation and the development of core sets of models and representations build pupil knowledge and conceptual understanding. Lessons are designed to be flexible, accessible and to acknowledge the diversity in our schools.\n\nCentral to the design of our curriculum is coherence in the development of key threads in mathematics. These threads reflect the structure of the National Curriculum, allowing teachers to track the development of key knowledge and skills.\n\nReasoning and problem solving are integral. Resources promote the use of vocabulary allowing pupils to articulate their thinking and strengthen both their procedural knowledge and conceptual understanding. Use of talk allows pupils to explore mathematical connections and use key vocabulary accurately when presenting their reasoning.",
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
      {
        slug: "ks4",
        title: "Key Stage 4",
      },
      {
        slug: "early-years-foundation-stage",
        title: "Early Years Foundation Stage",
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
      "Our curriculum centres around developing pupils as musicians and is designed to be flexible and diverse, both in content and the way it is taught. Aligning with the national curriculum strands, and focusing on performing, composing and engaged listening, pupils develop a deeper understanding of music as a platform for a lifelong connection with music. Sequencing is fundamental in the design, demonstrating a route of progression which builds musicianship through developing musical knowledge, skills and specialist language. Performance threads consider accessibility, embracing singing for enjoyment and aural development and keyboard performance to encourage instrument proficiency. Composition threads promote development of creativity through a balance of artistic freedom and structured stylistic and theoretical guidance. Listening to engage with and understand music is integral as is developing an understanding of the musical elements and expression.",
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
      "Our physical education curriculum is built upon developing pupils’ knowledge, skills and the confidence to pursue a healthy active lifestyle. By offering diverse physical activities, we aim to develop pupils' physical competence, enhance their understanding of the importance of active living, and instil a purposeful, inclusive approach towards health, physical activity and competition. \n\nCurriculum threads provide additional levels of coherence between units. They allow for continuity in learning and help pupils achieve higher levels of proficiency in various disciplines, alongside increasingly complex physical activities. The curriculum also emphasises holistic development through the move, think, feel and connect framework. We focus on teamwork, leadership and personal responsibility whilst promoting respect, fairness and self-discipline. Our goal is to nurture well-rounded individuals who value physical activity and embody healthy lifestyle choices.\n",
    keyStages: OAK_KEYSTAGES,
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
    description: "",
    keyStages: OAK_KEYSTAGES,
    examBoards: [],
    years: OAK_YEARS.filter((y) => y.slug !== "r" && y.slug !== "all-years"),
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
      "In our curriculum, pupils meet worldviews in a way that builds complexity and depth. By the end of Year 11 pupils will have: \n● A strong grasp of concepts, such as covenant and dharma, being able to articulate the diverse ways in which they have been interpreted. \n● A grounding in key philosophical and ethical traditions leading to a secure understanding of how questions of belief, suffering and goodness have been addressed and contested.\n● Multiple opportunities to examine the continuing influence of religion and non religion in the world today, and to understand how religions have challenged and been challenged by society. \n● Multiple opportunities to explore case studies of religion and non-religion leading to a secure understanding of the complexity and diversity of worldviews in the UK and globally. \n● A secure grasp of the disciplines of religious study, such as theology, philosophy and social science, and the methods that scholars might use to answer questions.",
    keyStages: OAK_KEYSTAGES,
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
    years: OAK_YEARS.filter((y) => y.slug !== "r" && y.slug !== "all-years"),
    aliases: ["religious education", "re", "religion", "religious studies"],
  },
  {
    title: "Science",
    slug: "science",
    description:
      'Our science curriculum is built upon the exploration of big questions such as "What are living things and what are they made of?". Each unit develops scientific concepts within the national curriculum, and employs the latest research-based pedagogical strategies to address common misconceptions while enhancing pupils’ scientific knowledge and vocabulary effectively.\n\nUnits are organised into threads for each big question, providing a cohesive and seamless transition between key stages and establishing a clear trajectory for learning progression. At every key stage, units within each thread progressively tackle a big question in a meaningful and age-appropriate manner, delving deeper into answers as pupils advance through the curriculum.\n\nThe curriculum also emphasises the development of practical and fieldwork skills, mathematical proficiencies, and an understanding of scientific practices, all while embracing diversity as a fundamental principle woven into its fabric.',
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
      'Our science curriculum is built upon the exploration of big questions such as "What are living things and what are they made of?". Each unit develops scientific concepts within the national curriculum, and employs the latest research-based pedagogical strategies to address common misconceptions while enhancing pupils’ scientific knowledge and vocabulary effectively.\n\nUnits are organised into threads for each big question, providing a cohesive and seamless transition between key stages and establishing a clear trajectory for learning progression. At every key stage, units within each thread progressively tackle a big question in a meaningful and age-appropriate manner, delving deeper into answers as pupils advance through the curriculum.\n\nThe curriculum also emphasises the development of practical and fieldwork skills, mathematical proficiencies, and an understanding of scientific practices, all while embracing diversity as a fundamental principle woven into its fabric.',
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
      'Our science curriculum is built upon the exploration of big questions such as "What are living things and what are they made of?". Each unit develops scientific concepts within the national curriculum, and employs the latest research-based pedagogical strategies to address common misconceptions while enhancing pupils’ scientific knowledge and vocabulary effectively.\n\nUnits are organised into threads for each big question, providing a cohesive and seamless transition between key stages and establishing a clear trajectory for learning progression. At every key stage, units within each thread progressively tackle a big question in a meaningful and age-appropriate manner, delving deeper into answers as pupils advance through the curriculum.\n\nThe curriculum also emphasises the development of practical and fieldwork skills, mathematical proficiencies, and an understanding of scientific practices, all while embracing diversity as a fundamental principle woven into its fabric.',
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
      'Our science curriculum is built upon the exploration of big questions such as "What are living things and what are they made of?". Each unit develops scientific concepts within the national curriculum, and employs the latest research-based pedagogical strategies to address common misconceptions while enhancing pupils’ scientific knowledge and vocabulary effectively.\n\nUnits are organised into threads for each big question, providing a cohesive and seamless transition between key stages and establishing a clear trajectory for learning progression. At every key stage, units within each thread progressively tackle a big question in a meaningful and age-appropriate manner, delving deeper into answers as pupils advance through the curriculum.\n\nThe curriculum also emphasises the development of practical and fieldwork skills, mathematical proficiencies, and an understanding of scientific practices, all while embracing diversity as a fundamental principle woven into its fabric.',
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
      'Our science curriculum is built upon the exploration of big questions such as "What are living things and what are they made of?". Each unit develops scientific concepts within the national curriculum, and employs the latest research-based pedagogical strategies to address common misconceptions while enhancing pupils’ scientific knowledge and vocabulary effectively.\n\nUnits are organised into threads for each big question, providing a cohesive and seamless transition between key stages and establishing a clear trajectory for learning progression. At every key stage, units within each thread progressively tackle a big question in a meaningful and age-appropriate manner, delving deeper into answers as pupils advance through the curriculum.\n\nThe curriculum also emphasises the development of practical and fieldwork skills, mathematical proficiencies, and an understanding of scientific practices, all while embracing diversity as a fundamental principle woven into its fabric.',
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
      "Our curriculum is innovatively designed to demystify language learning and spark interest in Spanish. Rich content and clear communicative aims provide a meaningful opening to other cultures, whilst key language ideas connect lessons and units. We have chosen to teach the most frequently used words as these will be useful to learners whatever their context.\nAll elements of linguistic competence are meticulously interwoven through plentiful practice, first in listening and reading to build understanding, then in speaking and writing to develop manipulation and support independent context-rich effective communication. \n\nOver time, pupils apply their phonics, vocabulary and grammar knowledge through repeated practice in a variety of contexts. As a result, all pupils become effective communicators and learn new ways of thinking about language. They are motivated to study further and  use their language skills to exploit fully opportunities as global citizens. ",
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
      "Our curriculum recognises food as a fundamental aspect of life, enriching pupils’ knowledge and skills for their and others' wellbeing now and in the future. \n\nStructured around thematic units and threads, pupils are taught nutrition, food provenance, consumer awareness, and food hygiene and safety, applying their learning via cooking, tasting and scientific investigation.\n\nOur curriculum reflects the diversity of different food cultures, acknowledging changing needs while honouring diverse backgrounds. Pupils explore food and cuisines from around the world, broadening their horizons through hands-on experiences. Critical thinking skills are developed, enabling pupils to make informed food choices, and take action on global food challenges.\n\nThrough this curriculum we want pupils to have healthier and more sustainable diets, and celebrate food as a source of nourishment, connection, and joy.\n",
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
    keyStages: OAK_KEYSTAGES,
    examBoards: [],
    years: OAK_YEARS.filter((y) => y.slug !== "r" && y.slug !== "all-years"),
    aliases: [
      "financial literacy",
      "money management",
      "finance education",
      "personal finance",
    ],
  },
];
