import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";
import waitForNextTick from "../../__tests__/__helpers__/waitForNextTick";

import MobileFilters, { MobileFiltersProps } from "./MobileFilters";

const testProps: MobileFiltersProps = {
  page: "webinars-index",
  withBackButton: true,
  children: "",
  label: "Categories",
};

const render = renderWithProviders();

describe("components/MobileFilters", () => {
  test("it renders all blogs button and has focus", async () => {
    const { getByText } = render(<MobileFilters {...testProps} />);
    const user = userEvent.setup();

    const allBlogs = getByText("All webinars").closest("a");

    await user.tab();
    expect(allBlogs).toHaveFocus();
  });

  test("it hides all blogs button when categories is clicked", async () => {
    const { getByText } = render(<MobileFilters {...testProps} />);
    const user = userEvent.setup();

    const allBlogsContainer = getByText("All webinars").closest("div");

    await user.tab();
    await user.tab();
    await user.keyboard("{Enter}");

    await waitForNextTick();

    expect(allBlogsContainer).toHaveStyle(`visibility: hidden`);
  });
});
