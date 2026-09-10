import { screen } from "@testing-library/react";

import { SharePageNumberedHeading } from "./SharePageNumberedHeading";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("SharePageNumberedHeading", () => {
  it("renders the numbered heading and paragraph", () => {
    renderWithTheme(
      <SharePageNumberedHeading
        number={1}
        title="Select activities"
        paragraph="Select the activities you want to share."
      />,
    );

    expect(
      screen.getByRole("heading", { name: /select activities/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Select the activities you want to share."),
    ).toBeInTheDocument();
  });

  it("applies titleId to the title span for aria-labelledby", () => {
    renderWithTheme(
      <SharePageNumberedHeading
        number={2}
        title="Share with pupils"
        paragraph="Use one of the links below."
        titleId="share-with-pupils-heading"
      />,
    );

    expect(
      document.getElementById("share-with-pupils-heading"),
    ).toHaveTextContent("Share with pupils");
  });
});
