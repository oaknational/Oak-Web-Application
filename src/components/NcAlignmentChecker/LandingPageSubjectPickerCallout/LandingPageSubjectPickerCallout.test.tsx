import LandingPageSubjectPickerCallout from "./LandingPageSubjectPickerCallout";

import { basic } from "@/components/NcAlignmentChecker/SubjectPickerForm/SubjectPickerForm.fixtures";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("LandingPageSubjectPickerCallout", () => {
  it("renders correct data", () => {
    const { baseElement } = render(
      <LandingPageSubjectPickerCallout subjectPicker={{ ...basic }} />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(baseElement.querySelector("h2")).toHaveTextContent(basic.title);
  });
});
