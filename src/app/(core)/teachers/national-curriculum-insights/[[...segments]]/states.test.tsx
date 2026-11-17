import { screen } from "@testing-library/react";

import NationalCurriculumInsightsNotFound from "./not-found";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const replace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("National Curriculum Insights route states", () => {
  it("sends unavailable insights to the standard Oak 404 page", () => {
    renderWithTheme(<NationalCurriculumInsightsNotFound />);

    expect(replace).toHaveBeenCalledWith("/404");
    expect(screen.queryByText(/published catalogue/i)).not.toBeInTheDocument();
  });
});
