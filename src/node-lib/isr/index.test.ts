/**
 * @jest-environment node
 */

describe("isr.decorateWithIsr()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });
  it("Does not mutate the original results", async () => {
    process.env.DISABLE_ISR = "anything_but_on";
    const { decorateWithIsr } = await import(".");
    const initialResult = {
      props: {
        someProp: true,
      },
    };
    const decoratedResults = decorateWithIsr(initialResult);

    expect(decoratedResults).not.toBe(initialResult);
  });
  it("if DISABLE_ISR is undefined, adds revalidate prop to GetStaticProps results", async () => {
    const { decorateWithIsr } = await import(".");
    const initialResult = {
      props: {
        someProp: true,
      },
    };

    expect(decorateWithIsr(initialResult)).toHaveProperty<number>("revalidate");
  });
  it("if DISABLE_ISR is off, adds revalidate prop to GetStaticProps results", async () => {
    process.env.DISABLE_ISR = "anything_but_on";
    const { decorateWithIsr } = await import(".");
    const initialResult = {
      props: {
        someProp: true,
      },
    };

    expect(decorateWithIsr(initialResult)).toHaveProperty<number>("revalidate");
  });
  it("if DISABLE_ISR is 'on', does nothing", async () => {
    process.env.DISABLE_ISR = "on";
    const { decorateWithIsr } = await import(".");
    const initialResult = {
      props: {
        someProp: true,
      },
    };

    expect(decorateWithIsr(initialResult)).toEqual(initialResult);
  });
});

export {};
