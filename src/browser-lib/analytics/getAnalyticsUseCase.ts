import { AnalyticsUseCaseValueType } from "../avo/Avo";

export default function getAnalyticsUseCase(
  viewType: "teachers" | "pupils",
): AnalyticsUseCaseValueType {
  switch (viewType) {
    case "pupils":
      return "Pupil";
    case "teachers":
      return "Teacher";
  }
}
