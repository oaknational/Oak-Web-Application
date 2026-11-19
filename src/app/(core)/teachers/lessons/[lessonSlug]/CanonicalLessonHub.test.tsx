import { screen, within } from "@testing-library/react";

import {
  CanonicalLessonHub,
  CanonicalLessonHubProps,
} from "./CanonicalLessonHub";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();
const programmes: CanonicalLessonHubProps["programmesForLesson"] = [
  {
    subject: "Science",
    unitTitle: "Forces",
    year: "Year 10",
    examboard: "AQA",
    tier: "Foundation",
    href: "/teachers/programmes/science-aqa/units/forces/lessons/lesson-slug",
  },
  {
    subject: "Physics",
    unitTitle: "Motion",
    year: "Year 11",
    examboard: "Edexcel",
    tier: "Higher",
    href: "/teachers/programmes/physics-edexcel/units/motion/lessons/lesson-slug",
  },
];
const props: CanonicalLessonHubProps = {
  subjectSlug: "science",
  lessonName: "Lesson title",
  programmesForLesson: programmes,
};

describe("CanonicalLessonHub", () => {
  it.each([
    [undefined, "Lesson appears in"],
    ["Media clips appear in", "Media clips appear in"],
  ])("renders the listing heading %s", (listingTitle, expectedHeading) => {
    render(<CanonicalLessonHub {...props} listingTitle={listingTitle} />);

    expect(
      screen.getByRole("heading", { name: expectedHeading }),
    ).toBeInTheDocument();
  });

  it("renders the lesson title and science subject image", () => {
    const { container } = render(<CanonicalLessonHub {...props} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Lesson title" }),
    ).toBeInTheDocument();
    expect(
      container.querySelector('img[src*="subject-icons/science.svg"]'),
    ).toBeInTheDocument();
  });

  it("renders a separate card with details, tags and the supplied link for each variant", () => {
    render(<CanonicalLessonHub {...props} />);

    const cards = screen.getAllByRole("listitem");
    expect(cards).toHaveLength(2);
    programmes.forEach((programme, index) => {
      const card = within(cards[index]!);
      expect(card.getByText(programme.subject)).toBeInTheDocument();
      expect(card.getByText(programme.unitTitle)).toBeInTheDocument();
      expect(card.getByText(programme.year!)).toBeInTheDocument();
      expect(card.getByText(programme.examboard!)).toBeInTheDocument();
      expect(card.getByText(programme.tier!)).toBeInTheDocument();
      expect(card.getByRole("link")).toHaveAttribute("href", programme.href);
    });
  });

  it("renders citizenship pathway tags without exam board or tier tags", () => {
    render(
      <CanonicalLessonHub
        {...props}
        subjectSlug="citizenship"
        programmesForLesson={[
          {
            subject: "Citizenship",
            unitTitle: "Money Sense",
            pathway: "Core",
            examboard: null,
            tier: null,
            href: "/teachers/programmes/citizenship-core",
          },
          {
            subject: "Citizenship",
            unitTitle: "Money Sense",
            pathway: "GCSE",
            href: "/teachers/programmes/citizenship-gcse",
          },
        ]}
      />,
    );

    const cards = screen.getAllByRole("listitem");
    expect(cards).toHaveLength(2);
    expect(within(cards[0]!).getByText("Core")).toBeInTheDocument();
    expect(within(cards[1]!).getByText("GCSE")).toBeInTheDocument();
    expect(screen.getAllByText("Citizenship")).toHaveLength(2);
    expect(screen.queryByText("AQA")).not.toBeInTheDocument();
    expect(screen.queryByText("Foundation")).not.toBeInTheDocument();
  });
});
