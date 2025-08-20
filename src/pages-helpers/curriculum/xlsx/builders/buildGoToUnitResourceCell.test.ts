import { prettyFormat } from "../../docx/xml";

import { buildGoToUnitResourceCell } from "./buildGoToUnitResourceCell";

test("buildGoToUnitResourceCell", () => {
  const output = buildGoToUnitResourceCell({
    cellStyleIndexMap: { temp3: "TEMP_3" },
    x: 1,
    y: 1,
  });
  expect(prettyFormat(output)).toMatchSnapshot();
});
