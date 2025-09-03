import { useRef } from "react";
import { useRouter } from "next/router";
import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";

import CurriculumDownloads, {
  CurriculumDownloadsRef,
} from "./CurriculumDownloads";

import createAndClickHiddenDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { DownloadCategory } from "@/node-lib/curriculum-api-2023/fixtures/curriculumPreviousDownloads.fixture";

jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

let hubspotShouldError = false;
jest.mock(
  "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit",
  () => ({
    useHubspotSubmit: () => ({
      onHubspotSubmit: () => {
        return hubspotShouldError ? Promise.reject() : Promise.resolve(true);
      },
    }),
  }),
);

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    query: { subject: "" },
    asPath: "",
  }),
}));

const testSubject = "french";
const testCategory = "EYFS";
const frenchResource = {
  icon: "french",
  label: "French Subject",
  url: `https://this-url-needs-to-end-in-the-subject?param=${testSubject}`,
  // TODO - the radio is selected based of the end of the url. This isn't ideal and should be refactored
};
const downloads = [frenchResource];
const render = renderWithProviders();
beforeEach(() => {
  localStorage.clear();
});

describe("CurriculumDownloads", () => {
  const renderComponent = () => {
    const defaultProps = {
      category: testCategory as DownloadCategory,
      downloads: downloads,
    };
    return render(<CurriculumDownloads {...defaultProps} />);
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test("Clears selection with external trigger", async () => {
    const Page = () => {
      const downloadsRef = useRef<CurriculumDownloadsRef>(null);
      return (
        <>
          <CurriculumDownloads
            ref={downloadsRef}
            category={testCategory}
            downloads={downloads}
          />
          <button
            onClick={() => downloadsRef.current?.clearSelection()}
            data-testid="clearButton"
          />
        </>
      );
    };
    const { getByTestId } = render(<Page />);
    const resourceCard = getByTestId("resourceCard");
    await userEvent.click(resourceCard.querySelector("label")!);
    await act(() => {
      expect(resourceCard.querySelector("input")?.checked).toBeTruthy();
    });
    await userEvent.click(getByTestId("clearButton"));
    await act(() => {
      expect(resourceCard.querySelector("input")?.checked).toBeFalsy();
    });
  });

  test("renders download cards", async () => {
    const { findAllByText } = renderComponent();
    const cards = await findAllByText(frenchResource.label);
    expect(cards).toHaveLength(1);
  });

  test("generates school error", async () => {
    const { getByTestId } = renderComponent();
    const schoolInput = getByTestId("search-combobox-input");
    await userEvent.type(schoolInput, "notavalidschool!?{enter}");
    await act(() => {
      expect(getByTestId("errorList")).toBeInTheDocument();
    });
  });

  test("generates download error and recovers", async () => {
    const { getByTestId, queryByTestId } = renderComponent();
    await userEvent.click(getByTestId("checkbox-download"));
    await userEvent.click(getByTestId("termsCheckbox").querySelector("label")!);
    await userEvent.click(getByTestId("loadingButton"));
    await act(() => {
      expect(getByTestId("errorList")).toBeInTheDocument();
    });
    await userEvent.click(getByTestId("resourceCard").querySelector("label")!);
    await act(() => {
      expect(queryByTestId("errorList")).not.toBeInTheDocument();
    });
  });

  test("rejects empty download URL", async () => {
    const { getByTestId } = render(
      <CurriculumDownloads
        category={testCategory}
        downloads={[{ icon: "english", label: "English", url: "" }]}
      />,
    );
    await userEvent.click(getByTestId("checkbox-download")!);
    await userEvent.click(getByTestId("termsCheckbox").querySelector("label")!);
    await userEvent.click(getByTestId("resourceCard").querySelector("label")!);
    await userEvent.click(getByTestId("loadingButton"));
    await act(() => {
      expect(getByTestId("errorList")).toBeInTheDocument();
    });
  });

  test("submits form when correct information is entered", async () => {
    const { getAllByTestId, getByTestId } = renderComponent();
    const resourceCard = getAllByTestId("resourceCard")[0];
    if (resourceCard === undefined) {
      throw new Error("Resource card not found");
    }
    await userEvent.click(resourceCard.querySelector("label")!);
    await userEvent.click(getByTestId("checkbox-download")!);
    await userEvent.click(getByTestId("termsCheckbox").querySelector("label")!);
    await userEvent.click(getByTestId("loadingButton"));
    expect(createAndClickHiddenDownloadLink).toHaveBeenCalledWith(
      frenchResource.url,
    );
    expect(getByTestId("downloadSuccess")).toBeInTheDocument();
  });

  test("generates error when Hubspot fails", async () => {
    const { getByTestId, getByText, getAllByTestId } = renderComponent();
    hubspotShouldError = true;
    const resourceCard = getAllByTestId("resourceCard")[0];
    if (resourceCard === undefined) {
      throw new Error("Resource card not found");
    }
    await userEvent.click(resourceCard.querySelector("label")!);
    await userEvent.click(getByTestId("checkbox-download")!);
    await userEvent.click(getByTestId("termsCheckbox").querySelector("label")!);
    await userEvent.click(getByTestId("resourceCard").querySelector("label")!);
    await userEvent.click(getByTestId("loadingButton"));
    await act(() => {
      expect(
        getByText(
          "There was an error downloading your files. Please try again.",
        ),
      ).toBeInTheDocument();
    });
    hubspotShouldError = false;
  });

  test("selects subject when specified in URL", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { subject: testSubject, keystage: "eyfs" },
      asPath: "/some-path",
    });
    const { getByText } = renderComponent();
    await act(() => {
      const input = getByText(frenchResource.label)
        .closest("[data-testid='resourceCard']")
        ?.querySelector("input") as HTMLInputElement;
      expect(input?.checked).toBeTruthy();
    });
  });
});
