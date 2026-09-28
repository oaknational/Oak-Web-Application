class BroadcastChannelMock {
  name: string;
  onmessage = null;
  onmessageerror = null;

  constructor(name: string) {
    this.name = name;
  }

  postMessage = jest.fn();
  close = jest.fn();

  addEventListener = jest.fn();
  removeEventListener = jest.fn();
  dispatchEvent = jest.fn();
}

Object.defineProperty(global, "BroadcastChannel", {
  writable: true,
  value: BroadcastChannelMock,
});
