import { sortChildSubjects, sortYears } from "./sorting";
import { Subject } from "./types";

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

  it("with all-years", () => {
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
