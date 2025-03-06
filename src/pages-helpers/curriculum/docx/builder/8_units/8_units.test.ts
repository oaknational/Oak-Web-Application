// import { generateEmptyDocx } from "../../docx";
// import { zipToSnapshotObject } from "../helper";

// import generate from "./8_units";
// import { data } from "./8_units.fixture";

// import {
//   curriculumUnitsEnglishPrimary,
//   curriculumUnitsScienceSecondary,
// } from "@/utils/curriculum/fixtures";

describe("8_units", () => {
  it("placeholder", () => {});

  // it("simple", async () => {
  //   const zip = await generateEmptyDocx();
  //   await generate(zip, {
  //     slugs: {
  //       subjectSlug: "science",
  //       phaseSlug: "secondary",
  //     },
  //     data: {
  //       ...data,
  //       units: [...curriculumUnitsScienceSecondary.units.slice(0, 10)],
  //     },
  //   });

  //   expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  // });

  // it("subjectcategory grouped", async () => {
  //   const zip = await generateEmptyDocx();
  //   await generate(zip, {
  //     slugs: {
  //       subjectSlug: "english",
  //       phaseSlug: "primary",
  //     },
  //     data: {
  //       ...data,
  //       units: [...curriculumUnitsEnglishPrimary.units.slice(0, 10)],
  //     },
  //   });

  //   expect(await zipToSnapshotObject(zip.getJsZip())).toMatchSnapshot();
  // });
});
