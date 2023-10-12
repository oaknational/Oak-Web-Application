import type {
  SchoolOptionValueType,
  ResourceTypeValueType,
} from "../../../browser-lib/avo/Avo";
import type { DownloadResourceType } from "../downloads.types";

const getFormattedDetailsForTracking = ({
  school,
  selectedResources,
}: {
  school: string;
  selectedResources: DownloadResourceType[];
}) => {
  const getSchoolOption = () => {
    if (school === "notListed") {
      return "Not listed";
    } else if (school === "home-school-Homeschool") {
      return "Homeschool";
    } else {
      return "Selected school";
    }
  };

  const schoolOption: SchoolOptionValueType = getSchoolOption();

  const getSchoolName = () => {
    if (schoolOption === "Selected school") {
      const schoolName = school.split("-")[1] || "";
      return schoolName;
    } else {
      return "";
    }
  };

  const getSchoolUrn = () => {
    if (schoolOption === "Selected school") {
      const schoolUrn = Number(school.split("-")[0]) || 0;
      return schoolUrn;
    } else {
      return 0;
    }
  };

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
    schoolName: getSchoolName(),
    schoolUrn: getSchoolUrn(),
    selectedResourcesForTracking:
      selectedResourcesForTracking as ResourceTypeValueType[],
  };
};

export default getFormattedDetailsForTracking;
