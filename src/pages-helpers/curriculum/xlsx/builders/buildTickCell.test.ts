import { prettyFormat } from "../../docx/xml";

import { buildTickCell } from "./buildTickCell";

describe("buildTickCell", () => {
  test("has NC criteria", () => {
    const output = buildTickCell(
      {
        temp1: "TEMP_1",
        temp5: "TEMP_5",
      },
      true,
      1,
      1,
    );
    expect(prettyFormat(output)).toMatchSnapshot();
  });

  test("has no NC criteria", () => {
    const output = buildTickCell(
      {
        temp1: "TEMP_1",
        temp5: "TEMP_5",
      },
      false,
      1,
      1,
    );
    expect(prettyFormat(output)).toMatchSnapshot();
  });
});
