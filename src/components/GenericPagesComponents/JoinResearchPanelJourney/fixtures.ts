import { portableTextFromString } from "@/__tests__/__helpers__/cms";

export const basic = {
  title: "How does it work?",
  steps: [
    {
      title: "Sign up",
      descriptionRaw: portableTextFromString(
        "Fill in our sign-up form with a few details about you. We'll email you if there's a research opportunity that matches your background and interests.",
      ),
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
