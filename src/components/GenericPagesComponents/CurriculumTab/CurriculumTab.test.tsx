import { act } from "@testing-library/react";

import CurriculumTab from "./CurriculumTab";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

window.matchMedia = () => ({ matches: true }) as unknown as MediaQueryList;

const render = renderWithProviders();

const mockCurriculumPhaseOptionsData = [
  {
    title: "Physical education",
    slug: "physical-education",
    phases: [
      {
        slug: "primary",
        title: "Primary",
      },
      {
        slug: "secondary",
        title: "Secondary",
      },
    ],
    keystages: [
      {
        slug: "ks1",
        title: "Key Stage 1",
      },
      {
        slug: "ks2",
        title: "Key Stage 2",
      },
      {
        slug: "ks3",
        title: "Key Stage 3",
      },
      {
        slug: "ks4",
        title: "Key Stage 4",
      },
    ],
    ks4_options: [
      {
        slug: "aqa",
        title: "AQA",
      },
      {
        slug: "core",
        title: "Core",
      },
      {
        slug: "edexcel",
        title: "Edexcel",
      },
      {
        slug: "gcse",
        title: "GCSE",
      },
      {
        slug: "ocr",
        title: "OCR",
      },
    ],
  },
  {
    title: "Maths",
    slug: "maths",
    phases: [
      {
        slug: "primary",
        title: "Primary",
      },
      {
        slug: "secondary",
        title: "Secondary",
      },
    ],
    keystages: [
      {
        slug: "ks1",
        title: "Key Stage 1",
      },
      {
        slug: "ks2",
        title: "Key Stage 2",
      },
      {
        slug: "ks3",
        title: "Key Stage 3",
      },
      {
        slug: "ks4",
        title: "Key Stage 4",
      },
    ],
    ks4_options: [],
  },
];

describe("CurriculumTab", () => {
  test("renders", () => {
    const { baseElement } = render(
      <CurriculumTab
        curriculumPhaseOptions={{
          subjects: mockCurriculumPhaseOptionsData,
          tab: "units",
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
        curriculumPhaseOptions={{
          subjects: mockCurriculumPhaseOptionsData,
          tab: "units",
        }}
      />,
    );

    act(() => {
      getAllByTestId("subject-picker-button")[0]?.click();
    });
    expect(getByTestId("close-modal-button")).toBeTruthy();
  });
});
