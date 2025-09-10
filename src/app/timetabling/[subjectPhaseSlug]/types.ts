import { Lesson, Unit, UnitOption } from "@/utils/curriculum/types";

export type ExtendedUnit = {
  lessons: (Lesson & { included: boolean })[];
  unit_options: ExtendedUnitOption[];
} & Unit;

export type ExtendedUnitOption = {
  lessons: (Lesson & { included: boolean })[];
} & UnitOption;

export type Input = {
  autumn1Weeks: number;
  autumn2Weeks: number;
  spring1Weeks: number;
  spring2Weeks: number;
  summer1Weeks: number;
  summer2Weeks: number;
  lessonsPerWeek: number;
  year: number;
};
