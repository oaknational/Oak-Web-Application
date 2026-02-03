import SocialButtons from "./SocialButtons";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("SocialButtons", () => {
  test.each([
    ["instagram", "oaknational", "https://instagram.com/oaknational"],
    [
      "facebook",
      "oaknationalacademy",
      "https://facebook.com/oaknationalacademy",
    ],
    ["x", "oaknational", "https://x.com/oaknational"],
    [
      "linkedIn",
      "https://www.linkedin.com/company/oak-national-academy",
      "https://www.linkedin.com/company/oak-national-academy",
    ],
  ])(
    "should be correct %s link (url and a11y label)",
    (network, profileIdentifier, profileUrl) => {
      const { getByRole } = renderWithTheme(
        <SocialButtons for="someone" {...{ [network]: profileIdentifier }} />,
      );
      const label = `${network} for someone`;
      const link = getByRole("link", { name: label });
      expect(link).toHaveAccessibleName(label);
      expect(link).toHaveAttribute("href", profileUrl);
    },
  );
  test("renders nothing if no socials passed", () => {
    const { container } = renderWithTheme(<SocialButtons for="no one" />);
    expect(container).toBeEmptyDOMElement();
  });
  test("renders only socials which are passed", () => {
    const { getAllByRole } = renderWithTheme(
      <SocialButtons
        for="someone"
        instagram={"donuts"}
        linkedIn={"cheese cake"}
      />,
    );
    expect(getAllByRole("link")).toHaveLength(2);
  });
});
