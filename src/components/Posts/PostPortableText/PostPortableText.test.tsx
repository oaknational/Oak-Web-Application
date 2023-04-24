import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";

import PostPortableText from "./PostPortableText";

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

const quote = [
  {
    _key: "b9955be0a1c7",
    _type: "quote",
    attribution: "Professor Dylan Wiliam",
    role: "Emeritus Professor of Educational Assessment, UCL",
    text: "The best curricula generate at least 25% more learning than the worst, irrespective of teacher quality.",
  },
];

const callout = {
  _key: "1de5bdd05892",
  _type: "callout",
  body: [
    {
      _type: "block",
      _key: "889bbab67157",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "9dd2c19278b1",
          text: "I'm a callout out!",
          marks: [],
        },
      ],
    },
  ],
};

const render = renderWithProviders();

describe("components/PostPortableText", () => {
  test("text and media renders an image", () => {
    const { getByAltText } = render(
      <PostPortableText portableText={textAndMedia} />
    );

    const imageAltText = getByAltText("image alt text");

    expect(imageAltText).toBeInTheDocument();
  });
  test("image with alt text has alt text", () => {
    const { getByAltText } = render(
      <PostPortableText portableText={[textAndMedia[0]?.image]} />
    );

    const imageAltText = getByAltText("image alt text");

    expect(imageAltText).toBeInTheDocument();
  });
  test("quote renders a quote", () => {
    const { getByText } = render(<PostPortableText portableText={quote} />);

    const quoteText = getByText(
      "“The best curricula generate at least 25% more learning than the worst, irrespective of teacher quality.”"
    );

    expect(quoteText).toBeInTheDocument();
  });
  test("cta renders a button with a label", () => {
    const { getByText } = render(
      <PostPortableText portableText={[textAndMedia[0]?.cta]} />
    );

    const ctaLabel = getByText("CTA");

    expect(ctaLabel).toBeInTheDocument();
  });
  test("callout has styled background", () => {
    const { getByText } = render(<PostPortableText portableText={[callout]} />);

    const calloutText = getByText("I'm a callout out!").closest("div");

    expect(calloutText).toHaveStyle("background-color: #f6e8a0");
  });
});
