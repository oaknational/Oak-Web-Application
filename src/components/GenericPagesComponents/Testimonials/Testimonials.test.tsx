import { render, screen } from "@testing-library/react";

import { Testimonials } from "./Testimonials";

import { OakCarousel, OakQuote } from "@oaknational/oak-components";


// Mock the oak-components to avoid actual implementation
jest.mock("@oaknational/oak-components", () => ({
  OakCarousel: jest.fn(({ content, backLabel, fwdLabel, containerLabel }) => (
    <div role="region" aria-label={containerLabel}>
      {content}
      <button aria-label={backLabel}>Previous</button>
      <button aria-label={fwdLabel}>Next</button>
    </div>
  )),
  OakQuote: jest.fn(({ quote, authorName, authorTitle, authorImageSrc }) => (
    <blockquote>
      <p>{quote}</p>
      <footer>
        {authorImageSrc && <img src={authorImageSrc} alt={authorName} />}
        <cite>
          {authorName}
          <span>{authorTitle}</span>
        </cite>
      </footer>
    </blockquote>
  )),
}));

describe("Testimonials", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTestimonials = [
    {
      quote: {
        text: "Great product!",
        attribution: "John Doe",
        role: "Teacher",
        organisation: "Oak School",
      },
      image: {
        asset: {
          _id: "test_quote_author",
          url: "https://example.com/image.jpg",
        },
      },
    },
    {
      quote: {
        text: "Amazing experience!",
        attribution: "Jane Smith",
        role: "Principal",
        organisation: "Oak Academy",
      },
      image: null,
    },
  ];

  it("renders null when testimonials prop is empty array", () => {
    const { container } = render(<Testimonials testimonials={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders null when testimonials prop is null", () => {
    const { container } = render(<Testimonials testimonials={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders OakCarousel with correct props", () => {
    render(<Testimonials testimonials={mockTestimonials} />);

    expect(OakCarousel).toHaveBeenCalledWith(
      {
        content: expect.any(Array),
        backLabel: "Previous testimonial",
        fwdLabel: "Next testimonial",
        containerLabel: "Testimonials",
      },
      {},
    );
  });

  it("renders correct number of OakQuote components", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    expect(OakQuote).toHaveBeenCalledTimes(2);
  });

  it("passes correct props to OakQuote for testimonial with image", () => {
    render(<Testimonials testimonials={mockTestimonials} />);

    expect(OakQuote).toHaveBeenCalledWith(
      {
        quote: "Great product!",
        authorImageSrc: "https://example.com/image.jpg",
        authorName: "John Doe",
        authorTitle: "Teacher, Oak School",
        color: "transparent",
      },
      {},
    );
  });

  it("passes correct props to OakQuote for testimonial without image", () => {
    render(<Testimonials testimonials={mockTestimonials} />);

    expect(OakQuote).toHaveBeenCalledWith(
      {
        quote: "Amazing experience!",
        authorImageSrc: undefined,
        authorName: "Jane Smith",
        authorTitle: "Principal, Oak Academy",
        color: "transparent",
      },
      {},
    );
  });

  it("renders carousel navigation buttons with correct labels", () => {
    render(<Testimonials testimonials={mockTestimonials} />);

    expect(screen.getByLabelText("Previous testimonial")).toBeInTheDocument();
    expect(screen.getByLabelText("Next testimonial")).toBeInTheDocument();
  });

  it("renders carousel with correct container label", () => {
    render(<Testimonials testimonials={mockTestimonials} />);

    expect(
      screen.getByRole("region", { name: "Testimonials" }),
    ).toBeInTheDocument();
  });
});
