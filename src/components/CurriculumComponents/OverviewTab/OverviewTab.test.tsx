import { act } from "@testing-library/react";
import { vi, Mock } from "vitest";

import OverviewTab from "./OverviewTab";

import curriculumOverviewTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockVideoAsset } from "@/__tests__/__helpers__/cms";

const routeReplaceMock = vi.fn((url: string) => {
  console.log(url);
});

vi.mock("next/router", async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual: any = await vi.importActual("next/router");
  return {
    __esModule: true,
    ...actual,
    useRouter: () => ({
      ...actual.useRouter,
      replace: (url: string) => routeReplaceMock(url),
    }),
  };
});

describe("Component - Overview Tab", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();

    // Not supported in jsdom
    Element.prototype.checkVisibility = vi.fn(() => true) as Mock;
    Element.prototype.scrollIntoView = vi.fn(() => {}) as Mock;
  });

  test("explainer displayed", async () => {
    const fixture = curriculumOverviewTabFixture();
    fixture.curriculumCMSInfo.subjectPrinciples = [
      "Sequences learning over time which: • Builds musical knowledge, techniques and specialist language • Promotes the understanding of a diverse range of genres, traditions and styles • Develops pupils analytical skills in responding to different types of music",
    ];
    const render = renderWithProviders();
    const { getByTestId, queryByTestId } = render(
      <OverviewTab data={fixture} />,
    );
    const explainer = getByTestId("explainer");
    expect(explainer).toHaveTextContent("Aims and purpose");
    expect(queryByTestId("video-guide")).not.toBeInTheDocument();
  });

  test("multiple curriculum partners", async () => {
    const fixture = curriculumOverviewTabFixture();
    fixture.curriculumCMSInfo.curriculumPartnerOverviews = [
      {
        partnerBio: "PARTNER_1",
        curriculumPartner: fixture.curriculumCMSInfo.curriculumPartner,
      },
      {
        partnerBio: "PARTNER_2",
        curriculumPartner: fixture.curriculumCMSInfo.curriculumPartner,
      },
    ];
    const render = renderWithProviders();
    const { queryAllByTestId } = render(<OverviewTab data={fixture} />);
    const partnerElements = queryAllByTestId("curriculum-partner");
    expect(partnerElements.length).toBe(2);
    expect(partnerElements[0]).toHaveTextContent("PARTNER_1");
    expect(partnerElements[1]).toHaveTextContent("PARTNER_2");
  });

  test("explainer displayed when cycle 2 features enabled with video", async () => {
    const fixture = curriculumOverviewTabFixture();
    fixture.curriculumCMSInfo.subjectPrinciples = [
      "Sequences learning over time which: • Builds musical knowledge, techniques and specialist language • Promotes the understanding of a diverse range of genres, traditions and styles • Develops pupils analytical skills in responding to different types of music",
    ];
    fixture.curriculumCMSInfo.video = mockVideoAsset();
    fixture.curriculumCMSInfo.videoExplainer = "testing";
    const render = renderWithProviders();
    const { getByTestId, queryByTestId } = render(
      <OverviewTab data={fixture} />,
    );
    const explainer = getByTestId("explainer");
    expect(explainer).toHaveTextContent("Aims and purpose");
    expect(queryByTestId("video-guide")).toBeInTheDocument();
  });

  test("click heading links", async () => {
    const fixture = curriculumOverviewTabFixture();
    const render = renderWithProviders();
    const { getAllByRole } = render(<OverviewTab data={fixture} />);
    const links = getAllByRole("link");
    expect(links[0]).toHaveTextContent("Aims and purpose");
    act(() => {
      links[0]!.click();
    });
    expect(routeReplaceMock).toHaveBeenCalledWith("#header-aims-and-purpose");
    routeReplaceMock.mockClear();
    (Element.prototype.checkVisibility as Mock).mockClear();

    act(() => {
      links[1]!.click();
    });
    expect(routeReplaceMock).toHaveBeenCalledWith("#header-heading-1");
    routeReplaceMock.mockClear();
    (Element.prototype.checkVisibility as Mock).mockClear();
  });
});
