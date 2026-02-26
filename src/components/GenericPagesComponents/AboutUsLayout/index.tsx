import { ReactNode } from "react";
import { OakBox, OakFlex } from "@oaknational/oak-components";
import styled from "styled-components";
import { useRouter } from "next/router";

import { WhoAreWeExplore } from "@/components/GenericPagesComponents/WhoAreWeExplore";
import NewsletterFormWrap from "@/components/GenericPagesComponents/NewsletterFormWrap";
import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import { resolveOakHref } from "@/common-lib/urls";

const NewsletterWrapper = styled(OakFlex)`
  max-width: 100%;
  justify-self: center;

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
      href: resolveOakHref({
        page: "about-who-we-are",
      }),
      componentType: "about_oak" as const,
    },
    {
      iconName: "homepage-teacher-map" as const,
      title: "Oak's curricula",
      href: resolveOakHref({
        page: "about-oaks-curricula",
      }),
      componentType: "about_curriculum" as const,
    },
    {
      iconName: "snack-break" as const,
      title: "Meet the team",
      href: resolveOakHref({
        page: "about-meet-the-team",
      }),
      componentType: "meet_the_team" as const,
    },
    {
      iconName: "chatting" as const,
      title: "Get involved",
      href: resolveOakHref({
        page: "about-get-involved",
      }),
      componentType: "get_involved" as const,
    },
  ];

  const filteredExploreItems = allExploreItems.filter(
    (item) => item.href !== currentPath,
  );

  return (
    <OakBox $zIndex={"neutral"} $color={"text-primary"}>
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
        id="newsletter-signup"
        $background={"bg-decorative1-subdued"}
        $pv={"spacing-56"}
      >
        <NewGutterMaxWidth>
          <NewsletterWrapper>
            <NewsletterFormWrap desktopColSpan={6} {...newsletterFormProps} />
          </NewsletterWrapper>
        </NewGutterMaxWidth>
      </OakBox>
    </OakBox>
  );
}
