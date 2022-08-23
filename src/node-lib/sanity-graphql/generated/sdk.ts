import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type AboutCorePage = Document & {
  __typename?: 'AboutCorePage';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']>;
  _key?: Maybe<Scalars['String']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']>;
  /** Document type */
  _type?: Maybe<Scalars['String']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']>;
  board?: Maybe<AboutPageBoard>;
  contactSection?: Maybe<AboutPageContactSection>;
  leadership?: Maybe<AboutPageLeadership>;
  partners?: Maybe<AboutPagePartners>;
  seo?: Maybe<Seo>;
  title?: Maybe<Scalars['String']>;
  whoWeAre?: Maybe<AboutPageWhoWeAre>;
  workWithUs?: Maybe<AboutPageWorkWithUs>;
};

export type AboutCorePageFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  board?: InputMaybe<AboutPageBoardFilter>;
  contactSection?: InputMaybe<AboutPageContactSectionFilter>;
  leadership?: InputMaybe<AboutPageLeadershipFilter>;
  partners?: InputMaybe<AboutPagePartnersFilter>;
  seo?: InputMaybe<SeoFilter>;
  title?: InputMaybe<StringFilter>;
  whoWeAre?: InputMaybe<AboutPageWhoWeAreFilter>;
  workWithUs?: InputMaybe<AboutPageWorkWithUsFilter>;
};

export type AboutCorePageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  board?: InputMaybe<AboutPageBoardSorting>;
  contactSection?: InputMaybe<AboutPageContactSectionSorting>;
  leadership?: InputMaybe<AboutPageLeadershipSorting>;
  partners?: InputMaybe<AboutPagePartnersSorting>;
  seo?: InputMaybe<SeoSorting>;
  title?: InputMaybe<SortOrder>;
  whoWeAre?: InputMaybe<AboutPageWhoWeAreSorting>;
  workWithUs?: InputMaybe<AboutPageWorkWithUsSorting>;
};

export type AboutPageBoard = {
  __typename?: 'AboutPageBoard';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  documents?: Maybe<Array<Maybe<Attachment>>>;
  governanceRaw?: Maybe<Scalars['JSON']>;
  introRaw?: Maybe<Scalars['JSON']>;
  sectionHeading?: Maybe<Scalars['String']>;
};

export type AboutPageBoardFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  sectionHeading?: InputMaybe<StringFilter>;
};

export type AboutPageBoardSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  sectionHeading?: InputMaybe<SortOrder>;
};

export type AboutPageContactSection = {
  __typename?: 'AboutPageContactSection';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  infoRaw?: Maybe<Scalars['JSON']>;
};

export type AboutPageContactSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type AboutPageContactSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type AboutPageLeadership = {
  __typename?: 'AboutPageLeadership';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  introRaw?: Maybe<Scalars['JSON']>;
  sectionHeading?: Maybe<Scalars['String']>;
};

export type AboutPageLeadershipFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  sectionHeading?: InputMaybe<StringFilter>;
};

export type AboutPageLeadershipSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  sectionHeading?: InputMaybe<SortOrder>;
};

export type AboutPagePartnerImage = {
  __typename?: 'AboutPagePartnerImage';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  asset?: Maybe<SanityImageAsset>;
  crop?: Maybe<SanityImageCrop>;
  hotspot?: Maybe<SanityImageHotspot>;
  name?: Maybe<Scalars['String']>;
};

export type AboutPagePartnerImageFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  asset?: InputMaybe<SanityImageAssetFilter>;
  crop?: InputMaybe<SanityImageCropFilter>;
  hotspot?: InputMaybe<SanityImageHotspotFilter>;
  name?: InputMaybe<StringFilter>;
};

export type AboutPagePartnerImageSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  crop?: InputMaybe<SanityImageCropSorting>;
  hotspot?: InputMaybe<SanityImageHotspotSorting>;
  name?: InputMaybe<SortOrder>;
};

export type AboutPagePartners = {
  __typename?: 'AboutPagePartners';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  curriculumPartners?: Maybe<Array<Maybe<AboutPagePartnerImage>>>;
  introRaw?: Maybe<Scalars['JSON']>;
  sectionHeading?: Maybe<Scalars['String']>;
  techPartners?: Maybe<Array<Maybe<AboutPagePartnerImage>>>;
};

export type AboutPagePartnersFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  sectionHeading?: InputMaybe<StringFilter>;
};

export type AboutPagePartnersSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  sectionHeading?: InputMaybe<SortOrder>;
};

export type AboutPageTimeline = {
  __typename?: 'AboutPageTimeline';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  beyond?: Maybe<TextBlock>;
  cta?: Maybe<Cta>;
  from?: Maybe<TextBlock>;
  to?: Maybe<TextBlock>;
};

export type AboutPageTimelineFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  beyond?: InputMaybe<TextBlockFilter>;
  cta?: InputMaybe<CtaFilter>;
  from?: InputMaybe<TextBlockFilter>;
  to?: InputMaybe<TextBlockFilter>;
};

export type AboutPageTimelineSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  beyond?: InputMaybe<TextBlockSorting>;
  cta?: InputMaybe<CtaSorting>;
  from?: InputMaybe<TextBlockSorting>;
  to?: InputMaybe<TextBlockSorting>;
};

export type AboutPageWhoWeAre = {
  __typename?: 'AboutPageWhoWeAre';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  intro?: Maybe<TextAndMedia>;
  principles?: Maybe<Array<Maybe<TextBlock>>>;
  sectionHeading?: Maybe<Scalars['String']>;
  timeline?: Maybe<AboutPageTimeline>;
};

export type AboutPageWhoWeAreFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  intro?: InputMaybe<TextAndMediaFilter>;
  sectionHeading?: InputMaybe<StringFilter>;
  timeline?: InputMaybe<AboutPageTimelineFilter>;
};

export type AboutPageWhoWeAreSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  intro?: InputMaybe<TextAndMediaSorting>;
  sectionHeading?: InputMaybe<SortOrder>;
  timeline?: InputMaybe<AboutPageTimelineSorting>;
};

export type AboutPageWorkWithUs = {
  __typename?: 'AboutPageWorkWithUs';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  cards?: Maybe<AboutPageWorkWithUsCards>;
  introRaw?: Maybe<Scalars['JSON']>;
  sectionHeading?: Maybe<Scalars['String']>;
};

export type AboutPageWorkWithUsCards = {
  __typename?: 'AboutPageWorkWithUsCards';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  advisory?: Maybe<Card>;
  curriculumPartner?: Maybe<Card>;
  joinTheTeam?: Maybe<Card>;
  teacherResearch?: Maybe<Card>;
};

export type AboutPageWorkWithUsCardsFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  advisory?: InputMaybe<CardFilter>;
  curriculumPartner?: InputMaybe<CardFilter>;
  joinTheTeam?: InputMaybe<CardFilter>;
  teacherResearch?: InputMaybe<CardFilter>;
};

export type AboutPageWorkWithUsCardsSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  advisory?: InputMaybe<CardSorting>;
  curriculumPartner?: InputMaybe<CardSorting>;
  joinTheTeam?: InputMaybe<CardSorting>;
  teacherResearch?: InputMaybe<CardSorting>;
};

export type AboutPageWorkWithUsFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  cards?: InputMaybe<AboutPageWorkWithUsCardsFilter>;
  sectionHeading?: InputMaybe<StringFilter>;
};

export type AboutPageWorkWithUsSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  cards?: InputMaybe<AboutPageWorkWithUsCardsSorting>;
  sectionHeading?: InputMaybe<SortOrder>;
};

export type Attachment = Document & {
  __typename?: 'Attachment';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']>;
  _key?: Maybe<Scalars['String']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']>;
  /** Document type */
  _type?: Maybe<Scalars['String']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']>;
  file?: Maybe<File>;
  title?: Maybe<Scalars['String']>;
};

export type AttachmentFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  file?: InputMaybe<FileFilter>;
  title?: InputMaybe<StringFilter>;
};

export type AttachmentSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  file?: InputMaybe<FileSorting>;
  title?: InputMaybe<SortOrder>;
};

export type Block = {
  __typename?: 'Block';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  children?: Maybe<Array<Maybe<Span>>>;
  list?: Maybe<Scalars['String']>;
  style?: Maybe<Scalars['String']>;
};

export type BlockOrImageOrQuoteOrTextAndMedia = Block | Image | Quote | TextAndMedia;

export type BlogWebinarCategory = Document & {
  __typename?: 'BlogWebinarCategory';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']>;
  _key?: Maybe<Scalars['String']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']>;
  /** Document type */
  _type?: Maybe<Scalars['String']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']>;
  slug?: Maybe<Slug>;
  title?: Maybe<Scalars['String']>;
};

export type BlogWebinarCategoryFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  slug?: InputMaybe<SlugFilter>;
  title?: InputMaybe<StringFilter>;
};

export type BlogWebinarCategorySorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SlugSorting>;
  title?: InputMaybe<SortOrder>;
};

export type BooleanFilter = {
  /** Checks if the value is equal to the given input. */
  eq?: InputMaybe<Scalars['Boolean']>;
  /** Checks if the value is not equal to the given input. */
  neq?: InputMaybe<Scalars['Boolean']>;
};

export type Card = {
  __typename?: 'Card';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  bodyRaw?: Maybe<Scalars['JSON']>;
  cta?: Maybe<Cta>;
  image?: Maybe<Image>;
  title?: Maybe<Scalars['String']>;
};

export type CardFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  cta?: InputMaybe<CtaFilter>;
  image?: InputMaybe<ImageFilter>;
  title?: InputMaybe<StringFilter>;
};

export type CardSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  cta?: InputMaybe<CtaSorting>;
  image?: InputMaybe<ImageSorting>;
  title?: InputMaybe<SortOrder>;
};

export type Cta = {
  __typename?: 'Cta';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  external?: Maybe<Scalars['String']>;
  internal?: Maybe<NewsPostOrPlanningCorePageOrPolicyPageOrWebinar>;
  label?: Maybe<Scalars['String']>;
  linkType?: Maybe<Scalars['String']>;
};

export type CtaFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  external?: InputMaybe<StringFilter>;
  label?: InputMaybe<StringFilter>;
  linkType?: InputMaybe<StringFilter>;
};

export type CtaSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  external?: InputMaybe<SortOrder>;
  label?: InputMaybe<SortOrder>;
  linkType?: InputMaybe<SortOrder>;
};

export type CurriculumCorePage = Document & {
  __typename?: 'CurriculumCorePage';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']>;
  _key?: Maybe<Scalars['String']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']>;
  /** Document type */
  _type?: Maybe<Scalars['String']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']>;
  elements?: Maybe<CurriculumCorePageElements>;
  gettingStarted?: Maybe<TextBlock>;
  heading?: Maybe<Scalars['String']>;
  info?: Maybe<TextBlock>;
  ourApproach?: Maybe<TextBlock>;
  relatedBlogs?: Maybe<Array<Maybe<NewsPost>>>;
  relatedWebinars?: Maybe<Array<Maybe<Webinar>>>;
  seo?: Maybe<Seo>;
  summaryRaw?: Maybe<Scalars['JSON']>;
  title?: Maybe<Scalars['String']>;
};

export type CurriculumCorePageElementPost = {
  __typename?: 'CurriculumCorePageElementPost';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  post?: Maybe<NewsPost>;
  title?: Maybe<Scalars['String']>;
};

export type CurriculumCorePageElementPostFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  post?: InputMaybe<NewsPostFilter>;
  title?: InputMaybe<StringFilter>;
};

export type CurriculumCorePageElementPostSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type CurriculumCorePageElements = {
  __typename?: 'CurriculumCorePageElements';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  posts?: Maybe<Array<Maybe<CurriculumCorePageElementPost>>>;
  title?: Maybe<Scalars['String']>;
};

export type CurriculumCorePageElementsFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
};

export type CurriculumCorePageElementsSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type CurriculumCorePageFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  elements?: InputMaybe<CurriculumCorePageElementsFilter>;
  gettingStarted?: InputMaybe<TextBlockFilter>;
  heading?: InputMaybe<StringFilter>;
  info?: InputMaybe<TextBlockFilter>;
  ourApproach?: InputMaybe<TextBlockFilter>;
  seo?: InputMaybe<SeoFilter>;
  title?: InputMaybe<StringFilter>;
};

export type CurriculumCorePageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  elements?: InputMaybe<CurriculumCorePageElementsSorting>;
  gettingStarted?: InputMaybe<TextBlockSorting>;
  heading?: InputMaybe<SortOrder>;
  info?: InputMaybe<TextBlockSorting>;
  ourApproach?: InputMaybe<TextBlockSorting>;
  seo?: InputMaybe<SeoSorting>;
  title?: InputMaybe<SortOrder>;
};

export type DateFilter = {
  /** Checks if the value is equal to the given input. */
  eq?: InputMaybe<Scalars['Date']>;
  /** Checks if the value is greater than the given input. */
  gt?: InputMaybe<Scalars['Date']>;
  /** Checks if the value is greater than or equal to the given input. */
  gte?: InputMaybe<Scalars['Date']>;
  /** Checks if the value is lesser than the given input. */
  lt?: InputMaybe<Scalars['Date']>;
  /** Checks if the value is lesser than or equal to the given input. */
  lte?: InputMaybe<Scalars['Date']>;
  /** Checks if the value is not equal to the given input. */
  neq?: InputMaybe<Scalars['Date']>;
};

export type DatetimeFilter = {
  /** Checks if the value is equal to the given input. */
  eq?: InputMaybe<Scalars['DateTime']>;
  /** Checks if the value is greater than the given input. */
  gt?: InputMaybe<Scalars['DateTime']>;
  /** Checks if the value is greater than or equal to the given input. */
  gte?: InputMaybe<Scalars['DateTime']>;
  /** Checks if the value is lesser than the given input. */
  lt?: InputMaybe<Scalars['DateTime']>;
  /** Checks if the value is lesser than or equal to the given input. */
  lte?: InputMaybe<Scalars['DateTime']>;
  /** Checks if the value is not equal to the given input. */
  neq?: InputMaybe<Scalars['DateTime']>;
};

/** A Sanity document */
export type Document = {
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']>;
  /** Document type */
  _type?: Maybe<Scalars['String']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']>;
};

export type DocumentFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
};

export type DocumentSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
};

export type File = {
  __typename?: 'File';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  asset?: Maybe<SanityFileAsset>;
};

export type FileFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  asset?: InputMaybe<SanityFileAssetFilter>;
};

export type FileSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type FloatFilter = {
  /** Checks if the value is equal to the given input. */
  eq?: InputMaybe<Scalars['Float']>;
  /** Checks if the value is greater than the given input. */
  gt?: InputMaybe<Scalars['Float']>;
  /** Checks if the value is greater than or equal to the given input. */
  gte?: InputMaybe<Scalars['Float']>;
  /** Checks if the value is lesser than the given input. */
  lt?: InputMaybe<Scalars['Float']>;
  /** Checks if the value is lesser than or equal to the given input. */
  lte?: InputMaybe<Scalars['Float']>;
  /** Checks if the value is not equal to the given input. */
  neq?: InputMaybe<Scalars['Float']>;
};

export type Geopoint = {
  __typename?: 'Geopoint';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  alt?: Maybe<Scalars['Float']>;
  lat?: Maybe<Scalars['Float']>;
  lng?: Maybe<Scalars['Float']>;
};

export type GeopointFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  alt?: InputMaybe<FloatFilter>;
  lat?: InputMaybe<FloatFilter>;
  lng?: InputMaybe<FloatFilter>;
};

export type GeopointSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  alt?: InputMaybe<SortOrder>;
  lat?: InputMaybe<SortOrder>;
  lng?: InputMaybe<SortOrder>;
};

export type Homepage = Document & {
  __typename?: 'Homepage';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']>;
  _key?: Maybe<Scalars['String']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']>;
  /** Document type */
  _type?: Maybe<Scalars['String']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']>;
  heading?: Maybe<Scalars['String']>;
  seo?: Maybe<Seo>;
  sidebarCard1?: Maybe<Card>;
  sidebarCard2?: Maybe<Card>;
  sidebarForm?: Maybe<HomepageSidebarForm>;
  summaryRaw?: Maybe<Scalars['JSON']>;
};

export type HomepageFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  heading?: InputMaybe<StringFilter>;
  seo?: InputMaybe<SeoFilter>;
  sidebarCard1?: InputMaybe<CardFilter>;
  sidebarCard2?: InputMaybe<CardFilter>;
  sidebarForm?: InputMaybe<HomepageSidebarFormFilter>;
};

export type HomepageSidebarForm = {
  __typename?: 'HomepageSidebarForm';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  bodyRaw?: Maybe<Scalars['JSON']>;
  title?: Maybe<Scalars['String']>;
};

export type HomepageSidebarFormFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
};

export type HomepageSidebarFormSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type HomepageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  seo?: InputMaybe<SeoSorting>;
  sidebarCard1?: InputMaybe<CardSorting>;
  sidebarCard2?: InputMaybe<CardSorting>;
  sidebarForm?: InputMaybe<HomepageSidebarFormSorting>;
};

export type IdFilter = {
  /** Checks if the value is equal to the given input. */
  eq?: InputMaybe<Scalars['ID']>;
  in?: InputMaybe<Array<Scalars['ID']>>;
  /** Checks if the value matches the given word/words. */
  matches?: InputMaybe<Scalars['ID']>;
  /** Checks if the value is not equal to the given input. */
  neq?: InputMaybe<Scalars['ID']>;
  nin?: InputMaybe<Array<Scalars['ID']>>;
};

export type Image = {
  __typename?: 'Image';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  asset?: Maybe<SanityImageAsset>;
  crop?: Maybe<SanityImageCrop>;
  hotspot?: Maybe<SanityImageHotspot>;
};

export type ImageFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  asset?: InputMaybe<SanityImageAssetFilter>;
  crop?: InputMaybe<SanityImageCropFilter>;
  hotspot?: InputMaybe<SanityImageHotspotFilter>;
};

export type ImageSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  crop?: InputMaybe<SanityImageCropSorting>;
  hotspot?: InputMaybe<SanityImageHotspotSorting>;
};

export type IntFilter = {
  /** Checks if the value is equal to the given input. */
  eq?: InputMaybe<Scalars['Int']>;
  /** Checks if the value is greater than the given input. */
  gt?: InputMaybe<Scalars['Int']>;
  /** Checks if the value is greater than or equal to the given input. */
  gte?: InputMaybe<Scalars['Int']>;
  /** Checks if the value is lesser than the given input. */
  lt?: InputMaybe<Scalars['Int']>;
  /** Checks if the value is lesser than or equal to the given input. */
  lte?: InputMaybe<Scalars['Int']>;
  /** Checks if the value is not equal to the given input. */
  neq?: InputMaybe<Scalars['Int']>;
};

export type Link = {
  __typename?: 'Link';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  external?: Maybe<Scalars['String']>;
  internal?: Maybe<NewsPostOrPlanningCorePageOrPolicyPageOrWebinar>;
  linkType?: Maybe<Scalars['String']>;
};

export type LinkFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  external?: InputMaybe<StringFilter>;
  linkType?: InputMaybe<StringFilter>;
};

export type LinkSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  external?: InputMaybe<SortOrder>;
  linkType?: InputMaybe<SortOrder>;
};

export type MuxVideo = {
  __typename?: 'MuxVideo';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  asset?: Maybe<MuxVideoAsset>;
};

export type MuxVideoAsset = {
  __typename?: 'MuxVideoAsset';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  assetId?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  playbackId?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  thumbTime?: Maybe<Scalars['Float']>;
};

export type MuxVideoAssetFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  assetId?: InputMaybe<StringFilter>;
  filename?: InputMaybe<StringFilter>;
  playbackId?: InputMaybe<StringFilter>;
  status?: InputMaybe<StringFilter>;
  thumbTime?: InputMaybe<FloatFilter>;
};

export type MuxVideoAssetSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  assetId?: InputMaybe<SortOrder>;
  filename?: InputMaybe<SortOrder>;
  playbackId?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  thumbTime?: InputMaybe<SortOrder>;
};

export type MuxVideoFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  asset?: InputMaybe<MuxVideoAssetFilter>;
};

export type MuxVideoSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type NewsListingPage = Document & {
  __typename?: 'NewsListingPage';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']>;
  _key?: Maybe<Scalars['String']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']>;
  /** Document type */
  _type?: Maybe<Scalars['String']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']>;
  featuredPost?: Maybe<NewsPost>;
  title?: Maybe<Scalars['String']>;
};

export type NewsListingPageFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  featuredPost?: InputMaybe<NewsPostFilter>;
  title?: InputMaybe<StringFilter>;
};

export type NewsListingPageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type NewsPost = Document & {
  __typename?: 'NewsPost';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']>;
  _key?: Maybe<Scalars['String']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']>;
  /** Document type */
  _type?: Maybe<Scalars['String']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']>;
  author?: Maybe<TeamMember>;
  category?: Maybe<BlogWebinarCategory>;
  contentRaw?: Maybe<Scalars['JSON']>;
  date?: Maybe<Scalars['Date']>;
  mainImage?: Maybe<Image>;
  seo?: Maybe<Seo>;
  slug?: Maybe<Slug>;
  title?: Maybe<Scalars['String']>;
};

export type NewsPostFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  author?: InputMaybe<TeamMemberFilter>;
  category?: InputMaybe<BlogWebinarCategoryFilter>;
  date?: InputMaybe<DateFilter>;
  mainImage?: InputMaybe<ImageFilter>;
  seo?: InputMaybe<SeoFilter>;
  slug?: InputMaybe<SlugFilter>;
  title?: InputMaybe<StringFilter>;
};

export type NewsPostOrPlanningCorePageOrPolicyPageOrWebinar = NewsPost | PlanningCorePage | PolicyPage | Webinar;

export type NewsPostSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  date?: InputMaybe<SortOrder>;
  mainImage?: InputMaybe<ImageSorting>;
  seo?: InputMaybe<SeoSorting>;
  slug?: InputMaybe<SlugSorting>;
  title?: InputMaybe<SortOrder>;
};

export type PlanningCorePage = Document & {
  __typename?: 'PlanningCorePage';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']>;
  _key?: Maybe<Scalars['String']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']>;
  /** Document type */
  _type?: Maybe<Scalars['String']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']>;
  heading?: Maybe<Scalars['String']>;
  learnMoreBlock1?: Maybe<TextAndMedia>;
  learnMoreBlock2?: Maybe<TextAndMedia>;
  learnMoreHeading?: Maybe<Scalars['String']>;
  lessonElements?: Maybe<PlanningPageLessonElements>;
  lessonElementsCTA?: Maybe<Cta>;
  seo?: Maybe<Seo>;
  steps?: Maybe<PlanningPageSteps>;
  stepsCTA?: Maybe<Cta>;
  stepsHeading?: Maybe<Scalars['String']>;
  summaryRaw?: Maybe<Scalars['JSON']>;
  title?: Maybe<Scalars['String']>;
};

export type PlanningCorePageFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  heading?: InputMaybe<StringFilter>;
  learnMoreBlock1?: InputMaybe<TextAndMediaFilter>;
  learnMoreBlock2?: InputMaybe<TextAndMediaFilter>;
  learnMoreHeading?: InputMaybe<StringFilter>;
  lessonElements?: InputMaybe<PlanningPageLessonElementsFilter>;
  lessonElementsCTA?: InputMaybe<CtaFilter>;
  seo?: InputMaybe<SeoFilter>;
  steps?: InputMaybe<PlanningPageStepsFilter>;
  stepsCTA?: InputMaybe<CtaFilter>;
  stepsHeading?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
};

export type PlanningCorePageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  learnMoreBlock1?: InputMaybe<TextAndMediaSorting>;
  learnMoreBlock2?: InputMaybe<TextAndMediaSorting>;
  learnMoreHeading?: InputMaybe<SortOrder>;
  lessonElements?: InputMaybe<PlanningPageLessonElementsSorting>;
  lessonElementsCTA?: InputMaybe<CtaSorting>;
  seo?: InputMaybe<SeoSorting>;
  steps?: InputMaybe<PlanningPageStepsSorting>;
  stepsCTA?: InputMaybe<CtaSorting>;
  stepsHeading?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type PlanningPageLessonElements = {
  __typename?: 'PlanningPageLessonElements';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  exitQuiz?: Maybe<Card>;
  introQuiz?: Maybe<Card>;
  slides?: Maybe<Card>;
  video?: Maybe<Card>;
  worksheet?: Maybe<Card>;
};

export type PlanningPageLessonElementsFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  exitQuiz?: InputMaybe<CardFilter>;
  introQuiz?: InputMaybe<CardFilter>;
  slides?: InputMaybe<CardFilter>;
  video?: InputMaybe<CardFilter>;
  worksheet?: InputMaybe<CardFilter>;
};

export type PlanningPageLessonElementsSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  exitQuiz?: InputMaybe<CardSorting>;
  introQuiz?: InputMaybe<CardSorting>;
  slides?: InputMaybe<CardSorting>;
  video?: InputMaybe<CardSorting>;
  worksheet?: InputMaybe<CardSorting>;
};

export type PlanningPageSteps = {
  __typename?: 'PlanningPageSteps';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  step1?: Maybe<Card>;
  step2?: Maybe<Card>;
  step3?: Maybe<Card>;
  step4?: Maybe<Card>;
};

export type PlanningPageStepsFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  step1?: InputMaybe<CardFilter>;
  step2?: InputMaybe<CardFilter>;
  step3?: InputMaybe<CardFilter>;
  step4?: InputMaybe<CardFilter>;
};

export type PlanningPageStepsSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  step1?: InputMaybe<CardSorting>;
  step2?: InputMaybe<CardSorting>;
  step3?: InputMaybe<CardSorting>;
  step4?: InputMaybe<CardSorting>;
};

export type PolicyPage = Document & {
  __typename?: 'PolicyPage';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']>;
  _key?: Maybe<Scalars['String']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']>;
  /** Document type */
  _type?: Maybe<Scalars['String']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']>;
  bodyRaw?: Maybe<Scalars['JSON']>;
  /** When in draft mode this will be the last edit date, or when published the date at which it was published. Scheduled publishes will update to reflect the date at which it goes live. */
  fake_updatedAt?: Maybe<Scalars['String']>;
  seo?: Maybe<Seo>;
  slug?: Maybe<Slug>;
  title?: Maybe<Scalars['String']>;
};

export type PolicyPageFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  fake_updatedAt?: InputMaybe<StringFilter>;
  seo?: InputMaybe<SeoFilter>;
  slug?: InputMaybe<SlugFilter>;
  title?: InputMaybe<StringFilter>;
};

export type PolicyPageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  fake_updatedAt?: InputMaybe<SortOrder>;
  seo?: InputMaybe<SeoSorting>;
  slug?: InputMaybe<SlugSorting>;
  title?: InputMaybe<SortOrder>;
};

export type Quote = {
  __typename?: 'Quote';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  attribution?: Maybe<Scalars['String']>;
  organisation?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  /** Quotation marks will be added automatically */
  text?: Maybe<Scalars['String']>;
};

export type QuoteFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  attribution?: InputMaybe<StringFilter>;
  organisation?: InputMaybe<StringFilter>;
  role?: InputMaybe<StringFilter>;
  text?: InputMaybe<StringFilter>;
};

export type QuoteSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  attribution?: InputMaybe<SortOrder>;
  organisation?: InputMaybe<SortOrder>;
  role?: InputMaybe<SortOrder>;
  text?: InputMaybe<SortOrder>;
};

export type RootQuery = {
  __typename?: 'RootQuery';
  AboutCorePage?: Maybe<AboutCorePage>;
  Attachment?: Maybe<Attachment>;
  BlogWebinarCategory?: Maybe<BlogWebinarCategory>;
  CurriculumCorePage?: Maybe<CurriculumCorePage>;
  Document?: Maybe<Document>;
  Homepage?: Maybe<Homepage>;
  NewsListingPage?: Maybe<NewsListingPage>;
  NewsPost?: Maybe<NewsPost>;
  PlanningCorePage?: Maybe<PlanningCorePage>;
  PolicyPage?: Maybe<PolicyPage>;
  SanityFileAsset?: Maybe<SanityFileAsset>;
  SanityImageAsset?: Maybe<SanityImageAsset>;
  SupportCorePage?: Maybe<SupportCorePage>;
  TeamMember?: Maybe<TeamMember>;
  Video?: Maybe<Video>;
  Webinar?: Maybe<Webinar>;
  WebinarListingPage?: Maybe<WebinarListingPage>;
  allAboutCorePage: Array<AboutCorePage>;
  allAttachment: Array<Attachment>;
  allBlogWebinarCategory: Array<BlogWebinarCategory>;
  allCurriculumCorePage: Array<CurriculumCorePage>;
  allDocument: Array<Document>;
  allHomepage: Array<Homepage>;
  allNewsListingPage: Array<NewsListingPage>;
  allNewsPost: Array<NewsPost>;
  allPlanningCorePage: Array<PlanningCorePage>;
  allPolicyPage: Array<PolicyPage>;
  allSanityFileAsset: Array<SanityFileAsset>;
  allSanityImageAsset: Array<SanityImageAsset>;
  allSupportCorePage: Array<SupportCorePage>;
  allTeamMember: Array<TeamMember>;
  allVideo: Array<Video>;
  allWebinar: Array<Webinar>;
  allWebinarListingPage: Array<WebinarListingPage>;
};


export type RootQueryAboutCorePageArgs = {
  id: Scalars['ID'];
};


export type RootQueryAttachmentArgs = {
  id: Scalars['ID'];
};


export type RootQueryBlogWebinarCategoryArgs = {
  id: Scalars['ID'];
};


export type RootQueryCurriculumCorePageArgs = {
  id: Scalars['ID'];
};


export type RootQueryDocumentArgs = {
  id: Scalars['ID'];
};


export type RootQueryHomepageArgs = {
  id: Scalars['ID'];
};


export type RootQueryNewsListingPageArgs = {
  id: Scalars['ID'];
};


export type RootQueryNewsPostArgs = {
  id: Scalars['ID'];
};


export type RootQueryPlanningCorePageArgs = {
  id: Scalars['ID'];
};


export type RootQueryPolicyPageArgs = {
  id: Scalars['ID'];
};


export type RootQuerySanityFileAssetArgs = {
  id: Scalars['ID'];
};


export type RootQuerySanityImageAssetArgs = {
  id: Scalars['ID'];
};


export type RootQuerySupportCorePageArgs = {
  id: Scalars['ID'];
};


export type RootQueryTeamMemberArgs = {
  id: Scalars['ID'];
};


export type RootQueryVideoArgs = {
  id: Scalars['ID'];
};


export type RootQueryWebinarArgs = {
  id: Scalars['ID'];
};


export type RootQueryWebinarListingPageArgs = {
  id: Scalars['ID'];
};


export type RootQueryAllAboutCorePageArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<AboutCorePageSorting>>;
  where?: InputMaybe<AboutCorePageFilter>;
};


export type RootQueryAllAttachmentArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<AttachmentSorting>>;
  where?: InputMaybe<AttachmentFilter>;
};


export type RootQueryAllBlogWebinarCategoryArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<BlogWebinarCategorySorting>>;
  where?: InputMaybe<BlogWebinarCategoryFilter>;
};


export type RootQueryAllCurriculumCorePageArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<CurriculumCorePageSorting>>;
  where?: InputMaybe<CurriculumCorePageFilter>;
};


export type RootQueryAllDocumentArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<DocumentSorting>>;
  where?: InputMaybe<DocumentFilter>;
};


export type RootQueryAllHomepageArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<HomepageSorting>>;
  where?: InputMaybe<HomepageFilter>;
};


export type RootQueryAllNewsListingPageArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<NewsListingPageSorting>>;
  where?: InputMaybe<NewsListingPageFilter>;
};


export type RootQueryAllNewsPostArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<NewsPostSorting>>;
  where?: InputMaybe<NewsPostFilter>;
};


export type RootQueryAllPlanningCorePageArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<PlanningCorePageSorting>>;
  where?: InputMaybe<PlanningCorePageFilter>;
};


export type RootQueryAllPolicyPageArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<PolicyPageSorting>>;
  where?: InputMaybe<PolicyPageFilter>;
};


export type RootQueryAllSanityFileAssetArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<SanityFileAssetSorting>>;
  where?: InputMaybe<SanityFileAssetFilter>;
};


export type RootQueryAllSanityImageAssetArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<SanityImageAssetSorting>>;
  where?: InputMaybe<SanityImageAssetFilter>;
};


export type RootQueryAllSupportCorePageArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<SupportCorePageSorting>>;
  where?: InputMaybe<SupportCorePageFilter>;
};


export type RootQueryAllTeamMemberArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<TeamMemberSorting>>;
  where?: InputMaybe<TeamMemberFilter>;
};


export type RootQueryAllVideoArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<VideoSorting>>;
  where?: InputMaybe<VideoFilter>;
};


export type RootQueryAllWebinarArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<WebinarSorting>>;
  where?: InputMaybe<WebinarFilter>;
};


export type RootQueryAllWebinarListingPageArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<WebinarListingPageSorting>>;
  where?: InputMaybe<WebinarListingPageFilter>;
};

export type SanityAssetSourceData = {
  __typename?: 'SanityAssetSourceData';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  /** The unique ID for the asset within the originating source so you can programatically find back to it */
  id?: Maybe<Scalars['String']>;
  /** A canonical name for the source this asset is originating from */
  name?: Maybe<Scalars['String']>;
  /** A URL to find more information about this asset in the originating source */
  url?: Maybe<Scalars['String']>;
};

export type SanityAssetSourceDataFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  url?: InputMaybe<StringFilter>;
};

export type SanityAssetSourceDataSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  url?: InputMaybe<SortOrder>;
};

export type SanityFileAsset = Document & {
  __typename?: 'SanityFileAsset';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']>;
  _key?: Maybe<Scalars['String']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']>;
  /** Document type */
  _type?: Maybe<Scalars['String']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']>;
  altText?: Maybe<Scalars['String']>;
  assetId?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  extension?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  mimeType?: Maybe<Scalars['String']>;
  originalFilename?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  sha1hash?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Float']>;
  source?: Maybe<SanityAssetSourceData>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type SanityFileAssetFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  altText?: InputMaybe<StringFilter>;
  assetId?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringFilter>;
  extension?: InputMaybe<StringFilter>;
  label?: InputMaybe<StringFilter>;
  mimeType?: InputMaybe<StringFilter>;
  originalFilename?: InputMaybe<StringFilter>;
  path?: InputMaybe<StringFilter>;
  sha1hash?: InputMaybe<StringFilter>;
  size?: InputMaybe<FloatFilter>;
  source?: InputMaybe<SanityAssetSourceDataFilter>;
  title?: InputMaybe<StringFilter>;
  url?: InputMaybe<StringFilter>;
};

export type SanityFileAssetSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  altText?: InputMaybe<SortOrder>;
  assetId?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  extension?: InputMaybe<SortOrder>;
  label?: InputMaybe<SortOrder>;
  mimeType?: InputMaybe<SortOrder>;
  originalFilename?: InputMaybe<SortOrder>;
  path?: InputMaybe<SortOrder>;
  sha1hash?: InputMaybe<SortOrder>;
  size?: InputMaybe<SortOrder>;
  source?: InputMaybe<SanityAssetSourceDataSorting>;
  title?: InputMaybe<SortOrder>;
  url?: InputMaybe<SortOrder>;
};

export type SanityImageAsset = Document & {
  __typename?: 'SanityImageAsset';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']>;
  _key?: Maybe<Scalars['String']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']>;
  /** Document type */
  _type?: Maybe<Scalars['String']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']>;
  altText?: Maybe<Scalars['String']>;
  assetId?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  extension?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  metadata?: Maybe<SanityImageMetadata>;
  mimeType?: Maybe<Scalars['String']>;
  originalFilename?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  sha1hash?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Float']>;
  source?: Maybe<SanityAssetSourceData>;
  title?: Maybe<Scalars['String']>;
  uploadId?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type SanityImageAssetFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  altText?: InputMaybe<StringFilter>;
  assetId?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringFilter>;
  extension?: InputMaybe<StringFilter>;
  label?: InputMaybe<StringFilter>;
  metadata?: InputMaybe<SanityImageMetadataFilter>;
  mimeType?: InputMaybe<StringFilter>;
  originalFilename?: InputMaybe<StringFilter>;
  path?: InputMaybe<StringFilter>;
  sha1hash?: InputMaybe<StringFilter>;
  size?: InputMaybe<FloatFilter>;
  source?: InputMaybe<SanityAssetSourceDataFilter>;
  title?: InputMaybe<StringFilter>;
  uploadId?: InputMaybe<StringFilter>;
  url?: InputMaybe<StringFilter>;
};

export type SanityImageAssetSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  altText?: InputMaybe<SortOrder>;
  assetId?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  extension?: InputMaybe<SortOrder>;
  label?: InputMaybe<SortOrder>;
  metadata?: InputMaybe<SanityImageMetadataSorting>;
  mimeType?: InputMaybe<SortOrder>;
  originalFilename?: InputMaybe<SortOrder>;
  path?: InputMaybe<SortOrder>;
  sha1hash?: InputMaybe<SortOrder>;
  size?: InputMaybe<SortOrder>;
  source?: InputMaybe<SanityAssetSourceDataSorting>;
  title?: InputMaybe<SortOrder>;
  uploadId?: InputMaybe<SortOrder>;
  url?: InputMaybe<SortOrder>;
};

export type SanityImageCrop = {
  __typename?: 'SanityImageCrop';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  bottom?: Maybe<Scalars['Float']>;
  left?: Maybe<Scalars['Float']>;
  right?: Maybe<Scalars['Float']>;
  top?: Maybe<Scalars['Float']>;
};

export type SanityImageCropFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  bottom?: InputMaybe<FloatFilter>;
  left?: InputMaybe<FloatFilter>;
  right?: InputMaybe<FloatFilter>;
  top?: InputMaybe<FloatFilter>;
};

export type SanityImageCropSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  bottom?: InputMaybe<SortOrder>;
  left?: InputMaybe<SortOrder>;
  right?: InputMaybe<SortOrder>;
  top?: InputMaybe<SortOrder>;
};

export type SanityImageDimensions = {
  __typename?: 'SanityImageDimensions';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  aspectRatio?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Float']>;
  width?: Maybe<Scalars['Float']>;
};

export type SanityImageDimensionsFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  aspectRatio?: InputMaybe<FloatFilter>;
  height?: InputMaybe<FloatFilter>;
  width?: InputMaybe<FloatFilter>;
};

export type SanityImageDimensionsSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  aspectRatio?: InputMaybe<SortOrder>;
  height?: InputMaybe<SortOrder>;
  width?: InputMaybe<SortOrder>;
};

export type SanityImageHotspot = {
  __typename?: 'SanityImageHotspot';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  height?: Maybe<Scalars['Float']>;
  width?: Maybe<Scalars['Float']>;
  x?: Maybe<Scalars['Float']>;
  y?: Maybe<Scalars['Float']>;
};

export type SanityImageHotspotFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  height?: InputMaybe<FloatFilter>;
  width?: InputMaybe<FloatFilter>;
  x?: InputMaybe<FloatFilter>;
  y?: InputMaybe<FloatFilter>;
};

export type SanityImageHotspotSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  height?: InputMaybe<SortOrder>;
  width?: InputMaybe<SortOrder>;
  x?: InputMaybe<SortOrder>;
  y?: InputMaybe<SortOrder>;
};

export type SanityImageMetadata = {
  __typename?: 'SanityImageMetadata';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  blurHash?: Maybe<Scalars['String']>;
  dimensions?: Maybe<SanityImageDimensions>;
  hasAlpha?: Maybe<Scalars['Boolean']>;
  isOpaque?: Maybe<Scalars['Boolean']>;
  location?: Maybe<Geopoint>;
  lqip?: Maybe<Scalars['String']>;
  palette?: Maybe<SanityImagePalette>;
};

export type SanityImageMetadataFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  blurHash?: InputMaybe<StringFilter>;
  dimensions?: InputMaybe<SanityImageDimensionsFilter>;
  hasAlpha?: InputMaybe<BooleanFilter>;
  isOpaque?: InputMaybe<BooleanFilter>;
  location?: InputMaybe<GeopointFilter>;
  lqip?: InputMaybe<StringFilter>;
  palette?: InputMaybe<SanityImagePaletteFilter>;
};

export type SanityImageMetadataSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  blurHash?: InputMaybe<SortOrder>;
  dimensions?: InputMaybe<SanityImageDimensionsSorting>;
  hasAlpha?: InputMaybe<SortOrder>;
  isOpaque?: InputMaybe<SortOrder>;
  location?: InputMaybe<GeopointSorting>;
  lqip?: InputMaybe<SortOrder>;
  palette?: InputMaybe<SanityImagePaletteSorting>;
};

export type SanityImagePalette = {
  __typename?: 'SanityImagePalette';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  darkMuted?: Maybe<SanityImagePaletteSwatch>;
  darkVibrant?: Maybe<SanityImagePaletteSwatch>;
  dominant?: Maybe<SanityImagePaletteSwatch>;
  lightMuted?: Maybe<SanityImagePaletteSwatch>;
  lightVibrant?: Maybe<SanityImagePaletteSwatch>;
  muted?: Maybe<SanityImagePaletteSwatch>;
  vibrant?: Maybe<SanityImagePaletteSwatch>;
};

export type SanityImagePaletteFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  darkMuted?: InputMaybe<SanityImagePaletteSwatchFilter>;
  darkVibrant?: InputMaybe<SanityImagePaletteSwatchFilter>;
  dominant?: InputMaybe<SanityImagePaletteSwatchFilter>;
  lightMuted?: InputMaybe<SanityImagePaletteSwatchFilter>;
  lightVibrant?: InputMaybe<SanityImagePaletteSwatchFilter>;
  muted?: InputMaybe<SanityImagePaletteSwatchFilter>;
  vibrant?: InputMaybe<SanityImagePaletteSwatchFilter>;
};

export type SanityImagePaletteSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  darkMuted?: InputMaybe<SanityImagePaletteSwatchSorting>;
  darkVibrant?: InputMaybe<SanityImagePaletteSwatchSorting>;
  dominant?: InputMaybe<SanityImagePaletteSwatchSorting>;
  lightMuted?: InputMaybe<SanityImagePaletteSwatchSorting>;
  lightVibrant?: InputMaybe<SanityImagePaletteSwatchSorting>;
  muted?: InputMaybe<SanityImagePaletteSwatchSorting>;
  vibrant?: InputMaybe<SanityImagePaletteSwatchSorting>;
};

export type SanityImagePaletteSwatch = {
  __typename?: 'SanityImagePaletteSwatch';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  background?: Maybe<Scalars['String']>;
  foreground?: Maybe<Scalars['String']>;
  population?: Maybe<Scalars['Float']>;
  title?: Maybe<Scalars['String']>;
};

export type SanityImagePaletteSwatchFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  background?: InputMaybe<StringFilter>;
  foreground?: InputMaybe<StringFilter>;
  population?: InputMaybe<FloatFilter>;
  title?: InputMaybe<StringFilter>;
};

export type SanityImagePaletteSwatchSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  background?: InputMaybe<SortOrder>;
  foreground?: InputMaybe<SortOrder>;
  population?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type Sanity_DocumentFilter = {
  /** All documents that are drafts. */
  is_draft?: InputMaybe<Scalars['Boolean']>;
  /** All documents referencing the given document ID. */
  references?: InputMaybe<Scalars['ID']>;
};

export type Seo = {
  __typename?: 'Seo';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  canonicalURL?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type SeoFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  canonicalURL?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
};

export type SeoSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  canonicalURL?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type Slug = {
  __typename?: 'Slug';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  current?: Maybe<Scalars['String']>;
};

export type SlugFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  current?: InputMaybe<StringFilter>;
};

export type SlugSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  current?: InputMaybe<SortOrder>;
};

export enum SortOrder {
  /** Sorts on the value in ascending order. */
  Asc = 'ASC',
  /** Sorts on the value in descending order. */
  Desc = 'DESC'
}

export type Span = {
  __typename?: 'Span';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  marks?: Maybe<Array<Maybe<Scalars['String']>>>;
  text?: Maybe<Scalars['String']>;
};

export type StringFilter = {
  /** Checks if the value is equal to the given input. */
  eq?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  /** Checks if the value matches the given word/words. */
  matches?: InputMaybe<Scalars['String']>;
  /** Checks if the value is not equal to the given input. */
  neq?: InputMaybe<Scalars['String']>;
  nin?: InputMaybe<Array<Scalars['String']>>;
};

export type SupportCorePage = Document & {
  __typename?: 'SupportCorePage';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']>;
  _key?: Maybe<Scalars['String']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']>;
  /** Document type */
  _type?: Maybe<Scalars['String']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']>;
  cover?: Maybe<SupportPageCover>;
  curriculum?: Maybe<TextBlock>;
  development?: Maybe<TextBlock>;
  heading?: Maybe<Scalars['String']>;
  planning?: Maybe<TextBlock>;
  relatedBlogs?: Maybe<Array<Maybe<NewsPost>>>;
  relatedWebinars?: Maybe<Array<Maybe<Webinar>>>;
  seo?: Maybe<Seo>;
  summaryRaw?: Maybe<Scalars['JSON']>;
  title?: Maybe<Scalars['String']>;
};

export type SupportCorePageFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  cover?: InputMaybe<SupportPageCoverFilter>;
  curriculum?: InputMaybe<TextBlockFilter>;
  development?: InputMaybe<TextBlockFilter>;
  heading?: InputMaybe<StringFilter>;
  planning?: InputMaybe<TextBlockFilter>;
  seo?: InputMaybe<SeoFilter>;
  title?: InputMaybe<StringFilter>;
};

export type SupportCorePageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  cover?: InputMaybe<SupportPageCoverSorting>;
  curriculum?: InputMaybe<TextBlockSorting>;
  development?: InputMaybe<TextBlockSorting>;
  heading?: InputMaybe<SortOrder>;
  planning?: InputMaybe<TextBlockSorting>;
  seo?: InputMaybe<SeoSorting>;
  title?: InputMaybe<SortOrder>;
};

export type SupportPageCover = {
  __typename?: 'SupportPageCover';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  bodyRaw?: Maybe<Scalars['JSON']>;
  cta?: Maybe<Cta>;
  quote?: Maybe<Quote>;
  title?: Maybe<Scalars['String']>;
};

export type SupportPageCoverFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  cta?: InputMaybe<CtaFilter>;
  quote?: InputMaybe<QuoteFilter>;
  title?: InputMaybe<StringFilter>;
};

export type SupportPageCoverSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  cta?: InputMaybe<CtaSorting>;
  quote?: InputMaybe<QuoteSorting>;
  title?: InputMaybe<SortOrder>;
};

export type TeamMember = Document & {
  __typename?: 'TeamMember';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']>;
  _key?: Maybe<Scalars['String']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']>;
  /** Document type */
  _type?: Maybe<Scalars['String']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']>;
  bioRaw?: Maybe<Scalars['JSON']>;
  image?: Maybe<Image>;
  /** Is this team member still part of Oak? */
  isCurrent?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  slug?: Maybe<Slug>;
};

export type TeamMemberFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  image?: InputMaybe<ImageFilter>;
  isCurrent?: InputMaybe<BooleanFilter>;
  name?: InputMaybe<StringFilter>;
  role?: InputMaybe<StringFilter>;
  slug?: InputMaybe<SlugFilter>;
};

export type TeamMemberSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageSorting>;
  isCurrent?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  role?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SlugSorting>;
};

export type TextAndMedia = {
  __typename?: 'TextAndMedia';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  alignMedia?: Maybe<Scalars['String']>;
  bodyRaw?: Maybe<Scalars['JSON']>;
  cta?: Maybe<Cta>;
  image?: Maybe<Image>;
  mediaType?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  video?: Maybe<Video>;
};

export type TextAndMediaFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  alignMedia?: InputMaybe<StringFilter>;
  cta?: InputMaybe<CtaFilter>;
  image?: InputMaybe<ImageFilter>;
  mediaType?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
  video?: InputMaybe<VideoFilter>;
};

export type TextAndMediaSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  alignMedia?: InputMaybe<SortOrder>;
  cta?: InputMaybe<CtaSorting>;
  image?: InputMaybe<ImageSorting>;
  mediaType?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type TextBlock = {
  __typename?: 'TextBlock';
  _key?: Maybe<Scalars['String']>;
  _type?: Maybe<Scalars['String']>;
  bodyRaw?: Maybe<Scalars['JSON']>;
  cta?: Maybe<Cta>;
  title?: Maybe<Scalars['String']>;
};

export type TextBlockFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  cta?: InputMaybe<CtaFilter>;
  title?: InputMaybe<StringFilter>;
};

export type TextBlockSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  cta?: InputMaybe<CtaSorting>;
  title?: InputMaybe<SortOrder>;
};

export type Video = Document & {
  __typename?: 'Video';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']>;
  _key?: Maybe<Scalars['String']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']>;
  /** Document type */
  _type?: Maybe<Scalars['String']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']>;
  title?: Maybe<Scalars['String']>;
  video?: Maybe<MuxVideo>;
};

export type VideoFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  title?: InputMaybe<StringFilter>;
  video?: InputMaybe<MuxVideoFilter>;
};

export type VideoSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  video?: InputMaybe<MuxVideoSorting>;
};

export type Webinar = Document & {
  __typename?: 'Webinar';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']>;
  _key?: Maybe<Scalars['String']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']>;
  /** Document type */
  _type?: Maybe<Scalars['String']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']>;
  category?: Maybe<BlogWebinarCategory>;
  date?: Maybe<Scalars['DateTime']>;
  hosts?: Maybe<Array<Maybe<TeamMember>>>;
  seo?: Maybe<Seo>;
  slug?: Maybe<Slug>;
  summaryRaw?: Maybe<Scalars['JSON']>;
  title?: Maybe<Scalars['String']>;
};

export type WebinarFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  category?: InputMaybe<BlogWebinarCategoryFilter>;
  date?: InputMaybe<DatetimeFilter>;
  seo?: InputMaybe<SeoFilter>;
  slug?: InputMaybe<SlugFilter>;
  title?: InputMaybe<StringFilter>;
};

export type WebinarListingPage = Document & {
  __typename?: 'WebinarListingPage';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']>;
  _key?: Maybe<Scalars['String']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']>;
  /** Document type */
  _type?: Maybe<Scalars['String']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']>;
  title?: Maybe<Scalars['String']>;
};

export type WebinarListingPageFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  title?: InputMaybe<StringFilter>;
};

export type WebinarListingPageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type WebinarSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  date?: InputMaybe<SortOrder>;
  seo?: InputMaybe<SeoSorting>;
  slug?: InputMaybe<SlugSorting>;
  title?: InputMaybe<SortOrder>;
};

export type AboutCorePageQueryVariables = Exact<{
  isDraft?: InputMaybe<Scalars['Boolean']>;
}>;


export type AboutCorePageQuery = { __typename?: 'RootQuery', allAboutCorePage: Array<{ __typename?: 'AboutCorePage', title?: string | null, id?: string | null, whoWeAre?: { __typename?: 'AboutPageWhoWeAre', sectionHeading?: string | null, intro?: { __typename?: 'TextAndMedia', title?: string | null, mediaType?: string | null, alignMedia?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, video?: { __typename?: 'Video', title?: string | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null } | null } | null, timeline?: { __typename?: 'AboutPageTimeline', from?: { __typename?: 'TextBlock', title?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null, to?: { __typename?: 'TextBlock', title?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null, beyond?: { __typename?: 'TextBlock', title?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null, principles?: Array<{ __typename?: 'TextBlock', title?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null> | null } | null, leadership?: { __typename?: 'AboutPageLeadership', sectionHeading?: string | null, introPortableText?: any | null } | null, board?: { __typename?: 'AboutPageBoard', sectionHeading?: string | null, introPortableText?: any | null, governancePortableText?: any | null, documents?: Array<{ __typename?: 'Attachment', title?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | null> | null } | null, partners?: { __typename?: 'AboutPagePartners', sectionHeading?: string | null, introPortableText?: any | null, techPartners?: Array<{ __typename?: 'AboutPagePartnerImage', name?: string | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null> | null, curriculumPartners?: Array<{ __typename?: 'AboutPagePartnerImage', name?: string | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null> | null } | null, workWithUs?: { __typename?: 'AboutPageWorkWithUs', sectionHeading?: string | null, introPortableText?: any | null, cards?: { __typename?: 'AboutPageWorkWithUsCards', joinTheTeam?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null, advisory?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null, curriculumPartner?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null, teacherResearch?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null } | null } | null, contactSection?: { __typename?: 'AboutPageContactSection', infoPortableText?: any | null } | null }> };

export type AllBlogPostsQueryVariables = Exact<{
  isDraft?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type AllBlogPostsQuery = { __typename?: 'RootQuery', allNewsPost: Array<{ __typename?: 'NewsPost', title?: string | null, date?: any | null, id?: string | null, contentPortableText?: any | null, slug?: { __typename?: 'Slug', current?: string | null } | null, category?: { __typename?: 'BlogWebinarCategory', title?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null }> };

export type AllPolicyPagesQueryVariables = Exact<{
  isDraft?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type AllPolicyPagesQuery = { __typename?: 'RootQuery', allPolicyPage: Array<{ __typename?: 'PolicyPage', title?: string | null, id?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null }> };

export type AllWebinarsQueryVariables = Exact<{
  isDraft?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type AllWebinarsQuery = { __typename?: 'RootQuery', allWebinar: Array<{ __typename?: 'Webinar', title?: string | null, id?: string | null, summaryPortableText?: any | null, slug?: { __typename?: 'Slug', current?: string | null } | null }> };

export type BlogPostBySlugQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
  isDraft?: InputMaybe<Scalars['Boolean']>;
}>;


export type BlogPostBySlugQuery = { __typename?: 'RootQuery', allNewsPost: Array<{ __typename?: 'NewsPost', title?: string | null, date?: any | null, id?: string | null, contentPortableText?: any | null, author?: { __typename?: 'TeamMember', _key?: string | null, name?: string | null, id?: string | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', url?: string | null } | null } | null } | null, slug?: { __typename?: 'Slug', current?: string | null } | null }> };

export type BlogPortableTextReferencesQueryVariables = Exact<{
  ids?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;


export type BlogPortableTextReferencesQuery = { __typename?: 'RootQuery', allDocument: Array<{ __typename?: 'AboutCorePage', _id?: string | null, _type?: string | null } | { __typename?: 'Attachment', _id?: string | null, _type?: string | null } | { __typename?: 'BlogWebinarCategory', _id?: string | null, _type?: string | null } | { __typename?: 'CurriculumCorePage', _id?: string | null, _type?: string | null } | { __typename?: 'Homepage', _id?: string | null, _type?: string | null } | { __typename?: 'NewsListingPage', _id?: string | null, _type?: string | null } | { __typename?: 'NewsPost', _id?: string | null, _type?: string | null } | { __typename?: 'PlanningCorePage', _id?: string | null, _type?: string | null } | { __typename?: 'PolicyPage', _id?: string | null, _type?: string | null } | { __typename?: 'SanityFileAsset', _id?: string | null, _type?: string | null } | { __typename?: 'SanityImageAsset', _id?: string | null, _type?: string | null, url?: string | null } | { __typename?: 'SupportCorePage', _id?: string | null, _type?: string | null } | { __typename?: 'TeamMember', _id?: string | null, _type?: string | null } | { __typename?: 'Video', _id?: string | null, _type?: string | null, title?: string | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null } | { __typename?: 'Webinar', _id?: string | null, _type?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', _id?: string | null, _type?: string | null }> };

export type BlogPreviewFieldsFragment = { __typename?: 'NewsPost', title?: string | null, date?: any | null, id?: string | null, contentPortableText?: any | null, slug?: { __typename?: 'Slug', current?: string | null } | null, category?: { __typename?: 'BlogWebinarCategory', title?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null };

export type CardFragment = { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null };

export type CtaFragment = { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null };

export type CurriculumCorePageQueryVariables = Exact<{
  isDraft?: InputMaybe<Scalars['Boolean']>;
}>;


export type CurriculumCorePageQuery = { __typename?: 'RootQuery', allCurriculumCorePage: Array<{ __typename?: 'CurriculumCorePage', title?: string | null, heading?: string | null, id?: string | null, summaryPortableText?: any | null, info?: { __typename?: 'TextBlock', title?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null, gettingStarted?: { __typename?: 'TextBlock', title?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null, ourApproach?: { __typename?: 'TextBlock', title?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null, elements?: { __typename?: 'CurriculumCorePageElements', title?: string | null, posts?: Array<{ __typename?: 'CurriculumCorePageElementPost', post?: { __typename?: 'NewsPost', title?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null> | null } | null }> };

export type ImageFragment = { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null };

export type ImageAssetFragment = { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null };

export type PlanningCorePageQueryVariables = Exact<{
  isDraft?: InputMaybe<Scalars['Boolean']>;
}>;


export type PlanningCorePageQuery = { __typename?: 'RootQuery', allPlanningCorePage: Array<{ __typename?: 'PlanningCorePage', title?: string | null, heading?: string | null, stepsHeading?: string | null, learnMoreHeading?: string | null, id?: string | null, summaryPortableText?: any | null, lessonElements?: { __typename?: 'PlanningPageLessonElements', _type?: string | null, introQuiz?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null, video?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null, slides?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null, worksheet?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null, exitQuiz?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null } | null, lessonElementsCTA?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null, steps?: { __typename?: 'PlanningPageSteps', step1?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null, step2?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null, step3?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null, step4?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null } | null } | null, stepsCTA?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null, learnMoreBlock1?: { __typename?: 'TextAndMedia', title?: string | null, mediaType?: string | null, alignMedia?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, video?: { __typename?: 'Video', title?: string | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null } | null } | null, learnMoreBlock2?: { __typename?: 'TextAndMedia', title?: string | null, mediaType?: string | null, alignMedia?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, video?: { __typename?: 'Video', title?: string | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null } | null } | null }> };

export type PolicyPageBySlugQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
  isDraft?: InputMaybe<Scalars['Boolean']>;
}>;


export type PolicyPageBySlugQuery = { __typename?: 'RootQuery', allPolicyPage: Array<{ __typename?: 'PolicyPage', title?: string | null, id?: string | null, lastUpdatedAt?: any | null, bodyPortableText?: any | null, slug?: { __typename?: 'Slug', current?: string | null } | null }> };

export type TextAndMediaFragment = { __typename?: 'TextAndMedia', title?: string | null, mediaType?: string | null, alignMedia?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, video?: { __typename?: 'Video', title?: string | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null } | null };

export type TextBlockFragment = { __typename?: 'TextBlock', title?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, internal?: { __typename?: 'NewsPost', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', contentType?: string | null } | { __typename?: 'PolicyPage', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'Webinar', contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null } | null };

export type VideoFragment = { __typename?: 'Video', title?: string | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null };

export type WebinarBySlugQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>;
  isDraft?: InputMaybe<Scalars['Boolean']>;
}>;


export type WebinarBySlugQuery = { __typename?: 'RootQuery', allWebinar: Array<{ __typename?: 'Webinar', title?: string | null, date?: any | null, id?: string | null, summaryPortableText?: any | null, slug?: { __typename?: 'Slug', current?: string | null } | null, hosts?: Array<{ __typename?: 'TeamMember', _key?: string | null, name?: string | null, id?: string | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', url?: string | null } | null } | null } | null> | null }> };

export type WebinarPreviewFieldsFragment = { __typename?: 'Webinar', title?: string | null, id?: string | null, summaryPortableText?: any | null, slug?: { __typename?: 'Slug', current?: string | null } | null };

export const BlogPreviewFieldsFragmentDoc = gql`
    fragment BlogPreviewFields on NewsPost {
  id: _id
  title
  date
  slug {
    current
  }
  category {
    title
    slug {
      current
    }
  }
  contentPortableText: contentRaw
}
    `;
export const ImageAssetFragmentDoc = gql`
    fragment ImageAsset on SanityImageAsset {
  _id
  url
}
    `;
export const ImageFragmentDoc = gql`
    fragment Image on Image {
  asset {
    ...ImageAsset
  }
}
    ${ImageAssetFragmentDoc}`;
export const CtaFragmentDoc = gql`
    fragment CTA on Cta {
  label
  linkType
  external
  internal {
    ... on Webinar {
      contentType: _type
      slug {
        current
      }
    }
    ... on NewsPost {
      contentType: _type
      slug {
        current
      }
    }
    ... on PlanningCorePage {
      contentType: _type
    }
    ... on PolicyPage {
      contentType: _type
      slug {
        current
      }
    }
  }
}
    `;
export const CardFragmentDoc = gql`
    fragment Card on Card {
  title
  image {
    ...Image
  }
  bodyPortableText: bodyRaw
  cta {
    ...CTA
  }
}
    ${ImageFragmentDoc}
${CtaFragmentDoc}`;
export const VideoFragmentDoc = gql`
    fragment Video on Video {
  title
  video {
    asset {
      assetId
      thumbTime
      playbackId
    }
  }
}
    `;
export const TextAndMediaFragmentDoc = gql`
    fragment TextAndMedia on TextAndMedia {
  title
  bodyPortableText: bodyRaw
  mediaType
  alignMedia
  cta {
    ...CTA
  }
  image {
    ...Image
  }
  video {
    ...Video
  }
}
    ${CtaFragmentDoc}
${ImageFragmentDoc}
${VideoFragmentDoc}`;
export const TextBlockFragmentDoc = gql`
    fragment TextBlock on TextBlock {
  title
  bodyPortableText: bodyRaw
  cta {
    ...CTA
  }
}
    ${CtaFragmentDoc}`;
export const WebinarPreviewFieldsFragmentDoc = gql`
    fragment WebinarPreviewFields on Webinar {
  id: _id
  title
  slug {
    current
  }
  summaryPortableText: summaryRaw
}
    `;
export const AboutCorePageDocument = gql`
    query aboutCorePage($isDraft: Boolean = false) {
  allAboutCorePage(
    where: {_: {is_draft: $isDraft}, _id: {matches: "*aboutCorePage"}}
  ) {
    id: _id
    title
    whoWeAre {
      sectionHeading
      intro {
        ...TextAndMedia
      }
      timeline {
        from {
          ...TextBlock
        }
        to {
          ...TextBlock
        }
        beyond {
          ...TextBlock
        }
        cta {
          ...CTA
        }
      }
      principles {
        ...TextBlock
      }
    }
    leadership {
      sectionHeading
      introPortableText: introRaw
    }
    board {
      sectionHeading
      introPortableText: introRaw
      documents {
        title
        file {
          asset {
            extension
            size
            url
          }
        }
      }
      governancePortableText: governanceRaw
    }
    partners {
      sectionHeading
      introPortableText: introRaw
      techPartners {
        name
        asset {
          ...ImageAsset
        }
      }
      curriculumPartners {
        name
        asset {
          ...ImageAsset
        }
      }
    }
    workWithUs {
      sectionHeading
      introPortableText: introRaw
      cards {
        joinTheTeam {
          ...Card
        }
        advisory {
          ...Card
        }
        curriculumPartner {
          ...Card
        }
        teacherResearch {
          ...Card
        }
      }
    }
    contactSection {
      infoPortableText: infoRaw
    }
  }
}
    ${TextAndMediaFragmentDoc}
${TextBlockFragmentDoc}
${CtaFragmentDoc}
${ImageAssetFragmentDoc}
${CardFragmentDoc}`;
export const AllBlogPostsDocument = gql`
    query allBlogPosts($isDraft: Boolean = false, $limit: Int = 9999) {
  allNewsPost(
    where: {_: {is_draft: $isDraft}}
    sort: [{date: ASC}]
    limit: $limit
  ) {
    ...BlogPreviewFields
  }
}
    ${BlogPreviewFieldsFragmentDoc}`;
export const AllPolicyPagesDocument = gql`
    query allPolicyPages($isDraft: Boolean = false, $limit: Int = 9999) {
  allPolicyPage(where: {_: {is_draft: $isDraft}}, limit: $limit) {
    id: _id
    title
    slug {
      current
    }
  }
}
    `;
export const AllWebinarsDocument = gql`
    query allWebinars($isDraft: Boolean = false, $limit: Int = 9999) {
  allWebinar(where: {_: {is_draft: $isDraft}}, sort: [{date: ASC}], limit: $limit) {
    ...WebinarPreviewFields
  }
}
    ${WebinarPreviewFieldsFragmentDoc}`;
export const BlogPostBySlugDocument = gql`
    query blogPostBySlug($slug: String, $isDraft: Boolean = false) {
  allNewsPost(where: {_: {is_draft: $isDraft}, slug: {current: {eq: $slug}}}) {
    id: _id
    title
    date
    author {
      id: _id
      _key
      name
      image {
        asset {
          url
        }
      }
    }
    slug {
      current
    }
    contentPortableText: contentRaw
  }
}
    `;
export const BlogPortableTextReferencesDocument = gql`
    query blogPortableTextReferences($ids: [ID!]) {
  allDocument(where: {_id: {in: $ids}}) {
    _id
    _type
    ... on Webinar {
      slug {
        current
      }
    }
    ... on SanityImageAsset {
      ...ImageAsset
    }
    ... on Video {
      ...Video
    }
  }
}
    ${ImageAssetFragmentDoc}
${VideoFragmentDoc}`;
export const CurriculumCorePageDocument = gql`
    query curriculumCorePage($isDraft: Boolean = false) {
  allCurriculumCorePage(
    where: {_: {is_draft: $isDraft}, _id: {matches: "*curriculumCorePage"}}
  ) {
    id: _id
    title
    heading
    summaryPortableText: summaryRaw
    info {
      ...TextBlock
    }
    gettingStarted {
      ...TextBlock
    }
    ourApproach {
      ...TextBlock
    }
    elements {
      title
      posts {
        post {
          title
          slug {
            current
          }
        }
      }
    }
  }
}
    ${TextBlockFragmentDoc}`;
export const PlanningCorePageDocument = gql`
    query planningCorePage($isDraft: Boolean = false) {
  allPlanningCorePage(
    where: {_: {is_draft: $isDraft}, _id: {matches: "*planningCorePage"}}
  ) {
    id: _id
    title
    heading
    summaryPortableText: summaryRaw
    lessonElements {
      _type
      introQuiz {
        ...Card
      }
      video {
        ...Card
      }
      slides {
        ...Card
      }
      worksheet {
        ...Card
      }
      exitQuiz {
        ...Card
      }
    }
    lessonElementsCTA {
      ...CTA
    }
    stepsHeading
    steps {
      step1 {
        ...Card
      }
      step2 {
        ...Card
      }
      step3 {
        ...Card
      }
      step4 {
        ...Card
      }
    }
    stepsCTA {
      ...CTA
    }
    learnMoreHeading
    learnMoreBlock1 {
      ...TextAndMedia
    }
    learnMoreBlock2 {
      ...TextAndMedia
    }
  }
}
    ${CardFragmentDoc}
${CtaFragmentDoc}
${TextAndMediaFragmentDoc}`;
export const PolicyPageBySlugDocument = gql`
    query policyPageBySlug($slug: String, $isDraft: Boolean = false) {
  allPolicyPage(where: {_: {is_draft: $isDraft}, slug: {current: {eq: $slug}}}) {
    id: _id
    title
    lastUpdatedAt: _updatedAt
    slug {
      current
    }
    bodyPortableText: bodyRaw
  }
}
    `;
export const WebinarBySlugDocument = gql`
    query webinarBySlug($slug: String, $isDraft: Boolean = false) {
  allWebinar(where: {_: {is_draft: $isDraft}, slug: {current: {eq: $slug}}}) {
    id: _id
    title
    slug {
      current
    }
    date
    summaryPortableText: summaryRaw
    hosts {
      id: _id
      _key
      name
      image {
        asset {
          url
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    aboutCorePage(variables?: AboutCorePageQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AboutCorePageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AboutCorePageQuery>(AboutCorePageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'aboutCorePage', 'query');
    },
    allBlogPosts(variables?: AllBlogPostsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AllBlogPostsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllBlogPostsQuery>(AllBlogPostsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allBlogPosts', 'query');
    },
    allPolicyPages(variables?: AllPolicyPagesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AllPolicyPagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllPolicyPagesQuery>(AllPolicyPagesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allPolicyPages', 'query');
    },
    allWebinars(variables?: AllWebinarsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AllWebinarsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllWebinarsQuery>(AllWebinarsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allWebinars', 'query');
    },
    blogPostBySlug(variables?: BlogPostBySlugQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<BlogPostBySlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BlogPostBySlugQuery>(BlogPostBySlugDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'blogPostBySlug', 'query');
    },
    blogPortableTextReferences(variables?: BlogPortableTextReferencesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<BlogPortableTextReferencesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BlogPortableTextReferencesQuery>(BlogPortableTextReferencesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'blogPortableTextReferences', 'query');
    },
    curriculumCorePage(variables?: CurriculumCorePageQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CurriculumCorePageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CurriculumCorePageQuery>(CurriculumCorePageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'curriculumCorePage', 'query');
    },
    planningCorePage(variables?: PlanningCorePageQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PlanningCorePageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PlanningCorePageQuery>(PlanningCorePageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'planningCorePage', 'query');
    },
    policyPageBySlug(variables?: PolicyPageBySlugQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PolicyPageBySlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PolicyPageBySlugQuery>(PolicyPageBySlugDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'policyPageBySlug', 'query');
    },
    webinarBySlug(variables?: WebinarBySlugQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<WebinarBySlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WebinarBySlugQuery>(WebinarBySlugDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'webinarBySlug', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;