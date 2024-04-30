import { capitalize } from "lodash";

type buildCurriculumMetadataProps = {
  metadataType: "title" | "description";
  tab: "units" | "overview" | "download";
  keyStagesData: string;
  subjectSlug: string;
  examboardSlug?: string | null;
};

function getExamboardFromSlug(props: buildCurriculumMetadataProps) {
  return props.examboardSlug && props.examboardSlug === "aqa"
    ? "AQA"
    : props.examboardSlug
      ? `${capitalize(props.examboardSlug)}`
      : "";
}

export const buildCurriculumMetadata = (
  props: buildCurriculumMetadataProps,
) => {
  if (props.tab === "overview" && props.metadataType === "title") {
    const examboard = getExamboardFromSlug(props);

    return `${props.keyStagesData} ${capitalize(
      props.subjectSlug,
    )} ${examboard} Curriculum Plans`;
  } else if (props.tab === "overview" && props.metadataType === "description") {
    return `Looking for ${props.keyStagesData} ${capitalize(
      props.subjectSlug,
    )} curriculum? We have sequenced curriculum plans, select by key stage. Our free resources are easy to browse and explore.`;
  } else if (props.tab === "units" && props.metadataType === "title") {
    const examboard = getExamboardFromSlug(props);
    return `${props.keyStagesData} ${capitalize(
      props.subjectSlug,
    )} ${examboard} Curriculum Unit Sequence`;
  } else if (props.tab === "units" && props.metadataType === "description") {
    return `Explore our free ${props.keyStagesData} ${props.subjectSlug} curriculum unit sequences, easily select units and topics and view in our interactive tool now.`;
  } else if (props.tab === "download" && props.metadataType === "description") {
    return `Explore our free ${props.keyStagesData} ${props.subjectSlug} curriculum unit downloads.`;
  } else if (props.tab === "download" && props.metadataType === "title") {
    const examboard = getExamboardFromSlug(props);
    return `${props.keyStagesData} ${capitalize(
      props.subjectSlug,
    )} ${examboard} Curriculum Downloads`;
  } else {
    throw new Error('Invalid input for "metadataType" or "tab"');
  }
};
