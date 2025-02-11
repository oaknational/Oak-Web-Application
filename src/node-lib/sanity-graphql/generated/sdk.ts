import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type AbTest = Document & {
  __typename?: 'AbTest';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  controlVariant?: Maybe<LandingPage>;
  posthogFeatureFlagKey?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Slug>;
  variants?: Maybe<Array<Maybe<AbTestVariant>>>;
};

export type AbTestFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  controlVariant?: InputMaybe<LandingPageFilter>;
  posthogFeatureFlagKey?: InputMaybe<StringFilter>;
  slug?: InputMaybe<SlugFilter>;
};

export type AbTestSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  posthogFeatureFlagKey?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SlugSorting>;
};

export type AbTestVariant = {
  __typename?: 'AbTestVariant';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  page?: Maybe<LandingPage>;
  /** Must match the name of a variant defined in the Posthog experiment */
  posthogVariant?: Maybe<Scalars['String']['output']>;
};

export type AbTestVariantFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  page?: InputMaybe<LandingPageFilter>;
  posthogVariant?: InputMaybe<StringFilter>;
};

export type AbTestVariantSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  posthogVariant?: InputMaybe<SortOrder>;
};

export type AboutCorePage = Document & {
  __typename?: 'AboutCorePage';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  contactSection?: Maybe<AboutPageContactSection>;
  summaryCardImage?: Maybe<Image>;
  summaryRaw?: Maybe<Scalars['JSON']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type AboutCorePageBoard = Document & {
  __typename?: 'AboutCorePageBoard';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  boardHeader?: Maybe<Scalars['String']['output']>;
  boardMembers?: Maybe<Array<Maybe<TeamMember>>>;
  documents?: Maybe<Array<Maybe<Attachment>>>;
  governanceRaw?: Maybe<Scalars['JSON']['output']>;
  introRaw?: Maybe<Scalars['JSON']['output']>;
  seo?: Maybe<Seo>;
  title?: Maybe<Scalars['String']['output']>;
};

export type AboutCorePageBoardFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  boardHeader?: InputMaybe<StringFilter>;
  seo?: InputMaybe<SeoFilter>;
  title?: InputMaybe<StringFilter>;
};

export type AboutCorePageBoardSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  boardHeader?: InputMaybe<SortOrder>;
  seo?: InputMaybe<SeoSorting>;
  title?: InputMaybe<SortOrder>;
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
  contactSection?: InputMaybe<AboutPageContactSectionFilter>;
  summaryCardImage?: InputMaybe<ImageFilter>;
  title?: InputMaybe<StringFilter>;
};

export type AboutCorePageLeadership = Document & {
  __typename?: 'AboutCorePageLeadership';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  introRaw?: Maybe<Scalars['JSON']['output']>;
  leadershipTeam?: Maybe<Array<Maybe<TeamMember>>>;
  seo?: Maybe<Seo>;
  title?: Maybe<Scalars['String']['output']>;
};

export type AboutCorePageLeadershipFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  seo?: InputMaybe<SeoFilter>;
  title?: InputMaybe<StringFilter>;
};

export type AboutCorePageLeadershipSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  seo?: InputMaybe<SeoSorting>;
  title?: InputMaybe<SortOrder>;
};

export type AboutCorePageOrAboutCorePageBoardOrAboutCorePageLeadershipOrAboutCorePagePartnersOrAboutCorePageWhoWeAreOrAboutCorePageWorkWithUsOrAttachmentOrContactCorePageOrHomepageOrLandingPageOrNewsListingPageOrNewsPostOrPlanningCorePageOrPolicyPageOrSupportCorePageOrWebinarOrWebinarListingPage = AboutCorePage | AboutCorePageBoard | AboutCorePageLeadership | AboutCorePagePartners | AboutCorePageWhoWeAre | AboutCorePageWorkWithUs | Attachment | ContactCorePage | Homepage | LandingPage | NewsListingPage | NewsPost | PlanningCorePage | PolicyPage | SupportCorePage | Webinar | WebinarListingPage;

export type AboutCorePagePartners = Document & {
  __typename?: 'AboutCorePagePartners';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  curriculumPartners?: Maybe<Array<Maybe<AboutPagePartnerImage>>>;
  introRaw?: Maybe<Scalars['JSON']['output']>;
  seo?: Maybe<Seo>;
  techPartners?: Maybe<Array<Maybe<AboutPagePartnerImage>>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type AboutCorePagePartnersFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  seo?: InputMaybe<SeoFilter>;
  title?: InputMaybe<StringFilter>;
};

export type AboutCorePagePartnersSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  seo?: InputMaybe<SeoSorting>;
  title?: InputMaybe<SortOrder>;
};

export type AboutCorePageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  contactSection?: InputMaybe<AboutPageContactSectionSorting>;
  summaryCardImage?: InputMaybe<ImageSorting>;
  title?: InputMaybe<SortOrder>;
};

export type AboutCorePageWhoWeAre = Document & {
  __typename?: 'AboutCorePageWhoWeAre';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  intro?: Maybe<TextAndMedia>;
  principles?: Maybe<Array<Maybe<TextBlock>>>;
  seo?: Maybe<Seo>;
  timeline?: Maybe<AboutPageTimeline>;
  title?: Maybe<Scalars['String']['output']>;
};

export type AboutCorePageWhoWeAreFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  intro?: InputMaybe<TextAndMediaFilter>;
  seo?: InputMaybe<SeoFilter>;
  timeline?: InputMaybe<AboutPageTimelineFilter>;
  title?: InputMaybe<StringFilter>;
};

export type AboutCorePageWhoWeAreSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  intro?: InputMaybe<TextAndMediaSorting>;
  seo?: InputMaybe<SeoSorting>;
  timeline?: InputMaybe<AboutPageTimelineSorting>;
  title?: InputMaybe<SortOrder>;
};

export type AboutCorePageWorkWithUs = Document & {
  __typename?: 'AboutCorePageWorkWithUs';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  cards?: Maybe<AboutPageWorkWithUsCards>;
  introRaw?: Maybe<Scalars['JSON']['output']>;
  seo?: Maybe<Seo>;
  title?: Maybe<Scalars['String']['output']>;
};

export type AboutCorePageWorkWithUsFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  cards?: InputMaybe<AboutPageWorkWithUsCardsFilter>;
  seo?: InputMaybe<SeoFilter>;
  title?: InputMaybe<StringFilter>;
};

export type AboutCorePageWorkWithUsSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  cards?: InputMaybe<AboutPageWorkWithUsCardsSorting>;
  seo?: InputMaybe<SeoSorting>;
  title?: InputMaybe<SortOrder>;
};

export type AboutPageContactSection = {
  __typename?: 'AboutPageContactSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  contactForm?: Maybe<FormWrapper>;
  infoRaw?: Maybe<Scalars['JSON']['output']>;
};

export type AboutPageContactSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  contactForm?: InputMaybe<FormWrapperFilter>;
};

export type AboutPageContactSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  contactForm?: InputMaybe<FormWrapperSorting>;
};

export type AboutPagePartnerImage = {
  __typename?: 'AboutPagePartnerImage';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  asset?: Maybe<SanityImageAsset>;
  crop?: Maybe<SanityImageCrop>;
  hotspot?: Maybe<SanityImageHotspot>;
  name?: Maybe<Scalars['String']['output']>;
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

export type AboutPageTimeline = {
  __typename?: 'AboutPageTimeline';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
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

export type AboutPageWorkWithUsCards = {
  __typename?: 'AboutPageWorkWithUsCards';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
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

export type AiHomepage = Document & {
  __typename?: 'AiHomepage';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  belowTheFoldVideo?: Maybe<Video>;
  heading?: Maybe<Scalars['String']['output']>;
  heroVideo?: Maybe<Video>;
  seo?: Maybe<Seo>;
};

export type AiHomepageFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  belowTheFoldVideo?: InputMaybe<VideoFilter>;
  heading?: InputMaybe<StringFilter>;
  heroVideo?: InputMaybe<VideoFilter>;
  seo?: InputMaybe<SeoFilter>;
};

export type AiHomepageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  seo?: InputMaybe<SeoSorting>;
};

export type AiPolicyPage = Document & {
  __typename?: 'AiPolicyPage';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  bodyRaw?: Maybe<Scalars['JSON']['output']>;
  /** When in draft mode this will be the last edit date, or when published the date at which it was published. Scheduled publishes will update to reflect the date at which it goes live. */
  fake_updatedAt?: Maybe<Scalars['String']['output']>;
  seo?: Maybe<Seo>;
  slug?: Maybe<Slug>;
  title?: Maybe<Scalars['String']['output']>;
};

export type AiPolicyPageFilter = {
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

export type AiPolicyPageSorting = {
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

export type Attachment = Document & {
  __typename?: 'Attachment';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  file?: Maybe<File>;
  title?: Maybe<Scalars['String']['output']>;
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
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  children?: Maybe<Array<Maybe<Span>>>;
  list?: Maybe<Scalars['String']['output']>;
  style?: Maybe<Scalars['String']['output']>;
};

export type BlockOrCalloutOrCtaOrFormWrapperOrImageWithAltTextOrQuoteOrTextAndMediaOrVideo = Block | Callout | Cta | FormWrapper | ImageWithAltText | Quote | TextAndMedia | Video;

export type BlockOrImage = Block | Image;

export type BlogWebinarCategory = Document & {
  __typename?: 'BlogWebinarCategory';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  slug?: Maybe<Slug>;
  title?: Maybe<Scalars['String']['output']>;
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
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks if the value is defined. */
  is_defined?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks if the value is not equal to the given input. */
  neq?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BrandAsset = Document & {
  __typename?: 'BrandAsset';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  faviconImage?: Maybe<FaviconImage>;
  logo?: Maybe<SiteLogo>;
  logoWithText?: Maybe<SiteLogo>;
  socialSharingImage?: Maybe<Image>;
};

export type BrandAssetFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  faviconImage?: InputMaybe<FaviconImageFilter>;
  logo?: InputMaybe<SiteLogoFilter>;
  logoWithText?: InputMaybe<SiteLogoFilter>;
  socialSharingImage?: InputMaybe<ImageFilter>;
};

export type BrandAssetSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  faviconImage?: InputMaybe<FaviconImageSorting>;
  logo?: InputMaybe<SiteLogoSorting>;
  logoWithText?: InputMaybe<SiteLogoSorting>;
  socialSharingImage?: InputMaybe<ImageSorting>;
};

export type Callout = {
  __typename?: 'Callout';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  bodyRaw?: Maybe<Scalars['JSON']['output']>;
};

export type CalloutFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type CalloutSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type Card = {
  __typename?: 'Card';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  bodyRaw?: Maybe<Scalars['JSON']['output']>;
  cta?: Maybe<Cta>;
  image?: Maybe<ImageWithAltText>;
  title?: Maybe<Scalars['String']['output']>;
};

export type CardFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  cta?: InputMaybe<CtaFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
  title?: InputMaybe<StringFilter>;
};

export type CardSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  cta?: InputMaybe<CtaSorting>;
  image?: InputMaybe<ImageWithAltTextSorting>;
  title?: InputMaybe<SortOrder>;
};

export type ContactCorePage = Document & {
  __typename?: 'ContactCorePage';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  bodyRaw?: Maybe<Scalars['JSON']['output']>;
  formContent?: Maybe<FormWrapper>;
  heading?: Maybe<Scalars['String']['output']>;
  seo?: Maybe<Seo>;
  summaryCardImage?: Maybe<Image>;
  summaryRaw?: Maybe<Scalars['JSON']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type ContactCorePageFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  formContent?: InputMaybe<FormWrapperFilter>;
  heading?: InputMaybe<StringFilter>;
  seo?: InputMaybe<SeoFilter>;
  summaryCardImage?: InputMaybe<ImageFilter>;
  title?: InputMaybe<StringFilter>;
};

export type ContactCorePageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  formContent?: InputMaybe<FormWrapperSorting>;
  heading?: InputMaybe<SortOrder>;
  seo?: InputMaybe<SeoSorting>;
  summaryCardImage?: InputMaybe<ImageSorting>;
  title?: InputMaybe<SortOrder>;
};

export type CrossDatasetReference = {
  __typename?: 'CrossDatasetReference';
  _dataset?: Maybe<Scalars['String']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  _projectId?: Maybe<Scalars['String']['output']>;
  _ref?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  _weak?: Maybe<Scalars['Boolean']['output']>;
};

export type CrossDatasetReferenceFilter = {
  _dataset?: InputMaybe<StringFilter>;
  _key?: InputMaybe<StringFilter>;
  _projectId?: InputMaybe<StringFilter>;
  _ref?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _weak?: InputMaybe<BooleanFilter>;
};

export type CrossDatasetReferenceSorting = {
  _dataset?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _projectId?: InputMaybe<SortOrder>;
  _ref?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _weak?: InputMaybe<SortOrder>;
};

export type Cta = {
  __typename?: 'Cta';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  /**
   * A link to a section within the current page.
   * A matching anchor target must be specified or already exist in the page.
   * To link to a landing page form you can enter "form-block".
   */
  anchor?: Maybe<Scalars['String']['output']>;
  external?: Maybe<Scalars['String']['output']>;
  internal?: Maybe<AboutCorePageOrAboutCorePageBoardOrAboutCorePageLeadershipOrAboutCorePagePartnersOrAboutCorePageWhoWeAreOrAboutCorePageWorkWithUsOrAttachmentOrContactCorePageOrHomepageOrLandingPageOrNewsListingPageOrNewsPostOrPlanningCorePageOrPolicyPageOrSupportCorePageOrWebinarOrWebinarListingPage>;
  label?: Maybe<Scalars['String']['output']>;
  linkType?: Maybe<Scalars['String']['output']>;
};

export type CtaFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  anchor?: InputMaybe<StringFilter>;
  external?: InputMaybe<StringFilter>;
  label?: InputMaybe<StringFilter>;
  linkType?: InputMaybe<StringFilter>;
};

export type CtaSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  anchor?: InputMaybe<SortOrder>;
  external?: InputMaybe<SortOrder>;
  label?: InputMaybe<SortOrder>;
  linkType?: InputMaybe<SortOrder>;
};

export type CurriculumCorePage = Document & {
  __typename?: 'CurriculumCorePage';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  elements?: Maybe<CurriculumCorePageElements>;
  gettingStarted?: Maybe<TextBlock>;
  heading?: Maybe<Scalars['String']['output']>;
  info?: Maybe<TextBlock>;
  ourApproach?: Maybe<TextBlock>;
  relatedBlogs?: Maybe<Array<Maybe<NewsPost>>>;
  relatedWebinars?: Maybe<Array<Maybe<Webinar>>>;
  seo?: Maybe<Seo>;
  summaryCardImage?: Maybe<Image>;
  summaryRaw?: Maybe<Scalars['JSON']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type CurriculumCorePageElementPost = {
  __typename?: 'CurriculumCorePageElementPost';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  post?: Maybe<NewsPost>;
  title?: Maybe<Scalars['String']['output']>;
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
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  posts?: Maybe<Array<Maybe<CurriculumCorePageElementPost>>>;
  title?: Maybe<Scalars['String']['output']>;
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
  summaryCardImage?: InputMaybe<ImageFilter>;
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
  summaryCardImage?: InputMaybe<ImageSorting>;
  title?: InputMaybe<SortOrder>;
};

export type CurriculumExplainer = Document & {
  __typename?: 'CurriculumExplainer';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  explainerRaw?: Maybe<Scalars['JSON']['output']>;
  subject?: Maybe<Scalars['String']['output']>;
};

export type CurriculumExplainerFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  subject?: InputMaybe<StringFilter>;
};

export type CurriculumExplainerSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  subject?: InputMaybe<SortOrder>;
};

export type CurriculumInfoPageOverview = Document & {
  __typename?: 'CurriculumInfoPageOverview';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  curriculumExplainer?: Maybe<CurriculumExplainer>;
  curriculumPartner?: Maybe<CurriculumPartner>;
  curriculumPartnerOverviews?: Maybe<Array<Maybe<CurriculumPartnerOverview>>>;
  curriculumPartners?: Maybe<Array<Maybe<CurriculumPartner>>>;
  partnerBio?: Maybe<Scalars['String']['output']>;
  phase?: Maybe<Scalars['String']['output']>;
  subject?: Maybe<Scalars['String']['output']>;
  subjectPrinciples?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  video?: Maybe<Video>;
  videoAuthor?: Maybe<Scalars['String']['output']>;
  videoExplainer?: Maybe<Scalars['String']['output']>;
};

export type CurriculumInfoPageOverviewFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  curriculumExplainer?: InputMaybe<CurriculumExplainerFilter>;
  curriculumPartner?: InputMaybe<CurriculumPartnerFilter>;
  partnerBio?: InputMaybe<StringFilter>;
  phase?: InputMaybe<StringFilter>;
  subject?: InputMaybe<StringFilter>;
  video?: InputMaybe<VideoFilter>;
  videoAuthor?: InputMaybe<StringFilter>;
  videoExplainer?: InputMaybe<StringFilter>;
};

export type CurriculumInfoPageOverviewSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  partnerBio?: InputMaybe<SortOrder>;
  phase?: InputMaybe<SortOrder>;
  subject?: InputMaybe<SortOrder>;
  video?: InputMaybe<VideoSorting>;
  videoAuthor?: InputMaybe<SortOrder>;
  videoExplainer?: InputMaybe<SortOrder>;
};

export type CurriculumPartner = Document & {
  __typename?: 'CurriculumPartner';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  image?: Maybe<Image>;
  name?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Slug>;
};

export type CurriculumPartnerFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  image?: InputMaybe<ImageFilter>;
  name?: InputMaybe<StringFilter>;
  slug?: InputMaybe<SlugFilter>;
};

export type CurriculumPartnerOverview = {
  __typename?: 'CurriculumPartnerOverview';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  curriculumPartner?: Maybe<CurriculumPartner>;
  partnerBio?: Maybe<Scalars['String']['output']>;
};

export type CurriculumPartnerOverviewFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  curriculumPartner?: InputMaybe<CurriculumPartnerFilter>;
  partnerBio?: InputMaybe<StringFilter>;
};

export type CurriculumPartnerOverviewSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  partnerBio?: InputMaybe<SortOrder>;
};

export type CurriculumPartnerSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageSorting>;
  name?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SlugSorting>;
};

export type DateFilter = {
  /** Checks if the value is equal to the given input. */
  eq?: InputMaybe<Scalars['Date']['input']>;
  /** Checks if the value is greater than the given input. */
  gt?: InputMaybe<Scalars['Date']['input']>;
  /** Checks if the value is greater than or equal to the given input. */
  gte?: InputMaybe<Scalars['Date']['input']>;
  /** Checks if the value is defined. */
  is_defined?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks if the value is lesser than the given input. */
  lt?: InputMaybe<Scalars['Date']['input']>;
  /** Checks if the value is lesser than or equal to the given input. */
  lte?: InputMaybe<Scalars['Date']['input']>;
  /** Checks if the value is not equal to the given input. */
  neq?: InputMaybe<Scalars['Date']['input']>;
};

export type DatetimeFilter = {
  /** Checks if the value is equal to the given input. */
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** Checks if the value is greater than the given input. */
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Checks if the value is greater than or equal to the given input. */
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** Checks if the value is defined. */
  is_defined?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks if the value is lesser than the given input. */
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Checks if the value is lesser than or equal to the given input. */
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** Checks if the value is not equal to the given input. */
  neq?: InputMaybe<Scalars['DateTime']['input']>;
};

/** A Sanity document */
export type Document = {
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
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

export type FaviconImage = {
  __typename?: 'FaviconImage';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Image>;
};

export type FaviconImageFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  image?: InputMaybe<ImageFilter>;
};

export type FaviconImageSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageSorting>;
};

export type File = {
  __typename?: 'File';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
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
  eq?: InputMaybe<Scalars['Float']['input']>;
  /** Checks if the value is greater than the given input. */
  gt?: InputMaybe<Scalars['Float']['input']>;
  /** Checks if the value is greater than or equal to the given input. */
  gte?: InputMaybe<Scalars['Float']['input']>;
  /** Checks if the value is defined. */
  is_defined?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks if the value is lesser than the given input. */
  lt?: InputMaybe<Scalars['Float']['input']>;
  /** Checks if the value is lesser than or equal to the given input. */
  lte?: InputMaybe<Scalars['Float']['input']>;
  /** Checks if the value is not equal to the given input. */
  neq?: InputMaybe<Scalars['Float']['input']>;
};

export type FormWrapper = {
  __typename?: 'FormWrapper';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  bodyRaw?: Maybe<Scalars['JSON']['output']>;
  formId?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type FormWrapperFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  formId?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
};

export type FormWrapperSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  formId?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type Geopoint = {
  __typename?: 'Geopoint';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  alt?: Maybe<Scalars['Float']['output']>;
  lat?: Maybe<Scalars['Float']['output']>;
  lng?: Maybe<Scalars['Float']['output']>;
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
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  notification?: Maybe<HomepageNotification>;
  seo?: Maybe<Seo>;
  sidebarCard1?: Maybe<Card>;
  sidebarCard2?: Maybe<Card>;
  sidebarForm?: Maybe<FormWrapper>;
  summaryRaw?: Maybe<Scalars['JSON']['output']>;
  testimonials?: Maybe<Array<Maybe<Testimonial>>>;
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
  notification?: InputMaybe<HomepageNotificationFilter>;
  seo?: InputMaybe<SeoFilter>;
  sidebarCard1?: InputMaybe<CardFilter>;
  sidebarCard2?: InputMaybe<CardFilter>;
  sidebarForm?: InputMaybe<FormWrapperFilter>;
};

export type HomepageNotification = {
  __typename?: 'HomepageNotification';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  link?: Maybe<Link>;
  subheading?: Maybe<Scalars['String']['output']>;
};

export type HomepageNotificationFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  enabled?: InputMaybe<BooleanFilter>;
  heading?: InputMaybe<StringFilter>;
  label?: InputMaybe<StringFilter>;
  link?: InputMaybe<LinkFilter>;
  subheading?: InputMaybe<StringFilter>;
};

export type HomepageNotificationSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  enabled?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  label?: InputMaybe<SortOrder>;
  link?: InputMaybe<LinkSorting>;
  subheading?: InputMaybe<SortOrder>;
};

export type HomepageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  notification?: InputMaybe<HomepageNotificationSorting>;
  seo?: InputMaybe<SeoSorting>;
  sidebarCard1?: InputMaybe<CardSorting>;
  sidebarCard2?: InputMaybe<CardSorting>;
  sidebarForm?: InputMaybe<FormWrapperSorting>;
};

export type HubspotFormReference = {
  __typename?: 'HubspotFormReference';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type HubspotFormReferenceFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  label?: InputMaybe<StringFilter>;
  value?: InputMaybe<StringFilter>;
};

export type HubspotFormReferenceSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  label?: InputMaybe<SortOrder>;
  value?: InputMaybe<SortOrder>;
};

export type IdFilter = {
  /** Checks if the value is equal to the given input. */
  eq?: InputMaybe<Scalars['ID']['input']>;
  in?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Checks if the value matches the given word/words. */
  matches?: InputMaybe<Scalars['ID']['input']>;
  /** Checks if the value is not equal to the given input. */
  neq?: InputMaybe<Scalars['ID']['input']>;
  nin?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type Illustration = Document & {
  __typename?: 'Illustration';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  image?: Maybe<Image>;
  slug?: Maybe<Slug>;
  title?: Maybe<Scalars['String']['output']>;
};

export type IllustrationFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  image?: InputMaybe<ImageFilter>;
  slug?: InputMaybe<SlugFilter>;
  title?: InputMaybe<StringFilter>;
};

export type IllustrationSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageSorting>;
  slug?: InputMaybe<SlugSorting>;
  title?: InputMaybe<SortOrder>;
};

export type Image = {
  __typename?: 'Image';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
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

export type ImageWithAltText = {
  __typename?: 'ImageWithAltText';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  altText?: Maybe<Scalars['String']['output']>;
  asset?: Maybe<SanityImageAsset>;
  crop?: Maybe<SanityImageCrop>;
  hotspot?: Maybe<SanityImageHotspot>;
  /** Should this image be read aloud to screen readers, or is it purely presentational? */
  isPresentational?: Maybe<Scalars['Boolean']['output']>;
};

export type ImageWithAltTextFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  altText?: InputMaybe<StringFilter>;
  asset?: InputMaybe<SanityImageAssetFilter>;
  crop?: InputMaybe<SanityImageCropFilter>;
  hotspot?: InputMaybe<SanityImageHotspotFilter>;
  isPresentational?: InputMaybe<BooleanFilter>;
};

export type ImageWithAltTextSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  altText?: InputMaybe<SortOrder>;
  crop?: InputMaybe<SanityImageCropSorting>;
  hotspot?: InputMaybe<SanityImageHotspotSorting>;
  isPresentational?: InputMaybe<SortOrder>;
};

export type IntFilter = {
  /** Checks if the value is equal to the given input. */
  eq?: InputMaybe<Scalars['Int']['input']>;
  /** Checks if the value is greater than the given input. */
  gt?: InputMaybe<Scalars['Int']['input']>;
  /** Checks if the value is greater than or equal to the given input. */
  gte?: InputMaybe<Scalars['Int']['input']>;
  /** Checks if the value is defined. */
  is_defined?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks if the value is lesser than the given input. */
  lt?: InputMaybe<Scalars['Int']['input']>;
  /** Checks if the value is lesser than or equal to the given input. */
  lte?: InputMaybe<Scalars['Int']['input']>;
  /** Checks if the value is not equal to the given input. */
  neq?: InputMaybe<Scalars['Int']['input']>;
};

export type LandingPage = Document & {
  __typename?: 'LandingPage';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  content?: Maybe<Array<Maybe<LandingPageFormBlockOrLandingPageQuoteBlockOrLandingPageTextAndMediaBlockOrLandingPageTextBlock>>>;
  headerCta?: Maybe<Cta>;
  hero?: Maybe<LandingPageHero>;
  seo?: Maybe<Seo>;
  slug?: Maybe<Slug>;
};

export type LandingPageFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  headerCta?: InputMaybe<CtaFilter>;
  hero?: InputMaybe<LandingPageHeroFilter>;
  seo?: InputMaybe<SeoFilter>;
  slug?: InputMaybe<SlugFilter>;
};

export type LandingPageFormBlock = {
  __typename?: 'LandingPageFormBlock';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  form?: Maybe<FormWrapper>;
  textRaw?: Maybe<Scalars['JSON']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type LandingPageFormBlockFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  form?: InputMaybe<FormWrapperFilter>;
  title?: InputMaybe<StringFilter>;
};

export type LandingPageFormBlockOrLandingPageQuoteBlockOrLandingPageTextAndMediaBlockOrLandingPageTextBlock = LandingPageFormBlock | LandingPageQuoteBlock | LandingPageTextAndMediaBlock | LandingPageTextBlock;

export type LandingPageFormBlockSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  form?: InputMaybe<FormWrapperSorting>;
  title?: InputMaybe<SortOrder>;
};

export type LandingPageHero = {
  __typename?: 'LandingPageHero';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  cta?: Maybe<Cta>;
  heading?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageWithAltText>;
  title?: Maybe<Scalars['String']['output']>;
};

export type LandingPageHeroFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  cta?: InputMaybe<CtaFilter>;
  heading?: InputMaybe<StringFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
  title?: InputMaybe<StringFilter>;
};

export type LandingPageHeroSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  cta?: InputMaybe<CtaSorting>;
  heading?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
  title?: InputMaybe<SortOrder>;
};

export type LandingPageQuoteBlock = {
  __typename?: 'LandingPageQuoteBlock';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  quote?: Maybe<Quote>;
};

export type LandingPageQuoteBlockFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  quote?: InputMaybe<QuoteFilter>;
};

export type LandingPageQuoteBlockSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  quote?: InputMaybe<QuoteSorting>;
};

export type LandingPageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  headerCta?: InputMaybe<CtaSorting>;
  hero?: InputMaybe<LandingPageHeroSorting>;
  seo?: InputMaybe<SeoSorting>;
  slug?: InputMaybe<SlugSorting>;
};

export type LandingPageTextAndMediaBlock = {
  __typename?: 'LandingPageTextAndMediaBlock';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  textAndMedia?: Maybe<TextAndMedia>;
};

export type LandingPageTextAndMediaBlockFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  textAndMedia?: InputMaybe<TextAndMediaFilter>;
};

export type LandingPageTextAndMediaBlockSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  textAndMedia?: InputMaybe<TextAndMediaSorting>;
};

export type LandingPageTextBlock = {
  __typename?: 'LandingPageTextBlock';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  textRaw?: Maybe<Scalars['JSON']['output']>;
};

export type LandingPageTextBlockFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type LandingPageTextBlockSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type Link = {
  __typename?: 'Link';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  /**
   * A link to a section within the current page.
   * A matching anchor target must be specified or already exist in the page.
   * To link to a landing page form you can enter "form-block".
   */
  anchor?: Maybe<Scalars['String']['output']>;
  external?: Maybe<Scalars['String']['output']>;
  internal?: Maybe<AboutCorePageOrAboutCorePageBoardOrAboutCorePageLeadershipOrAboutCorePagePartnersOrAboutCorePageWhoWeAreOrAboutCorePageWorkWithUsOrAttachmentOrContactCorePageOrHomepageOrLandingPageOrNewsListingPageOrNewsPostOrPlanningCorePageOrPolicyPageOrSupportCorePageOrWebinarOrWebinarListingPage>;
  linkType?: Maybe<Scalars['String']['output']>;
};

export type LinkFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  anchor?: InputMaybe<StringFilter>;
  external?: InputMaybe<StringFilter>;
  linkType?: InputMaybe<StringFilter>;
};

export type LinkSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  anchor?: InputMaybe<SortOrder>;
  external?: InputMaybe<SortOrder>;
  linkType?: InputMaybe<SortOrder>;
};

export type MuxVideo = {
  __typename?: 'MuxVideo';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  asset?: Maybe<MuxVideoAsset>;
};

export type MuxVideoAsset = {
  __typename?: 'MuxVideoAsset';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  assetId?: Maybe<Scalars['String']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  playbackId?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  thumbTime?: Maybe<Scalars['Float']['output']>;
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
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  featuredPost?: Maybe<NewsPost>;
  heading?: Maybe<Scalars['String']['output']>;
  seo?: Maybe<Seo>;
  summaryCardImage?: Maybe<Image>;
  summaryRaw?: Maybe<Scalars['JSON']['output']>;
  title?: Maybe<Scalars['String']['output']>;
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
  heading?: InputMaybe<StringFilter>;
  seo?: InputMaybe<SeoFilter>;
  summaryCardImage?: InputMaybe<ImageFilter>;
  title?: InputMaybe<StringFilter>;
};

export type NewsListingPageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  seo?: InputMaybe<SeoSorting>;
  summaryCardImage?: InputMaybe<ImageSorting>;
  title?: InputMaybe<SortOrder>;
};

export type NewsPost = Document & {
  __typename?: 'NewsPost';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  author?: Maybe<TeamMember>;
  category?: Maybe<BlogWebinarCategory>;
  contentRaw?: Maybe<Scalars['JSON']['output']>;
  date?: Maybe<Scalars['Date']['output']>;
  mainImage?: Maybe<ImageWithAltText>;
  seo?: Maybe<Seo>;
  slug?: Maybe<Slug>;
  /** Shown on listing pages and used as the default for SEO if not overridden */
  summary?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
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
  mainImage?: InputMaybe<ImageWithAltTextFilter>;
  seo?: InputMaybe<SeoFilter>;
  slug?: InputMaybe<SlugFilter>;
  summary?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
};

export type NewsPostSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  date?: InputMaybe<SortOrder>;
  mainImage?: InputMaybe<ImageWithAltTextSorting>;
  seo?: InputMaybe<SeoSorting>;
  slug?: InputMaybe<SlugSorting>;
  summary?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type PlanALessonCorePage = Document & {
  __typename?: 'PlanALessonCorePage';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  content?: Maybe<Array<Maybe<PlanALessonPageContentOrPlanALessonPageFormBlock>>>;
  hero?: Maybe<PlanALessonPageHero>;
  seo?: Maybe<Seo>;
};

export type PlanALessonCorePageFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  hero?: InputMaybe<PlanALessonPageHeroFilter>;
  seo?: InputMaybe<SeoFilter>;
};

export type PlanALessonCorePageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  hero?: InputMaybe<PlanALessonPageHeroSorting>;
  seo?: InputMaybe<SeoSorting>;
};

export type PlanALessonPageContent = Document & {
  __typename?: 'PlanALessonPageContent';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  anchorSlug?: Maybe<Slug>;
  contentRaw?: Maybe<Scalars['JSON']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type PlanALessonPageContentFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  anchorSlug?: InputMaybe<SlugFilter>;
  title?: InputMaybe<StringFilter>;
};

export type PlanALessonPageContentOrPlanALessonPageFormBlock = PlanALessonPageContent | PlanALessonPageFormBlock;

export type PlanALessonPageContentSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  anchorSlug?: InputMaybe<SlugSorting>;
  title?: InputMaybe<SortOrder>;
};

export type PlanALessonPageFormBlock = {
  __typename?: 'PlanALessonPageFormBlock';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  form?: Maybe<FormWrapper>;
  textRaw?: Maybe<Scalars['JSON']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type PlanALessonPageFormBlockFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  form?: InputMaybe<FormWrapperFilter>;
  title?: InputMaybe<StringFilter>;
};

export type PlanALessonPageFormBlockSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  form?: InputMaybe<FormWrapperSorting>;
  title?: InputMaybe<SortOrder>;
};

export type PlanALessonPageHero = {
  __typename?: 'PlanALessonPageHero';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  author?: Maybe<TeamMember>;
  heading?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageWithAltText>;
  summaryRaw?: Maybe<Scalars['JSON']['output']>;
};

export type PlanALessonPageHeroFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  author?: InputMaybe<TeamMemberFilter>;
  heading?: InputMaybe<StringFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
};

export type PlanALessonPageHeroSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
};

export type PlanningCorePage = Document & {
  __typename?: 'PlanningCorePage';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  learnMoreBlock1?: Maybe<TextAndMedia>;
  learnMoreBlock2?: Maybe<TextAndMedia>;
  learnMoreHeading?: Maybe<Scalars['String']['output']>;
  lessonElements?: Maybe<PlanningPageLessonElements>;
  lessonElementsCTA?: Maybe<Cta>;
  seo?: Maybe<Seo>;
  steps?: Maybe<PlanningPageSteps>;
  stepsCTA?: Maybe<Cta>;
  stepsHeading?: Maybe<Scalars['String']['output']>;
  summaryCardImage?: Maybe<Image>;
  summaryRaw?: Maybe<Scalars['JSON']['output']>;
  title?: Maybe<Scalars['String']['output']>;
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
  summaryCardImage?: InputMaybe<ImageFilter>;
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
  summaryCardImage?: InputMaybe<ImageSorting>;
  title?: InputMaybe<SortOrder>;
};

export type PlanningPageLessonElements = {
  __typename?: 'PlanningPageLessonElements';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
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
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
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
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  bodyRaw?: Maybe<Scalars['JSON']['output']>;
  /** When in draft mode this will be the last edit date, or when published the date at which it was published. Scheduled publishes will update to reflect the date at which it goes live. */
  fake_updatedAt?: Maybe<Scalars['String']['output']>;
  seo?: Maybe<Seo>;
  slug?: Maybe<Slug>;
  title?: Maybe<Scalars['String']['output']>;
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
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  attribution?: Maybe<Scalars['String']['output']>;
  organisation?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  /** Quotation marks will be added automatically */
  text?: Maybe<Scalars['String']['output']>;
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
  AbTest?: Maybe<AbTest>;
  AboutCorePage?: Maybe<AboutCorePage>;
  AboutCorePageBoard?: Maybe<AboutCorePageBoard>;
  AboutCorePageLeadership?: Maybe<AboutCorePageLeadership>;
  AboutCorePagePartners?: Maybe<AboutCorePagePartners>;
  AboutCorePageWhoWeAre?: Maybe<AboutCorePageWhoWeAre>;
  AboutCorePageWorkWithUs?: Maybe<AboutCorePageWorkWithUs>;
  AiHomepage?: Maybe<AiHomepage>;
  AiPolicyPage?: Maybe<AiPolicyPage>;
  Attachment?: Maybe<Attachment>;
  BlogWebinarCategory?: Maybe<BlogWebinarCategory>;
  BrandAsset?: Maybe<BrandAsset>;
  ContactCorePage?: Maybe<ContactCorePage>;
  CurriculumCorePage?: Maybe<CurriculumCorePage>;
  CurriculumExplainer?: Maybe<CurriculumExplainer>;
  CurriculumInfoPageOverview?: Maybe<CurriculumInfoPageOverview>;
  CurriculumPartner?: Maybe<CurriculumPartner>;
  Document?: Maybe<Document>;
  Homepage?: Maybe<Homepage>;
  Illustration?: Maybe<Illustration>;
  LandingPage?: Maybe<LandingPage>;
  NewsListingPage?: Maybe<NewsListingPage>;
  NewsPost?: Maybe<NewsPost>;
  PlanALessonCorePage?: Maybe<PlanALessonCorePage>;
  PlanALessonPageContent?: Maybe<PlanALessonPageContent>;
  PlanningCorePage?: Maybe<PlanningCorePage>;
  PolicyPage?: Maybe<PolicyPage>;
  SanityFileAsset?: Maybe<SanityFileAsset>;
  SanityHelpArticle?: Maybe<SanityHelpArticle>;
  SanityImageAsset?: Maybe<SanityImageAsset>;
  SubjectIcon?: Maybe<SubjectIcon>;
  SupportCorePage?: Maybe<SupportCorePage>;
  TeamMember?: Maybe<TeamMember>;
  Testimonial?: Maybe<Testimonial>;
  UiGraphic?: Maybe<UiGraphic>;
  UiIcon?: Maybe<UiIcon>;
  Video?: Maybe<Video>;
  Webinar?: Maybe<Webinar>;
  WebinarListingPage?: Maybe<WebinarListingPage>;
  allAbTest: Array<AbTest>;
  allAboutCorePage: Array<AboutCorePage>;
  allAboutCorePageBoard: Array<AboutCorePageBoard>;
  allAboutCorePageLeadership: Array<AboutCorePageLeadership>;
  allAboutCorePagePartners: Array<AboutCorePagePartners>;
  allAboutCorePageWhoWeAre: Array<AboutCorePageWhoWeAre>;
  allAboutCorePageWorkWithUs: Array<AboutCorePageWorkWithUs>;
  allAiHomepage: Array<AiHomepage>;
  allAiPolicyPage: Array<AiPolicyPage>;
  allAttachment: Array<Attachment>;
  allBlogWebinarCategory: Array<BlogWebinarCategory>;
  allBrandAsset: Array<BrandAsset>;
  allContactCorePage: Array<ContactCorePage>;
  allCurriculumCorePage: Array<CurriculumCorePage>;
  allCurriculumExplainer: Array<CurriculumExplainer>;
  allCurriculumInfoPageOverview: Array<CurriculumInfoPageOverview>;
  allCurriculumPartner: Array<CurriculumPartner>;
  allDocument: Array<Document>;
  allHomepage: Array<Homepage>;
  allIllustration: Array<Illustration>;
  allLandingPage: Array<LandingPage>;
  allNewsListingPage: Array<NewsListingPage>;
  allNewsPost: Array<NewsPost>;
  allPlanALessonCorePage: Array<PlanALessonCorePage>;
  allPlanALessonPageContent: Array<PlanALessonPageContent>;
  allPlanningCorePage: Array<PlanningCorePage>;
  allPolicyPage: Array<PolicyPage>;
  allSanityFileAsset: Array<SanityFileAsset>;
  allSanityHelpArticle: Array<SanityHelpArticle>;
  allSanityImageAsset: Array<SanityImageAsset>;
  allSubjectIcon: Array<SubjectIcon>;
  allSupportCorePage: Array<SupportCorePage>;
  allTeamMember: Array<TeamMember>;
  allTestimonial: Array<Testimonial>;
  allUiGraphic: Array<UiGraphic>;
  allUiIcon: Array<UiIcon>;
  allVideo: Array<Video>;
  allWebinar: Array<Webinar>;
  allWebinarListingPage: Array<WebinarListingPage>;
};


export type RootQueryAbTestArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryAboutCorePageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryAboutCorePageBoardArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryAboutCorePageLeadershipArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryAboutCorePagePartnersArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryAboutCorePageWhoWeAreArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryAboutCorePageWorkWithUsArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryAiHomepageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryAiPolicyPageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryAttachmentArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryBlogWebinarCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryBrandAssetArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryContactCorePageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryCurriculumCorePageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryCurriculumExplainerArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryCurriculumInfoPageOverviewArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryCurriculumPartnerArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryDocumentArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryHomepageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryIllustrationArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryLandingPageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryNewsListingPageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryNewsPostArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryPlanALessonCorePageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryPlanALessonPageContentArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryPlanningCorePageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryPolicyPageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQuerySanityFileAssetArgs = {
  id: Scalars['ID']['input'];
};


export type RootQuerySanityHelpArticleArgs = {
  id: Scalars['ID']['input'];
};


export type RootQuerySanityImageAssetArgs = {
  id: Scalars['ID']['input'];
};


export type RootQuerySubjectIconArgs = {
  id: Scalars['ID']['input'];
};


export type RootQuerySupportCorePageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryTeamMemberArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryTestimonialArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryUiGraphicArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryUiIconArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryVideoArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryWebinarArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryWebinarListingPageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryAllAbTestArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AbTestSorting>>;
  where?: InputMaybe<AbTestFilter>;
};


export type RootQueryAllAboutCorePageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AboutCorePageSorting>>;
  where?: InputMaybe<AboutCorePageFilter>;
};


export type RootQueryAllAboutCorePageBoardArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AboutCorePageBoardSorting>>;
  where?: InputMaybe<AboutCorePageBoardFilter>;
};


export type RootQueryAllAboutCorePageLeadershipArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AboutCorePageLeadershipSorting>>;
  where?: InputMaybe<AboutCorePageLeadershipFilter>;
};


export type RootQueryAllAboutCorePagePartnersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AboutCorePagePartnersSorting>>;
  where?: InputMaybe<AboutCorePagePartnersFilter>;
};


export type RootQueryAllAboutCorePageWhoWeAreArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AboutCorePageWhoWeAreSorting>>;
  where?: InputMaybe<AboutCorePageWhoWeAreFilter>;
};


export type RootQueryAllAboutCorePageWorkWithUsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AboutCorePageWorkWithUsSorting>>;
  where?: InputMaybe<AboutCorePageWorkWithUsFilter>;
};


export type RootQueryAllAiHomepageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiHomepageSorting>>;
  where?: InputMaybe<AiHomepageFilter>;
};


export type RootQueryAllAiPolicyPageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AiPolicyPageSorting>>;
  where?: InputMaybe<AiPolicyPageFilter>;
};


export type RootQueryAllAttachmentArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AttachmentSorting>>;
  where?: InputMaybe<AttachmentFilter>;
};


export type RootQueryAllBlogWebinarCategoryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BlogWebinarCategorySorting>>;
  where?: InputMaybe<BlogWebinarCategoryFilter>;
};


export type RootQueryAllBrandAssetArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BrandAssetSorting>>;
  where?: InputMaybe<BrandAssetFilter>;
};


export type RootQueryAllContactCorePageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ContactCorePageSorting>>;
  where?: InputMaybe<ContactCorePageFilter>;
};


export type RootQueryAllCurriculumCorePageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CurriculumCorePageSorting>>;
  where?: InputMaybe<CurriculumCorePageFilter>;
};


export type RootQueryAllCurriculumExplainerArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CurriculumExplainerSorting>>;
  where?: InputMaybe<CurriculumExplainerFilter>;
};


export type RootQueryAllCurriculumInfoPageOverviewArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CurriculumInfoPageOverviewSorting>>;
  where?: InputMaybe<CurriculumInfoPageOverviewFilter>;
};


export type RootQueryAllCurriculumPartnerArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CurriculumPartnerSorting>>;
  where?: InputMaybe<CurriculumPartnerFilter>;
};


export type RootQueryAllDocumentArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<DocumentSorting>>;
  where?: InputMaybe<DocumentFilter>;
};


export type RootQueryAllHomepageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<HomepageSorting>>;
  where?: InputMaybe<HomepageFilter>;
};


export type RootQueryAllIllustrationArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<IllustrationSorting>>;
  where?: InputMaybe<IllustrationFilter>;
};


export type RootQueryAllLandingPageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<LandingPageSorting>>;
  where?: InputMaybe<LandingPageFilter>;
};


export type RootQueryAllNewsListingPageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<NewsListingPageSorting>>;
  where?: InputMaybe<NewsListingPageFilter>;
};


export type RootQueryAllNewsPostArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<NewsPostSorting>>;
  where?: InputMaybe<NewsPostFilter>;
};


export type RootQueryAllPlanALessonCorePageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PlanALessonCorePageSorting>>;
  where?: InputMaybe<PlanALessonCorePageFilter>;
};


export type RootQueryAllPlanALessonPageContentArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PlanALessonPageContentSorting>>;
  where?: InputMaybe<PlanALessonPageContentFilter>;
};


export type RootQueryAllPlanningCorePageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PlanningCorePageSorting>>;
  where?: InputMaybe<PlanningCorePageFilter>;
};


export type RootQueryAllPolicyPageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PolicyPageSorting>>;
  where?: InputMaybe<PolicyPageFilter>;
};


export type RootQueryAllSanityFileAssetArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SanityFileAssetSorting>>;
  where?: InputMaybe<SanityFileAssetFilter>;
};


export type RootQueryAllSanityHelpArticleArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SanityHelpArticleSorting>>;
  where?: InputMaybe<SanityHelpArticleFilter>;
};


export type RootQueryAllSanityImageAssetArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SanityImageAssetSorting>>;
  where?: InputMaybe<SanityImageAssetFilter>;
};


export type RootQueryAllSubjectIconArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SubjectIconSorting>>;
  where?: InputMaybe<SubjectIconFilter>;
};


export type RootQueryAllSupportCorePageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SupportCorePageSorting>>;
  where?: InputMaybe<SupportCorePageFilter>;
};


export type RootQueryAllTeamMemberArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<TeamMemberSorting>>;
  where?: InputMaybe<TeamMemberFilter>;
};


export type RootQueryAllTestimonialArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<TestimonialSorting>>;
  where?: InputMaybe<TestimonialFilter>;
};


export type RootQueryAllUiGraphicArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<UiGraphicSorting>>;
  where?: InputMaybe<UiGraphicFilter>;
};


export type RootQueryAllUiIconArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<UiIconSorting>>;
  where?: InputMaybe<UiIconFilter>;
};


export type RootQueryAllVideoArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<VideoSorting>>;
  where?: InputMaybe<VideoFilter>;
};


export type RootQueryAllWebinarArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<WebinarSorting>>;
  where?: InputMaybe<WebinarFilter>;
};


export type RootQueryAllWebinarListingPageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<WebinarListingPageSorting>>;
  where?: InputMaybe<WebinarListingPageFilter>;
};

export type SanityAssetSourceData = {
  __typename?: 'SanityAssetSourceData';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  /** The unique ID for the asset within the originating source so you can programatically find back to it */
  id?: Maybe<Scalars['String']['output']>;
  /** A canonical name for the source this asset is originating from */
  name?: Maybe<Scalars['String']['output']>;
  /** A URL to find more information about this asset in the originating source */
  url?: Maybe<Scalars['String']['output']>;
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
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  altText?: Maybe<Scalars['String']['output']>;
  assetId?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  extension?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  mimeType?: Maybe<Scalars['String']['output']>;
  originalFilename?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  sha1hash?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Float']['output']>;
  source?: Maybe<SanityAssetSourceData>;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
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

export type SanityHelpArticle = Document & {
  __typename?: 'SanityHelpArticle';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  bodyRaw?: Maybe<Scalars['JSON']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type SanityHelpArticleFilter = {
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

export type SanityHelpArticleSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type SanityImageAsset = Document & {
  __typename?: 'SanityImageAsset';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  altText?: Maybe<Scalars['String']['output']>;
  assetId?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  extension?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<SanityImageMetadata>;
  mimeType?: Maybe<Scalars['String']['output']>;
  originalFilename?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  sha1hash?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Float']['output']>;
  source?: Maybe<SanityAssetSourceData>;
  title?: Maybe<Scalars['String']['output']>;
  uploadId?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
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
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  bottom?: Maybe<Scalars['Float']['output']>;
  left?: Maybe<Scalars['Float']['output']>;
  right?: Maybe<Scalars['Float']['output']>;
  top?: Maybe<Scalars['Float']['output']>;
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
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  aspectRatio?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  width?: Maybe<Scalars['Float']['output']>;
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
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  width?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
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
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  blurHash?: Maybe<Scalars['String']['output']>;
  dimensions?: Maybe<SanityImageDimensions>;
  hasAlpha?: Maybe<Scalars['Boolean']['output']>;
  isOpaque?: Maybe<Scalars['Boolean']['output']>;
  location?: Maybe<Geopoint>;
  lqip?: Maybe<Scalars['String']['output']>;
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
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
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
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  background?: Maybe<Scalars['String']['output']>;
  foreground?: Maybe<Scalars['String']['output']>;
  population?: Maybe<Scalars['Float']['output']>;
  title?: Maybe<Scalars['String']['output']>;
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
  is_draft?: InputMaybe<Scalars['Boolean']['input']>;
  /** All documents referencing the given document ID. */
  references?: InputMaybe<Scalars['ID']['input']>;
};

export type Seo = {
  __typename?: 'Seo';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  canonicalURL?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
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

export type SiteLogo = {
  __typename?: 'SiteLogo';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Image>;
};

export type SiteLogoFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  image?: InputMaybe<ImageFilter>;
};

export type SiteLogoSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageSorting>;
};

export type Slug = {
  __typename?: 'Slug';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  current?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
};

export type SlugFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  current?: InputMaybe<StringFilter>;
  source?: InputMaybe<StringFilter>;
};

export type SlugSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  current?: InputMaybe<SortOrder>;
  source?: InputMaybe<SortOrder>;
};

export enum SortOrder {
  /** Sorts on the value in ascending order. */
  Asc = 'ASC',
  /** Sorts on the value in descending order. */
  Desc = 'DESC'
}

export type Span = {
  __typename?: 'Span';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  marks?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  text?: Maybe<Scalars['String']['output']>;
};

export type StringFilter = {
  /** Checks if the value is equal to the given input. */
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Checks if the value is defined. */
  is_defined?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks if the value matches the given word/words. */
  matches?: InputMaybe<Scalars['String']['input']>;
  /** Checks if the value is not equal to the given input. */
  neq?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type SubjectIcon = Document & {
  __typename?: 'SubjectIcon';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  image?: Maybe<Image>;
  slug?: Maybe<Slug>;
  title?: Maybe<Scalars['String']['output']>;
};

export type SubjectIconFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  image?: InputMaybe<ImageFilter>;
  slug?: InputMaybe<SlugFilter>;
  title?: InputMaybe<StringFilter>;
};

export type SubjectIconSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageSorting>;
  slug?: InputMaybe<SlugSorting>;
  title?: InputMaybe<SortOrder>;
};

export type SupportCorePage = Document & {
  __typename?: 'SupportCorePage';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  cover?: Maybe<SupportPageCover>;
  curriculum?: Maybe<TextBlock>;
  development?: Maybe<TextBlock>;
  heading?: Maybe<Scalars['String']['output']>;
  planning?: Maybe<TextBlock>;
  relatedBlogs?: Maybe<Array<Maybe<NewsPost>>>;
  relatedWebinars?: Maybe<Array<Maybe<Webinar>>>;
  seo?: Maybe<Seo>;
  summaryCardImage?: Maybe<Image>;
  summaryRaw?: Maybe<Scalars['JSON']['output']>;
  title?: Maybe<Scalars['String']['output']>;
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
  summaryCardImage?: InputMaybe<ImageFilter>;
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
  summaryCardImage?: InputMaybe<ImageSorting>;
  title?: InputMaybe<SortOrder>;
};

export type SupportPageCover = {
  __typename?: 'SupportPageCover';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  bodyRaw?: Maybe<Scalars['JSON']['output']>;
  cta?: Maybe<Cta>;
  quote?: Maybe<Quote>;
  title?: Maybe<Scalars['String']['output']>;
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
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  bioRaw?: Maybe<Scalars['JSON']['output']>;
  image?: Maybe<Image>;
  name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Slug>;
  socials?: Maybe<TeamMemberSocials>;
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
  name?: InputMaybe<StringFilter>;
  role?: InputMaybe<StringFilter>;
  slug?: InputMaybe<SlugFilter>;
  socials?: InputMaybe<TeamMemberSocialsFilter>;
};

export type TeamMemberSocials = {
  __typename?: 'TeamMemberSocials';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  linkedinUrl?: Maybe<Scalars['String']['output']>;
  twitterUsername?: Maybe<Scalars['String']['output']>;
};

export type TeamMemberSocialsFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  linkedinUrl?: InputMaybe<StringFilter>;
  twitterUsername?: InputMaybe<StringFilter>;
};

export type TeamMemberSocialsSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  linkedinUrl?: InputMaybe<SortOrder>;
  twitterUsername?: InputMaybe<SortOrder>;
};

export type TeamMemberSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageSorting>;
  name?: InputMaybe<SortOrder>;
  role?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SlugSorting>;
  socials?: InputMaybe<TeamMemberSocialsSorting>;
};

export type Testimonial = Document & {
  __typename?: 'Testimonial';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  image?: Maybe<ImageWithAltText>;
  linkToCaseStudy?: Maybe<Link>;
  quote?: Maybe<Quote>;
};

export type TestimonialFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
  linkToCaseStudy?: InputMaybe<LinkFilter>;
  quote?: InputMaybe<QuoteFilter>;
};

export type TestimonialSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
  linkToCaseStudy?: InputMaybe<LinkSorting>;
  quote?: InputMaybe<QuoteSorting>;
};

export type TextAndMedia = {
  __typename?: 'TextAndMedia';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  alignMedia?: Maybe<Scalars['String']['output']>;
  bodyRaw?: Maybe<Scalars['JSON']['output']>;
  cta?: Maybe<Cta>;
  image?: Maybe<ImageWithAltText>;
  mediaType?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  video?: Maybe<Video>;
};

export type TextAndMediaFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  alignMedia?: InputMaybe<StringFilter>;
  cta?: InputMaybe<CtaFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
  mediaType?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
  video?: InputMaybe<VideoFilter>;
};

export type TextAndMediaSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  alignMedia?: InputMaybe<SortOrder>;
  cta?: InputMaybe<CtaSorting>;
  image?: InputMaybe<ImageWithAltTextSorting>;
  mediaType?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type TextBlock = {
  __typename?: 'TextBlock';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  bodyRaw?: Maybe<Scalars['JSON']['output']>;
  cta?: Maybe<Cta>;
  title?: Maybe<Scalars['String']['output']>;
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

export type UiGraphic = Document & {
  __typename?: 'UiGraphic';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  image?: Maybe<Image>;
  slug?: Maybe<Slug>;
  title?: Maybe<Scalars['String']['output']>;
};

export type UiGraphicFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  image?: InputMaybe<ImageFilter>;
  slug?: InputMaybe<SlugFilter>;
  title?: InputMaybe<StringFilter>;
};

export type UiGraphicSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageSorting>;
  slug?: InputMaybe<SlugSorting>;
  title?: InputMaybe<SortOrder>;
};

export type UiIcon = Document & {
  __typename?: 'UiIcon';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  image?: Maybe<Image>;
  slug?: Maybe<Slug>;
  title?: Maybe<Scalars['String']['output']>;
};

export type UiIconFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  image?: InputMaybe<ImageFilter>;
  slug?: InputMaybe<SlugFilter>;
  title?: InputMaybe<StringFilter>;
};

export type UiIconSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageSorting>;
  slug?: InputMaybe<SlugSorting>;
  title?: InputMaybe<SortOrder>;
};

export type Video = Document & {
  __typename?: 'Video';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  fieldForCaptionsDoNotUse?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  googleDriveURL?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
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
  googleDriveURL?: InputMaybe<StringFilter>;
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
  googleDriveURL?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  video?: InputMaybe<MuxVideoSorting>;
};

export type Webinar = Document & {
  __typename?: 'Webinar';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  category?: Maybe<BlogWebinarCategory>;
  date?: Maybe<Scalars['DateTime']['output']>;
  hosts?: Maybe<Array<Maybe<TeamMember>>>;
  seo?: Maybe<Seo>;
  slug?: Maybe<Slug>;
  summaryRaw?: Maybe<Scalars['JSON']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  video?: Maybe<Video>;
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
  video?: InputMaybe<VideoFilter>;
};

export type WebinarListingPage = Document & {
  __typename?: 'WebinarListingPage';
  /** Date the document was created */
  _createdAt?: Maybe<Scalars['DateTime']['output']>;
  /** Document ID */
  _id?: Maybe<Scalars['ID']['output']>;
  _key?: Maybe<Scalars['String']['output']>;
  /** Current document revision */
  _rev?: Maybe<Scalars['String']['output']>;
  /** Document type */
  _type?: Maybe<Scalars['String']['output']>;
  /** Date the document was last modified */
  _updatedAt?: Maybe<Scalars['DateTime']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  seo?: Maybe<Seo>;
  summaryCardImage?: Maybe<Image>;
  summaryRaw?: Maybe<Scalars['JSON']['output']>;
  title?: Maybe<Scalars['String']['output']>;
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
  heading?: InputMaybe<StringFilter>;
  seo?: InputMaybe<SeoFilter>;
  summaryCardImage?: InputMaybe<ImageFilter>;
  title?: InputMaybe<StringFilter>;
};

export type WebinarListingPageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  seo?: InputMaybe<SeoSorting>;
  summaryCardImage?: InputMaybe<ImageSorting>;
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

export type AbTestedPageBySlugQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']['input']>;
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type AbTestedPageBySlugQuery = { __typename?: 'RootQuery', allAbTest: Array<{ __typename?: 'AbTest', posthogFeatureFlagKey?: string | null, id?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null, controlVariant?: { __typename?: 'LandingPage', id?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null, headerCta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null, hero?: { __typename?: 'LandingPageHero', title?: string | null, heading?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, content?: Array<{ __typename?: 'LandingPageFormBlock', title?: string | null, bodyPortableText?: any | null, type: 'LandingPageFormBlock', form?: { __typename?: 'FormWrapper', title?: string | null } | null } | { __typename?: 'LandingPageQuoteBlock', type: 'LandingPageQuoteBlock', quote?: { __typename?: 'Quote', text?: string | null, role?: string | null, organisation?: string | null, attribution?: string | null } | null } | { __typename?: 'LandingPageTextAndMediaBlock', type: 'LandingPageTextAndMediaBlock', textAndMedia?: { __typename?: 'TextAndMedia', title?: string | null, mediaType?: string | null, alignMedia?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, video?: { __typename?: 'Video', title?: string | null, captions?: Array<string | null> | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null } | null } | null } | { __typename?: 'LandingPageTextBlock', bodyPortableText?: any | null, type: 'LandingPageTextBlock' } | null> | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null } | null, variants?: Array<{ __typename?: 'AbTestVariant', posthogVariant?: string | null, page?: { __typename?: 'LandingPage', _type?: string | null, id?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null, headerCta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null, hero?: { __typename?: 'LandingPageHero', title?: string | null, heading?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, content?: Array<{ __typename?: 'LandingPageFormBlock', title?: string | null, bodyPortableText?: any | null, type: 'LandingPageFormBlock', form?: { __typename?: 'FormWrapper', title?: string | null } | null } | { __typename?: 'LandingPageQuoteBlock', type: 'LandingPageQuoteBlock', quote?: { __typename?: 'Quote', text?: string | null, role?: string | null, organisation?: string | null, attribution?: string | null } | null } | { __typename?: 'LandingPageTextAndMediaBlock', type: 'LandingPageTextAndMediaBlock', textAndMedia?: { __typename?: 'TextAndMedia', title?: string | null, mediaType?: string | null, alignMedia?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, video?: { __typename?: 'Video', title?: string | null, captions?: Array<string | null> | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null } | null } | null } | { __typename?: 'LandingPageTextBlock', bodyPortableText?: any | null, type: 'LandingPageTextBlock' } | null> | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null } | null } | null> | null }> };

export type AboutBoardPageQueryVariables = Exact<{
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type AboutBoardPageQuery = { __typename?: 'RootQuery', aboutCorePage: Array<{ __typename?: 'AboutCorePage', title?: string | null, summaryPortableText?: any | null, summaryCardImage?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, contactSection?: { __typename?: 'AboutPageContactSection', infoPortableText?: any | null } | null }>, allAboutCorePageBoard: Array<{ __typename?: 'AboutCorePageBoard', boardHeader?: string | null, id?: string | null, heading?: string | null, introPortableText?: any | null, governancePortableText?: any | null, boardMembers?: Array<{ __typename?: 'TeamMember', name?: string | null, role?: string | null, id?: string | null, bioPortableText?: any | null, slug?: { __typename?: 'Slug', current?: string | null } | null, image?: { __typename?: 'Image', hotspot?: { __typename?: 'SanityImageHotspot', height?: number | null, width?: number | null, x?: number | null, y?: number | null } | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, socials?: { __typename?: 'TeamMemberSocials', twitterUsername?: string | null, linkedinUrl?: string | null } | null } | null> | null, documents?: Array<{ __typename?: 'Attachment', title?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | null> | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null }> };

export type AboutLeadershipPageQueryVariables = Exact<{
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type AboutLeadershipPageQuery = { __typename?: 'RootQuery', aboutCorePage: Array<{ __typename?: 'AboutCorePage', title?: string | null, summaryPortableText?: any | null, summaryCardImage?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, contactSection?: { __typename?: 'AboutPageContactSection', infoPortableText?: any | null } | null }>, allAboutCorePageLeadership: Array<{ __typename?: 'AboutCorePageLeadership', id?: string | null, heading?: string | null, introPortableText?: any | null, leadershipTeam?: Array<{ __typename?: 'TeamMember', name?: string | null, role?: string | null, id?: string | null, bioPortableText?: any | null, slug?: { __typename?: 'Slug', current?: string | null } | null, image?: { __typename?: 'Image', hotspot?: { __typename?: 'SanityImageHotspot', height?: number | null, width?: number | null, x?: number | null, y?: number | null } | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, socials?: { __typename?: 'TeamMemberSocials', twitterUsername?: string | null, linkedinUrl?: string | null } | null } | null> | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null }> };

export type AboutPartnersPageQueryVariables = Exact<{
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type AboutPartnersPageQuery = { __typename?: 'RootQuery', aboutCorePage: Array<{ __typename?: 'AboutCorePage', title?: string | null, summaryPortableText?: any | null, summaryCardImage?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, contactSection?: { __typename?: 'AboutPageContactSection', infoPortableText?: any | null } | null }>, allAboutCorePagePartners: Array<{ __typename?: 'AboutCorePagePartners', id?: string | null, heading?: string | null, introPortableText?: any | null, techPartners?: Array<{ __typename?: 'AboutPagePartnerImage', name?: string | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null> | null, curriculumPartners?: Array<{ __typename?: 'AboutPagePartnerImage', name?: string | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null> | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null }> };

export type AboutWhoWeArePageQueryVariables = Exact<{
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type AboutWhoWeArePageQuery = { __typename?: 'RootQuery', aboutCorePage: Array<{ __typename?: 'AboutCorePage', title?: string | null, summaryPortableText?: any | null, summaryCardImage?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, contactSection?: { __typename?: 'AboutPageContactSection', infoPortableText?: any | null } | null }>, allAboutCorePageWhoWeAre: Array<{ __typename?: 'AboutCorePageWhoWeAre', id?: string | null, heading?: string | null, intro?: { __typename?: 'TextAndMedia', title?: string | null, mediaType?: string | null, alignMedia?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, video?: { __typename?: 'Video', title?: string | null, captions?: Array<string | null> | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null } | null } | null, timeline?: { __typename?: 'AboutPageTimeline', from?: { __typename?: 'TextBlock', title?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, to?: { __typename?: 'TextBlock', title?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, beyond?: { __typename?: 'TextBlock', title?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, principles?: Array<{ __typename?: 'TextBlock', title?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null> | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null }> };

export type AboutWorkWithUsPageQueryVariables = Exact<{
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type AboutWorkWithUsPageQuery = { __typename?: 'RootQuery', aboutCorePage: Array<{ __typename?: 'AboutCorePage', title?: string | null, summaryPortableText?: any | null, summaryCardImage?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, contactSection?: { __typename?: 'AboutPageContactSection', infoPortableText?: any | null } | null }>, allAboutCorePageWorkWithUs: Array<{ __typename?: 'AboutCorePageWorkWithUs', id?: string | null, heading?: string | null, introPortableText?: any | null, cards?: { __typename?: 'AboutPageWorkWithUsCards', joinTheTeam?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, advisory?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, curriculumPartner?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, teacherResearch?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null } | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null }> };

export type AllBlogPostsQueryVariables = Exact<{
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AllBlogPostsQuery = { __typename?: 'RootQuery', allNewsPost: Array<{ __typename?: 'NewsPost', title?: string | null, date?: any | null, id?: string | null, summaryPortableText?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null, author?: { __typename?: 'TeamMember', _key?: string | null, name?: string | null, role?: string | null, id?: string | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null } | null, mainImage?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, category?: { __typename?: 'BlogWebinarCategory', title?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null }> };

export type AllLandingPagesQueryVariables = Exact<{
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AllLandingPagesQuery = { __typename?: 'RootQuery', allLandingPage: Array<{ __typename?: 'LandingPage', id?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null }> };

export type AllPolicyPagesQueryVariables = Exact<{
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AllPolicyPagesQuery = { __typename?: 'RootQuery', allPolicyPage: Array<{ __typename?: 'PolicyPage', title?: string | null, id?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null }> };

export type AllWebinarsQueryVariables = Exact<{
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AllWebinarsQuery = { __typename?: 'RootQuery', allWebinar: Array<{ __typename?: 'Webinar', title?: string | null, date?: any | null, id?: string | null, summaryPortableText?: any | null, slug?: { __typename?: 'Slug', current?: string | null } | null, video?: { __typename?: 'Video', title?: string | null, captions?: Array<string | null> | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null } | null, hosts?: Array<{ __typename?: 'TeamMember', _key?: string | null, name?: string | null, id?: string | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null } | null> | null, category?: { __typename?: 'BlogWebinarCategory', title?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null }> };

export type AttachmentFragment = { __typename?: 'Attachment', title?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null };

export type BlogPostBySlugQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']['input']>;
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type BlogPostBySlugQuery = { __typename?: 'RootQuery', allNewsPost: Array<{ __typename?: 'NewsPost', title?: string | null, date?: any | null, id?: string | null, summaryPortableText?: string | null, contentPortableText?: any | null, author?: { __typename?: 'TeamMember', _key?: string | null, name?: string | null, role?: string | null, id?: string | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null } | null, slug?: { __typename?: 'Slug', current?: string | null } | null, mainImage?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, category?: { __typename?: 'BlogWebinarCategory', title?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null }> };

export type BlogPreviewFieldsFragment = { __typename?: 'NewsPost', title?: string | null, date?: any | null, id?: string | null, summaryPortableText?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null, author?: { __typename?: 'TeamMember', _key?: string | null, name?: string | null, role?: string | null, id?: string | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null } | null, mainImage?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, category?: { __typename?: 'BlogWebinarCategory', title?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null };

export type CardFragment = { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null };

export type ContactCorePageQueryVariables = Exact<{
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type ContactCorePageQuery = { __typename?: 'RootQuery', allContactCorePage: Array<{ __typename?: 'ContactCorePage', title?: string | null, heading?: string | null, id?: string | null, summaryPortableText?: any | null, bodyPortableText?: any | null, summaryCardImage?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null }> };

export type CtaFragment = { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null };

export type CurriculumOverviewQueryVariables = Exact<{
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
  subjectTitle?: InputMaybe<Scalars['String']['input']>;
  phaseSlug?: InputMaybe<Scalars['String']['input']>;
}>;


export type CurriculumOverviewQuery = { __typename?: 'RootQuery', allCurriculumInfoPageOverview: Array<{ __typename?: 'CurriculumInfoPageOverview', subjectPrinciples?: Array<string | null> | null, partnerBio?: string | null, videoAuthor?: string | null, videoExplainer?: string | null, id?: string | null, curriculumExplainer?: { __typename?: 'CurriculumExplainer', explainerRaw?: any | null } | null, curriculumPartner?: { __typename?: 'CurriculumPartner', name?: string | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null } | null, curriculumPartnerOverviews?: Array<{ __typename?: 'CurriculumPartnerOverview', partnerBio?: string | null, curriculumPartner?: { __typename?: 'CurriculumPartner', name?: string | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null } | null } | null> | null, video?: { __typename?: 'Video', title?: string | null, captions?: Array<string | null> | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null } | null }> };

export type HomepageQueryVariables = Exact<{
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type HomepageQuery = { __typename?: 'RootQuery', allHomepage: Array<{ __typename?: 'Homepage', heading?: string | null, id?: string | null, summaryPortableText?: any | null, notification?: { __typename?: 'HomepageNotification', enabled?: boolean | null, label?: string | null, heading?: string | null, subheading?: string | null, link?: { __typename?: 'Link', linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, sidebarCard1?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, sidebarCard2?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null, testimonials?: Array<{ __typename?: 'Testimonial', quote?: { __typename?: 'Quote', text?: string | null, attribution?: string | null, organisation?: string | null, role?: string | null } | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, asset?: { __typename?: 'SanityImageAsset', url?: string | null, _id?: string | null } | null } | null } | null> | null }> };

export type ImageFragment = { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null };

export type ImageAssetFragment = { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null };

export type ImageWithAltTextFragment = { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null };

type InternalLinkFields_AbTest_Fragment = { __typename?: 'AbTest', id?: string | null, contentType?: string | null };

type InternalLinkFields_AboutCorePage_Fragment = { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null };

type InternalLinkFields_AboutCorePageBoard_Fragment = { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null };

type InternalLinkFields_AboutCorePageLeadership_Fragment = { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null };

type InternalLinkFields_AboutCorePagePartners_Fragment = { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null };

type InternalLinkFields_AboutCorePageWhoWeAre_Fragment = { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null };

type InternalLinkFields_AboutCorePageWorkWithUs_Fragment = { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null };

type InternalLinkFields_AiHomepage_Fragment = { __typename?: 'AiHomepage', id?: string | null, contentType?: string | null };

type InternalLinkFields_AiPolicyPage_Fragment = { __typename?: 'AiPolicyPage', id?: string | null, contentType?: string | null };

type InternalLinkFields_Attachment_Fragment = { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null };

type InternalLinkFields_BlogWebinarCategory_Fragment = { __typename?: 'BlogWebinarCategory', id?: string | null, contentType?: string | null };

type InternalLinkFields_BrandAsset_Fragment = { __typename?: 'BrandAsset', id?: string | null, contentType?: string | null };

type InternalLinkFields_ContactCorePage_Fragment = { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null };

type InternalLinkFields_CurriculumCorePage_Fragment = { __typename?: 'CurriculumCorePage', id?: string | null, contentType?: string | null };

type InternalLinkFields_CurriculumExplainer_Fragment = { __typename?: 'CurriculumExplainer', id?: string | null, contentType?: string | null };

type InternalLinkFields_CurriculumInfoPageOverview_Fragment = { __typename?: 'CurriculumInfoPageOverview', id?: string | null, contentType?: string | null };

type InternalLinkFields_CurriculumPartner_Fragment = { __typename?: 'CurriculumPartner', id?: string | null, contentType?: string | null };

type InternalLinkFields_Homepage_Fragment = { __typename?: 'Homepage', id?: string | null, contentType?: string | null };

type InternalLinkFields_Illustration_Fragment = { __typename?: 'Illustration', id?: string | null, contentType?: string | null };

type InternalLinkFields_LandingPage_Fragment = { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null };

type InternalLinkFields_NewsListingPage_Fragment = { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null };

type InternalLinkFields_NewsPost_Fragment = { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null };

type InternalLinkFields_PlanALessonCorePage_Fragment = { __typename?: 'PlanALessonCorePage', id?: string | null, contentType?: string | null };

type InternalLinkFields_PlanALessonPageContent_Fragment = { __typename?: 'PlanALessonPageContent', id?: string | null, contentType?: string | null };

type InternalLinkFields_PlanningCorePage_Fragment = { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null };

type InternalLinkFields_PolicyPage_Fragment = { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null };

type InternalLinkFields_SanityFileAsset_Fragment = { __typename?: 'SanityFileAsset', id?: string | null, contentType?: string | null };

type InternalLinkFields_SanityHelpArticle_Fragment = { __typename?: 'SanityHelpArticle', id?: string | null, contentType?: string | null };

type InternalLinkFields_SanityImageAsset_Fragment = { __typename?: 'SanityImageAsset', id?: string | null, contentType?: string | null };

type InternalLinkFields_SubjectIcon_Fragment = { __typename?: 'SubjectIcon', id?: string | null, contentType?: string | null };

type InternalLinkFields_SupportCorePage_Fragment = { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null };

type InternalLinkFields_TeamMember_Fragment = { __typename?: 'TeamMember', id?: string | null, contentType?: string | null };

type InternalLinkFields_Testimonial_Fragment = { __typename?: 'Testimonial', id?: string | null, contentType?: string | null };

type InternalLinkFields_UiGraphic_Fragment = { __typename?: 'UiGraphic', id?: string | null, contentType?: string | null };

type InternalLinkFields_UiIcon_Fragment = { __typename?: 'UiIcon', id?: string | null, contentType?: string | null };

type InternalLinkFields_Video_Fragment = { __typename?: 'Video', id?: string | null, contentType?: string | null };

type InternalLinkFields_Webinar_Fragment = { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null };

type InternalLinkFields_WebinarListingPage_Fragment = { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null };

export type InternalLinkFieldsFragment = InternalLinkFields_AbTest_Fragment | InternalLinkFields_AboutCorePage_Fragment | InternalLinkFields_AboutCorePageBoard_Fragment | InternalLinkFields_AboutCorePageLeadership_Fragment | InternalLinkFields_AboutCorePagePartners_Fragment | InternalLinkFields_AboutCorePageWhoWeAre_Fragment | InternalLinkFields_AboutCorePageWorkWithUs_Fragment | InternalLinkFields_AiHomepage_Fragment | InternalLinkFields_AiPolicyPage_Fragment | InternalLinkFields_Attachment_Fragment | InternalLinkFields_BlogWebinarCategory_Fragment | InternalLinkFields_BrandAsset_Fragment | InternalLinkFields_ContactCorePage_Fragment | InternalLinkFields_CurriculumCorePage_Fragment | InternalLinkFields_CurriculumExplainer_Fragment | InternalLinkFields_CurriculumInfoPageOverview_Fragment | InternalLinkFields_CurriculumPartner_Fragment | InternalLinkFields_Homepage_Fragment | InternalLinkFields_Illustration_Fragment | InternalLinkFields_LandingPage_Fragment | InternalLinkFields_NewsListingPage_Fragment | InternalLinkFields_NewsPost_Fragment | InternalLinkFields_PlanALessonCorePage_Fragment | InternalLinkFields_PlanALessonPageContent_Fragment | InternalLinkFields_PlanningCorePage_Fragment | InternalLinkFields_PolicyPage_Fragment | InternalLinkFields_SanityFileAsset_Fragment | InternalLinkFields_SanityHelpArticle_Fragment | InternalLinkFields_SanityImageAsset_Fragment | InternalLinkFields_SubjectIcon_Fragment | InternalLinkFields_SupportCorePage_Fragment | InternalLinkFields_TeamMember_Fragment | InternalLinkFields_Testimonial_Fragment | InternalLinkFields_UiGraphic_Fragment | InternalLinkFields_UiIcon_Fragment | InternalLinkFields_Video_Fragment | InternalLinkFields_Webinar_Fragment | InternalLinkFields_WebinarListingPage_Fragment;

export type LandingPageFragment = { __typename?: 'LandingPage', id?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null, headerCta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null, hero?: { __typename?: 'LandingPageHero', title?: string | null, heading?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, content?: Array<{ __typename?: 'LandingPageFormBlock', title?: string | null, bodyPortableText?: any | null, type: 'LandingPageFormBlock', form?: { __typename?: 'FormWrapper', title?: string | null } | null } | { __typename?: 'LandingPageQuoteBlock', type: 'LandingPageQuoteBlock', quote?: { __typename?: 'Quote', text?: string | null, role?: string | null, organisation?: string | null, attribution?: string | null } | null } | { __typename?: 'LandingPageTextAndMediaBlock', type: 'LandingPageTextAndMediaBlock', textAndMedia?: { __typename?: 'TextAndMedia', title?: string | null, mediaType?: string | null, alignMedia?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, video?: { __typename?: 'Video', title?: string | null, captions?: Array<string | null> | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null } | null } | null } | { __typename?: 'LandingPageTextBlock', bodyPortableText?: any | null, type: 'LandingPageTextBlock' } | null> | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null };

export type LandingPageBySlugQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']['input']>;
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type LandingPageBySlugQuery = { __typename?: 'RootQuery', allLandingPage: Array<{ __typename?: 'LandingPage', id?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null, headerCta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null, hero?: { __typename?: 'LandingPageHero', title?: string | null, heading?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, content?: Array<{ __typename?: 'LandingPageFormBlock', title?: string | null, bodyPortableText?: any | null, type: 'LandingPageFormBlock', form?: { __typename?: 'FormWrapper', title?: string | null } | null } | { __typename?: 'LandingPageQuoteBlock', type: 'LandingPageQuoteBlock', quote?: { __typename?: 'Quote', text?: string | null, role?: string | null, organisation?: string | null, attribution?: string | null } | null } | { __typename?: 'LandingPageTextAndMediaBlock', type: 'LandingPageTextAndMediaBlock', textAndMedia?: { __typename?: 'TextAndMedia', title?: string | null, mediaType?: string | null, alignMedia?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, video?: { __typename?: 'Video', title?: string | null, captions?: Array<string | null> | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null } | null } | null } | { __typename?: 'LandingPageTextBlock', bodyPortableText?: any | null, type: 'LandingPageTextBlock' } | null> | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null }> };

export type LinkFragment = { __typename?: 'Link', linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null };

export type NewsListingPageQueryVariables = Exact<{
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type NewsListingPageQuery = { __typename?: 'RootQuery', allNewsListingPage: Array<{ __typename?: 'NewsListingPage', title?: string | null, heading?: string | null, id?: string | null, summaryPortableText?: any | null, summaryCardImage?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null }> };

export type PlanALessonPageQueryVariables = Exact<{
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type PlanALessonPageQuery = { __typename?: 'RootQuery', allPlanALessonCorePage: Array<{ __typename?: 'PlanALessonCorePage', id?: string | null, hero?: { __typename?: 'PlanALessonPageHero', heading?: string | null, summaryPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, author?: { __typename?: 'TeamMember', name?: string | null, role?: string | null, id?: string | null, bioPortableText?: any | null, slug?: { __typename?: 'Slug', current?: string | null } | null, image?: { __typename?: 'Image', hotspot?: { __typename?: 'SanityImageHotspot', height?: number | null, width?: number | null, x?: number | null, y?: number | null } | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, socials?: { __typename?: 'TeamMemberSocials', twitterUsername?: string | null, linkedinUrl?: string | null } | null } | null } | null, content?: Array<{ __typename?: 'PlanALessonPageContent', type: 'PlanALessonPageContent', navigationTitle?: string | null, bodyPortableText?: any | null, anchorSlug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanALessonPageFormBlock', type: 'PlanALessonPageFormBlock', navigationTitle?: string | null, bodyPortableText?: any | null, form?: { __typename?: 'FormWrapper', title?: string | null } | null } | null> | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null }> };

export type PlanningCorePageQueryVariables = Exact<{
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type PlanningCorePageQuery = { __typename?: 'RootQuery', allPlanningCorePage: Array<{ __typename?: 'PlanningCorePage', title?: string | null, heading?: string | null, stepsHeading?: string | null, learnMoreHeading?: string | null, id?: string | null, summaryPortableText?: any | null, summaryCardImage?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, lessonElements?: { __typename?: 'PlanningPageLessonElements', _type?: string | null, introQuiz?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, video?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, slides?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, worksheet?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, exitQuiz?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null } | null, lessonElementsCTA?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null, steps?: { __typename?: 'PlanningPageSteps', step1?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, step2?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, step3?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, step4?: { __typename?: 'Card', title?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null } | null, stepsCTA?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null, learnMoreBlock1?: { __typename?: 'TextAndMedia', title?: string | null, mediaType?: string | null, alignMedia?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, video?: { __typename?: 'Video', title?: string | null, captions?: Array<string | null> | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null } | null } | null, learnMoreBlock2?: { __typename?: 'TextAndMedia', title?: string | null, mediaType?: string | null, alignMedia?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, video?: { __typename?: 'Video', title?: string | null, captions?: Array<string | null> | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null } | null } | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null }> };

export type PolicyPageBySlugQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']['input']>;
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type PolicyPageBySlugQuery = { __typename?: 'RootQuery', allPolicyPage: Array<{ __typename?: 'PolicyPage', title?: string | null, id?: string | null, lastUpdatedAt?: any | null, bodyPortableText?: any | null, slug?: { __typename?: 'Slug', current?: string | null } | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null }> };

export type PortableTextReferencesQueryVariables = Exact<{
  ids?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type PortableTextReferencesQuery = { __typename?: 'RootQuery', allDocument: Array<{ __typename?: 'AbTest', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePage', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'AiHomepage', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'AiPolicyPage', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', _type?: string | null, title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'BlogWebinarCategory', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'BrandAsset', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'ContactCorePage', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'CurriculumCorePage', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'CurriculumExplainer', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'CurriculumInfoPageOverview', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'CurriculumPartner', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'Illustration', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', _type?: string | null, id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', _type?: string | null, id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanALessonCorePage', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'PlanALessonPageContent', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'PlanningCorePage', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', _type?: string | null, id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SanityFileAsset', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'SanityHelpArticle', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null, _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'SubjectIcon', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'SupportCorePage', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'TeamMember', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'Testimonial', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'UiGraphic', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'UiIcon', _type?: string | null, id?: string | null, contentType?: string | null } | { __typename?: 'Video', _type?: string | null, title?: string | null, id?: string | null, captions?: Array<string | null> | null, contentType?: string | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null } | { __typename?: 'Webinar', _type?: string | null, id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', _type?: string | null, id?: string | null, contentType?: string | null }> };

export type QuoteFragment = { __typename?: 'Quote', text?: string | null, role?: string | null, organisation?: string | null, attribution?: string | null };

export type SeoFragment = { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null };

export type SupportCorePageQueryVariables = Exact<{
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type SupportCorePageQuery = { __typename?: 'RootQuery', allSupportCorePage: Array<{ __typename?: 'SupportCorePage', title?: string | null, heading?: string | null, id?: string | null, summaryPortableText?: any | null, summaryCardImage?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, cover?: { __typename?: 'SupportPageCover', title?: string | null, bodyPortableText?: any | null, quote?: { __typename?: 'Quote', text?: string | null, role?: string | null, organisation?: string | null, attribution?: string | null } | null } | null, curriculum?: { __typename?: 'TextBlock', title?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null } | null, development?: { __typename?: 'TextBlock', title?: string | null, bodyPortableText?: any | null } | null, planning?: { __typename?: 'TextBlock', title?: string | null, bodyPortableText?: any | null } | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null }> };

export type TeamMemberFragment = { __typename?: 'TeamMember', name?: string | null, role?: string | null, id?: string | null, bioPortableText?: any | null, slug?: { __typename?: 'Slug', current?: string | null } | null, image?: { __typename?: 'Image', hotspot?: { __typename?: 'SanityImageHotspot', height?: number | null, width?: number | null, x?: number | null, y?: number | null } | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, socials?: { __typename?: 'TeamMemberSocials', twitterUsername?: string | null, linkedinUrl?: string | null } | null };

export type TeamMemberSocialsFragment = { __typename?: 'TeamMemberSocials', twitterUsername?: string | null, linkedinUrl?: string | null };

export type TextAndMediaFragment = { __typename?: 'TextAndMedia', title?: string | null, mediaType?: string | null, alignMedia?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, video?: { __typename?: 'Video', title?: string | null, captions?: Array<string | null> | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null } | null };

export type TextBlockFragment = { __typename?: 'TextBlock', title?: string | null, bodyPortableText?: any | null, cta?: { __typename?: 'Cta', label?: string | null, linkType?: string | null, external?: string | null, anchor?: string | null, internal?: { __typename?: 'AboutCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageBoard', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageLeadership', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePagePartners', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWhoWeAre', id?: string | null, contentType?: string | null } | { __typename?: 'AboutCorePageWorkWithUs', id?: string | null, contentType?: string | null } | { __typename?: 'Attachment', title?: string | null, id?: string | null, contentType?: string | null, file?: { __typename?: 'File', asset?: { __typename?: 'SanityFileAsset', extension?: string | null, size?: number | null, url?: string | null } | null } | null } | { __typename?: 'ContactCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Homepage', id?: string | null, contentType?: string | null } | { __typename?: 'LandingPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'NewsListingPage', id?: string | null, contentType?: string | null } | { __typename?: 'NewsPost', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'PlanningCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'PolicyPage', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'SupportCorePage', id?: string | null, contentType?: string | null } | { __typename?: 'Webinar', id?: string | null, contentType?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | { __typename?: 'WebinarListingPage', id?: string | null, contentType?: string | null } | null } | null };

export type VideoFragment = { __typename?: 'Video', title?: string | null, captions?: Array<string | null> | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null };

export type WebinarBySlugQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']['input']>;
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type WebinarBySlugQuery = { __typename?: 'RootQuery', allWebinar: Array<{ __typename?: 'Webinar', title?: string | null, date?: any | null, id?: string | null, summaryPortableText?: any | null, slug?: { __typename?: 'Slug', current?: string | null } | null, category?: { __typename?: 'BlogWebinarCategory', title?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null, hosts?: Array<{ __typename?: 'TeamMember', _key?: string | null, name?: string | null, id?: string | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null } | null> | null, video?: { __typename?: 'Video', title?: string | null, captions?: Array<string | null> | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null } | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null }> };

export type WebinarPreviewFieldsFragment = { __typename?: 'Webinar', title?: string | null, date?: any | null, id?: string | null, summaryPortableText?: any | null, slug?: { __typename?: 'Slug', current?: string | null } | null, video?: { __typename?: 'Video', title?: string | null, captions?: Array<string | null> | null, video?: { __typename?: 'MuxVideo', asset?: { __typename?: 'MuxVideoAsset', assetId?: string | null, thumbTime?: number | null, playbackId?: string | null } | null } | null } | null, hosts?: Array<{ __typename?: 'TeamMember', _key?: string | null, name?: string | null, id?: string | null, image?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null } | null> | null, category?: { __typename?: 'BlogWebinarCategory', title?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null } | null };

export type WebinarsListingPageQueryVariables = Exact<{
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type WebinarsListingPageQuery = { __typename?: 'RootQuery', allWebinarListingPage: Array<{ __typename?: 'WebinarListingPage', title?: string | null, heading?: string | null, id?: string | null, summaryPortableText?: any | null, summaryCardImage?: { __typename?: 'Image', asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null, hotspot?: { __typename?: 'SanityImageHotspot', x?: number | null, y?: number | null, width?: number | null, height?: number | null } | null } | null, seo?: { __typename?: 'Seo', title?: string | null, description?: string | null, canonicalURL?: string | null } | null }> };

export const ImageFragmentDoc = gql`
    fragment Image on Image {
  asset {
    _id
    url
  }
  hotspot {
    x
    y
    width
    height
  }
}
    `;
export const ImageAssetFragmentDoc = gql`
    fragment ImageAsset on SanityImageAsset {
  _id
  url
}
    `;
export const ImageWithAltTextFragmentDoc = gql`
    fragment ImageWithAltText on ImageWithAltText {
  altText
  isPresentational
  asset {
    ...ImageAsset
  }
  hotspot {
    x
    y
    width
    height
  }
}
    ${ImageAssetFragmentDoc}`;
export const BlogPreviewFieldsFragmentDoc = gql`
    fragment BlogPreviewFields on NewsPost {
  id: _id
  title
  date
  slug {
    current
  }
  author {
    id: _id
    _key
    name
    role
    image {
      ...Image
    }
  }
  mainImage {
    ...ImageWithAltText
  }
  category {
    title
    slug {
      current
    }
  }
  summaryPortableText: summary
}
    ${ImageFragmentDoc}
${ImageWithAltTextFragmentDoc}`;
export const AttachmentFragmentDoc = gql`
    fragment Attachment on Attachment {
  title
  file {
    asset {
      extension
      size
      url
    }
  }
}
    `;
export const InternalLinkFieldsFragmentDoc = gql`
    fragment InternalLinkFields on Document {
  id: _id
  contentType: _type
  ... on Webinar {
    slug {
      current
    }
  }
  ... on NewsPost {
    slug {
      current
    }
  }
  ... on PolicyPage {
    slug {
      current
    }
  }
  ... on LandingPage {
    slug {
      current
    }
  }
  ... on Attachment {
    ...Attachment
  }
}
    ${AttachmentFragmentDoc}`;
export const CtaFragmentDoc = gql`
    fragment CTA on Cta {
  label
  linkType
  external
  anchor
  internal {
    ...InternalLinkFields
  }
}
    ${InternalLinkFieldsFragmentDoc}`;
export const CardFragmentDoc = gql`
    fragment Card on Card {
  title
  image {
    asset {
      _id
      url
    }
  }
  bodyPortableText: bodyRaw
  cta {
    ...CTA
  }
}
    ${CtaFragmentDoc}`;
export const QuoteFragmentDoc = gql`
    fragment Quote on Quote {
  text
  role
  organisation
  attribution
}
    `;
export const VideoFragmentDoc = gql`
    fragment Video on Video {
  title
  captions: fieldForCaptionsDoNotUse
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
    ...ImageWithAltText
  }
  video {
    ...Video
  }
}
    ${CtaFragmentDoc}
${ImageWithAltTextFragmentDoc}
${VideoFragmentDoc}`;
export const SeoFragmentDoc = gql`
    fragment Seo on Seo {
  title
  description
  canonicalURL
}
    `;
export const LandingPageFragmentDoc = gql`
    fragment LandingPage on LandingPage {
  id: _id
  slug {
    current
  }
  headerCta {
    ...CTA
  }
  hero {
    title
    heading
    image {
      ...ImageWithAltText
    }
    cta {
      ...CTA
    }
  }
  content {
    type: __typename
    ... on LandingPageTextBlock {
      bodyPortableText: textRaw
    }
    ... on LandingPageFormBlock {
      title
      bodyPortableText: textRaw
      form {
        title
      }
    }
    ... on LandingPageQuoteBlock {
      quote {
        ...Quote
      }
    }
    ... on LandingPageTextAndMediaBlock {
      textAndMedia {
        ...TextAndMedia
      }
    }
  }
  seo {
    ...Seo
  }
}
    ${CtaFragmentDoc}
${ImageWithAltTextFragmentDoc}
${QuoteFragmentDoc}
${TextAndMediaFragmentDoc}
${SeoFragmentDoc}`;
export const LinkFragmentDoc = gql`
    fragment Link on Link {
  linkType
  external
  anchor
  internal {
    ...InternalLinkFields
  }
}
    ${InternalLinkFieldsFragmentDoc}`;
export const TeamMemberSocialsFragmentDoc = gql`
    fragment TeamMemberSocials on TeamMemberSocials {
  twitterUsername
  linkedinUrl
}
    `;
export const TeamMemberFragmentDoc = gql`
    fragment TeamMember on TeamMember {
  id: _id
  name
  role
  slug {
    current
  }
  image {
    ...Image
    hotspot {
      height
      width
      x
      y
    }
  }
  bioPortableText: bioRaw
  socials {
    ...TeamMemberSocials
  }
}
    ${ImageFragmentDoc}
${TeamMemberSocialsFragmentDoc}`;
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
  date
  video {
    ...Video
  }
  hosts {
    id: _id
    _key
    name
    image {
      ...Image
    }
  }
  category {
    title
    slug {
      current
    }
  }
  summaryPortableText: summaryRaw
}
    ${VideoFragmentDoc}
${ImageFragmentDoc}`;
export const AbTestedPageBySlugDocument = gql`
    query abTestedPageBySlug($slug: String, $isDraftFilter: Sanity_DocumentFilter) {
  allAbTest(
    where: {_: $isDraftFilter, slug: {current: {eq: $slug}}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    id: _id
    slug {
      current
    }
    posthogFeatureFlagKey
    controlVariant {
      ... on LandingPage {
        ...LandingPage
      }
    }
    variants {
      posthogVariant
      page {
        _type
        ... on LandingPage {
          ...LandingPage
        }
      }
    }
  }
}
    ${LandingPageFragmentDoc}`;
export const AboutBoardPageDocument = gql`
    query aboutBoardPage($isDraftFilter: Sanity_DocumentFilter) {
  aboutCorePage: allAboutCorePage(
    where: {_: $isDraftFilter, _id: {matches: "*aboutCorePage"}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    title
    summaryPortableText: summaryRaw
    summaryCardImage {
      ...Image
    }
    contactSection {
      infoPortableText: infoRaw
    }
  }
  allAboutCorePageBoard(
    where: {_: $isDraftFilter, _id: {matches: "*aboutCorePage.board"}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    id: _id
    heading: title
    introPortableText: introRaw
    boardMembers {
      ...TeamMember
    }
    documents {
      ...Attachment
    }
    governancePortableText: governanceRaw
    seo {
      ...Seo
    }
    boardHeader
  }
}
    ${ImageFragmentDoc}
${TeamMemberFragmentDoc}
${AttachmentFragmentDoc}
${SeoFragmentDoc}`;
export const AboutLeadershipPageDocument = gql`
    query aboutLeadershipPage($isDraftFilter: Sanity_DocumentFilter) {
  aboutCorePage: allAboutCorePage(
    where: {_: $isDraftFilter, _id: {matches: "*aboutCorePage"}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    title
    summaryPortableText: summaryRaw
    summaryCardImage {
      ...Image
    }
    contactSection {
      infoPortableText: infoRaw
    }
  }
  allAboutCorePageLeadership(
    where: {_: $isDraftFilter, _id: {matches: "*aboutCorePage.leadership"}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    id: _id
    heading: title
    introPortableText: introRaw
    leadershipTeam {
      ...TeamMember
    }
    seo {
      ...Seo
    }
  }
}
    ${ImageFragmentDoc}
${TeamMemberFragmentDoc}
${SeoFragmentDoc}`;
export const AboutPartnersPageDocument = gql`
    query aboutPartnersPage($isDraftFilter: Sanity_DocumentFilter) {
  aboutCorePage: allAboutCorePage(
    where: {_: $isDraftFilter, _id: {matches: "*aboutCorePage"}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    title
    summaryPortableText: summaryRaw
    summaryCardImage {
      ...Image
    }
    contactSection {
      infoPortableText: infoRaw
    }
  }
  allAboutCorePagePartners(
    where: {_: $isDraftFilter, _id: {matches: "*aboutCorePage.partners"}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    id: _id
    heading: title
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
    seo {
      ...Seo
    }
  }
}
    ${ImageFragmentDoc}
${ImageAssetFragmentDoc}
${SeoFragmentDoc}`;
export const AboutWhoWeArePageDocument = gql`
    query aboutWhoWeArePage($isDraftFilter: Sanity_DocumentFilter) {
  aboutCorePage: allAboutCorePage(
    where: {_: $isDraftFilter, _id: {matches: "*aboutCorePage"}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    title
    summaryPortableText: summaryRaw
    summaryCardImage {
      ...Image
    }
    contactSection {
      infoPortableText: infoRaw
    }
  }
  allAboutCorePageWhoWeAre(
    where: {_: $isDraftFilter, _id: {matches: "*aboutCorePage.whoWeAre"}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    id: _id
    heading: title
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
    seo {
      ...Seo
    }
  }
}
    ${ImageFragmentDoc}
${TextAndMediaFragmentDoc}
${TextBlockFragmentDoc}
${CtaFragmentDoc}
${SeoFragmentDoc}`;
export const AboutWorkWithUsPageDocument = gql`
    query aboutWorkWithUsPage($isDraftFilter: Sanity_DocumentFilter) {
  aboutCorePage: allAboutCorePage(
    where: {_: $isDraftFilter, _id: {matches: "*aboutCorePage"}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    title
    summaryPortableText: summaryRaw
    summaryCardImage {
      ...Image
    }
    contactSection {
      infoPortableText: infoRaw
    }
  }
  allAboutCorePageWorkWithUs(
    where: {_: $isDraftFilter, _id: {matches: "*aboutCorePage.workWithUs"}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    id: _id
    heading: title
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
    seo {
      ...Seo
    }
  }
}
    ${ImageFragmentDoc}
${CardFragmentDoc}
${SeoFragmentDoc}`;
export const AllBlogPostsDocument = gql`
    query allBlogPosts($isDraftFilter: Sanity_DocumentFilter, $limit: Int = 9999) {
  allNewsPost(
    where: {_: $isDraftFilter}
    sort: [{date: DESC}, {_updatedAt: DESC}]
    limit: $limit
  ) {
    ...BlogPreviewFields
  }
}
    ${BlogPreviewFieldsFragmentDoc}`;
export const AllLandingPagesDocument = gql`
    query allLandingPages($isDraftFilter: Sanity_DocumentFilter, $limit: Int = 9999) {
  allLandingPage(
    where: {_: $isDraftFilter}
    sort: [{_updatedAt: DESC}]
    limit: $limit
  ) {
    id: _id
    slug {
      current
    }
    seo {
      ...Seo
    }
  }
}
    ${SeoFragmentDoc}`;
export const AllPolicyPagesDocument = gql`
    query allPolicyPages($isDraftFilter: Sanity_DocumentFilter, $limit: Int = 9999) {
  allPolicyPage(
    where: {_: $isDraftFilter}
    sort: [{_updatedAt: DESC}]
    limit: $limit
  ) {
    id: _id
    title
    slug {
      current
    }
    seo {
      ...Seo
    }
  }
}
    ${SeoFragmentDoc}`;
export const AllWebinarsDocument = gql`
    query allWebinars($isDraftFilter: Sanity_DocumentFilter, $limit: Int = 9999) {
  allWebinar(
    where: {_: $isDraftFilter}
    sort: [{date: DESC}, {_updatedAt: DESC}]
    limit: $limit
  ) {
    ...WebinarPreviewFields
  }
}
    ${WebinarPreviewFieldsFragmentDoc}`;
export const BlogPostBySlugDocument = gql`
    query blogPostBySlug($slug: String, $isDraftFilter: Sanity_DocumentFilter) {
  allNewsPost(
    where: {_: $isDraftFilter, slug: {current: {eq: $slug}}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    id: _id
    title
    date
    author {
      id: _id
      _key
      name
      role
      image {
        ...Image
      }
    }
    slug {
      current
    }
    mainImage {
      ...ImageWithAltText
    }
    category {
      title
      slug {
        current
      }
    }
    summaryPortableText: summary
    contentPortableText: contentRaw
    seo {
      ...Seo
    }
  }
}
    ${ImageFragmentDoc}
${ImageWithAltTextFragmentDoc}
${SeoFragmentDoc}`;
export const ContactCorePageDocument = gql`
    query contactCorePage($isDraftFilter: Sanity_DocumentFilter) {
  allContactCorePage(
    where: {_: $isDraftFilter, _id: {matches: "*contactCorePage"}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    id: _id
    title
    heading
    summaryPortableText: summaryRaw
    summaryCardImage {
      ...Image
    }
    bodyPortableText: bodyRaw
    seo {
      ...Seo
    }
  }
}
    ${ImageFragmentDoc}
${SeoFragmentDoc}`;
export const CurriculumOverviewDocument = gql`
    query curriculumOverview($isDraftFilter: Sanity_DocumentFilter, $subjectTitle: String, $phaseSlug: String) {
  allCurriculumInfoPageOverview(
    where: {_: $isDraftFilter, subject: {eq: $subjectTitle}, phase: {matches: $phaseSlug}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    id: _id
    curriculumExplainer {
      explainerRaw
    }
    subjectPrinciples
    partnerBio
    curriculumPartner {
      name
      image {
        ...Image
      }
    }
    curriculumPartnerOverviews {
      curriculumPartner {
        name
        image {
          ...Image
        }
      }
      partnerBio
    }
    video {
      ...Video
    }
    videoAuthor
    videoExplainer
  }
}
    ${ImageFragmentDoc}
${VideoFragmentDoc}`;
export const HomepageDocument = gql`
    query homepage($isDraftFilter: Sanity_DocumentFilter) {
  allHomepage(
    where: {_: $isDraftFilter, _id: {matches: "*homepage"}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    id: _id
    heading
    summaryPortableText: summaryRaw
    notification {
      enabled
      label
      heading
      subheading
      link {
        ...Link
      }
    }
    sidebarCard1 {
      ...Card
    }
    sidebarCard2 {
      ...Card
    }
    seo {
      ...Seo
    }
    testimonials {
      quote {
        text
        attribution
        organisation
        role
      }
      image {
        asset {
          url
          _id
        }
        altText
      }
    }
  }
}
    ${LinkFragmentDoc}
${CardFragmentDoc}
${SeoFragmentDoc}`;
export const LandingPageBySlugDocument = gql`
    query landingPageBySlug($slug: String, $isDraftFilter: Sanity_DocumentFilter) {
  allLandingPage(
    where: {_: $isDraftFilter, slug: {current: {eq: $slug}}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    ...LandingPage
  }
}
    ${LandingPageFragmentDoc}`;
export const NewsListingPageDocument = gql`
    query newsListingPage($isDraftFilter: Sanity_DocumentFilter) {
  allNewsListingPage(
    where: {_: $isDraftFilter, _id: {matches: "*newsListingPage"}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    id: _id
    title
    heading
    summaryPortableText: summaryRaw
    summaryCardImage {
      ...Image
    }
    seo {
      ...Seo
    }
  }
}
    ${ImageFragmentDoc}
${SeoFragmentDoc}`;
export const PlanALessonPageDocument = gql`
    query planALessonPage($isDraftFilter: Sanity_DocumentFilter) {
  allPlanALessonCorePage(
    sort: {_updatedAt: DESC}
    limit: 1
    where: {_: $isDraftFilter, _id: {matches: "*planALessonCorePage"}}
  ) {
    id: _id
    hero {
      heading
      summaryPortableText: summaryRaw
      image {
        ...ImageWithAltText
      }
      author {
        ...TeamMember
      }
    }
    content {
      ... on PlanALessonPageContent {
        type: __typename
        navigationTitle: title
        bodyPortableText: contentRaw
        anchorSlug {
          current
        }
      }
      ... on PlanALessonPageFormBlock {
        type: __typename
        navigationTitle: title
        bodyPortableText: textRaw
        form {
          title
        }
      }
    }
    seo {
      ...Seo
    }
  }
}
    ${ImageWithAltTextFragmentDoc}
${TeamMemberFragmentDoc}
${SeoFragmentDoc}`;
export const PlanningCorePageDocument = gql`
    query planningCorePage($isDraftFilter: Sanity_DocumentFilter) {
  allPlanningCorePage(
    sort: {_updatedAt: DESC}
    limit: 1
    where: {_: $isDraftFilter, _id: {matches: "*planningCorePage"}}
  ) {
    id: _id
    title
    heading
    summaryPortableText: summaryRaw
    summaryCardImage {
      ...Image
    }
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
    seo {
      ...Seo
    }
  }
}
    ${ImageFragmentDoc}
${CardFragmentDoc}
${CtaFragmentDoc}
${TextAndMediaFragmentDoc}
${SeoFragmentDoc}`;
export const PolicyPageBySlugDocument = gql`
    query policyPageBySlug($slug: String, $isDraftFilter: Sanity_DocumentFilter) {
  allPolicyPage(
    sort: {_updatedAt: DESC}
    limit: 1
    where: {_: $isDraftFilter, slug: {current: {eq: $slug}}}
  ) {
    id: _id
    title
    lastUpdatedAt: _updatedAt
    slug {
      current
    }
    bodyPortableText: bodyRaw
    seo {
      ...Seo
    }
  }
}
    ${SeoFragmentDoc}`;
export const PortableTextReferencesDocument = gql`
    query portableTextReferences($ids: [ID!]) {
  allDocument(where: {_id: {in: $ids}}) {
    id: _id
    _type
    ...InternalLinkFields
    ... on SanityImageAsset {
      _id
      url
    }
    ... on Video {
      ...Video
    }
  }
}
    ${InternalLinkFieldsFragmentDoc}
${VideoFragmentDoc}`;
export const SupportCorePageDocument = gql`
    query supportCorePage($isDraftFilter: Sanity_DocumentFilter) {
  allSupportCorePage(
    sort: {_updatedAt: DESC}
    limit: 1
    where: {_: $isDraftFilter, _id: {matches: "*supportCorePage"}}
  ) {
    id: _id
    title
    heading
    summaryPortableText: summaryRaw
    summaryCardImage {
      ...Image
    }
    cover {
      title
      bodyPortableText: bodyRaw
      quote {
        ...Quote
      }
    }
    curriculum {
      title
      bodyPortableText: bodyRaw
      cta {
        ...CTA
      }
    }
    development {
      title
      bodyPortableText: bodyRaw
    }
    planning {
      title
      bodyPortableText: bodyRaw
    }
    seo {
      ...Seo
    }
  }
}
    ${ImageFragmentDoc}
${QuoteFragmentDoc}
${CtaFragmentDoc}
${SeoFragmentDoc}`;
export const WebinarBySlugDocument = gql`
    query webinarBySlug($slug: String, $isDraftFilter: Sanity_DocumentFilter) {
  allWebinar(
    where: {_: $isDraftFilter, slug: {current: {eq: $slug}}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    id: _id
    title
    slug {
      current
    }
    date
    summaryPortableText: summaryRaw
    category {
      title
      slug {
        current
      }
    }
    hosts {
      id: _id
      _key
      name
      image {
        ...Image
      }
    }
    video {
      ...Video
    }
    seo {
      ...Seo
    }
  }
}
    ${ImageFragmentDoc}
${VideoFragmentDoc}
${SeoFragmentDoc}`;
export const WebinarsListingPageDocument = gql`
    query webinarsListingPage($isDraftFilter: Sanity_DocumentFilter) {
  allWebinarListingPage(
    where: {_: $isDraftFilter, _id: {matches: "*webinarListingPage"}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    id: _id
    title
    heading
    summaryPortableText: summaryRaw
    summaryCardImage {
      ...Image
    }
    seo {
      ...Seo
    }
  }
}
    ${ImageFragmentDoc}
${SeoFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    abTestedPageBySlug(variables?: AbTestedPageBySlugQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AbTestedPageBySlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AbTestedPageBySlugQuery>(AbTestedPageBySlugDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'abTestedPageBySlug', 'query', variables);
    },
    aboutBoardPage(variables?: AboutBoardPageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AboutBoardPageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AboutBoardPageQuery>(AboutBoardPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'aboutBoardPage', 'query', variables);
    },
    aboutLeadershipPage(variables?: AboutLeadershipPageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AboutLeadershipPageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AboutLeadershipPageQuery>(AboutLeadershipPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'aboutLeadershipPage', 'query', variables);
    },
    aboutPartnersPage(variables?: AboutPartnersPageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AboutPartnersPageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AboutPartnersPageQuery>(AboutPartnersPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'aboutPartnersPage', 'query', variables);
    },
    aboutWhoWeArePage(variables?: AboutWhoWeArePageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AboutWhoWeArePageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AboutWhoWeArePageQuery>(AboutWhoWeArePageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'aboutWhoWeArePage', 'query', variables);
    },
    aboutWorkWithUsPage(variables?: AboutWorkWithUsPageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AboutWorkWithUsPageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AboutWorkWithUsPageQuery>(AboutWorkWithUsPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'aboutWorkWithUsPage', 'query', variables);
    },
    allBlogPosts(variables?: AllBlogPostsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AllBlogPostsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllBlogPostsQuery>(AllBlogPostsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allBlogPosts', 'query', variables);
    },
    allLandingPages(variables?: AllLandingPagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AllLandingPagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllLandingPagesQuery>(AllLandingPagesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allLandingPages', 'query', variables);
    },
    allPolicyPages(variables?: AllPolicyPagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AllPolicyPagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllPolicyPagesQuery>(AllPolicyPagesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allPolicyPages', 'query', variables);
    },
    allWebinars(variables?: AllWebinarsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AllWebinarsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllWebinarsQuery>(AllWebinarsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allWebinars', 'query', variables);
    },
    blogPostBySlug(variables?: BlogPostBySlugQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<BlogPostBySlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BlogPostBySlugQuery>(BlogPostBySlugDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'blogPostBySlug', 'query', variables);
    },
    contactCorePage(variables?: ContactCorePageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ContactCorePageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ContactCorePageQuery>(ContactCorePageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'contactCorePage', 'query', variables);
    },
    curriculumOverview(variables?: CurriculumOverviewQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CurriculumOverviewQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CurriculumOverviewQuery>(CurriculumOverviewDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'curriculumOverview', 'query', variables);
    },
    homepage(variables?: HomepageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<HomepageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<HomepageQuery>(HomepageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'homepage', 'query', variables);
    },
    landingPageBySlug(variables?: LandingPageBySlugQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LandingPageBySlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LandingPageBySlugQuery>(LandingPageBySlugDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'landingPageBySlug', 'query', variables);
    },
    newsListingPage(variables?: NewsListingPageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<NewsListingPageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<NewsListingPageQuery>(NewsListingPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'newsListingPage', 'query', variables);
    },
    planALessonPage(variables?: PlanALessonPageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PlanALessonPageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PlanALessonPageQuery>(PlanALessonPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'planALessonPage', 'query', variables);
    },
    planningCorePage(variables?: PlanningCorePageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PlanningCorePageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PlanningCorePageQuery>(PlanningCorePageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'planningCorePage', 'query', variables);
    },
    policyPageBySlug(variables?: PolicyPageBySlugQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PolicyPageBySlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PolicyPageBySlugQuery>(PolicyPageBySlugDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'policyPageBySlug', 'query', variables);
    },
    portableTextReferences(variables?: PortableTextReferencesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PortableTextReferencesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PortableTextReferencesQuery>(PortableTextReferencesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'portableTextReferences', 'query', variables);
    },
    supportCorePage(variables?: SupportCorePageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SupportCorePageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SupportCorePageQuery>(SupportCorePageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'supportCorePage', 'query', variables);
    },
    webinarBySlug(variables?: WebinarBySlugQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<WebinarBySlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WebinarBySlugQuery>(WebinarBySlugDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'webinarBySlug', 'query', variables);
    },
    webinarsListingPage(variables?: WebinarsListingPageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<WebinarsListingPageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WebinarsListingPageQuery>(WebinarsListingPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'webinarsListingPage', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;