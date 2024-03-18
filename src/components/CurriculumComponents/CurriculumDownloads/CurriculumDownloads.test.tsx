import { useRef } from "react";
import { useRouter } from "next/router";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/dom";

import CurriculumDownloads, {
  CurriculumDownloadsRef,
} from "./CurriculumDownloads";

import { useHubspotSubmit } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit";
import createAndClickHiddenDownloadLink from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

jest.mock(
  "@/components/TeacherComponents/hooks/downloadAndShareHooks/useHubspotSubmit",
  () => ({
    useHubspotSubmit: jest.fn().mockImplementation(() => {
      return {
        onHubspotSubmit: jest
          .fn()
          .mockImplementation(() => Promise.resolve(true)),
      };
    }),
  }),
);

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    query: { subject: "" },
    asPath: "",
  }),
}));

const render = renderWithProviders();

describe("Component - Curriculum Header", () => {
  const downloads = [
    {
      icon: "french",
      label: "Test Subject",
      url: "https://test-url.com/download?type=curriculum-map&extension=pdf&id=test-subject",
    },
  ];
  const renderComponent = () => {
    const defaultProps = {
      category: "test-category",
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
            category="test-category"
            downloads={downloads}
          />
          ;
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
    await waitFor(() => {
      expect(resourceCard.querySelector("input")?.checked).toBeTruthy();
    });
    await userEvent.click(getByTestId("clearButton"));
    await waitFor(() => {
      expect(resourceCard.querySelector("input")?.checked).toBeFalsy();
    });
  });

  test("renders download cards", async () => {
    const { findAllByLabelText } = renderComponent();
    const cards = await findAllByLabelText("Test Subject");
    expect(cards).toHaveLength(1);
  });

  test("generates school error", async () => {
    const { getByTestId } = renderComponent();
    const schoolInput = getByTestId("search-combobox-input");
    await userEvent.type(schoolInput, "notavalidschool!?{enter}");
    await waitFor(() => {
      expect(getByTestId("errorList")).toBeInTheDocument();
    });
  });

  test("generates download error and recovers", async () => {
    const { getByTestId, queryByTestId } = renderComponent();
    await userEvent.click(getByTestId("checkbox-download"));
    await userEvent.click(getByTestId("termsCheckbox").querySelector("label")!);
    await userEvent.click(getByTestId("loadingButton"));
    await waitFor(() => {
      expect(getByTestId("errorList")).toBeInTheDocument();
    });
    await userEvent.click(getByTestId("resourceCard").querySelector("label")!);
    await waitFor(() => {
      expect(queryByTestId("errorList")).not.toBeInTheDocument();
    });
  });

  test("rejects empty download URL", async () => {
    const { getByTestId } = render(
      <CurriculumDownloads
        category="test-category"
        downloads={[{ icon: "english", label: "English", url: "" }]}
      />,
    );
    await userEvent.click(getByTestId("checkbox-download")!);
    await userEvent.click(getByTestId("termsCheckbox").querySelector("label")!);
    await userEvent.click(getByTestId("resourceCard").querySelector("label")!);
    await userEvent.click(getByTestId("loadingButton"));
    await waitFor(() => {
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
    await waitFor(
      () => {
        expect(createAndClickHiddenDownloadLink).toHaveBeenCalledWith(
          "https://test-url.com/download?type=curriculum-map&extension=pdf&id=test-subject",
        );

        expect(getByTestId("downloadSuccess")).toBeInTheDocument();
      },
      { interval: 100, timeout: 2000 },
    );
  });

  test("generates error when Hubspot fails", async () => {
    (useHubspotSubmit as jest.Mock).mockImplementation(() => ({
      useHubspotSubmit: jest.fn().mockImplementation(() => {
        return {
          onHubspotSubmit: jest.fn().mockImplementation(() => {
            throw new Error("Test Error");
          }),
        };
      }),
    }));
    const { getByTestId, getByText } = renderComponent();
    await userEvent.click(getByTestId("resourceCard").querySelector("label")!);
    await userEvent.click(getByTestId("loadingButton"));
    await waitFor(() => {
      expect(
        getByText(
          "There was an error downloading your files. Please try again.",
        ),
      ).toBeInTheDocument();
    });
  });

  test("selects subject when specified in URL", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { subject: "test-subject", keystage: "test-category" },
      asPath: "/some-path",
    });
    const { getByText } = renderComponent();
    await waitFor(() => {
      const input = getByText("Test Subject")
        .closest("label")
        ?.querySelector("input") as HTMLInputElement;
      expect(input?.checked).toBeTruthy();
    });
  });
});
