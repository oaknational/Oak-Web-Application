import { ReactNode, createContext, useEffect, useMemo, useState } from "react";

import {
  OakPupilClient,
  State,
  LogAttempt,
  GetAttempt,
  AddTeacherNote,
  GetTeacherNote,
  GetTeacherNoteIsEditable,
} from "@/node-lib/pupil-api/client/client";

type ContextValue = {
  state: State;
  logAttempt: LogAttempt;
  getAttempt: GetAttempt;
  addTeacherNote: AddTeacherNote;
  getTeacherNote: GetTeacherNote;
  getTeacherNoteIsEditable: GetTeacherNoteIsEditable;
};

export const oakPupilContext = createContext<ContextValue>({} as ContextValue);

const OakPupilClientProvider = ({ children }: { children: ReactNode }) => {
  const client = useMemo(() => new OakPupilClient({}), []);
  const [state, setState] = useState<State>(() => client.getState());

  /**
   * Initialise the client on mount
   *
   * this ensures that the client doesn't hit the network unless
   * rendered on the client-side
   */
  useEffect(() => {
    client.init();
  }, [client]);

  useEffect(() => {
    const unsubscribe = client.onStateChange((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, [client]);

  const contextValue = useMemo<ContextValue>(
    () => ({
      state,
      logAttempt: client.logAttempt,
      getAttempt: client.getAttempt,
      addTeacherNote: client.addTeacherNote,
      getTeacherNote: client.getTeacherNote,
      getTeacherNoteIsEditable: client.getTeacherNoteIsEditable,
    }),
    [
      state,
      client.logAttempt,
      client.getAttempt,
      client.addTeacherNote,
      client.getTeacherNote,
      client.getTeacherNoteIsEditable,
    ],
  );

  return (
    <oakPupilContext.Provider value={contextValue}>
      {children}
    </oakPupilContext.Provider>
  );
};

export { OakPupilClientProvider };
