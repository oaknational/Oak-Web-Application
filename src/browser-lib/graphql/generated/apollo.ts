import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  timestamptz: any;
  uuid: any;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "bookmarkedLessons" */
export type BookmarkedLessons = {
  __typename?: 'bookmarkedLessons';
  createdAt: Scalars['timestamptz'];
  lesson?: Maybe<Lessons>;
  lessonId: Scalars['uuid'];
  updatedAt: Scalars['timestamptz'];
  userId: Scalars['uuid'];
};

/** Boolean expression to filter rows from the table "bookmarkedLessons". All fields are combined with a logical 'AND'. */
export type BookmarkedLessons_Bool_Exp = {
  _and?: InputMaybe<Array<BookmarkedLessons_Bool_Exp>>;
  _not?: InputMaybe<BookmarkedLessons_Bool_Exp>;
  _or?: InputMaybe<Array<BookmarkedLessons_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  lessonId?: InputMaybe<Uuid_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  userId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** input type for inserting data into table "bookmarkedLessons" */
export type BookmarkedLessons_Insert_Input = {
  lessonId?: InputMaybe<Scalars['uuid']>;
};

/** response of any mutation on the table "bookmarkedLessons" */
export type BookmarkedLessons_Mutation_Response = {
  __typename?: 'bookmarkedLessons_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<BookmarkedLessons>;
};

/** Ordering options when selecting data from "bookmarkedLessons". */
export type BookmarkedLessons_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  lessonId?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** select columns of table "bookmarkedLessons" */
export enum BookmarkedLessons_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  LessonId = 'lessonId',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UserId = 'userId'
}

/** columns and relationships of "lessons" */
export type Lessons = {
  __typename?: 'lessons';
  id: Scalars['uuid'];
  slug: Scalars['String'];
  title: Scalars['String'];
};

/** aggregated selection of "lessons" */
export type Lessons_Aggregate = {
  __typename?: 'lessons_aggregate';
  aggregate?: Maybe<Lessons_Aggregate_Fields>;
  nodes: Array<Lessons>;
};

/** aggregate fields of "lessons" */
export type Lessons_Aggregate_Fields = {
  __typename?: 'lessons_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Lessons_Max_Fields>;
  min?: Maybe<Lessons_Min_Fields>;
};


/** aggregate fields of "lessons" */
export type Lessons_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Lessons_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "lessons". All fields are combined with a logical 'AND'. */
export type Lessons_Bool_Exp = {
  _and?: InputMaybe<Array<Lessons_Bool_Exp>>;
  _not?: InputMaybe<Lessons_Bool_Exp>;
  _or?: InputMaybe<Array<Lessons_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  slug?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "lessons" */
export enum Lessons_Constraint {
  /** unique or primary key constraint */
  LessonsPkey = 'lessons_pkey',
  /** unique or primary key constraint */
  LessonsSlugKey = 'lessons_slug_key'
}

/** input type for inserting data into table "lessons" */
export type Lessons_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  slug?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Lessons_Max_Fields = {
  __typename?: 'lessons_max_fields';
  id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Lessons_Min_Fields = {
  __typename?: 'lessons_min_fields';
  id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "lessons" */
export type Lessons_Mutation_Response = {
  __typename?: 'lessons_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Lessons>;
};

/** on_conflict condition type for table "lessons" */
export type Lessons_On_Conflict = {
  constraint: Lessons_Constraint;
  update_columns?: Array<Lessons_Update_Column>;
  where?: InputMaybe<Lessons_Bool_Exp>;
};

/** Ordering options when selecting data from "lessons". */
export type Lessons_Order_By = {
  id?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
};

/** primary key columns input for table: lessons */
export type Lessons_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "lessons" */
export enum Lessons_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Slug = 'slug',
  /** column name */
  Title = 'title'
}

/** input type for updating data in table "lessons" */
export type Lessons_Set_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  slug?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

/** update columns of table "lessons" */
export enum Lessons_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Slug = 'slug',
  /** column name */
  Title = 'title'
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "bookmarkedLessons" */
  delete_bookmarkedLessons?: Maybe<BookmarkedLessons_Mutation_Response>;
  /** delete single row from the table: "bookmarkedLessons" */
  delete_bookmarkedLessons_by_pk?: Maybe<BookmarkedLessons>;
  /** delete data from the table: "lessons" */
  delete_lessons?: Maybe<Lessons_Mutation_Response>;
  /** delete single row from the table: "lessons" */
  delete_lessons_by_pk?: Maybe<Lessons>;
  /** insert data into the table: "bookmarkedLessons" */
  insert_bookmarkedLessons?: Maybe<BookmarkedLessons_Mutation_Response>;
  /** insert a single row into the table: "bookmarkedLessons" */
  insert_bookmarkedLessons_one?: Maybe<BookmarkedLessons>;
  /** insert data into the table: "lessons" */
  insert_lessons?: Maybe<Lessons_Mutation_Response>;
  /** insert a single row into the table: "lessons" */
  insert_lessons_one?: Maybe<Lessons>;
  /** update data of the table: "lessons" */
  update_lessons?: Maybe<Lessons_Mutation_Response>;
  /** update single row of the table: "lessons" */
  update_lessons_by_pk?: Maybe<Lessons>;
};


/** mutation root */
export type Mutation_RootDelete_BookmarkedLessonsArgs = {
  where: BookmarkedLessons_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_BookmarkedLessons_By_PkArgs = {
  lessonId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_LessonsArgs = {
  where: Lessons_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Lessons_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsert_BookmarkedLessonsArgs = {
  objects: Array<BookmarkedLessons_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_BookmarkedLessons_OneArgs = {
  object: BookmarkedLessons_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_LessonsArgs = {
  objects: Array<Lessons_Insert_Input>;
  on_conflict?: InputMaybe<Lessons_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lessons_OneArgs = {
  object: Lessons_Insert_Input;
  on_conflict?: InputMaybe<Lessons_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_LessonsArgs = {
  _set?: InputMaybe<Lessons_Set_Input>;
  where: Lessons_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Lessons_By_PkArgs = {
  _set?: InputMaybe<Lessons_Set_Input>;
  pk_columns: Lessons_Pk_Columns_Input;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "bookmarkedLessons" */
  bookmarkedLessons: Array<BookmarkedLessons>;
  /** fetch data from the table: "bookmarkedLessons" using primary key columns */
  bookmarkedLessons_by_pk?: Maybe<BookmarkedLessons>;
  /** fetch data from the table: "lessons" */
  lessons: Array<Lessons>;
  /** fetch aggregated fields from the table: "lessons" */
  lessons_aggregate: Lessons_Aggregate;
  /** fetch data from the table: "lessons" using primary key columns */
  lessons_by_pk?: Maybe<Lessons>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
};


export type Query_RootBookmarkedLessonsArgs = {
  distinct_on?: InputMaybe<Array<BookmarkedLessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<BookmarkedLessons_Order_By>>;
  where?: InputMaybe<BookmarkedLessons_Bool_Exp>;
};


export type Query_RootBookmarkedLessons_By_PkArgs = {
  lessonId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


export type Query_RootLessonsArgs = {
  distinct_on?: InputMaybe<Array<Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lessons_Order_By>>;
  where?: InputMaybe<Lessons_Bool_Exp>;
};


export type Query_RootLessons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lessons_Order_By>>;
  where?: InputMaybe<Lessons_Bool_Exp>;
};


export type Query_RootLessons_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "bookmarkedLessons" */
  bookmarkedLessons: Array<BookmarkedLessons>;
  /** fetch data from the table: "bookmarkedLessons" using primary key columns */
  bookmarkedLessons_by_pk?: Maybe<BookmarkedLessons>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
};


export type Subscription_RootBookmarkedLessonsArgs = {
  distinct_on?: InputMaybe<Array<BookmarkedLessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<BookmarkedLessons_Order_By>>;
  where?: InputMaybe<BookmarkedLessons_Bool_Exp>;
};


export type Subscription_RootBookmarkedLessons_By_PkArgs = {
  lessonId: Scalars['uuid'];
  userId: Scalars['uuid'];
};


export type Subscription_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};

/** columns and relationships of "users" */
export type Users = {
  __typename?: 'users';
  email: Scalars['String'];
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Bool_Exp>>;
  _not?: InputMaybe<Users_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Bool_Exp>>;
  email?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "users". */
export type Users_Order_By = {
  email?: InputMaybe<Order_By>;
};

/** select columns of table "users" */
export enum Users_Select_Column {
  /** column name */
  Email = 'email'
}

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']>;
  _gt?: InputMaybe<Scalars['uuid']>;
  _gte?: InputMaybe<Scalars['uuid']>;
  _in?: InputMaybe<Array<Scalars['uuid']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['uuid']>;
  _lte?: InputMaybe<Scalars['uuid']>;
  _neq?: InputMaybe<Scalars['uuid']>;
  _nin?: InputMaybe<Array<Scalars['uuid']>>;
};

export type BookmarkedLessonAddMutationVariables = Exact<{
  lessonId: Scalars['uuid'];
}>;


export type BookmarkedLessonAddMutation = { __typename?: 'mutation_root', insert_bookmarkedLessons_one?: { __typename?: 'bookmarkedLessons', createdAt: any, lesson?: { __typename?: 'lessons', id: any, slug: string, title: string } | null } | null };

export type BookmarkedLessonRemoveMutationVariables = Exact<{
  lessonId: Scalars['uuid'];
  userId: Scalars['uuid'];
}>;


export type BookmarkedLessonRemoveMutation = { __typename?: 'mutation_root', delete_bookmarkedLessons_by_pk?: { __typename?: 'bookmarkedLessons', lessonId: any, userId: any } | null };

export type BookmarkedLessonsQueryVariables = Exact<{ [key: string]: never; }>;


export type BookmarkedLessonsQuery = { __typename?: 'query_root', bookmarkedLessons: Array<{ __typename?: 'bookmarkedLessons', createdAt: any, lesson?: { __typename?: 'lessons', id: any, slug: string, title: string } | null }> };


export const BookmarkedLessonAddDocument = gql`
    mutation bookmarkedLessonAdd($lessonId: uuid!) {
  insert_bookmarkedLessons_one(object: {lessonId: $lessonId}) {
    lesson {
      id
      slug
      title
    }
    createdAt
  }
}
    `;
export type BookmarkedLessonAddMutationFn = Apollo.MutationFunction<BookmarkedLessonAddMutation, BookmarkedLessonAddMutationVariables>;

/**
 * __useBookmarkedLessonAddMutation__
 *
 * To run a mutation, you first call `useBookmarkedLessonAddMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBookmarkedLessonAddMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bookmarkedLessonAddMutation, { data, loading, error }] = useBookmarkedLessonAddMutation({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *   },
 * });
 */
export function useBookmarkedLessonAddMutation(baseOptions?: Apollo.MutationHookOptions<BookmarkedLessonAddMutation, BookmarkedLessonAddMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BookmarkedLessonAddMutation, BookmarkedLessonAddMutationVariables>(BookmarkedLessonAddDocument, options);
      }
export type BookmarkedLessonAddMutationHookResult = ReturnType<typeof useBookmarkedLessonAddMutation>;
export type BookmarkedLessonAddMutationResult = Apollo.MutationResult<BookmarkedLessonAddMutation>;
export type BookmarkedLessonAddMutationOptions = Apollo.BaseMutationOptions<BookmarkedLessonAddMutation, BookmarkedLessonAddMutationVariables>;
export const BookmarkedLessonRemoveDocument = gql`
    mutation bookmarkedLessonRemove($lessonId: uuid!, $userId: uuid!) {
  delete_bookmarkedLessons_by_pk(lessonId: $lessonId, userId: $userId) {
    lessonId
    userId
  }
}
    `;
export type BookmarkedLessonRemoveMutationFn = Apollo.MutationFunction<BookmarkedLessonRemoveMutation, BookmarkedLessonRemoveMutationVariables>;

/**
 * __useBookmarkedLessonRemoveMutation__
 *
 * To run a mutation, you first call `useBookmarkedLessonRemoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBookmarkedLessonRemoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bookmarkedLessonRemoveMutation, { data, loading, error }] = useBookmarkedLessonRemoveMutation({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useBookmarkedLessonRemoveMutation(baseOptions?: Apollo.MutationHookOptions<BookmarkedLessonRemoveMutation, BookmarkedLessonRemoveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BookmarkedLessonRemoveMutation, BookmarkedLessonRemoveMutationVariables>(BookmarkedLessonRemoveDocument, options);
      }
export type BookmarkedLessonRemoveMutationHookResult = ReturnType<typeof useBookmarkedLessonRemoveMutation>;
export type BookmarkedLessonRemoveMutationResult = Apollo.MutationResult<BookmarkedLessonRemoveMutation>;
export type BookmarkedLessonRemoveMutationOptions = Apollo.BaseMutationOptions<BookmarkedLessonRemoveMutation, BookmarkedLessonRemoveMutationVariables>;
export const BookmarkedLessonsDocument = gql`
    query bookmarkedLessons {
  bookmarkedLessons(order_by: {createdAt: desc}) {
    lesson {
      id
      slug
      title
    }
    createdAt
  }
}
    `;

/**
 * __useBookmarkedLessonsQuery__
 *
 * To run a query within a React component, call `useBookmarkedLessonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBookmarkedLessonsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBookmarkedLessonsQuery({
 *   variables: {
 *   },
 * });
 */
export function useBookmarkedLessonsQuery(baseOptions?: Apollo.QueryHookOptions<BookmarkedLessonsQuery, BookmarkedLessonsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BookmarkedLessonsQuery, BookmarkedLessonsQueryVariables>(BookmarkedLessonsDocument, options);
      }
export function useBookmarkedLessonsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BookmarkedLessonsQuery, BookmarkedLessonsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BookmarkedLessonsQuery, BookmarkedLessonsQueryVariables>(BookmarkedLessonsDocument, options);
        }
export type BookmarkedLessonsQueryHookResult = ReturnType<typeof useBookmarkedLessonsQuery>;
export type BookmarkedLessonsLazyQueryHookResult = ReturnType<typeof useBookmarkedLessonsLazyQuery>;
export type BookmarkedLessonsQueryResult = Apollo.QueryResult<BookmarkedLessonsQuery, BookmarkedLessonsQueryVariables>;