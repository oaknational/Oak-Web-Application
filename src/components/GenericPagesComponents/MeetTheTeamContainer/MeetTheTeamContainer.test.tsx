import { MeetTheTeamContainer } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { portableTextFromString } from "@/__tests__/__helpers__/cms";

const render = renderWithProvidersByName(["oakTheme"]);

describe("MeetTheTeamContainer", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole } = render(
      <MeetTheTeamContainer title={"TESTING_TITLE"} text={portableTextFromString("TEST_TEXT")}>
        TEST_CONTENT
      </MeetTheTeamContainer>,
    );

    const headingEl = getByRole("heading");
    expect(headingEl).toHaveTextContent("TESTING_TITLE");
    expect(headingEl.tagName).toEqual("H2");
    expect(getByRole("paragraph")).toHaveTextContent("TEST_TEXT");

    expect(baseElement).toMatchSnapshot();
  });
});
