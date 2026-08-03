import {
  OakBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakSecondaryButton,
} from "@oaknational/oak-components";
import { Fragment } from "react";
import z from "zod";

import { NewGutterMaxWidth } from "../NewGutterMaxWidth";

import { oaksImpactPageStatsSectionSchema } from "@/common-lib/cms-types/aboutPages";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

export type OaksImpactStatsProps = z.infer<
  typeof oaksImpactPageStatsSectionSchema
>;
export function OaksImpactStats(props: Readonly<OaksImpactStatsProps>) {
  return (
    <OakFlex $background={"bg-decorative2-main"} $pv={"spacing-80"}>
      <NewGutterMaxWidth>
        <OakFlex
          $flexDirection={["column", "row", "row"]}
          $gap={["spacing-32", "spacing-16", "spacing-120"]}
        >
          <OakFlex
            $flexDirection={"column"}
            $pr={["spacing-32", "spacing-32", "spacing-0"]}
            $gap={"spacing-32"}
          >
            <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
              <OakHeading
                tag={"h2"}
                $color={"text-primary"}
                $font={"heading-3"}
              >
                {props.textBlock.title}
              </OakHeading>
              <OakBox
                $color={"text-primary"}
                $font={["body-2", "body-1", "body-1"]}
              >
                <PortableTextWithDefaults
                  value={props.textBlock.bodyPortableText}
                />
              </OakBox>
            </OakFlex>
            {props.textBlock.cta && (
              <OakSecondaryButton
                element="a"
                aria-label={`${props.textBlock.cta.label} (opens in a new tab)`}
                href={getLinkHref(props.textBlock.cta)}
                iconName={"external"}
                isTrailingIcon={true}
                target="_blank"
              >
                {props.textBlock.cta.label}
              </OakSecondaryButton>
            )}
          </OakFlex>
          <OakFlex $gap={"spacing-8"}>
            <OakFlex $flexDirection={"column"} $gap={"spacing-40"}>
              {props.stats.map((item, index) => {
                return (
                  <Fragment key={index}>
                    {index > 0 && (
                      <OakBox
                        $width="100%"
                        $background="bg-decorative2-very-subdued"
                        $height="spacing-2"
                        $borderRadius="border-radius-s"
                      />
                    )}
                    <OakFlex
                      $flexDirection={["column", "row", "row"]}
                      $borderRadius={"border-radius-m2"}
                      $gap={["spacing-20", "spacing-20", "spacing-32"]}
                      $alignItems={["flex-start", "center"]}
                    >
                      <OakBox
                        $minWidth="spacing-120"
                        $minHeight="spacing-120"
                        $width="spacing-120"
                        $height="spacing-120"
                      >
                        <OakImage
                          src={getProxiedSanityAssetUrl(
                            item.icon.asset?.url ?? "",
                          )}
                          alt={item.icon.altText ?? ""}
                          $aspectRatio={"1/1"}
                        />
                      </OakBox>
                      <OakFlex
                        $flexDirection={"column"}
                        $borderRadius={"border-radius-m2"}
                        $gap={"spacing-4"}
                      >
                        <OakBox
                          $color={"text-primary"}
                          $font={"heading-light-1"}
                        >
                          {item.heading}
                        </OakBox>
                        <OakBox $color={"text-primary"} $font={"body-1"}>
                          <PortableTextWithDefaults value={item.textRaw} />
                        </OakBox>
                      </OakFlex>
                    </OakFlex>
                  </Fragment>
                );
              })}
            </OakFlex>
          </OakFlex>
        </OakFlex>
      </NewGutterMaxWidth>
    </OakFlex>
  );
}
