import Home from "@/pages/index";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { SerializedPost } from "@/pages-helpers/homesite/getBlogPosts";
import { TeachersHomePageProps } from "@/pages/teachers";
import keyStageKeypad from "@/browser-lib/fixtures/keyStageKeypad";
const render = renderWithProviders();

export const mockPosts = [
  {
    id: "1",
    type: "blog-post",
    title: "Some blog post",
    slug: "some-blog-post",
    date: new Date("2021-12-01").toISOString(),
    category: { title: "Some category", slug: "some-category" },
  },
  {
    id: "2",
    type: "blog-post",
    title: "Some other post",
    slug: "some-other-post",
    date: new Date("2021-12-01").toISOString(),
    category: { title: "Some category", slug: "some-category" },
  },
] as SerializedPost[];

const props: TeachersHomePageProps = {
  pageData: {
    heading: "",
    id: "",
    summaryPortableText: [],
    notification: { enabled: false },
    sidebarCard1: { title: "", bodyPortableText: [] },
    sidebarCard2: { title: "", bodyPortableText: [] },
  },
  posts: mockPosts,
  curriculumData: {
    keyStages: keyStageKeypad.keyStages,
  },
};

describe("Root Home Page: Home", () => {
  it("renders", () => {
    render(<Home {...props} />);
  });

  it("redirects to /ai when the path includes #ai", () => {
    // TODO: mock the href of window.location
    render(<Home {...props} />);
    // TODO: expect useRouter.push to have been called with "/ai"
  });
});
