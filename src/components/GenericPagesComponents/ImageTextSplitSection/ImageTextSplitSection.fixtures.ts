import { ImageTextSplitSectionProps } from "./index";

import { portableTextFromString } from "@/__tests__/__helpers__/cms";

export const imageTextSplitSectionBlockFixture = (
  title?: string,
  body?: string,
  imagePosition?: "left" | "right",
): ImageTextSplitSectionProps => ({
  title: title ?? "Join the research panel",
  image: {
    asset: {
      _id: "image-7499298e050630504fc8eb15bb8de2c864942575-633x486-png",
      url: "https://cdn.sanity.io/images/cuvjke51/production/7499298e050630504fc8eb15bb8de2c864942575-633x486.png",
    },
  },
  imagePosition,
  bodyRaw: portableTextFromString(body ?? "Join the research panel"),
});

export const imageTextSplitSectionWithBulletListFixture =
  (): ImageTextSplitSectionProps => ({
    ...imageTextSplitSectionBlockFixture("How it works"),
    bodyRaw: [
      ...[
        "Answer a questionnaire about your current curriculum. You can save your progress and return later.",
        "Receive a personalised, downloadable report highlighting areas that may need further review, along with suggested next steps and relevant guidance.",
      ].map((text, index) => ({
        ...portableTextFromString(text)[0],
        _key: `step-${index}`,
        listItem: "bullet",
        level: 1,
      })),
    ],
  });

export const imageTextSplitSectionWithLinkFixture =
  (): ImageTextSplitSectionProps => ({
    ...imageTextSplitSectionBlockFixture("How it works"),
    bodyRaw: [
      {
        ...portableTextFromString("View an example report")[0],
        _key: "example-report",
        markDefs: [
          {
            _key: "report-link",
            _type: "link",
            href: "https://cdn.sanity.io/files/cuvjke51/production/example-report.pdf",
          },
        ],
        children: [
          {
            _type: "span",
            _key: "report-text",
            marks: ["report-link"],
            text: "View an example report",
          },
        ],
      },
    ],
  });

export const imageTextSplitSectionWithNumberedListFixture =
  (): ImageTextSplitSectionProps => ({
    ...imageTextSplitSectionBlockFixture("How it works"),
    bodyRaw: [
      ...[
        "Answer a questionnaire about your current curriculum. You can save your progress and return later.",
        "Receive a personalised, downloadable report highlighting areas that may need further review, along with suggested next steps and relevant guidance.",
      ].map((text, index) => ({
        ...portableTextFromString(text)[0],
        _key: `step-${index}`,
        listItem: "number",
        level: 1,
      })),
    ],
  });
