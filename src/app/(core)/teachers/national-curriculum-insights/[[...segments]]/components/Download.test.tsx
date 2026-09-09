import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { localNationalCurriculumInsightsFixtures } from "../__fixtures__/nationalCurriculumInsights";
import { getNationalCurriculumInsightsRouteData } from "../helpers/getRouteData";

import { NationalCurriculumInsightsDownload } from "./Download";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { parseNationalCurriculumInsightsRoute } from "@/common-lib/urls/nationalCurriculumInsights";


const mockReportError = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: unknown[]) =>
      mockReportError(...args),
}));

const section = {
  __typename: "NationalCurriculumInsightsDownloadSection" as const,
  barHeading: "The national curriculum is changing.",
  barCtaLabel: "Download free expert guidance.",
  detailsHeading: "Your details",
  downloadsHeading: "The national curriculum is changing.",
  downloadsIntroduction:
    "Download free expert guidance for every national curriculum subject.",
  downloadButtonLabel: "Download",
};

const getData = async () => {
  const route = parseNationalCurriculumInsightsRoute(undefined);
  if (!route) throw new Error("Expected the hub route");
  const data = await getNationalCurriculumInsightsRouteData(route, {
    previewMode: false,
    reader: localNationalCurriculumInsightsFixtures.reader,
  });
  if (!data) throw new Error("Expected local Insights data");
  return data;
};

describe("NationalCurriculumInsightsDownload", () => {
  it("expands the green bar and switches between DOCX and ZIP labels", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <NationalCurriculumInsightsDownload
        data={await getData()}
        section={section}
      />,
    );

    const toggle = screen.getByRole("button", {
      name: /the national curriculum is changing/i,
    });
    const sectionElement = toggle.closest("section");
    expect(sectionElement).toHaveStyle({
      position: "fixed",
      inset: "auto 0 0",
      "flex-direction": "column",
    });
    expect(toggle).toHaveStyle("background: #b0e2de");
    expect(toggle).toHaveStyle("color: #222222");
    expect(screen.getByText("Download free expert guidance.")).toHaveStyle({
      fontWeight: "400",
    });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("combobox", {
        name: "Role (required)",
      }),
    ).toBeInTheDocument();

    const download = screen.getByRole("button", {
      name: "Download 0 insights (.DOCX)",
    });
    expect(download).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Select subjects" }));
    const scienceOptions = screen.getAllByRole("checkbox", { name: "Science" });
    const primary = scienceOptions.find(({ id }) =>
      id.includes("science:primary"),
    );
    const secondary = scienceOptions.find(({ id }) =>
      id.includes("science:secondary"),
    );
    if (!primary || !secondary) {
      throw new Error(
        `Expected Science options: ${scienceOptions.map(({ id }) => id).join(", ")}`,
      );
    }
    fireEvent.click(primary);
    await user.click(
      screen.getByTestId("curriculum-insights-subjects-mobile-confirm"),
    );
    expect(
      screen.getByRole("button", { name: "Download 1 insight (.DOCX)" }),
    ).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "1 selected" }));
    fireEvent.click(secondary);
    await user.click(
      screen.getByTestId("curriculum-insights-subjects-mobile-confirm"),
    );
    expect(
      screen.getByRole("button", { name: "Download 2 insights (.ZIP)" }),
    ).toBeDisabled();
  });

  it("keeps the download module in normal flow away from the hub", async () => {
    const data = await getData();
    data.route = {
      kind: "subject",
      subjectSlug: "science",
    };

    renderWithTheme(
      <NationalCurriculumInsightsDownload data={data} section={section} />,
    );

    const toggle = screen.getByRole("button", {
      name: /the national curriculum is changing/i,
    });
    expect(toggle.closest("section")).not.toHaveStyle({ position: "fixed" });
  });
});

describe("Insights download submission", () => {
  const mockFetch = jest.fn();
  const downloads: string[] = [];
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  const mockCreateObjectURL = jest.fn(() => "blob:insights-download");
  const mockRevokeObjectURL = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    downloads.length = 0;
    jest.spyOn(global, "fetch").mockImplementation(mockFetch);
    jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function (this: HTMLAnchorElement) {
        downloads.push(this.download);
      });
    URL.createObjectURL = mockCreateObjectURL;
    URL.revokeObjectURL = mockRevokeObjectURL;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  const readyForm = async (multiple = false) => {
    const user = userEvent.setup();
    renderWithTheme(
      <NationalCurriculumInsightsDownload
        data={await getData()}
        section={section}
      />,
    );
    await user.click(
      screen.getByRole("button", {
        name: /the national curriculum is changing/i,
      }),
    );
    await user.type(
      screen.getByRole("textbox", { name: "Name (required)" }),
      "Jamie",
    );
    await user.click(
      screen.getByRole("checkbox", { name: "My school isn't listed" }),
    );
    expect(
      screen.getByRole("textbox", { name: "School (required)" }),
    ).toBeDisabled();
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Role (required)" }),
      "Headteacher",
    );
    await user.click(
      screen.getByRole("checkbox", {
        name: "I accept the terms and conditions (required)",
      }),
    );
    await user.click(screen.getByRole("button", { name: "Select subjects" }));
    for (const phase of multiple ? ["primary", "secondary"] : ["primary"]) {
      const option = screen
        .getAllByRole("checkbox", { name: "Science" })
        .find(({ id }) => id.includes(`science:${phase}`));
      if (!option) throw new Error("Expected the science option");
      const label = option.closest("label");
      if (!label) throw new Error("Expected a subject checkbox label");
      await user.click(label);
    }
    await user.click(
      screen.getByTestId("curriculum-insights-subjects-mobile-confirm"),
    );
    const download = screen.getByRole("button", {
      name: multiple
        ? "Download 2 insights (.ZIP)"
        : "Download 1 insight (.DOCX)",
    });
    expect(download).toBeEnabled();
    return { user, download };
  };

  const downloadResponse = (filename: string) => ({
    ok: true,
    headers: new Headers({ "x-filename": filename }),
    blob: async () => new Blob(["download"]),
  });

  it("retains details, consent and selections when the panel is reopened", async () => {
    const { user } = await readyForm();
    await user.type(
      screen.getByRole("textbox", { name: "Email (Optional)" }),
      "teacher@example.com",
    );
    const toggle = screen.getByRole("button", {
      name: /the national curriculum is changing/i,
    });

    await user.click(toggle);
    expect(
      screen.queryByRole("textbox", { name: "Name (required)" }),
    ).not.toBeInTheDocument();
    await user.click(toggle);

    expect(
      screen.getByRole("textbox", { name: "Name (required)" }),
    ).toHaveValue("Jamie");
    expect(
      screen.getByRole("textbox", { name: "Email (Optional)" }),
    ).toHaveValue("teacher@example.com");
    expect(
      screen.getByRole("textbox", { name: "School (required)" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("checkbox", { name: "My school isn't listed" }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", {
        name: "I accept the terms and conditions (required)",
      }),
    ).toBeChecked();
    expect(
      screen.getByRole("combobox", { name: "Role (required)" }),
    ).toHaveValue("Headteacher");
    expect(
      screen.getByRole("button", { name: "Download 1 insight (.DOCX)" }),
    ).toBeEnabled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("does not download when a required detail is only whitespace", async () => {
    const { user, download } = await readyForm();
    const name = screen.getByRole("textbox", { name: "Name (required)" });
    await user.clear(name);
    await user.type(name, "   ");
    expect(download).toBeDisabled();
    const form = download.closest("form");
    if (!form) throw new Error("Expected the download form");
    fireEvent.submit(form);
    await waitFor(() => expect(download).toBeDisabled());
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it.each([false, true])(
    "downloads and cleans up the %s multi-document selection",
    async (multiple) => {
      const filename = multiple
        ? "Curriculum insights.zip"
        : "Science - primary.docx";
      mockFetch.mockResolvedValueOnce(downloadResponse(filename));
      const { user, download } = await readyForm(multiple);
      await user.click(download);
      await waitFor(() => expect(downloads).toEqual([filename]));
      expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
      expect(mockRevokeObjectURL).toHaveBeenCalledWith(
        "blob:insights-download",
      );
      expect(document.querySelector("a[download]")).not.toBeInTheDocument();
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/national-curriculum-insights/download?selection=science%3Aprimary${multiple ? "&selection=science%3Asecondary" : ""}`,
      );
      expect(download).toBeEnabled();
    },
  );

  it("disables the action and prevents duplicate submissions while preparing", async () => {
    let complete!: (response: ReturnType<typeof downloadResponse>) => void;
    mockFetch.mockReturnValueOnce(
      new Promise((resolve) => {
        complete = resolve;
      }),
    );
    const { user, download } = await readyForm();
    await user.dblClick(download);
    expect(
      screen.getByRole("button", { name: "Preparing download…" }),
    ).toBeDisabled();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    complete(downloadResponse("Science.docx"));
    await waitFor(() => expect(downloads).toEqual(["Science.docx"]));
    expect(download).toBeEnabled();
  });

  it("reports a network failure, retains the selection and allows retry", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Network unavailable"));
    const { user, download } = await readyForm();
    await user.click(download);
    expect(await screen.findByText("Network unavailable")).toBeInTheDocument();
    expect(mockReportError).toHaveBeenCalledTimes(1);
    expect(download).toBeEnabled();
    expect(mockCreateObjectURL).not.toHaveBeenCalled();
    mockFetch.mockResolvedValueOnce(downloadResponse("Science.docx"));
    await user.click(download);
    await waitFor(() => expect(downloads).toEqual(["Science.docx"]));
    expect(screen.queryByText("Network unavailable")).not.toBeInTheDocument();
  });

  it("shows a safe fallback when the failure response is not JSON", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => {
        throw new SyntaxError("Bad gateway");
      },
    });
    const { user, download } = await readyForm();
    await user.click(download);
    expect(
      await screen.findByText("The download could not be made."),
    ).toBeInTheDocument();
    expect(download).toBeEnabled();
    expect(downloads).toEqual([]);
  });
});
