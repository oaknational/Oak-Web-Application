import { screen } from "@testing-library/react";

import CurriculumHomePage, {
  fetchSubjectPhaseOptions,
  CurriculumHomePageProps,
} from "pages/beta/[viewType]/curriculum";
import renderWithProviders from "__tests__/__helpers__/renderWithProviders";
import subjectPhaseOptions from "browser-lib/fixtures/subjectPhaseOptions";
import SubjectPhasePicker, {
  SubjectPhaseOptions,
} from "components/SubjectPhasePicker/SubjectPhasePicker";

jest.mock("node-lib/isr", () => ({
  decorateWithIsr: jest.fn(),
  getFallbackBlockingConfig: jest.fn(),
  shouldSkipInitialBuild: jest.fn(),
}));

const render = renderWithProviders();

const props: CurriculumHomePageProps = {
  subjectPhaseOptions: subjectPhaseOptions,
};

jest.mock("components/SubjectPhasePicker/SubjectPhasePicker", () => {
  return jest.fn(() => <div>Mock SubjectPhasePicker</div>);
});

describe("pages/beta/curriculum/index", () => {
  it("Renders correct title", () => {
    render(<CurriculumHomePage {...props} />);

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Curriculum Resources");
  });

  it("passes correct props to SubjectPhasePicker", () => {
    render(<CurriculumHomePage {...props} />);
    expect(SubjectPhasePicker).toHaveBeenCalledWith(
      props.subjectPhaseOptions,
      expect.anything()
    );
  });

  describe("fetchSubjectPhaseOptions", () => {
    it("Should fetch the correct data", async () => {
      const testRes = (await fetchSubjectPhaseOptions()) as SubjectPhaseOptions;
      expect(testRes).toEqual(subjectPhaseOptions);
    });
  });
});
