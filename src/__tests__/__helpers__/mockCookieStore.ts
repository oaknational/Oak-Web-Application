export class MockCookieStore extends EventTarget {
  get = jest.fn(() => null);
  getAll = jest.fn(async () => []);
  set = jest.fn(() => {});
  delete = jest.fn(async () => {});
}

Object.defineProperty(globalThis, "CookieStore", {
  configurable: true,
  writable: true,
  value: MockCookieStore,
});

Object.defineProperty(globalThis, "cookieStore", {
  configurable: true,
  writable: true,
  value: new MockCookieStore(),
});
