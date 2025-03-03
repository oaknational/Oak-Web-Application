import { oakColorTokens } from "@oaknational/oak-components";

const formFocusStyles = {
  "&:focus": {
    boxShadow: `0px 0px 0px 2px ${oakColorTokens.lemon}, 0px 0px 0px 5px ${oakColorTokens.grey60} !important`,
  },
};

const buttonStyles = {
  padding: "8px",
  radius: "4px",
  border: `1px solid ${oakColorTokens.grey50} !important`,
  ...formFocusStyles,
};

const headerTextStyles = {
  textAlign: "start",
  fontWeight: "300",
  fontSize: "16px",
  color: oakColorTokens.grey60,
};

const linkFocusStyles = {
  borderRadius: "4px",
  outline: "none",
  boxShadow: `0px 0px 0px 2px ${oakColorTokens.lemon}, 0px 0px 0px 5px ${oakColorTokens.grey60}`,
};

export const formAppearanceStyles = {
  elements: {
    card: {
      padding: "24px 40px 40px",
    },
    logoBox: {
      height: "47px",
      justifyContent: "flex-start",
      "a:focus": linkFocusStyles,
    },
    headerTitle: {
      fontSize: "20px",
      textAlign: "start",
      marginBottom: "8px",
      color: oakColorTokens.black,
      fontWeight: "600",
    },
    headerSubtitle: {
      ...headerTextStyles,
    },
    dividerText: {
      ...headerTextStyles,
    },
    dividerLine: {
      height: "1px",
      background: oakColorTokens.grey50,
    },
    button__google: {
      ...buttonStyles,
    },
    button__microsoft: {
      ...buttonStyles,
    },
    socialButtonsBlockButtonText: {
      ...headerTextStyles,
      color: oakColorTokens.black,
    },
    formFieldLabel: {
      fontSize: "16px",
      fontWeight: "500",
      color: oakColorTokens.black,
    },
    button: {
      padding: "14px",
      fontSize: "16px",
      ...formFocusStyles,
    },
    formFieldInput: {
      padding: "16px",
      border: `1px solid ${oakColorTokens.grey50} !important`,
      ...formFocusStyles,
    },
    input: {
      border: `1px solid ${oakColorTokens.grey50} !important`,
    },
    footer: {
      padding: "0px",
    },
    footerAction: {
      zIndex: "50",
      margin: "0px 0px 24px 0px",
      padding: "0px !important",
      width: "100%",
      paddingLeft: "40px  !important",
      "a:focus": linkFocusStyles,
    },
    footerActionLink: {
      color: oakColorTokens.navy,
      textAlign: "start !important",
      fontSize: "16px",
      "&:hover": {
        color: oakColorTokens.navy,
      },
    },
    formResendCodeLink: {
      fontWeight: "300",
      fontSize: "16px",
      color: oakColorTokens.grey60,
      ...formFocusStyles,
    },
    footerActionText: {
      ...headerTextStyles,
      color: oakColorTokens.black,
      display: "block",
      textAlign: "start !important",
      ...formFocusStyles,
    },
    identityPreviewText: {
      ...headerTextStyles,
    },
  },
};
