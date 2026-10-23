import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { NationalCurriculumInsightsChecklist } from "./Checklist";

import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { nationalCurriculumInsightsModuleSchema } from "@/common-lib/cms-types/nationalCurriculumInsights";
import { nationalCurriculumInsightsOpenDownloadEvent } from "@/common-lib/urls/nationalCurriculumInsightsDownload";

const section = {
  __typename: "NationalCurriculumInsightsChecklistSection" as const,
  audience: "teacher" as const,
  heading: "Teacher checklist",
  items: ["Review the topics.", "Plan a timeline."].map((text, index) => ({
    id: `action-${index}`,
    contentPortableText: [
      {
        _type: "block",
        _key: "content",
        style: "normal",
        markDefs: [],
        children: [{ _type: "span", _key: "text", text, marks: [] }],
      },
    ],
  })),
};

it("renders every action as a semantic list and decorates it with the template's tick", () => {
  renderWithTheme(
    <NationalCurriculumInsightsChecklist
      section={section}
      variant="keyStage"
    />,
  );
  const region = screen.getByRole("region", { name: "Teacher checklist" });
  expect(
    within(region)
      .getAllByRole("listitem")
      .map((item) => item.textContent),
  ).toEqual(["Review the topics.", "Plan a timeline."]);
  expect(within(region).queryByRole("checkbox")).not.toBeInTheDocument();
  const illustrations = Array.from(region.querySelectorAll("li img"));
  expect(
    illustrations.map(
      (image) =>
        new URL((image as HTMLImageElement).src).searchParams.get("url") ??
        new URL((image as HTMLImageElement).src).href,
    ),
  ).toEqual([
    new URL(
      getCloudinaryImageUrl("svg-illustrations/checklist-tick-key-stage.svg"),
    ).href,
    new URL(
      getCloudinaryImageUrl("svg-illustrations/checklist-tick-key-stage.svg"),
    ).href,
  ]);
  illustrations.forEach((image) => expect(image).toHaveAttribute("alt", ""));
});

it("opens the shared download panel and carries its return-focus target", async () => {
  const user = userEvent.setup();
  const onOpen = jest.fn();
  window.addEventListener(nationalCurriculumInsightsOpenDownloadEvent, onOpen);
  try {
    renderWithTheme(<NationalCurriculumInsightsChecklist section={section} />);
    const button = screen.getByRole("button", {
      name: "Download this checklist",
    });
    await user.click(button);
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect((onOpen.mock.calls[0]![0] as CustomEvent).detail.returnFocusTo).toBe(
      button,
    );
  } finally {
    window.removeEventListener(
      nationalCurriculumInsightsOpenDownloadEvent,
      onOpen,
    );
  }
});

it("rejects empty actions, duplicate IDs and invalid audiences", () => {
  expect(
    nationalCurriculumInsightsModuleSchema.safeParse(section).success,
  ).toBe(true);
  for (const value of [
    { ...section, items: [] },
    { ...section, items: [section.items[0], section.items[0]] },
    { ...section, audience: "unknown" },
    { ...section, items: [{ id: "empty", contentPortableText: [] }] },
  ])
    expect(
      nationalCurriculumInsightsModuleSchema.safeParse(value).success,
    ).toBe(false);
});
