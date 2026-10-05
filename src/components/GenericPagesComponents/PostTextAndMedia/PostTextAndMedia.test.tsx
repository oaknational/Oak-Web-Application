import PostTextAndMedia, { PostTextAndMediaProps } from "./PostTextAndMedia";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const textAndMedia: NonNullable<PostTextAndMediaProps["value"]> = {
  alignMedia: "left",
  mediaType: "image",
  title: "Text and media title",
  body: [
    {
      _type: "block",
      _key: "af3f0b635ef1",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "f44d2133da69",
          text: "Text and media body text",
          marks: [],
        },
      ],
    },
  ],
  cta: {
    label: "Read more",
    linkType: "anchor",
    anchor: "more-information",
  },
  image: {
    asset: {
      _id: "image-586258ca4b3b23d1a6fc47979841e5a5eb3dc36c-320x256-png",
      url: "https://cdn.sanity.io/images/cuvjke51/production/586258ca4b3b23d1a6fc47979841e5a5eb3dc36c-320x256.png",
    },
    altText: "Text and media image",
  },
};

describe("PostTextAndMedia", () => {
  it("should render correctly", () => {
    const render = renderWithProviders();
    const { getByRole, getByText, getByAltText } = render(
      <PostTextAndMedia
        value={textAndMedia}
        index={0}
        isInline={false}
        renderNode={() => null}
      />,
    );

    expect(
      getByRole("heading", { level: 2, name: "Text and media title" }),
    ).toBeInTheDocument();
    expect(getByText("Text and media body text")).toBeInTheDocument();
    expect(getByRole("link", { name: "Read more" })).toHaveAttribute(
      "href",
      "/#more-information",
    );
    expect(getByAltText("Text and media image")).toBeInTheDocument();
  });
});
