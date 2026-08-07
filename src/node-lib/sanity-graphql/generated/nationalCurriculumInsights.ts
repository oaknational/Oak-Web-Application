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
  media?: Maybe<GlobalDocumentReference>;
  name?: Maybe<Scalars['String']['output']>;
};

export type AboutPagePartnerImageFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  asset?: InputMaybe<SanityImageAssetFilter>;
  crop?: InputMaybe<SanityImageCropFilter>;
  hotspot?: InputMaybe<SanityImageHotspotFilter>;
  media?: InputMaybe<GlobalDocumentReferenceFilter>;
  name?: InputMaybe<StringFilter>;
};

export type AboutPagePartnerImageSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  crop?: InputMaybe<SanityImageCropSorting>;
  hotspot?: InputMaybe<SanityImageHotspotSorting>;
  media?: InputMaybe<GlobalDocumentReferenceSorting>;
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
  /** Optional second video for below the fold section */
  belowTheFoldVideo2?: Maybe<Video>;
  giveFeedbackLink?: Maybe<Link>;
  heading?: Maybe<Scalars['String']['output']>;
  heroVideo?: Maybe<Video>;
  promptExamples?: Maybe<Array<Maybe<IconTitleFile>>>;
  sampleLessons?: Maybe<Array<Maybe<IconTitleFile>>>;
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
  belowTheFoldVideo2?: InputMaybe<VideoFilter>;
  giveFeedbackLink?: InputMaybe<LinkFilter>;
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
  giveFeedbackLink?: InputMaybe<LinkSorting>;
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

export type ApiContentPage = Document & {
  __typename?: 'ApiContentPage';
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
  docsBlocksRaw?: Maybe<Scalars['JSON']['output']>;
  navGroupType?: Maybe<NavGroup>;
  order?: Maybe<Scalars['Float']['output']>;
  slug?: Maybe<Slug>;
  title?: Maybe<Scalars['String']['output']>;
};

export type ApiContentPageFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  navGroupType?: InputMaybe<NavGroupFilter>;
  order?: InputMaybe<FloatFilter>;
  slug?: InputMaybe<SlugFilter>;
  title?: InputMaybe<StringFilter>;
};

export type ApiContentPageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  order?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SlugSorting>;
  title?: InputMaybe<SortOrder>;
};

export type ApiLandingBlockWithoutBody = {
  __typename?: 'ApiLandingBlockWithoutBody';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  cta?: Maybe<CtaLink>;
  image?: Maybe<ImageWithAltText>;
  titleRaw?: Maybe<Scalars['JSON']['output']>;
};

export type ApiLandingBlockWithoutBodyFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  cta?: InputMaybe<CtaLinkFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
};

export type ApiLandingBlockWithoutBodySorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  cta?: InputMaybe<CtaLinkSorting>;
  image?: InputMaybe<ImageWithAltTextSorting>;
};

export type ApiLandingPageBlockWithoutImage = {
  __typename?: 'ApiLandingPageBlockWithoutImage';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  bodyRaw?: Maybe<Scalars['JSON']['output']>;
  cta?: Maybe<CtaLink>;
  titleRaw?: Maybe<Scalars['JSON']['output']>;
};

export type ApiLandingPageBlockWithoutImageFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  cta?: InputMaybe<CtaLinkFilter>;
};

export type ApiLandingPageBlockWithoutImageSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  cta?: InputMaybe<CtaLinkSorting>;
};

export type ApiLandingPageBottomBlock = {
  __typename?: 'ApiLandingPageBottomBlock';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  mainBlock?: Maybe<ApiLandingBlockWithoutBody>;
  siblingBlocks?: Maybe<Array<Maybe<ApiLandingPageBlockWithoutImage>>>;
};

export type ApiLandingPageBottomBlockFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  mainBlock?: InputMaybe<ApiLandingBlockWithoutBodyFilter>;
};

export type ApiLandingPageBottomBlockSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  mainBlock?: InputMaybe<ApiLandingBlockWithoutBodySorting>;
};

export type ApiLandingPageTextAndMediaBlock = {
  __typename?: 'ApiLandingPageTextAndMediaBlock';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  bodyRaw?: Maybe<Scalars['JSON']['output']>;
  cta?: Maybe<CtaLink>;
  image?: Maybe<ImageWithAltText>;
  titleRaw?: Maybe<Scalars['JSON']['output']>;
};

export type ApiLandingPageTextAndMediaBlockFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  cta?: InputMaybe<CtaLinkFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
};

export type ApiLandingPageTextAndMediaBlockSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  cta?: InputMaybe<CtaLinkSorting>;
  image?: InputMaybe<ImageWithAltTextSorting>;
};

export type AssistInstructionContext = Document & {
  __typename?: 'AssistInstructionContext';
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
  contextRaw?: Maybe<Scalars['JSON']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type AssistInstructionContextFilter = {
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

export type AssistInstructionContextSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
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
  level?: Maybe<Scalars['Float']['output']>;
  listItem?: Maybe<Scalars['String']['output']>;
  style?: Maybe<Scalars['String']['output']>;
};

export type BlockOrCalloutOrCtaOrFormWrapperOrImageWithAltTextOrQuoteOrTextAndMediaOrVideo = Block | Callout | Cta | FormWrapper | ImageWithAltText | Quote | TextAndMedia | Video;

export type BlockOrCodeOrCtaLinkOrImageOrNoticeOrTable = Block | Code | CtaLink | Image | Notice | Table;

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

export type CampaignIntro = {
  __typename?: 'CampaignIntro';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  bodyRaw?: Maybe<Scalars['JSON']['output']>;
  headingRaw?: Maybe<Scalars['JSON']['output']>;
};

export type CampaignIntroFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type CampaignIntroOrCampaignPromoBannerOrCampaignVideoBannerOrNewsletterSignUp = CampaignIntro | CampaignPromoBanner | CampaignVideoBanner | NewsletterSignUp;

export type CampaignIntroSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type CampaignPage = Document & {
  __typename?: 'CampaignPage';
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
  content?: Maybe<Array<Maybe<CampaignIntroOrCampaignPromoBannerOrCampaignVideoBannerOrNewsletterSignUp>>>;
  header?: Maybe<CampaignPageHeader>;
  seo?: Maybe<Seo>;
  slug?: Maybe<Slug>;
  title?: Maybe<Scalars['String']['output']>;
};

export type CampaignPageFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  header?: InputMaybe<CampaignPageHeaderFilter>;
  seo?: InputMaybe<SeoFilter>;
  slug?: InputMaybe<SlugFilter>;
  title?: InputMaybe<StringFilter>;
};

export type CampaignPageHeader = {
  __typename?: 'CampaignPageHeader';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  /** Whether to hide the Key Stage buttons and search bar in the header, defaults to false */
  hideKsSelector?: Maybe<Scalars['Boolean']['output']>;
  image?: Maybe<ImageWithAltText>;
  subheading?: Maybe<Scalars['String']['output']>;
};

export type CampaignPageHeaderFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  heading?: InputMaybe<StringFilter>;
  hideKsSelector?: InputMaybe<BooleanFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
  subheading?: InputMaybe<StringFilter>;
};

export type CampaignPageHeaderSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  hideKsSelector?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
  subheading?: InputMaybe<SortOrder>;
};

export type CampaignPageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  header?: InputMaybe<CampaignPageHeaderSorting>;
  seo?: InputMaybe<SeoSorting>;
  slug?: InputMaybe<SlugSorting>;
  title?: InputMaybe<SortOrder>;
};

export type CampaignPromoBanner = {
  __typename?: 'CampaignPromoBanner';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  bodyRaw?: Maybe<Scalars['JSON']['output']>;
  buttonCta?: Maybe<Scalars['String']['output']>;
  buttonUrl?: Maybe<Scalars['String']['output']>;
  headingRaw?: Maybe<Scalars['JSON']['output']>;
  media?: Maybe<Array<Maybe<ImageWithAltTextOrVideo>>>;
  subheadingRaw?: Maybe<Scalars['JSON']['output']>;
};

export type CampaignPromoBannerFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  buttonCta?: InputMaybe<StringFilter>;
  buttonUrl?: InputMaybe<StringFilter>;
};

export type CampaignPromoBannerSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  buttonCta?: InputMaybe<SortOrder>;
  buttonUrl?: InputMaybe<SortOrder>;
};

export type CampaignVideoBanner = {
  __typename?: 'CampaignVideoBanner';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  headingRaw?: Maybe<Scalars['JSON']['output']>;
  subheadingRaw?: Maybe<Scalars['JSON']['output']>;
  video?: Maybe<Video>;
};

export type CampaignVideoBannerFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  video?: InputMaybe<VideoFilter>;
};

export type CampaignVideoBannerSorting = {
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

export type CaseStudy = Document & {
  __typename?: 'CaseStudy';
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
  publishedAt?: Maybe<Scalars['Date']['output']>;
  slug?: Maybe<Slug>;
  textRaw?: Maybe<Scalars['JSON']['output']>;
  video?: Maybe<Video>;
};

export type CaseStudyFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
  publishedAt?: InputMaybe<DateFilter>;
  slug?: InputMaybe<SlugFilter>;
  video?: InputMaybe<VideoFilter>;
};

export type CaseStudySorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
  publishedAt?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SlugSorting>;
};

export type Code = {
  __typename?: 'Code';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  highlightedLines?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  language?: Maybe<Scalars['String']['output']>;
};

export type CodeFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  code?: InputMaybe<StringFilter>;
  filename?: InputMaybe<StringFilter>;
  language?: InputMaybe<StringFilter>;
};

export type CodeSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  code?: InputMaybe<SortOrder>;
  filename?: InputMaybe<SortOrder>;
  language?: InputMaybe<SortOrder>;
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

export type CtaLink = {
  __typename?: 'CtaLink';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  backgroundImageUrl?: Maybe<Image>;
  externalLink?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  variant?: Maybe<Scalars['String']['output']>;
};

export type CtaLinkFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  backgroundImageUrl?: InputMaybe<ImageFilter>;
  externalLink?: InputMaybe<StringFilter>;
  icon?: InputMaybe<StringFilter>;
  label?: InputMaybe<StringFilter>;
  variant?: InputMaybe<StringFilter>;
};

export type CtaLinkSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  backgroundImageUrl?: InputMaybe<ImageSorting>;
  externalLink?: InputMaybe<SortOrder>;
  icon?: InputMaybe<SortOrder>;
  label?: InputMaybe<SortOrder>;
  variant?: InputMaybe<SortOrder>;
};

export type CtaSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  anchor?: InputMaybe<SortOrder>;
  external?: InputMaybe<SortOrder>;
  label?: InputMaybe<SortOrder>;
  linkType?: InputMaybe<SortOrder>;
};

export type CurriculumApiLandingPage = Document & {
  __typename?: 'CurriculumApiLandingPage';
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
  content?: Maybe<Array<Maybe<ApiLandingPageTextAndMediaBlock>>>;
  seo?: Maybe<Seo>;
  usingTheApiSection?: Maybe<ApiLandingPageBottomBlock>;
};

export type CurriculumApiLandingPageFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  seo?: InputMaybe<SeoFilter>;
  usingTheApiSection?: InputMaybe<ApiLandingPageBottomBlockFilter>;
};

export type CurriculumApiLandingPageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  seo?: InputMaybe<SeoSorting>;
  usingTheApiSection?: InputMaybe<ApiLandingPageBottomBlockSorting>;
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
  curriculumSeoTextRaw?: Maybe<Scalars['JSON']['output']>;
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
  partnerBioPortableTextRaw?: Maybe<Scalars['JSON']['output']>;
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
  media?: Maybe<GlobalDocumentReference>;
};

export type FileFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  asset?: InputMaybe<SanityFileAssetFilter>;
  media?: InputMaybe<GlobalDocumentReferenceFilter>;
};

export type FileSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  media?: InputMaybe<GlobalDocumentReferenceSorting>;
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

export type GetInvolvedPageCollab = {
  __typename?: 'GetInvolvedPageCollab';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  feedbackTextRaw?: Maybe<Scalars['JSON']['output']>;
  researchPanelTextRaw?: Maybe<Scalars['JSON']['output']>;
};

export type GetInvolvedPageCollabFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type GetInvolvedPageCollabSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type GetInvolvedPageHeader = {
  __typename?: 'GetInvolvedPageHeader';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  introText?: Maybe<Scalars['String']['output']>;
};

export type GetInvolvedPageHeaderFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  introText?: InputMaybe<StringFilter>;
};

export type GetInvolvedPageHeaderSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  introText?: InputMaybe<SortOrder>;
};

export type GetInvolvedPageWorkWithUs = {
  __typename?: 'GetInvolvedPageWorkWithUs';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageWithAltText>;
  textRaw?: Maybe<Scalars['JSON']['output']>;
};

export type GetInvolvedPageWorkWithUsFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
};

export type GetInvolvedPageWorkWithUsSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
};

export type GlobalDocumentReference = {
  __typename?: 'GlobalDocumentReference';
  _key?: Maybe<Scalars['String']['output']>;
  _ref?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  _weak?: Maybe<Scalars['Boolean']['output']>;
};

export type GlobalDocumentReferenceFilter = {
  _key?: InputMaybe<StringFilter>;
  _ref?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _weak?: InputMaybe<BooleanFilter>;
};

export type GlobalDocumentReferenceSorting = {
  _key?: InputMaybe<SortOrder>;
  _ref?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _weak?: InputMaybe<SortOrder>;
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
  campaignPromoBanner?: Maybe<CampaignPromoBanner>;
  heading?: Maybe<Scalars['String']['output']>;
  intro?: Maybe<TextAndMedia>;
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
  campaignPromoBanner?: InputMaybe<CampaignPromoBannerFilter>;
  heading?: InputMaybe<StringFilter>;
  intro?: InputMaybe<TextAndMediaFilter>;
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
  campaignPromoBanner?: InputMaybe<CampaignPromoBannerSorting>;
  heading?: InputMaybe<SortOrder>;
  intro?: InputMaybe<TextAndMediaSorting>;
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

export type IconTitleFile = {
  __typename?: 'IconTitleFile';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  file?: Maybe<File>;
  fileName?: Maybe<Scalars['String']['output']>;
  iconName?: Maybe<Scalars['String']['output']>;
  iconTileBackgroundColour?: Maybe<Scalars['String']['output']>;
  /** Optional file name to show on mobile */
  mobileFileName?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type IconTitleFileFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  file?: InputMaybe<FileFilter>;
  fileName?: InputMaybe<StringFilter>;
  iconName?: InputMaybe<StringFilter>;
  iconTileBackgroundColour?: InputMaybe<StringFilter>;
  mobileFileName?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
};

export type IconTitleFileSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  file?: InputMaybe<FileSorting>;
  fileName?: InputMaybe<SortOrder>;
  iconName?: InputMaybe<SortOrder>;
  iconTileBackgroundColour?: InputMaybe<SortOrder>;
  mobileFileName?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
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
  media?: Maybe<GlobalDocumentReference>;
};

export type ImageFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  asset?: InputMaybe<SanityImageAssetFilter>;
  crop?: InputMaybe<SanityImageCropFilter>;
  hotspot?: InputMaybe<SanityImageHotspotFilter>;
  media?: InputMaybe<GlobalDocumentReferenceFilter>;
};

export type ImageSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  crop?: InputMaybe<SanityImageCropSorting>;
  hotspot?: InputMaybe<SanityImageHotspotSorting>;
  media?: InputMaybe<GlobalDocumentReferenceSorting>;
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
  media?: Maybe<GlobalDocumentReference>;
};

export type ImageWithAltTextAndDarkMode = {
  __typename?: 'ImageWithAltTextAndDarkMode';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  altText?: Maybe<Scalars['String']['output']>;
  asset?: Maybe<SanityImageAsset>;
  crop?: Maybe<SanityImageCrop>;
  darkModeImage?: Maybe<Image>;
  hotspot?: Maybe<SanityImageHotspot>;
  /** Should this image be read aloud to screen readers, or is it purely presentational? */
  isPresentational?: Maybe<Scalars['Boolean']['output']>;
  media?: Maybe<GlobalDocumentReference>;
};

export type ImageWithAltTextAndDarkModeFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  altText?: InputMaybe<StringFilter>;
  asset?: InputMaybe<SanityImageAssetFilter>;
  crop?: InputMaybe<SanityImageCropFilter>;
  darkModeImage?: InputMaybe<ImageFilter>;
  hotspot?: InputMaybe<SanityImageHotspotFilter>;
  isPresentational?: InputMaybe<BooleanFilter>;
  media?: InputMaybe<GlobalDocumentReferenceFilter>;
};

export type ImageWithAltTextAndDarkModeSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  altText?: InputMaybe<SortOrder>;
  crop?: InputMaybe<SanityImageCropSorting>;
  darkModeImage?: InputMaybe<ImageSorting>;
  hotspot?: InputMaybe<SanityImageHotspotSorting>;
  isPresentational?: InputMaybe<SortOrder>;
  media?: InputMaybe<GlobalDocumentReferenceSorting>;
};

export type ImageWithAltTextFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  altText?: InputMaybe<StringFilter>;
  asset?: InputMaybe<SanityImageAssetFilter>;
  crop?: InputMaybe<SanityImageCropFilter>;
  hotspot?: InputMaybe<SanityImageHotspotFilter>;
  isPresentational?: InputMaybe<BooleanFilter>;
  media?: InputMaybe<GlobalDocumentReferenceFilter>;
};

export type ImageWithAltTextOrVideo = ImageWithAltText | Video;

export type ImageWithAltTextSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  altText?: InputMaybe<SortOrder>;
  crop?: InputMaybe<SanityImageCropSorting>;
  hotspot?: InputMaybe<SanityImageHotspotSorting>;
  isPresentational?: InputMaybe<SortOrder>;
  media?: InputMaybe<GlobalDocumentReferenceSorting>;
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

export type MeetTheTeamPageDocuments = {
  __typename?: 'MeetTheTeamPageDocuments';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  files?: Maybe<Array<Maybe<Attachment>>>;
};

export type MeetTheTeamPageDocumentsFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type MeetTheTeamPageDocumentsSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type MeetTheTeamPageGovernance = {
  __typename?: 'MeetTheTeamPageGovernance';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  textRaw?: Maybe<Scalars['JSON']['output']>;
};

export type MeetTheTeamPageGovernanceFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type MeetTheTeamPageGovernanceSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type MeetTheTeamPageHeader = {
  __typename?: 'MeetTheTeamPageHeader';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageWithAltText>;
  introText?: Maybe<Scalars['String']['output']>;
};

export type MeetTheTeamPageHeaderFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
  introText?: InputMaybe<StringFilter>;
};

export type MeetTheTeamPageHeaderSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
  introText?: InputMaybe<SortOrder>;
};

export type MeetTheTeamPageOurBoard = {
  __typename?: 'MeetTheTeamPageOurBoard';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  boardMembers?: Maybe<Array<Maybe<TeamMember>>>;
  textRaw?: Maybe<Scalars['JSON']['output']>;
};

export type MeetTheTeamPageOurBoardFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type MeetTheTeamPageOurBoardSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type MeetTheTeamPageOurLeadership = {
  __typename?: 'MeetTheTeamPageOurLeadership';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  leadershipTeam?: Maybe<Array<Maybe<TeamMember>>>;
  textRaw?: Maybe<Scalars['JSON']['output']>;
};

export type MeetTheTeamPageOurLeadershipFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type MeetTheTeamPageOurLeadershipSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type MuxAssetData = {
  __typename?: 'MuxAssetData';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  aspect_ratio?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
  duration?: Maybe<Scalars['Float']['output']>;
  encoding_tier?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  master_access?: Maybe<Scalars['String']['output']>;
  max_resolution_tier?: Maybe<Scalars['String']['output']>;
  max_stored_frame_rate?: Maybe<Scalars['Float']['output']>;
  max_stored_resolution?: Maybe<Scalars['String']['output']>;
  mp4_support?: Maybe<Scalars['String']['output']>;
  passthrough?: Maybe<Scalars['String']['output']>;
  playback_ids?: Maybe<Array<Maybe<MuxPlaybackId>>>;
  resolution_tier?: Maybe<Scalars['String']['output']>;
  static_renditions?: Maybe<MuxStaticRenditions>;
  status?: Maybe<Scalars['String']['output']>;
  tracks?: Maybe<Array<Maybe<MuxTrack>>>;
  upload_id?: Maybe<Scalars['String']['output']>;
};

export type MuxAssetDataFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  aspect_ratio?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<StringFilter>;
  duration?: InputMaybe<FloatFilter>;
  encoding_tier?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  master_access?: InputMaybe<StringFilter>;
  max_resolution_tier?: InputMaybe<StringFilter>;
  max_stored_frame_rate?: InputMaybe<FloatFilter>;
  max_stored_resolution?: InputMaybe<StringFilter>;
  mp4_support?: InputMaybe<StringFilter>;
  passthrough?: InputMaybe<StringFilter>;
  resolution_tier?: InputMaybe<StringFilter>;
  static_renditions?: InputMaybe<MuxStaticRenditionsFilter>;
  status?: InputMaybe<StringFilter>;
  upload_id?: InputMaybe<StringFilter>;
};

export type MuxAssetDataSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  aspect_ratio?: InputMaybe<SortOrder>;
  created_at?: InputMaybe<SortOrder>;
  duration?: InputMaybe<SortOrder>;
  encoding_tier?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  master_access?: InputMaybe<SortOrder>;
  max_resolution_tier?: InputMaybe<SortOrder>;
  max_stored_frame_rate?: InputMaybe<SortOrder>;
  max_stored_resolution?: InputMaybe<SortOrder>;
  mp4_support?: InputMaybe<SortOrder>;
  passthrough?: InputMaybe<SortOrder>;
  resolution_tier?: InputMaybe<SortOrder>;
  static_renditions?: InputMaybe<MuxStaticRenditionsSorting>;
  status?: InputMaybe<SortOrder>;
  upload_id?: InputMaybe<SortOrder>;
};

export type MuxPlaybackId = {
  __typename?: 'MuxPlaybackId';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  policy?: Maybe<Scalars['String']['output']>;
};

export type MuxPlaybackIdFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  policy?: InputMaybe<StringFilter>;
};

export type MuxPlaybackIdSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  policy?: InputMaybe<SortOrder>;
};

export type MuxStaticRenditionFile = {
  __typename?: 'MuxStaticRenditionFile';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  bitrate?: Maybe<Scalars['Float']['output']>;
  ext?: Maybe<Scalars['String']['output']>;
  filesize?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  width?: Maybe<Scalars['Float']['output']>;
};

export type MuxStaticRenditionFileFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  bitrate?: InputMaybe<FloatFilter>;
  ext?: InputMaybe<StringFilter>;
  filesize?: InputMaybe<FloatFilter>;
  height?: InputMaybe<FloatFilter>;
  name?: InputMaybe<StringFilter>;
  width?: InputMaybe<FloatFilter>;
};

export type MuxStaticRenditionFileSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  bitrate?: InputMaybe<SortOrder>;
  ext?: InputMaybe<SortOrder>;
  filesize?: InputMaybe<SortOrder>;
  height?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  width?: InputMaybe<SortOrder>;
};

export type MuxStaticRenditions = {
  __typename?: 'MuxStaticRenditions';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  files?: Maybe<Array<Maybe<MuxStaticRenditionFile>>>;
  status?: Maybe<Scalars['String']['output']>;
};

export type MuxStaticRenditionsFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  status?: InputMaybe<StringFilter>;
};

export type MuxStaticRenditionsSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
};

export type MuxTrack = {
  __typename?: 'MuxTrack';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  duration?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  max_frame_rate?: Maybe<Scalars['Float']['output']>;
  max_height?: Maybe<Scalars['Float']['output']>;
  max_width?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type MuxTrackFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  duration?: InputMaybe<FloatFilter>;
  id?: InputMaybe<StringFilter>;
  max_frame_rate?: InputMaybe<FloatFilter>;
  max_height?: InputMaybe<FloatFilter>;
  max_width?: InputMaybe<FloatFilter>;
  type?: InputMaybe<StringFilter>;
};

export type MuxTrackSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  duration?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  max_frame_rate?: InputMaybe<SortOrder>;
  max_height?: InputMaybe<SortOrder>;
  max_width?: InputMaybe<SortOrder>;
  type?: InputMaybe<SortOrder>;
};

export type MuxVideo = {
  __typename?: 'MuxVideo';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  asset?: Maybe<MuxVideoAsset>;
};

export type MuxVideoAsset = Document & {
  __typename?: 'MuxVideoAsset';
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
  assetId?: Maybe<Scalars['String']['output']>;
  data?: Maybe<MuxAssetData>;
  filename?: Maybe<Scalars['String']['output']>;
  playbackId?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  thumbTime?: Maybe<Scalars['Float']['output']>;
};

export type MuxVideoAssetFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  assetId?: InputMaybe<StringFilter>;
  data?: InputMaybe<MuxAssetDataFilter>;
  filename?: InputMaybe<StringFilter>;
  playbackId?: InputMaybe<StringFilter>;
  status?: InputMaybe<StringFilter>;
  thumbTime?: InputMaybe<FloatFilter>;
};

export type MuxVideoAssetSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  assetId?: InputMaybe<SortOrder>;
  data?: InputMaybe<MuxAssetDataSorting>;
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

export type NationalCurriculumInsightsAtAGlance = {
  __typename?: 'NationalCurriculumInsightsAtAGlance';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  items?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type NationalCurriculumInsightsAtAGlanceFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsAtAGlanceSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsFaqItem = {
  __typename?: 'NationalCurriculumInsightsFaqItem';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  answerRaw?: Maybe<Scalars['JSON']['output']>;
  initiallyExpanded?: Maybe<Scalars['Boolean']['output']>;
  question?: Maybe<Scalars['String']['output']>;
};

export type NationalCurriculumInsightsFaqItemFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  initiallyExpanded?: InputMaybe<BooleanFilter>;
  question?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsFaqItemSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  initiallyExpanded?: InputMaybe<SortOrder>;
  question?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsFaqSection = {
  __typename?: 'NationalCurriculumInsightsFaqSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  items?: Maybe<Array<Maybe<NationalCurriculumInsightsFaqItem>>>;
};

export type NationalCurriculumInsightsFaqSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  heading?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsFaqSectionOrNationalCurriculumInsightsHeroSectionOrNationalCurriculumInsightsImageTextSectionOrNationalCurriculumInsightsKeyStageCardsSectionOrNationalCurriculumInsightsNewsletterSectionOrNationalCurriculumInsightsOverviewSectionOrNationalCurriculumInsightsPhaseCardsSectionOrNationalCurriculumInsightsPromotionalHeadingSectionOrNationalCurriculumInsightsQuoteSectionOrNationalCurriculumInsightsRichTextSectionOrNationalCurriculumInsightsSubjectNavigationSectionOrNationalCurriculumInsightsTableSectionOrNationalCurriculumInsightsVideoCardsSection = NationalCurriculumInsightsFaqSection | NationalCurriculumInsightsHeroSection | NationalCurriculumInsightsImageTextSection | NationalCurriculumInsightsKeyStageCardsSection | NationalCurriculumInsightsNewsletterSection | NationalCurriculumInsightsOverviewSection | NationalCurriculumInsightsPhaseCardsSection | NationalCurriculumInsightsPromotionalHeadingSection | NationalCurriculumInsightsQuoteSection | NationalCurriculumInsightsRichTextSection | NationalCurriculumInsightsSubjectNavigationSection | NationalCurriculumInsightsTableSection | NationalCurriculumInsightsVideoCardsSection;

export type NationalCurriculumInsightsFaqSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsHeroSection = {
  __typename?: 'NationalCurriculumInsightsHeroSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  authorImage?: Maybe<ImageWithAltText>;
  /** Optional byline shown on subject, phase and key-stage pages. */
  authorName?: Maybe<Scalars['String']['output']>;
  authorRole?: Maybe<Scalars['String']['output']>;
  bodyRaw?: Maybe<Scalars['JSON']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageWithAltText>;
  /** Optional publication or review message shown alongside the byline. */
  statusMessage?: Maybe<Scalars['String']['output']>;
};

export type NationalCurriculumInsightsHeroSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  authorImage?: InputMaybe<ImageWithAltTextFilter>;
  authorName?: InputMaybe<StringFilter>;
  authorRole?: InputMaybe<StringFilter>;
  heading?: InputMaybe<StringFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
  statusMessage?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsHeroSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  authorImage?: InputMaybe<ImageWithAltTextSorting>;
  authorName?: InputMaybe<SortOrder>;
  authorRole?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
  statusMessage?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsHub = Document & {
  __typename?: 'NationalCurriculumInsightsHub';
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
  modules?: Maybe<Array<Maybe<NationalCurriculumInsightsFaqSectionOrNationalCurriculumInsightsHeroSectionOrNationalCurriculumInsightsImageTextSectionOrNationalCurriculumInsightsKeyStageCardsSectionOrNationalCurriculumInsightsNewsletterSectionOrNationalCurriculumInsightsOverviewSectionOrNationalCurriculumInsightsPhaseCardsSectionOrNationalCurriculumInsightsPromotionalHeadingSectionOrNationalCurriculumInsightsQuoteSectionOrNationalCurriculumInsightsRichTextSectionOrNationalCurriculumInsightsSubjectNavigationSectionOrNationalCurriculumInsightsTableSectionOrNationalCurriculumInsightsVideoCardsSection>>>;
  seo?: Maybe<Seo>;
  subjects?: Maybe<Array<Maybe<NationalCurriculumInsightsSubject>>>;
  summary?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type NationalCurriculumInsightsHubFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  seo?: InputMaybe<SeoFilter>;
  summary?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsHubSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  seo?: InputMaybe<SeoSorting>;
  summary?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsImageTextSection = {
  __typename?: 'NationalCurriculumInsightsImageTextSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  background?: Maybe<Scalars['String']['output']>;
  bodyRaw?: Maybe<Scalars['JSON']['output']>;
  ctaHref?: Maybe<Scalars['String']['output']>;
  ctaLabel?: Maybe<Scalars['String']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageWithAltText>;
  imagePosition?: Maybe<Scalars['String']['output']>;
};

export type NationalCurriculumInsightsImageTextSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  background?: InputMaybe<StringFilter>;
  ctaHref?: InputMaybe<StringFilter>;
  ctaLabel?: InputMaybe<StringFilter>;
  heading?: InputMaybe<StringFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
  imagePosition?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsImageTextSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  background?: InputMaybe<SortOrder>;
  ctaHref?: InputMaybe<SortOrder>;
  ctaLabel?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
  imagePosition?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsKeyStageCard = {
  __typename?: 'NationalCurriculumInsightsKeyStageCard';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageWithAltText>;
  keyStage?: Maybe<Scalars['String']['output']>;
  linkLabel?: Maybe<Scalars['String']['output']>;
};

export type NationalCurriculumInsightsKeyStageCardFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  heading?: InputMaybe<StringFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
  keyStage?: InputMaybe<StringFilter>;
  linkLabel?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsKeyStageCardSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
  keyStage?: InputMaybe<SortOrder>;
  linkLabel?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsKeyStageCardsSection = {
  __typename?: 'NationalCurriculumInsightsKeyStageCardsSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  cards?: Maybe<Array<Maybe<NationalCurriculumInsightsKeyStageCard>>>;
};

export type NationalCurriculumInsightsKeyStageCardsSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsKeyStageCardsSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsKeyStagePage = Document & {
  __typename?: 'NationalCurriculumInsightsKeyStagePage';
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
  /** The URL segment is derived from this value, for example KS1 becomes key-stage-1. */
  keyStage?: Maybe<Scalars['String']['output']>;
  modules?: Maybe<Array<Maybe<NationalCurriculumInsightsFaqSectionOrNationalCurriculumInsightsHeroSectionOrNationalCurriculumInsightsImageTextSectionOrNationalCurriculumInsightsKeyStageCardsSectionOrNationalCurriculumInsightsNewsletterSectionOrNationalCurriculumInsightsOverviewSectionOrNationalCurriculumInsightsPhaseCardsSectionOrNationalCurriculumInsightsPromotionalHeadingSectionOrNationalCurriculumInsightsQuoteSectionOrNationalCurriculumInsightsRichTextSectionOrNationalCurriculumInsightsSubjectNavigationSectionOrNationalCurriculumInsightsTableSectionOrNationalCurriculumInsightsVideoCardsSection>>>;
  seo?: Maybe<Seo>;
  summary?: Maybe<Scalars['String']['output']>;
  /** Used in Studio and as a safe fallback. Visible headings should normally come from the ordered modules. */
  title?: Maybe<Scalars['String']['output']>;
};

export type NationalCurriculumInsightsKeyStagePageFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  keyStage?: InputMaybe<StringFilter>;
  seo?: InputMaybe<SeoFilter>;
  summary?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsKeyStagePageReference = {
  __typename?: 'NationalCurriculumInsightsKeyStagePageReference';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  keyStage?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  /** This key stage points to its own independently editable page and ordered modules. */
  page?: Maybe<NationalCurriculumInsightsKeyStagePage>;
};

export type NationalCurriculumInsightsKeyStagePageReferenceFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  keyStage?: InputMaybe<StringFilter>;
  label?: InputMaybe<StringFilter>;
  page?: InputMaybe<NationalCurriculumInsightsKeyStagePageFilter>;
};

export type NationalCurriculumInsightsKeyStagePageReferenceSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  keyStage?: InputMaybe<SortOrder>;
  label?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsKeyStagePageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  keyStage?: InputMaybe<SortOrder>;
  seo?: InputMaybe<SeoSorting>;
  summary?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsNewsletterSection = {
  __typename?: 'NationalCurriculumInsightsNewsletterSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  benefits?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  buttonLabel?: Maybe<Scalars['String']['output']>;
  /** Application-owned form identifier. The isolated preview renders the form locally and never submits it to a remote service. */
  formId?: Maybe<Scalars['String']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  illustration?: Maybe<ImageWithAltText>;
  introduction?: Maybe<Scalars['String']['output']>;
  privacyTextRaw?: Maybe<Scalars['JSON']['output']>;
};

export type NationalCurriculumInsightsNewsletterSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  buttonLabel?: InputMaybe<StringFilter>;
  formId?: InputMaybe<StringFilter>;
  heading?: InputMaybe<StringFilter>;
  illustration?: InputMaybe<ImageWithAltTextFilter>;
  introduction?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsNewsletterSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  buttonLabel?: InputMaybe<SortOrder>;
  formId?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  illustration?: InputMaybe<ImageWithAltTextSorting>;
  introduction?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsOverviewSection = {
  __typename?: 'NationalCurriculumInsightsOverviewSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  bodyRaw?: Maybe<Scalars['JSON']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageWithAltText>;
};

export type NationalCurriculumInsightsOverviewSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  heading?: InputMaybe<StringFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
};

export type NationalCurriculumInsightsOverviewSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
};

export type NationalCurriculumInsightsPage = Document & {
  __typename?: 'NationalCurriculumInsightsPage';
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
  keyStages?: Maybe<Array<Maybe<NationalCurriculumInsightsKeyStagePageReference>>>;
  modules?: Maybe<Array<Maybe<NationalCurriculumInsightsFaqSectionOrNationalCurriculumInsightsHeroSectionOrNationalCurriculumInsightsImageTextSectionOrNationalCurriculumInsightsKeyStageCardsSectionOrNationalCurriculumInsightsNewsletterSectionOrNationalCurriculumInsightsOverviewSectionOrNationalCurriculumInsightsPhaseCardsSectionOrNationalCurriculumInsightsPromotionalHeadingSectionOrNationalCurriculumInsightsQuoteSectionOrNationalCurriculumInsightsRichTextSectionOrNationalCurriculumInsightsSubjectNavigationSectionOrNationalCurriculumInsightsTableSectionOrNationalCurriculumInsightsVideoCardsSection>>>;
  /** The subject phase that can reference this page. The subject itself is the Overview page and controls the URL. */
  pageType?: Maybe<Scalars['String']['output']>;
  seo?: Maybe<Seo>;
  summary?: Maybe<Scalars['String']['output']>;
  /** Used in Studio and as a safe fallback. Visible headings should normally come from the ordered modules. */
  title?: Maybe<Scalars['String']['output']>;
};

export type NationalCurriculumInsightsPageFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  pageType?: InputMaybe<StringFilter>;
  seo?: InputMaybe<SeoFilter>;
  summary?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsPageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  pageType?: InputMaybe<SortOrder>;
  seo?: InputMaybe<SeoSorting>;
  summary?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsPhaseCard = {
  __typename?: 'NationalCurriculumInsightsPhaseCard';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageWithAltText>;
  linkLabel?: Maybe<Scalars['String']['output']>;
  phase?: Maybe<Scalars['String']['output']>;
};

export type NationalCurriculumInsightsPhaseCardFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  heading?: InputMaybe<StringFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
  linkLabel?: InputMaybe<StringFilter>;
  phase?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsPhaseCardSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
  linkLabel?: InputMaybe<SortOrder>;
  phase?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsPhaseCardsSection = {
  __typename?: 'NationalCurriculumInsightsPhaseCardsSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  cards?: Maybe<Array<Maybe<NationalCurriculumInsightsPhaseCard>>>;
};

export type NationalCurriculumInsightsPhaseCardsSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsPhaseCardsSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsPhaseNavigationSection = {
  __typename?: 'NationalCurriculumInsightsPhaseNavigationSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  overviewLabel?: Maybe<Scalars['String']['output']>;
  primaryLabel?: Maybe<Scalars['String']['output']>;
  secondaryLabel?: Maybe<Scalars['String']['output']>;
};

export type NationalCurriculumInsightsPhaseNavigationSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  overviewLabel?: InputMaybe<StringFilter>;
  primaryLabel?: InputMaybe<StringFilter>;
  secondaryLabel?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsPhaseNavigationSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  overviewLabel?: InputMaybe<SortOrder>;
  primaryLabel?: InputMaybe<SortOrder>;
  secondaryLabel?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsPromotionalHeadingSection = {
  __typename?: 'NationalCurriculumInsightsPromotionalHeadingSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
};

export type NationalCurriculumInsightsPromotionalHeadingSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  heading?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsPromotionalHeadingSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsQuoteSection = {
  __typename?: 'NationalCurriculumInsightsQuoteSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  attribution?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageWithAltText>;
  quote?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

export type NationalCurriculumInsightsQuoteSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  attribution?: InputMaybe<StringFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
  quote?: InputMaybe<StringFilter>;
  role?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsQuoteSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  attribution?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
  quote?: InputMaybe<SortOrder>;
  role?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsRichTextSection = {
  __typename?: 'NationalCurriculumInsightsRichTextSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  contentRaw?: Maybe<Scalars['JSON']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
};

export type NationalCurriculumInsightsRichTextSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  heading?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsRichTextSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsSubject = Document & {
  __typename?: 'NationalCurriculumInsightsSubject';
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
  curriculumSubjectSlugs?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  modules?: Maybe<Array<Maybe<NationalCurriculumInsightsFaqSectionOrNationalCurriculumInsightsHeroSectionOrNationalCurriculumInsightsImageTextSectionOrNationalCurriculumInsightsKeyStageCardsSectionOrNationalCurriculumInsightsNewsletterSectionOrNationalCurriculumInsightsOverviewSectionOrNationalCurriculumInsightsPhaseCardsSectionOrNationalCurriculumInsightsPromotionalHeadingSectionOrNationalCurriculumInsightsQuoteSectionOrNationalCurriculumInsightsRichTextSectionOrNationalCurriculumInsightsSubjectNavigationSectionOrNationalCurriculumInsightsTableSectionOrNationalCurriculumInsightsVideoCardsSection>>>;
  seo?: Maybe<Seo>;
  slug?: Maybe<Slug>;
  summary?: Maybe<Scalars['String']['output']>;
  tabs?: Maybe<Array<Maybe<NationalCurriculumInsightsTab>>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type NationalCurriculumInsightsSubjectFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  seo?: InputMaybe<SeoFilter>;
  slug?: InputMaybe<SlugFilter>;
  summary?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsSubjectNavigationSection = {
  __typename?: 'NationalCurriculumInsightsSubjectNavigationSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  phases?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  primaryHeading?: Maybe<Scalars['String']['output']>;
  secondaryHeading?: Maybe<Scalars['String']['output']>;
};

export type NationalCurriculumInsightsSubjectNavigationSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  primaryHeading?: InputMaybe<StringFilter>;
  secondaryHeading?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsSubjectNavigationSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  primaryHeading?: InputMaybe<SortOrder>;
  secondaryHeading?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsSubjectSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  seo?: InputMaybe<SeoSorting>;
  slug?: InputMaybe<SlugSorting>;
  summary?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsTab = {
  __typename?: 'NationalCurriculumInsightsTab';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  kind?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  /** The phase points to its own page and independently ordered content modules. */
  page?: Maybe<NationalCurriculumInsightsPage>;
};

export type NationalCurriculumInsightsTabFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  kind?: InputMaybe<StringFilter>;
  label?: InputMaybe<StringFilter>;
  page?: InputMaybe<NationalCurriculumInsightsPageFilter>;
};

export type NationalCurriculumInsightsTabSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  kind?: InputMaybe<SortOrder>;
  label?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsTableSection = {
  __typename?: 'NationalCurriculumInsightsTableSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  table?: Maybe<Table>;
};

export type NationalCurriculumInsightsTableSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  heading?: InputMaybe<StringFilter>;
  table?: InputMaybe<TableFilter>;
};

export type NationalCurriculumInsightsTableSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  table?: InputMaybe<TableSorting>;
};

export type NationalCurriculumInsightsVideoCard = {
  __typename?: 'NationalCurriculumInsightsVideoCard';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  /** Optional display value, for example 12 mins. */
  duration?: Maybe<Scalars['String']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageWithAltText>;
  videoUrl?: Maybe<Scalars['String']['output']>;
};

export type NationalCurriculumInsightsVideoCardFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringFilter>;
  duration?: InputMaybe<StringFilter>;
  heading?: InputMaybe<StringFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
  videoUrl?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsVideoCardSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  duration?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
  videoUrl?: InputMaybe<SortOrder>;
};

export type NationalCurriculumInsightsVideoCardsSection = {
  __typename?: 'NationalCurriculumInsightsVideoCardsSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  cards?: Maybe<Array<Maybe<NationalCurriculumInsightsVideoCard>>>;
  heading?: Maybe<Scalars['String']['output']>;
  introductionRaw?: Maybe<Scalars['JSON']['output']>;
};

export type NationalCurriculumInsightsVideoCardsSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  heading?: InputMaybe<StringFilter>;
};

export type NationalCurriculumInsightsVideoCardsSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
};

export type NavGroup = Document & {
  __typename?: 'NavGroup';
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
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  slug?: Maybe<Slug>;
};

export type NavGroupFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  name?: InputMaybe<StringFilter>;
  order?: InputMaybe<FloatFilter>;
  slug?: InputMaybe<SlugFilter>;
};

export type NavGroupSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  order?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SlugSorting>;
};

export type NewAboutCorePage = Document & {
  __typename?: 'NewAboutCorePage';
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
  title?: Maybe<Scalars['String']['output']>;
};

export type NewAboutCorePageFilter = {
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

export type NewAboutCorePageGetInvolved = Document & {
  __typename?: 'NewAboutCorePageGetInvolved';
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
  collaborate?: Maybe<GetInvolvedPageCollab>;
  header?: Maybe<GetInvolvedPageHeader>;
  seo?: Maybe<Seo>;
  workWithUs?: Maybe<GetInvolvedPageWorkWithUs>;
};

export type NewAboutCorePageGetInvolvedFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  collaborate?: InputMaybe<GetInvolvedPageCollabFilter>;
  header?: InputMaybe<GetInvolvedPageHeaderFilter>;
  seo?: InputMaybe<SeoFilter>;
  workWithUs?: InputMaybe<GetInvolvedPageWorkWithUsFilter>;
};

export type NewAboutCorePageGetInvolvedSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  collaborate?: InputMaybe<GetInvolvedPageCollabSorting>;
  header?: InputMaybe<GetInvolvedPageHeaderSorting>;
  seo?: InputMaybe<SeoSorting>;
  workWithUs?: InputMaybe<GetInvolvedPageWorkWithUsSorting>;
};

export type NewAboutCorePageMeetTheTeam = Document & {
  __typename?: 'NewAboutCorePageMeetTheTeam';
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
  documents2?: Maybe<MeetTheTeamPageDocuments>;
  governance2?: Maybe<MeetTheTeamPageGovernance>;
  header?: Maybe<MeetTheTeamPageHeader>;
  ourBoard?: Maybe<MeetTheTeamPageOurBoard>;
  ourLeadership?: Maybe<MeetTheTeamPageOurLeadership>;
  seo?: Maybe<Seo>;
};

export type NewAboutCorePageMeetTheTeamFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  documents2?: InputMaybe<MeetTheTeamPageDocumentsFilter>;
  governance2?: InputMaybe<MeetTheTeamPageGovernanceFilter>;
  header?: InputMaybe<MeetTheTeamPageHeaderFilter>;
  ourBoard?: InputMaybe<MeetTheTeamPageOurBoardFilter>;
  ourLeadership?: InputMaybe<MeetTheTeamPageOurLeadershipFilter>;
  seo?: InputMaybe<SeoFilter>;
};

export type NewAboutCorePageMeetTheTeamSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  documents2?: InputMaybe<MeetTheTeamPageDocumentsSorting>;
  governance2?: InputMaybe<MeetTheTeamPageGovernanceSorting>;
  header?: InputMaybe<MeetTheTeamPageHeaderSorting>;
  ourBoard?: InputMaybe<MeetTheTeamPageOurBoardSorting>;
  ourLeadership?: InputMaybe<MeetTheTeamPageOurLeadershipSorting>;
  seo?: InputMaybe<SeoSorting>;
};

export type NewAboutCorePageOaksCurricula = Document & {
  __typename?: 'NewAboutCorePageOaksCurricula';
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
  curriculumPartners?: Maybe<OaksCurriculaPageCurriculumPartnersSection>;
  guidingPrinciples?: Maybe<OaksCurriculaPageGuidingPrinciples>;
  header?: Maybe<OaksCurriculaPageHeader>;
  seo?: Maybe<Seo>;
};

export type NewAboutCorePageOaksCurriculaFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  curriculumPartners?: InputMaybe<OaksCurriculaPageCurriculumPartnersSectionFilter>;
  guidingPrinciples?: InputMaybe<OaksCurriculaPageGuidingPrinciplesFilter>;
  header?: InputMaybe<OaksCurriculaPageHeaderFilter>;
  seo?: InputMaybe<SeoFilter>;
};

export type NewAboutCorePageOaksCurriculaSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  curriculumPartners?: InputMaybe<OaksCurriculaPageCurriculumPartnersSectionSorting>;
  guidingPrinciples?: InputMaybe<OaksCurriculaPageGuidingPrinciplesSorting>;
  header?: InputMaybe<OaksCurriculaPageHeaderSorting>;
  seo?: InputMaybe<SeoSorting>;
};

export type NewAboutCorePageOaksImpact = Document & {
  __typename?: 'NewAboutCorePageOaksImpact';
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
  caseStudiesSection?: Maybe<OaksImpactPageCaseStudiesSection>;
  header?: Maybe<OaksImpactPageHeader>;
  schoolQuotes?: Maybe<OaksImpactPageSchoolQuotesSection>;
  statsSection?: Maybe<OaksImpactPageStatsSection>;
};

export type NewAboutCorePageOaksImpactFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  caseStudiesSection?: InputMaybe<OaksImpactPageCaseStudiesSectionFilter>;
  header?: InputMaybe<OaksImpactPageHeaderFilter>;
  schoolQuotes?: InputMaybe<OaksImpactPageSchoolQuotesSectionFilter>;
  statsSection?: InputMaybe<OaksImpactPageStatsSectionFilter>;
};

export type NewAboutCorePageOaksImpactSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  caseStudiesSection?: InputMaybe<OaksImpactPageCaseStudiesSectionSorting>;
  header?: InputMaybe<OaksImpactPageHeaderSorting>;
  schoolQuotes?: InputMaybe<OaksImpactPageSchoolQuotesSectionSorting>;
  statsSection?: InputMaybe<OaksImpactPageStatsSectionSorting>;
};

export type NewAboutCorePageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type NewAboutCorePageWhoWeAre = Document & {
  __typename?: 'NewAboutCorePageWhoWeAre';
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
  breakout2?: Maybe<WhoWeArePageBreakout>;
  header2?: Maybe<WhoWeArePageHeader>;
  seo?: Maybe<Seo>;
  timeline2?: Maybe<WhoWeArePageTimeline>;
  weAreCards?: Maybe<WhoWeArePageCards>;
};

export type NewAboutCorePageWhoWeAreFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  breakout2?: InputMaybe<WhoWeArePageBreakoutFilter>;
  header2?: InputMaybe<WhoWeArePageHeaderFilter>;
  seo?: InputMaybe<SeoFilter>;
  timeline2?: InputMaybe<WhoWeArePageTimelineFilter>;
  weAreCards?: InputMaybe<WhoWeArePageCardsFilter>;
};

export type NewAboutCorePageWhoWeAreSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  breakout2?: InputMaybe<WhoWeArePageBreakoutSorting>;
  header2?: InputMaybe<WhoWeArePageHeaderSorting>;
  seo?: InputMaybe<SeoSorting>;
  timeline2?: InputMaybe<WhoWeArePageTimelineSorting>;
  weAreCards?: InputMaybe<WhoWeArePageCardsSorting>;
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

export type NewsletterSignUp = {
  __typename?: 'NewsletterSignUp';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  bodyRaw?: Maybe<Scalars['JSON']['output']>;
  buttonCta?: Maybe<Scalars['String']['output']>;
  /** Whether to show the role for this form. Defaults to false */
  enableRole?: Maybe<Scalars['Boolean']['output']>;
  /** The ID of the hubspot form to be used for newsletter sign-up. */
  formId?: Maybe<Scalars['String']['output']>;
  /** Whether to use free text input for school instead of the school picker. Defaults to false */
  freeSchoolInput?: Maybe<Scalars['Boolean']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
};

export type NewsletterSignUpFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  buttonCta?: InputMaybe<StringFilter>;
  enableRole?: InputMaybe<BooleanFilter>;
  formId?: InputMaybe<StringFilter>;
  freeSchoolInput?: InputMaybe<BooleanFilter>;
  heading?: InputMaybe<StringFilter>;
};

export type NewsletterSignUpSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  buttonCta?: InputMaybe<SortOrder>;
  enableRole?: InputMaybe<SortOrder>;
  formId?: InputMaybe<SortOrder>;
  freeSchoolInput?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
};

export type Notice = {
  __typename?: 'Notice';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
};

export type NoticeFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  color?: InputMaybe<StringFilter>;
  icon?: InputMaybe<StringFilter>;
  text?: InputMaybe<StringFilter>;
};

export type NoticeSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  color?: InputMaybe<SortOrder>;
  icon?: InputMaybe<SortOrder>;
  text?: InputMaybe<SortOrder>;
};

export type OaksCurriculaPageCurriculumPartnersSection = {
  __typename?: 'OaksCurriculaPageCurriculumPartnersSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  current?: Maybe<OaksCurriculaPagePartnerSection>;
  legacy?: Maybe<OaksCurriculaPagePartnerSection>;
  textRaw?: Maybe<Scalars['JSON']['output']>;
};

export type OaksCurriculaPageCurriculumPartnersSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  current?: InputMaybe<OaksCurriculaPagePartnerSectionFilter>;
  legacy?: InputMaybe<OaksCurriculaPagePartnerSectionFilter>;
};

export type OaksCurriculaPageCurriculumPartnersSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  current?: InputMaybe<OaksCurriculaPagePartnerSectionSorting>;
  legacy?: InputMaybe<OaksCurriculaPagePartnerSectionSorting>;
};

export type OaksCurriculaPageGuidingPrinciple = {
  __typename?: 'OaksCurriculaPageGuidingPrinciple';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  text2Raw?: Maybe<Scalars['JSON']['output']>;
};

export type OaksCurriculaPageGuidingPrincipleFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  heading?: InputMaybe<StringFilter>;
};

export type OaksCurriculaPageGuidingPrincipleSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
};

export type OaksCurriculaPageGuidingPrinciples = {
  __typename?: 'OaksCurriculaPageGuidingPrinciples';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageWithAltText>;
  principles?: Maybe<Array<Maybe<OaksCurriculaPageGuidingPrinciple>>>;
  textRaw?: Maybe<Scalars['JSON']['output']>;
};

export type OaksCurriculaPageGuidingPrinciplesFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
};

export type OaksCurriculaPageGuidingPrinciplesSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
};

export type OaksCurriculaPageHeader = {
  __typename?: 'OaksCurriculaPageHeader';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageWithAltText>;
  introText?: Maybe<Scalars['String']['output']>;
};

export type OaksCurriculaPageHeaderFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
  introText?: InputMaybe<StringFilter>;
};

export type OaksCurriculaPageHeaderSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
  introText?: InputMaybe<SortOrder>;
};

export type OaksCurriculaPagePartner = {
  __typename?: 'OaksCurriculaPagePartner';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<ImageWithAltText>;
};

export type OaksCurriculaPagePartnerFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  logo?: InputMaybe<ImageWithAltTextFilter>;
};

export type OaksCurriculaPagePartnerSection = {
  __typename?: 'OaksCurriculaPagePartnerSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  partners?: Maybe<Array<Maybe<OaksCurriculaPagePartner>>>;
  textRaw?: Maybe<Scalars['JSON']['output']>;
};

export type OaksCurriculaPagePartnerSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type OaksCurriculaPagePartnerSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type OaksCurriculaPagePartnerSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  logo?: InputMaybe<ImageWithAltTextSorting>;
};

export type OaksImpactPageCaseStudiesSection = {
  __typename?: 'OaksImpactPageCaseStudiesSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  caseStudies?: Maybe<Array<Maybe<CaseStudy>>>;
};

export type OaksImpactPageCaseStudiesSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type OaksImpactPageCaseStudiesSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type OaksImpactPageHeader = {
  __typename?: 'OaksImpactPageHeader';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  introText?: Maybe<Scalars['String']['output']>;
  transcript?: Maybe<Scalars['String']['output']>;
  video?: Maybe<Video>;
  videoDescription?: Maybe<Scalars['String']['output']>;
};

export type OaksImpactPageHeaderFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  introText?: InputMaybe<StringFilter>;
  transcript?: InputMaybe<StringFilter>;
  video?: InputMaybe<VideoFilter>;
  videoDescription?: InputMaybe<StringFilter>;
};

export type OaksImpactPageHeaderSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  introText?: InputMaybe<SortOrder>;
  transcript?: InputMaybe<SortOrder>;
  videoDescription?: InputMaybe<SortOrder>;
};

export type OaksImpactPageSchoolQuote = {
  __typename?: 'OaksImpactPageSchoolQuote';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  attribution?: Maybe<Scalars['String']['output']>;
  organisation?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  /** Quotation marks will be added automatically */
  text?: Maybe<Scalars['String']['output']>;
};

export type OaksImpactPageSchoolQuoteCard = {
  __typename?: 'OaksImpactPageSchoolQuoteCard';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  headshot?: Maybe<ImageWithAltText>;
  logo?: Maybe<ImageWithAltText>;
  quote?: Maybe<OaksImpactPageSchoolQuote>;
  summary?: Maybe<Scalars['String']['output']>;
};

export type OaksImpactPageSchoolQuoteCardFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  headshot?: InputMaybe<ImageWithAltTextFilter>;
  logo?: InputMaybe<ImageWithAltTextFilter>;
  quote?: InputMaybe<OaksImpactPageSchoolQuoteFilter>;
  summary?: InputMaybe<StringFilter>;
};

export type OaksImpactPageSchoolQuoteCardSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  headshot?: InputMaybe<ImageWithAltTextSorting>;
  logo?: InputMaybe<ImageWithAltTextSorting>;
  quote?: InputMaybe<OaksImpactPageSchoolQuoteSorting>;
  summary?: InputMaybe<SortOrder>;
};

export type OaksImpactPageSchoolQuoteFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  attribution?: InputMaybe<StringFilter>;
  organisation?: InputMaybe<StringFilter>;
  role?: InputMaybe<StringFilter>;
  text?: InputMaybe<StringFilter>;
};

export type OaksImpactPageSchoolQuoteSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  attribution?: InputMaybe<SortOrder>;
  organisation?: InputMaybe<SortOrder>;
  role?: InputMaybe<SortOrder>;
  text?: InputMaybe<SortOrder>;
};

export type OaksImpactPageSchoolQuotesSection = {
  __typename?: 'OaksImpactPageSchoolQuotesSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  cards?: Maybe<Array<Maybe<OaksImpactPageSchoolQuoteCard>>>;
  heading?: Maybe<Scalars['String']['output']>;
};

export type OaksImpactPageSchoolQuotesSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  heading?: InputMaybe<StringFilter>;
};

export type OaksImpactPageSchoolQuotesSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
};

export type OaksImpactPageStat = {
  __typename?: 'OaksImpactPageStat';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<ImageWithAltTextAndDarkMode>;
  textRaw?: Maybe<Scalars['JSON']['output']>;
};

export type OaksImpactPageStatFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  heading?: InputMaybe<StringFilter>;
  icon?: InputMaybe<ImageWithAltTextAndDarkModeFilter>;
};

export type OaksImpactPageStatSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  icon?: InputMaybe<ImageWithAltTextAndDarkModeSorting>;
};

export type OaksImpactPageStatsSection = {
  __typename?: 'OaksImpactPageStatsSection';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  stats?: Maybe<Array<Maybe<OaksImpactPageStat>>>;
  textBlock?: Maybe<TextBlock>;
};

export type OaksImpactPageStatsSectionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  textBlock?: InputMaybe<TextBlockFilter>;
};

export type OaksImpactPageStatsSectionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  textBlock?: InputMaybe<TextBlockSorting>;
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

export type ProgrammePage = Document & {
  __typename?: 'ProgrammePage';
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
  bodyCopy?: Maybe<Scalars['String']['output']>;
  bullets?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  phase?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Slug>;
  subject?: Maybe<Scalars['String']['output']>;
};

export type ProgrammePageFilter = {
  /** Apply filters on document level */
  _?: InputMaybe<Sanity_DocumentFilter>;
  _createdAt?: InputMaybe<DatetimeFilter>;
  _id?: InputMaybe<IdFilter>;
  _key?: InputMaybe<StringFilter>;
  _rev?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  _updatedAt?: InputMaybe<DatetimeFilter>;
  bodyCopy?: InputMaybe<StringFilter>;
  phase?: InputMaybe<StringFilter>;
  slug?: InputMaybe<SlugFilter>;
  subject?: InputMaybe<StringFilter>;
};

export type ProgrammePageSorting = {
  _createdAt?: InputMaybe<SortOrder>;
  _id?: InputMaybe<SortOrder>;
  _key?: InputMaybe<SortOrder>;
  _rev?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  _updatedAt?: InputMaybe<SortOrder>;
  bodyCopy?: InputMaybe<SortOrder>;
  phase?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SlugSorting>;
  subject?: InputMaybe<SortOrder>;
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
  ApiContentPage?: Maybe<ApiContentPage>;
  AssistInstructionContext?: Maybe<AssistInstructionContext>;
  Attachment?: Maybe<Attachment>;
  BlogWebinarCategory?: Maybe<BlogWebinarCategory>;
  BrandAsset?: Maybe<BrandAsset>;
  CampaignPage?: Maybe<CampaignPage>;
  CaseStudy?: Maybe<CaseStudy>;
  ContactCorePage?: Maybe<ContactCorePage>;
  CurriculumApiLandingPage?: Maybe<CurriculumApiLandingPage>;
  CurriculumCorePage?: Maybe<CurriculumCorePage>;
  CurriculumExplainer?: Maybe<CurriculumExplainer>;
  CurriculumInfoPageOverview?: Maybe<CurriculumInfoPageOverview>;
  CurriculumPartner?: Maybe<CurriculumPartner>;
  Document?: Maybe<Document>;
  Homepage?: Maybe<Homepage>;
  Illustration?: Maybe<Illustration>;
  LandingPage?: Maybe<LandingPage>;
  MuxVideoAsset?: Maybe<MuxVideoAsset>;
  NationalCurriculumInsightsHub?: Maybe<NationalCurriculumInsightsHub>;
  NationalCurriculumInsightsKeyStagePage?: Maybe<NationalCurriculumInsightsKeyStagePage>;
  NationalCurriculumInsightsPage?: Maybe<NationalCurriculumInsightsPage>;
  NationalCurriculumInsightsSubject?: Maybe<NationalCurriculumInsightsSubject>;
  NavGroup?: Maybe<NavGroup>;
  NewAboutCorePage?: Maybe<NewAboutCorePage>;
  NewAboutCorePageGetInvolved?: Maybe<NewAboutCorePageGetInvolved>;
  NewAboutCorePageMeetTheTeam?: Maybe<NewAboutCorePageMeetTheTeam>;
  NewAboutCorePageOaksCurricula?: Maybe<NewAboutCorePageOaksCurricula>;
  NewAboutCorePageOaksImpact?: Maybe<NewAboutCorePageOaksImpact>;
  NewAboutCorePageWhoWeAre?: Maybe<NewAboutCorePageWhoWeAre>;
  NewsListingPage?: Maybe<NewsListingPage>;
  NewsPost?: Maybe<NewsPost>;
  PlanALessonCorePage?: Maybe<PlanALessonCorePage>;
  PlanALessonPageContent?: Maybe<PlanALessonPageContent>;
  PlanningCorePage?: Maybe<PlanningCorePage>;
  PolicyPage?: Maybe<PolicyPage>;
  ProgrammePage?: Maybe<ProgrammePage>;
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
  allApiContentPage: Array<ApiContentPage>;
  allAssistInstructionContext: Array<AssistInstructionContext>;
  allAttachment: Array<Attachment>;
  allBlogWebinarCategory: Array<BlogWebinarCategory>;
  allBrandAsset: Array<BrandAsset>;
  allCampaignPage: Array<CampaignPage>;
  allCaseStudy: Array<CaseStudy>;
  allContactCorePage: Array<ContactCorePage>;
  allCurriculumApiLandingPage: Array<CurriculumApiLandingPage>;
  allCurriculumCorePage: Array<CurriculumCorePage>;
  allCurriculumExplainer: Array<CurriculumExplainer>;
  allCurriculumInfoPageOverview: Array<CurriculumInfoPageOverview>;
  allCurriculumPartner: Array<CurriculumPartner>;
  allDocument: Array<Document>;
  allHomepage: Array<Homepage>;
  allIllustration: Array<Illustration>;
  allLandingPage: Array<LandingPage>;
  allMuxVideoAsset: Array<MuxVideoAsset>;
  allNationalCurriculumInsightsHub: Array<NationalCurriculumInsightsHub>;
  allNationalCurriculumInsightsKeyStagePage: Array<NationalCurriculumInsightsKeyStagePage>;
  allNationalCurriculumInsightsPage: Array<NationalCurriculumInsightsPage>;
  allNationalCurriculumInsightsSubject: Array<NationalCurriculumInsightsSubject>;
  allNavGroup: Array<NavGroup>;
  allNewAboutCorePage: Array<NewAboutCorePage>;
  allNewAboutCorePageGetInvolved: Array<NewAboutCorePageGetInvolved>;
  allNewAboutCorePageMeetTheTeam: Array<NewAboutCorePageMeetTheTeam>;
  allNewAboutCorePageOaksCurricula: Array<NewAboutCorePageOaksCurricula>;
  allNewAboutCorePageOaksImpact: Array<NewAboutCorePageOaksImpact>;
  allNewAboutCorePageWhoWeAre: Array<NewAboutCorePageWhoWeAre>;
  allNewsListingPage: Array<NewsListingPage>;
  allNewsPost: Array<NewsPost>;
  allPlanALessonCorePage: Array<PlanALessonCorePage>;
  allPlanALessonPageContent: Array<PlanALessonPageContent>;
  allPlanningCorePage: Array<PlanningCorePage>;
  allPolicyPage: Array<PolicyPage>;
  allProgrammePage: Array<ProgrammePage>;
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


export type RootQueryApiContentPageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryAssistInstructionContextArgs = {
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


export type RootQueryCampaignPageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryCaseStudyArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryContactCorePageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryCurriculumApiLandingPageArgs = {
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


export type RootQueryMuxVideoAssetArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryNationalCurriculumInsightsHubArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryNationalCurriculumInsightsKeyStagePageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryNationalCurriculumInsightsPageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryNationalCurriculumInsightsSubjectArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryNavGroupArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryNewAboutCorePageArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryNewAboutCorePageGetInvolvedArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryNewAboutCorePageMeetTheTeamArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryNewAboutCorePageOaksCurriculaArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryNewAboutCorePageOaksImpactArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryNewAboutCorePageWhoWeAreArgs = {
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


export type RootQueryProgrammePageArgs = {
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


export type RootQueryAllApiContentPageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ApiContentPageSorting>>;
  where?: InputMaybe<ApiContentPageFilter>;
};


export type RootQueryAllAssistInstructionContextArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<AssistInstructionContextSorting>>;
  where?: InputMaybe<AssistInstructionContextFilter>;
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


export type RootQueryAllCampaignPageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CampaignPageSorting>>;
  where?: InputMaybe<CampaignPageFilter>;
};


export type RootQueryAllCaseStudyArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CaseStudySorting>>;
  where?: InputMaybe<CaseStudyFilter>;
};


export type RootQueryAllContactCorePageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ContactCorePageSorting>>;
  where?: InputMaybe<ContactCorePageFilter>;
};


export type RootQueryAllCurriculumApiLandingPageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<CurriculumApiLandingPageSorting>>;
  where?: InputMaybe<CurriculumApiLandingPageFilter>;
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


export type RootQueryAllMuxVideoAssetArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<MuxVideoAssetSorting>>;
  where?: InputMaybe<MuxVideoAssetFilter>;
};


export type RootQueryAllNationalCurriculumInsightsHubArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<NationalCurriculumInsightsHubSorting>>;
  where?: InputMaybe<NationalCurriculumInsightsHubFilter>;
};


export type RootQueryAllNationalCurriculumInsightsKeyStagePageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<NationalCurriculumInsightsKeyStagePageSorting>>;
  where?: InputMaybe<NationalCurriculumInsightsKeyStagePageFilter>;
};


export type RootQueryAllNationalCurriculumInsightsPageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<NationalCurriculumInsightsPageSorting>>;
  where?: InputMaybe<NationalCurriculumInsightsPageFilter>;
};


export type RootQueryAllNationalCurriculumInsightsSubjectArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<NationalCurriculumInsightsSubjectSorting>>;
  where?: InputMaybe<NationalCurriculumInsightsSubjectFilter>;
};


export type RootQueryAllNavGroupArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<NavGroupSorting>>;
  where?: InputMaybe<NavGroupFilter>;
};


export type RootQueryAllNewAboutCorePageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<NewAboutCorePageSorting>>;
  where?: InputMaybe<NewAboutCorePageFilter>;
};


export type RootQueryAllNewAboutCorePageGetInvolvedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<NewAboutCorePageGetInvolvedSorting>>;
  where?: InputMaybe<NewAboutCorePageGetInvolvedFilter>;
};


export type RootQueryAllNewAboutCorePageMeetTheTeamArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<NewAboutCorePageMeetTheTeamSorting>>;
  where?: InputMaybe<NewAboutCorePageMeetTheTeamFilter>;
};


export type RootQueryAllNewAboutCorePageOaksCurriculaArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<NewAboutCorePageOaksCurriculaSorting>>;
  where?: InputMaybe<NewAboutCorePageOaksCurriculaFilter>;
};


export type RootQueryAllNewAboutCorePageOaksImpactArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<NewAboutCorePageOaksImpactSorting>>;
  where?: InputMaybe<NewAboutCorePageOaksImpactFilter>;
};


export type RootQueryAllNewAboutCorePageWhoWeAreArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<NewAboutCorePageWhoWeAreSorting>>;
  where?: InputMaybe<NewAboutCorePageWhoWeAreFilter>;
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


export type RootQueryAllProgrammePageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<ProgrammePageSorting>>;
  where?: InputMaybe<ProgrammePageFilter>;
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

export type SanityAssistInstruction = {
  __typename?: 'SanityAssistInstruction';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  createdById?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  output?: Maybe<Array<Maybe<SanityAssistOutputFieldOrSanityAssistOutputType>>>;
  promptRaw?: Maybe<Scalars['JSON']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type SanityAssistInstructionContext = {
  __typename?: 'SanityAssistInstructionContext';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  /** The referenced context will be inserted into the instruction */
  reference?: Maybe<AssistInstructionContext>;
};

export type SanityAssistInstructionContextFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  reference?: InputMaybe<AssistInstructionContextFilter>;
};

export type SanityAssistInstructionContextSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type SanityAssistInstructionFieldRef = {
  __typename?: 'SanityAssistInstructionFieldRef';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Scalars['String']['output']>;
};

export type SanityAssistInstructionFieldRefFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  path?: InputMaybe<StringFilter>;
};

export type SanityAssistInstructionFieldRefSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  path?: InputMaybe<SortOrder>;
};

export type SanityAssistInstructionFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  createdById?: InputMaybe<StringFilter>;
  icon?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
  userId?: InputMaybe<StringFilter>;
};

export type SanityAssistInstructionSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  createdById?: InputMaybe<SortOrder>;
  icon?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  userId?: InputMaybe<SortOrder>;
};

export type SanityAssistInstructionTask = {
  __typename?: 'SanityAssistInstructionTask';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  info?: Maybe<Scalars['String']['output']>;
  instructionKey?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  started?: Maybe<Scalars['DateTime']['output']>;
  updated?: Maybe<Scalars['DateTime']['output']>;
};

export type SanityAssistInstructionTaskFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  info?: InputMaybe<StringFilter>;
  instructionKey?: InputMaybe<StringFilter>;
  path?: InputMaybe<StringFilter>;
  started?: InputMaybe<DatetimeFilter>;
  updated?: InputMaybe<DatetimeFilter>;
};

export type SanityAssistInstructionTaskSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  info?: InputMaybe<SortOrder>;
  instructionKey?: InputMaybe<SortOrder>;
  path?: InputMaybe<SortOrder>;
  started?: InputMaybe<SortOrder>;
  updated?: InputMaybe<SortOrder>;
};

export type SanityAssistInstructionUserInput = {
  __typename?: 'SanityAssistInstructionUserInput';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  /** The description above the user input text field */
  description?: Maybe<Scalars['String']['output']>;
  /** The header above the user input text field */
  message?: Maybe<Scalars['String']['output']>;
};

export type SanityAssistInstructionUserInputFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringFilter>;
  message?: InputMaybe<StringFilter>;
};

export type SanityAssistInstructionUserInputSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  message?: InputMaybe<SortOrder>;
};

export type SanityAssistOutputField = {
  __typename?: 'SanityAssistOutputField';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Scalars['String']['output']>;
};

export type SanityAssistOutputFieldFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  path?: InputMaybe<StringFilter>;
};

export type SanityAssistOutputFieldOrSanityAssistOutputType = SanityAssistOutputField | SanityAssistOutputType;

export type SanityAssistOutputFieldSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  path?: InputMaybe<SortOrder>;
};

export type SanityAssistOutputType = {
  __typename?: 'SanityAssistOutputType';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type SanityAssistOutputTypeFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  type?: InputMaybe<StringFilter>;
};

export type SanityAssistOutputTypeSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  type?: InputMaybe<SortOrder>;
};

export type SanityAssistSchemaTypeAnnotations = {
  __typename?: 'SanityAssistSchemaTypeAnnotations';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  fields?: Maybe<Array<Maybe<SanityAssistSchemaTypeField>>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type SanityAssistSchemaTypeAnnotationsFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
};

export type SanityAssistSchemaTypeAnnotationsSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
};

export type SanityAssistSchemaTypeField = {
  __typename?: 'SanityAssistSchemaTypeField';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  instructions?: Maybe<Array<Maybe<SanityAssistInstruction>>>;
  path?: Maybe<Scalars['String']['output']>;
};

export type SanityAssistSchemaTypeFieldFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  path?: InputMaybe<StringFilter>;
};

export type SanityAssistSchemaTypeFieldSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  path?: InputMaybe<SortOrder>;
};

export type SanityAssistTaskStatus = {
  __typename?: 'SanityAssistTaskStatus';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  tasks?: Maybe<Array<Maybe<SanityAssistInstructionTask>>>;
};

export type SanityAssistTaskStatusFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type SanityAssistTaskStatusSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
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
  uploadId?: Maybe<Scalars['String']['output']>;
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
  uploadId?: InputMaybe<StringFilter>;
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
  uploadId?: InputMaybe<SortOrder>;
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

export type Table = {
  __typename?: 'Table';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  rows?: Maybe<Array<Maybe<TableRow>>>;
};

export type TableFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type TableRow = {
  __typename?: 'TableRow';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  cells?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type TableRowFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type TableRowSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type TableSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
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

export type TextBlockWithHighlight = {
  __typename?: 'TextBlockWithHighlight';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  children?: Maybe<Array<Maybe<Span>>>;
  level?: Maybe<Scalars['Float']['output']>;
  listItem?: Maybe<Scalars['String']['output']>;
  style?: Maybe<Scalars['String']['output']>;
};

export type TextBlockWithHighlightFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  level?: InputMaybe<FloatFilter>;
  listItem?: InputMaybe<StringFilter>;
  style?: InputMaybe<StringFilter>;
};

export type TextBlockWithHighlightSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  level?: InputMaybe<SortOrder>;
  listItem?: InputMaybe<SortOrder>;
  style?: InputMaybe<SortOrder>;
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

export type WhoWeArePageBreakout = {
  __typename?: 'WhoWeArePageBreakout';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageWithAltText>;
  text?: Maybe<Scalars['String']['output']>;
};

export type WhoWeArePageBreakoutFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
  text?: InputMaybe<StringFilter>;
};

export type WhoWeArePageBreakoutSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
  text?: InputMaybe<SortOrder>;
};

export type WhoWeArePageCard = {
  __typename?: 'WhoWeArePageCard';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageWithAltText>;
  textRaw?: Maybe<Scalars['JSON']['output']>;
};

export type WhoWeArePageCardFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  heading?: InputMaybe<StringFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
};

export type WhoWeArePageCardSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
};

export type WhoWeArePageCards = {
  __typename?: 'WhoWeArePageCards';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  cards?: Maybe<Array<Maybe<WhoWeArePageCard>>>;
};

export type WhoWeArePageCardsFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type WhoWeArePageCardsSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

export type WhoWeArePageHeader = {
  __typename?: 'WhoWeArePageHeader';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  image?: Maybe<ImageWithAltText>;
  introText?: Maybe<Scalars['String']['output']>;
};

export type WhoWeArePageHeaderFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  image?: InputMaybe<ImageWithAltTextFilter>;
  introText?: InputMaybe<StringFilter>;
};

export type WhoWeArePageHeaderSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  image?: InputMaybe<ImageWithAltTextSorting>;
  introText?: InputMaybe<SortOrder>;
};

export type WhoWeArePageTimeline = {
  __typename?: 'WhoWeArePageTimeline';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  timelineItems?: Maybe<Array<Maybe<WhoWeArePageTimelineItem>>>;
};

export type WhoWeArePageTimelineFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
};

export type WhoWeArePageTimelineItem = {
  __typename?: 'WhoWeArePageTimelineItem';
  _key?: Maybe<Scalars['String']['output']>;
  _type?: Maybe<Scalars['String']['output']>;
  heading?: Maybe<Scalars['String']['output']>;
  subHeading?: Maybe<Scalars['String']['output']>;
  textRaw?: Maybe<Scalars['JSON']['output']>;
};

export type WhoWeArePageTimelineItemFilter = {
  _key?: InputMaybe<StringFilter>;
  _type?: InputMaybe<StringFilter>;
  heading?: InputMaybe<StringFilter>;
  subHeading?: InputMaybe<StringFilter>;
};

export type WhoWeArePageTimelineItemSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
  heading?: InputMaybe<SortOrder>;
  subHeading?: InputMaybe<SortOrder>;
};

export type WhoWeArePageTimelineSorting = {
  _key?: InputMaybe<SortOrder>;
  _type?: InputMaybe<SortOrder>;
};

type NationalCurriculumInsightsModules_NationalCurriculumInsightsFaqSection_Fragment = { __typename: 'NationalCurriculumInsightsFaqSection', heading?: string | null, items?: Array<{ __typename?: 'NationalCurriculumInsightsFaqItem', question?: string | null, initiallyExpanded?: boolean | null, answerPortableText?: any | null } | null> | null };

type NationalCurriculumInsightsModules_NationalCurriculumInsightsHeroSection_Fragment = { __typename: 'NationalCurriculumInsightsHeroSection', heading?: string | null, authorName?: string | null, authorRole?: string | null, statusMessage?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, authorImage?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null };

type NationalCurriculumInsightsModules_NationalCurriculumInsightsImageTextSection_Fragment = { __typename: 'NationalCurriculumInsightsImageTextSection', heading?: string | null, imagePosition?: string | null, background?: string | null, ctaLabel?: string | null, ctaHref?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null };

type NationalCurriculumInsightsModules_NationalCurriculumInsightsKeyStageCardsSection_Fragment = { __typename: 'NationalCurriculumInsightsKeyStageCardsSection', cards?: Array<{ __typename?: 'NationalCurriculumInsightsKeyStageCard', keyStage?: string | null, heading?: string | null, linkLabel?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | null> | null };

type NationalCurriculumInsightsModules_NationalCurriculumInsightsNewsletterSection_Fragment = { __typename: 'NationalCurriculumInsightsNewsletterSection', heading?: string | null, introduction?: string | null, benefits?: Array<string | null> | null, formId?: string | null, buttonLabel?: string | null, privacyPortableText?: any | null, illustration?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null };

type NationalCurriculumInsightsModules_NationalCurriculumInsightsOverviewSection_Fragment = { __typename: 'NationalCurriculumInsightsOverviewSection', heading?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null };

type NationalCurriculumInsightsModules_NationalCurriculumInsightsPhaseCardsSection_Fragment = { __typename: 'NationalCurriculumInsightsPhaseCardsSection', cards?: Array<{ __typename?: 'NationalCurriculumInsightsPhaseCard', phase?: string | null, heading?: string | null, linkLabel?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | null> | null };

type NationalCurriculumInsightsModules_NationalCurriculumInsightsPromotionalHeadingSection_Fragment = { __typename: 'NationalCurriculumInsightsPromotionalHeadingSection', heading?: string | null };

type NationalCurriculumInsightsModules_NationalCurriculumInsightsQuoteSection_Fragment = { __typename: 'NationalCurriculumInsightsQuoteSection', quote?: string | null, attribution?: string | null, role?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null };

type NationalCurriculumInsightsModules_NationalCurriculumInsightsRichTextSection_Fragment = { __typename: 'NationalCurriculumInsightsRichTextSection', heading?: string | null, contentPortableText?: any | null };

type NationalCurriculumInsightsModules_NationalCurriculumInsightsSubjectNavigationSection_Fragment = { __typename: 'NationalCurriculumInsightsSubjectNavigationSection', phases?: Array<string | null> | null, primaryHeading?: string | null, secondaryHeading?: string | null };

type NationalCurriculumInsightsModules_NationalCurriculumInsightsTableSection_Fragment = { __typename: 'NationalCurriculumInsightsTableSection', heading?: string | null, table?: { __typename?: 'Table', rows?: Array<{ __typename?: 'TableRow', cells?: Array<string | null> | null } | null> | null } | null };

type NationalCurriculumInsightsModules_NationalCurriculumInsightsVideoCardsSection_Fragment = { __typename: 'NationalCurriculumInsightsVideoCardsSection', heading?: string | null, introductionPortableText?: any | null, cards?: Array<{ __typename?: 'NationalCurriculumInsightsVideoCard', heading?: string | null, description?: string | null, videoUrl?: string | null, duration?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | null> | null };

export type NationalCurriculumInsightsModulesFragment = NationalCurriculumInsightsModules_NationalCurriculumInsightsFaqSection_Fragment | NationalCurriculumInsightsModules_NationalCurriculumInsightsHeroSection_Fragment | NationalCurriculumInsightsModules_NationalCurriculumInsightsImageTextSection_Fragment | NationalCurriculumInsightsModules_NationalCurriculumInsightsKeyStageCardsSection_Fragment | NationalCurriculumInsightsModules_NationalCurriculumInsightsNewsletterSection_Fragment | NationalCurriculumInsightsModules_NationalCurriculumInsightsOverviewSection_Fragment | NationalCurriculumInsightsModules_NationalCurriculumInsightsPhaseCardsSection_Fragment | NationalCurriculumInsightsModules_NationalCurriculumInsightsPromotionalHeadingSection_Fragment | NationalCurriculumInsightsModules_NationalCurriculumInsightsQuoteSection_Fragment | NationalCurriculumInsightsModules_NationalCurriculumInsightsRichTextSection_Fragment | NationalCurriculumInsightsModules_NationalCurriculumInsightsSubjectNavigationSection_Fragment | NationalCurriculumInsightsModules_NationalCurriculumInsightsTableSection_Fragment | NationalCurriculumInsightsModules_NationalCurriculumInsightsVideoCardsSection_Fragment;

export type NationalCurriculumInsightsHubQueryVariables = Exact<{
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type NationalCurriculumInsightsHubQuery = { __typename?: 'RootQuery', allNationalCurriculumInsightsHub: Array<{ __typename?: 'NationalCurriculumInsightsHub', title?: string | null, summary?: string | null, id?: string | null, subjects?: Array<{ __typename?: 'NationalCurriculumInsightsSubject', title?: string | null, curriculumSubjectSlugs?: Array<string | null> | null, id?: string | null, slug?: { __typename?: 'Slug', current?: string | null } | null, tabs?: Array<{ __typename?: 'NationalCurriculumInsightsTab', kind?: string | null, label?: string | null, page?: { __typename?: 'NationalCurriculumInsightsPage', pageType?: string | null, title?: string | null, id?: string | null } | null } | null> | null } | null> | null, modules?: Array<{ __typename: 'NationalCurriculumInsightsFaqSection', heading?: string | null, items?: Array<{ __typename?: 'NationalCurriculumInsightsFaqItem', question?: string | null, initiallyExpanded?: boolean | null, answerPortableText?: any | null } | null> | null } | { __typename: 'NationalCurriculumInsightsHeroSection', heading?: string | null, authorName?: string | null, authorRole?: string | null, statusMessage?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, authorImage?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsImageTextSection', heading?: string | null, imagePosition?: string | null, background?: string | null, ctaLabel?: string | null, ctaHref?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsKeyStageCardsSection', cards?: Array<{ __typename?: 'NationalCurriculumInsightsKeyStageCard', keyStage?: string | null, heading?: string | null, linkLabel?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | null> | null } | { __typename: 'NationalCurriculumInsightsNewsletterSection', heading?: string | null, introduction?: string | null, benefits?: Array<string | null> | null, formId?: string | null, buttonLabel?: string | null, privacyPortableText?: any | null, illustration?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsOverviewSection', heading?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsPhaseCardsSection', cards?: Array<{ __typename?: 'NationalCurriculumInsightsPhaseCard', phase?: string | null, heading?: string | null, linkLabel?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | null> | null } | { __typename: 'NationalCurriculumInsightsPromotionalHeadingSection', heading?: string | null } | { __typename: 'NationalCurriculumInsightsQuoteSection', quote?: string | null, attribution?: string | null, role?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsRichTextSection', heading?: string | null, contentPortableText?: any | null } | { __typename: 'NationalCurriculumInsightsSubjectNavigationSection', phases?: Array<string | null> | null, primaryHeading?: string | null, secondaryHeading?: string | null } | { __typename: 'NationalCurriculumInsightsTableSection', heading?: string | null, table?: { __typename?: 'Table', rows?: Array<{ __typename?: 'TableRow', cells?: Array<string | null> | null } | null> | null } | null } | { __typename: 'NationalCurriculumInsightsVideoCardsSection', heading?: string | null, introductionPortableText?: any | null, cards?: Array<{ __typename?: 'NationalCurriculumInsightsVideoCard', heading?: string | null, description?: string | null, videoUrl?: string | null, duration?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | null> | null } | null> | null }> };

export type NationalCurriculumInsightsSubjectBySlugQueryVariables = Exact<{
  subjectSlug?: InputMaybe<Scalars['String']['input']>;
  isDraftFilter?: InputMaybe<Sanity_DocumentFilter>;
}>;


export type NationalCurriculumInsightsSubjectBySlugQuery = { __typename?: 'RootQuery', allNationalCurriculumInsightsSubject: Array<{ __typename?: 'NationalCurriculumInsightsSubject', title?: string | null, summary?: string | null, curriculumSubjectSlugs?: Array<string | null> | null, id?: string | null, modules?: Array<{ __typename: 'NationalCurriculumInsightsFaqSection', heading?: string | null, items?: Array<{ __typename?: 'NationalCurriculumInsightsFaqItem', question?: string | null, initiallyExpanded?: boolean | null, answerPortableText?: any | null } | null> | null } | { __typename: 'NationalCurriculumInsightsHeroSection', heading?: string | null, authorName?: string | null, authorRole?: string | null, statusMessage?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, authorImage?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsImageTextSection', heading?: string | null, imagePosition?: string | null, background?: string | null, ctaLabel?: string | null, ctaHref?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsKeyStageCardsSection', cards?: Array<{ __typename?: 'NationalCurriculumInsightsKeyStageCard', keyStage?: string | null, heading?: string | null, linkLabel?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | null> | null } | { __typename: 'NationalCurriculumInsightsNewsletterSection', heading?: string | null, introduction?: string | null, benefits?: Array<string | null> | null, formId?: string | null, buttonLabel?: string | null, privacyPortableText?: any | null, illustration?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsOverviewSection', heading?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsPhaseCardsSection', cards?: Array<{ __typename?: 'NationalCurriculumInsightsPhaseCard', phase?: string | null, heading?: string | null, linkLabel?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | null> | null } | { __typename: 'NationalCurriculumInsightsPromotionalHeadingSection', heading?: string | null } | { __typename: 'NationalCurriculumInsightsQuoteSection', quote?: string | null, attribution?: string | null, role?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsRichTextSection', heading?: string | null, contentPortableText?: any | null } | { __typename: 'NationalCurriculumInsightsSubjectNavigationSection', phases?: Array<string | null> | null, primaryHeading?: string | null, secondaryHeading?: string | null } | { __typename: 'NationalCurriculumInsightsTableSection', heading?: string | null, table?: { __typename?: 'Table', rows?: Array<{ __typename?: 'TableRow', cells?: Array<string | null> | null } | null> | null } | null } | { __typename: 'NationalCurriculumInsightsVideoCardsSection', heading?: string | null, introductionPortableText?: any | null, cards?: Array<{ __typename?: 'NationalCurriculumInsightsVideoCard', heading?: string | null, description?: string | null, videoUrl?: string | null, duration?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | null> | null } | null> | null, slug?: { __typename?: 'Slug', current?: string | null } | null, tabs?: Array<{ __typename?: 'NationalCurriculumInsightsTab', kind?: string | null, label?: string | null, page?: { __typename?: 'NationalCurriculumInsightsPage', pageType?: string | null, title?: string | null, summary?: string | null, id?: string | null, keyStages?: Array<{ __typename?: 'NationalCurriculumInsightsKeyStagePageReference', keyStage?: string | null, label?: string | null, page?: { __typename?: 'NationalCurriculumInsightsKeyStagePage', keyStage?: string | null, title?: string | null, summary?: string | null, id?: string | null, modules?: Array<{ __typename: 'NationalCurriculumInsightsFaqSection', heading?: string | null, items?: Array<{ __typename?: 'NationalCurriculumInsightsFaqItem', question?: string | null, initiallyExpanded?: boolean | null, answerPortableText?: any | null } | null> | null } | { __typename: 'NationalCurriculumInsightsHeroSection', heading?: string | null, authorName?: string | null, authorRole?: string | null, statusMessage?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, authorImage?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsImageTextSection', heading?: string | null, imagePosition?: string | null, background?: string | null, ctaLabel?: string | null, ctaHref?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsKeyStageCardsSection', cards?: Array<{ __typename?: 'NationalCurriculumInsightsKeyStageCard', keyStage?: string | null, heading?: string | null, linkLabel?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | null> | null } | { __typename: 'NationalCurriculumInsightsNewsletterSection', heading?: string | null, introduction?: string | null, benefits?: Array<string | null> | null, formId?: string | null, buttonLabel?: string | null, privacyPortableText?: any | null, illustration?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsOverviewSection', heading?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsPhaseCardsSection', cards?: Array<{ __typename?: 'NationalCurriculumInsightsPhaseCard', phase?: string | null, heading?: string | null, linkLabel?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | null> | null } | { __typename: 'NationalCurriculumInsightsPromotionalHeadingSection', heading?: string | null } | { __typename: 'NationalCurriculumInsightsQuoteSection', quote?: string | null, attribution?: string | null, role?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsRichTextSection', heading?: string | null, contentPortableText?: any | null } | { __typename: 'NationalCurriculumInsightsSubjectNavigationSection', phases?: Array<string | null> | null, primaryHeading?: string | null, secondaryHeading?: string | null } | { __typename: 'NationalCurriculumInsightsTableSection', heading?: string | null, table?: { __typename?: 'Table', rows?: Array<{ __typename?: 'TableRow', cells?: Array<string | null> | null } | null> | null } | null } | { __typename: 'NationalCurriculumInsightsVideoCardsSection', heading?: string | null, introductionPortableText?: any | null, cards?: Array<{ __typename?: 'NationalCurriculumInsightsVideoCard', heading?: string | null, description?: string | null, videoUrl?: string | null, duration?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | null> | null } | null> | null } | null } | null> | null, modules?: Array<{ __typename: 'NationalCurriculumInsightsFaqSection', heading?: string | null, items?: Array<{ __typename?: 'NationalCurriculumInsightsFaqItem', question?: string | null, initiallyExpanded?: boolean | null, answerPortableText?: any | null } | null> | null } | { __typename: 'NationalCurriculumInsightsHeroSection', heading?: string | null, authorName?: string | null, authorRole?: string | null, statusMessage?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null, authorImage?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsImageTextSection', heading?: string | null, imagePosition?: string | null, background?: string | null, ctaLabel?: string | null, ctaHref?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsKeyStageCardsSection', cards?: Array<{ __typename?: 'NationalCurriculumInsightsKeyStageCard', keyStage?: string | null, heading?: string | null, linkLabel?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | null> | null } | { __typename: 'NationalCurriculumInsightsNewsletterSection', heading?: string | null, introduction?: string | null, benefits?: Array<string | null> | null, formId?: string | null, buttonLabel?: string | null, privacyPortableText?: any | null, illustration?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsOverviewSection', heading?: string | null, bodyPortableText?: any | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsPhaseCardsSection', cards?: Array<{ __typename?: 'NationalCurriculumInsightsPhaseCard', phase?: string | null, heading?: string | null, linkLabel?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | null> | null } | { __typename: 'NationalCurriculumInsightsPromotionalHeadingSection', heading?: string | null } | { __typename: 'NationalCurriculumInsightsQuoteSection', quote?: string | null, attribution?: string | null, role?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | { __typename: 'NationalCurriculumInsightsRichTextSection', heading?: string | null, contentPortableText?: any | null } | { __typename: 'NationalCurriculumInsightsSubjectNavigationSection', phases?: Array<string | null> | null, primaryHeading?: string | null, secondaryHeading?: string | null } | { __typename: 'NationalCurriculumInsightsTableSection', heading?: string | null, table?: { __typename?: 'Table', rows?: Array<{ __typename?: 'TableRow', cells?: Array<string | null> | null } | null> | null } | null } | { __typename: 'NationalCurriculumInsightsVideoCardsSection', heading?: string | null, introductionPortableText?: any | null, cards?: Array<{ __typename?: 'NationalCurriculumInsightsVideoCard', heading?: string | null, description?: string | null, videoUrl?: string | null, duration?: string | null, image?: { __typename?: 'ImageWithAltText', altText?: string | null, isPresentational?: boolean | null, asset?: { __typename?: 'SanityImageAsset', _id?: string | null, url?: string | null } | null } | null } | null> | null } | null> | null } | null } | null> | null }> };

export const NationalCurriculumInsightsModulesFragmentDoc = gql`
    fragment NationalCurriculumInsightsModules on NationalCurriculumInsightsFaqSectionOrNationalCurriculumInsightsHeroSectionOrNationalCurriculumInsightsImageTextSectionOrNationalCurriculumInsightsKeyStageCardsSectionOrNationalCurriculumInsightsNewsletterSectionOrNationalCurriculumInsightsOverviewSectionOrNationalCurriculumInsightsPhaseCardsSectionOrNationalCurriculumInsightsPromotionalHeadingSectionOrNationalCurriculumInsightsQuoteSectionOrNationalCurriculumInsightsRichTextSectionOrNationalCurriculumInsightsSubjectNavigationSectionOrNationalCurriculumInsightsTableSectionOrNationalCurriculumInsightsVideoCardsSection {
  __typename
  ... on NationalCurriculumInsightsHeroSection {
    heading
    bodyPortableText: bodyRaw
    image {
      altText
      isPresentational
      asset {
        _id
        url
      }
    }
    authorName
    authorRole
    authorImage {
      altText
      isPresentational
      asset {
        _id
        url
      }
    }
    statusMessage
  }
  ... on NationalCurriculumInsightsOverviewSection {
    heading
    bodyPortableText: bodyRaw
    image {
      altText
      isPresentational
      asset {
        _id
        url
      }
    }
  }
  ... on NationalCurriculumInsightsPhaseCardsSection {
    cards {
      phase
      heading
      linkLabel
      image {
        altText
        isPresentational
        asset {
          _id
          url
        }
      }
    }
  }
  ... on NationalCurriculumInsightsKeyStageCardsSection {
    cards {
      keyStage
      heading
      linkLabel
      image {
        altText
        isPresentational
        asset {
          _id
          url
        }
      }
    }
  }
  ... on NationalCurriculumInsightsPromotionalHeadingSection {
    heading
  }
  ... on NationalCurriculumInsightsSubjectNavigationSection {
    phases
    primaryHeading
    secondaryHeading
  }
  ... on NationalCurriculumInsightsNewsletterSection {
    heading
    introduction
    benefits
    illustration {
      altText
      isPresentational
      asset {
        _id
        url
      }
    }
    privacyPortableText: privacyTextRaw
    formId
    buttonLabel
  }
  ... on NationalCurriculumInsightsFaqSection {
    heading
    items {
      question
      answerPortableText: answerRaw
      initiallyExpanded
    }
  }
  ... on NationalCurriculumInsightsRichTextSection {
    heading
    contentPortableText: contentRaw
  }
  ... on NationalCurriculumInsightsImageTextSection {
    heading
    bodyPortableText: bodyRaw
    image {
      altText
      isPresentational
      asset {
        _id
        url
      }
    }
    imagePosition
    background
    ctaLabel
    ctaHref
  }
  ... on NationalCurriculumInsightsVideoCardsSection {
    heading
    introductionPortableText: introductionRaw
    cards {
      heading
      description
      image {
        altText
        isPresentational
        asset {
          _id
          url
        }
      }
      videoUrl
      duration
    }
  }
  ... on NationalCurriculumInsightsQuoteSection {
    quote
    attribution
    role
    image {
      altText
      isPresentational
      asset {
        _id
        url
      }
    }
  }
  ... on NationalCurriculumInsightsTableSection {
    heading
    table {
      rows {
        cells
      }
    }
  }
}
    `;
export const NationalCurriculumInsightsHubDocument = gql`
    query nationalCurriculumInsightsHub($isDraftFilter: Sanity_DocumentFilter) {
  allNationalCurriculumInsightsHub(
    where: {_: $isDraftFilter, _id: {matches: "*nationalCurriculumInsightsHub"}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    id: _id
    title
    summary
    subjects {
      id: _id
      title
      slug {
        current
      }
      curriculumSubjectSlugs
      tabs {
        kind
        label
        page {
          id: _id
          pageType
          title
        }
      }
    }
    modules {
      ...NationalCurriculumInsightsModules
    }
  }
}
    ${NationalCurriculumInsightsModulesFragmentDoc}`;
export const NationalCurriculumInsightsSubjectBySlugDocument = gql`
    query nationalCurriculumInsightsSubjectBySlug($subjectSlug: String, $isDraftFilter: Sanity_DocumentFilter) {
  allNationalCurriculumInsightsSubject(
    where: {_: $isDraftFilter, slug: {current: {eq: $subjectSlug}}}
    sort: {_updatedAt: DESC}
    limit: 1
  ) {
    id: _id
    title
    summary
    modules {
      ...NationalCurriculumInsightsModules
    }
    slug {
      current
    }
    curriculumSubjectSlugs
    tabs {
      kind
      label
      page {
        id: _id
        pageType
        title
        summary
        keyStages {
          keyStage
          label
          page {
            id: _id
            keyStage
            title
            summary
            modules {
              ...NationalCurriculumInsightsModules
            }
          }
        }
        modules {
          ...NationalCurriculumInsightsModules
        }
      }
    }
  }
}
    ${NationalCurriculumInsightsModulesFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    nationalCurriculumInsightsHub(variables?: NationalCurriculumInsightsHubQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<NationalCurriculumInsightsHubQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<NationalCurriculumInsightsHubQuery>({ document: NationalCurriculumInsightsHubDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'nationalCurriculumInsightsHub', 'query', variables);
    },
    nationalCurriculumInsightsSubjectBySlug(variables?: NationalCurriculumInsightsSubjectBySlugQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<NationalCurriculumInsightsSubjectBySlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<NationalCurriculumInsightsSubjectBySlugQuery>({ document: NationalCurriculumInsightsSubjectBySlugDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'nationalCurriculumInsightsSubjectBySlug', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;