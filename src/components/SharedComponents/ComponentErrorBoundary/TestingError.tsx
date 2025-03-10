type TestingErrorProps = {
  error: Error;
};
export default function TestingError({ error }: TestingErrorProps) {
  throw error;
  return <div />;
}
