import Script, { ScriptProps } from "next/script";
import { FC } from "react";

type ConditionalScriptProps = ScriptProps & {
  shouldLoad: boolean;
};

const ConditionalScript: FC<ConditionalScriptProps> = (props) => {
  const { shouldLoad, ...scriptProps } = props;
  if (!shouldLoad) {
    return null;
  }
  return <Script {...scriptProps} />;
};

export default ConditionalScript;
