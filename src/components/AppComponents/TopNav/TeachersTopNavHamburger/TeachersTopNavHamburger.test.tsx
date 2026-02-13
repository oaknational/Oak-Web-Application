import { act } from "@testing-library/react";

import {
  getEYFSAriaLabel,
  TeachersTopNavHamburger,
} from "./TeachersTopNavHamburger";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { TeachersSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

const mockTopNavProps: TeachersSubNavData = {
  primary: {
    title: "Primary",
    slug: "primary",
    children: [
      {
        title: "KS1",
        slug: "ks1",
        description: "Key Stage 1",
        children: [
          {
            title: "test-subject-1",
            nonCurriculum: false,
            programmeCount: 0,
            programmeSlug: "test-programme-slug-1",
            slug: "test-subject-slug-1",
          },
          {
            title: "test-subject-2",
            nonCurriculum: false,
            programmeCount: 0,
            programmeSlug: "test-programme-slug-2",
            slug: "test-subject-slug-2",
          },
          {
            title: "test-subject-3",
            nonCurriculum: false,
            programmeCount: 0,
            programmeSlug: "test-programme-slug-3",
            slug: "test-subject-slug-3",
          },
        ],
      },
      {
        title: "KS2",
        slug: "ks2",
        description: "Key Stage 2",
        children: [
          {
            title: "test-subject-1",
            nonCurriculum: false,
            programmeCount: 0,
            programmeSlug: "test-programme-slug-1",
            slug: "test-subject-slug-1",
          },
          {
            title: "test-subject-2",
            nonCurriculum: false,
            programmeCount: 0,
            programmeSlug: "test-programme-slug-2",
            slug: "test-subject-slug-2",
          },
          {
            title: "test-subject-3",
            nonCurriculum: false,
            programmeCount: 0,
            programmeSlug: "test-programme-slug-3",
            slug: "test-subject-slug-3",
          },
        ],
      },
      {
        title: "EYFS",
        slug: "eyfs",
        description: "Early Years Foundation Stage",
        children: [
          {
            title: "test-subject-1",
            nonCurriculum: false,
            programmeCount: 0,
            programmeSlug: "test-programme-slug-1",
            slug: "test-subject-slug-1",
          },
          {
            title: "test-subject-2",
            nonCurriculum: false,
            programmeCount: 0,
            programmeSlug: "test-programme-slug-2",
            slug: "test-subject-slug-2",
          },
          {
            title: "test-subject-3",
            nonCurriculum: false,
            programmeCount: 0,
            programmeSlug: "test-programme-slug-3",
            slug: "test-subject-slug-3",
          },
        ],
      },
    ],
  },
  secondary: {
    title: "Secondary",
    slug: "secondary",
    children: [
      {
        title: "KS3",
        slug: "ks3",
        description: "Key Stage 3",
        children: [
          {
            title: "test-subject-1",
            nonCurriculum: false,
            programmeCount: 0,
            programmeSlug: "test-programme-slug-1",
            slug: "test-subject-slug-1",
          },
          {
            title: "test-subject-2",
            nonCurriculum: false,
            programmeCount: 0,
            programmeSlug: "test-programme-slug-2",
            slug: "test-subject-slug-2",
          },
          {
            title: "test-subject-3",
            nonCurriculum: false,
            programmeCount: 0,
            programmeSlug: "test-programme-slug-3",
            slug: "test-subject-slug-3",
          },
        ],
      },
      {
        title: "KS4",
        slug: "ks4",
        description: "Key Stage 4",
        children: [
          {
            title: "test-subject-1",
            nonCurriculum: false,
            programmeCount: 0,
            programmeSlug: "test-programme-slug-1",
            slug: "test-subject-slug-1",
          },
          {
            title: "test-subject-2",
            nonCurriculum: false,
            programmeCount: 0,
            programmeSlug: "test-programme-slug-2",
            slug: "test-subject-slug-2",
          },
          {
            title: "test-subject-3",
            nonCurriculum: false,
            programmeCount: 0,
            programmeSlug: "test-programme-slug-3",
            slug: "test-subject-slug-3",
          },
        ],
      },
    ],
  },
  curriculum: {
    title: "Curriculum",
    slug: "curriculum-landing-page",
  },
  aboutUs: {
    title: "About us",
    slug: "about-us",
    children: [
      { title: "test-link-1", slug: "home" },
      { title: "test-link-2", slug: "home" },
      { title: "test-link-3", slug: "home" },
    ],
  },
  guidance: {
    title: "Guidance",
    slug: "guidance",
    children: [
      { title: "test-link-1", slug: "home" },
      { title: "test-link-2", slug: "home" },
      { title: "test-link-3", slug: "home" },
    ],
  },
  aiExperiments: {
    title: "AI experiments",
    slug: "labs",
  },
};

const render = renderWithProviders();

describe("TeachersTopNavHamburger", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component", () => {
    const { getByTestId } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    expect(getByTestId("top-nav-hamburger-button")).toBeInTheDocument();
  });

  it("should display main menu content when no submenu is open", () => {
    const { getByTestId, getByText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const button = getByTestId("top-nav-hamburger-button");
    act(() => {
      button.click();
    });
    expect(getByText("Primary")).toBeInTheDocument();
  });

  it("should display submenu content when a submenu is opened", () => {
    const { getByTestId, getByText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
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
      <TeachersTopNavHamburger {...mockTopNavProps} />,
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
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const button = getByTestId("top-nav-hamburger-button");
    act(() => {
      button.click();
    });
    const keyStageItem = getByText("Key Stage 1");
    act(() => {
      keyStageItem.click();
    });
    const backButton = getByText("Key Stage 1");
    act(() => {
      backButton.click();
    });
    expect(queryByText("test-subject-1")).not.toBeInTheDocument();
    expect(getByText("Primary")).toBeInTheDocument();
  });

  it("should focus the triggering element when returning to main menu from submenu", () => {
    const { getByTestId, getByText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const button = getByTestId("top-nav-hamburger-button");
    act(() => {
      button.click();
    });
    const keyStageItem = getByText("Key Stage 3");
    act(() => {
      keyStageItem.click();
    });
    const backButton = getByText("Key Stage 3");
    act(() => {
      backButton.click();
    });
    expect(document?.activeElement?.textContent).toBe(keyStageItem.textContent);
  });

  it("should reset all states when modal closes", () => {
    const { getByTestId, getByText, queryByText, getByLabelText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
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

  it('should only return "Early years foundation stage" for EYFS title', () => {
    const EYFS = getEYFSAriaLabel("EYFS");
    const Ks1 = getEYFSAriaLabel("KS1");
    expect(EYFS).toBe("Early years foundation stage");
    expect(Ks1).toBeUndefined();
  });
});
