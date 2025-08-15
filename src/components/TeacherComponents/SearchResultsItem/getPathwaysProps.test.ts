import { getPathwayCardProps } from "./getPathwaysProps";

import { PathwaySchemaCamel } from "@/context/Search/search.types";

const pathwaysWithoutExamBoardOrTier: PathwaySchemaCamel[] = [
  {
    programmeSlug: "maths-program-1",
    unitSlug: "algebra-unit",
    unitTitle: "Algebra",
    keyStageSlug: "ks3",
    keyStageTitle: "Key Stage 3",
    subjectSlug: "maths",
    subjectTitle: "Mathematics",
    examBoardSlug: null,
    yearSlug: "2023",
    yearTitle: "2023-2024",
  },
  {
    programmeSlug: "maths-program-3",
    unitSlug: "world-wars-unit",
    unitTitle: "World Wars",
    keyStageSlug: "ks2",
    keyStageTitle: "Key Stage 2",
    subjectSlug: "history",
    subjectTitle: "History",
    examBoardSlug: null,
    yearSlug: "2022",
    yearTitle: "2022-2023",
  },
];
const pathwaysWithExamBoard: PathwaySchemaCamel[] = [
  {
    programmeSlug: "maths-program-1",
    unitSlug: "algebra-unit",
    unitTitle: "Algebra",
    keyStageSlug: "ks3",
    keyStageTitle: "Key Stage 3",
    subjectSlug: "maths",
    subjectTitle: "Mathematics",
    examBoardSlug: "exam-board-1",
    examBoardTitle: "Exam Board 1",
    yearSlug: "2023",
    yearTitle: "2023-2024",
  },
  {
    programmeSlug: "maths-program-3",
    unitSlug: "world-wars-unit",
    unitTitle: "World Wars",
    keyStageSlug: "ks2",
    keyStageTitle: "Key Stage 2",
    subjectSlug: "history",
    subjectTitle: "History",
    examBoardSlug: "exam-board-2",
    examBoardTitle: "Exam Board 2",
    yearSlug: "2022",
    yearTitle: "2022-2023",
  },
];

const pathwaysWithTier: PathwaySchemaCamel[] = [
  {
    programmeSlug: "maths-program-1",
    unitSlug: "algebra-unit",
    unitTitle: "Algebra",
    keyStageSlug: "ks3",
    keyStageTitle: "Key Stage 3",
    subjectSlug: "maths",
    subjectTitle: "Mathematics",
    tierSlug: "higher",
    tierTitle: "Higher",
    examBoardSlug: null,
    yearSlug: "2023",
    yearTitle: "2023-2024",
  },
  {
    programmeSlug: "maths-program-3",
    unitSlug: "world-wars-unit",
    unitTitle: "World Wars",
    keyStageSlug: "ks2",
    keyStageTitle: "Key Stage 2",
    subjectSlug: "history",
    subjectTitle: "History",
    tierSlug: "foundation",
    tierTitle: "Foundation",
    examBoardSlug: null,
    yearSlug: "2022",
    yearTitle: "2022-2023",
  },
];

describe("getPathwaysProps", () => {
  it("returns correct labels for pathways with exam board", () => {
    const result = getPathwayCardProps(
      pathwaysWithExamBoard,
      "unit",
      "Maths 1",
    );

    expect(result.pathwaysDropdownLabel).toBe("Select exam board");
    expect(result.pathwaysButtonAriaLabel).toBe(
      "Select exam board for unit: Maths 1",
    );
  });
  it("returns correct labels for pathways with tier", () => {
    const result = getPathwayCardProps(pathwaysWithTier, "unit", "Maths 1");

    expect(result.pathwaysDropdownLabel).toBe("Select tier");
    expect(result.pathwaysButtonAriaLabel).toBe(
      "Select tier for unit: Maths 1",
    );
  });
  it("returns correct labels for pathways without exam board or tier", () => {
    const result = getPathwayCardProps(
      pathwaysWithoutExamBoardOrTier,
      "unit",
      "Maths 1",
    );

    expect(result.pathwaysDropdownLabel).toBe("Select unit");
    expect(result.pathwaysButtonAriaLabel).toBe(
      "Select unit for unit: Maths 1",
    );
  });
  it("returns correct dropdown content for pathways with exam board", () => {
    const result = getPathwayCardProps(
      pathwaysWithExamBoard
        .concat(pathwaysWithTier)
        .concat(pathwaysWithoutExamBoardOrTier),
      "unit",
      "Maths 1",
    );

    expect(result.dropdownContent).toHaveLength(2);
    expect(result.dropdownContent[0]?.examBoardSlug).toBe("exam-board-1");
    expect(result.dropdownContent[1]?.examBoardSlug).toBe("exam-board-2");
  });
  it("returns correct dropdown content for pathways with tier", () => {
    const result = getPathwayCardProps(
      pathwaysWithTier.concat(pathwaysWithoutExamBoardOrTier),
      "unit",
      "Maths 1",
    );

    expect(result.dropdownContent).toHaveLength(2);
    expect(result.dropdownContent[0]?.tierSlug).toBe("higher");
    expect(result.dropdownContent[1]?.tierSlug).toBe("foundation");
  });
  it("returns correct dropdown content for pathways without exam board or tier", () => {
    const result = getPathwayCardProps(
      pathwaysWithoutExamBoardOrTier,
      "unit",
      "Maths 1",
    );

    expect(result.dropdownContent).toHaveLength(2);
    expect(result.dropdownContent[0]?.unitSlug).toBe("algebra-unit");
    expect(result.dropdownContent[1]?.unitSlug).toBe("world-wars-unit");
  });
});
