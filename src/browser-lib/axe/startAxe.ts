"use client";

import React from "react";
import ReactDOM from "react-dom";

import isBrowser from "../../utils/isBrowser";

const axeConfig = {
  rules: [
    {
      id: "skip-link",
      enabled: true,
    },
  ],
  disableDeduplicate: true,
};
const axeContext = {
  exclude: [
    // Gleap
    [".bb-logo-logo"],
  ],
};

const startAxe = async () => {
  if (isBrowser && process.env.NODE_ENV !== "production") {
    const axe = (await import("@axe-core/react")).default;
    axe(React, ReactDOM, 1000, axeConfig, axeContext);
  }
};

export default startAxe;
