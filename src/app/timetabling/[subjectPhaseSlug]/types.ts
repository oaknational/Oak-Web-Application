import { Lesson, Unit } from "@/utils/curriculum/types";

export type ExtendedUnit = {
  lessons: (Lesson & { included: boolean })[];
} & Unit;
