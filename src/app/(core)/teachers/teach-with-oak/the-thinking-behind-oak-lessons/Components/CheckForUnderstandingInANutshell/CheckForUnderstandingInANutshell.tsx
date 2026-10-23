import { OakLI, OakOL, OakP } from "@oaknational/oak-components";

import { SectionContent } from "../SectionContentList/SectionContentList";
import { NutshellSection } from "../NutshellSection/NutshellSection";
import { getTeacherJourneyImageUrl } from "../getTeacherJourneyImageUrl";

const checkForUnderstandingContent: SectionContent = [
  {
    type: "heading-and-text",
    heading: "What?",
    text: "Check for understanding is a pedagogical strategy that identifies pupils’ understanding and helps you decide whether to move on or explain further.",
  },
  {
    type: "heading-and-text",
    heading: "Why?",
    text: "Effective checks for understanding reveal what pupils have understood, enabling you to adapt your teaching accordingly.",
  },
  {
    type: "heading-and-text",
    heading: "What does the research say?",
    text: [
      "Research shows that checking for understanding is an important part of effective teaching. Rosenshine (2012) (1) found that effective teachers regularly check what pupils have understood. Lemov (2015) (2) also highlights the importance of checking understanding throughout a lesson.",
      "CfUs give teachers useful information about pupils’ learning, helping them spot misconceptions and decide whether to move on, reteach or adapt their teaching without overloading working memory.",
    ],
  },
  {
    type: "callout",
    id: "check-for-understanding-callout",
    quote:
      "Check for understanding helps teachers distinguish between what has been taught and what pupils have actually learned. ",
  },
  {
    type: "heading-and-text",
    heading: "Research references",
    text: [
      "(1) Rosenshine, B. (2012). Principles of instruction: Research-based strategies that all teachers should know. American Educator, 36(1), 12–19, 39.",
      "(2) Lemov, D. (2015). Teach Like a Champion 2.0: 62 Techniques that Put Students on the Path to College. Jossey-Bass.",
    ],
  },
  {
    type: "heading-and-text",
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
    type: "images",
    id: "check-for-understanding-images",
    images: [
      {
        heading: "Peppered",
        src: getTeacherJourneyImageUrl("Peppered_Image_vblphl"),
        height: 1242,
        width: 630,
        alt: "A series of slides showing where check for understanding slides fall within an explanation",
      },
    ],
  },
  {
    type: "heading-and-text",
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
    type: "heading-and-text",
    heading: "Common misconception",
    text: [
      <OakP key="common-misconception-bold-text" $font="body-2-bold">
        Citizenship is only about legal status.
      </OakP>,
      "Citizenship is all about being part of a society and being an active citizen.",
    ],
  },
  {
    type: "images",
    id: "check-for-understanding-images-2",
    images: [
      {
        src: getTeacherJourneyImageUrl("Focused_Image_lbmsxy"),
        height: 630,
        width: 608,
        alt: "Three check-for-understanding slides showing different question types, including true or false, a missing-word question and a multiple-choice question with feedback.",
      },
      {
        heading: "Snappy",
        src: getTeacherJourneyImageUrl("Snappy_Image_1_hseegy"),
        height: 368,
        width: 630,
        alt: "A check for understanding slide with a quiz question and three possible answers. There is an image of each answer: a button, a teddy bear, and an ice cream.",
      },
      {
        src: getTeacherJourneyImageUrl("Snappy_Image_2_avlkre.png"),
        height: 368,
        width: 630,
        alt: "A check for understanding slide with an instruction to complete two missing labels. There is a diagram of a cell with labels to its nucleus, the vacuole and the cell membrane. The first missing label is pointing to a small blue kidney shaped feature and the second to the space between the sub-cellular features.",
      },
      {
        src: getTeacherJourneyImageUrl("Snappy_Image_3_kfdszw"),
        height: 368,
        width: 630,
        alt: "A check for understanding slide with a quiz question and three possible answers. There is a tick against the correct answer.",
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
    <NutshellSection
      id="check-for-understanding"
      heading="Check for understanding in a nutshell"
      intro="Explore Oak’s approach to check for understanding (CfU) and the thinking behind our design, with questions to help you reflect on what this means for your classroom."
      content={checkForUnderstandingContent}
    />
  );
}
