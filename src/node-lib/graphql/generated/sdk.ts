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

/** aggregated selection of "bookmarkedLessons" */
export type BookmarkedLessons_Aggregate = {
  __typename?: 'bookmarkedLessons_aggregate';
  aggregate?: Maybe<BookmarkedLessons_Aggregate_Fields>;
  nodes: Array<BookmarkedLessons>;
};

/** aggregate fields of "bookmarkedLessons" */
export type BookmarkedLessons_Aggregate_Fields = {
  __typename?: 'bookmarkedLessons_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<BookmarkedLessons_Max_Fields>;
  min?: Maybe<BookmarkedLessons_Min_Fields>;
};


/** aggregate fields of "bookmarkedLessons" */
export type BookmarkedLessons_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<BookmarkedLessons_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
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

/** unique or primary key constraints on table "bookmarkedLessons" */
export enum BookmarkedLessons_Constraint {
  /** unique or primary key constraint */
  BookmarkedLessonsPkey = 'bookmarkedLessons_pkey'
}

/** input type for inserting data into table "bookmarkedLessons" */
export type BookmarkedLessons_Insert_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  lessonId?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type BookmarkedLessons_Max_Fields = {
  __typename?: 'bookmarkedLessons_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  lessonId?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type BookmarkedLessons_Min_Fields = {
  __typename?: 'bookmarkedLessons_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  lessonId?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "bookmarkedLessons" */
export type BookmarkedLessons_Mutation_Response = {
  __typename?: 'bookmarkedLessons_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<BookmarkedLessons>;
};

/** on_conflict condition type for table "bookmarkedLessons" */
export type BookmarkedLessons_On_Conflict = {
  constraint: BookmarkedLessons_Constraint;
  update_columns?: Array<BookmarkedLessons_Update_Column>;
  where?: InputMaybe<BookmarkedLessons_Bool_Exp>;
};

/** Ordering options when selecting data from "bookmarkedLessons". */
export type BookmarkedLessons_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  lessonId?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: bookmarkedLessons */
export type BookmarkedLessons_Pk_Columns_Input = {
  lessonId: Scalars['uuid'];
  userId: Scalars['uuid'];
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

/** input type for updating data in table "bookmarkedLessons" */
export type BookmarkedLessons_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  lessonId?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "bookmarkedLessons" */
export enum BookmarkedLessons_Update_Column {
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
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
  /** insert data into the table: "bookmarkedLessons" */
  insert_bookmarkedLessons?: Maybe<BookmarkedLessons_Mutation_Response>;
  /** insert a single row into the table: "bookmarkedLessons" */
  insert_bookmarkedLessons_one?: Maybe<BookmarkedLessons>;
  /** insert data into the table: "lessons" */
  insert_lessons?: Maybe<Lessons_Mutation_Response>;
  /** insert a single row into the table: "lessons" */
  insert_lessons_one?: Maybe<Lessons>;
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
  /** update data of the table: "bookmarkedLessons" */
  update_bookmarkedLessons?: Maybe<BookmarkedLessons_Mutation_Response>;
  /** update single row of the table: "bookmarkedLessons" */
  update_bookmarkedLessons_by_pk?: Maybe<BookmarkedLessons>;
  /** update data of the table: "lessons" */
  update_lessons?: Maybe<Lessons_Mutation_Response>;
  /** update single row of the table: "lessons" */
  update_lessons_by_pk?: Maybe<Lessons>;
  /** update data of the table: "users" */
  update_users?: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>;
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
export type Mutation_RootDelete_UsersArgs = {
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsert_BookmarkedLessonsArgs = {
  objects: Array<BookmarkedLessons_Insert_Input>;
  on_conflict?: InputMaybe<BookmarkedLessons_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_BookmarkedLessons_OneArgs = {
  object: BookmarkedLessons_Insert_Input;
  on_conflict?: InputMaybe<BookmarkedLessons_On_Conflict>;
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
export type Mutation_RootInsert_UsersArgs = {
  objects: Array<Users_Insert_Input>;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_OneArgs = {
  object: Users_Insert_Input;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_BookmarkedLessonsArgs = {
  _set?: InputMaybe<BookmarkedLessons_Set_Input>;
  where: BookmarkedLessons_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_BookmarkedLessons_By_PkArgs = {
  _set?: InputMaybe<BookmarkedLessons_Set_Input>;
  pk_columns: BookmarkedLessons_Pk_Columns_Input;
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


/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
  _set?: InputMaybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
  _set?: InputMaybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
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
  /** fetch aggregated fields from the table: "bookmarkedLessons" */
  bookmarkedLessons_aggregate: BookmarkedLessons_Aggregate;
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
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
};


export type Query_RootBookmarkedLessonsArgs = {
  distinct_on?: InputMaybe<Array<BookmarkedLessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<BookmarkedLessons_Order_By>>;
  where?: InputMaybe<BookmarkedLessons_Bool_Exp>;
};


export type Query_RootBookmarkedLessons_AggregateArgs = {
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


export type Query_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Query_RootUsers_By_PkArgs = {
  id: Scalars['uuid'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "bookmarkedLessons" */
  bookmarkedLessons: Array<BookmarkedLessons>;
  /** fetch aggregated fields from the table: "bookmarkedLessons" */
  bookmarkedLessons_aggregate: BookmarkedLessons_Aggregate;
  /** fetch data from the table: "bookmarkedLessons" using primary key columns */
  bookmarkedLessons_by_pk?: Maybe<BookmarkedLessons>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
};


export type Subscription_RootBookmarkedLessonsArgs = {
  distinct_on?: InputMaybe<Array<BookmarkedLessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<BookmarkedLessons_Order_By>>;
  where?: InputMaybe<BookmarkedLessons_Bool_Exp>;
};


export type Subscription_RootBookmarkedLessons_AggregateArgs = {
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


export type Subscription_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootUsers_By_PkArgs = {
  id: Scalars['uuid'];
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
  createdAt: Scalars['timestamptz'];
  email: Scalars['String'];
  firebaseUid: Scalars['String'];
  id: Scalars['uuid'];
  updatedAt: Scalars['timestamptz'];
};

/** aggregated selection of "users" */
export type Users_Aggregate = {
  __typename?: 'users_aggregate';
  aggregate?: Maybe<Users_Aggregate_Fields>;
  nodes: Array<Users>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_Fields = {
  __typename?: 'users_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
};


/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Bool_Exp>>;
  _not?: InputMaybe<Users_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  firebaseUid?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "users" */
export enum Users_Constraint {
  /** unique or primary key constraint */
  UsersFirebaseUidKey = 'users_firebaseUid_key',
  /** unique or primary key constraint */
  UsersPkey = 'users_pkey'
}

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  email?: InputMaybe<Scalars['String']>;
  firebaseUid?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: 'users_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  firebaseUid?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: 'users_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  firebaseUid?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "users" */
export type Users_Mutation_Response = {
  __typename?: 'users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** on_conflict condition type for table "users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns?: Array<Users_Update_Column>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Ordering options when selecting data from "users". */
export type Users_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  firebaseUid?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users */
export type Users_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "users" */
export enum Users_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Email = 'email',
  /** column name */
  FirebaseUid = 'firebaseUid',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "users" */
export type Users_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  email?: InputMaybe<Scalars['String']>;
  firebaseUid?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "users" */
export enum Users_Update_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Email = 'email',
  /** column name */
  FirebaseUid = 'firebaseUid',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updatedAt'
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

export type AllLessonsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllLessonsQuery = { __typename?: 'query_root', lessons: Array<{ __typename?: 'lessons', id: any, slug: string, title: string }> };

export type GetUserQueryVariables = Exact<{
  firebaseUid: Scalars['String'];
  email: Scalars['String'];
}>;


export type GetUserQuery = { __typename?: 'query_root', users: Array<{ __typename?: 'users', email: string, firebaseUid: string, id: any }> };

export type LessonsBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type LessonsBySlugQuery = { __typename?: 'query_root', lessons: Array<{ __typename?: 'lessons', id: any, slug: string, title: string }> };

export type UpsertUserMutationVariables = Exact<{
  user: Users_Insert_Input;
}>;


export type UpsertUserMutation = { __typename?: 'mutation_root', insert_users_one?: { __typename?: 'users', email: string, firebaseUid: string, id: any } | null };


export const AllLessonsDocument = gql`
    query allLessons {
  lessons {
    id
    slug
    title
  }
}
    `;
export const GetUserDocument = gql`
    query getUser($firebaseUid: String!, $email: String!) {
  users(where: {firebaseUid: {_eq: $firebaseUid}, email: {_eq: $email}}) {
    email
    firebaseUid
    id
  }
}
    `;
export const LessonsBySlugDocument = gql`
    query lessonsBySlug($slug: String!) {
  lessons(where: {slug: {_eq: $slug}}) {
    id
    slug
    title
  }
}
    `;
export const UpsertUserDocument = gql`
    mutation upsertUser($user: users_insert_input!) {
  insert_users_one(
    object: $user
    on_conflict: {constraint: users_firebaseUid_key, update_columns: []}
  ) {
    email
    firebaseUid
    id
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    allLessons(variables?: AllLessonsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AllLessonsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllLessonsQuery>(AllLessonsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allLessons', 'query');
    },
    getUser(variables: GetUserQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetUserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserQuery>(GetUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getUser', 'query');
    },
    lessonsBySlug(variables: LessonsBySlugQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LessonsBySlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LessonsBySlugQuery>(LessonsBySlugDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'lessonsBySlug', 'query');
    },
    upsertUser(variables: UpsertUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpsertUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpsertUserMutation>(UpsertUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'upsertUser', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;