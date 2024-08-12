export function getEnvVar(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new ReferenceError(`Environment variable '${name}' is not defined`);
  }

  return value;
}
