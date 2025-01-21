import { render, screen } from "@testing-library/react";
import DOMPurify from "dompurify";

import { TeacherNoteInline } from "./TeacherNoteInline";

// Mock the oak-components to focus on sanitization testing
jest.mock("@oaknational/oak-components", () => ({
  OakFlex: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  OakHeading: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  OakTeacherNotesInline: ({ sanitizedHtml }: { sanitizedHtml: string }) => (
    <div
      data-testid="sanitized-content"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  ),
}));

// Spy on DOMPurify to verify it's being called
jest.spyOn(DOMPurify, "sanitize");

describe("TeacherNoteInline", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sanitizes HTML on initial render", () => {
    const unsafeHtml = '<p>Safe content</p><script>alert("unsafe")</script>';
    render(<TeacherNoteInline unsafeHtml={unsafeHtml} />);

    // Check that DOMPurify.sanitize was called with the unsafe HTML
    expect(DOMPurify.sanitize).toHaveBeenCalledWith(unsafeHtml);

    // Verify the sanitized content is rendered (script tag should be removed)
    const content = screen.getByTestId("sanitized-content");
    expect(content).toBeInTheDocument();
    expect(content.innerHTML).toContain("<p>Safe content</p>");
    expect(content.innerHTML).not.toContain("<script>");
  });

  it("sanitizes HTML when props update", () => {
    const { rerender } = render(
      <TeacherNoteInline unsafeHtml="<p>Initial</p>" />,
    );

    const newUnsafeHtml = '<p>Updated</p><script>alert("unsafe")</script>';
    rerender(<TeacherNoteInline unsafeHtml={newUnsafeHtml} />);

    // Check that DOMPurify.sanitize was called again with the new HTML
    expect(DOMPurify.sanitize).toHaveBeenCalledWith(newUnsafeHtml);

    const content = screen.getByTestId("sanitized-content");
    expect(content.innerHTML).toContain("<p>Updated</p>");
    expect(content.innerHTML).not.toContain("<script>");
  });

  it("returns null when unsafeHtml is not provided", () => {
    render(<TeacherNoteInline />);

    expect(screen.queryByTestId("sanitized-content")).not.toBeInTheDocument();
    expect(DOMPurify.sanitize).not.toHaveBeenCalled();
  });

  it("returns null when error is provided", () => {
    render(
      <TeacherNoteInline unsafeHtml="<p>Content</p>" error="Some error" />,
    );

    expect(screen.queryByTestId("sanitized-content")).not.toBeInTheDocument();
  });

  it("sanitizes complex HTML structure", () => {
    const unsafeHtml = `
      <div class="content">
        <p>Safe paragraph</p>
        <img src="safe.jpg" onerror="alert('xss')" />
        <iframe src="unsafe.html"></iframe>
        <a href="javascript:alert('xss')">Click me</a>
      </div>
    `;

    render(<TeacherNoteInline unsafeHtml={unsafeHtml} />);

    const content = screen.getByTestId("sanitized-content");
    expect(content.innerHTML).toContain('<div class="content">');
    expect(content.innerHTML).toContain("<p>Safe paragraph</p>");
    expect(content.innerHTML).toContain('<img src="safe.jpg">');
    expect(content.innerHTML).not.toContain("onerror");
    expect(content.innerHTML).not.toContain("<iframe");
    expect(content.innerHTML).not.toContain("javascript:");
  });
});
