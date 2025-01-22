import { OakIconName } from "@oaknational/oak-components";

import { SharingMetadata } from "./getSharingMetadata";

export type ShareLinkConfig = {
  name: "Email" | "Google Classroom" | "Microsoft Teams" | "Copy link";
  network?: "email" | "google-classroom" | "microsoft-teams";
  medium: "social" | "email" | "lms" | "copy-link";
  avoMedium: "microsoft-teams" | "google-classroom" | "email" | "copy-link";
  icon: OakIconName;
  url: (params: SharingMetadata) => string;
};

export const shareLinkConfig: Record<
  "copy" | "googleClassroom" | "microsoftTeams" | "email",
  ShareLinkConfig
> = {
  copy: {
    name: "Copy link",
    medium: "copy-link",
    avoMedium: "copy-link",
    icon: "copy",
    url: ({ link }) => {
      return link;
    },
  },
  email: {
    name: "Email",
    network: "email",
    icon: "send",
    url: ({ urlEncodedPageTitle, urlEncodedShareStr }) => {
      return `mailto:?subject=${urlEncodedPageTitle}&body=${urlEncodedShareStr}`;
    },
    medium: "email",
    avoMedium: "email",
  },
  googleClassroom: {
    name: "Google Classroom",
    network: "google-classroom",
    icon: "google-classroom",
    url: ({ urlEncodedLink }) => {
      return `https://classroom.google.com/u/0/share?url=${urlEncodedLink}`;
    },
    medium: "lms",
    avoMedium: "google-classroom",
  },
  microsoftTeams: {
    name: "Microsoft Teams",
    network: "microsoft-teams",
    icon: "microsoft-teams",
    url: ({ urlEncodedLink, urlEncodedPageTitle }) => {
      return `https://teams.microsoft.com/share?href=${urlEncodedLink}&text=${urlEncodedPageTitle}`;
    },
    medium: "lms",
    avoMedium: "microsoft-teams",
  },
};
