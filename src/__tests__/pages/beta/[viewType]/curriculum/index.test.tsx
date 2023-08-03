import { screen } from "@testing-library/react";
import { GetStaticPropsContext, PreviewData } from "next";

import CurriculumHomePage, {
  getStaticProps,
  CurriculumHomePageProps,
  URLParams,
} from "@/pages/beta/[viewType]/curriculum";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import subjectPhaseOptions from "@/browser-lib/fixtures/subjectPhaseOptions";
import SubjectPhasePicker from "@/components/SubjectPhasePicker/SubjectPhasePicker";

const render = renderWithProviders();

const props: CurriculumHomePageProps = {
  subjectPhaseOptions: subjectPhaseOptions,
};

jest.mock("src/components/SubjectPhasePicker/SubjectPhasePicker", () => {
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

  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const testRes = (await getStaticProps({
        params: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: CurriculumHomePageProps;
      };
      expect(testRes.props.subjectPhaseOptions).toEqual(subjectPhaseOptions);
    });
  });
});
