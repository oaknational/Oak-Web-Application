import type {
  SchoolOptionValueType,
  ResourceTypeValueType,
} from "@/browser-lib/avo/Avo";
import type { ResourceType } from "@/components/TeacherComponents/types/downloadAndShare.types";

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
    return extractUrn(school);
  } else {
    return 0;
  }
};

export const getSchoolName = (
  school: string,
  schoolOption: SchoolOptionValueType,
) => {
  if (schoolOption === "Selected school") {
    return extractSchool(school);
  } else {
    return "";
  }
};

function extractUrn(school: string) {
  return /^\d{7}|^\d{6}|^\d{3}-\d{4}/.exec(school)?.at(0);
}

function extractSchool(school: string) {
  const match = /(?:\d{7}|\d{6}|\d{3}-\d{4})-(.*)/.exec(school);
  return match ? match[1] : "";
}

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
