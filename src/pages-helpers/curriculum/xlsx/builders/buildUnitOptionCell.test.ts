import { prettyFormat } from "../../docx/xml";

import { buildUnitOptionCell } from "./buildUnitOptionCell";

import { createUnitOption } from "@/fixtures/curriculum/unitOption";

test("buildUnitOptionCell", () => {
  const output = buildUnitOptionCell({
    cellStyleIndexMap: { temp3: "TEMP_3" },
    x: 1,
    y: 1,
    unitOption: createUnitOption(),
    unitOptionIndex: 1,
  });
  expect(prettyFormat(output)).toMatchSnapshot();
});
