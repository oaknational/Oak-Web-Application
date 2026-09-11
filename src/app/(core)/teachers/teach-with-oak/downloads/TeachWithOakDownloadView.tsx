"use client";
import { resolveOakHref } from "@/common-lib/urls";
import Banners from "@/components/SharedComponents/Banners";
import {
  OakBox,
  OakBreadcrumbs,
  OakHandDrawnHR,
  OakMaxWidth,
} from "@oaknational/oak-components";
import { useState } from "react";

export const TeachWithOakDownloadView = () => {
  const [isDownloadSuccessful, setIsDownloadSuccessful] = useState(false);

  return (
    <OakBox $ph={["spacing-16", "spacing-0"]} $background={"bg-neutral"}>
      {isDownloadSuccessful && <Banners />}
      <OakMaxWidth
        $pb="spacing-80"
        $maxWidth={["spacing-480", "spacing-960", "spacing-1280"]}
      >
        <OakBox
          $mb={isDownloadSuccessful ? "spacing-0" : "spacing-32"}
          $mt={"spacing-24"}
        >
          <OakBreadcrumbs
            breadcrumbs={[
              {
                text: "Teach with Oak",
                href: resolveOakHref({ page: "teach-with-oak" }),
              },
              { text: "Download" },
            ]}
          />
          <OakHandDrawnHR
            hrColor={"text-subdued"}
            $height={"spacing-4"}
            $mt={"spacing-24"}
            $mb={"spacing-24"}
          />
        </OakBox>
      </OakMaxWidth>
    </OakBox>
  );
};
