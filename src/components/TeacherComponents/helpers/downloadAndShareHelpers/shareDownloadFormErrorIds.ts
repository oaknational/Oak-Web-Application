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

const getFieldErrorAriaProps = (
  hasError: boolean | undefined,
  errorId: string,
): FieldErrorAriaProps =>
  hasError
    ? {
        "aria-describedby": errorId,
        "aria-invalid": true,
      }
    : {};

export const getDownloadCardFieldErrorAriaProps = (
  hasError?: boolean,
): FieldErrorAriaProps =>
  getFieldErrorAriaProps(hasError, SHARE_FORM_ERROR_IDS.resources);

export const getEmailFieldErrorAriaProps = (
  hasError?: boolean,
): FieldErrorAriaProps =>
  getFieldErrorAriaProps(hasError, SHARE_FORM_ERROR_IDS.email);
