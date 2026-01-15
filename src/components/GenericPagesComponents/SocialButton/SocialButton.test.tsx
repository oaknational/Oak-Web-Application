import { SocialButton } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("GetInvolvedLinkCard", () => {
  it("renders with single button", () => {
    const { getByRole } = render(
      <SocialButton socialType="facebook" profileHref="https://test.com" />,
    );
    const btn = getByRole("link");
    expect(btn).toBeInTheDocument();
  });

  it("doesn't find link when disabled", () => {
    const { getByRole } = render(
      <SocialButton
        socialType="facebook"
        profileHref="https://test.com"
        disabled={true}
      />,
    );
    const btn = getByRole("link");
    expect(btn).toBeInTheDocument();
    expect(btn).not.toHaveAttribute("href");
  });
});
