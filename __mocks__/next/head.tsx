declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "fake-head": unknown;
    }
  }
}

export default ({ children }: { children: Array<React.ReactElement> }) => {
  return <fake-head>{children}</fake-head>;
};
