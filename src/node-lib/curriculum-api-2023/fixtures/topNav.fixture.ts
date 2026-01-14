import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";

export const topNavFixture: TopNavProps = {
  teachers: {
    primary: { phaseSlug: "primary", phaseTitle: "Primary", keystages: [] },
    secondary: {
      phaseSlug: "secondary",
      phaseTitle: "Secondary",
      keystages: [],
    },
    aboutUs: [],
    guidance: [],
  },
  pupils: {
    primary: { phaseSlug: "primary", phaseTitle: "Primary", years: [] },
    secondary: { phaseSlug: "secondary", phaseTitle: "Secondary", years: [] },
  },
};
