import getSchoolDetailsForTracking from "./getSchoolDetailsForTracking";

describe("getSchoolDetailsForTracking", () => {
  it("should return correct school details for homeschool option", () => {
    const schoolDetailsForTracking = getSchoolDetailsForTracking({
      school: "homeschool",
    });

    expect(schoolDetailsForTracking).toStrictEqual({
      schoolOption: "Homeschool",
      schoolName: null,
      schoolUrn: null,
    });
  });

  it("should return correct school details for not listed option", () => {
    const schoolDetailsForTracking = getSchoolDetailsForTracking({
      school: "notListed",
    });

    expect(schoolDetailsForTracking).toStrictEqual({
      schoolOption: "Not listed",
      schoolName: null,
      schoolUrn: null,
    });
  });

  it("should return correct school details for selected school option", () => {
    const schoolDetailsForTracking = getSchoolDetailsForTracking({
      school: "123456-London High School",
    });

    expect(schoolDetailsForTracking).toStrictEqual({
      schoolOption: "Selected school",
      schoolName: "London High School",
      schoolUrn: 123456,
    });
  });
});
