import { screen, waitFor } from "@testing-library/react";

import renderWithProviders from "../__helpers__/renderWithProviders";
import AboutWhoWeAre from "../../pages/about-us/who-we-are";
import { AboutPage } from "../../node-lib/cms";
import { portableTextFromString } from "../__helpers__/cms";

export const testAboutPageData: AboutPage = {
  title: "About Oak",
  whoWeAre: {
    sectionHeading: "Who we are",
    intro: {
      title: "IGNORE THIS TITLE - Need to configure hidden fields",
      bodyPortableText: portableTextFromString("text"),
      cta: {
        label: "Blog about plans",
        linkType: "internal",
        internal: {
          contentType: "newsPost",
          slug: "some-blog-post",
        },
      },
      alignMedia: "left",
      mediaType: "video",
      video: {
        title:
          "Some video from the library because it's the only one I can find",
        video: {
          asset: {
            assetId: "ByqZ4KA9mLdyrtWnAvRMHbcQnNk2uUnf3NNdahrey5o",
            playbackId: "5VfBnOXD87KnXMJrYNG6HtCIizY6q6thP5EjjqkU1kI",
          },
        },
      },
    },
    timeline: {
      from: {
        title: "From Here",
        bodyPortableText: portableTextFromString("text"),
        cta: {
          label: "Blog about plans",
          linkType: "internal",
          internal: {
            contentType: "newsPost",
            slug: "some-blog-post",
          },
        },
      },
      to: {
        title: "To Here",
        bodyPortableText: portableTextFromString("text"),
        cta: null,
      },
      beyond: {
        title: "And Beyond",
        bodyPortableText: portableTextFromString("text"),
        cta: {
          label: "blog about plans",
          linkType: "internal",
          internal: {
            contentType: "newsPost",
            slug: "some-blog-post",
          },
        },
      },
      cta: {
        label: "Blog about plans",
        linkType: "internal",
        internal: {
          contentType: "newsPost",
          slug: "some-blog-post",
        },
      },
    },
    principles: [
      {
        title: "Independent",
        bodyPortableText: portableTextFromString("text"),
        cta: null,
      },
      {
        title: "Optional",
        bodyPortableText: portableTextFromString("text"),
        cta: null,
      },
      {
        title: "Adaptable",
        bodyPortableText: portableTextFromString("text"),
        cta: null,
      },
      {
        title: "Free",
        bodyPortableText: portableTextFromString("text"),
        cta: null,
      },
    ],
  },
  leadership: {
    sectionHeading: "Leadership",
    introPortableText: portableTextFromString("text"),
  },
  board: {
    sectionHeading: "Board",
    introPortableText: [
      {
        _key: "fba015024518",
        _type: "block",
        children: [
          {
            _key: "e55d6209321d0",
            _type: "span",
            marks: [],
            text: "Our interim board oversees all of Oak’s work. They provide strategic direction, enable us to deliver on our plans, scrutinise our work and safeguard our independence. The interim board will be in place whilst a permanent board is chosen through a public appointments process.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
    documents: [
      {
        title:
          "Oak National Academy annual report and accounts for the period ended XX Month 2022",
        file: {
          asset: {
            extension: "pdf",
            size: 16758977,
            url: "/",
          },
        },
      },
    ],
    governancePortableText: [
      {
        _key: "f6c75b7124d5",
        _type: "block",
        children: [
          {
            _key: "4a23014a5ea40",
            _type: "span",
            marks: [],
            text: "Oak National Academy is a limited company incorporated under the Companies Act 2006 in September 2022 and whose sole shareholder is the Secretary of State for Education. It is a non-departmental public body (NDPB) which was established to work with schools, teachers and the wider education system and has a framework agreement with the Department for Education",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
  },
  partners: {
    sectionHeading: "Partners",
    introPortableText: [
      {
        _key: "c740fe769b64",
        _type: "block",
        children: [
          {
            _key: "6cc9a2ce3bde0",
            _type: "span",
            marks: [],
            text: "From humble roots, we’ve grown into a national resource, supporting millions of teachers and pupils. It wouldn’t have been possible without the brilliant work of the talented teachers, curriculum partners and technology partners that have supported us. Thank you.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
    techPartners: [
      {
        asset: {
          _id: "image-060531729f9bc7fc836bdf87b9b80c4995247d5c-158x52-svg",
          url: "https://cdn.sanity.io/images/cuvjke51/feat-about-page/060531729f9bc7fc836bdf87b9b80c4995247d5c-158x52.svg",
        },
        name: "Some tech partner",
      },
    ],
    curriculumPartners: [
      {
        asset: {
          _id: "image-06e8cb0660bed44fd0e139a62ce6ccc6d590c959-300x300-png",
          url: "https://cdn.sanity.io/images/cuvjke51/production/06e8cb0660bed44fd0e139a62ce6ccc6d590c959-300x300.png",
        },
        name: "Some partner",
      },
    ],
  },
  workWithUs: {
    sectionHeading: "Work with us",
    introPortableText: [
      {
        _key: "24e20ee072ab",
        _type: "block",
        children: [
          {
            _key: "beefb74c12ee0",
            _type: "span",
            marks: [],
            text: "We’re excited to be at the heart of this new national collaboration, but no one can do this alone. A team is required. So if you’re as excited as we are – brilliant. We want to hear from you. There’s lots of ways to get involved - find out more below.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
    cards: {
      joinTheTeam: {
        title: "Join the Oak team ",
        bodyPortableText: [
          {
            _key: "8230db06a2de",
            _type: "block",
            children: [
              {
                _key: "1654a5ff63560",
                _type: "span",
                marks: [],
                text: "We're hiring! If you share our values, and want to help make a difference, then join one of our remote-based teams: Education, Operations, Product & Engineering and School Support\n",
              },
            ],
            markDefs: [],
            style: "normal",
          },
        ],
        image: null,
      },
      advisory: {
        title: "Advisory Groups",
        bodyPortableText: [
          {
            _key: "23a341ac20cd",
            _type: "block",
            children: [
              {
                _key: "e0be8b5862840",
                _type: "span",
                marks: [],
                text: "We're looking for a diverse range of experts to assess the evidence, and agree rigorous quality standards, specific for each subject.",
              },
            ],
            markDefs: [],
            style: "normal",
          },
        ],
        image: null,
      },
      curriculumPartner: {
        title: "Become a Curriculum Partner",
        bodyPortableText: [
          {
            _key: "b914c3fc016d",
            _type: "block",
            children: [
              {
                _key: "6e009e4fed9c0",
                _type: "span",
                marks: [],
                text: "If you've got a great curriculum, we'll be selecting partners to work with us across 14 subjects areas: Primary and Secondary Maths, Science, English, History, Geography and Music. [hubspot form].",
              },
            ],
            markDefs: [],
            style: "normal",
          },
        ],
        image: null,
      },
      teacherResearch: {
        title: "Take part in teacher research",
        bodyPortableText: [
          {
            _key: "d65ecf3e50f4",
            _type: "block",
            children: [
              {
                _key: "c1aabcae9b7b0",
                _type: "span",
                marks: [],
                text: "Oak has always listened and responded to teachers; have your say by taking part in research with us, or by road-testing our resources in your school [hubspot form].",
              },
            ],
            markDefs: [],
            style: "normal",
          },
        ],
        image: null,
      },
    },
  },
  contactSection: {
    infoPortableText: [
      {
        _key: "e0c6f10a0bae",
        _type: "block",
        children: [
          {
            _key: "16137e0bde570",
            _type: "span",
            marks: ["strong"],
            text: "General enquiries",
          },
          {
            _key: "b582301fb277",
            _type: "span",
            marks: [],
            text: "\nFor general enquiries and help please email help@thenational.academy.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _key: "71550ecd4198",
        _type: "block",
        children: [
          {
            _key: "b2e4daa056f3",
            _type: "span",
            marks: [],
            text: "\n",
          },
          {
            _key: "ce05d051065d",
            _type: "span",
            marks: ["strong"],
            text: "Media enquiries",
          },
          {
            _key: "189f67954654",
            _type: "span",
            marks: [],
            text: "\nFor media enquiries, please contact media@thenational.academy.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _key: "8899b1fff883",
        _type: "block",
        children: [
          {
            _key: "bcf96460c3ca",
            _type: "span",
            marks: [],
            text: "\n",
          },
          {
            _key: "813237286594",
            _type: "span",
            marks: ["strong"],
            text: "Get support",
          },
          {
            _key: "2931ce4285fa",
            _type: "span",
            marks: [],
            text: "\nYou’ll find lots of help and support for teachers, schools, pupils and parents in our ",
          },
          {
            _key: "37c37aae53f3",
            _type: "span",
            marks: ["9f907ea04c75"],
            text: "Help Centre",
          },
          {
            _key: "4b8a6dd13f39",
            _type: "span",
            marks: [],
            text: ".",
          },
        ],
        markDefs: [
          {
            _key: "9f907ea04c75",
            _type: "link",
            href: "https://support.thenational.academy/",
          },
        ],
        style: "normal",
      },
    ],
  },
  id: "aboutCorePage",
};

describe("pages/about us who we arew.tsx", () => {
  it("Renders correct title ", async () => {
    renderWithProviders(
      <AboutWhoWeAre
        renderPlayer={false}
        pageData={testAboutPageData}
        isPreviewMode={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "about us"
      );
    });
  });
});
