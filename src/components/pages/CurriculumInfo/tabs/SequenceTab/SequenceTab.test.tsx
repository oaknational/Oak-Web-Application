import SequenceTab from "./SequenceTab";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const data = {
  threads: [
    "Algebra",
    "Geometry and Measure",
    "Number",
    "Probability",
    "Ratio and Proportion",
    "Statistics",
  ],
  units: [
    "Counting, recognising and comparing numbers 0-10",
    "Counting to and from 20",
    "Counting in tens - decade numbers",
    "Pattern in counting from 20 to 100",
    "Comparing quantities - part whole relationships",
    "Composition of numbers 0 to 5",
    "Recognise, compose, decompose and manipulate 3D shapes",
    " Composition of numbers 6 to 10",
  ],
};
describe("Component - Sequence Tab", () => {
  test("user can see the heading", async () => {
    const { getByTestId } = renderWithTheme(<SequenceTab {...data} />);
    expect(getByTestId("heading")).toBeInTheDocument();
  });
  test("number of unit cards matches units", async () => {
    const { findAllByTestId } = renderWithTheme(<SequenceTab {...data} />);
    const unitCards = await findAllByTestId("unitCard");
    expect(unitCards).toHaveLength(data.units.length);
  });
  test("number of threads matches data", async () => {
    const { findAllByTestId } = renderWithTheme(<SequenceTab {...data} />);
    const threadOptions = await findAllByTestId("threadOption");
    expect(threadOptions).toHaveLength(data.threads.length);
  });
});
