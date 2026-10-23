import { useId } from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "jest-styled-components";

import { NationalCurriculumInsightsChanges } from "./Changes";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { nationalCurriculumInsightsModuleSchema } from "@/common-lib/cms-types/nationalCurriculumInsights";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: jest.fn(jest.requireActual("react").useId),
}));

const detail = (text: string) => [
  {
    _type: "block",
    _key: "paragraph",
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: "text", text, marks: [] }],
  },
];
const section = {
  __typename: "NationalCurriculumInsightsChangesSection" as const,
  heading: "What's changed in KS1 history?",
  changes: [
    {
      id: "history",
      title: "History has a separate entitlement",
      whyItMatters: "Plan identifiable historical knowledge.",
      detailPortableText: detail("Review the existing topics."),
    },
    {
      id: "chronology",
      title: "Chronology is a named expectation",
      whyItMatters: "Plan timelines across the year.",
      detailPortableText: detail("Build on earlier units."),
    },
  ],
};

describe("Curriculum changes", () => {
  it("keeps square corners on the highlighted titles", () => {
    renderWithTheme(<NationalCurriculumInsightsChanges section={section} />);
    for (const change of section.changes) {
      expect(
        screen.getByRole("heading", { level: 3, name: change.title })
          .parentElement,
      ).not.toHaveStyleRule("border-radius", "0.25rem");
    }
  });

  it("uses one leading rule and separates the header and detail with tokens", () => {
    renderWithTheme(<NationalCurriculumInsightsChanges section={section} />);
    const first = screen.getByRole("button", {
      name: new RegExp(section.changes[0]!.whyItMatters),
    });
    const second = screen.getByRole("button", {
      name: new RegExp(section.changes[1]!.whyItMatters),
    });
    for (const control of [first, second]) {
      expect(control).toHaveStyleRule("padding", "0rem");
      expect(control).toHaveStyleRule("border", "0rem solid");
      const group = control.parentElement!.parentElement!;
      expect(group).toHaveStyleRule("gap", "0.75rem");
      expect(group.children).toHaveLength(3);
      expect(group.firstElementChild).toHaveStyleRule("height", "0.125rem");
      expect(group.firstElementChild?.querySelector("svg")).not.toBeNull();
      const region = document.getElementById(
        control.getAttribute("aria-controls")!,
      );
      expect(group.lastElementChild).toBe(region);
      expect(region).toHaveAttribute("aria-labelledby", control.id);
    }
    expect(screen.getByText("Review the existing topics.")).toBeVisible();
    expect(
      document.getElementById(second.getAttribute("aria-controls")!),
    ).toHaveAttribute("hidden");
  });

  it("keeps each title and teaching implication visible and reveals details with the keyboard", async () => {
    const user = userEvent.setup();
    renderWithTheme(<NationalCurriculumInsightsChanges section={section} />);
    expect(
      screen.getByRole("heading", { level: 2, name: section.heading }),
    ).toBeVisible();
    const first = screen.getByRole("button", {
      name: new RegExp(section.changes[0]!.whyItMatters),
    });
    const second = screen.getByRole("button", {
      name: new RegExp(section.changes[1]!.whyItMatters),
    });
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(second).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Review the existing topics.")).toBeVisible();
    second.focus();
    await user.keyboard("{Enter}");
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Build on earlier units.")).toBeVisible();
    await user.click(first);
    expect(first).toHaveAttribute("aria-expanded", "false");
    first.focus();
    await user.keyboard(" ");
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Review the existing topics.")).toBeVisible();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: section.changes[0]!.title,
      }),
    ).toBeVisible();
    expect(first).toBeVisible();
  });

  it("gives repeated sections independent accessible control IDs", () => {
    jest
      .mocked(useId)
      .mockReturnValueOnce("first")
      .mockReturnValueOnce("second");
    renderWithTheme(
      <>
        <NationalCurriculumInsightsChanges section={section} />
        <NationalCurriculumInsightsChanges section={section} />
      </>,
    );
    const controls = screen
      .getAllByRole("button")
      .map((button) => button.getAttribute("id"));
    expect(new Set(controls).size).toBe(4);
    controls.forEach((id) =>
      expect(document.getElementById(id!)).toBeInTheDocument(),
    );
  });

  it("keeps links in the detail outside the disclosure button and hidden while closed", async () => {
    const user = userEvent.setup();
    const linked = {
      ...section,
      changes: section.changes.map((change, index) =>
        index === 1
          ? {
              ...change,
              detailPortableText: [
                {
                  _type: "block",
                  _key: "paragraph",
                  style: "normal",
                  markDefs: [
                    {
                      _key: "guidance",
                      _type: "internalLink",
                      reference: {
                        contentType: "newsPost",
                        slug: "curriculum-change",
                      },
                    },
                  ],
                  children: [
                    {
                      _type: "span",
                      _key: "text",
                      text: "Read the guidance",
                      marks: ["guidance"],
                    },
                  ],
                },
              ],
            }
          : change,
      ),
    };
    renderWithTheme(<NationalCurriculumInsightsChanges section={linked} />);
    const control = screen.getByRole("button", {
      name: section.changes[1]!.whyItMatters,
    });
    expect(
      screen.queryByRole("link", { name: "Read the guidance" }),
    ).not.toBeInTheDocument();
    await user.click(control);
    expect(
      screen.getByRole("link", { name: "Read the guidance" }),
    ).toHaveAttribute("href", "/blog/curriculum-change");
    expect(control.querySelector("a")).toBeNull();
    await user.click(control);
    expect(
      screen.queryByRole("link", { name: "Read the guidance" }),
    ).not.toBeInTheDocument();
  });

  it.each([0, 1, 7])("rejects %i changes", (count) => {
    expect(
      nationalCurriculumInsightsModuleSchema.safeParse({
        ...section,
        changes: Array.from({ length: count }, (_, index) => ({
          ...section.changes[0],
          id: String(index),
        })),
      }).success,
    ).toBe(false);
  });

  it("accepts six changes and rejects duplicate IDs and blank content", () => {
    expect(
      nationalCurriculumInsightsModuleSchema.safeParse({
        ...section,
        changes: Array.from({ length: 6 }, (_, index) => ({
          ...section.changes[0],
          id: String(index),
        })),
      }).success,
    ).toBe(true);
    expect(
      nationalCurriculumInsightsModuleSchema.safeParse({
        ...section,
        changes: [section.changes[0], section.changes[0]],
      }).success,
    ).toBe(false);
    expect(
      nationalCurriculumInsightsModuleSchema.safeParse({
        ...section,
        heading: " ",
      }).success,
    ).toBe(false);
    expect(
      nationalCurriculumInsightsModuleSchema.safeParse({
        ...section,
        changes: section.changes.map((change) => ({
          ...change,
          detailPortableText: detail(" "),
        })),
      }).success,
    ).toBe(false);
  });
});
