import { orderCellsForReading } from "./readingOrder";

const cell = (
  name: string,
  [rowStart, rowEnd]: [number, number],
  [colStart, colEnd]: [number, number],
  { heading = false, empty = false } = {},
) => ({
  name,
  rowStart,
  rowEnd,
  colStart,
  colEnd,
  hasContent: !empty,
  startsWithHeading: heading,
});

const readingOrder = (cells: ReturnType<typeof cell>[]) =>
  orderCellsForReading(cells).map(({ name }) => name);

describe("orderCellsForReading", () => {
  it("reads a learning cycle's columns before the row along the bottom", () => {
    // | stripe | title (cols 2-4)                     | video |
    // |        | explanation | practice | feedback (cols 4-5) |
    // |        | check       |          |                     |
    // |        |             | adapt (cols 3-5)               |
    const cells = [
      cell("stripe", [0, 3], [0, 0], { empty: true }),
      cell("title", [0, 0], [2, 4], { heading: true }),
      cell("video", [0, 0], [5, 5]),
      cell("explanation", [1, 1], [2, 2], { heading: true }),
      cell("practice", [1, 2], [3, 3], { heading: true }),
      cell("feedback", [1, 2], [4, 5], { heading: true }),
      cell("check", [2, 3], [2, 2], { heading: true }),
      cell("adapt", [3, 3], [3, 5], { heading: true }),
    ];

    expect(readingOrder(cells)).toEqual([
      "title",
      "video",
      "explanation",
      "check",
      "practice",
      "feedback",
      "adapt",
    ]);
  });

  it("keeps cells with the heading above them rather than the one beside them", () => {
    // | starter quiz | quiz link | warm up             | video |
    // | q1, q3       | q2, q4    | warm up text (cols 2-3)     |
    const cells = [
      cell("starter quiz", [0, 0], [0, 0], { heading: true }),
      cell("quiz link", [0, 0], [1, 1]),
      cell("warm up", [0, 0], [2, 2], { heading: true }),
      cell("video", [0, 0], [3, 3]),
      cell("q1, q3", [1, 1], [0, 0]),
      cell("q2, q4", [1, 1], [1, 1]),
      cell("warm up text", [1, 1], [2, 3]),
    ];

    expect(readingOrder(cells)).toEqual([
      "starter quiz",
      "quiz link",
      "q1, q3",
      "q2, q4",
      "warm up",
      "video",
      "warm up text",
    ]);
  });

  it("reads a side column after the main column", () => {
    // | outcome (cols 0-1)    | sidebar (rows 0-2) |
    // | key points (cols 0-1) |                    |
    // | keywords | equipment  |                    |
    const cells = [
      cell("outcome", [0, 0], [0, 1], { heading: true }),
      cell("sidebar", [0, 2], [2, 3], { heading: true }),
      cell("key points", [1, 1], [0, 1], { heading: true }),
      cell("keywords", [2, 2], [0, 0], { heading: true }),
      cell("equipment", [2, 2], [1, 1], { heading: true }),
    ];

    expect(readingOrder(cells)).toEqual([
      "outcome",
      "key points",
      "keywords",
      "equipment",
      "sidebar",
    ]);
  });

  it("skips empty cells when looking for a section to join", () => {
    // | exit quiz | (empty) |
    // | q1        | q2      |
    const cells = [
      cell("exit quiz", [0, 0], [0, 0], { heading: true }),
      cell("spacer", [0, 0], [1, 1], { empty: true }),
      cell("q1", [1, 1], [0, 0]),
      cell("q2", [1, 1], [1, 1]),
    ];

    expect(readingOrder(cells)).toEqual(["exit quiz", "q1", "q2"]);
  });

  it("reads a table without headings row by row", () => {
    const cells = [
      cell("d", [1, 1], [1, 1]),
      cell("c", [1, 1], [0, 0]),
      cell("b", [0, 0], [1, 1]),
      cell("a", [0, 0], [0, 0]),
    ];

    expect(readingOrder(cells)).toEqual(["a", "b", "c", "d"]);
  });
});
