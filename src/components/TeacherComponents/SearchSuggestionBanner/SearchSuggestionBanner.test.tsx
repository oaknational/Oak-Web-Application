import { screen } from "@testing-library/dom";

import { SearchSuggestionBanner } from "./SearchSuggestionBanner";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { SearchIntent } from "@/common-lib/schemas/search-intent";
import { OAK_SUBJECTS } from "@/context/Search/suggestions/oakCurriculumData";

const searchIntent: SearchIntent = {
  directMatch: {
    subject: { slug: "maths", title: "Maths" },
    keyStage: { slug: "ks2", title: "Key stage 2" },
    examBoard: null,
    year: null,
  },
  suggestedFilters: [],
};
const mathsDescription = OAK_SUBJECTS.find(
  (s) => s.slug == "maths",
)?.description;

const render = renderWithProviders();
describe("SearchSuggestionBanner", () => {
  it("renders a heading", () => {
    render(<SearchSuggestionBanner intent={searchIntent} />);
    const heading = screen.getByText("Maths");
    expect(heading).toBeInTheDocument();
  });
  it("renders metadata when there is a direct keystage match", () => {
    render(<SearchSuggestionBanner intent={searchIntent} />);
    const metadata = screen.getByText("Key stage 2", { selector: "p" });
    expect(metadata).toBeInTheDocument();
  });
  it("renders a description when it exists", () => {
    render(<SearchSuggestionBanner intent={searchIntent} />);
    if (!mathsDescription) throw new Error("Missing maths description ");
    const description = screen.getByText(mathsDescription);
    expect(description).toBeInTheDocument();
  });
  it("renders the correct link when there is only one", () => {
    render(<SearchSuggestionBanner intent={searchIntent} />);
    const linkText = screen.getByText("Key stage 2", { selector: "span" });
    const link = linkText?.closest("a");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "/teachers/key-stages/ks2/subjects/maths/programmes",
    );
  });
  it("renders multiple links when there are suggested ks filters", () => {
    render(
      <SearchSuggestionBanner
        intent={{
          directMatch: {
            subject: { slug: "maths", title: "Maths" },
            keyStage: null,
            examBoard: null,
            year: null,
          },
          suggestedFilters: [
            {
              title: "Key stage 2",
              slug: "ks2",
              type: "key-stage",
            },
            {
              title: "Key stage 4",
              slug: "ks4",
              type: "key-stage",
            },
          ],
        }}
      />,
    );
    const ks2LinkText = screen.getByText("Key stage 2", { selector: "span" });
    const ks2Link = ks2LinkText?.closest("a");
    expect(ks2Link).toBeInTheDocument();
    expect(ks2Link).toHaveAttribute(
      "href",
      "/teachers/key-stages/ks2/subjects/maths/programmes",
    );

    const ks4LinkText = screen.getByText("Key stage 4", { selector: "span" });
    const ks4Link = ks4LinkText?.closest("a");
    expect(ks4Link).toBeInTheDocument();
    expect(ks4Link).toHaveAttribute(
      "href",
      "/teachers/key-stages/ks4/subjects/maths/programmes",
    );
  });
});
