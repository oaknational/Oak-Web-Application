import { OakLI, OakOL, OakP } from "@oaknational/oak-components";

import { SectionContent } from "../SectionContentList/SectionContentList";
import { NutshellSection } from "../NutshellSection/NutshellSection";
import { getTeacherJourneyImageUrl } from "../getTeacherJourneyImageUrl";

const practiceContent: SectionContent = [
  {
    type: "heading-and-text",
    heading: "What?",
    text: "Practice is a pedagogical strategy that gives pupils opportunities to apply and consolidate their learning.",
  },
  {
    type: "heading-and-text",
    heading: "Why?",
    text: "Effective practice reduces cognitive load and builds fluency, enabling pupils to think more deeply and work more independently.",
  },
  {
    type: "heading-and-text",
    heading: "What does the research say?",
    text: [
      "Research shows that practice is an important part of learning. Rosenshine (2012) (1) highlights the importance of giving pupils opportunities to practise, helping them secure new knowledge in long-term memory.",
      "But providing practice is not enough – it needs to be carefully designed. What pupils practise, and how hard they need to think, both matter.",
      "Effective practice helps pupils secure their knowledge, strengthen understanding, make connections and address misconceptions.",
    ],
  },
  {
    type: "callout",
    id: "practice-callout",
    quote:
      "Practice helps knowledge stick when it makes pupils think hard about the right things.",
  },
  {
    type: "heading-and-text",
    heading: "Research references",
    text: "(1) Rosenshine, B. (2012). Principles of instruction: Research-based strategies that all teachers should know. American Educator, 36(1), 12–19, 39.",
  },
  {
    type: "heading-and-text",
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
    type: "images",
    id: "practice-images",
    images: [
      {
        heading: "Meaningful",
        src: getTeacherJourneyImageUrl("Meaningful_Image_1_m0zyc4"),
        height: 630,
        width: 370,
        alt: "A practice slide with a task about the food we eat. There is a photograph of part of a baguette with slices of cheese, lettuce and cherry tomatoes. Two characters, Alex and Izzy are asking for help to label which parts of the meal are from a plant and an animal.",
      },
      {
        src: getTeacherJourneyImageUrl("Meaningful_Image_2_sgc1vw"),
        height: 630,
        width: 371,
        alt: "A practice slide with a task about how Hanukkah is celebrated today. Laura says, “I think Hanukkah is celebrated the same way by all Jews. All Jews will light a Hanukkah and eat fried foods.” Five illustrated people appear below, followed by the question: “Do you agree with Laura? Use the case studies to explain your ideas.”",
      },
      {
        heading: "Challenging",
        src: getTeacherJourneyImageUrl("Challenging_Image_1_zvnjas"),
        height: 630,
        width: 370,
        alt: "A practice slide with a task to write a program that asks the user to input their name and lucky number, then prints a welcome message and their lucky number. Example output shows the user entering “Aisha” and “7”, followed by “Welcome Aisha” and “Your lucky number is 7”",
      },
      {
        src: getTeacherJourneyImageUrl("Challenging_Image_2_vzyuuw"),
        height: 630,
        width: 371,
        alt: "A practice slide titled “What is folk music?” Three questions ask how folk music has been passed down through generations, to identify three typical features while listening to a Japanese folk melody, and to draw and label the five notes of the G major pentatonic scale. A musical stave shows the first note, G, as an example",
      },
      {
        src: getTeacherJourneyImageUrl("Challenging_Image_3_mvjwel"),
        height: 630,
        width: 371,
        alt: "A practice slide titled “Reading Chapter 1.” Instructions are to read from “‘Mr. Enfield and the lawyer were on the other side of the by-street’” to the end of Chapter 1. There are five questions about the text.",
      },
      {
        src: getTeacherJourneyImageUrl("Challenging_Image_4_fwbubr"),
        height: 630,
        width: 371,
        alt: "A practice slide ask titled “Become a curator.” There are three sets of images with arrows in between them. The images on the left show a collection of art work including crafted flowers. The middle image is of a green background and brown rectangles representing flowerbeds. The right hand image shows two flowerbeds with the craftwork laid within them.",
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
    <NutshellSection
      id="practice"
      heading="Practice in a nutshell"
      intro="Explore Oak’s approach to practice and the thinking behind our design, with questions to help you reflect on what this means for your classroom."
      content={practiceContent}
    />
  );
}
