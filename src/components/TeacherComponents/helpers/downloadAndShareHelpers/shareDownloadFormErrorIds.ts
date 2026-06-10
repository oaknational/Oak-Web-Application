import { InputHTMLAttributes } from "react";

export const SHARE_FORM_ERROR_IDS = {
  resources: "downloads-error",
  school: "school-error",
  email: "email-error",
  terms: "terms-error",
} as const;

export type FieldErrorAriaProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "aria-describedby" | "aria-invalid"
>;

export const getDownloadCardFieldErrorAriaProps = (
  hasError?: boolean,
): FieldErrorAriaProps =>
  hasError
    ? {
        "aria-describedby": SHARE_FORM_ERROR_IDS.resources,
        "aria-invalid": true,
      }
    : {};
