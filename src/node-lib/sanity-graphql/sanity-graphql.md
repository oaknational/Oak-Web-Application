# Sanity graphql client

Note: This is the auto-generated sanity graphql client, not the CMS client used to actually consume CMS content within OWA, which lives in `node-lib/cms`.

It uses the [graphql codegen package](https://www.the-guild.dev/graphql/codegen) to automatically create a typed SDK for our queries.

Each `.gql` file is compiled by the codegen into a method in `generated/sdk.ts`, for example `aboutCorePage.gql` with the query `query aboutCorePage() {...}` generates the `sanityGraphqlApi.aboutCorePage` method, which accepts arguments matching those defined in the graphql query params

## Development

Make sure the `SANITY_GRAPHQL_URL` env var is set to point to the correct dataset (production by default, unless working from a feature branch dataset). It should look something like `https://{{project_id}}.apicdn.sanity.io/v1/graphql/{{dataset}}/default`

After making changes to the `.gql` files re-run the codegen to update the SDK

```shell
> npm run gql-codegen:sanity
```

If you're working iteratively you can run it with the `--watch` flag to have it pick up on changes

```shell
> npm run gql-codegen:sanity -- --watch
```

### Mocking & Fixtures

For testing purposes a mock of the `sanityGraphqlApi` package has been created under `__mocks__/`. If you're adding a new query that will be needed in other tests (e.g. the cms client) make sure to add it there. It relies on fixtures - by convention named the same as the queries - in the `fixtures/` sub-folder

You can generate a fixture for your method, or update the existing ones by:

1. Stopping any running tests (especially under test watch mode)
2. Navigating to `sanity-graphql/index.ts`
3. Uncommenting the function `fixtureGenerationWrapper`
4. Passing it as the second argument to `getSdk`, like `getSdk(sanityGraphqlClient, fixtureGenerationWrapper)`

Now any query executed will update the fixtures folder. To reduce noise created by giant diffs, I'd suggest only updating the fixtures you specifically need, and trying to match the entity in the case of something like a blog post

Don't forget to revert your local changes to the `getSdk` call when you're done

## Writing queries

The best way to write queries is probably to start with the deployed graphql playground. This should be the same link you're setting as `SANITY_GRAPHQL_URL`

### Fragments

Make use of the graphql fragments for common field types such as `CTA`, `Card`, `TextAndMedia`.  
Fragments live alongside the queries, with the `.fragment.gql` suffix

### Singleton content types (e.g. "core" pages)

Queries for singleton content types should use the same pattern below:

```gql
query aboutCorePage($isDraftFilter: Sanity_DocumentFilter) {
  allAboutCorePage(
    where: { _: $isDraftFilter, _id: { matches: "*aboutCorePage" } }
    sort: { _updatedAt: DESC }
    limit: 1
  ) {
    id: _id
    title
    # your other fields
    seo {
      ...Seo
    }
  }
}
```

- we use the `all*` type of query in conjunction with a limit instead of looking up by ID to enable draft mode content, and make the queries more similar to the `*BySlug` queries
- `where`
  - `_: $isDraftFilter` - `_` is a special document filter in Sanity's graphql implementation, that allows you to query against meta fields like `{_: {is_draft: Boolean}}`.
    A caveat of `is_draft` is that sanity will _only_ return either draft or non-draft content when this is specified.
    We pass in the whole `isDraftFilter` object instead of a boolean to get around this, as when in preview mode we want to omit the filter entirely, as `is_draft: null` will be coerced into `is_draft: false`. In published-mode we explicitly pass `{is_draft: true}` to ensure all drafts are excluded.
  - `_id: { matches: "*aboutCorePage" }` - this matches both `aboutCorePage` and `drafts.aboutCorePage`
- `sort: { _updatedAt: DESC }, limit: 1` - The draft version of a document should naturally always be more recently updated than it's published counterpart. By querying both and taking only the first result, we make sure we'll always get a result even if a draft document doesn't exist
- `id: _id` - To de-sanity the content a bit, rename `_id` to `id`
- `seo { ...Seo }` - using a fragment to reduce query size, and also act as a hint that there's probably a matching zod resolver (`seoSchema`, `cardSchema` etc)

### Finding an item (e.g. by slug)

```gql
query blogPostBySlug($slug: String, $isDraftFilter: Sanity_DocumentFilter) {
  allNewsPost(
    where: { _: $isDraftFilter, slug: { current: { eq: $slug } } }
    sort: { _updatedAt: DESC }
    limit: 1
  ) {
    id: _id
    contentPortableText: contentRaw
  }
}
```

- `where`
  - `_: $isDraftFilter` - as above in the singleton section
  - `slug: { current: { eq: $slug }` - match on a field. Here the path in the JSON is `slug.current`, and after that the object defines the type of match, e.g. `{ eq: }` or `{ matches: }`
- `sort`/`limit` as above
- `contentPortableText: contentRaw` - all portable text fields are returned as raw JSON (so no sub-fields to query), with the suffix `*Raw`, in this case `contentRaw` as the field is named `content`.
  We rename it to `contentPortableText` for explicitness as it's one of the few strongly sanity-specific fields in our schemas.
  As portable text is raw JSON, all references to other content are in the form of `{_type: "reference", _ref: "some-id"}`. In the CMS client we go through an additional step to do a follow-up query to resolve all these references. See the implementation in `cms/sanity-client/resolveSanityReferences.ts`

### Lists of items (e.g. blog posts)

```gql
query allBlogPosts($isDraftFilter: Sanity_DocumentFilter, $limit: Int = 9999) {
  allNewsPost(
    where: { _: $isDraftFilter }
    sort: [{ date: DESC }, { _updatedAt: DESC }]
    limit: $limit
  ) {
    id: _id
    title
  }
}
```

- sanity's graphql implementation has collections named with the `all*` prefix, e.g. `allNewsPost`
- `$limit: Int = 9999` - To be able to override `$limit` we need to provide a default otherwise the API will reject it, and `null` returns 0 items. Thus it's set at an arbitrarily large number
- `where: { _: $isDraftFilter }` - as described above in singleton section
- `sort: [{ date: DESC }, { _updatedAt: DESC }]` - sort order is an array in order of precedence, for the sake of drafts in preview mode (as above) we also specify the `_updatedAt` alongside the `date` that we care about sorting by for the user
