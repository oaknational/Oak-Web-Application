import { pickSingleSignOnService } from "./pickSingleSignOnService";

describe("pickSingleSignOnService", () => {
  it("should return 'Google' when google is in providers", () => {
    const providers = ["google"];
    const result = pickSingleSignOnService(providers);
    expect(result).toBe("Google");
  });

  it("should return 'Google' when oauth_google is in providers", () => {
    const providers = ["oauth_google"];
    const result = pickSingleSignOnService(providers);
    expect(result).toBe("Google");
  });

  it("should return 'Microsoft' when microsoft is in providers", () => {
    const providers = ["microsoft"];
    const result = pickSingleSignOnService(providers);
    expect(result).toBe("Microsoft");
  });

  it("should return 'Microsoft' when oauth_microsoft is in providers", () => {
    const providers = ["oauth_microsoft"];
    const result = pickSingleSignOnService(providers);
    expect(result).toBe("Microsoft");
  });

  it("should return 'Email' when no known providers are present", () => {
    const providers = ["unknown", "other"];
    const result = pickSingleSignOnService(providers);
    expect(result).toBe("Email");
  });

  it("should return 'Email' when providers array is empty", () => {
    const providers: string[] = [];
    const result = pickSingleSignOnService(providers);
    expect(result).toBe("Email");
  });

  it("should work with multiple providers including unknown ones", () => {
    const providers = ["facebook", "google", "twitter"];
    const result = pickSingleSignOnService(providers);
    expect(result).toBe("Google");
  });

  it("should be case sensitive", () => {
    const providers = ["Google", "Microsoft"];
    const result = pickSingleSignOnService(providers);
    expect(result).toBe("Email");
  });
});
