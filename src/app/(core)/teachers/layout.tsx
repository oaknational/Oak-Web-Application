import { SimulateErrorControls } from "@/app/components/ErrorHandling/SimulateErrorControls";

export default async function TeachersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SimulateErrorControls errorBoundaryLevel="core" />
      {children}
    </>
  );
}
