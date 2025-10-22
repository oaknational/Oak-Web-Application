import { TeacherNoteFixture } from "./__mocks__/fixtures/teacher-note.fixture";

import { datastore } from "./index";

describe("getTeacherNote", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch the correct teacher note", async () => {
    const expected = {
      ...TeacherNoteFixture(),
      created_at: "2021-09-01T00:00:00.000Z",
    };
    const notes = await datastore.getTeacherNote({
      noteId: "sNHeiaNYip",
      sidKey: "sid-9226e5",
    });

    expect(notes).toEqual(expected);
  });

  it("should return an empty array if the note is not found", async () => {
    const notes = await datastore.getTeacherNote({
      noteId: "not-found",
      sidKey: "sid-9226e5",
    });
    expect(notes).toEqual(null);
  });
});
