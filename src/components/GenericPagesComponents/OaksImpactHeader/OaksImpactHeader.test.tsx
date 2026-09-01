import { OaksImpactHeader } from ".";

import MockedAnalyticsProvider from "@/__tests__/__helpers__/MockedAnalyticsProvider";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("OaksImpactHeader", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole } = render(
      <MockedAnalyticsProvider>
        <OaksImpactHeader
          mediaDescription={"TEST_VIDEO_DESCRIPTION"}
          video={{
            video: {
              asset: {
                assetId: "Kx9emKZOPdDNfMB2q202Oksaf7wHHywaXlcG3YURSTEw",
                playbackId: "VUW02Q7BTn3t11L027yUl9iDWwtOqdMgMyUxmo3O65p00k",
                thumbTime: 82,
              },
            },
            title: "Test Video",
          }}
          title={"TEST_TITLE"}
          body={"TEST_BODY"}
        />
      </MockedAnalyticsProvider>,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading")).toHaveTextContent("TEST_TITLE");
    expect(baseElement).toHaveTextContent("TEST_BODY");
    expect(baseElement).toHaveTextContent("TEST_VIDEO_DESCRIPTION");
  });
});
