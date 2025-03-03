import {
  formatKeystagesShort,
  joinWords,
  subjectTitleWithCase,
} from "@/utils/curriculum/formatting";

type buildCurriculumMetadataProps = {
  metadataType: "title" | "description";
  tab: "units" | "overview" | "downloads";
  keyStages: string[];
  subjectSlug: string;
  subjectTitle: string;
  ks4OptionSlug?: string | null;
  ks4OptionTitle?: string | null;
};

function getExamboardFromSlug(props: buildCurriculumMetadataProps) {
  return props.ks4OptionSlug && props.ks4OptionSlug === "aqa"
    ? "AQA"
    : props.ks4OptionSlug
      ? `${props.ks4OptionTitle}`
      : "";
}

export const buildCurriculumMetadata = (
  props: buildCurriculumMetadataProps,
) => {
  const keyStagesStr = formatKeystagesShort(props.keyStages);

  if (props.tab === "overview" && props.metadataType === "title") {
    const examboard = getExamboardFromSlug(props);

    return joinWords([
      keyStagesStr,
      subjectTitleWithCase(props.subjectTitle),
      examboard,
      `curriculum explainer`,
    ]);
  } else if (props.tab === "overview" && props.metadataType === "description") {
    return joinWords([
      `Looking for`,
      keyStagesStr,
      subjectTitleWithCase(props.subjectTitle),
      `curriculum? We have sequenced curriculum plans, select by key stage. Our free resources are easy to browse and explore.`,
    ]);
  } else if (props.tab === "units" && props.metadataType === "title") {
    const examboard = getExamboardFromSlug(props);
    return joinWords([
      keyStagesStr,
      subjectTitleWithCase(props.subjectTitle),
      examboard,
      `curriculum unit sequence`,
    ]);
  } else if (props.tab === "units" && props.metadataType === "description") {
    return joinWords([
      `Explore our free`,
      keyStagesStr,
      subjectTitleWithCase(props.subjectTitle),
      `curriculum unit sequences, easily select units and topics and view in our interactive tool now.`,
    ]);
  } else if (
    props.tab === "downloads" &&
    props.metadataType === "description"
  ) {
    return joinWords([
      `Explore our free`,
      keyStagesStr,
      subjectTitleWithCase(props.subjectTitle),
      subjectTitleWithCase(`curriculum unit downloads.`),
    ]);
  } else if (props.tab === "downloads" && props.metadataType === "title") {
    const examboard = getExamboardFromSlug(props);
    return joinWords([
      keyStagesStr,
      subjectTitleWithCase(props.subjectTitle),
      examboard,
      `curriculum downloads`,
    ]);
  } else {
    throw new Error('Invalid input for "metadataType" or "tab"');
  }
};
