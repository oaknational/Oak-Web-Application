import { OakLI, OakOL, OakP } from "@oaknational/oak-components";

import { SectionContent } from "../SectionContentList/SectionContentList";
import { NutshellSection } from "../NutshellSection/NutshellSection";
import { getTeacherJourneyImageUrl } from "../getTeacherJourneyImageUrl";

const explanationContent: SectionContent = [
  {
    type: "heading-and-text",
    heading: "What?",
    text: "Explanation is a pedagogical strategy that presents new knowledge to pupils and connects it with what they already know.",
  },
  {
    type: "heading-and-text",
    heading: "Why?",
    text: "Effective explanation makes new knowledge clear and manageable, helping pupils build secure understanding.",
  },
  {
    type: "heading-and-text",
    heading: "What does the research say?",
    text: [
      "Research shows that clear explanations can support learning. Hattie (2009) (1) identified teacher clarity as an important influence on learning.",
      "Cognitive load theory (Sweller, 1988) (2) and multimedia learning (Mayer, 2009) (3) help explain what makes explanations effective. They show the importance of breaking knowledge into manageable chunks and presenting it clearly through combining words with visuals. What pupils hear and see should work together - without overloading working memory.",
    ],
  },
  {
    type: "callout",
    id: "explanation-in-a-nutshell-callout",
    quote:
      "Effective explanations break down complexity and make new knowledge clear.",
  },
  {
    type: "heading-and-text",
    heading: "Research references",
    text: [
      "(1) Hattie, J. (2009). Visible Learning: A Synthesis of Over 800 Meta-Analyses Relating to Achievement. Routledge.",
      "(2) Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257–285.",
      "(3) Mayer, R. E. (2009). Multimedia Learning (2nd ed.). Cambridge University Press.",
    ],
  },
  {
    type: "heading-and-text",
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
    type: "images",
    id: "explanation-key-features-images",
    images: [
      {
        heading: "Chunked",
        src: getTeacherJourneyImageUrl("Chunked_Image_apmwpq"),
        height: 1236,
        width: 630,
        alt: "Three explanation slides showing how an algorithm recommends TV programmes to Lucas based on his viewing history.",
      },
      {
        heading: "Clear",
        src: getTeacherJourneyImageUrl("Clear_Image_1_gcjfwg"),
        height: 630,
        width: 370,
        caption: "etymology",
        alt: "An explanation slide with a definition of “devolution”. The word “devolution” is broken into two parts: “de”, meaning “off” or “from”, and “volution”, meaning “to change or develop”.",
      },
      {
        src: getTeacherJourneyImageUrl("Clear_Image_2_slgkii"),
        height: 630,
        width: 370,
        caption: "images",
        alt: "An explanation slide about the verb avoir, to have, with an illustration of a single person saying “j’ai” meaning “I have” and two people, with one pointing to the other and saying “tu as” meaning “you have”. Below each are audio icons.",
      },
      {
        src: getTeacherJourneyImageUrl("Clear_Image_3_iz7weq"),
        height: 630,
        width: 370,
        caption: "examples and non-examples",
        alt: "An explanation slide about force arrows. A tennis racket has a ball hitting it centrally. The force arrow is correctly shown along a central axis from the far lefthand side of the ball. There are four non examples where the arrow does not start where the force acts: centre of the ball, on the right hand side of the ball at the top of the ball and at the bottom of the ball.",
      },
      {
        src: getTeacherJourneyImageUrl("Clear_Image_4_ta1gzj"),
        height: 630,
        width: 370,
        caption: "modelling and demonstration",
        alt: "An explanation slide about folding paper. There are three photographs. The first shows a rectangular piece of paper with a ruler vertically placed on top. The instructions for this are underneath. The second shows the paper being folded in half over the ruler with instructions written underneath. The third photograph shows the folded paper with instructions underneath to smooth the fold line and remove the ruler.",
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
    <NutshellSection
      id="explanation"
      heading="Explanation in a nutshell"
      intro="Explore Oak's approach to explanation and the thinking behind our design, with questions to help you reflect on what this means for your classroom."
      content={explanationContent}
    />
  );
}
