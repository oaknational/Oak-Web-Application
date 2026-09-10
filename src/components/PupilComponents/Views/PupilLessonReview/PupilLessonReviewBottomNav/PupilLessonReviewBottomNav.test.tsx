import { PupilLessonReviewBottomNav } from "./PupilLessonReviewBottomNav";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonReviewBottomNav", () => {
  it("renders a link when a href is provided", () => {
    const { container } = render(
      <PupilLessonReviewBottomNav href="/lessons" label="All lessons" />,
    );

    expect(container).toHaveTextContent("All lessons");
    expect(container.querySelector("a")).toHaveAttribute("href", "/lessons");
  });

  it("does not render without a href", () => {
    const { container } = render(<PupilLessonReviewBottomNav />);

    expect(container).toBeEmptyDOMElement();
  });
});
