import { GetInTouch } from "./";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("GetInTouch", () => {
  it("renders", () => {
    const { container } = render(
      <GetInTouch
        name="John Doe"
        role="Teacher"
        schoolOrMat="Springfield High School"
        imageUrl="https://res.cloudinary.com/oak-web-application/image/upload/v1763393163/icons/chatting-illustration_l52zaf.svg"
        imageAlt="Example image"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
