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
    "/support-your-team",
    "/contact-us",
    "/about-us/who-we-are",
    "/about-us/leadership",
    "/about-us/board",
    "/about-us/partners",
    "/about-us/work-with-us",
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
    // Legacy content pages
    "/teachers/key-stages/ks1/subjects",
    "/teachers/key-stages/ks4/subjects/maths/programmes",
    "/teachers/programmes/maths-secondary-ks4-foundation/units",
    "/teachers/programmes/computing-secondary-ks4-gcse-l/units",
    "/teachers/programmes/maths-secondary-ks4-foundation/units/algebraic-manipulation/lessons", // unit with tiers
    "/teachers/programmes/design-technology-secondary-ks3-l/units/packaging-pop-outs-bc35/lessons/designing-for-others-6mtk2t", // all yellow boxes
    "/teachers/programmes/maths-secondary-ks4-foundation/units/algebraic-manipulation/lessons/further-algebraic-terminology/downloads?preselected=slide+deck",
    // "/teachers/search?term=computing&keyStages=ks4&subjects=computing&contentTypes=unit",
    // New content pages
    "/teachers/programmes/english-secondary-ks3/units", // No programme factors
    "/teachers/programmes/english-secondary-ks3/units/victorian-childhood-non-fiction-reading-and-writing/lessons",
    "/teachers/programmes/english-secondary-ks3/units/victorian-childhood-non-fiction-reading-and-writing/lessons/victorian-childhood-preparing-an-argument",
    "/teachers/key-stages/ks4/subjects/combined-science/programmes",
    "/teachers/programmes/combined-science-secondary-ks4-higher-aqa/units",
    "/teachers/programmes/combined-science-secondary-ks4-higher-aqa/units/measuring-waves/lessons",
    "/teachers/programmes/combined-science-secondary-ks4-higher-aqa/units/measuring-waves/lessons/oscilloscope",
    "/teachers/programmes/spanish-secondary-ks4-aqa/units/travel-and-tourism-nuevas-experiencias/lessons", // unitvariant uses null lessons
    "/teachers/programmes/spanish-secondary-ks4-edexcel/units/travel-and-tourism-nuevas-experiencias/lessons",
    "/teachers/programmes/biology-secondary-ks4-higher-aqa/units/health-and-disease/lessons",
    "/teachers/programmes/history-primary-ks1/units/traditional-stories-what-do-they-tell-us-about-the-distant-past-1757/lessons", // optionality variant using null lessons
    "/teachers/programmes/physical-education-primary-ks2/units/invasion-games-principles-of-attack-and-defence-through-ball-games/lessons/passing-and-receiving-skills",
    // Canonical lesson pages
    "/teachers/lessons/duncan-as-a-father-figure",
    "/teachers/lessons/duncan-as-a-father-figure/downloads",
    "/teachers/lessons/transverse-waves",
    "/teachers/lessons/transverse-waves/downloads",
    // User pages
    "/sign-up",
    "/sign-in",
    "/onboarding",
    "/onboarding/role-selection",
    // Pupil pages
    "/pupils/years",
    "/pupils/years/year-10/subjects",
    "/pupils/programmes/combined-science-secondary-year-10/options",
    "/pupils/programmes/maths-primary-year-5/units",
    "/pupils/programmes/maths-primary-year-5/units/multiplication-by-partitioning-leading-to-short-multiplication-3-by-1-digit/lessons",
    "/pupils/programmes/geography-primary-year-5/units/north-and-south-america-how-diverse-are-their-places-and-landscapes/lessons/physical-geography-of-north-and-south-america/overview",
    "/pupils/programmes/computing-primary-year-5-l/units/vector-drawing-ea06/lessons/create-a-vector-drawing-cgvpac/intro",
    // Below urls have tickets raised for pa11y errors
    // "/pupils/lessons/sexual-consent-and-the-law-6gt3et/overview",
    // "/pupils/programmes/art-primary-year-1-l/units/drawing-c92d/lessons/exploring-shadows-and-tone-6hjk0t/intro",
    "/pupils/programmes/maths-secondary-year-7/units/expressions-and-equations/lessons/highest-common-factor-with-algebraic-terms/starter-quiz",
    // "/pupils/programmes/biology-secondary-year-11-foundation-edexcel/units/classification-in-modern-biology/lessons/electron-microscopy-and-the-size-and-scale-of-cells/video",
    "/pupils/programmes/maths-secondary-year-7/units/expressions-and-equations/lessons/simplifying-before-multiplying-with-multiple-expressions/exit-quiz",
    // Curriculum pages
    "/teachers/curriculum/english-secondary-aqa/units",
    "/teachers/curriculum/english-secondary-aqa/overview",
    "/teachers/curriculum/english-secondary-aqa/downloads",
    "/teachers/curriculum/science-secondary-ocr/units",
    "/teachers/curriculum/science-secondary-ocr/downloads",
    "/teachers/curriculum/previous-downloads",
    "/teachers/curriculum",
    "/teachers/curriculum/english-primary/units/speaking-and-listening",
    "/teachers/curriculum/english-primary/units/king-tut-or-healthy-lifestyle-non-chronological-report",
    "/teachers/curriculum/english-primary/units/king-tut-or-healthy-lifestyle-non-chronological-report-629",
  ];
}

module.exports = getDeploymentTestUrls;
