import { act } from "@testing-library/react";

import CurriculumTab from "./CurriculumTab";

import { subjectPhaseOptions } from "@/utils/curriculum/fixtures";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

window.matchMedia = () => ({ matches: true }) as unknown as MediaQueryList;

const render = renderWithProviders();

describe("CurriculumTab", () => {
  test("renders", () => {
    const { baseElement } = render(
      <CurriculumTab
        subjectPhaseOptions={{
          subjects: subjectPhaseOptions.options,
        }}
      />,
    );
    expect(baseElement).toMatchSnapshot();
  });

  // Note we don't have to do a full interactivity test here
  // as the <SubjectPhasePicker/> is tested elsewhere.
  test("interactive", () => {
    const { getAllByTestId, getByTestId } = render(
      <CurriculumTab
        subjectPhaseOptions={{
          subjects: subjectPhaseOptions.options,
        }}
      />,
    );

    act(() => {
      getAllByTestId("subject-picker-button")[0]?.click();
    });
    expect(getByTestId("close-modal-button"));
  });
});
