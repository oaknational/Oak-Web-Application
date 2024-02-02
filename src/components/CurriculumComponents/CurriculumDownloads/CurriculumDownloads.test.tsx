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
          icon: "french",
          label: "Test Label",
          url: "https://test-url.com",
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
