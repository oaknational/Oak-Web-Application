import { SocialButton } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("GetInvolvedLinkCard", () => {
  it("renders with single button", () => {
    const { getByRole } = render(
      <SocialButton socialType="facebook" profileHref="https://test.com" />,
    );
    const btn = getByRole("button");
    expect(btn).toBeInTheDocument();
  });

  it("disables button when arg passed in", () => {
    const { getByRole } = render(
      <SocialButton
        socialType="facebook"
        profileHref="https://test.com"
        disabled={true}
      />,
    );
    const btn = getByRole("button");
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });
});
