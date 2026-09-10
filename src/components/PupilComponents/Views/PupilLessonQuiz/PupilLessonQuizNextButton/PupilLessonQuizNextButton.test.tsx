import userEvent from "@testing-library/user-event";

import { PupilLessonQuizNextButton } from "./PupilLessonQuizNextButton";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonQuizNextButton", () => {
  it("renders the label and handles clicks", async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();

    render(
      <PupilLessonQuizNextButton label="Next question" onClick={onClick} />,
    );

    await user.click(document.querySelector("button") as HTMLElement);

    expect(document.body).toHaveTextContent("Next question");
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
