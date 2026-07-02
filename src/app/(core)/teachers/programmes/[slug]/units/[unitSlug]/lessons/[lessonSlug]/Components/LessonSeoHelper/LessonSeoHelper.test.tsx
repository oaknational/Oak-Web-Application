import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LessonSeoHelper } from "./LessonSeoHelper";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

const baseProps = {
  year: "Year 4",
  subject: "Science",
  subjectSlug: "science",
  parentSubject: null,
  phaseSlug: "primary",
  examBoardSlug: null,
  unit: "Forces",
  lesson: "Gravity",
  keystage: "Key stage 2",
  keystageSlug: "ks2",
  lessonSlug: "gravity",
  programmeSlug: "science-primary-ks2",
  unitSlug: "forces",
  geoRestricted: false,
  loginRequired: false,
};

const openAccordion = async () => {
  await userEvent.click(
    screen.getByRole("button", {
      name: /How to plan a lesson using our resources/,
    }),
  );
};

describe("LessonSeoHelper", () => {
  it("renders the accordion header", () => {
    render(<LessonSeoHelper {...baseProps} />);

    expect(
      screen.getByRole("heading", {
        name: "How to plan a lesson using our resources",
      }),
    ).toBeInTheDocument();
  });

  it("renders the SEO intro text with year, subject and lesson", () => {
    render(<LessonSeoHelper {...baseProps} />);

    expect(
      screen.getAllByText(
        /To help you plan your year 4 science lesson on: Gravity/,
      ).length,
    ).toBeGreaterThan(0);
  });

  it("renders the unit link", async () => {
    render(<LessonSeoHelper {...baseProps} />);
    await openAccordion();

    expect(
      screen.getByRole("link", { name: "Forces unit" }),
    ).toBeInTheDocument();
  });

  it("renders a pupil version link by default", async () => {
    render(<LessonSeoHelper {...baseProps} />);
    await openAccordion();

    expect(
      screen.getByRole("link", { name: "online pupil version" }),
    ).toBeInTheDocument();
  });

  it("hides the pupil version link when disablePupilLink is true", async () => {
    render(<LessonSeoHelper {...baseProps} disablePupilLink />);
    await openAccordion();

    expect(
      screen.queryByRole("link", { name: "online pupil version" }),
    ).not.toBeInTheDocument();
  });

  it("renders the lesson planning link", async () => {
    render(<LessonSeoHelper {...baseProps} />);
    await openAccordion();

    expect(
      screen.getByRole("link", { name: "lesson planning" }),
    ).toBeInTheDocument();
  });
});
