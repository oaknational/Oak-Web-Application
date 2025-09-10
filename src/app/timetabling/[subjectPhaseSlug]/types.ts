import { Lesson, Unit, UnitOption } from "@/utils/curriculum/types";

export type ExtendedUnit = {
  lessons: (Lesson & { included: boolean })[];
  unit_options: ExtendedUnitOption[];
} & Unit;

export type ExtendedUnitOption = {
  lessons: (Lesson & { included: boolean })[];
} & UnitOption;

export type Input = {
  autumn1Lessons: number;
  autumn2Lessons: number;
  spring1Lessons: number;
  spring2Lessons: number;
  summer1Lessons: number;
  summer2Lessons: number;
  //   lessonsPerWeek: number;
  year: number;
};
