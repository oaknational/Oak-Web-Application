import { PupilLessonIntroInfoCard } from "./PupilLessonIntroInfoCard";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonIntroInfoCard", () => {
  it("renders the title and children", () => {
    render(
      <PupilLessonIntroInfoCard title="Equipment" iconName="books">
        <p>Pencil and paper</p>
      </PupilLessonIntroInfoCard>,
    );

    expect(document.body).toHaveTextContent("Equipment");
    expect(document.body).toHaveTextContent("Pencil and paper");
  });
});
