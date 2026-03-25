import React from "react";
import { screen } from "@testing-library/react";

import Layout from "./layout";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const providerSpy = jest.fn();
const useSearchParamsMock = jest.fn();
const usePathnameMock = jest.fn();
const classroomAddOnOpenedMock = jest.fn();

const googleClassroomAnalyticsMock = {
  trackAddOnOpened: classroomAddOnOpenedMock,
};

jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => useSearchParamsMock(),
  usePathname: () => usePathnameMock(),
}));

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  OakGoogleClassroomProvider: (props: never) => {
    providerSpy(props);
    const { children } = props;
    return <div data-testid="provider">{children}</div>;
  },
}));

jest.mock("@/components/GoogleClassroom/useGoogleClassroomAnalytics", () => ({
  __esModule: true,
  GoogleClassroomAnalyticsProvider: ({
    children,
  }: {
    children: React.ReactNode;
  }) => children,
  useGoogleClassroomAnalytics: (
    selector?: (state: typeof googleClassroomAnalyticsMock) => unknown,
  ) =>
    selector
      ? selector(googleClassroomAnalyticsMock)
      : googleClassroomAnalyticsMock,
}));

describe("src/app/classroom/layout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSearchParamsMock.mockReturnValue(new URLSearchParams(""));
    usePathnameMock.mockReturnValue("/classroom/browse");
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

  it("tracks classroomAddOnOpened for teacher classroom routes", () => {
    renderWithTheme(
      <Layout>
        <div>Teacher content</div>
      </Layout>,
    );

    expect(classroomAddOnOpenedMock).toHaveBeenCalledTimes(1);
    expect(classroomAddOnOpenedMock).toHaveBeenCalledWith({
      analyticsUseCase: "Teacher",
    });
  });

  it("does not track classroomAddOnOpened for pupil classroom routes", () => {
    usePathnameMock.mockReturnValue("/classroom/pupil/sign-in");

    renderWithTheme(
      <Layout>
        <div>Pupil content</div>
      </Layout>,
    );

    expect(classroomAddOnOpenedMock).not.toHaveBeenCalled();
  });
});
