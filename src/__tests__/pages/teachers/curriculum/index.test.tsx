import { screen } from "@testing-library/react";

import CurriculumHomePage, {
  CurriculumHomePageProps,
  fetchCurriculumPageBlogs,
  Client,
} from "@/pages/teachers/curriculum";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import curriculumPhaseOptions from "@/browser-lib/fixtures/curriculumPhaseOptions";
import SubjectPhasePicker from "@/components/SharedComponents/SubjectPhasePicker";
import { SerializedBlogPostPreview } from "@/common-lib/cms-types";
import { CurriculumPhaseOptions } from "@/node-lib/curriculum-api-2023";
import { filterValidCurriculumPhaseOptions } from "@/pages-helpers/curriculum/docx/tab-helpers";

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
  {
    id: "4",
    title: "blog 4",
    slug: "blog-4",
    date: new Date("2021-12-01").toISOString(),
    category: { title: "category", slug: "category" },
  },
] as SerializedBlogPostPreview[];

const props: CurriculumHomePageProps = {
  curriculumPhaseOptions: curriculumPhaseOptions,
  posts: mockPosts,
};

jest.mock(
  "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker",
  () => {
    return jest.fn(() => <div>Mock SubjectPhasePicker</div>);
  },
);

const mockCMS = (willErr = false) => ({
  blogPostBySlug: jest.fn((slug) => {
    if (willErr) throw new Error("Missing blog post");
    switch (slug) {
      case "our-new-curriculum-plans-are-here":
        return {
          id: "1",
          title: "blog 1",
          slug: "blog-1",
          date: new Date("2021-12-01"),
          category: { title: "category", slug: "category" },
        };
      case "how-to-design-a-subject-curriculum":
        return {
          id: "2",
          title: "blog 2",
          slug: "blog-2",
          date: new Date("2021-12-01"),
          category: { title: "category", slug: "category" },
        };
      case "how-to-refresh-your-curriculum-using-oak-units":
        return {
          id: "3",
          title: "blog 3",
          slug: "blog-3",
          date: new Date("2021-12-01"),
          category: { title: "category", slug: "category" },
        };
      case "how-to-design-a-unit-of-study":
        return {
          id: "4",
          title: "blog 4",
          slug: "blog-4",
          date: new Date("2021-12-01"),
          category: { title: "category", slug: "category" },
        };
      default:
        return null;
    }
  }),
});

describe("pages/curriculum/index", () => {
  it("Renders correct title", () => {
    render(<CurriculumHomePage {...props} />);

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Oak's curricula");
  });

  it("passes correct props to SubjectPhasePicker", () => {
    render(<CurriculumHomePage {...props} />);
    expect(SubjectPhasePicker).toHaveBeenCalledWith(
      props.curriculumPhaseOptions,
      expect.anything(),
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
      expect(blogs).toHaveLength(4);
    });

    describe("fetchCurriculumPageBlogs", () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it("Should return the correct data", async () => {
        const blogs = await fetchCurriculumPageBlogs(
          mockCMS() as unknown as Client,
        );
        expect(blogs).toEqual(mockPosts);
      });

      it("Should throw an error if any of the blogs are missing", async () => {
        await expect(
          fetchCurriculumPageBlogs(mockCMS(true) as unknown as Client),
        ).rejects.toThrow("Missing blog post");
      });
    });
  });

  describe("filterValidCurriculumPhaseOptions", () => {
    it("returns the same options when no filters apply (only examboards)", () => {
      const options = [
        {
          title: "English",
          phases: [],
          keystages: [],
          ks4_options: [
            { title: "OCR", slug: "ocr" },
            { title: "Edexcel", slug: "edexcel" },
          ],
          slug: "english",
        },
      ] as CurriculumPhaseOptions;
      expect(filterValidCurriculumPhaseOptions(options)).toBe(options);
    });

    it("returns the same options when no filters apply (core & gcse)", () => {
      const options = [
        {
          title: "English",
          phases: [],
          keystages: [],
          ks4_options: [
            { title: "Core", slug: "core" },
            { title: "GCSE", slug: "gcse" },
          ],
          slug: "english",
        },
      ] as CurriculumPhaseOptions;
      expect(filterValidCurriculumPhaseOptions(options)).toBe(options);
    });

    it("returns no options when none are present", () => {
      const options = [
        {
          title: "English",
          phases: [],
          keystages: [],
          ks4_options: [],
          slug: "english",
        },
      ] as CurriculumPhaseOptions;
      expect(filterValidCurriculumPhaseOptions(options)).toBe(options);
    });

    it("returns filtered options when gcse is present", () => {
      const options = [
        {
          title: "English",
          phases: [],
          keystages: [],
          ks4_options: [
            { title: "Core", slug: "core" },
            { title: "GCSE", slug: "gcse" },
            { title: "OCR", slug: "ocr" },
            { title: "Edexcel", slug: "edexcel" },
          ],
          slug: "english",
        },
      ] as CurriculumPhaseOptions;
      expect(filterValidCurriculumPhaseOptions(options)).toEqual([
        {
          title: "English",
          phases: [],
          keystages: [],
          ks4_options: [
            { title: "Core", slug: "core" },
            { title: "OCR", slug: "ocr" },
            { title: "Edexcel", slug: "edexcel" },
          ],
          slug: "english",
        },
      ] as CurriculumPhaseOptions);
    });
  });

  it("should display the correct heading for blog section", () => {
    render(
      <CurriculumHomePage
        curriculumPhaseOptions={{ subjects: [] }}
        posts={mockPosts}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Our blogs on curriculum",
        level: 2,
      }),
    ).toBeInTheDocument();
  });
});
