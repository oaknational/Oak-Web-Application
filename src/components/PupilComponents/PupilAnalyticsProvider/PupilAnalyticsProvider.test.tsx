import { render } from "@testing-library/react";
import { OakP } from "@oaknational/oak-components";

import { PupilAnalyticsProvider } from "./PupilAnalyticsProvider";

describe("PupilAnalyticsProvider", () => {
  it("should render children", () => {
    const { getByText } = render(
      <PupilAnalyticsProvider>
        <OakP>Hello World</OakP>
      </PupilAnalyticsProvider>,
    );

    expect(getByText("Hello World")).toBeInTheDocument();
  });
});
