import {
  OakCard,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakLink,
} from "@oaknational/oak-components";

import { NewGutterMaxWidth } from "../NewGutterMaxWidth";

import { OakUiColorToken } from "@/__tests__/__helpers__/getOakUiColor";
import { SerializedBlogPostPreview } from "@/common-lib/cms-types/blog";
import { resolveOakHref } from "@/common-lib/urls";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import formatDate from "@/utils/formatDate";

export type BlogsPreviewProps = {
  title: string;
  label: string;
  blogs: SerializedBlogPostPreview[];
  blogPostCategorySlug?: string;
  backgroundColor?: OakUiColorToken;
};

export function BlogsPreview({
  title,
  label,
  blogs,
  blogPostCategorySlug,
  backgroundColor,
}: Readonly<BlogsPreviewProps>) {
  return (
    <NewGutterMaxWidth>
      <OakFlex
        $flexDirection={"column"}
        $background={backgroundColor}
        $borderRadius={"border-radius-m2"}
        $gap={["spacing-8", "spacing-0"]}
      >
        <OakFlex
          $alignItems={["flex-start", "center"]}
          $justifyContent={"space-between"}
          $pt="spacing-32"
          $ph="spacing-16"
          $flexDirection={["column", "row"]}
          $gap="spacing-24"
        >
          <OakHeading tag="h2" $font={["heading-5", "heading-4"]}>
            {title}
          </OakHeading>
          <OakLink
            variant="secondary"
            href={resolveOakHref({
              page: "blog-index",
              categorySlug: blogPostCategorySlug,
            })}
            $font="heading-7"
            iconName="chevron-right"
            isTrailingIcon
          >
            {label}
          </OakLink>
        </OakFlex>
        <OakGrid
          as="ul"
          $cg={"spacing-16"}
          $rg={"spacing-16"}
          $pa={"spacing-16"}
          $ma={"spacing-0"}
        >
          {blogs.map((blog) => (
            <OakGridArea as="li" key={blog.id} $colSpan={[12, 4]}>
              <OakCard
                heading={blog.title}
                subCopy={formatDate(blog.date)}
                href={resolveOakHref({
                  page: "blog-single",
                  blogSlug: blog.slug,
                })}
                imageSrc={getProxiedSanityAssetUrl(
                  blog.mainImage?.asset?.url ?? "",
                )}
                aspectRatio="4/3"
              />
            </OakGridArea>
          ))}
        </OakGrid>
      </OakFlex>
    </NewGutterMaxWidth>
  );
}
