import TeachersTab from "./TeachersTab";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("TeachersTab", () => {
  it("renders without crashing", () => {
    const { getAllByText } = renderWithTheme(<TeachersTab />);
    expect(getAllByText("TeacherTab")[0]).toBeInTheDocument();
  });
});
