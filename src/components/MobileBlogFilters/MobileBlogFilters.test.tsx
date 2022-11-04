import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import MobileBlogFilters, { MobileBlogFiltersProps } from "./MobileBlogFilters";

const testProps: MobileBlogFiltersProps = {
  page: "webinars-index",
  withBackButton: true,
  categoryListProps: {
    categories: [
      {
        title: "Curriculum planning",
        slug: "curriculum-planning",
      },
      {
        title: "Lesson planning",
        slug: "lesson-planning",
      },
      {
        title: "Research and insights",
        slug: "research-and-insights",
      },
    ],
    selectedCategorySlug: "lesson-planning",
  },
};

describe("components/MobileBlogFilters", () => {
  test("it renders all blogs button and has focus", async () => {
    const { getByText } = renderWithProviders(
      <MobileBlogFilters {...testProps} />
    );
    const user = userEvent.setup();

    const allBlogs = getByText("All blogs").closest("a");

    await user.tab();
    expect(allBlogs).toHaveFocus();
    // const listHeading = getByRole("heading", { level: 6 });

    // expect(listHeading).toHaveTextContent("Item title");
  });

  test("it hides all blogs button when categories is clicked", async () => {
    const { getByText } = renderWithProviders(
      <MobileBlogFilters {...testProps} />
    );
    const user = userEvent.setup();

    const allBlogsContainer = getByText("All blogs").closest("div");

    await user.tab();
    await user.tab();
    await user.keyboard("{Enter}");
    expect(allBlogsContainer).toHaveStyle(`visibility: hidden`);
  });
});
