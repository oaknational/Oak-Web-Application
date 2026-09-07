import { Metadata } from "next";

import { McpView } from "./Components/McpView";

import withPageErrorHandling from "@/hocs/withPageErrorHandling";

export const metadata: Metadata = {
  title: "Oak Curriculum MCP",
  description:
    "Connect the AI assistant you already use to Oak’s free curriculum content, designed for schools in the UK.",
};

export const dynamic = "force-static";

const InnerMcpPage = async () => <McpView />;

const McpPage = withPageErrorHandling(InnerMcpPage, "mcp-page::app");

export default McpPage;
