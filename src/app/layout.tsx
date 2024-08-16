/* istanbul ignore file */
import { ClerkProvider } from "@clerk/nextjs";

import { OakThemeProvider, oakDefaultTheme } from "@/styles/oakThemeApp";

export const metadata = {
  title: "Oak National Academy",
  description:
    "Explore thousands of high-quality resources for lesson planning and curriculum design. All optional, adaptable and free.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: "0px" }}>
        <OakThemeProvider theme={oakDefaultTheme}>
          <ClerkProvider>{children}</ClerkProvider>
        </OakThemeProvider>
      </body>
    </html>
  );
}
