import { isAllowedUri, shouldAutoLink } from "./TeacherNotesModal";

describe("TeacherNotesModal", () => {
  describe("isAllowedUri", () => {
    // mock context
    const context = {
      defaultProtocol: "https",
      defaultValidate: jest.fn().mockReturnValue(true),
      protocols: ["http", "https"],
    };

    it("should return false if the protocol is not allowed", () => {
      const result = isAllowedUri("ftp://example.com", context);
      expect(result).toBe(false);
    });

    it("should return true if the protocol is allowed", () => {
      const result = isAllowedUri("https://example.com", context);
      expect(result).toBe(true);
    });

    it("should return true if the protocol is allowed", () => {
      const result = isAllowedUri("http://example.com", context);
      expect(result).toBe(true);
    });

    it("should return false if the URL is invalid", () => {
      context.defaultValidate.mockReturnValueOnce(false);
      const result = isAllowedUri("https://", context);
      expect(result).toBe(false);
    });

    it("should return false if the URL is invalid", () => {
      const result = isAllowedUri("https://", context);
      expect(result).toBe(false);
    });

    it("should return false if the URL is not in the allowed list of protocols", () => {
      const result = isAllowedUri("http://example.com", {
        ...context,
        protocols: ["https"],
      });
      expect(result).toBe(false);
    });
  });

  describe("shouldAutoLink", () => {
    it("should return true if the URL is valid", () => {
      const result = shouldAutoLink("https://example.com");
      expect(result).toBe(true);
    });

    it("should return true if the URL is valid", () => {
      const result = shouldAutoLink("example.com");
      expect(result).toBe(true);
    });

    it("should return false if the URL is invalid", () => {
      const result = shouldAutoLink("https://");
      expect(result).toBe(false);
    });

    it("should return false if the URL is invalid", () => {
      const result = shouldAutoLink("https://");
      expect(result).toBe(false);
    });
  });
});
