/**
 * @jest-environment jsdom
 */
import TeachWithOakPage from "./page";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  }),
  usePathname: jest.fn(),
}));

jest.mock("@/hocs/withPageErrorHandling", () => ({
  __esModule: true,
  default: (Page: unknown) => Page,
}));

jest.mock("./components/TeachWithOakView", () => ({
  TeachWithOakView: ({ backToLessonLink }: { backToLessonLink?: string }) => (
    <div data-testid="teach-with-oak-view">{backToLessonLink}</div>
  ),
}));

const renderPage = () => renderWithProviders()(TeachWithOakPage());

describe("Teach with Oak page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the view inside the teach-with-oak analytics context", () => {
    const { getByTestId } = renderPage();

    expect(getByTestId("teach-with-oak-view")).toBeInTheDocument();
  });
});
