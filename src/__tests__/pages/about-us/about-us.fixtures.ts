import { portableTextFromString, mockSeo } from "../../__helpers__/cms";

export const testAboutPageBaseData = {
  title: "About us",
  summaryPortableText: portableTextFromString("About page summary"),
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
  seo: mockSeo({
    title: "About Us",
    description: "We're doing the things that need to get done.",
  }),
};
