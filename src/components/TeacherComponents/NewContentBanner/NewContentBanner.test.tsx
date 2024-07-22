import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";
import { render } from "@testing-library/react";

import NewContentBanner from "./NewContentBanner";

describe("NewContentBanner component", () => {
  it("renders NewContentBanner component", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <NewContentBanner
          subjectSlug="english-reading-for-pleasure"
          subjectTitle="English"
          programmeSlug=""
          keyStageSlug="ks2"
          isUnitListing={true}
        />
      </OakThemeProvider>,
    );
  });
});
