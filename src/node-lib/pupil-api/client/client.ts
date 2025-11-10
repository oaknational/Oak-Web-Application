import { nanoid } from "nanoid";

import { PupilNetworkClient } from "@/node-lib/pupil-api/network/network";
import {
  LessonAttempt,
  TeacherNote,
  teacherNoteSchema,
  AttemptId,
  AttemptDataCamelCase,
  attemptDataSchema,
  LessonAttemptCamelCase,
  TeacherNoteCamelCase,
} from "@/node-lib/pupil-api/types";
import { createHash } from "@/utils/createHash";
import convertKeysToSnakeCase from "@/utils/camelCaseConverter";
import keysToCamelCase from "@/utils/snakeCaseConverter";

const logger = console;

export type OnError = (error: unknown) => void;

export type LogAttempt = (
  attempt: AttemptDataCamelCase,
  isLocal: boolean,
) => { attemptId: string; promise: Promise<LessonAttempt> } | string;

export type GetAttempt = (
  attemptId: AttemptId,
  isLocal: boolean,
) => Promise<LessonAttemptCamelCase>;

export type AddTeacherNote = (props: { teacherNote: TeacherNoteCamelCase }) => {
  noteId: string;
  promise: Promise<TeacherNote>;
};

export type GetTeacherNote = (props: {
  noteId?: string;
  sidKey?: string;
}) => Promise<{ teacherNote: TeacherNoteCamelCase } & { isEditable: boolean }>;

export type GetTeacherNoteIsEditable = (props: {
  noteId: string;
  sidKey: string;
}) => boolean | null;

export type State = {
  previousLoggedAttemptHash?: string;
  previousLoggedAttemptId?: string;
  error?: unknown;
};

export type Listener<T> = (state: T) => void;
export type LessonAttemptStateWithPending = "retrieved" | "pending";
export interface PupilClient {
  init: () => void;
  getState(): State;
  onStateChange: (listener: Listener<State>) => () => void;
  logAttempt: LogAttempt;
  getAttempt: GetAttempt;
  addTeacherNote: AddTeacherNote;
  getTeacherNote: GetTeacherNote;
  getTeacherNoteIsEditable: GetTeacherNoteIsEditable;
}

export class OakPupilClient implements PupilClient {
  private onError: OnError;
  private state: State;
  private listeners: Listener<State>[] = [];
  private isInitialized = false;

  constructor(
    {
      onError,
    }: {
      onError?: OnError;
    },
    private networkClient = new PupilNetworkClient(),
  ) {
    this.onError = onError || logger.error;
    this.state = {
      error: undefined,
    };
  }

  public init() {
    // Only initialize once
    if (this.isInitialized) {
      return;
    }
    this.isInitialized = true;
    this.setState({
      ...this.state,
    });
  }

  public getState = () => {
    return this.state;
  };

  private setState = (newState: State) => {
    /**
     * update state
     */
    this.state = newState;
    this.listeners.forEach((listener) => listener(this.state));
  };

  public onStateChange = (listener: Listener<State>): (() => void) => {
    listener(this.state);
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  };

  public logAttempt = (attemptData: AttemptDataCamelCase, isLocal: boolean) => {
    const attemptHash = createHash(JSON.stringify(attemptData));
    if (
      this.state.previousLoggedAttemptHash === attemptHash &&
      !isLocal &&
      this.state.previousLoggedAttemptId
    ) {
      return this.state.previousLoggedAttemptId;
    }
    const attemptId = nanoid();
    const lessonAttemptHash = createHash(JSON.stringify(attemptData));

    if (isLocal) {
      window.localStorage.setItem(
        `oak-pupil-lesson-attempt:${attemptId}`,
        JSON.stringify({
          attemptId,
          createdAt: new Date().toISOString(),
          ...attemptData,
        }),
      );
      return attemptId;
    }

    const attemptPayload = convertKeysToSnakeCase(attemptData);
    const parsedAttemptData = attemptDataSchema.parse(attemptPayload);

    const promise = this.networkClient.logAttempt({
      attempt_id: attemptId,
      ...parsedAttemptData,
    });
    promise.catch((error) => {
      this.onError(error);
      this.setState({
        ...this.state,
        previousLoggedAttemptHash: undefined,
        previousLoggedAttemptId: undefined,
      });
      throw error;
    });
    this.setState({
      ...this.state,
      previousLoggedAttemptHash: lessonAttemptHash,
      previousLoggedAttemptId: attemptId,
    });
    return { attemptId, promise };
  };

  public getAttempt = async (attemptId: AttemptId, isLocal: boolean) => {
    try {
      const localHostString = window.localStorage.getItem(
        `oak-pupil-lesson-attempt:${attemptId}`,
      );
      if (localHostString) {
        return JSON.parse(localHostString);
      }
    } catch (error) {
      this.onError(error);
    }
    if (!isLocal) {
      try {
        const data = await this.networkClient.getAttempt(attemptId);
        const camelCaseData = keysToCamelCase(data[attemptId]);
        return camelCaseData;
      } catch (error) {
        this.onError(error);
      }
    } else {
      return;
    }
  };

  public addTeacherNote = ({
    teacherNote,
  }: {
    teacherNote: TeacherNoteCamelCase;
  }) => {
    const t = { ...teacherNote };

    const teacherNotePayload = convertKeysToSnakeCase(t);

    const parsedTeacherNote = teacherNoteSchema.parse(teacherNotePayload);

    // add teacher note to local storage
    window.localStorage.setItem(
      `oak-pupil-teacher-note:${teacherNote.sidKey}`,
      t.noteId,
    );

    const promise = this.networkClient
      .addTeacherNote(parsedTeacherNote)
      .catch((error) => {
        this.onError(error);
        throw error;
      });

    return { noteId: t.noteId, sidKey: t.sidKey, promise };
  };

  public getTeacherNote = ({
    sidKey,
    noteId,
  }: {
    sidKey?: string;
    noteId?: string;
  }) => {
    const parsedKey = teacherNoteSchema.shape.sid_key.parse(sidKey);

    const noteIdFromLocalStorage = window.localStorage.getItem(
      `oak-pupil-teacher-note:${parsedKey}`,
    );

    const parsedNoteId = noteId
      ? teacherNoteSchema.shape.note_id.parse(noteId)
      : noteIdFromLocalStorage;

    if (!parsedNoteId) {
      throw new Error("NoteId could not be found");
    }

    return this.networkClient
      .getTeacherNote({ note_id: parsedNoteId, sid_key: parsedKey })
      .then((note) => {
        const noteCamelCase = keysToCamelCase(note) as TeacherNoteCamelCase;

        return {
          teacherNote: noteCamelCase,
          isEditable: noteIdFromLocalStorage === noteCamelCase.noteId,
        };
      })
      .catch((error) => {
        this.onError(error);
        throw error;
      });
  };

  public getTeacherNoteIsEditable = ({
    sidKey,
    noteId,
  }: {
    sidKey: string;
    noteId: string;
  }) => {
    const parsedKey = teacherNoteSchema.shape.sid_key.parse(sidKey);

    const noteIdFromLocalStorage = window.localStorage.getItem(
      `oak-pupil-teacher-note:${parsedKey}`,
    );

    // a null value indicates that there is no noteId in local storage and therefore the provided noteId is editable
    if (!noteIdFromLocalStorage) {
      return null;
    }

    // otherwise, the noteId is editable if it matches the noteId in local storage
    return noteIdFromLocalStorage === noteId;
  };
}
