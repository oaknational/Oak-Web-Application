"use client";

import { OakBox, OakFlex } from "@oaknational/oak-components";
import styled from "styled-components";

import { NewsletterFormProps } from "@/components/GenericPagesComponents/NewsletterForm";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import NewsletterFormWrap from "@/components/GenericPagesComponents/NewsletterFormWrap";

type FormValues = Parameters<NewsletterFormProps["onSubmit"]>[0];

type TeachWithOakNewsletterFormProps = {
  id: string;
  onSubmit: (values: FormValues) => Promise<string | void>;
};

const NewsletterWrapper = styled(OakFlex)`
  max-width: 100%;
  margin: auto;

  @media (min-width: 750px) {
    max-width: 870px;
  }
`;

const TeachWithOakNewsletterForm = ({
  id,
  onSubmit,
}: TeachWithOakNewsletterFormProps) => {
  const newsletterFormProps = { id, onSubmit };
  return (
    <OakBox
      $background="bg-decorative1-subdued"
      $position="relative"
      $pv="spacing-56"
    >
      <NewGutterMaxWidth>
        <NewsletterWrapper>
          <NewsletterFormWrap desktopColSpan={6} {...newsletterFormProps} />
        </NewsletterWrapper>
      </NewGutterMaxWidth>
    </OakBox>
  );
};

export default TeachWithOakNewsletterForm;
