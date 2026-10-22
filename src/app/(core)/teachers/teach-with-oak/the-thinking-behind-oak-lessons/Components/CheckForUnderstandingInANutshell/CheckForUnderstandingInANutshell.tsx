import { OakHeading, OakLI, OakOL, OakP } from "@oaknational/oak-components";

import {
  HeadingAndText,
  HeadingAndTextContent,
} from "../HeadingAndText/HeadingAndText";

const checkForUnderstandingContent: HeadingAndTextContent[] = [
  {
    heading: "What?",
    text: "Check for understanding is a pedagogical strategy that identifies pupils’ understanding and helps you decide whether to move on or explain further.",
  },
  {
    heading: "Why?",
    text: "Effective checks for understanding reveal what pupils have understood, enabling you to adapt your teaching accordingly.",
  },
  {
    heading: "What does the research say?",
    text: [
      "Research shows that checking for understanding is an important part of effective teaching. Rosenshine (2012) (1) found that effective teachers regularly check what pupils have understood. Lemov (2015) (2) also highlights the importance of checking understanding throughout a lesson.",
      "CfUs give teachers useful information about pupils’ learning, helping them spot misconceptions and decide whether to move on, reteach or adapt their teaching without overloading working memory.",
    ],
  },
  {
    heading: "Research references",
    text: [
      "(1) Rosenshine, B. (2012). Principles of instruction: Research-based strategies that all teachers should know. American Educator, 36(1), 12–19, 39.",
      "(2) Lemov, D. (2015). Teach Like a Champion 2.0: 62 Techniques that Put Students on the Path to College. Jossey-Bass.",
    ],
  },
  {
    heading: "What are the key features of explanation in Oak lessons?",
    text: [
      "CfUs appear in every explanation, in every learning cycle. They are indicated on slides by a corner icon and are on a pale background. They are designed around the following features:",
      <OakP key="peppered">
        <strong>Peppered</strong> CfUs are placed at significant points
        throughout explanations.
      </OakP>,
      <OakP key="focused">
        <strong>Focused</strong> CfUs target the most important knowledge and
        challenge common misconceptions.
      </OakP>,
      <OakP key="snappy">
        <strong>Snappy</strong> CfUs are interactive and quick to answer, so
        teachers can assess the whole class at a glance.
      </OakP>,
    ],
  },
  {
    heading: "Focused",
    text: [
      "Key Learning Points",
      <OakOL key="questions" $mv={"spacing-0"}>
        <OakLI>
          Citizenship covers concepts such as the law, democracy, the economy,
          identities, communities and rights.
        </OakLI>
        <OakLI>
          There are many ways to make social change happen like volunteering,
          pressure groups and lobbying.
        </OakLI>
        <OakLI>Statistics help me understand society and social change.</OakLI>
      </OakOL>,
    ],
  },
  {
    heading: "Oak in your classroom",
    text: [
      "Consider how Oak’s lessons will work for the pupils in your classroom, and where you might choose to adapt them.",
      <OakOL key="questions" $mv={"spacing-0"}>
        <OakLI>
          How could you use strategies such as mini whiteboards, voting or
          thumbs up/down to check understanding across the whole class?
        </OakLI>
        <OakLI>
          If a CfU revealed that a significant proportion of the class had
          answered incorrectly, how might you adapt your teaching before moving
          on?
        </OakLI>
      </OakOL>,
    ],
  },
];

export function CheckForUnderstandingInANutshell() {
  return (
    <>
      <OakHeading
        $font={["heading-5", "heading-4", "heading-4"]}
        tag="h2"
        $mb={"spacing-32"}
        id="check-for-understanding"
      >
        Check for understanding in a nutshell
      </OakHeading>
      <OakP $mb={"spacing-32"}>
        Explore Oak’s approach to check for understanding (CfU) and the thinking
        behind our design, with questions to help you reflect on what this means
        for your classroom.
      </OakP>
      {checkForUnderstandingContent.map(({ heading, text }) => (
        <HeadingAndText key={heading} heading={heading} text={text} />
      ))}
    </>
  );
}
