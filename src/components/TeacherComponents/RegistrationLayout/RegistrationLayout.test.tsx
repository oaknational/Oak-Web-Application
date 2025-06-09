import { OakP } from "@oaknational/oak-components";
import { screen } from "@testing-library/dom";

import RegistrationLayout from "./RegistrationLayout";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("RegistrationLayout", () => {
  it("renders an aside", () => {
    renderWithProviders()(
      <RegistrationLayout asideSlot={<OakP>Aside</OakP>}>
        Child
      </RegistrationLayout>,
    );
    const aside = screen.getByText("Aside");
    expect(aside).toBeInTheDocument();
  });
  it("renders a banner", () => {
    renderWithProviders()(
      <RegistrationLayout
        asideSlot={<OakP>Aside</OakP>}
        bannerSlot={<OakP>Banner</OakP>}
      >
        Child
      </RegistrationLayout>,
    );
    const banner = screen.getAllByText("Banner");
    expect(banner).toHaveLength(2); // 1 each for mobile and desktop visible in test
  });
  it("renders terms", () => {
    renderWithProviders()(
      <RegistrationLayout
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
