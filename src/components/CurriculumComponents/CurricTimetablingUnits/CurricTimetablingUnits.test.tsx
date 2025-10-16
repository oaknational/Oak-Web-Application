import { waitFor } from "@testing-library/dom";
import { act } from "@testing-library/react";

import { CurricTimetablingUnits } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { createUnit } from "@/fixtures/curriculum/unit";
import { fetchSubjectPhasePickerData } from "@/pages-helpers/curriculum/docx/tab-helpers";

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

const defaultCurriculumPhaseOptions: ReturnType<
  typeof fetchSubjectPhasePickerData
> = Promise.resolve({
  tab: "units",
  subjects: [
    {
      slug: "english",
      title: "English",
      phases: [],
      ks4_options: null,
    },
  ],
});

describe("CurricTimetablingUnits", () => {
  test("snapshot", () => {
    const { container } = renderWithTheme(
      <CurricTimetablingUnits
        units={[createUnit({ slug: "test-1" }), createUnit({ slug: "test-2" })]}
        subjectPhaseSlug={""}
        curriculumPhaseOptions={defaultCurriculumPhaseOptions}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  test("edit details", () => {
    const { getAllByRole, getByTestId } = renderWithTheme(
      <CurricTimetablingUnits
        units={[createUnit({ slug: "test-1" }), createUnit({ slug: "test-2" })]}
        subjectPhaseSlug={""}
        curriculumPhaseOptions={defaultCurriculumPhaseOptions}
      />,
    );
    const els = getAllByRole("button");
    expect(els[0]).toHaveTextContent("Edit details");

    act(() => {
      els[0]!.click();
    });

    waitFor(() => {
      expect(getByTestId("edit-details-modal")).toBeTruthy();
    });
  });

  test("copy link", () => {
    const { getAllByRole } = renderWithTheme(
      <CurricTimetablingUnits
        units={[createUnit({ slug: "test-1" }), createUnit({ slug: "test-2" })]}
        subjectPhaseSlug={""}
        curriculumPhaseOptions={defaultCurriculumPhaseOptions}
      />,
    );
    const els = getAllByRole("button");
    expect(els[1]).toHaveTextContent("Copy link");

    act(() => {
      els[1]!.click();
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
