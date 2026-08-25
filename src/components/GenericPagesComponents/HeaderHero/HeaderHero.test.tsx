import React from "react";
import "@testing-library/jest-dom";
import { OakLink } from "@oaknational/oak-components";

import { HeaderHero, HeaderHeroProps } from "./HeaderHero";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";


const oakHeaderProps: HeaderHeroProps = {
  headingTitle: "How to plan a lesson: a helpful guide for teachers",
  authorTitle: "Head of School Support",
  heroImageAlt: "Hero image",
  authorName: "Rachel Storm",
  authorImageSrc: "https://via.placeholder.com/150",
  authorImageAlt: "Author image",
  breadcrumbs: <OakLink href="/home">Home</OakLink>,
  subHeadingText:
    "Body 1 Our guide for teachers, whether you're in your ITT, an ECT or a teacher of many years experience looking for a fresh look on lesson planning, is place to dive into expertise from across the sector.",
  heroImageSrc: `https://${process.env.NEXT_PUBLIC_OAK_ASSETS_HOST}/${process.env.NEXT_PUBLIC_OAK_ASSETS_PATH}/v1698336490/sample.jpg`,
};

describe("HeaderHero", () => {
  it("renders", () => {
    const { getByTestId } = renderWithTheme(<HeaderHero {...oakHeaderProps} />);
    expect(getByTestId("oak-header-component")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = renderWithTheme(<HeaderHero {...oakHeaderProps} />);
    expect(container).toMatchSnapshot();
  });
});
