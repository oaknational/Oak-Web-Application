import { screen } from "@testing-library/react";

import CurriculumHomePage, {
  CurriculumHomePageProps,
} from "@/pages/teachers/curriculum";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import curriculumPhaseOptions from "@/browser-lib/fixtures/curriculumPhaseOptions";
import SubjectPhasePicker from "@/components/SharedComponents/SubjectPhasePicker";
import { CurriculumPhaseOptions } from "@/node-lib/curriculum-api-2023";
import { filterValidCurriculumPhaseOptions } from "@/pages-helpers/curriculum/docx/tab-helpers";

const render = renderWithProviders();

const props: CurriculumHomePageProps = {
  curriculumPhaseOptions: curriculumPhaseOptions,
};

jest.mock(
  "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker",
  () => {
    return jest.fn(() => <div>Mock SubjectPhasePicker</div>);
  },
);

describe("pages/curriculum/index", () => {
  it("Renders correct title", () => {
    render(<CurriculumHomePage {...props} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Oak's curricula" }),
    ).toBeInTheDocument();
  });

  it("passes correct props to SubjectPhasePicker", () => {
    render(<CurriculumHomePage {...props} />);
    expect(SubjectPhasePicker).toHaveBeenCalledWith(
      props.curriculumPhaseOptions,
      expect.anything(),
    );
  });

  describe("filterValidCurriculumPhaseOptions", () => {
    it("returns the same options when no filters apply (only examboards)", () => {
      const options = [
        {
          title: "English",
          phases: [],
          keystages: [],
          ks4_options: [
            { title: "OCR", slug: "ocr" },
            { title: "Edexcel", slug: "edexcel" },
          ],
          slug: "english",
        },
      ] as CurriculumPhaseOptions;
      expect(filterValidCurriculumPhaseOptions(options)).toBe(options);
    });

    it("returns the same options when no filters apply (core & gcse)", () => {
      const options = [
        {
          title: "English",
          phases: [],
          keystages: [],
          ks4_options: [
            { title: "Core", slug: "core" },
            { title: "GCSE", slug: "gcse" },
          ],
          slug: "english",
        },
      ] as CurriculumPhaseOptions;
      expect(filterValidCurriculumPhaseOptions(options)).toBe(options);
    });

    it("returns no options when none are present", () => {
      const options = [
        {
          title: "English",
          phases: [],
          keystages: [],
          ks4_options: [],
          slug: "english",
        },
      ] as CurriculumPhaseOptions;
      expect(filterValidCurriculumPhaseOptions(options)).toBe(options);
    });

    it("returns filtered options when gcse is present", () => {
      const options = [
        {
          title: "English",
          phases: [],
          keystages: [],
          ks4_options: [
            { title: "Core", slug: "core" },
            { title: "GCSE", slug: "gcse" },
            { title: "OCR", slug: "ocr" },
            { title: "Edexcel", slug: "edexcel" },
          ],
          slug: "english",
        },
      ] as CurriculumPhaseOptions;
      expect(filterValidCurriculumPhaseOptions(options)).toEqual([
        {
          title: "English",
          phases: [],
          keystages: [],
          ks4_options: [
            { title: "Core", slug: "core" },
            { title: "OCR", slug: "ocr" },
            { title: "Edexcel", slug: "edexcel" },
          ],
          slug: "english",
        },
      ] as CurriculumPhaseOptions);
    });
  });
});
