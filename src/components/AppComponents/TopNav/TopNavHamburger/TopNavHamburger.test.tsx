import { act } from "@testing-library/react";

import { getEYFSAriaLabel, TopNavHamburger } from "./TopNavHamburger";

import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const mockTopNavProps: TopNavProps = {
  teachers: {
    primary: {
      phaseTitle: "Primary",
      phaseSlug: "primary",
      keystages: [
        {
          title: "KS1",
          slug: "ks1",
          description: "Key Stage 1",
          subjects: [
            {
              title: "test-subject-1",
              nonCurriculum: false,
              programmeCount: 0,
              programmeSlug: "test-programme-slug-1",
              subjectSlug: "test-subject-slug-1",
            },
            {
              title: "test-subject-2",
              nonCurriculum: false,
              programmeCount: 0,
              programmeSlug: "test-programme-slug-2",
              subjectSlug: "test-subject-slug-2",
            },
            {
              title: "test-subject-3",
              nonCurriculum: false,
              programmeCount: 0,
              programmeSlug: "test-programme-slug-3",
              subjectSlug: "test-subject-slug-3",
            },
          ],
        },
        {
          title: "KS2",
          slug: "ks2",
          description: "Key Stage 2",
          subjects: [
            {
              title: "test-subject-1",
              nonCurriculum: false,
              programmeCount: 0,
              programmeSlug: "test-programme-slug-1",
              subjectSlug: "test-subject-slug-1",
            },
            {
              title: "test-subject-2",
              nonCurriculum: false,
              programmeCount: 0,
              programmeSlug: "test-programme-slug-2",
              subjectSlug: "test-subject-slug-2",
            },
            {
              title: "test-subject-3",
              nonCurriculum: false,
              programmeCount: 0,
              programmeSlug: "test-programme-slug-3",
              subjectSlug: "test-subject-slug-3",
            },
          ],
        },
        {
          title: "EYFS",
          slug: "eyfs",
          description: "Early Years Foundation Stage",
          subjects: [
            {
              title: "test-subject-1",
              nonCurriculum: false,
              programmeCount: 0,
              programmeSlug: "test-programme-slug-1",
              subjectSlug: "test-subject-slug-1",
            },
            {
              title: "test-subject-2",
              nonCurriculum: false,
              programmeCount: 0,
              programmeSlug: "test-programme-slug-2",
              subjectSlug: "test-subject-slug-2",
            },
            {
              title: "test-subject-3",
              nonCurriculum: false,
              programmeCount: 0,
              programmeSlug: "test-programme-slug-3",
              subjectSlug: "test-subject-slug-3",
            },
          ],
        },
      ],
    },
    secondary: {
      phaseTitle: "Secondary",
      phaseSlug: "secondary",
      keystages: [
        {
          title: "KS3",
          slug: "ks3",
          description: "Key Stage 3",
          subjects: [
            {
              title: "test-subject-1",
              nonCurriculum: false,
              programmeCount: 0,
              programmeSlug: "test-programme-slug-1",
              subjectSlug: "test-subject-slug-1",
            },
            {
              title: "test-subject-2",
              nonCurriculum: false,
              programmeCount: 0,
              programmeSlug: "test-programme-slug-2",
              subjectSlug: "test-subject-slug-2",
            },
            {
              title: "test-subject-3",
              nonCurriculum: false,
              programmeCount: 0,
              programmeSlug: "test-programme-slug-3",
              subjectSlug: "test-subject-slug-3",
            },
          ],
        },
        {
          title: "KS4",
          slug: "ks4",
          description: "Key Stage 4",
          subjects: [
            {
              title: "test-subject-1",
              nonCurriculum: false,
              programmeCount: 0,
              programmeSlug: "test-programme-slug-1",
              subjectSlug: "test-subject-slug-1",
            },
            {
              title: "test-subject-2",
              nonCurriculum: false,
              programmeCount: 0,
              programmeSlug: "test-programme-slug-2",
              subjectSlug: "test-subject-slug-2",
            },
            {
              title: "test-subject-3",
              nonCurriculum: false,
              programmeCount: 0,
              programmeSlug: "test-programme-slug-3",
              subjectSlug: "test-subject-slug-3",
            },
          ],
        },
      ],
    },
    aboutUs: [
      { title: "test-link-1", slug: "home" },
      { title: "test-link-2", slug: "home" },
      { title: "test-link-3", slug: "home" },
    ],
    guidance: [
      { title: "test-link-1", slug: "home" },
      { title: "test-link-2", slug: "home" },
      { title: "test-link-3", slug: "home" },
    ],
  },
  pupils: {
    primary: {
      phaseSlug: "primary",
      phaseTitle: "Primary",
      years: [{ slug: "year-1", title: "Year 1" }],
    },
    secondary: {
      phaseSlug: "secondary",
      phaseTitle: "Secondary",
      years: [{ slug: "year-1", title: "Year 1" }],
    },
  },
};

const render = renderWithProviders();

describe("TopNavHamburger", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component", () => {
    const { getByTestId } = render(<TopNavHamburger {...mockTopNavProps} />);
    expect(getByTestId("top-nav-hamburger-button")).toBeInTheDocument();
  });

  it("should display main menu content when no submenu is open", () => {
    const { getByTestId, getByText } = render(
      <TopNavHamburger {...mockTopNavProps} />,
    );
    const button = getByTestId("top-nav-hamburger-button");
    act(() => {
      button.click();
    });
    expect(getByText("Primary")).toBeInTheDocument();
  });

  it("should display submenu content when a submenu is opened", () => {
    const { getByTestId, getByText } = render(
      <TopNavHamburger {...mockTopNavProps} />,
    );
    const button = getByTestId("top-nav-hamburger-button");
    act(() => {
      button.click();
    });
    const keyStageItem = getByText("Key Stage 1");
    act(() => {
      keyStageItem.click();
    });
    expect(getByText("test-subject-1")).toBeInTheDocument();
  });

  it("should focus the first list item when submenu is opened", () => {
    const { getByTestId, getByText } = render(
      <TopNavHamburger {...mockTopNavProps} />,
    );
    const button = getByTestId("top-nav-hamburger-button");
    act(() => {
      button.click();
    });
    const keyStageItem = getByText("Key Stage 1");
    act(() => {
      keyStageItem.click();
    });
    const firstListItem = getByText("test-subject-1");
    expect(document?.activeElement?.textContent).toBe(
      firstListItem.textContent,
    );
  });

  it("should close submenu and return to main menu when back button is triggered", () => {
    const { getByTestId, getByText, queryByText } = render(
      <TopNavHamburger {...mockTopNavProps} />,
    );
    const button = getByTestId("top-nav-hamburger-button");
    act(() => {
      button.click();
    });
    const keyStageItem = getByText("Key Stage 1");
    act(() => {
      keyStageItem.click();
    });
    const backButton = getByText("KS1");
    act(() => {
      backButton.click();
    });
    expect(queryByText("test-subject-1")).not.toBeInTheDocument();
    expect(getByText("Primary")).toBeInTheDocument();
  });

  it("should focus the triggering element when returning to main menu from submenu", () => {
    const { getByTestId, getByText } = render(
      <TopNavHamburger {...mockTopNavProps} />,
    );
    const button = getByTestId("top-nav-hamburger-button");
    act(() => {
      button.click();
    });
    const keyStageItem = getByText("Key Stage 3");
    act(() => {
      keyStageItem.click();
    });
    const backButton = getByText("KS3");
    act(() => {
      backButton.click();
    });
    expect(document?.activeElement?.textContent).toBe(keyStageItem.textContent);
  });

  it("should reset all states when modal closes", () => {
    const { getByTestId, getByText, queryByText, getByLabelText } = render(
      <TopNavHamburger {...mockTopNavProps} />,
    );
    const button = getByTestId("top-nav-hamburger-button");
    act(() => {
      button.click();
    });
    const keyStageItem = getByText("Key Stage 2");
    act(() => {
      keyStageItem.click();
    });
    const closeButton = getByLabelText("Close");
    act(() => {
      closeButton.click();
    });
    act(() => {
      button.click();
    });
    expect(queryByText("test-subject-1")).not.toBeInTheDocument();
    expect(getByText("Primary")).toBeInTheDocument();
  });

  it('should return "Early years foundation stage" for EYFS title', () => {
    const ariaLabel = getEYFSAriaLabel("EYFS");
    expect(ariaLabel).toBe("Early years foundation stage");
  });
});
