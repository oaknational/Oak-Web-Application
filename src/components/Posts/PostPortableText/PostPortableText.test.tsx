import { within } from "@testing-library/react";

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

const form = {
  title: "This is a form!",
  formId: "c9ce863c-3772-43ab-9b2e-67d0a8f60427",
  _type: "formWrapper",
  _key: "12ff6959bfa1",
  body: [
    {
      style: "normal",
      _key: "2415bcf01eaa",
      markDefs: [],
      _type: "block",
      children: [
        {
          marks: [],
          text: "And here is the form",
          _key: "aea98489d263",
          _type: "span",
        },
      ],
    },
  ],
};

const withFootnotes = [
  {
    _key: "8ca83ed025d9",
    _type: "block",
    children: [
      {
        _key: "961f4245c5de",
        _type: "span",
        marks: [],
        text: "Here's some ",
      },
      {
        _key: "01b7b284ab9d",
        _type: "span",
        marks: ["FOOTNOTE_MARK_1"],
        text: "text with a footnote",
      },
    ],
    markDefs: [
      {
        _key: "FOOTNOTE_MARK_1",
        _type: "footnote",
        label: "The citation for the first footnote",
      },
    ],
    style: "normal",
  },
  {
    _key: "84afb418873c",
    _type: "block",
    children: [
      {
        _key: "d0819dac8f29",
        _type: "span",
        marks: ["FOOTNOTE_MARK_2"],
        text: "and a second footnote",
      },
    ],
    markDefs: [
      {
        _key: "FOOTNOTE_MARK_2",
        _type: "footnote",
        label: "And the second, with a link",
        source: "https://example.com",
      },
    ],
    style: "normal",
  },
];

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
  test("formWrapper renders a newsletter form", () => {
    const { getByText } = render(<PostPortableText portableText={[form]} />);

    const heading = getByText("This is a form!");
    const submitButton = getByText("Sign up");

    expect(heading).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
  describe("footnotes", () => {
    test("footnote links are rendered inline", () => {
      const { getAllByRole } = render(
        <PostPortableText portableText={withFootnotes} />
      );

      const footnoteLinks = getAllByRole("doc-noteref");

      expect(footnoteLinks).toHaveLength(2);
      expect(footnoteLinks[0]).toHaveAttribute(
        "href",
        "#footnote-ref-FOOTNOTE_MARK_1"
      );
    });
    test("footnote references are rendered with backlinks", () => {
      const { getByRole } = render(
        <PostPortableText portableText={withFootnotes} />
      );

      const footnotes = within(getByRole("doc-endnotes")).getAllByRole(
        "listitem"
      );

      expect(footnotes[0]).toHaveTextContent(
        "The citation for the first footnote"
      );

      const firstFootnoteBacklink = within(
        footnotes[0] as HTMLElement
      ).getByRole("doc-backlink");

      expect(firstFootnoteBacklink).toHaveAttribute(
        "href",
        "#footnote-note-FOOTNOTE_MARK_1"
      );

      const footnoteWithSource = within(footnotes[1] as HTMLElement).getByRole(
        "link"
      );
      expect(footnoteWithSource).toHaveAttribute("href", "https://example.com");
    });

    test("does not render the footnotes section when none exist", () => {
      const { queryByRole } = render(
        <PostPortableText portableText={textAndMedia} />
      );

      const footnotesSection = queryByRole("doc-endnotes");
      expect(footnotesSection).not.toBeInTheDocument();
    });
  });
});
