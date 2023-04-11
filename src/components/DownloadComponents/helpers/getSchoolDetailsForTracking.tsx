import type { SchoolOptionValueType } from "../../../browser-lib/avo/Avo";

const getSchoolDetailsForTracking = ({ school }: { school: string }) => {
  const getSchoolOption = () => {
    if (school === "notListed") {
      return "Not listed";
    } else if (school === "homeschool") {
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

  return {
    schoolOption,
    schoolName: getSchoolName(),
    schoolUrn: getSchoolUrn(),
  };
};

export default getSchoolDetailsForTracking;
