/**
 * Thrown when the Google Classroom API returns a scope_insufficient error.
 * The teacher needs to re-authenticate to grant the classroom.coursework.students scope.
 */
export class ScopeInsufficientError extends Error {
  constructor() {
    super("scope_insufficient");
    this.name = "ScopeInsufficientError";
  }
}
