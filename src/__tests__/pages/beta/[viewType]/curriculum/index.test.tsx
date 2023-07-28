import { screen } from "@testing-library/react";

import CurriculumHomePage, {
  fetchSubjectPhaseOptions,
  getStaticProps,
  CurriculumHomePageProps,
} from "pages/beta/[viewType]/curriculum";
import renderWithProviders from "__tests__/__helpers__/renderWithProviders";
import subjectPhaseOptions from "browser-lib/fixtures/subjectPhaseOptions";
import { SubjectPhaseOptions } from "components/SubjectPhasePicker/SubjectPhasePicker";

const render = renderWithProviders();

const props: CurriculumHomePageProps = {
  subjectPhaseOptions: subjectPhaseOptions,
};

describe("pages/beta/curriculum/index", () => {
  it("Renders correct title ", () => {
    render(<CurriculumHomePage {...props} />);

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Curriculum Resources");
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const testRes = (await getStaticProps({})) as {
        props: CurriculumHomePageProps;
      };
      expect(testRes.props).toEqual(props);
    });
  });

  describe("fetchSubjectPhaseOptions", () => {
    it("Should fetch the correct data", async () => {
      const testRes = (await fetchSubjectPhaseOptions()) as SubjectPhaseOptions;
      expect(testRes).toEqual(subjectPhaseOptions);
    });
  });
});
