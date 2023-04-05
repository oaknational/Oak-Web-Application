import type { AnalyticsUseCaseValueType } from "../browser-lib/avo/Avo";

/**
 * This hook returns useCase value for tracking
 * This is currently hardcoded to "Teacher", later on we will retrieve it
 * from the url.
 */
const useAnalyticsUseCase = () => {
  const useCase: AnalyticsUseCaseValueType[] = ["Teacher"];
  return useCase;
};

export default useAnalyticsUseCase;
