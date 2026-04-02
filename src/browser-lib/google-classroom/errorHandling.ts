/**
 * Thrown when the Google Classroom API returns a 403 scope_insufficient error.
 * The teacher needs to re-authenticate to grant the classroom.coursework.students scope.
 */
export class ScopeInsufficientError extends Error {
  constructor() {
    super("scope_insufficient");
    this.name = "ScopeInsufficientError";
  }
}

export const handleCourseWorkApiError = (error: unknown): never => {
  if (error instanceof Error && error.message.includes("scope_insufficient")) {
    throw new ScopeInsufficientError();
  }
  throw error;
};
