import { screen } from "@testing-library/react";

import { TeachWithOakResourceCards } from "./TeachWithOakResourceCards";

import type { TeachWithOakShortReadsDownloads } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/teachWithOakShortReads.schema";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

const resources: TeachWithOakShortReadsDownloads = [
  { type: "explanation", exists: true, fileSize: "2 MB" },
  { type: "check-for-understanding", exists: true, fileSize: "1.5 MB" },
  { type: "feedback", exists: true, fileSize: "850 KB" },
  { type: "practice", exists: true, fileSize: "3 MB" },
];

describe("TeachWithOakResourceCards", () => {
  it("renders a resource card for each short read guide", () => {
    render(<TeachWithOakResourceCards resources={resources} />);

    expect(screen.getByText("Explanation at Oak guide")).toBeInTheDocument();
    expect(
      screen.getByText("Check for understanding (CfU) at Oak guide"),
    ).toBeInTheDocument();
    expect(screen.getByText("Feedback at Oak guide")).toBeInTheDocument();
    expect(screen.getByText("Practice at Oak guide")).toBeInTheDocument();
    expect(screen.getAllByText("PDF")).toHaveLength(4);
  });
  it("doesnt render a resource if it doesnt exist", () => {
    const resources: TeachWithOakShortReadsDownloads = [
      { type: "explanation", exists: true, fileSize: "2 MB" },
      { type: "check-for-understanding", exists: false, fileSize: "1.5 MB" },
      { type: "feedback", exists: false, fileSize: "850 KB" },
      { type: "practice", exists: true, fileSize: "3 MB" },
    ];
    render(<TeachWithOakResourceCards resources={resources} />);
    expect(screen.getByText("Explanation at Oak guide")).toBeInTheDocument();
    expect(
      screen.queryByText("Check for understanding (CfU) at Oak guide"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Feedback at Oak guide")).not.toBeInTheDocument();
    expect(screen.getByText("Practice at Oak guide")).toBeInTheDocument();
  });
});
