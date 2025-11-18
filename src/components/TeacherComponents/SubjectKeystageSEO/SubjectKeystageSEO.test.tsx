import { render, screen } from "@testing-library/react";

import { defaultText, ks4Text, SubjectKeystageSEO } from "./SubjectKeystageSEO";

describe("SubjectKeystageSEO", () => {
  it("should render correct text for ks1", () => {
    render(<SubjectKeystageSEO keystageSlug="ks1" />);
    const seoText = screen.getByTestId("subject-keystage-seo");
    expect(seoText).toHaveTextContent(defaultText);
  });
  it("should render correct text for ks2", () => {
    render(<SubjectKeystageSEO keystageSlug="ks2" />);
    const seoText = screen.getByTestId("subject-keystage-seo");
    expect(seoText).toHaveTextContent(defaultText);
  });
  it("should render correct text for ks3", () => {
    render(<SubjectKeystageSEO keystageSlug="ks3" />);
    const seoText = screen.getByTestId("subject-keystage-seo");
    expect(seoText).toHaveTextContent(defaultText);
  });
  it("should render correct text for ks4", () => {
    render(<SubjectKeystageSEO keystageSlug="ks4" />);
    const seoText = screen.getByTestId("subject-keystage-seo");
    expect(seoText).toHaveTextContent(ks4Text);
  });
});
