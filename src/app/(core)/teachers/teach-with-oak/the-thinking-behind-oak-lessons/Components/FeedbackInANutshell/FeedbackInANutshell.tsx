import { OakLI, OakOL, OakP } from "@oaknational/oak-components";

import { SectionContent } from "../SectionContentList/SectionContentList";
import { NutshellSection } from "../NutshellSection/NutshellSection";
import { getTeacherJourneyImageUrl } from "../getTeacherJourneyImageUrl";

const feedbackContent: SectionContent = [
  {
    type: "heading-and-text",
    heading: "What?",
    text: "Feedback is a pedagogical strategy that gives pupils information about how they are doing and how they can improve.",
  },
  {
    type: "heading-and-text",
    heading: "Why?",
    text: "Effective feedback helps pupils recognise gaps between their current and desired performance, enabling them to improve.",
  },
  {
    type: "heading-and-text",
    heading: "What does the research say?",
    text: [
      "Hattie and Timperley (2007) (1) found that feedback can have a powerful influence on learning, while the EEF (2026) (2) identifies it as a high-impact approach. How feedback is designed and used, however, matters in helping pupils move their learning forward.",
      "Simply giving feedback is not enough. When and how it is given affects how well pupils understand and respond to it.",
      "Pupils also need the opportunity to act on feedback and use it to improve their learning.",
    ],
  },
  {
    type: "callout",
    id: "feedback-callout",
    quote:
      "Effective feedback helps pupils understand what to do next and gives them the opportunity to act on it.",
  },
  {
    type: "heading-and-text",
    heading: "Research references",
    text: [
      "(1) Hattie, J. and Timperley, H. (2007). The power of feedback. Review of Educational Research, 77(1), 81–112.",
      "(2) Education Endowment Foundation (2026). Feedback. Teaching and Learning Toolkit.",
    ],
  },
  {
    type: "heading-and-text",
    heading: "What are the key features of explanation in Oak lessons?",
    text: [
      "Feedback appears in every learning cycle immediately following a practice task. It is indicated on slides by a pale background and corner icon. It is designed around the following features:",
      <OakP key="timely">
        <strong>Timely</strong> feedback follows CfUs and practice - when it
        best supports pupils’ learning.
      </OakP>,
      <OakP key="actionable">
        <strong>Actionable</strong> feedback shows pupils how to improve and
        gives teachers a basis for further feedback.
      </OakP>,
    ],
  },
  {
    type: "images",
    id: "feedback-images",
    images: [
      {
        heading: "Timely",
        src: getTeacherJourneyImageUrl("Timely_Image_1_i6uknc"),
        height: 630,
        width: 360,
        alt: "Two check-for-understanding slides showing a multiple-choice question before and after the correct answer is revealed with a tick.",
      },
      {
        heading: "CfU feedback",
        src: getTeacherJourneyImageUrl("Timely_Image_2_oupqrs"),
        height: 630,
        width: 360,
        alt: "Two slides showing an exercise-sorting activity and the feedback slide, with benefits grouped into physical and mental health.",
        caption: "practice",
      },
      {
        heading: "Actionable",
        src: getTeacherJourneyImageUrl("Actionable_Image_1_pqelri"),
        height: 630,
        width: 369,
        alt: "A feedback slide  for a task involving a 3d figure made out of clay. Parts of the clay figure are labelled with explanations of the possible techniques and approaches that could have been used.",
      },
      {
        src: getTeacherJourneyImageUrl("Actionable_Image_2_xkeb10"),
        height: 630,
        width: 369,
        alt: "A feedback slide for a handwriting task, showing a multiple cursive lowercase M letters, one of which is circled. Multiple prompt questions are given, plus an instruction for pupils to circle their best attempt.",
      },
      {
        src: getTeacherJourneyImageUrl("Actionable_Image_3_nmtqvr"),
        height: 630,
        width: 369,
        alt: "A feedback slide with an example written response to a question about the Vietnam war. Key words in the answer are highlighted in bold pink.",
      },
      {
        src: getTeacherJourneyImageUrl("Actionable_Image_4_fwvx3f"),
        height: 630,
        width: 367,
        alt: "A feedback slide  with an example answer for a bar chart reading task where pupils have to calculate the percentage of pupils travelling by scooter. The solution involves adding all values together to get a total number of pupils, then using that to calculate the answer.",
      },
    ],
  },
  {
    type: "heading-and-text",
    heading: "Oak in your classroom",
    text: [
      "Consider how Oak’s lessons will work for the pupils in your classroom, and where you might choose to adapt them.",
      <OakOL key="questions" $mv={"spacing-0"}>
        <OakLI>
          How might you support your pupils to engage with feedback and use it
          to improve their learning?
        </OakLI>
        <OakLI>
          How might your pupils’ responses to feedback help you decide where and
          how to adapt your teaching?
        </OakLI>
      </OakOL>,
    ],
  },
];

export function FeedbackInANutshell() {
  return (
    <NutshellSection
      id="feedback"
      heading="Feedback in a nutshell"
      intro="Explore Oak’s approach to feedback and the thinking behind our design, with questions to help you reflect on what this means for your classroom."
      content={feedbackContent}
    />
  );
}
