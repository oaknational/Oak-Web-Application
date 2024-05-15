import { render } from "@testing-library/react";

import {
  BrowseExamboardSelector,
  ExamboardData,
} from "./BrowseExamboardSelector";

import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";


describe("BrowseExamboardSelector", () => {
  const examboards: ExamboardData[] = [
    { examboard: "AQA", examboardSlug: "aqa", examboardDisplayOrder: 1 },
    {
      examboard: "Edexcel",
      examboardSlug: "edexcel",
      examboardDisplayOrder: 2,
    },
    { examboard: "OCR", examboardSlug: "ocr", examboardDisplayOrder: 3 },
  ];

  it("should render", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseExamboardSelector
          examboards={examboards}
          baseSlug="my-subject"
          isLegacy={false}
          phaseSlug="secondary"
        />
      </OakThemeProvider>,
    );
  });

  it("should render buttons when onClick is provided", () => {
    const { getByRole } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseExamboardSelector
          examboards={examboards}
          onClick={() => {}}
          isLegacy={false}
          phaseSlug="secondary"
        />
      </OakThemeProvider>,
    );

    for (const e of examboards) {
      const button = getByRole("button", { name: e.examboard ?? "" });
      expect(button).toBeInTheDocument();
    }
  });

  it("should render links when baseSlug is provided", () => {
    const { getByRole } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseExamboardSelector
          examboards={examboards}
          baseSlug="my-subject"
          isLegacy={false}
          phaseSlug="secondary"
        />
      </OakThemeProvider>,
    );

    for (const e of examboards) {
      const button = getByRole("link", { name: e.examboard ?? "" });
      expect(button).toBeInTheDocument();
    }
  });

  it("should render legacy links when baseSlug and isLegacy are provided", () => {
    const { getByRole } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseExamboardSelector
          examboards={examboards}
          baseSlug="my-subject"
          isLegacy={true}
          phaseSlug="secondary"
        />
      </OakThemeProvider>,
    );

    for (const e of examboards) {
      const button = getByRole("link", { name: e.examboard ?? "" });
      expect(button.getAttribute("href")).toBe(
        `/pupils/beta/programmes/my-subject-${e.examboardSlug}-l/units`,
      );
    }
  });
});
