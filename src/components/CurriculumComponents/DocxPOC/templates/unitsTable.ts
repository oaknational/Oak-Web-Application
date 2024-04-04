/* eslint-disable  @typescript-eslint/no-explicit-any */
// too complex to add types for POC

// I think this object can probably be simplified, but just took it as it was for now.
// The names aren't as complicated as they seem, you can find information on them here - http://officeopenxml.com/WPtable.php

const unitsTableTemplate = {
  type: "element",
  name: "w:tbl",
  elements: [
    {
      type: "element",
      name: "w:tblPr",
      elements: [
        {
          type: "element",
          name: "w:tblStyle",
          attributes: { "w:val": "a0" },
        },

        {
          type: "element",
          name: "w:tblpPr",
          attributes: {
            "w:leftFromText": "180",
            "w:rightFromText": "180",
            "w:topFromText": "180",
            "w:bottomFromText": "180",
            "w:vertAnchor": "text",
            "w:tblpX": "-794",
          },
        },

        {
          type: "element",
          name: "w:tblW",
          attributes: { "w:w": "10305", "w:type": "dxa" },
        },

        {
          type: "element",
          name: "w:tblBorders",
          elements: [
            {
              type: "element",
              name: "w:top",
              attributes: {
                "w:val": "single",
                "w:sz": "48",
                "w:space": "0",
                "w:color": "F5E9F2",
              },
            },

            {
              type: "element",
              name: "w:left",
              attributes: {
                "w:val": "single",
                "w:sz": "48",
                "w:space": "0",
                "w:color": "F5E9F2",
              },
            },

            {
              type: "element",
              name: "w:bottom",
              attributes: {
                "w:val": "single",
                "w:sz": "48",
                "w:space": "0",
                "w:color": "F5E9F2",
              },
            },

            {
              type: "element",
              name: "w:right",
              attributes: {
                "w:val": "single",
                "w:sz": "48",
                "w:space": "0",
                "w:color": "F5E9F2",
              },
            },

            {
              type: "element",
              name: "w:insideH",
              attributes: {
                "w:val": "single",
                "w:sz": "48",
                "w:space": "0",
                "w:color": "F5E9F2",
              },
            },

            {
              type: "element",
              name: "w:insideV",
              attributes: {
                "w:val": "single",
                "w:sz": "48",
                "w:space": "0",
                "w:color": "F5E9F2",
              },
            },
          ],
        },

        {
          type: "element",
          name: "w:tblLayout",
          attributes: { "w:type": "fixed" },
        },

        {
          type: "element",
          name: "w:tblLook",
          attributes: {
            "w:val": "0600",
            "w:firstRow": "0",
            "w:lastRow": "0",
            "w:firstColumn": "0",
            "w:lastColumn": "0",
            "w:noHBand": "1",
            "w:noVBand": "1",
          },
        },
      ],
    },

    {
      type: "element",
      name: "w:tblGrid",
      elements: [
        {
          type: "element",
          name: "w:gridCol",
          attributes: { "w:w": "3435" },
        },

        {
          type: "element",
          name: "w:gridCol",
          attributes: { "w:w": "3435" },
        },

        {
          type: "element",
          name: "w:gridCol",
          attributes: { "w:w": "3435" },
        },
      ],
    },
    // Rows
  ],
};

interface Cell {
  title: string;
  number: number;
}

const buildRow = (cells: Cell[]) => {
  const row = {
    type: "element",
    name: "w:tr",
    elements: [] as any[],
  };

  cells.forEach((cell) => {
    row.elements.push({
      type: "element", // Table Cell Properties
      name: "w:tc",
      elements: [
        {
          type: "element",
          name: "w:tcPr",
          elements: [
            {
              type: "element",
              name: "w:tcW",
              attributes: { "w:w": "3435", "w:type": "dxa" },
            },
            {
              type: "element",
              name: "w:tcBorders",
              elements: [
                {
                  type: "element",
                  name: "w:top",
                  attributes: {
                    "w:val": "single",
                    "w:sz": "48",
                    "w:space": "0",
                    "w:color": "F5E9F2",
                  },
                },

                {
                  type: "element",
                  name: "w:left",
                  attributes: {
                    "w:val": "single",
                    "w:sz": "48",
                    "w:space": "0",
                    "w:color": "F5E9F2",
                  },
                },

                {
                  type: "element",
                  name: "w:bottom",
                  attributes: {
                    "w:val": "single",
                    "w:sz": "48",
                    "w:space": "0",
                    "w:color": "F5E9F2",
                  },
                },

                {
                  type: "element",
                  name: "w:right",
                  attributes: {
                    "w:val": "single",
                    "w:sz": "48",
                    "w:space": "0",
                    "w:color": "F5E9F2",
                  },
                },
              ],
            },

            {
              type: "element",
              name: "w:shd",
              attributes: {
                "w:val": "clear",
                "w:color": "auto",
                "w:fill": "FFFFFF",
              },
            },

            {
              type: "element",
              name: "w:tcMar",
              elements: [
                {
                  type: "element",
                  name: "w:top",
                  attributes: {
                    "w:w": "226",
                    "w:type": "dxa",
                  },
                },

                {
                  type: "element",
                  name: "w:left",
                  attributes: {
                    "w:w": "226",
                    "w:type": "dxa",
                  },
                },

                {
                  type: "element",
                  name: "w:bottom",
                  attributes: {
                    "w:w": "226",
                    "w:type": "dxa",
                  },
                },

                {
                  type: "element",
                  name: "w:right",
                  attributes: {
                    "w:w": "226",
                    "w:type": "dxa",
                  },
                },
              ],
            },
          ],
        },
        // Cell content
        {
          type: "element",
          name: "w:p",
          elements: [
            {
              type: "element",
              name: "w:pPr",
              elements: [
                {
                  type: "element",
                  name: "w:widowControl",
                  attributes: { "w:val": "0" },
                },

                {
                  type: "element",
                  name: "w:spacing",
                  attributes: {
                    "w:line": "240",
                    "w:lineRule": "auto",
                  },
                },

                {
                  type: "element",
                  name: "w:ind",
                  attributes: {
                    "w:left": "0",
                    "w:right": "0",
                  },
                },

                {
                  type: "element",
                  name: "w:rPr",
                  elements: [
                    {
                      type: "element",
                      name: "w:rFonts",
                      attributes: {
                        "w:ascii": "Lexend SemiBold",
                        "w:eastAsia": "Lexend SemiBold",
                        "w:hAnsi": "Lexend SemiBold",
                        "w:cs": "Lexend SemiBold",
                      },
                    },

                    {
                      type: "element",
                      name: "w:color",
                      attributes: { "w:val": "222222" },
                    },

                    {
                      type: "element",
                      name: "w:sz",
                      attributes: { "w:val": "28" },
                    },

                    {
                      type: "element",
                      name: "w:szCs",
                      attributes: { "w:val": "28" },
                    },
                  ],
                },
              ],
            },
            {
              type: "element",
              name: "w:r",
              elements: [
                {
                  type: "element",
                  name: "w:rPr",
                  elements: [
                    {
                      type: "element",
                      name: "w:rFonts",
                      attributes: {
                        "w:ascii": "Lexend",
                        "w:eastAsia": "Lexend",
                        "w:hAnsi": "Lexend",
                        "w:cs": "Lexend",
                      },
                    },

                    { type: "element", name: "w:b" },

                    {
                      type: "element",
                      name: "w:color",
                      attributes: { "w:val": "222222" },
                    },

                    {
                      type: "element",
                      name: "w:sz",
                      attributes: { "w:val": "44" },
                    },

                    {
                      type: "element",
                      name: "w:szCs",
                      attributes: { "w:val": "44" },
                    },
                  ],
                },
                {
                  type: "element",
                  name: "w:t",
                  elements: [
                    {
                      type: "text",
                      text: cell.number,
                    },
                  ],
                },
              ],
            },
            // title
            {
              type: "element",
              name: "w:r",
              elements: [
                {
                  type: "element",
                  name: "w:rPr",
                  elements: [
                    {
                      type: "element",
                      name: "w:rFonts",
                      attributes: {
                        "w:ascii": "Lexend SemiBold",
                        "w:eastAsia": "Lexend SemiBold",
                        "w:hAnsi": "Lexend SemiBold",
                        "w:cs": "Lexend SemiBold",
                      },
                    },

                    {
                      type: "element",
                      name: "w:color",
                      attributes: { "w:val": "222222" },
                    },

                    {
                      type: "element",
                      name: "w:sz",
                      attributes: { "w:val": "28" },
                    },

                    {
                      type: "element",
                      name: "w:szCs",
                      attributes: { "w:val": "28" },
                    },
                  ],
                },

                { type: "element", name: "w:br" },

                {
                  type: "element",
                  name: "w:t",
                  elements: [{ type: "text", text: cell.title }],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  return row;
};

export function UnitsTable(units: Cell[]) {
  // const units = [
  //   { title: "Demo Title 1", number: 1 },
  //   { title: "Demo Title 2", number: 2 },
  //   { title: "Demo Title 3", number: 3 },
  //   { title: "Demo Title 4", number: 4 },
  //   { title: "Demo Title 5", number: 5 },
  // ];

  const newTable = JSON.parse(JSON.stringify(unitsTableTemplate)); // Deep copy
  for (let index = 0; index < units.length; index += 3) {
    const row = buildRow(units.slice(index, index + 3));
    newTable.elements.push(row);
  }

  return newTable;
}
