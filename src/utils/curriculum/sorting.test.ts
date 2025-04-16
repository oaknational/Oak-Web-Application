import { sortChildSubjects, sortUnits, sortYears } from "./sorting";
import { Subject, Unit } from "./types";

describe("sortYears", () => {
  it("basic numbers", () => {
    expect(["8", "7", "9", "11", "10"].sort(sortYears)).toEqual([
      "7",
      "8",
      "9",
      "10",
      "11",
    ]);
  });

  it("with all years", () => {
    expect(["8", "7", "all-years", "9", "11", "10"].sort(sortYears)).toEqual([
      "all-years",
      "7",
      "8",
      "9",
      "10",
      "11",
    ]);
  });
});

test("sortChildSubjects", () => {
  const input: Subject[] = [
    {
      subject: "Biology",
      subject_slug: "biology",
    },
    {
      subject: "Physics",
      subject_slug: "physics",
    },
    {
      subject: "Combined science",
      subject_slug: "combined-science",
    },
    {
      subject: "Chemistry",
      subject_slug: "chemistry",
    },
  ];
  expect([...input].sort(sortChildSubjects)).toEqual([
    {
      subject: "Combined science",
      subject_slug: "combined-science",
    },
    {
      subject: "Biology",
      subject_slug: "biology",
    },
    {
      subject: "Chemistry",
      subject_slug: "chemistry",
    },
    {
      subject: "Physics",
      subject_slug: "physics",
    },
  ]);
});

describe("sortUnits", () => {
  it("should sort normal units by order", () => {
    const testUnits = [
      { slug: "b", order: 2, year: "1" },
      { slug: "a", order: 1, year: "1" },
      { slug: "d", order: 4, year: "1" },
      { slug: "c", order: 3, year: "1" },
    ] as Unit[];
    const output = testUnits.toSorted(sortUnits);
    expect(output).toEqual([
      { slug: "a", order: 1, year: "1" },
      { slug: "b", order: 2, year: "1" },
      { slug: "c", order: 3, year: "1" },
      { slug: "d", order: 4, year: "1" },
    ]);
  });

  it("should sort grouped units by year/order", () => {
    const testUnits = [
      { slug: "c", order: 2, year: "2" },
      { slug: "b", order: 1, year: "2" },
      { slug: "a", order: 4, year: "1" },
      { slug: "d", order: 3, year: "2" },
    ] as Unit[];
    const output = testUnits.toSorted(sortUnits);
    expect(output).toEqual([
      { slug: "a", order: 4, year: "1" },
      { slug: "b", order: 1, year: "2" },
      { slug: "c", order: 2, year: "2" },
      { slug: "d", order: 3, year: "2" },
    ]);
  });
});
