import BulletList from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("BulletList", () => {
  test("render", async () => {
    const { baseElement } = render(
      <>
        <BulletList
          items={[{ text: "one" }, { text: "two" }, { text: "three" }]}
        />
        <BulletList items={[{ text: "single" }]} />
      </>,
    );

    expect(baseElement).toMatchSnapshot();
  });
});
