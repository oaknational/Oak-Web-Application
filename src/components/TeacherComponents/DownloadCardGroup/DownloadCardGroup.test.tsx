import { useForm } from "react-hook-form";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";
import { renderHook } from "@testing-library/react";

import { ResourceFormProps } from "../types/downloadAndShare.types";

import DownloadCardGroup, { getGridArea } from "./DownloadCardGroup";

import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const mockDownloads: LessonDownloadsPageData["downloads"] = [
  {
    type: "worksheet-pdf",
    label: "Worksheet PDF",
    ext: "pdf",
    exists: true,
    forbidden: false,
  },
  {
    type: "presentation",
    label: "Presentation",
    ext: "pptx",
    exists: true,
    forbidden: false,
  },
];

jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useForm: jest.fn(() => ({
    control: {
      register: jest.fn(),
      unregister: jest.fn(),
      errors: {},
      setValue: jest.fn(),
      trigger: jest.fn(),
    },
  })),
}));

const render = renderWithProviders();

const mockAdditionalFiles: LessonDownloadsPageData["additionalFilesDownloads"] =
  [
    {
      type: "supplementary-pdf",
      label: "Supplementary PDF",
      ext: "pdf",
      exists: true,
      forbidden: false,
    },
  ];

const { control } = renderHook(() => useForm<ResourceFormProps>()).result
  .current;

describe("DownloadCardGroup component", () => {
  test.skip("", () => {
    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <DownloadCardGroup
          downloads={mockDownloads}
          additionalFiles={mockAdditionalFiles}
          triggerForm={() => {}}
          control={control}
        />
      </OakThemeProvider>,
    );
    expect(getByText("Worksheet PDF")).toBeInTheDocument();
  });
});

// test.only("renders DownloadCardGroup component", () => {
//   renderComponent();
//   expect(screen.getByTestId("download-card-worksheet-pdf")).toBeInTheDocument();
//   expect(screen.getByTestId("download-card-presentation")).toBeInTheDocument();
//   expect(
//     screen.getByTestId("additionalFile-card-supplementary-pdf"),
//   ).toBeInTheDocument();
// });

// test("handles checkbox change correctly", () => {
//   const triggerFormMock = jest.fn();
//   renderComponent({ triggerForm: triggerFormMock });

//   const worksheetCheckbox = screen
//     .getByTestId("download-card-worksheet-pdf")
//     .querySelector("input");
//   const presentationCheckbox = screen
//     .getByTestId("download-card-presentation")
//     .querySelector("input");

//   fireEvent.click(worksheetCheckbox);
//   expect(worksheetCheckbox).toBeChecked();
//   expect(triggerFormMock).toHaveBeenCalled();

//   fireEvent.click(presentationCheckbox);
//   expect(presentationCheckbox).toBeChecked();
//   expect(triggerFormMock).toHaveBeenCalled();

//   fireEvent.click(worksheetCheckbox);
//   expect(worksheetCheckbox).not.toBeChecked();
//   expect(triggerFormMock).toHaveBeenCalled();
// });

describe("getGridArea", () => {
  it("returns 'auto' for 'curriculum-pdf'", () => {
    expect(getGridArea("curriculum-pdf", true)).toBe("auto");
  });

  it("returns 'presentation' for 'lesson-guide'", () => {
    expect(getGridArea("lesson-guide", true)).toBe("presentation");
  });

  it("returns the type if it is not 'worksheet-pdf' or 'worksheet-pptx'", () => {
    expect(getGridArea("intro-quiz-questions", true)).toBe(
      "intro-quiz-questions",
    );
  });

  it("returns the type if worksheetsLength is 2", () => {
    expect(getGridArea("worksheet-pdf", true, 2)).toBe("worksheet-pdf");
  });

  it("returns the type if presentation does not exist", () => {
    expect(getGridArea("worksheet-pdf", false)).toBe("worksheet-pdf");
  });

  it("returns 'presentationOrWorksheet' if worksheetsLength is not 2 and presentation exists", () => {
    expect(getGridArea("worksheet-pdf", true, 1)).toBe(
      "presentationOrWorksheet",
    );
  });
});
