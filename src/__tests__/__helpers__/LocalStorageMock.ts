class LocalStorageMock {
  store: Record<string, unknown> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: unknown) {
    this.store[key] = value + "";
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

Object.defineProperty(window, "localStorage", {
  value: new LocalStorageMock(),
});

// To ensure file is a module
export {}