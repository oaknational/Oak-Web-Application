import { generateQueryParams } from "./queryParams";

describe("generateQueryParams", () => {
  it("should generate a string correctly given some timetabling parameters", () => {
    const result = generateQueryParams({
      subject: "maths",
      year: 1,
    });
    expect(result.toString()).toBe("subject=maths&year=1");
  });
});
