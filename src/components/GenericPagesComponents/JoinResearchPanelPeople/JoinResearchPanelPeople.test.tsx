import { basic as fixture } from "./fixtures";

import JoinResearchPanelPeople from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("JoinResearchPanelPeople", () => {
  test("it renders correct data", () => {
    const { baseElement, getByRole, getAllByRole } = render(
      <JoinResearchPanelPeople {...fixture} />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { level: 2 })).toHaveTextContent(fixture.title);
    const peopleHeadings = getAllByRole("heading", { level: 3 });
    expect(peopleHeadings[0]).toHaveTextContent(fixture.members[0]!.name);
    expect(peopleHeadings[1]).toHaveTextContent(fixture.members[1]!.name);
  });
});
