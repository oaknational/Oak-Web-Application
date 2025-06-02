import { JSZipCached } from "../../docx";

import { buildUnitPriorKnowledgeReqs } from "./unit_detail";

import { createUnit } from "@/fixtures/curriculum/unit";
import { ENABLE_PRIOR_KNOWLEDGE_REQUIREMENTS } from "@/utils/curriculum/constants";

const insertNumberingMock = jest.fn(() => {
  return {
    priorKnowledgeReqsNumbering: "test",
  };
});
jest.mock("../../docx", () => {
  return {
    ...jest.requireActual("../../docx"),
    insertNumbering: (...args: []) => insertNumberingMock(...args),
  };
});

const FAKE_ZIP = {};

describe("buildUnitPriorKnowledgeReqs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  if (ENABLE_PRIOR_KNOWLEDGE_REQUIREMENTS) {
    test("with data", async () => {
      const out = await buildUnitPriorKnowledgeReqs(
        FAKE_ZIP as unknown as JSZipCached,
        createUnit({
          prior_knowledge_requirements: [
            "prior knowledge req 1",
            "prior knowledge req 2",
            "prior knowledge req 3",
          ],
        }),
      );
      expect(insertNumberingMock).toHaveBeenCalled();
      expect(insertNumberingMock).toHaveBeenCalledWith(
        FAKE_ZIP,
        expect.objectContaining({
          priorKnowledgeReqsNumbering: expect.anything(),
        }),
      );
      expect(out).toMatchSnapshot();
    });

    test("empty data", async () => {
      const out = await buildUnitPriorKnowledgeReqs(
        FAKE_ZIP as unknown as JSZipCached,
        createUnit({
          prior_knowledge_requirements: [],
        }),
      );
      expect(insertNumberingMock).not.toHaveBeenCalled();
      expect(out).toEqual(undefined);
    });

    test("no data", async () => {
      const out = await buildUnitPriorKnowledgeReqs(
        FAKE_ZIP as unknown as JSZipCached,
        createUnit({
          prior_knowledge_requirements: undefined,
        }),
      );
      expect(insertNumberingMock).not.toHaveBeenCalled();
      expect(out).toEqual(undefined);
    });
  }
});
