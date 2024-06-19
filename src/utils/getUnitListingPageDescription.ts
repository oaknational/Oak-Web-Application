const unitListingPageDescriptionLookup: Record<
  string,
  Record<string, string>
> = {
  maths: {
    ks1: "Explore our KS1 maths units to find inspiration and adaptable teaching resources to use when planning for your primary maths classes. With slide decks, quizzes, lesson planning guidance and maths practice worksheets for years 1 and 2, they give you a solid foundation on which to plan your own lessons.",
    ks2: "Use our KS2 maths units to find sequenced slide decks, quizzes and maths worksheets for years 3, 4, 5 and 6. Whether you're in need of some inspiration or looking for teaching resources and classroom practice tasks for your next lesson, download what you need and adapt them to suit your classes.",
    ks3: "Use our sequenced teaching resources to plan lessons that seamlessly transition from year 6 and build pupils’ understanding at KS3 maths. With year 7, 8 and 9 maths worksheets, slide decks and quizzes, download what you need and adapt to your classes.",
    ks4: "Use our key stage 4 maths teaching resources to prepare your year 10 and 11 pupils for GCSE exam success at both foundation and higher tiers. Alongside sequenced slide decks and quizzes, save time designing practice tasks and revision with our maths worksheets.",
    "early-years-foundation-stage": "",
  },
};

export const getUnitListingPageDescription = (
  subject: string,
  keystage?: string,
) => {
  const subjectKeystages = unitListingPageDescriptionLookup[subject];
  if (subjectKeystages && keystage) {
    return subjectKeystages[keystage];
  }
};
