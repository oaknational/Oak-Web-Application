import "@testing-library/jest-dom";

import { ImplementationGuideCallout } from "./index";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("ImplementationGuideCallout", () => {
  test("renders the component with the correct message and link", () => {
    // Render the component with test props
    const { getByText } = renderWithProviders()(
      <ImplementationGuideCallout
        subject="maths"
        phase="ks3"
        subjectTitle="Maths"
        phaseTitle="Key Stage 3"
      />,
    );

    // Check if the message is rendered correctly
    const message = getByText(
      /Leading your school's use of Oak's maths key stage 3 curriculum\? Download our implementation toolkit\./i,
    );
    expect(message).toBeInTheDocument();
  });

  test("renders the component with uppercase for language subjects", () => {
    // Render the component with test props
    const { getByText } = renderWithProviders()(
      <ImplementationGuideCallout
        subject="english"
        phase="ks3"
        subjectTitle="English"
        phaseTitle="Key Stage 3"
      />,
    );

    // Check if the message is rendered correctly
    const message = getByText(
      /Leading your school's use of Oak's English key stage 3 curriculum\? Download our implementation toolkit\./i,
    );
    expect(message).toBeInTheDocument();
  });
});
