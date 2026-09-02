import "@testing-library/jest-dom";

import { ImplementationGuideCallout } from "./index";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("ImplementationGuideCallout", () => {
  test("renders maths with the correct message and link", () => {
    // Render the component with test props
    const { getByText } = renderWithProviders()(
      <ImplementationGuideCallout
        subject="maths"
        phase="ks1"
        subjectTitle="Maths"
        phaseTitle="Primary"
        onClick={() => {}}
        activeFlags={[]}
      />,
    );

    // Check if the message is rendered correctly
    const message = getByText(
      "Leading your school's use of Oak's maths primary curriculum? Download our implementation toolkit.",
    );
    expect(message).toBeInTheDocument();
  });

  test("renders English with the correct message and link", () => {
    // Render the component with test props
    const { getByText } = renderWithProviders()(
      <ImplementationGuideCallout
        subject="english"
        phase="ks3"
        subjectTitle="English"
        phaseTitle="Secondary"
        onClick={() => {}}
        activeFlags={[]}
      />,
    );

    // Check if the message is rendered correctly
    const message = getByText(
      "Leading your school's use of Oak's English secondary curriculum? Download our implementation toolkit.",
    );
    expect(message).toBeInTheDocument();
  });

  test("renders rshe-pshe with the correct message and link", () => {
    // Render the component with test props
    const { getByText } = renderWithProviders()(
      <ImplementationGuideCallout
        subject="rshe-pshe"
        phase="ks2"
        subjectTitle="RSHE (PSHE)"
        phaseTitle="Primary"
        onClick={() => {}}
        activeFlags={[]}
      />,
    );

    // Check if the message is rendered correctly
    const message = getByText(
      "Leading your school's use of Oak's RSHE (PSHE) primary curriculum? Download our implementation toolkit.",
    );
    expect(message).toBeInTheDocument();
  });

  test("inline banner hidden when cookie-flag 'oak-flag-toolkit-modal-dismissed' present", () => {
    // Render the component with test props
    const { queryByText } = renderWithProviders()(
      <ImplementationGuideCallout
        subject="rshe-pshe"
        phase="ks2"
        subjectTitle="RSHE (PSHE)"
        phaseTitle="Primary"
        onClick={() => {}}
        activeFlags={["oak-flag-toolkit-modal-dismissed"]}
      />,
    );

    // Check if the message is rendered correctly
    const message = queryByText(
      "Leading your school's use of Oak's RSHE (PSHE) primary curriculum? Download our implementation toolkit.",
    );
    expect(message).not.toBeInTheDocument();
  });
});
