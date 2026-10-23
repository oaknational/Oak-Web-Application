import { cspHeader, reportingEndpointsHeader } from "./contentSecurityPolicy";

export const getCspHeaders = () => [
  ...(reportingEndpointsHeader
    ? [{ key: "Reporting-Endpoints", value: reportingEndpointsHeader }]
    : []),
  {
    key: "Content-Security-Policy",
    value: cspHeader.replaceAll(/\n/g, ""),
  },
];
