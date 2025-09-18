import { generateQueryParams } from "./curricTimetabling";

describe("curricTimetabling", () => {
  it("should generate a string correctly given some timetabling parameters", () => {
    const result = generateQueryParams({
      subject: "maths",
      year: 1,
    });
    expect(result).toBe("subject=maths&year=1");
  });
});
