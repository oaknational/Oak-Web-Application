import type {
  SchoolOptionValueType,
  ResourceTypeValueType,
} from "../../../browser-lib/avo/Avo";
import type { ResourceType } from "../downloadAndShare.types";

export const getSchoolOption = (school: string) => {
  if (school === "notListed") {
    return "Not listed";
  } else if (school === "homeschool") {
    return "Homeschool";
  } else {
    return "Selected school";
  }
};

export const getSchoolUrn = (
  school: string,
  schoolOption: SchoolOptionValueType,
) => {
  if (schoolOption === "Selected school") {
    const schoolUrn = Number(school.split("-")[0]) || 0;
    return schoolUrn;
  } else {
    return 0;
  }
};

export const getSchoolName = (
  school: string,
  schoolOption: SchoolOptionValueType,
) => {
  if (schoolOption === "Selected school") {
    const schoolName = school.split("-")[1] || "";
    return schoolName;
  } else {
    return "";
  }
};

const getFormattedDetailsForTracking = ({
  school,
  selectedResources,
}: {
  school: string;
  selectedResources: ResourceType[];
}) => {
  const schoolOption: SchoolOptionValueType = getSchoolOption(school);

  const selectedResourcesForTracking = selectedResources.map((resource) => {
    const readableResourceName = resource.split("-").join(" ");
    if (resource === "presentation") {
      return "slide deck";
    } else if (resource === "intro-quiz-questions") {
      return "starter quiz questions";
    } else if (resource === "intro-quiz-answers") {
      return "starter quiz answers";
    } else {
      return readableResourceName;
    }
  });

  return {
    schoolOption,
    schoolName: getSchoolName(school, schoolOption),
    schoolUrn: getSchoolUrn(school, schoolOption),
    selectedResourcesForTracking:
      selectedResourcesForTracking as ResourceTypeValueType[],
  };
};

export default getFormattedDetailsForTracking;
