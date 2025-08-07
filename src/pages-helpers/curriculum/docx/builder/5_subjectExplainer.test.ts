import { generateEmptyDocx } from "../docx";

import generate from "./5_subjectExplainer";
import { zipToSnapshotObject } from "./helper";

import { CombinedCurriculumData } from "@/utils/curriculum/types";

describe("5_subjectExplainer", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("simple", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        curriculaDesc: "Something\nsomething\nsomething",
        subjectTitle: "Science",
        curriculumExplainer: {
          explainerRaw: [
            {
              children: [
                {
                  _type: "span",
                  marks: [],
                  text: "Aims and purpose",
                  _key: "470ecdd07b7d",
                },
              ],
              _type: "block",
              style: "heading2",
              _key: "82cf6558d6f8",
              markDefs: [],
            },
          ],
        },
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });

  it("cycle 2 features", async () => {
    const zip = await generateEmptyDocx();
    await generate(zip, {
      data: {
        curriculaDesc: "Something\nsomething\nsomething",
        subjectTitle: "Science",
        curriculumExplainer: {
          explainerRaw: [
            {
              children: [
                {
                  _type: "span",
                  marks: [],
                  text: "Heading 1",
                  _key: "470ecdd07b7d",
                },
              ],
              _type: "block",
              style: "heading1",
              _key: "82cf6558d6f8",
              markDefs: [],
            },
            {
              children: [
                {
                  _type: "span",
                  marks: [],
                  text: "test",
                  _key: "470ecdd07b7d",
                },
              ],
              _type: "block",
              style: "normal",
              _key: "82cf6558d6f8",
              markDefs: [],
            },
            {
              children: [
                {
                  _type: "span",
                  marks: [],
                  text: "Heading 2",
                  _key: "470ecdd07b7d",
                },
              ],
              _type: "block",
              style: "heading2",
              _key: "82cf6558d6f8",
              markDefs: [],
            },
            {
              children: [
                {
                  _type: "span",
                  marks: [],
                  text: "test",
                  _key: "470ecdd07b7d",
                },
              ],
              _type: "block",
              style: "normal",
              _key: "82cf6558d6f8",
              markDefs: [],
            },
            {
              children: [
                {
                  _type: "span",
                  marks: [],
                  text: "Heading 3",
                  _key: "470ecdd07b7d",
                },
              ],
              _type: "block",
              style: "heading3",
              _key: "82cf6558d6f8",
              markDefs: [],
            },
            {
              children: [
                {
                  _type: "span",
                  marks: [],
                  text: "test",
                  _key: "470ecdd07b7d",
                },
              ],
              _type: "block",
              style: "normal",
              _key: "82cf6558d6f8",
              markDefs: [],
            },
            {
              children: [
                {
                  _type: "span",
                  marks: [],
                  text: "Heading 4",
                  _key: "470ecdd07b7d",
                },
              ],
              _type: "block",
              style: "heading4",
              _key: "82cf6558d6f8",
              markDefs: [],
            },
            {
              children: [
                {
                  _type: "span",
                  marks: [],
                  text: "test",
                  _key: "470ecdd07b7d",
                },
              ],
              _type: "block",
              style: "normal",
              _key: "82cf6558d6f8",
              markDefs: [],
            },
            ...["one", "two", "three"].flatMap((text) => {
              return [
                {
                  children: [
                    {
                      _type: "span",
                      marks: [],
                      text: text,
                      _key: "470ecdd07b7d",
                    },
                  ],
                  _type: "block",
                  listItem: "bullet",
                  _key: "82cf6558d6f8",
                  level: 1,
                  markDefs: [],
                },
                ...["one", "two", "three"].map((text) => {
                  return {
                    children: [
                      {
                        _type: "span",
                        marks: [],
                        text: text,
                        _key: "470ecdd07b7d",
                      },
                    ],
                    _type: "block",
                    listItem: "bullet",
                    _key: "82cf6558d6f8",
                    level: 2,
                    markDefs: [],
                  };
                }),
              ];
            }),
          ],
        },
      } as CombinedCurriculumData,
    });

    expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  });
});
