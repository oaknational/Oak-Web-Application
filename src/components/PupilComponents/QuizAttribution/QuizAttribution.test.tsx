import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { render } from "@testing-library/react";

import { QuizAttribution } from "./QuizAttribution";

describe(QuizAttribution, () => {
  it("displays attribution for any image in the question stem", () => {
    const { queryByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizAttribution
          questionStem={[
            { type: "text", text: "This is a question" },
            {
              type: "image",
              image_object: {
                metadata: {
                  attribution: "This is attributed to the author of the piece",
                },
                secure_url: "https://example.com/image.jpg",
              },
            },
          ]}
        />
      </OakThemeProvider>,
    );

    expect(
      queryByText("This is attributed to the author of the piece"),
    ).toBeInTheDocument();
  });
});
