import { capitalize } from "lodash";

export const buildCurriculumMetadata = (props: {
  identifier: "title" | "description";
  tab: "units" | "overview";
  keyStagesData: string;
  subjectSlug: string;
  examboardSlug?: string | null;
}) => {
  if (props.tab === "overview" && props.identifier === "title") {
    const examboard =
      props.examboardSlug && props.examboardSlug !== "aqa"
        ? ` ${capitalize(props.examboardSlug)}`
        : props.examboardSlug && props.examboardSlug === "aqa"
        ? "AQA"
        : "";

    return `${props.keyStagesData} ${capitalize(
      props.subjectSlug,
    )} ${examboard} Curriculum Plans | Oak National Academy`;
  } else if (props.tab === "overview" && props.identifier === "description") {
    return `Looking for ${props.keyStagesData} ${props.subjectSlug} curriculum? We have sequenced curriculum plans, select by key stage. Our free resources are easy to browse and explore.`;
  } else if (props.tab === "units" && props.identifier === "title") {
    const examboard =
      props.examboardSlug && props.examboardSlug !== "aqa"
        ? ` ${capitalize(props.examboardSlug)}`
        : props.examboardSlug && props.examboardSlug === "aqa"
        ? "AQA"
        : "";
    return `${props.keyStagesData} ${capitalize(
      props.subjectSlug,
    )}${examboard} Curriculum Unit Sequence | Oak National Academy`;
  } else if (props.tab === "units" && props.identifier === "description") {
    return `Explore our free ${props.keyStagesData} ${props.subjectSlug} curriculum unit sequences, easily select units and topics and view in our interactive tool now.`;
  } else {
    throw new Error('Invalid input for "identifier" or "tab"');
  }
};
