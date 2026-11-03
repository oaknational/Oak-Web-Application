import { portableTextFromString } from "@/__tests__/__helpers__/cms";

export const basic = {
  title: "How does it work?",
  steps: [
    {
      title: "Sign up",
      descriptionRaw: [
        {
          _key: "a55e350645a9",
          _type: "block",
          children: [
            {
              _key: "c3d11c92f107",
              _type: "span",
              marks: [],
              text: "Fill in our ",
            },
            {
              _key: "0a8ebf514309",
              _type: "span",
              marks: ["37521cb9bce4"],
              text: "sign-up form",
            },
            {
              _key: "2f90add3ceaf",
              _type: "span",
              marks: [],
              text: " with a few details about you.",
            },
          ],
          markDefs: [
            {
              _key: "37521cb9bce4",
              _type: "link",
              href: "https://example.com",
            },
          ],
          style: "normal",
        },
        {
          _key: "fb416f08375a",
          _type: "block",
          children: [
            {
              _key: "35cdeb6fdfa4",
              _type: "span",
              marks: [],
              text: "We'll email you if there's a research opportunity that matches your background and interests.",
            },
          ],
          markDefs: [],
          style: "normal",
        },
      ],
    },
    {
      title: "Take part",
      descriptionRaw: portableTextFromString(
        "You might be invited to share your teaching experiences, talk about how you use different resources, try out an early improvement idea, or give feedback on a topic we’re exploring.",
      ),
    },
    {
      title: "What happens next",
      descriptionRaw: portableTextFromString(
        "You will receive a retail voucher as a thank you for your time. You will remain part of the research panel for 2 years after signing up, so you may be contacted for other research opportunities (max 2 per year) unless you tell us otherwise.",
      ),
    },
  ],
  button: {
    label: "Join the research panel",
    linkType: "external",
    external: "https://share.hsforms.com/1dv2FiLvTQraZIZmhUUURmQbvumd",
  } as const,
};
