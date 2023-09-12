import { screen } from "@testing-library/react";

import CurriculumHomePage, {
  getStaticPaths,
  CurriculumHomePageProps,
  fetchCurriculumPageBlogs,
  Client,
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
    category: { title: "category", slug: "category" },
  },
  {
    id: "3",
    title: "blog 3",
    slug: "blog-3",
    date: new Date("2021-12-01").toISOString(),
    category: { title: "category", slug: "category" },
  },
] as SerializedBlogPostPreview[];

const props: CurriculumHomePageProps = {
  subjectPhaseOptions: subjectPhaseOptions,
  posts: mockPosts,
};

jest.mock("src/components/SubjectPhasePicker/SubjectPhasePicker", () => {
  return jest.fn(() => <div>Mock SubjectPhasePicker</div>);
});

const mockCMS = (willErr = false) => ({
  blogPostBySlug: jest.fn((slug) => {
    if (willErr) throw new Error("Missing blog post");
    switch (slug) {
      case "how-to-design-a-subject-curriculum":
        return {
          id: "1",
          title: "blog 1",
          slug: "blog-1",
          date: new Date("2021-12-01"),
          category: { title: "category", slug: "category" },
        };
      case "how-to-refresh-your-curriculum-using-oak-units":
        return {
          id: "2",
          title: "blog 2",
          slug: "blog-2",
          date: new Date("2021-12-01"),
          category: { title: "category", slug: "category" },
        };
      case "how-to-design-a-unit-of-study":
        return {
          id: "3",
          title: "blog 3",
          slug: "blog-3",
          date: new Date("2021-12-01"),
          category: { title: "category", slug: "category" },
        };
      default:
        return null;
    }
  }),
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
      expect.anything()
    );
  });

  describe("curriculum blog posts", () => {
    it("Renders curriculum blogs", () => {
      render(<CurriculumHomePage {...props} />);
      const blogList = screen.getByTestId("blog-list");
      expect(blogList).toBeInTheDocument();
    });

    it("Renders the correct number of blogs", () => {
      render(<CurriculumHomePage {...props} />);
      const blogs = screen.getAllByTestId("blog-list-item");
      expect(blogs).toHaveLength(3);
    });

    describe("fetchCurriculumPageBlogs", () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it("Should return the correct data", async () => {
        const blogs = await fetchCurriculumPageBlogs(
          mockCMS() as unknown as Client
        );
        expect(blogs).toEqual(mockPosts);
      });

      it("Should throw an error if any of the blogs are missing", async () => {
        await expect(
          fetchCurriculumPageBlogs(mockCMS(true) as unknown as Client)
        ).rejects.toThrow("Missing blog post");
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Shouldn't return any paths when shouldSkipInitialBuild is true", async () => {
      const paths = await getStaticPaths();
      expect(paths).toEqual({ fallback: "blocking", paths: [] });
    });
  });
});
