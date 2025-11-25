import { RadioGroup, RadioButton } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme", "theme"]);

describe("SimpleRadio", () => {
  test("render / none", () => {
    const { baseElement } = render(
      <RadioGroup name="testing" onChange={(e) => console.log(e)} value={null}>
        <RadioButton value="one">one</RadioButton>
        <RadioButton value="two">two</RadioButton>
      </RadioGroup>,
    );

    expect(baseElement).toMatchSnapshot();
  });

  test("render / selected", () => {
    const { baseElement } = render(
      <RadioGroup name="testing" onChange={(e) => console.log(e)} value="one">
        <RadioButton value="one">one</RadioButton>
        <RadioButton value="two">two</RadioButton>
      </RadioGroup>,
    );

    expect(baseElement).toMatchSnapshot();
  });
});
