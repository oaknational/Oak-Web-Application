import { OakHeading, OakLI, OakOL, OakP } from "@oaknational/oak-components";

import {
  HeadingAndText,
  HeadingAndTextContent,
} from "../HeadingAndText/HeadingAndText";

const explanationContent: HeadingAndTextContent[] = [
  {
    heading: "What?",
    text: "Explanation is a pedagogical strategy that presents new knowledge to pupils and connects it with what they already know.",
  },
  {
    heading: "Why?",
    text: "Effective explanation makes new knowledge clear and manageable, helping pupils build secure understanding.",
  },
  {
    heading: "What does the research say?",
    text: [
      "Research shows that clear explanations can support learning. Hattie (2009) (1) identified teacher clarity as an important influence on learning.",
      "Cognitive load theory (Sweller, 1988) (2) and multimedia learning (Mayer, 2009) (3) help explain what makes explanations effective. They show the importance of breaking knowledge into manageable chunks and presenting it clearly through combining words with visuals. What pupils hear and see should work together - without overloading working memory.",
    ],
  },
  {
    heading: "Research references",
    text: [
      "(1) Hattie, J. (2009). Visible Learning: A Synthesis of Over 800 Meta-Analyses Relating to Achievement. Routledge.",
      "(2) Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257–285.",
      "(3) Mayer, R. E. (2009). Multimedia Learning (2nd ed.). Cambridge University Press.",
    ],
  },
  {
    heading: "What are the key features of explanation in Oak lessons?",
    text: [
      "Explanation is chunked throughout every learning cycle and is peppered with CfUs. It is indicated on slides by a corner icon and is designed around the following features:",
      <OakP key="chunked">
        <strong>Chunked</strong> explanations present new knowledge in small,
        carefully sequenced steps to help pupils manage cognitive load.
      </OakP>,
      <OakP key="clear">
        <strong>Clear</strong> explanations present knowledge explicitly and
        concisely, using accessible language and strategies to make it easier to
        understand.
      </OakP>,
    ],
  },
  {
    heading: "Oak in your classroom",
    text: [
      "Consider how Oak’s lessons will work for the pupils in your classroom, and where you might choose to adapt them.",
      <OakOL key="questions" $mv={"spacing-0"}>
        <OakLI>
          How might you plan your verbal explanation to work alongside Oak’s
          visuals to support your pupils’ understanding?
        </OakLI>
        <OakLI>
          Knowing your pupils, what additional misconceptions might they have,
          and how could you adapt the explanation to anticipate and address
          them?
        </OakLI>
      </OakOL>,
    ],
  },
];

export function ExplanationInANutshell() {
  return (
    <>
      <OakHeading
        $font={["heading-5", "heading-4", "heading-4"]}
        tag="h2"
        $mb={"spacing-32"}
        id="explanation"
      >
        Explanation in a nutshell
      </OakHeading>
      <OakP $mb={"spacing-32"}>
        Explore Oak's approach to explanation and the thinking behind our
        design, with questions to help you reflect on what this means for your
        classroom.
      </OakP>
      {explanationContent.map(({ heading, text }) => (
        <HeadingAndText key={heading} heading={heading} text={text} />
      ))}
    </>
  );
}
