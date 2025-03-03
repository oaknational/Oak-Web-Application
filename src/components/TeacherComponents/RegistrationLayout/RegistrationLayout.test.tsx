import { OakP } from "@oaknational/oak-components";
import { screen } from "@testing-library/dom";

import RegistrationLayout from "./RegistrationLayout";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("RegistrationLayout", () => {
  it("renders an aside in the default layout", () => {
    renderWithProviders()(
      <RegistrationLayout
        useAlternateLayout={false}
        asideSlot={<OakP>Aside</OakP>}
      >
        Child
      </RegistrationLayout>,
    );
    const aside = screen.getByText("Aside");
    expect(aside).toBeInTheDocument();
  });
  it("renders an aside in the alternate layout", () => {
    renderWithProviders()(
      <RegistrationLayout
        useAlternateLayout={true}
        asideSlot={<OakP>Aside</OakP>}
      >
        Child
      </RegistrationLayout>,
    );
    const aside = screen.getByText("Aside");
    expect(aside).toBeInTheDocument;
  });
  it("renders a banner", () => {
    renderWithProviders()(
      <RegistrationLayout
        useAlternateLayout={false}
        asideSlot={<OakP>Aside</OakP>}
        bannerSlot={<OakP>Banner</OakP>}
      >
        Child
      </RegistrationLayout>,
    );
    const banner = screen.getByText("Banner");
    expect(banner).toBeInTheDocument;
  });
  it("renders a banner in an alternate layout", () => {
    renderWithProviders()(
      <RegistrationLayout
        useAlternateLayout={true}
        asideSlot={<OakP>Aside</OakP>}
        bannerSlot={<OakP>Banner</OakP>}
      >
        Child
      </RegistrationLayout>,
    );
    const banner = screen.getAllByText("Banner");
    expect(banner).toHaveLength(2); // 1 each for mobile and desktop visible in test
  });
  it("renders terms ", () => {
    renderWithProviders()(
      <RegistrationLayout
        useAlternateLayout={false}
        asideSlot={<OakP>Aside</OakP>}
        termsSlot={<OakP>Terms</OakP>}
      >
        Child
      </RegistrationLayout>,
    );
    const terms = screen.getByText("Terms");
    expect(terms).toBeInTheDocument();
  });
  it("renders terms in an alternate layout", () => {
    renderWithProviders()(
      <RegistrationLayout
        useAlternateLayout={true}
        asideSlot={<OakP>Aside</OakP>}
        termsSlot={<OakP>Terms</OakP>}
      >
        Child
      </RegistrationLayout>,
    );
    const terms = screen.getByText("Terms");
    expect(terms).toBeInTheDocument;
  });
});
