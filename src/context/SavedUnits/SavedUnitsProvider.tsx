"use client";

import { useUser } from "@clerk/nextjs";
import { ReactNode, useState } from "react";

import { createSaveUnitsStore, SavedUnitsContext } from "./SavedUnitsStore";
import { SavedUnitFetching } from "./components/SavedUnitFetching";
import { SavedUnitActions } from "./components/SavedUnitActions";

export const SavedUnitsProvider = ({
  programmeSlugs,
  children,
}: {
  programmeSlugs: string[];
  children: ReactNode;
}) => {
  const { user } = useUser();

  return (
    <SavedUnitsScope
      key={user?.id ?? "signed-out"}
      programmeSlugs={programmeSlugs}
    >
      {children}
    </SavedUnitsScope>
  );
};

// Keeping a separate scope wrapper means that when a new user logs in the store will
// not be shared across users and will be remade fresh
const SavedUnitsScope = ({
  programmeSlugs,
  children,
}: {
  programmeSlugs: string[];
  children: ReactNode;
}) => {
  const [store] = useState(createSaveUnitsStore);

  return (
    <SavedUnitsContext.Provider value={store}>
      <SavedUnitActions store={store} />
      {programmeSlugs.map((programmeSlug) => (
        <SavedUnitFetching
          key={programmeSlug}
          programmeSlug={programmeSlug}
          store={store}
        />
      ))}
      {children}
    </SavedUnitsContext.Provider>
  );
};
