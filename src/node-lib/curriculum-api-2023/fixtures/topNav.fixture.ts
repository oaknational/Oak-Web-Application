import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { OakLinkPropsSimple } from "@/common-lib/urls";

export const topNavFixture: TopNavProps = {
  teachers: {
    primary: { phaseSlug: "primary", phaseTitle: "Primary", keystages: [] },
    secondary: {
      phaseSlug: "secondary",
      phaseTitle: "Secondary",
      keystages: [],
    },
    aboutUs: [
      {
        slug: "about-us/who-we-are" as OakLinkPropsSimple["page"],
        title: "Who we are",
      },
      {
        slug: "about-us/our-mission" as OakLinkPropsSimple["page"],
        title: "Our mission",
      },
    ],
    guidance: [
      {
        slug: "guidance/teaching-tips" as OakLinkPropsSimple["page"],
        title: "Teaching tips",
      },
      {
        slug: "guidance/safeguarding" as OakLinkPropsSimple["page"],
        title: "Safeguarding",
      },
    ],
  },
  pupils: {
    primary: { phaseSlug: "primary", phaseTitle: "Primary", years: [] },
    secondary: { phaseSlug: "secondary", phaseTitle: "Secondary", years: [] },
  },
};
