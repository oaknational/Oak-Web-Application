// Relative URLs used by pa11y and percy

// Commented out urls have pa11y errors to be fixed in this ticket - https://github.com/oaknational/Oak-Web-Application/issues/1693

function getDeploymentTestUrls() {
  return [
    // Error pages
    "/404",
    // "/500", // Removing as current issue with 500 responses on Netlify previews means this always fails.
    // Public pages
    "/",
    "/lesson-planning",
    "/contact-us",
    // About Us pages
    "/about-us/who-we-are",
    "/about-us/oaks-curricula",
    "/about-us/meet-the-team",
    "/about-us/meet-the-team/john-roberts?section=leadership",
    "/about-us/get-involved",
    // Blog pages
    "/blog",
    "/blog/how-to-design-a-unit-of-study",
    "/blog/evolution-of-oak",
    "/blog/join-the-childrens-mental-health-week-assembly-2022",
    "/webinars/effective-feedback-a-practical-guide-to-using-feedback-to-enhance-student",
    "/legal/accessibility-statement",
    // landing pages
    // "/lp/shape-your-curriculum-with-oak",
    // "/lp/trusted-by-teachers",
    // "/lp/how-to-use-Oak-in-3-easy-steps",
    "/lp/help-shape-oak",
    // "/lp/oak-calendar",
    "/teachers/search?term=equate&keyStages=ks4", // results with tier and examboard drop downs

    // Programme pages
    "/teachers/programmes/history-primary/units", // primary
    "/teachers/programmes/physical-education-primary/units", // with all years
    "/teachers/programmes/art-primary/units?keystages=ks1", // keystage filter
    "/teachers/programmes/art-primary/units?years=2", // year filter
    "/teachers/programmes/maths-secondary/units", // with tiers
    "/teachers/programmes/science-secondary-aqa/units?child_subjects=chemistry&keystages=ks4", // with child subject
    "/teachers/programmes/history-primary/curriculum-explainer", // curriculum explainer
    "/teachers/programmes/history-primary/download", // download tab

    // Unit pages
    "/teachers/programmes/art-primary-ks1/units/reclaimed-materials-drawing-and-sculpture/lessons", // primary
    "/teachers/programmes/combined-science-secondary-ks4-foundation-aqa/units/eukaryotic-and-prokaryotic-cells/lessons", // with tier and subject toggles
    "/teachers/programmes/spanish-secondary-ks4-aqa/units/travel-and-tourism-nuevas-experiencias/lessons", // unitvariant uses null lessons
    "/teachers/programmes/history-primary-ks1/units/traditional-stories-what-do-they-tell-us-about-the-distant-past-1757/lessons", // optionality variant using null lessons
    "/teachers/programmes/music-secondary-ks4-edexcel/units/intro-to-pop-music/lessons", // copyright content

    // Lesson pages
    "/teachers/programmes/art-primary-ks1/units/reclaimed-materials-drawing-and-sculpture/lessons", //primary
    "/teachers/programmes/english-secondary-ks3/units/victorian-childhood-non-fiction-reading-and-writing/lessons/victorian-childhood-preparing-an-argument",
    "/teachers/programmes/combined-science-secondary-ks4-higher-aqa/units/measuring-waves/lessons/oscilloscope",
    "/teachers/programmes/physical-education-primary-ks2/units/invasion-games-principles-of-attack-and-defence-through-ball-games/lessons/passing-and-receiving-skills", // practical PE lesson
    "/teachers/programmes/computing-primary-ks1/units/building-sequences-in-programs/lessons/building-blocks-to-create-a-sequence", // lesson with media clips and additional materials
    "/teachers/programmes/computing-primary-ks1/units/digital-writing/lessons/comparing-digital-writing-to-using-a-pencil", // lesson with lesson files,
    "/teachers/programmes/computing-primary-ks1/units/digital-writing/lessons/comparing-digital-writing-to-using-a-pencil/share", // lesson share page (PUPIL-1748)

    // Canonical lesson pages
    "/teachers/lessons/duncan-as-a-father-figure",
    "/teachers/lessons/transverse-waves",

    // User pages
    {
      url: "/sign-in",
      timeout: 120000,
    },

    // Pupil pages
    "/pupils/years",
    "/pupils/years/year-10/subjects",
    "/pupils/programmes/combined-science-secondary-year-10/options",
    "/pupils/programmes/maths-primary-year-5/units",
    "/pupils/programmes/maths-primary-year-5/units/multiplication-by-partitioning-leading-to-short-multiplication-3-by-1-digit/lessons",
    "/pupils/programmes/geography-primary-year-5/units/north-and-south-america-how-diverse-are-their-places-and-landscapes/lessons/physical-geography-of-north-and-south-america/overview",
    // Below urls have tickets raised for pa11y errors
    // "/pupils/lessons/sexual-consent-and-the-law-6gt3et/overview",
    // "/pupils/programmes/art-primary-year-1-l/units/drawing-c92d/lessons/exploring-shadows-and-tone-6hjk0t/intro",
    "/pupils/programmes/maths-secondary-year-7/units/expressions-and-equations/lessons/highest-common-factor-with-algebraic-terms/starter-quiz",
    // "/pupils/programmes/biology-secondary-year-11-foundation-edexcel/units/classification-in-modern-biology/lessons/electron-microscopy-and-the-size-and-scale-of-cells/video",
    "/pupils/programmes/maths-secondary-year-7/units/expressions-and-equations/lessons/simplifying-before-multiplying-with-multiple-expressions/exit-quiz",
  ];
}

module.exports = getDeploymentTestUrls;
