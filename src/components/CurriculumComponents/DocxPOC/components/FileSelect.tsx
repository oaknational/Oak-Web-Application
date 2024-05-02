import { MutableRefObject, useRef } from "react";
import { OakPrimaryButton } from "@oaknational/oak-components";

interface FileSelectProps {
  onChange: (file: File) => void;
  label: string;
}

export default function FileSelect({ onChange, label }: FileSelectProps) {
  const hiddenFileInputRef: MutableRefObject<null | HTMLInputElement> =
    useRef(null);

  const handleFileSelect = () => {
    hiddenFileInputRef.current?.click();
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target?.files?.[0]) {
      return;
    }
    onChange(event.target.files[0]);
  };

  return (
    <>
      <OakPrimaryButton onClick={handleFileSelect} iconName="rocket">
        {label}
      </OakPrimaryButton>
      <input
        type="file"
        ref={hiddenFileInputRef}
        onChange={handleFileInputChange}
        hidden
      />
    </>
  );
}
