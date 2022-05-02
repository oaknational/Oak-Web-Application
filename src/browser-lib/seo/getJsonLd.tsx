import { FC } from "react";
import {
  CourseJsonLd as CourseJsonLdNextSeo,
  CourseJsonLdProps,
  BreadcrumbJsonLd as BreadcrumbsJsonLdNextSeo,
  BreadCrumbJsonLdProps,
  OrganizationJsonLd as OrganizationJsonLdNextSeo,
} from "next-seo";

import { Breadcrumb } from "../../components/Breadcrumbs/Breadcrumbs";
import config from "../../config";

const courseProvider = {
  name: config.get("appName"),
  url: config.get("appUrl"),
};

// Organization

export const OrganizationJsonLd = () => {
  return (
    <OrganizationJsonLdNextSeo
      name={config.get("appName")}
      url={config.get("appUrl")}
      sameAs={[config.get("appFacebook"), config.get("appTwitter")]}
      logo={config.get("appLogo")}
    />
  );
};

// Course logo

interface CourseProps extends CourseJsonLdProps {
  provider: boolean;
}

export const CourseJsonLd: FC<CourseProps> = (props) => {
  return CourseJsonLdNextSeo({ ...props, provider: { ...courseProvider } });
};

// Breadcrumbs

interface BreadcrumbProps extends BreadCrumbJsonLdProps {
  itemListElements: Breadcrumb[];
}

export const BreadcrumbJsonLd: FC<BreadcrumbProps> = (props) => {
  const breadcrumbsForJsonLd = props.itemListElements.map((i, index) => ({
    position: index + 1,
    name: i.label,
    item: i.href,
  }));

  return BreadcrumbsJsonLdNextSeo({
    ...props,
    itemListElements: breadcrumbsForJsonLd,
  });
};
