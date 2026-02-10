import { ReactNode } from "react";
import { OakBox, OakMaxWidth } from "@oaknational/oak-components";
import styled from "styled-components";
import { useRouter } from "next/router";

import { WhoAreWeExplore } from "@/components/GenericPagesComponents/WhoAreWeExplore";
import NewsletterFormWrap from "@/components/GenericPagesComponents/NewsletterFormWrap";
import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";

const NewsletterWrapper = styled(OakBox)`
  max-width: 100%;

  @media (min-width: 750px) {
    max-width: 870px;
  }
`;

export type AboutUsLayoutProps = {
  children: ReactNode;
};

export function AboutUsLayout({ children }: Readonly<AboutUsLayoutProps>) {
  const newsletterFormProps = useNewsletterForm();
  const router = useRouter();
  const currentPath = router.pathname;

  const allExploreItems = [
    {
      iconName: "logo" as const,
      title: "About Oak",
      href: "/about-us/who-we-are",
    },
    {
      iconName: "homepage-teacher-map" as const,
      title: "Oak's curricula",
      href: "/about-us/oaks-curricula",
    },
    // {
    //   iconName: "data" as const,
    //   title: "Oak's impact",
    //   href: "#",
    // },
    {
      iconName: "snack-break" as const,
      title: "Meet the team",
      href: "/about-us/meet-the-team",
    },
    {
      iconName: "chatting" as const,
      title: "Get involved",
      href: "/about-us/get-involved",
    },
  ];

  const filteredExploreItems = allExploreItems.filter(
    (item) => item.href !== currentPath,
  );

  return (
    <OakBox $zIndex={"neutral"}>
      {children}
      <OakBox
        $overflow={"hidden"}
        $pt={"spacing-72"}
        style={{ marginTop: "-72px" }}
      >
        <WhoAreWeExplore
          title={"Explore more about Oak"}
          items={filteredExploreItems}
        />
      </OakBox>
      <OakBox
        $background={"bg-decorative1-subdued"}
        $pv={["spacing-56", "spacing-56"]}
      >
        <OakMaxWidth $ph={"spacing-16"} $alignItems={"center"}>
          <NewsletterWrapper>
            <NewsletterFormWrap desktopColSpan={6} {...newsletterFormProps} />
          </NewsletterWrapper>
        </OakMaxWidth>
      </OakBox>
    </OakBox>
  );
}
