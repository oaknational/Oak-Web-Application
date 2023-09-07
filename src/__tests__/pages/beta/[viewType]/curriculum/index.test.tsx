import { screen } from "@testing-library/react";

import CurriculumHomePage, {
  getStaticPaths,
  // getStaticProps,
  CurriculumHomePageProps,
} from "@/pages/beta/[viewType]/curriculum";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import subjectPhaseOptions from "@/browser-lib/fixtures/subjectPhaseOptions";
import SubjectPhasePicker from "@/components/SubjectPhasePicker/SubjectPhasePicker";
import { SerializedBlogPostPreview } from "@/components/pages/BlogIndex.page";

const render = renderWithProviders();

const mockPosts = [
  {
    id: "1",
    title: "blog 1",
    slug: "blog-1",
    date: new Date("2021-12-01").toISOString(),
    category: { title: "category", slug: "category" },
  },
  {
    id: "2",
    title: "blog 2",
    slug: "blog-2",
    date: new Date("2021-12-01").toISOString(),
    category: { title: "ategory", slug: "category" },
  },
] as SerializedBlogPostPreview[];

const props: CurriculumHomePageProps = {
  subjectPhaseOptions: subjectPhaseOptions,
  posts: mockPosts,
};

jest.mock("src/components/SubjectPhasePicker/SubjectPhasePicker", () => {
  return jest.fn(() => <div>Mock SubjectPhasePicker</div>);
});

describe("pages/beta/curriculum/index", () => {
  it("Renders correct title", () => {
    render(<CurriculumHomePage {...props} />);

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Oak's curricula");
  });

  it("passes correct props to SubjectPhasePicker", () => {
    render(<CurriculumHomePage {...props} />);
    expect(SubjectPhasePicker).toHaveBeenCalledWith(
      props.subjectPhaseOptions,
      expect.anything(),
    );
  });

  it("Renders curriculum blogs", () => {
    render(<CurriculumHomePage {...props} />);
    const blogList = screen.getByTestId("blog-list");
    expect(blogList).toBeInTheDocument();
  });

  // Removed Test Due to the filtering and sorting of the CMS blogs
  // describe("getStaticProps", () => {
  //   it("Should fetch the correct data", async () => {
  //     const testRes = (await getStaticProps({})) as {
  //       props: CurriculumHomePageProps;
  //     };
  //     expect(testRes.props.subjectPhaseOptions).toEqual(subjectPhaseOptions);
  //   });
  // });

  describe("getStaticPaths", () => {
    it("Shouldn't return any paths when shouldSkipInitialBuild is true", async () => {
      const paths = await getStaticPaths();
      expect(paths).toEqual({ fallback: "blocking", paths: [] });
    });
  });
});
