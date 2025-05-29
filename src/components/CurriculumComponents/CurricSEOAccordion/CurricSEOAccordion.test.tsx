import { render, screen, fireEvent } from "@testing-library/react";
import { PortableTextBlock } from "@portabletext/react";

import CurricSEOAccordion from "./CurricSEOAccordion";
import {
  mockPortableTextBlocks,
  mockSubject,
} from "./CurricSEOAccordion.fixtures";

const mockUseMediaQuery = jest.fn();
jest.mock("@/hooks/useMediaQuery", () => ({
  __esModule: true,
  default: () => mockUseMediaQuery(),
}));

jest.mock("@/components/SharedComponents/PortableText", () => ({
  basePortableTextComponents: {},
}));

const curriculumSeoText: PortableTextBlock[] =
  mockPortableTextBlocks as PortableTextBlock[];

describe("CurricSEOAccordion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the accordion with the correct title", () => {
    mockUseMediaQuery.mockReturnValue(false);
    render(
      <CurricSEOAccordion
        curriculumSeoText={curriculumSeoText}
        subject={mockSubject}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: /How to plan your English curriculum with Oak/i,
      }),
    ).toBeInTheDocument();
  });

  test("displays truncated text in subheading initially (desktop)", () => {
    mockUseMediaQuery.mockReturnValue(false);
    render(
      <CurricSEOAccordion
        curriculumSeoText={curriculumSeoText}
        subject={mockSubject}
      />,
    );

    expect(
      screen.getByText(
        "Use this KS3 and KS4 Eduqas English curriculum plan to support sequenced teaching in reading, writin...",
      ),
    ).toBeInTheDocument();
  });

  test("displays truncated text in subheading initially (mobile)", () => {
    mockUseMediaQuery.mockReturnValue(true);
    render(
      <CurricSEOAccordion
        curriculumSeoText={curriculumSeoText}
        subject={mockSubject}
      />,
    );

    expect(
      screen.getByText("Use this KS3 and KS4 Eduqas English curr..."),
    ).toBeInTheDocument();
  });

  test("displays full text when accordion is opened", () => {
    mockUseMediaQuery.mockReturnValue(false);
    render(
      <CurricSEOAccordion
        curriculumSeoText={curriculumSeoText}
        subject={mockSubject}
      />,
    );

    const accordionHeader = screen.getByRole("heading", {
      name: /How to plan your English curriculum with Oak/i,
    });
    fireEvent.click(accordionHeader);

    expect(
      screen.getByText(
        "Use this KS3 and KS4 Eduqas English curriculum plan to support sequenced teaching in reading, writing and speaking. Aligned to the Eduqas GCSE specification, this curriculum helps pupils develop fluency in analysis and communication through a wide range of texts and topics.",
        { exact: true },
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Threads like 'non-fiction reading and writing', 'nineteenth century literature', and 'modern literature: identity and community' help track how core skills develop.",
        { exact: true },
      ),
    ).toBeInTheDocument();
  });
});
