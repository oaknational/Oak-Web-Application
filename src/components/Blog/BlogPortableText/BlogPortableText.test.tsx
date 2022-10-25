import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";

import BlogPortableText from "./BlogPortableText";

const textAndMedia = [
  {
    _key: "9c579cd361f2",
    _type: "textAndMedia",
    alignMedia: "left",
    mediaType: "image",
    title: "text and media",
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
      _type: "cta",
      label: "CTA",
      linkType: "anchor",
      anchor: "formBlock",
    },
    image: {
      _type: "imageWithAltText",
      asset: {
        _type: "reference",
        _ref: "image-e773e8cf5a40205daacef9f97a9a6d45101eb0ae-720x480-png",
      },
      altText: "image alt text",
    },
  },
];

describe("components/BlogPortableText", () => {
  test("text and media renders an image", () => {
    const { getByAltText } = renderWithProviders(
      <BlogPortableText portableText={textAndMedia} />
    );

    const imageAltText = getByAltText("image alt text");

    expect(imageAltText).toBeInTheDocument();
  });
});
