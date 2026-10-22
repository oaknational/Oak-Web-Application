import { OakHeading, OakLI, OakOL, OakP } from "@oaknational/oak-components";

import {
  HeadingAndText,
  HeadingAndTextContent,
} from "../HeadingAndText/HeadingAndText";

const practiceContent: HeadingAndTextContent[] = [
  {
    heading: "What?",
    text: "Practice is a pedagogical strategy that gives pupils opportunities to apply and consolidate their learning.",
  },
  {
    heading: "Why?",
    text: "Effective practice reduces cognitive load and builds fluency, enabling pupils to think more deeply and work more independently.",
  },
  {
    heading: "What does the research say?",
    text: [
      "Research shows that practice is an important part of learning. Rosenshine (2012) (1) highlights the importance of giving pupils opportunities to practise, helping them secure new knowledge in long-term memory.",
      "But providing practice is not enough – it needs to be carefully designed. What pupils practise, and how hard they need to think, both matter.",
      "Effective practice helps pupils secure their knowledge, strengthen understanding, make connections and address misconceptions.",
    ],
  },
  {
    heading: "Research references",
    text: "(1) Rosenshine, B. (2012). Principles of instruction: Research-based strategies that all teachers should know. American Educator, 36(1), 12–19, 39.",
  },
  {
    heading: "What are the key features of explanation in Oak lessons?",
    text: [
      "Practice appears in every learning cycle. It is indicated on slides by a corner icon. It is designed around the following features:",
      <OakP key="meaningful">
        <strong>Meaningful</strong> practice strengthens learning so teachers
        can assess understanding of new knowledge.
      </OakP>,
      <OakP key="challenging">
        <strong>Challenging</strong> practice requires pupils to think hard and
        apply what they have learned.
      </OakP>,
    ],
  },
  {
    heading: "Oak in your classroom",
    text: [
      "Consider how Oak’s lessons will work for the pupils in your classroom, and where you might choose to adapt them.",
      <OakOL key="questions" $mv={"spacing-0"}>
        <OakLI>
          How might you further scaffold Oak’s practice tasks to ensure all your
          pupils can access the learning without reducing the challenge?
        </OakLI>
        <OakLI>
          Where might your pupils benefit from additional practice, and how
          might this affect the earlier explanation and CfUs?
        </OakLI>
      </OakOL>,
    ],
  },
];

export function PracticeInANutshell() {
  return (
    <>
      <OakHeading
        $font={["heading-5", "heading-4", "heading-4"]}
        tag="h2"
        $mb={"spacing-32"}
        id="practice"
      >
        Practice in a nutshell
      </OakHeading>
      <OakP $mb={"spacing-32"}>
        Explore Oak’s approach to practice and the thinking behind our design,
        with questions to help you reflect on what this means for your
        classroom.
      </OakP>
      {practiceContent.map(({ heading, text }) => (
        <HeadingAndText key={heading} heading={heading} text={text} />
      ))}
    </>
  );
}
