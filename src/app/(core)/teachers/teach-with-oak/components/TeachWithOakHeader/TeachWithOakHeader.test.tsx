import { TeachWithOakHeader } from "./TeachWithOakHeader";

import MockedAnalyticsProvider from "@/__tests__/__helpers__/MockedAnalyticsProvider";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("TeachWithOakHeader", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole } = render(
      <MockedAnalyticsProvider>
        <TeachWithOakHeader href={"/"} />
      </MockedAnalyticsProvider>,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading")).toHaveTextContent(
      "The thinking behind Oak lessons",
    );
    expect(baseElement).toHaveTextContent(
      "See how our lessons are designed to support learning - and make the most of them in your classroom.",
    );
  });
});
