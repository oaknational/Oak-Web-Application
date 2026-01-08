import React from "react";
import { screen } from "@testing-library/react";

import Layout from "./layout";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const providerSpy = jest.fn();
const useSearchParamsMock = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => useSearchParamsMock(),
}));

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  OakGoogleClassroomProvider: (props: never) => {
    providerSpy(props);
    const { children } = props;
    return <div data-testid="provider">{children}</div>;
  },
}));

describe("src/app/classroom/layout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSearchParamsMock.mockReturnValue(new URLSearchParams(""));
  });

  it("injects query params into the provider", () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams("courseId=course-1&itemId=item-1&addOnToken=token-1"),
    );

    renderWithTheme(
      <Layout>
        <div>Child content</div>
      </Layout>,
    );

    expect(providerSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        courseId: "course-1",
        itemId: "item-1",
        addOnToken: "token-1",
      }),
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("defaults missing params to empty strings", () => {
    renderWithTheme(
      <Layout>
        <div>Fallback child</div>
      </Layout>,
    );

    expect(providerSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        courseId: "",
        itemId: "",
        addOnToken: "",
      }),
    );
    expect(screen.getByText("Fallback child")).toBeInTheDocument();
  });
});
