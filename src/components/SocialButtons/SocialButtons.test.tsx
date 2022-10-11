import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import SocialButtons from "./SocialButtons";

describe("SocialButtons", () => {
  test.each([
    ["instagram", "oaknational", "https://instagram.com/oaknational"],
    [
      "facebook",
      "oaknationalacademy",
      "https://facebook.com/oaknationalacademy",
    ],
    ["twitter", "oaknational", "https://twitter.com/oaknational"],
    [
      "linkedIn",
      "https://www.linkedin.com/company/oak-national-academy",
      "https://www.linkedin.com/company/oak-national-academy",
    ],
  ])(
    "should be correct %s link (url and a11y label)",
    (network, profileIdentifier, profileUrl) => {
      const { getByRole } = renderWithTheme(
        <SocialButtons {...{ [network]: profileIdentifier }} />
      );
      const link = getByRole("link", { name: network });
      expect(link).toHaveAccessibleName(network);
      expect(link).toHaveAttribute("href", profileUrl);
    }
  );
  test("renders nothing if no socials passed", () => {
    const { container } = renderWithTheme(<SocialButtons />);
    expect(container).toBeEmptyDOMElement();
  });
  test("renders only socials which are passed", () => {
    const { getAllByRole } = renderWithTheme(
      <SocialButtons instagram={"donuts"} linkedIn={"cheese cake"} />
    );
    expect(getAllByRole("link")).toHaveLength(2);
  });
});
