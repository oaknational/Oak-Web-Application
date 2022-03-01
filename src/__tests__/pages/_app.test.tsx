import MyApp from "../../pages/_app";

describe("<MyApp>", () => {
  it("Doesn't throw", () => {
    const Component = () => {
      return <div></div>;
    };
    const pageProps = {};
    const go = () => {
      /*eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      MyApp({ Component, pageProps });
    };
    expect(go).not.toThrow();
  });
});
