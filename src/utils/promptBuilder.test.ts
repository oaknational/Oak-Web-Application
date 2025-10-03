import { buildSearchIntentPrompt } from "./promptBuilder";

const subjects = ["maths", "english", "science", "history"];

describe("buildSearchIntentPrompt", () => {
  it("should include subjects from OAK_SUBJECTS", () => {
    const result = buildSearchIntentPrompt("test", subjects);

    expect(result[0]?.content).toContain("maths, english, science, history");
  });

  it("should have system and user messages", () => {
    const result = buildSearchIntentPrompt("test", subjects);

    expect(result).toHaveLength(2);
    expect(result[0]?.role).toBe("system");
    expect(result[1]?.role).toBe("user");
  });

  it("should wrap search term in retrieved-data XML tags", () => {
    const searchTerm = "photosynthesis";
    const result = buildSearchIntentPrompt(searchTerm, subjects);
    const userMessage = result[1];

    expect(userMessage?.content).toContain("<retrieved-data>");
    expect(userMessage?.content).toContain("</retrieved-data>");
    expect(userMessage?.content).toContain(searchTerm);
  });
});
