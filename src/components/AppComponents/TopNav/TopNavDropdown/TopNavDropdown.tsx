import {
  OakFlex,
  // OakSmallPrimaryInvertedButton,
  // OakSubjectIconButton,
} from "@oaknational/oak-components";

// const dropdownData = {
//   primary: [
//     {
//       phaseTitle: "Primary",
//       phaseSlug: "primary",
//       keystages: [
//         {
//           title: "Key stage 1",
//           slug: "ks1",
//           subjects: [
//             {
//               title: "Art and design",
//               slug: "art-primary-ks1",
//               nonCurriculum: false,
//             },
//             {
//               title: "Computing",
//               slug: "computing-primary-ks1",
//               nonCurriculum: false,
//             },
//             {
//               title: "Cooking and nutrition",
//               slug: "cooking-nutrition-primary-ks1",
//               nonCurriculum: false,
//             },
//             {
//               title: "Design and technology",
//               slug: "design-technology-primary-ks1",
//               nonCurriculum: false,
//             },
//             {
//               title: "Drama",
//               slug: "drama-primary-ks1-l",
//               nonCurriculum: false,
//             },
//             {
//               title: "English",
//               slug: "english-primary-ks1",
//               nonCurriculum: false,
//             },
//             {
//               title: "Geography",
//               slug: "geography-primary-ks1",
//               nonCurriculum: false,
//             },
//             {
//               title: "History",
//               slug: "history-primary-ks1",
//               nonCurriculum: false,
//             },
//             {
//               title: "Maths",
//               slug: "maths-primary-ks1",
//               nonCurriculum: false,
//             },
//             {
//               title: "Music",
//               slug: "music-primary-ks1",
//               nonCurriculum: false,
//             },
//             {
//               title: "Physical education",
//               slug: "physical-education-primary-ks1",
//               nonCurriculum: false,
//             },
//             {
//               title: "Religious education",
//               slug: "religious-education-primary-ks1",
//               nonCurriculum: false,
//             },
//             {
//               title: "RSHE (PSHE)",
//               slug: "rshe-pshe-primary-ks1",
//               nonCurriculum: false,
//             },
//             {
//               title: "Science",
//               slug: "science-primary-ks1",
//               nonCurriculum: false,
//             },
//           ],
//         },
//         {
//           title: "Key stage 2",
//           slug: "ks2",
//           subjects: [
//             {
//               title: "Art and design",
//               slug: "art-primary-ks2",
//               nonCurriculum: false,
//             },
//             {
//               title: "Computing",
//               slug: "computing-primary-ks2",
//               nonCurriculum: false,
//             },
//             {
//               title: "Cooking and nutrition",
//               slug: "cooking-nutrition-primary-ks2",
//               nonCurriculum: false,
//             },
//             {
//               title: "Design and technology",
//               slug: "design-technology-primary-ks2",
//               nonCurriculum: false,
//             },
//             {
//               title: "Drama",
//               slug: "drama-primary-ks2-l",
//               nonCurriculum: false,
//             },
//             {
//               title: "English",
//               slug: "english-primary-ks2",
//               nonCurriculum: false,
//             },
//             {
//               title: "French",
//               slug: "french-primary-ks2",
//               nonCurriculum: false,
//             },
//             {
//               title: "Geography",
//               slug: "geography-primary-ks2",
//               nonCurriculum: false,
//             },
//             {
//               title: "History",
//               slug: "history-primary-ks2",
//               nonCurriculum: false,
//             },
//             { title: "Maths", slug: "maths-primary-ks2", nonCurriculum: false },
//             { title: "Music", slug: "music-primary-ks2", nonCurriculum: false },
//             {
//               title: "Physical education",
//               slug: "physical-education-primary-ks2",
//               nonCurriculum: false,
//             },
//             {
//               title: "Religious education",
//               slug: "religious-education-primary-ks2",
//               nonCurriculum: false,
//             },
//             {
//               title: "RSHE (PSHE)",
//               slug: "rshe-pshe-primary-ks2",
//               nonCurriculum: false,
//             },
//             {
//               title: "Science",
//               slug: "science-primary-ks2",
//               nonCurriculum: false,
//             },
//             {
//               title: "Spanish",
//               slug: "spanish-primary-ks2",
//               nonCurriculum: false,
//             },
//           ],
//         },
//         {
//           title: "EYFS",
//           slug: "early-years-foundation-stage",
//           subjects: [
//             {
//               title: "Expressive arts and design",
//               slug: "expressive-arts-and-design-foundation-early-years-foundation-stage-l",
//               nonCurriculum: false,
//             },
//             {
//               title: "Literacy",
//               slug: "literacy-foundation-early-years-foundation-stage-l",
//               nonCurriculum: false,
//             },
//             {
//               title: "Maths",
//               slug: "maths-foundation-early-years-foundation-stage-l",
//               nonCurriculum: false,
//             },
//             {
//               title: "Personal, social and emotional development",
//               slug: "personal-social-and-emotional-development-foundation-early-years-foundation-stage-l",
//               nonCurriculum: false,
//             },
//             {
//               title: "Understanding the world",
//               slug: "understanding-the-world-foundation-early-years-foundation-stage-l",
//               nonCurriculum: false,
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   secondary: [
//     {
//       phaseTitle: "Secondary",
//       phaseSlug: "secondary",
//       keystages: [
//         {
//           title: "Key stage 3",
//           slug: "ks3",
//           subjects: [
//             {
//               title: "Art and design",
//               slug: "art-secondary-ks3",
//               nonCurriculum: false,
//             },
//             {
//               title: "Citizenship",
//               slug: "citizenship-secondary-ks3",
//               nonCurriculum: false,
//             },
//             {
//               title: "Computing",
//               slug: "computing-secondary-ks3",
//               nonCurriculum: false,
//             },
//             {
//               title: "Cooking and nutrition",
//               slug: "cooking-nutrition-secondary-ks3",
//               nonCurriculum: false,
//             },
//             {
//               title: "Design and technology",
//               slug: "design-technology-secondary-ks3",
//               nonCurriculum: false,
//             },
//             {
//               title: "Drama",
//               slug: "drama-secondary-ks3-l",
//               nonCurriculum: false,
//             },
//             {
//               title: "English",
//               slug: "english-secondary-ks3",
//               nonCurriculum: false,
//             },
//             {
//               title: "French",
//               slug: "french-secondary-ks3",
//               nonCurriculum: false,
//             },
//             {
//               title: "Geography",
//               slug: "geography-secondary-ks3",
//               nonCurriculum: false,
//             },
//             {
//               title: "German",
//               slug: "german-secondary-ks3",
//               nonCurriculum: false,
//             },
//             {
//               title: "History",
//               slug: "history-secondary-ks3",
//               nonCurriculum: false,
//             },
//             {
//               title: "Latin",
//               slug: "latin-secondary-ks3-l",
//               nonCurriculum: false,
//             },
//             {
//               title: "Maths",
//               slug: "maths-secondary-ks3",
//               nonCurriculum: false,
//             },
//             {
//               title: "Music",
//               slug: "music-secondary-ks3",
//               nonCurriculum: false,
//             },
//             {
//               title: "Physical education",
//               slug: "physical-education-secondary-ks3",
//               nonCurriculum: false,
//             },
//             {
//               title: "Religious education",
//               slug: "religious-education-secondary-ks3",
//               nonCurriculum: false,
//             },
//             {
//               title: "RSHE (PSHE)",
//               slug: "rshe-pshe-secondary-ks3",
//               nonCurriculum: false,
//             },
//             {
//               title: "Science",
//               slug: "science-secondary-ks3",
//               nonCurriculum: false,
//             },
//             {
//               title: "Spanish",
//               slug: "spanish-secondary-ks3",
//               nonCurriculum: false,
//             },
//             {
//               title: "Financial education",
//               slug: "financial-education-secondary-ks3",
//               nonCurriculum: true,
//             },
//           ],
//         },
//         {
//           title: "Key stage 4",
//           slug: "ks4",
//           subjects: [
//             {
//               title: "Art and design",
//               slug: "art-secondary-ks4",
//               nonCurriculum: false,
//             },
//             { title: "Biology", slug: "biology", nonCurriculum: false },
//             { title: "Chemistry", slug: "chemistry", nonCurriculum: false },
//             {
//               title: "Citizenship Core",
//               slug: "citizenship-secondary-ks4-core",
//               nonCurriculum: false,
//             },
//             {
//               title: "Citizenship GCSE",
//               slug: "citizenship-secondary-ks4-gcse",
//               nonCurriculum: false,
//             },
//             {
//               title: "Combined Science",
//               slug: "combined-science",
//               nonCurriculum: false,
//             },
//             {
//               title: "Computing Core",
//               slug: "computing-secondary-ks4-core",
//               nonCurriculum: false,
//             },
//             {
//               title: "Computing GCSE",
//               slug: "computing",
//               nonCurriculum: false,
//             },
//             {
//               title: "Design and technology",
//               slug: "design-technology-secondary-ks4",
//               nonCurriculum: false,
//             },
//             { title: "English", slug: "english", nonCurriculum: false },
//             {
//               title: "French",
//               slug: "french",
//               nonCurriculum: false,
//             },
//             { title: "Geography", slug: "geography", nonCurriculum: false },
//             { title: "German", slug: "german", nonCurriculum: false },
//             { title: "History", slug: "history", nonCurriculum: false },
//             {
//               title: "Latin",
//               slug: "latin-secondary-ks4-l",
//               nonCurriculum: false,
//             },
//             { title: "Maths", slug: "maths", nonCurriculum: false },
//             { title: "Music", slug: "music", nonCurriculum: false },
//             {
//               title: "Physical education Core",
//               slug: "physical-education-secondary-ks4-core",
//               nonCurriculum: false,
//             },
//             {
//               title: "Physical education GCSE",
//               slug: "physical-education",
//               nonCurriculum: false,
//             },
//             { title: "Physics", slug: "physics", nonCurriculum: false },
//             {
//               title: "Religious education",
//               slug: "religious-education",
//               nonCurriculum: false,
//             },
//             {
//               title: "RSHE (PSHE)",
//               slug: "rshe-pshe-secondary-ks4",
//               nonCurriculum: false,
//             },
//             { title: "Spanish", slug: "spanish", nonCurriculum: false },
//             {
//               title: "Financial education",
//               slug: "financial-education-secondary-ks4",
//               nonCurriculum: true,
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   guidance: [
//     { title: "Plan a lesson", slug: "plan-a-lesson" },
//     { title: "Support your team", slug: "support-your-team" },
//     { title: "Blogs", slug: "blogs" },
//     { title: "Webinars", slug: "webinars" },
//     { title: "Help", slug: "help" },
//   ],
//   aboutUs: [
//     { title: "Who we are", slug: "who-we-are" },
//     { title: "Leadership", slug: "leadership" },
//     { title: "Board", slug: "board" },
//     { title: "Partners", slug: "partners" },
//     { title: "Work with us", slug: "work-with-us" },
//     { title: "Contact us", slug: "contact-us" },
//   ],
// };

type TopNavDropdownProps = {
  section?: "primary" | "secondary" | "guidance" | "aboutUs";
  keystage?: string;
};

const TopNavDropdown = (props: TopNavDropdownProps) => {
  const { section = "primary" /* keystage = "ks1" */ } = props;

  // const sectionData = dropdownData[section];
  // const keystageData = sectionData?.find((s) =>
  //   s.keystages.find((ks) => ks.slug === keystage),
  // );
  return (
    <OakFlex $pa={"spacing-40"}>
      {/* {(section === "primary" || section === "secondary") && (
        <>
          <OakFlex $flexDirection={"column"} $gap={"spacing-8"}>
            {sectionData?.[0]?.keystages.map((keystage) => (
              <OakSmallPrimaryInvertedButton
                key={keystage.title}
                iconName="chevron-right"
                isTrailingIcon
              >
                {keystage.title}
              </OakSmallPrimaryInvertedButton>
            ))}
          </OakFlex>
        </>
      )}
      <OakFlex>
        {keystageData?.subjects?.map((subject) => <div>{subject.title}</div>)}
      </OakFlex> */}
      {section === "guidance" || (section === "aboutUs" && <div>Content</div>)}
    </OakFlex>
  );
};

export default TopNavDropdown;
