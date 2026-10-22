import { OakHeading, OakLI, OakOL, OakP } from "@oaknational/oak-components";

import {
  HeadingAndText,
  HeadingAndTextContent,
} from "../HeadingAndText/HeadingAndText";

const feedbackContent: HeadingAndTextContent[] = [
  {
    heading: "What?",
    text: "Feedback is a pedagogical strategy that gives pupils information about how they are doing and how they can improve.",
  },
  {
    heading: "Why?",
    text: "Effective feedback helps pupils recognise gaps between their current and desired performance, enabling them to improve.",
  },
  {
    heading: "What does the research say?",
    text: [
      "Hattie and Timperley (2007) (1) found that feedback can have a powerful influence on learning, while the EEF (2026) (2) identifies it as a high-impact approach. How feedback is designed and used, however, matters in helping pupils move their learning forward.",
      "Simply giving feedback is not enough. When and how it is given affects how well pupils understand and respond to it.",
      "Pupils also need the opportunity to act on feedback and use it to improve their learning.",
    ],
  },
  {
    heading: "Research references",
    text: [
      "(1) Hattie, J. and Timperley, H. (2007). The power of feedback. Review of Educational Research, 77(1), 81–112.",
      "(2) Education Endowment Foundation (2026). Feedback. Teaching and Learning Toolkit.",
    ],
  },
  {
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
    <>
      <OakHeading
        $font={["heading-5", "heading-4", "heading-4"]}
        tag="h2"
        $mb={"spacing-32"}
        id="feedback"
      >
        Feedback in a nutshell
      </OakHeading>
      <OakP $mb={"spacing-32"}>
        Explore Oak’s approach to feedback and the thinking behind our design,
        with questions to help you reflect on what this means for your
        classroom.
      </OakP>
      {feedbackContent.map(({ heading, text }) => (
        <HeadingAndText key={heading} heading={heading} text={text} />
      ))}
    </>
  );
}
