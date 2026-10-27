import type { ReactNode } from "react";

import { ProgrammeNavigationProvider } from "./ProgrammeNavigationProvider";

export default function ProgrammesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <ProgrammeNavigationProvider>{children}</ProgrammeNavigationProvider>;
}
