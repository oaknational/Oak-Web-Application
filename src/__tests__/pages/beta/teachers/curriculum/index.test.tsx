import { screen } from "@testing-library/react";

import CurriculumHomePage, {
  getStaticProps,
  CurriculumHomePageProps,
} from "pages/beta/teachers/curriculum";
import renderWithProviders from "__tests__/__helpers__/renderWithProviders";
import curriculumHomePageFixture from "node-lib/curriculum-api/fixtures/curriculumHomePage.fixture";

const render = renderWithProviders();

const props: CurriculumHomePageProps = {
  data: {
    programmes: [],
  },
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
      expect(testRes.props.data).toEqual(curriculumHomePageFixture());
    });
  });
});
