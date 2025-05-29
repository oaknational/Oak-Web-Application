import { render, screen, act } from "@testing-library/react";
import { ReactNode } from "react";

import {
  mockPortableTextBlocks,
  mockSubject,
} from "./CurricSEOAccordion.fixtures";

import CurricSEOAccordion from ".";


const mockUseMediaQuery = jest.fn();
jest.mock("@/hooks/useMediaQuery", () => ({
  __esModule: true,
  default: () => mockUseMediaQuery(),
}));

jest.mock("@/components/SharedComponents/PortableText", () => ({
  basePortableTextComponents: {},
}));

interface MockOakBasicAccordionProps {
  children: ReactNode;
  header: ReactNode;
  subheading: ReactNode;
}

interface MockOakComponentProps {
  children: ReactNode;
}

jest.mock("@oaknational/oak-components", () => ({
  OakBasicAccordion: ({
    children,
    header,
    subheading,
  }: MockOakBasicAccordionProps) => (
    <div data-testid="oak-accordion">
      <div data-testid="accordion-header">{header}</div>
      <div data-testid="accordion-subheading">{subheading}</div>
      <div data-testid="accordion-content">{children}</div>
    </div>
  ),
  OakBox: ({ children }: MockOakComponentProps) => (
    <div data-testid="oak-box">{children}</div>
  ),
  OakHandDrawnHR: () => <hr data-testid="oak-hr" />,
  OakHeading: ({ children }: MockOakComponentProps) => (
    <h3 data-testid="oak-heading">{children}</h3>
  ),
  OakP: ({ children }: MockOakComponentProps) => (
    <p data-testid="oak-p">{children}</p>
  ),
}));

describe("CurricSEOAccordion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the accordion with the correct title", () => {
    mockUseMediaQuery.mockReturnValue(false);
    render(
      <CurricSEOAccordion
        curriculumSeoText={mockPortableTextBlocks}
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
        curriculumSeoText={mockPortableTextBlocks}
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
        curriculumSeoText={mockPortableTextBlocks}
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
        curriculumSeoText={mockPortableTextBlocks}
        subject={mockSubject}
      />,
    );

    const accordionHeader = screen.getByRole("heading", {
      name: /How to plan your English curriculum with Oak/i,
    });

    act(() => {
      accordionHeader.click();
    });

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
