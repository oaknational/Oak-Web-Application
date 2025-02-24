import { createThread } from "./thread";

describe("createThread", () => {
  it("default", () => {
    const result1 = createThread();
    expect(result1).toEqual({
      thread_id: 1,
      thread_title: "Foo",
      thread_slug: "foo",
      thread_order: 1,
    });
  });

  it("pass data", () => {
    const result1 = createThread({ thread_title: "Badger" });
    expect(result1).toEqual({
      thread_id: 1,
      thread_title: "Badger",
      thread_slug: "foo",
      thread_order: 1,
    });
  });

  it("pass slug", () => {
    const result1 = createThread({ thread_slug: "something" });
    expect(result1).toEqual({
      thread_id: 1,
      thread_slug: "something",
      thread_title: "Something",
      thread_order: 1,
    });
  });

  it("pass id", () => {
    const result1 = createThread({ thread_slug: "something" });
    expect(result1.thread_id).toEqual(1);
    const result2 = createThread({ thread_slug: "something" });
    expect(result2.thread_id).toEqual(1);
  });

  it("override id", () => {
    const result1 = createThread({ thread_slug: "something" });
    expect(result1.thread_id).toEqual(1);
    const result2 = createThread({ thread_slug: "something", thread_id: 999 });
    expect(result2.thread_id).toEqual(999);
  });
});
