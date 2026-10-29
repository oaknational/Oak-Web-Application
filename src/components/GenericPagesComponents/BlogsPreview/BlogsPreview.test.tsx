import { basic } from "./BlogsPreview.fixtures";
import { BlogsPreview } from "./BlogsPreview";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("BlogsPreview", () => {
  it("should render the blogs preview", () => {
    const { baseElement, getAllByRole } = render(<BlogsPreview {...basic} />);

    expect(baseElement).toMatchSnapshot();
    expect(getAllByRole("listitem")).toHaveLength(3);
  });
});
