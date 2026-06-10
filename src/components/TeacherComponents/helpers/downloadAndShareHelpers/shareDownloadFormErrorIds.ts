import { InputHTMLAttributes } from "react";

export const SHARE_FORM_ERROR_IDS = {
  resources: "downloads-error",
  school: "school-error",
  email: "email-error",
  terms: "terms-error",
} as const;

export type CheckboxFieldErrorAriaProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "aria-describedby"
>;

export type TextFieldErrorAriaProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "aria-describedby" | "aria-invalid"
>;

const getCheckboxFieldErrorAriaProps = (
  hasError: boolean | undefined,
  errorId: string,
): CheckboxFieldErrorAriaProps =>
  hasError
    ? {
        "aria-describedby": errorId,
      }
    : {};

const getTextFieldErrorAriaProps = (
  hasError: boolean | undefined,
  errorId: string,
): TextFieldErrorAriaProps =>
  hasError
    ? {
        "aria-describedby": errorId,
        "aria-invalid": true,
      }
    : {};

export const getDownloadCardFieldErrorAriaProps = (
  hasError?: boolean,
): CheckboxFieldErrorAriaProps =>
  getCheckboxFieldErrorAriaProps(hasError, SHARE_FORM_ERROR_IDS.resources);

export const getEmailFieldErrorAriaProps = (
  hasError?: boolean,
): TextFieldErrorAriaProps =>
  getTextFieldErrorAriaProps(hasError, SHARE_FORM_ERROR_IDS.email);
