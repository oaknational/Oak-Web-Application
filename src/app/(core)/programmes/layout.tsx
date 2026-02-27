import { ModalSlotWrapper } from "./ModalSlotWrapper";

export default function ProgrammesLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <ModalSlotWrapper>{modal}</ModalSlotWrapper>
    </>
  );
}
