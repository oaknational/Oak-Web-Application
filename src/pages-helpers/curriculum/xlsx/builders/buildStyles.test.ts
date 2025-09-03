import { prettyFormat } from "../../docx/xml";

import { buildStyles } from "./buildStyles";

test("buildStyles", () => {
  const { styleXml, cellStyleIndexMap } = buildStyles();
  expect(prettyFormat(styleXml)).toMatchSnapshot();
  expect(cellStyleIndexMap).toMatchSnapshot();
});
