import ProfileCard from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("ProfileCard", () => {
  it("renders correctly with image", () => {
    const { baseElement, getByRole } = render(
      <ProfileCard
        image={
          "https://cdn.sanity.io/images/cuvjke51/production/5a3b5c6b33c974b6ca030a5f7c531868ef8a4311-512x512.png"
        }
        name={"Ed Southall"}
        role={"Subject Lead (maths)"}
        href={"#"}
      />,
    );
    const headingEl = getByRole("heading");
    expect(headingEl?.tagName).toEqual("H3");
    expect(baseElement).toMatchSnapshot();
  });

  it("renders correctly without image", () => {
    const { baseElement, getByRole } = render(
      <ProfileCard
        image={""}
        name={"John Roberts"}
        role={"Chief Executive"}
        href={"#"}
      />,
    );
    const headingEl = getByRole("heading");
    expect(headingEl?.tagName).toEqual("H3");
    expect(baseElement).toMatchSnapshot();
  });
});
