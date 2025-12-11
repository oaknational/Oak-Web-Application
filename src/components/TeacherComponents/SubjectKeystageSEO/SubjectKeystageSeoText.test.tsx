import { screen } from "@testing-library/react";

import {
  defaultText,
  ks4Text,
  SubjectKeystageSeoText,
} from "./SubjectKeystageSeoText";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("SubjectKeystageSEO", () => {
  it("should render correct text for ks1", () => {
    render(<SubjectKeystageSeoText keystageSlug="ks1" />);
    const seoText = screen.getByTestId("subject-keystage-seo");
    expect(seoText).toHaveTextContent(defaultText);
  });
  it("should render correct text for ks2", () => {
    render(<SubjectKeystageSeoText keystageSlug="ks2" />);
    const seoText = screen.getByTestId("subject-keystage-seo");
    expect(seoText).toHaveTextContent(defaultText);
  });
  it("should render correct text for ks3", () => {
    render(<SubjectKeystageSeoText keystageSlug="ks3" />);
    const seoText = screen.getByTestId("subject-keystage-seo");
    expect(seoText).toHaveTextContent(defaultText);
  });
  it("should render correct text for ks4", () => {
    render(<SubjectKeystageSeoText keystageSlug="ks4" />);
    const seoText = screen.getByTestId("subject-keystage-seo");
    expect(seoText).toHaveTextContent(ks4Text);
  });
});
