import { TeachersKeyStageSubjectUnitsData } from "../../node-lib/curriculum-api";
import teachersKeyStageSubjectUnitsFixture from "../../node-lib/curriculum-api/fixtures/teachersKeyStageSubjectUnits.fixture";

export const subjectUnits: TeachersKeyStageSubjectUnitsData["units"] =
  teachersKeyStageSubjectUnitsFixture().units;
