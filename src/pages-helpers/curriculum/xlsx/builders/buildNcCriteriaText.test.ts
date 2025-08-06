import { prettyFormat } from "../../docx/xml";

import { buildNcCriteriaText } from "./buildNcCriteriaText";

test("buildNcCriteriaText", () => {
  const output = buildNcCriteriaText({
    cellStyleIndexMap: {},
    nationalCurricText: "TEST_TEXT",
    x: 1,
    y: 2,
  });
  expect(prettyFormat(output)).toMatchSnapshot();
});
