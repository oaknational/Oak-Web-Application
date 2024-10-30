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
    const { urn } = extractUrnAndSchool(school);
    return urn || "";
  } else {
    return "";
  }
};

export const getSchoolName = (
  school: string,
  schoolOption: SchoolOptionValueType,
) => {
  if (schoolOption === "Selected school") {
    const { schoolName } = extractUrnAndSchool(school);
    return schoolName || "";
  } else {
    return "";
  }
};

/**
 * Regex to extract URN and school name from schoolId string
 * ! - English and Welsh schools 6 digits
 * ! - Scottish school 7 digits
 * ! - Northern Irish school 3 digits followed by a hyphen and 4 digits
 */

export const extractUrnAndSchool = (school: string) => {
  const match = /^(?:(\d{7}|\d{6}|\d{3}-\d{4}))-(.*)/.exec(school);
  return {
    urn: match?.at(1),
    schoolName: match?.at(2),
  };
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
