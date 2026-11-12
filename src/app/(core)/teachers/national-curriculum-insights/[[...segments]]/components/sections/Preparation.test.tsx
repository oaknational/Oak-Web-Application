import { screen, within } from "@testing-library/react";
import "jest-styled-components";

import { NationalCurriculumInsightsPreparation } from "./Preparation";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { nationalCurriculumInsightsModuleSchema } from "@/common-lib/cms-types/nationalCurriculumInsights";

const section = {
  __typename: "NationalCurriculumInsightsPreparationSection" as const,
  heading: "3 steps to get ready",
  steps: [
    { id: "one", text: "Map the current curriculum." },
    { id: "two", text: "Plan the progression." },
    { id: "three", text: "Choose a local study." },
  ],
  attribution: "Emma McCrea",
  role: "Head of Curriculum Design",
  image: null,
};
it("renders all three statements in editorial order and identifies the expert", () => {
  const { container } = renderWithTheme(
    <NationalCurriculumInsightsPreparation
      section={section}
      variant="keyStage"
    />,
  );
  const statements = [...container.querySelectorAll("blockquote")];
  expect(statements).toHaveLength(3);
  section.steps.forEach((step, index) =>
    expect(
      within(statements[index]! as HTMLElement).getByText(step.text),
    ).toBeInTheDocument(),
  );
  expect(screen.getByText("Emma McCrea")).toBeInTheDocument();
  expect(screen.getByText("Head of Curriculum Design")).toBeInTheDocument();
});
it("keeps each statement in normal flow beside its quote bar", () => {
  renderWithTheme(<NationalCurriculumInsightsPreparation section={section} />);
  for (const step of section.steps) {
    expect(screen.getByText(step.text).parentElement).not.toHaveStyle({
      transform: "translateY(0.0625rem)",
    });
  }
});
it("rejects incomplete or blank preparation from CMS before it reaches the page", () => {
  expect(
    nationalCurriculumInsightsModuleSchema.safeParse(section).success,
  ).toBe(true);
  expect(
    nationalCurriculumInsightsModuleSchema.safeParse({
      ...section,
      steps: section.steps.slice(0, 2),
    }).success,
  ).toBe(false);
  expect(
    nationalCurriculumInsightsModuleSchema.safeParse({
      ...section,
      steps: [...section.steps.slice(0, 2), { id: "three", text: " " }],
    }).success,
  ).toBe(false);
});
