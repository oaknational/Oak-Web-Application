import CurriculumDownloads from "./CurriculumDownloads";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("Component - Curriculum Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const renderComponent = () => {
    const defaultProps = {
      category: "test-category",
      downloads: [
        {
          exists: true as const,
          type: "curriculum-pdf" as const,
          label: "Test Label",
          ext: "pdf" as const,
        },
      ],
    };

    return render(<CurriculumDownloads {...defaultProps} />);
  };

  test("user can see download cards", async () => {
    const { findAllByLabelText } = renderComponent();
    const cards = await findAllByLabelText("Test Label");
    expect(cards).toHaveLength(1);
  });
});
