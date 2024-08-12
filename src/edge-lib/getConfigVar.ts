import * as runtimeConfig from "./runtime-config.json" with { "type": "json" };

export function getConfigVar(name: string) {
  const value =
    /* @ts-expect-error runtimeConfig is known to be JSON */
    process.env[name] ?? runtimeConfig[name];

  if (typeof value !== "string") {
    throw new ReferenceError(`Config value for '${name}' is missing.`);
  }

  return value;
}
