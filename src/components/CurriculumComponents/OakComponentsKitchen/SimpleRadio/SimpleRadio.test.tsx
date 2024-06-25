import { RadioGroup, RadioButton } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Fieldset", () => {
  test("render / none", () => {
    const { baseElement } = renderWithTheme(
      <RadioGroup name="testing" onChange={(e) => console.log(e)} value={null}>
        <RadioButton value="one">one</RadioButton>
        <RadioButton value="two">two</RadioButton>
      </RadioGroup>,
    );

    expect(baseElement).toMatchSnapshot();
  });

  test("render / selected", () => {
    const { baseElement } = renderWithTheme(
      <RadioGroup name="testing" onChange={(e) => console.log(e)} value="one">
        <RadioButton value="one">one</RadioButton>
        <RadioButton value="two">two</RadioButton>
      </RadioGroup>,
    );

    expect(baseElement).toMatchSnapshot();
  });
});
