import { ProgrammeFields } from "@oaknational/oak-curriculum-schema";

import {
  KeyStageTitleValueType,
  TierNameValueType,
  ExamBoardValueType,
  PathwayValueType,
  DownloadResourceButtonNameValueType,
  SearchResultTypeValueType,
  FilterTypeValueType,
  SearchFilterMatchTypeType,
  MediaClipsButtonNameValueType,
  TeachingMaterialTypeValueType,
  OnwardIntentValueType,
  SearchSourceValueType,
  TeacherSchoolManualEntryDetails,
  UserAccountVerificationStatusValueType,
  UserRoleTypeValueType,
} from "@/browser-lib/avo/Avo";
import { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { VideoTrackingGetState } from "@/components/SharedComponents/VideoPlayer/useVideoTracking";

// Core programme properties used at all browse levels
export type SharedProgrammeState = {
  subjectSlug: ProgrammeFields["subject_slug"];
  subjectTitle: ProgrammeFields["subject"];
  phaseSlug: ProgrammeFields["phase_slug"];
  phaseTitle: ProgrammeFields["phase_description"];
  year: ProgrammeFields["year"];
  yearGroupTitle: ProgrammeFields["year_description"];
  keyStageSlug: ProgrammeFields["keystage_slug"];
  keyStageTitle: ProgrammeFields["keystage_description"];
  tierSlug: ProgrammeFields["tier_slug"];
  tierTitle: ProgrammeFields["tier_description"];
  examBoardSlug: ProgrammeFields["examboard_slug"];
  examBoardTitle: ProgrammeFields["examboard"];
  pathwaySlug: ProgrammeFields["pathway_slug"];
  pathwayTitle: ProgrammeFields["pathway_description"];
};

export type ProgrammeState = SharedProgrammeState &
  (
    | { browseLevel: "programme" }
    | { browseLevel: "unit"; unit: UnitState }
    | { browseLevel: "lesson"; unit: UnitState; lesson: LessonState }
  );

export type ProgrammeStateUnit = Extract<
  ProgrammeState,
  { browseLevel: "unit" | "lesson" }
>;

export type ProgrammeStateLesson = Extract<
  ProgrammeState,
  { browseLevel: "lesson" }
>;

export type UnitState = {
  slug: string;
  title: string;
};
export type LessonState = {
  slug: string;
  title: string;
  lessonReleaseDate: string;
};

export type ProgrammePathwayData = {
  keyStageTitle: KeyStageTitleValueType;
  keyStageSlug: string;
  subjectTitle: string;
  subjectSlug: string;
  tierName: TierNameValueType | null;
  examBoard: ExamBoardValueType | null;
  pathway: PathwayValueType | null;
};
export type UnitPathwayData = ProgrammePathwayData & {
  unitName: string;
  unitSlug: string;
};
export type LessonPathwayData = ProgrammePathwayData &
  UnitPathwayData & {
    lessonName: string;
    lessonSlug: string;
    lessonReleaseDate: string;
  };

// All Track Fns used in the teacher browse journey
export type TeacherBrowseTrackFns = {
  // NAVIGATION
  browseRefined: () => void;
  browseRefinedAccessed: () => void;

  // PROGRAMMES (fka Curriculum Visualiser)
  curriculumVisualiserAccessed: () => void;
  curriculumExplainerExplored: () => void;
  curriculumResourcesDownloaded: (data: ResourceFormValues) => void;
  curriculumResourcesDownloadRefined: () => void;

  //UNITS
  unitAccessed: () => void;
  unitDownloadInitiated: () => void;
  unitOverviewAccessed: (props: {
    unitHighlighted: boolean;
    selectedThread?: { slug: string; title: string }; // TD add filters to state
  }) => void;
  unitSequenceRefined: (props: {
    selectedThread?: { slug: string; title: string }; // TD add filters to state
    subjectCategory?: string; // TD add filters to state
    childSubjectSlug?: string; // TD add filters to state
  }) => void;

  // LESSONS
  lessonAccessed: () => void;
  lessonResourceDownloadStarted: (
    downloadResourceButtonName: DownloadResourceButtonNameValueType,
  ) => void;
  lessonMediaClipsStarted: (props: {
    mediaClipsButtonName: MediaClipsButtonNameValueType;
    learningCycle?: string | null;
  }) => void;
  mediaClipsPlaylistPlayed: (props: {
    learningCycle: string;
    durationSeconds: number;
    isCaptioned: boolean;
    videoPlaybackId: string[];
    videoTitle: string;
    timeElapsedSeconds: number;
    isMuted: boolean;
    mediaClipsCount: number;
    mediaClipIndex: number;
  }) => void;
  lessonShareStarted: () => void;
  createTeachingMaterialsInitiated: (props: { isLoggedIn: boolean }) => void;
  teachingMaterialsSelected: (props: {
    teachingMaterialType: TeachingMaterialTypeValueType;
  }) => void;
  onwardContentSelected: (props: {
    onwardIntent: OnwardIntentValueType;
  }) => void;
  videoPlayed: (
    props: ReturnType<VideoTrackingGetState> & {
      cloudinaryUrl: string | null;
      muxAssetId: string | null;
    },
  ) => void;
  videoStarted: (
    props: ReturnType<VideoTrackingGetState> & {
      cloudinaryUrl: string | null;
      muxAssetId: string | null;
    },
  ) => void;
  videoPaused: (
    props: ReturnType<VideoTrackingGetState> & {
      cloudinaryUrl: string | null;
      muxAssetId: string | null;
    },
  ) => void;
  videoFinished: (
    props: ReturnType<VideoTrackingGetState> & {
      cloudinaryUrl: string | null;
      muxAssetId: string | null;
    },
  ) => void;
  lessonAssistantAccessed: (props: { isLoggedIn: boolean }) => void;
  // The following events are for the teacher notes feature which is not available in integrated journey
  teacherNoteDialogueOpened: () => void;
  teacherNoteSaved: () => void;
  teacherShareActivated: () => void;
  teacherShareInitiated: () => void;
  teacherShareConverted: () => void;

  // REGISTRATION
  userOnboardingProgressed: (props: {
    userId: string;
    signUpDate: string | null | undefined;
    userRoleType: UserRoleTypeValueType | null | undefined;
    teacherSchoolUrn: string | null | undefined;
    userDefinedRole: string | null | undefined;
    userDetailsLastModifiedDate: string;
    userAccountVerificationStatus?: UserAccountVerificationStatusValueType | null;
    teacherSchoolManualEntryDetails?: TeacherSchoolManualEntryDetails | null;
  }) => void;
  userOnboardingCompleted: (props: {
    userId: string;
    signUpDate: string;
    userRoleType: UserRoleTypeValueType | null | undefined;
    teacherSchoolUrn: string | null | undefined;
    userDefinedRole: string | null | undefined;
    userDetailsLastModifiedDate: string;
    userAccountVerificationStatus: UserAccountVerificationStatusValueType;
    teacherSchoolManualEntryDetails?: TeacherSchoolManualEntryDetails | null;
  }) => void;
  contentBlockNotificationDisplayed: (props: {
    accessBlockType: string;
  }) => void;

  // SEARCH
  searchJourneyInitiated: (props: {
    searchSource: SearchSourceValueType;
  }) => void;
  searchAccessed: (props: {
    searchResultCount: number;
    searchResultsLoadTime: number;
  }) => void;
  searchRefined: (props: {
    searchResultCount: number;
    activeFilters: Record<string, string>; // TD add filters to state
    searchTerm: string; // TD add query to state
  }) => void;
  searchExpanded: (props: {
    searchRank: number;
    searchFilterOptionSelected: string[];
    searchResultCount: number;
    searchResultType: SearchResultTypeValueType;
  }) => void;
  searchResultOpened: (props: {
    searchRank: number;
    searchFilterOptionSelected: string[];
    searchResultCount: number;
    searchResultType: SearchResultTypeValueType;
  }) => void;
  searchFilterModified: (props: {
    checked: boolean;
    filterType: FilterTypeValueType;
    filtervalue: string;
    searchTerm: string; // TD move to state
    searchFilterMatchType: SearchFilterMatchTypeType;
  }) => void;

  // MY LIBRARY
  contentSaved: () => void; // likely want to create two fns to wrap this for unit and lesson
  contentUnsaved: () => void;

  // MISC
  newsletterSignUpCompleted: () => void;
};
