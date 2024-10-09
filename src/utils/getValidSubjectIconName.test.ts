import { getValidSubjectIconName } from "./getValidSubjectIconName";
const mockErrorReporter = jest.fn();
jest.mock("@/common-lib/error-reporter", () =>
  jest.fn(() => mockErrorReporter),
);

describe("getValidSubjectIconName", () => {
  it("should return subject-maths when subject is valid", () => {
    expect(getValidSubjectIconName("maths")).toBe("subject-maths");
  });
  it("should return error when subject is invalid", () => {
    expect(getValidSubjectIconName("invalid")).toBe("error");
  });
  it("should report an error when subject is invalid", () => {
    getValidSubjectIconName("invalid");
    expect(mockErrorReporter).toHaveBeenCalled();
  });
});
