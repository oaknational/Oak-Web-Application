"use client";
import { OakFlex, OakMaxWidth } from "@oaknational/oak-components";
import React from "react";

import RegistrationAside from "@/components/TeacherComponents/RegistrationAside/ResgistrationAside";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <OakFlex
      $background={["white", "bg-decorative1-main"]}
      $overflow="auto"
      $color="black"
    >
      <OakMaxWidth
        $justifyContent={"center"}
        $minHeight={"100vh"}
        $alignItems={["flex-start", "center"]}
        $flexDirection="row"
        $pv={["inner-padding-none", "inner-padding-xl3"]}
      >
        <OakFlex
          $display={["none", "none", "flex"]}
          $flexGrow={1}
          $justifyContent="flex-end"
          $order={2}
        >
          <RegistrationAside />
        </OakFlex>
        <OakFlex $display="block" $order={1} style={{ width: "400px" }}>
          {children}
        </OakFlex>
      </OakMaxWidth>
    </OakFlex>
  );
};

export default Layout;
