"use client";

import { OakBox, OakFlex } from "@oaknational/oak-components";
import styled from "styled-components";

import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import NewsletterFormWrap from "@/components/GenericPagesComponents/NewsletterFormWrap";

const NewsletterWrapper = styled(OakFlex)`
  max-width: 100%;
  margin: auto;

  @media (min-width: 750px) {
    max-width: 870px;
  }
`;

const TeachWithOakNewsletterForm = () => {
  const { onSubmit } = useNewsletterForm();
  return (
    <OakBox
      $background="bg-decorative1-subdued"
      $position="relative"
      $pv="spacing-56"
    >
      <NewGutterMaxWidth>
        <NewsletterWrapper>
          <NewsletterFormWrap desktopColSpan={6} onSubmit={onSubmit} />
        </NewsletterWrapper>
      </NewGutterMaxWidth>
    </OakBox>
  );
};

export default TeachWithOakNewsletterForm;
