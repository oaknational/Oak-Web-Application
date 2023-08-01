const overviewQuery = () => async () => {
  const curriculaDesc =
    "Our curriculum provides adaptable, coherently sequenced units to allow students to develop a deep, sustained understanding of mathematics at Key Stages 1-4. Evidence informed approaches including variation and the development of core sets of models and representations to build pupil knowledge and conceptual understanding. Lessons are designed to be flexible, accessible and to acknowledge the diversity in our schools. Central to the design of our curriculum is coherence in the development of key threads in mathematics. These threads reflect the structure of the National Curriculum, allowing teachers to track the development of key knowledge and skills. Reasoning and problem solving are integral. Resources promote the use of vocabulary allowing pupils to articulate their thinking and strengthen both their procedural knowledge and conceptual understanding. Use of talk allows pupils to explore mathematical connections and use key vocabulary accurately when presenting their reasoning.";

  const subjectPrinciples = [
    "Pairing procedural knowledge with conceptual understanding",
    "Aligning with the Concrete Pictorial Abstract approach to mathematics teaching and learning",
    "Use an agreed set of models and representations which bridge mathematical concepts",
    "Use of variation theory in practice tasks and modelling",
  ];

  const partnerBio =
    "Mathematics in Education and Industry (MEI) is an established charity and curriculum development body. Their primary aims are to raise the quality of maths education and promote the relevance of maths education to everyone. MEI are highly respected and are well connected with other quality assured organisations, including being a key partner in the NCETM, and are well known in schools for their excellent training and support programmes.";

  const videoGuideDesc =
    "Our new curriculum sequence has recently launched. For additional support, watch this video guide by {videoGuideAuthor} from our educational team, as they talk you through how to use this new tool.";
  return { curriculaDesc, subjectPrinciples, partnerBio, videoGuideDesc };
};

export default overviewQuery;
