import {
  basic as fixture,
  withThreeMembers as withThreeMembersFixture,
} from "./fixtures";

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
    expect(peopleHeadings).toHaveLength(2);
    expect(peopleHeadings[0]).toHaveTextContent(fixture.members[0]!.name);
    expect(peopleHeadings[1]).toHaveTextContent(fixture.members[1]!.name);
  });

  test("it renders more than 2", () => {
    const { baseElement, getByRole, getAllByRole } = render(
      <JoinResearchPanelPeople {...withThreeMembersFixture} />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { level: 2 })).toHaveTextContent(
      withThreeMembersFixture.title,
    );
    const peopleHeadings = getAllByRole("heading", { level: 3 });
    expect(peopleHeadings).toHaveLength(3);
    expect(peopleHeadings[0]).toHaveTextContent(
      withThreeMembersFixture.members[0]!.name,
    );
    expect(peopleHeadings[1]).toHaveTextContent(
      withThreeMembersFixture.members[1]!.name,
    );
    expect(peopleHeadings[2]).toHaveTextContent(
      withThreeMembersFixture.members[2]!.name,
    );
  });
});
