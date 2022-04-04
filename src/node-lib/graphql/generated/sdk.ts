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
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
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

/** columns and relationships of "bookmarked_lesson" */
export type Bookmarked_Lesson = {
  __typename?: 'bookmarked_lesson';
  created_at?: Maybe<Scalars['timestamptz']>;
  lesson?: Maybe<Lesson>;
  lesson_id: Scalars['Int'];
  updated_at?: Maybe<Scalars['timestamptz']>;
  /** An object relationship */
  user: User;
  user_id: Scalars['Int'];
};

/** aggregated selection of "bookmarked_lesson" */
export type Bookmarked_Lesson_Aggregate = {
  __typename?: 'bookmarked_lesson_aggregate';
  aggregate?: Maybe<Bookmarked_Lesson_Aggregate_Fields>;
  nodes: Array<Bookmarked_Lesson>;
};

/** aggregate fields of "bookmarked_lesson" */
export type Bookmarked_Lesson_Aggregate_Fields = {
  __typename?: 'bookmarked_lesson_aggregate_fields';
  avg?: Maybe<Bookmarked_Lesson_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Bookmarked_Lesson_Max_Fields>;
  min?: Maybe<Bookmarked_Lesson_Min_Fields>;
  stddev?: Maybe<Bookmarked_Lesson_Stddev_Fields>;
  stddev_pop?: Maybe<Bookmarked_Lesson_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Bookmarked_Lesson_Stddev_Samp_Fields>;
  sum?: Maybe<Bookmarked_Lesson_Sum_Fields>;
  var_pop?: Maybe<Bookmarked_Lesson_Var_Pop_Fields>;
  var_samp?: Maybe<Bookmarked_Lesson_Var_Samp_Fields>;
  variance?: Maybe<Bookmarked_Lesson_Variance_Fields>;
};


/** aggregate fields of "bookmarked_lesson" */
export type Bookmarked_Lesson_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Bookmarked_Lesson_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "bookmarked_lesson" */
export type Bookmarked_Lesson_Aggregate_Order_By = {
  avg?: InputMaybe<Bookmarked_Lesson_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Bookmarked_Lesson_Max_Order_By>;
  min?: InputMaybe<Bookmarked_Lesson_Min_Order_By>;
  stddev?: InputMaybe<Bookmarked_Lesson_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Bookmarked_Lesson_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Bookmarked_Lesson_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Bookmarked_Lesson_Sum_Order_By>;
  var_pop?: InputMaybe<Bookmarked_Lesson_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Bookmarked_Lesson_Var_Samp_Order_By>;
  variance?: InputMaybe<Bookmarked_Lesson_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "bookmarked_lesson" */
export type Bookmarked_Lesson_Arr_Rel_Insert_Input = {
  data: Array<Bookmarked_Lesson_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Bookmarked_Lesson_On_Conflict>;
};

/** aggregate avg on columns */
export type Bookmarked_Lesson_Avg_Fields = {
  __typename?: 'bookmarked_lesson_avg_fields';
  lesson_id?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "bookmarked_lesson" */
export type Bookmarked_Lesson_Avg_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "bookmarked_lesson". All fields are combined with a logical 'AND'. */
export type Bookmarked_Lesson_Bool_Exp = {
  _and?: InputMaybe<Array<Bookmarked_Lesson_Bool_Exp>>;
  _not?: InputMaybe<Bookmarked_Lesson_Bool_Exp>;
  _or?: InputMaybe<Array<Bookmarked_Lesson_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  lesson_id?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<User_Bool_Exp>;
  user_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "bookmarked_lesson" */
export enum Bookmarked_Lesson_Constraint {
  /** unique or primary key constraint */
  BookmarkedLessonPkey = 'bookmarked_lesson_pkey'
}

/** input type for incrementing numeric columns in table "bookmarked_lesson" */
export type Bookmarked_Lesson_Inc_Input = {
  lesson_id?: InputMaybe<Scalars['Int']>;
  user_id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "bookmarked_lesson" */
export type Bookmarked_Lesson_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  lesson_id?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user?: InputMaybe<User_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Bookmarked_Lesson_Max_Fields = {
  __typename?: 'bookmarked_lesson_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  lesson_id?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "bookmarked_lesson" */
export type Bookmarked_Lesson_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Bookmarked_Lesson_Min_Fields = {
  __typename?: 'bookmarked_lesson_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  lesson_id?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "bookmarked_lesson" */
export type Bookmarked_Lesson_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "bookmarked_lesson" */
export type Bookmarked_Lesson_Mutation_Response = {
  __typename?: 'bookmarked_lesson_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Bookmarked_Lesson>;
};

/** on_conflict condition type for table "bookmarked_lesson" */
export type Bookmarked_Lesson_On_Conflict = {
  constraint: Bookmarked_Lesson_Constraint;
  update_columns?: Array<Bookmarked_Lesson_Update_Column>;
  where?: InputMaybe<Bookmarked_Lesson_Bool_Exp>;
};

/** Ordering options when selecting data from "bookmarked_lesson". */
export type Bookmarked_Lesson_Order_By = {
  created_at?: InputMaybe<Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<User_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: bookmarked_lesson */
export type Bookmarked_Lesson_Pk_Columns_Input = {
  lesson_id: Scalars['Int'];
  user_id: Scalars['Int'];
};

/** select columns of table "bookmarked_lesson" */
export enum Bookmarked_Lesson_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  LessonId = 'lesson_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "bookmarked_lesson" */
export type Bookmarked_Lesson_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  lesson_id?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_id?: InputMaybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Bookmarked_Lesson_Stddev_Fields = {
  __typename?: 'bookmarked_lesson_stddev_fields';
  lesson_id?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "bookmarked_lesson" */
export type Bookmarked_Lesson_Stddev_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Bookmarked_Lesson_Stddev_Pop_Fields = {
  __typename?: 'bookmarked_lesson_stddev_pop_fields';
  lesson_id?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "bookmarked_lesson" */
export type Bookmarked_Lesson_Stddev_Pop_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Bookmarked_Lesson_Stddev_Samp_Fields = {
  __typename?: 'bookmarked_lesson_stddev_samp_fields';
  lesson_id?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "bookmarked_lesson" */
export type Bookmarked_Lesson_Stddev_Samp_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Bookmarked_Lesson_Sum_Fields = {
  __typename?: 'bookmarked_lesson_sum_fields';
  lesson_id?: Maybe<Scalars['Int']>;
  user_id?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "bookmarked_lesson" */
export type Bookmarked_Lesson_Sum_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** update columns of table "bookmarked_lesson" */
export enum Bookmarked_Lesson_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  LessonId = 'lesson_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

/** aggregate var_pop on columns */
export type Bookmarked_Lesson_Var_Pop_Fields = {
  __typename?: 'bookmarked_lesson_var_pop_fields';
  lesson_id?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "bookmarked_lesson" */
export type Bookmarked_Lesson_Var_Pop_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Bookmarked_Lesson_Var_Samp_Fields = {
  __typename?: 'bookmarked_lesson_var_samp_fields';
  lesson_id?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "bookmarked_lesson" */
export type Bookmarked_Lesson_Var_Samp_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Bookmarked_Lesson_Variance_Fields = {
  __typename?: 'bookmarked_lesson_variance_fields';
  lesson_id?: Maybe<Scalars['Float']>;
  user_id?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "bookmarked_lesson" */
export type Bookmarked_Lesson_Variance_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "lesson" */
export type Lesson = {
  __typename?: 'lesson';
  id: Scalars['Int'];
  slug: Scalars['String'];
  title: Scalars['String'];
};

/** Boolean expression to filter rows from the table "lesson". All fields are combined with a logical 'AND'. */
export type Lesson_Bool_Exp = {
  _and?: InputMaybe<Array<Lesson_Bool_Exp>>;
  _not?: InputMaybe<Lesson_Bool_Exp>;
  _or?: InputMaybe<Array<Lesson_Bool_Exp>>;
  id?: InputMaybe<Int_Comparison_Exp>;
  slug?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "lesson". */
export type Lesson_Order_By = {
  id?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
};

/** select columns of table "lesson" */
export enum Lesson_Select_Column {
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
  /** delete data from the table: "bookmarked_lesson" */
  delete_bookmarked_lesson?: Maybe<Bookmarked_Lesson_Mutation_Response>;
  /** delete single row from the table: "bookmarked_lesson" */
  delete_bookmarked_lesson_by_pk?: Maybe<Bookmarked_Lesson>;
  /** delete data from the table: "user" */
  delete_user?: Maybe<User_Mutation_Response>;
  /** delete single row from the table: "user" */
  delete_user_by_pk?: Maybe<User>;
  /** insert data into the table: "bookmarked_lesson" */
  insert_bookmarked_lesson?: Maybe<Bookmarked_Lesson_Mutation_Response>;
  /** insert a single row into the table: "bookmarked_lesson" */
  insert_bookmarked_lesson_one?: Maybe<Bookmarked_Lesson>;
  /** insert data into the table: "user" */
  insert_user?: Maybe<User_Mutation_Response>;
  /** insert a single row into the table: "user" */
  insert_user_one?: Maybe<User>;
  /** update data of the table: "bookmarked_lesson" */
  update_bookmarked_lesson?: Maybe<Bookmarked_Lesson_Mutation_Response>;
  /** update single row of the table: "bookmarked_lesson" */
  update_bookmarked_lesson_by_pk?: Maybe<Bookmarked_Lesson>;
  /** update data of the table: "user" */
  update_user?: Maybe<User_Mutation_Response>;
  /** update single row of the table: "user" */
  update_user_by_pk?: Maybe<User>;
};


/** mutation root */
export type Mutation_RootDelete_Bookmarked_LessonArgs = {
  where: Bookmarked_Lesson_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Bookmarked_Lesson_By_PkArgs = {
  lesson_id: Scalars['Int'];
  user_id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_UserArgs = {
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_By_PkArgs = {
  id: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootInsert_Bookmarked_LessonArgs = {
  objects: Array<Bookmarked_Lesson_Insert_Input>;
  on_conflict?: InputMaybe<Bookmarked_Lesson_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bookmarked_Lesson_OneArgs = {
  object: Bookmarked_Lesson_Insert_Input;
  on_conflict?: InputMaybe<Bookmarked_Lesson_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UserArgs = {
  objects: Array<User_Insert_Input>;
  on_conflict?: InputMaybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_OneArgs = {
  object: User_Insert_Input;
  on_conflict?: InputMaybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_Bookmarked_LessonArgs = {
  _inc?: InputMaybe<Bookmarked_Lesson_Inc_Input>;
  _set?: InputMaybe<Bookmarked_Lesson_Set_Input>;
  where: Bookmarked_Lesson_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Bookmarked_Lesson_By_PkArgs = {
  _inc?: InputMaybe<Bookmarked_Lesson_Inc_Input>;
  _set?: InputMaybe<Bookmarked_Lesson_Set_Input>;
  pk_columns: Bookmarked_Lesson_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_UserArgs = {
  _inc?: InputMaybe<User_Inc_Input>;
  _set?: InputMaybe<User_Set_Input>;
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_By_PkArgs = {
  _inc?: InputMaybe<User_Inc_Input>;
  _set?: InputMaybe<User_Set_Input>;
  pk_columns: User_Pk_Columns_Input;
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
  /** fetch data from the table: "bookmarked_lesson" */
  bookmarked_lesson: Array<Bookmarked_Lesson>;
  /** fetch aggregated fields from the table: "bookmarked_lesson" */
  bookmarked_lesson_aggregate: Bookmarked_Lesson_Aggregate;
  /** fetch data from the table: "bookmarked_lesson" using primary key columns */
  bookmarked_lesson_by_pk?: Maybe<Bookmarked_Lesson>;
  /** fetch data from the table: "lesson" */
  lesson: Array<Lesson>;
  /** fetch data from the table: "lesson" using primary key columns */
  lesson_by_pk?: Maybe<Lesson>;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
};


export type Query_RootBookmarked_LessonArgs = {
  distinct_on?: InputMaybe<Array<Bookmarked_Lesson_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmarked_Lesson_Order_By>>;
  where?: InputMaybe<Bookmarked_Lesson_Bool_Exp>;
};


export type Query_RootBookmarked_Lesson_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bookmarked_Lesson_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmarked_Lesson_Order_By>>;
  where?: InputMaybe<Bookmarked_Lesson_Bool_Exp>;
};


export type Query_RootBookmarked_Lesson_By_PkArgs = {
  lesson_id: Scalars['Int'];
  user_id: Scalars['Int'];
};


export type Query_RootLessonArgs = {
  distinct_on?: InputMaybe<Array<Lesson_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lesson_Order_By>>;
  where?: InputMaybe<Lesson_Bool_Exp>;
};


export type Query_RootLesson_By_PkArgs = {
  id: Scalars['Int'];
};


export type Query_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_By_PkArgs = {
  id: Scalars['Int'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "bookmarked_lesson" */
  bookmarked_lesson: Array<Bookmarked_Lesson>;
  /** fetch aggregated fields from the table: "bookmarked_lesson" */
  bookmarked_lesson_aggregate: Bookmarked_Lesson_Aggregate;
  /** fetch data from the table: "bookmarked_lesson" using primary key columns */
  bookmarked_lesson_by_pk?: Maybe<Bookmarked_Lesson>;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
};


export type Subscription_RootBookmarked_LessonArgs = {
  distinct_on?: InputMaybe<Array<Bookmarked_Lesson_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmarked_Lesson_Order_By>>;
  where?: InputMaybe<Bookmarked_Lesson_Bool_Exp>;
};


export type Subscription_RootBookmarked_Lesson_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bookmarked_Lesson_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmarked_Lesson_Order_By>>;
  where?: InputMaybe<Bookmarked_Lesson_Bool_Exp>;
};


export type Subscription_RootBookmarked_Lesson_By_PkArgs = {
  lesson_id: Scalars['Int'];
  user_id: Scalars['Int'];
};


export type Subscription_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_By_PkArgs = {
  id: Scalars['Int'];
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

/** columns and relationships of "user" */
export type User = {
  __typename?: 'user';
  /** An array relationship */
  bookmarked_lessons: Array<Bookmarked_Lesson>;
  /** An aggregate relationship */
  bookmarked_lessons_aggregate: Bookmarked_Lesson_Aggregate;
  created_at?: Maybe<Scalars['timestamptz']>;
  email: Scalars['String'];
  firebase_id: Scalars['String'];
  id: Scalars['Int'];
  updated_at?: Maybe<Scalars['timestamptz']>;
};


/** columns and relationships of "user" */
export type UserBookmarked_LessonsArgs = {
  distinct_on?: InputMaybe<Array<Bookmarked_Lesson_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmarked_Lesson_Order_By>>;
  where?: InputMaybe<Bookmarked_Lesson_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserBookmarked_Lessons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bookmarked_Lesson_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Bookmarked_Lesson_Order_By>>;
  where?: InputMaybe<Bookmarked_Lesson_Bool_Exp>;
};

/** aggregated selection of "user" */
export type User_Aggregate = {
  __typename?: 'user_aggregate';
  aggregate?: Maybe<User_Aggregate_Fields>;
  nodes: Array<User>;
};

/** aggregate fields of "user" */
export type User_Aggregate_Fields = {
  __typename?: 'user_aggregate_fields';
  avg?: Maybe<User_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<User_Max_Fields>;
  min?: Maybe<User_Min_Fields>;
  stddev?: Maybe<User_Stddev_Fields>;
  stddev_pop?: Maybe<User_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<User_Stddev_Samp_Fields>;
  sum?: Maybe<User_Sum_Fields>;
  var_pop?: Maybe<User_Var_Pop_Fields>;
  var_samp?: Maybe<User_Var_Samp_Fields>;
  variance?: Maybe<User_Variance_Fields>;
};


/** aggregate fields of "user" */
export type User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type User_Avg_Fields = {
  __typename?: 'user_avg_fields';
  id?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "user". All fields are combined with a logical 'AND'. */
export type User_Bool_Exp = {
  _and?: InputMaybe<Array<User_Bool_Exp>>;
  _not?: InputMaybe<User_Bool_Exp>;
  _or?: InputMaybe<Array<User_Bool_Exp>>;
  bookmarked_lessons?: InputMaybe<Bookmarked_Lesson_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  firebase_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "user" */
export enum User_Constraint {
  /** unique or primary key constraint */
  UserFirebaseIdKey = 'user_firebase_id_key',
  /** unique or primary key constraint */
  UserPkey = 'user_pkey'
}

/** input type for incrementing numeric columns in table "user" */
export type User_Inc_Input = {
  id?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "user" */
export type User_Insert_Input = {
  bookmarked_lessons?: InputMaybe<Bookmarked_Lesson_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  email?: InputMaybe<Scalars['String']>;
  firebase_id?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type User_Max_Fields = {
  __typename?: 'user_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  firebase_id?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type User_Min_Fields = {
  __typename?: 'user_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  firebase_id?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "user" */
export type User_Mutation_Response = {
  __typename?: 'user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<User>;
};

/** input type for inserting object relation for remote table "user" */
export type User_Obj_Rel_Insert_Input = {
  data: User_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<User_On_Conflict>;
};

/** on_conflict condition type for table "user" */
export type User_On_Conflict = {
  constraint: User_Constraint;
  update_columns?: Array<User_Update_Column>;
  where?: InputMaybe<User_Bool_Exp>;
};

/** Ordering options when selecting data from "user". */
export type User_Order_By = {
  bookmarked_lessons_aggregate?: InputMaybe<Bookmarked_Lesson_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  firebase_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user */
export type User_Pk_Columns_Input = {
  id: Scalars['Int'];
};

/** select columns of table "user" */
export enum User_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  FirebaseId = 'firebase_id',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "user" */
export type User_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  email?: InputMaybe<Scalars['String']>;
  firebase_id?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type User_Stddev_Fields = {
  __typename?: 'user_stddev_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type User_Stddev_Pop_Fields = {
  __typename?: 'user_stddev_pop_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type User_Stddev_Samp_Fields = {
  __typename?: 'user_stddev_samp_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type User_Sum_Fields = {
  __typename?: 'user_sum_fields';
  id?: Maybe<Scalars['Int']>;
};

/** update columns of table "user" */
export enum User_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  FirebaseId = 'firebase_id',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type User_Var_Pop_Fields = {
  __typename?: 'user_var_pop_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type User_Var_Samp_Fields = {
  __typename?: 'user_var_samp_fields';
  id?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type User_Variance_Fields = {
  __typename?: 'user_variance_fields';
  id?: Maybe<Scalars['Float']>;
};

export type AllLessonsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllLessonsQuery = { __typename?: 'query_root', lesson: Array<{ __typename?: 'lesson', id: number, slug: string, title: string }> };

export type CreateUserMutationVariables = Exact<{
  user: User_Insert_Input;
}>;


export type CreateUserMutation = { __typename?: 'mutation_root', insert_user_one?: { __typename?: 'user', email: string, firebase_id: string, id: number } | null };

export type GetUsersByEmailQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type GetUsersByEmailQuery = { __typename?: 'query_root', user: Array<{ __typename?: 'user', id: number, firebase_id: string, email: string }> };

export type LessonsBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type LessonsBySlugQuery = { __typename?: 'query_root', lesson: Array<{ __typename?: 'lesson', id: number, slug: string, title: string }> };


export const AllLessonsDocument = gql`
    query allLessons {
  lesson {
    id
    slug
    title
  }
}
    `;
export const CreateUserDocument = gql`
    mutation createUser($user: user_insert_input!) {
  insert_user_one(object: $user) {
    email
    firebase_id
    id
  }
}
    `;
export const GetUsersByEmailDocument = gql`
    query getUsersByEmail($email: String!) {
  user(where: {email: {_eq: $email}}) {
    id
    firebase_id
    email
  }
}
    `;
export const LessonsBySlugDocument = gql`
    query lessonsBySlug($slug: String!) {
  lesson(where: {slug: {_eq: $slug}}) {
    id
    slug
    title
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    allLessons(variables?: AllLessonsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AllLessonsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllLessonsQuery>(AllLessonsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'allLessons');
    },
    createUser(variables: CreateUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateUserMutation>(CreateUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createUser');
    },
    getUsersByEmail(variables: GetUsersByEmailQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetUsersByEmailQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUsersByEmailQuery>(GetUsersByEmailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getUsersByEmail');
    },
    lessonsBySlug(variables: LessonsBySlugQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LessonsBySlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LessonsBySlugQuery>(LessonsBySlugDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'lessonsBySlug');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;