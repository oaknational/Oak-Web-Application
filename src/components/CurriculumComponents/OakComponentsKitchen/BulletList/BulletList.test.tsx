import BulletList from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("BulletList", () => {
  test("render", async () => {
    const { baseElement } = renderWithTheme(
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
