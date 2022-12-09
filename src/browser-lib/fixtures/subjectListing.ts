import { TeachersKeyStageSubjectsData } from "../../node-lib/curriculum-api";
import teachersKeyStageSubjectsFixture from "../../node-lib/curriculum-api/fixtures/teachersKeyStageSubjects.fixture";

export const subjects: TeachersKeyStageSubjectsData["subjects"] =
  teachersKeyStageSubjectsFixture().subjects;
