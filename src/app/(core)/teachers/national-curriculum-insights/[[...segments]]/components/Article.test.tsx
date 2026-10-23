import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OakHeading, OakP } from "@oaknational/oak-components";

import { NationalCurriculumInsightsArticle } from "./Article";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { nationalCurriculumInsightsOpenDownloadEvent } from "@/common-lib/urls/nationalCurriculumInsightsDownload";

const sections = [
  {
    id: "changed",
    label: "What's changed",
    content: (
      <>
        <OakHeading tag="h2">Curriculum changes</OakHeading>
        <OakP>Changes and explanations.</OakP>
      </>
    ),
  },
  {
    id: "teacher",
    label: "Teacher checklist",
    content: (
      <>
        <OakHeading tag="h2">Actions for teachers</OakHeading>
        <OakP>Plan and check the sequence.</OakP>
      </>
    ),
  },
];

afterEach(() =>
  window.history.replaceState(
    window.history.state,
    "",
    window.location.pathname,
  ),
);

describe("the complete Insights article navigation", () => {
  it("moves keyboard focus to the chosen section and respects reduced motion", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <NationalCurriculumInsightsArticle
        heading="KS1 History"
        sections={sections}
        hasDownload
      />,
    );
    const scrollTo = jest
      .spyOn(window, "scrollTo")
      .mockImplementation(() => {});
    jest
      .spyOn(window, "matchMedia")
      .mockReturnValue({ matches: true } as MediaQueryList);

    screen.getByRole("link", { name: "Teacher checklist" }).focus();
    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("heading", { name: "Actions for teachers" }),
    ).toHaveFocus();
    expect(scrollTo).toHaveBeenCalledWith({
      behavior: "auto",
      top: 0,
    });
    expect(window.location.hash).toBe("#teacher");
  });

  it("passes the originating button to the shared picker without changing subjects", () => {
    const listener = jest.fn();
    window.addEventListener(
      nationalCurriculumInsightsOpenDownloadEvent,
      listener,
    );
    renderWithTheme(
      <NationalCurriculumInsightsArticle
        heading="Primary History"
        sections={sections}
        hasDownload
      />,
    );
    const button = screen.getByRole("button", {
      name: "Download this guidance",
    });
    fireEvent.click(button);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0]![0].detail.returnFocusTo).toBe(button);
    window.removeEventListener(
      nationalCurriculumInsightsOpenDownloadEvent,
      listener,
    );
  });

  it("omits the download action when no downloadable catalogue is available", () => {
    renderWithTheme(
      <NationalCurriculumInsightsArticle
        heading="KS1 History"
        sections={sections}
        hasDownload={false}
      />,
    );
    expect(
      screen.queryByRole("button", { name: "Download this guidance" }),
    ).not.toBeInTheDocument();
  });
});
