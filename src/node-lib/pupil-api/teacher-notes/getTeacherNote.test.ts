import { TeacherNoteFixture } from "@/node-lib/pupil-api/__mocks__/fixtures/teacher-note.fixture";
import { pupilDatastore } from "@/node-lib/pupil-api/pupilDataStore";

describe("getTeacherNote", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch the correct teacher note", async () => {
    const expected = {
      ...TeacherNoteFixture(),
      created_at: "2021-09-01T00:00:00.000Z",
    };
    const notes = await pupilDatastore.getTeacherNote({
      noteId: "sNHeiaNYip",
      sidKey: "sid-9226e5",
    });

    expect(notes).toEqual(expected);
  });

  it("should return an empty array if the note is not found", async () => {
    const notes = await pupilDatastore.getTeacherNote({
      noteId: "not-found",
      sidKey: "sid-9226e5",
    });
    expect(notes).toEqual(null);
  });
});
