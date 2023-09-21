// Relative URLs used by pa11y and percy

// Commented out urls have pa11y errors to be fixed in this ticket - https://github.com/oaknational/Oak-Web-Application/issues/1693

function getDeploymentTestUrls() {
  return [
    // Error pages
    "/404",
    // Public pages
    "/",
    "/lesson-planning",
    "/develop-your-curriculum",
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
    // Beta pages
    "/teachers",
    "/teachers/key-stages/ks1/subjects",
    "/teachers/key-stages/ks4/subjects/maths-l/programmes",
    "/teachers/programmes/maths-secondary-ks4-foundation-l/units",
    "/teachers/programmes/computing-secondary-ks4-l/units",
    "/teachers/programmes/maths-secondary-ks4-foundation-l/units/directed-numbers-fe66/lessons", // unit with tiers
    "/teachers/programmes/english-primary-ks2-l/units/oliver-twist-narrative-writing-280c/lessons?page=2", // unit with pagination
    "teachers/programmes/design-technology-secondary-ks3-l/units/packaging-pop-outs-bc35/lessons/designing-for-others-6mtk2t", // all yellow boxes
    "/teachers/programmes/maths-secondary-ks4-foundation-l/units/directed-numbers-fe66/lessons/adding-directed-numbers-chjk4t/downloads?preselected=slide+deck",
    // "/teachers/search?term=computing&keyStages=ks4&subjects=computing&contentTypes=unit",
  ];
}

module.exports = getDeploymentTestUrls;
