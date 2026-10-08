/**
 * A cell's position in its table's grid. Rows and columns are inclusive, so
 * merged cells span several of each.
 */
export type GridCell = {
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
  /** False when the cell only holds empty paragraphs or decorative images. */
  hasContent: boolean;
  /** The cell's first block is a heading. */
  startsWithHeading: boolean;
};

const overlaps = (aStart: number, aEnd: number, bStart: number, bEnd: number) =>
  aStart <= bEnd && bStart <= aEnd;

const isAbove = (a: GridCell, b: GridCell) =>
  a.rowEnd < b.rowStart && overlaps(a.colStart, a.colEnd, b.colStart, b.colEnd);

const isLeftOf = (a: GridCell, b: GridCell) =>
  a.colEnd < b.colStart && overlaps(a.rowStart, a.rowEnd, b.rowStart, b.rowEnd);

const byRowThenColumn = (a: GridCell, b: GridCell) =>
  a.rowStart - b.rowStart || a.colStart - b.colStart;

/**
 * Orders a layout table's cells for reading in a single column.
 *
 * Lesson guide tables lay out a landscape page rather than hold data. A
 * heading in one cell often introduces the cells below or beside it ("Starter
 * quiz" sits above two cells of questions), and a learning cycle's sections
 * are arranged in columns. Reading row by row would put "Warm up" between the
 * starter quiz heading and its questions, so instead:
 *
 * 1. each cell that starts with a heading begins a section;
 * 2. every other cell joins the section of the nearest cell above it, or
 *    failing that, the nearest cell to its left;
 * 3. sections are ordered so none comes before a section above it or to its
 *    left, breaking ties row by row;
 * 4. cells within a section are read row by row.
 */
export function orderCellsForReading<T extends GridCell>(
  cells: readonly T[],
): T[] {
  const readable = cells
    .filter((cell) => cell.hasContent)
    .sort(byRowThenColumn);
  const cellAt = (row: number, col: number) =>
    readable.find(
      (cell) =>
        cell.rowStart <= row &&
        row <= cell.rowEnd &&
        cell.colStart <= col &&
        col <= cell.colEnd,
    );

  // Cells above and to the left come earlier in `readable`, so their sections
  // are already known when a later cell looks for one to join.
  const sectionOf = new Map<T, T>();
  const findSection = (cell: T) => {
    for (let row = cell.rowStart - 1; row >= 0; row--) {
      const above = cellAt(row, cell.colStart);
      if (above) return sectionOf.get(above);
    }
    for (let col = cell.colStart - 1; col >= 0; col--) {
      const left = cellAt(cell.rowStart, col);
      if (left) return sectionOf.get(left);
    }
    return undefined;
  };
  for (const cell of readable) {
    sectionOf.set(
      cell,
      (cell.startsWithHeading ? undefined : findSection(cell)) ?? cell,
    );
  }

  const unplaced = readable.filter((cell) => sectionOf.get(cell) === cell);
  const sections: T[] = [];
  while (unplaced.length > 0) {
    const nextIndex = unplaced.findIndex(
      (section) =>
        !unplaced.some(
          (other) => isAbove(other, section) || isLeftOf(other, section),
        ),
    );
    // Fall back to row order rather than loop forever if the constraints
    // can't all be met.
    const [next] = unplaced.splice(Math.max(nextIndex, 0), 1);
    if (next) sections.push(next);
  }

  return sections.flatMap((section) =>
    readable.filter((cell) => sectionOf.get(cell) === section),
  );
}
