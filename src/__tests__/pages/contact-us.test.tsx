import ContactUs from "../../pages/contact-us";
import renderWithProviders from "../__helpers__/renderWithProviders";

describe("pages/contact-us.tsx", () => {
  it("contains an h1 ", () => {
    const { getByRole } = renderWithProviders(<ContactUs />);

    expect(getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
  it("contains a sign up button", () => {
    const { getByRole } = renderWithProviders(<ContactUs />);

    expect(
      getByRole("button", {
        name: /sign up/i,
      })
    ).toHaveAccessibleName("Sign up");
  });
});
