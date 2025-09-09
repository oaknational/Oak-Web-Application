import { Lesson, Unit, UnitOption } from "@/utils/curriculum/types";

export type ExtendedUnit = {
  lessons: (Lesson & { included: boolean })[];
  unit_options: ExtendedUnitOption[];
} & Unit;

export type ExtendedUnitOption = {
  lessons: (Lesson & { included: boolean })[];
} & UnitOption;
