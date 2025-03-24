/** @ts-nocheck */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/named */

import path from "path";

import { OakBox } from "@oaknational/oak-components";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import type { ComponentProps } from "react";

// Multi line import
import {
  SelectedArea,
  siteAreas,
} from "@/components/AppComponents/AppHeader/AppHeader";
// Multi line type import
import type {
  SelectedArea as AppHeaderSelectedArea,
  siteAreas as AppHeaderSiteAreas,
} from "@/components/AppComponents/AppHeader/AppHeader";
/** @ts-expect-error -- These aren't real paths */
import { formatDate } from "@/utils/formatDate";

/** @ts-expect-error -- These aren't real paths */
import { SomeComponent } from "../components/SomeComponent";

/** @ts-expect-error -- These aren't real paths */
import { AnotherComponent } from "./AnotherComponent";

/** @ts-expect-error -- These aren't real paths */
import { SomethingElse } from ".";
