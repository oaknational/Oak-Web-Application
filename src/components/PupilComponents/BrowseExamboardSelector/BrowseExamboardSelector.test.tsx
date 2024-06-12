import { render } from "@testing-library/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import {
  BrowseExamboardSelector,
  ExamboardData,
} from "./BrowseExamboardSelector";

describe("BrowseExamboardSelector", () => {
  const examboards: ExamboardData[] = [
    {
      examboard: "AQA",
      examboardSlug: "aqa",
      examboardDisplayOrder: 1,
      isLegacy: false,
    },
    {
      examboard: "Edexcel",
      examboardSlug: "edexcel",
      examboardDisplayOrder: 2,
      isLegacy: false,
    },
    {
      examboard: "OCR",
      examboardSlug: "ocr",
      examboardDisplayOrder: 3,
      isLegacy: true,
    },
  ];

  it("should render", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseExamboardSelector
          examboards={examboards}
          baseSlug="my-subject"
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
          phaseSlug="secondary"
        />
      </OakThemeProvider>,
    );

    for (const e of examboards) {
      const button = getByRole("link", { name: e.examboard ?? "" });
      expect(button.getAttribute("href")).toBe(
        `/pupils/programmes/my-subject-${e.examboardSlug}${
          e.isLegacy ? "-l" : ""
        }/units`,
      );
    }
  });
});
