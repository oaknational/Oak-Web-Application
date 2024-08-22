import { OakFlex, OakMaxWidth } from "@oaknational/oak-components";
import { PropsWithChildren, ReactNode } from "react";

type RegistrationLayoutProps = PropsWithChildren<{
  asideSlot: ReactNode;
}>;

export const RegistrationLayout = ({
  children,
  asideSlot,
}: RegistrationLayoutProps) => {
  return (
    <OakFlex $background={["white", "bg-decorative1-main"]} $overflow="auto">
      <OakMaxWidth
        $justifyContent={"center"}
        $minHeight={"100vh"}
        $alignItems={["flex-start", "center"]}
        $flexDirection="row"
      >
        <OakFlex
          $display={["none", "none", "flex"]}
          $flexGrow={1}
          $justifyContent="flex-end"
          $order={2}
        >
          {asideSlot}
        </OakFlex>
        <OakFlex $display="block" $order={1} style={{ width: "400px" }}>
          {children}
        </OakFlex>
      </OakMaxWidth>
    </OakFlex>
  );
};
