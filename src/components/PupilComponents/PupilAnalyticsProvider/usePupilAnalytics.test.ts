import { renderHook } from "@testing-library/react";

import { usePupilAnalytics } from "./usePupilAnalytics";
import { getMockPupilAnalytics } from "./getMockPupilAnalytics";

describe("usePupilAnalytics", () => {
  it("should return mock analytics when in Storybook environment", () => {
    process.env.STORYBOOK = "true";
    const { result } = renderHook(() => usePupilAnalytics());
    expect(JSON.stringify(result.current)).toEqual(
      JSON.stringify(getMockPupilAnalytics()),
    );
    delete process.env.STORYBOOK;
  });
});
