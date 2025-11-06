import { WhoAreWeHeader } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("WhoAreWeHeader", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole } = render(
      <WhoAreWeHeader
        title="TESTING_TITLE"
        content="TESTING_CONTENT"
        cloudinaryId="TESTING_IMAGE"
      />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading")).toHaveTextContent("TESTING_TITLE");
    expect(getByRole("paragraph")).toHaveTextContent("TESTING_CONTENT");
    expect(getByRole("img")).toHaveAttribute(
      "src",
      "https://next_public_cloudinary_secure_distribution/NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME/image/upload/fl_keep_attribution/c_limit,w_3840/f_auto/q_auto/v1/TESTING_IMAGE?_a=BAVAZGID0",
    );
  });
});
