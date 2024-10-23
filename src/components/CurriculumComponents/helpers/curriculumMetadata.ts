import { capitalize } from "lodash";

type buildCurriculumMetadataProps = {
  metadataType: "title" | "description";
  tab: "units" | "overview" | "downloads";
  keyStages: string[];
  subjectSlug: string;
  ks4OptionSlug?: string | null;
};

function getExamboardFromSlug(props: buildCurriculumMetadataProps) {
  return props.ks4OptionSlug && props.ks4OptionSlug === "aqa"
    ? "AQA"
    : props.ks4OptionSlug
      ? `${capitalize(props.ks4OptionSlug)}`
      : "";
}

export const buildCurriculumMetadata = (
  props: buildCurriculumMetadataProps,
) => {
  const { keyStages } = props;
  const keyStagesItems: string[] = [];
  if (keyStages.includes("ks1")) keyStagesItems.push("1");
  if (keyStages.includes("ks2")) keyStagesItems.push("2");
  if (keyStages.includes("ks3")) keyStagesItems.push("3");
  if (keyStages.includes("ks4")) keyStagesItems.push("4");
  const keyStagesData =
    keyStagesItems.length > 0 ? `KS${keyStagesItems.join("-")}` : ``;

  if (props.tab === "overview" && props.metadataType === "title") {
    const examboard = getExamboardFromSlug(props);

    return `${keyStagesData} ${capitalize(
      props.subjectSlug,
    )} ${examboard} Curriculum Plans`;
  } else if (props.tab === "overview" && props.metadataType === "description") {
    return `Looking for ${keyStagesData} ${capitalize(
      props.subjectSlug,
    )} curriculum? We have sequenced curriculum plans, select by key stage. Our free resources are easy to browse and explore.`;
  } else if (props.tab === "units" && props.metadataType === "title") {
    const examboard = getExamboardFromSlug(props);
    return `${keyStagesData} ${capitalize(
      props.subjectSlug,
    )} ${examboard} Curriculum Unit Sequence`;
  } else if (props.tab === "units" && props.metadataType === "description") {
    return `Explore our free ${keyStagesData} ${props.subjectSlug} curriculum unit sequences, easily select units and topics and view in our interactive tool now.`;
  } else if (
    props.tab === "downloads" &&
    props.metadataType === "description"
  ) {
    return `Explore our free ${keyStagesData} ${props.subjectSlug} curriculum unit downloads.`;
  } else if (props.tab === "downloads" && props.metadataType === "title") {
    const examboard = getExamboardFromSlug(props);
    return `${keyStagesData} ${capitalize(
      props.subjectSlug,
    )} ${examboard} Curriculum Downloads`;
  } else {
    throw new Error('Invalid input for "metadataType" or "tab"');
  }
};
