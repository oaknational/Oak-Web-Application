import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useSWR from "swr";

import { localNationalCurriculumInsightsFixtures } from "../__fixtures__/nationalCurriculumInsights";
import { getNationalCurriculumInsightsRouteData } from "../helpers/getRouteData";

import { NationalCurriculumInsightsDownload } from "./Download";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { parseNationalCurriculumInsightsRoute } from "@/common-lib/urls/nationalCurriculumInsights";
import { requestNationalCurriculumInsightsDownload } from "@/common-lib/urls/nationalCurriculumInsightsDownload";
import { LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION } from "@/config/localStorageKeys";

jest.mock("@/browser-lib/cookie-consent/consentClient", () => ({
  consentClient: { getConsent: jest.fn(() => "denied") },
}));

jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: [
      {
        urn: "101105",
        name: "Dorothy Bricks Nursery School",
        la: "Westminster",
        postcode: "AB1 1CD",
      },
    ],
    error: null,
  })),
}));

beforeEach(() => {
  window.sessionStorage.clear();
  window.localStorage.clear();
});

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
  it("starts with subject selection and labels the document count", async () => {
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
    expect(toggle.closest("section")).toHaveStyle({
      position: "fixed",
      bottom: "0rem",
    });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("form", { name: "Curriculum guidance download" }),
    ).toHaveFocus();
    expect(
      screen.queryByRole("textbox", { name: "Name (required)" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("curriculum-insights-subjects-mobile-confirm"),
    ).toBeDisabled();
    const scienceOptions = screen.getAllByRole("checkbox", {
      name: /^Science/,
    });
    const primary = scienceOptions.find(({ id }) =>
      id.includes("science:primary"),
    );
    const secondary = scienceOptions.find(({ id }) =>
      id.includes("science:secondary"),
    );
    if (!primary || !secondary) throw new Error("Expected both Science phases");
    fireEvent.click(primary);
    await user.click(
      screen.getByTestId("curriculum-insights-subjects-mobile-confirm"),
    );
    expect(
      screen.getByRole("textbox", { name: "Name (required)" }),
    ).toBeVisible();
    expect(screen.getByRole("radio", { name: "Headteacher" })).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Download 1 document (.DOCX)" }),
    ).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Back" }));
    fireEvent.click(secondary);
    await user.click(
      screen.getByTestId("curriculum-insights-subjects-mobile-confirm"),
    );
    expect(
      screen.getByRole("button", { name: "Download 2 documents (.DOCX)" }),
    ).toBeDisabled();
  });

  it("closes with Escape and returns focus without changing automatic choices", async () => {
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
    await user.click(toggle);
    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
    expect(
      window.localStorage.getItem(LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION),
    ).toBeNull();
  });

  it("has no Back button on the first sheet and closes with the header control", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <NationalCurriculumInsightsDownload
        data={await getData()}
        section={section}
      />,
    );
    const opener = screen.getByRole("button", {
      name: /the national curriculum is changing/i,
    });
    await user.click(opener);
    const dialog = screen.getByRole("dialog", {
      name: "Curriculum guidance download",
    });
    expect(
      within(dialog).queryByRole("button", { name: "Back" }),
    ).not.toBeInTheDocument();
    expect(
      within(dialog).queryByRole("button", { name: /\d+ selected/ }),
    ).not.toBeInTheDocument();
    await user.click(opener);
    expect(opener).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it("keeps the download panel open when Escape is handled by the role picker", async () => {
    const user = userEvent.setup();
    const { container } = renderWithTheme(
      <NationalCurriculumInsightsDownload
        data={await getData()}
        section={section}
      />,
    );
    const toggle = screen.getByRole("button", {
      name: /the national curriculum is changing/i,
    });
    await user.click(toggle);
    const role = container.querySelector('select[name="role"]');
    if (!role) throw new Error("Expected the role picker");
    fireEvent.keyDown(role, { key: "Escape" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(toggle, { key: "Escape" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("opens from a checklist on an insight page and preserves the exact manual selection", async () => {
    const user = userEvent.setup();
    const data = await getData();
    data.route = { kind: "subject", subjectSlug: "science" };
    const selected = ["science:primary", "science:secondary"];
    window.localStorage.setItem(
      LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION,
      JSON.stringify(selected),
    );
    renderWithTheme(
      <>
        <button
          onClick={(event) =>
            requestNationalCurriculumInsightsDownload(event.currentTarget)
          }
        >
          Download teacher checklist
        </button>
        <NationalCurriculumInsightsDownload data={data} section={section} />
      </>,
    );
    const trigger = screen.getByRole("button", {
      name: "Download teacher checklist",
    });
    await user.click(trigger);
    expect(
      screen.getByRole("dialog", { name: "Curriculum guidance download" }),
    ).toHaveStyle({ position: "fixed" });
    expect(
      screen.getByRole("form", { name: "Curriculum guidance download" }),
    ).toHaveFocus();
    expect(
      JSON.parse(
        window.localStorage.getItem(LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION)!,
      ),
    ).toEqual(selected);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(
      JSON.parse(
        window.localStorage.getItem(LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION)!,
      ),
    ).toEqual(selected);
  });

  it.each([
    { segments: undefined },
    { segments: ["guidance"] },
    { segments: ["science"] },
    { segments: ["science", "primary"] },
    { segments: ["science", "primary", "key-stage-1"] },
  ])(
    "keeps the download bar fixed before and after opening on $segments",
    async ({ segments }) => {
      const user = userEvent.setup();
      const data = await getData();
      const route = parseNationalCurriculumInsightsRoute(segments);
      if (!route) throw new Error("Expected a valid Insights route");
      data.route = route;

      renderWithTheme(
        <NationalCurriculumInsightsDownload data={data} section={section} />,
      );

      const toggle = screen.getByRole("button", {
        name: /the national curriculum is changing/i,
      });
      const downloadSection = toggle.closest("section");
      expect(downloadSection).toHaveStyle({
        position: "fixed",
        bottom: "0rem",
      });
      await user.click(toggle);
      expect(screen.getByRole("dialog")).toHaveStyle({
        position: "fixed",
        bottom: "0rem",
      });
      await user.keyboard("{Escape}");
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      expect(downloadSection).toHaveStyle({
        position: "fixed",
        bottom: "0rem",
      });
      expect(toggle).toHaveFocus();
    },
  );
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
    for (const phase of multiple ? ["primary", "secondary"] : ["primary"]) {
      const option = screen
        .getAllByRole("checkbox", { name: /^Science/ })
        .find(({ id }) => id.includes(`science:${phase}`));
      if (!option) throw new Error("Expected the science option");
      const label = option.closest("label");
      if (!label) throw new Error("Expected a subject checkbox label");
      await user.click(label);
    }
    await user.click(
      screen.getByTestId("curriculum-insights-subjects-mobile-confirm"),
    );
    await user.type(
      screen.getByRole("textbox", { name: "Name (required)" }),
      "Jamie",
    );
    await user.click(
      screen.getByRole("checkbox", { name: "My school isn't listed" }),
    );
    expect(screen.getByRole("combobox", { name: /^School/ })).toBeDisabled();
    await user.click(screen.getByRole("radio", { name: "Headteacher" }));
    await user.click(
      screen.getByRole("checkbox", {
        name: "I accept the terms and conditions (required)",
      }),
    );
    const download = screen.getByRole("button", {
      name: multiple
        ? "Download 2 documents (.DOCX)"
        : "Download 1 document (.DOCX)",
    });
    expect(download).toBeEnabled();
    return { user, download };
  };

  const downloadResponse = (filename: string) => ({
    ok: true,
    headers: new Headers({ "x-filename": filename }),
    blob: async () => new Blob(["download"]),
  });

  it.each<{ headers: Record<string, string>; filename: string }>([
    {
      headers: { "content-disposition": 'attachment; filename="Science.docx"' },
      filename: "Science.docx",
    },
    {
      headers: { "content-disposition": "attachment" },
      filename: "Curriculum insights",
    },
    { headers: {}, filename: "Curriculum insights" },
  ])(
    "uses the available response filename: $filename",
    async ({ headers, filename }) => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers(headers),
        blob: async () => new Blob(["download"]),
      });
      const { user, download } = await readyForm();
      await user.click(download);
      await waitFor(() => expect(downloads).toEqual([filename]));
    },
  );

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
    await user.click(
      screen.getByTestId("curriculum-insights-subjects-mobile-confirm"),
    );

    expect(
      screen.getByRole("textbox", { name: "Name (required)" }),
    ).toHaveValue("Jamie");
    expect(
      screen.getByRole("textbox", { name: "Email (Optional)" }),
    ).toHaveValue("teacher@example.com");
    expect(screen.getByRole("combobox", { name: /^School/ })).toBeDisabled();
    expect(
      screen.getByRole("checkbox", { name: "My school isn't listed" }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", {
        name: "I accept the terms and conditions (required)",
      }),
    ).toBeChecked();
    expect(screen.getByRole("radio", { name: "Headteacher" })).toBeChecked();
    expect(
      screen.getByRole("button", { name: "Download 1 document (.DOCX)" }),
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
    "shows confirmation and clears the saved %s multi-document selection",
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
      expect(download).not.toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Thanks for downloading!" }),
      ).toBeVisible();
      expect(
        window.localStorage.getItem(LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION),
      ).toBeNull();
      await user.click(
        screen.getByRole("button", {
          name: /the national curriculum is changing/i,
        }),
      );
      await user.click(
        screen.getByRole("button", {
          name: /the national curriculum is changing/i,
        }),
      );
      expect(
        screen.getByTestId("curriculum-insights-subjects-mobile-confirm"),
      ).toBeDisabled();
    },
  );

  it("offers school search, homeschool and the not-listed option", async () => {
    const { user, download } = await readyForm();
    await user.click(
      screen.getByRole("checkbox", { name: "My school isn't listed" }),
    );
    const school = screen.getByRole("combobox", { name: "School (required)" });
    expect(download).toBeDisabled();
    await user.type(school, "Dorothy");
    expect(useSWR).toHaveBeenCalledWith(
      "https://school-picker.thenational.academy/Dorothy",
      expect.any(Function),
    );
    const result = await screen.findByTestId("listbox-option");
    expect(result).toHaveTextContent(
      "Dorothy Bricks Nursery School, Westminster, AB1 1CD",
    );
    await user.click(result);
    expect(school).toHaveValue(
      "Dorothy Bricks Nursery School, Westminster, AB1 1CD",
    );
    expect(download).toBeEnabled();
    await user.clear(school);
    expect(download).toBeDisabled();
    await user.type(school, "homeschool");
    expect(await screen.findByTestId("listbox-option")).toHaveTextContent(
      "Homeschool",
    );
    await user.click(screen.getByTestId("listbox-option"));
    expect(school).toHaveValue("Homeschool");
    await user.click(
      screen.getByRole("checkbox", { name: "My school isn't listed" }),
    );
    expect(school).toBeDisabled();
    expect(download).toBeEnabled();
  });

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
    expect(download).not.toBeInTheDocument();
  });

  it("reports a network failure, retains the selection and allows retry", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Network unavailable"));
    const { user, download } = await readyForm();
    await user.click(download);
    expect(await screen.findByText("Network unavailable")).toBeInTheDocument();
    expect(mockReportError).toHaveBeenCalledTimes(1);
    expect(download).toBeEnabled();
    expect(mockCreateObjectURL).not.toHaveBeenCalled();
    expect(
      JSON.parse(
        window.localStorage.getItem(LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION)!,
      ),
    ).toEqual(["science:primary"]);
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

  it("keeps saved choices when the document cannot be read", async () => {
    mockFetch.mockResolvedValueOnce({
      ...downloadResponse("Science.docx"),
      blob: async () => {
        throw new Error("Document unavailable");
      },
    });
    const { user, download } = await readyForm();
    await user.click(download);
    expect(await screen.findByText("Document unavailable")).toBeInTheDocument();
    expect(download).toBeEnabled();
    expect(downloads).toEqual([]);
    expect(
      JSON.parse(
        window.localStorage.getItem(LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION)!,
      ),
    ).toEqual(["science:primary"]);
  });
});
