import { areLessonsAvailable } from "./lessons";

describe("areLessonsAvailable", () => {
  it("returns true when lessons are available", () => {
    const someAvailableLessons = [
      {
        title: "Lesson 1",
        _state: "new",
      },
      {
        title: "Lesson 2",
        _state: "published",
      },
    ];
    expect(areLessonsAvailable(someAvailableLessons)).toEqual(true);
  });

  it("returns true when lessons are available", () => {
    const allAvailableLessons = [
      {
        title: "Lesson 1",
        _state: "published",
      },
      {
        title: "Lesson 2",
        _state: "published",
      },
    ];
    expect(areLessonsAvailable(allAvailableLessons)).toEqual(true);
  });

  it("returns false if no lessons are published", () => {
    const noPublishedLessons = [
      {
        title: "Lesson 1",
        _state: "new",
      },
      {
        title: "Lesson 2",
        _state: "new",
      },
      {
        title: "Lesson 2",
        _state: "new",
      },
    ];
    expect(areLessonsAvailable(noPublishedLessons)).toEqual(false);
  });

  it("returns false if no lessons are available", () => {
    expect(areLessonsAvailable([])).toEqual(false);
  });
});
