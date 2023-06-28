import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  bpchar: { input: any; output: any; }
  json: { input: any; output: any; }
  jsonb: { input: any; output: any; }
  numeric: { input: any; output: any; }
  timestamptz: { input: any; output: any; }
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "assets" */
export type Assets = {
  __typename?: 'assets';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  asset_id: Scalars['Int']['output'];
  asset_object: Scalars['jsonb']['output'];
  asset_type?: Maybe<Scalars['String']['output']>;
  asset_uid?: Maybe<Scalars['bpchar']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "assets" */
export type AssetsAsset_ObjectArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "assets" */
export type Assets_Aggregate = {
  __typename?: 'assets_aggregate';
  aggregate?: Maybe<Assets_Aggregate_Fields>;
  nodes: Array<Assets>;
};

export type Assets_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Assets_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Assets_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Assets_Aggregate_Bool_Exp_Count>;
};

export type Assets_Aggregate_Bool_Exp_Bool_And = {
  arguments: Assets_Select_Column_Assets_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Assets_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Assets_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Assets_Select_Column_Assets_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Assets_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Assets_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Assets_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Assets_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "assets" */
export type Assets_Aggregate_Fields = {
  __typename?: 'assets_aggregate_fields';
  avg?: Maybe<Assets_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Assets_Max_Fields>;
  min?: Maybe<Assets_Min_Fields>;
  stddev?: Maybe<Assets_Stddev_Fields>;
  stddev_pop?: Maybe<Assets_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Assets_Stddev_Samp_Fields>;
  sum?: Maybe<Assets_Sum_Fields>;
  var_pop?: Maybe<Assets_Var_Pop_Fields>;
  var_samp?: Maybe<Assets_Var_Samp_Fields>;
  variance?: Maybe<Assets_Variance_Fields>;
};


/** aggregate fields of "assets" */
export type Assets_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Assets_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "assets" */
export type Assets_Aggregate_Order_By = {
  avg?: InputMaybe<Assets_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Assets_Max_Order_By>;
  min?: InputMaybe<Assets_Min_Order_By>;
  stddev?: InputMaybe<Assets_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Assets_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Assets_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Assets_Sum_Order_By>;
  var_pop?: InputMaybe<Assets_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Assets_Var_Samp_Order_By>;
  variance?: InputMaybe<Assets_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Assets_Append_Input = {
  asset_object?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "assets" */
export type Assets_Arr_Rel_Insert_Input = {
  data: Array<Assets_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Assets_On_Conflict>;
};

/** aggregate avg on columns */
export type Assets_Avg_Fields = {
  __typename?: 'assets_avg_fields';
  asset_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "assets" */
export type Assets_Avg_Order_By = {
  asset_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "assets". All fields are combined with a logical 'AND'. */
export type Assets_Bool_Exp = {
  _and?: InputMaybe<Array<Assets_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Assets_Bool_Exp>;
  _or?: InputMaybe<Array<Assets_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  asset_id?: InputMaybe<Int_Comparison_Exp>;
  asset_object?: InputMaybe<Jsonb_Comparison_Exp>;
  asset_type?: InputMaybe<String_Comparison_Exp>;
  asset_uid?: InputMaybe<Bpchar_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "assets" */
export enum Assets_Constraint {
  /** unique or primary key constraint on columns "asset_id", "_state" */
  AssetsPkey = 'assets_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Assets_Delete_At_Path_Input = {
  asset_object?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Assets_Delete_Elem_Input = {
  asset_object?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Assets_Delete_Key_Input = {
  asset_object?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "assets" */
export type Assets_Inc_Input = {
  asset_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "assets" */
export type Assets_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  asset_id?: InputMaybe<Scalars['Int']['input']>;
  asset_object?: InputMaybe<Scalars['jsonb']['input']>;
  asset_type?: InputMaybe<Scalars['String']['input']>;
  asset_uid?: InputMaybe<Scalars['bpchar']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Assets_Max_Fields = {
  __typename?: 'assets_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  asset_id?: Maybe<Scalars['Int']['output']>;
  asset_type?: Maybe<Scalars['String']['output']>;
  asset_uid?: Maybe<Scalars['bpchar']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "assets" */
export type Assets_Max_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  asset_id?: InputMaybe<Order_By>;
  asset_type?: InputMaybe<Order_By>;
  asset_uid?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Assets_Min_Fields = {
  __typename?: 'assets_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  asset_id?: Maybe<Scalars['Int']['output']>;
  asset_type?: Maybe<Scalars['String']['output']>;
  asset_uid?: Maybe<Scalars['bpchar']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "assets" */
export type Assets_Min_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  asset_id?: InputMaybe<Order_By>;
  asset_type?: InputMaybe<Order_By>;
  asset_uid?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "assets" */
export type Assets_Mutation_Response = {
  __typename?: 'assets_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Assets>;
};

/** input type for inserting object relation for remote table "assets" */
export type Assets_Obj_Rel_Insert_Input = {
  data: Assets_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Assets_On_Conflict>;
};

/** on_conflict condition type for table "assets" */
export type Assets_On_Conflict = {
  constraint: Assets_Constraint;
  update_columns?: Array<Assets_Update_Column>;
  where?: InputMaybe<Assets_Bool_Exp>;
};

/** Ordering options when selecting data from "assets". */
export type Assets_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  asset_id?: InputMaybe<Order_By>;
  asset_object?: InputMaybe<Order_By>;
  asset_type?: InputMaybe<Order_By>;
  asset_uid?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
};

/** primary key columns input for table: assets */
export type Assets_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  asset_id: Scalars['Int']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Assets_Prepend_Input = {
  asset_object?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "assets" */
export enum Assets_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  AssetId = 'asset_id',
  /** column name */
  AssetObject = 'asset_object',
  /** column name */
  AssetType = 'asset_type',
  /** column name */
  AssetUid = 'asset_uid',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Url = 'url'
}

/** select "assets_aggregate_bool_exp_bool_and_arguments_columns" columns of table "assets" */
export enum Assets_Select_Column_Assets_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** select "assets_aggregate_bool_exp_bool_or_arguments_columns" columns of table "assets" */
export enum Assets_Select_Column_Assets_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** input type for updating data in table "assets" */
export type Assets_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  asset_id?: InputMaybe<Scalars['Int']['input']>;
  asset_object?: InputMaybe<Scalars['jsonb']['input']>;
  asset_type?: InputMaybe<Scalars['String']['input']>;
  asset_uid?: InputMaybe<Scalars['bpchar']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Assets_Stddev_Fields = {
  __typename?: 'assets_stddev_fields';
  asset_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "assets" */
export type Assets_Stddev_Order_By = {
  asset_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Assets_Stddev_Pop_Fields = {
  __typename?: 'assets_stddev_pop_fields';
  asset_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "assets" */
export type Assets_Stddev_Pop_Order_By = {
  asset_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Assets_Stddev_Samp_Fields = {
  __typename?: 'assets_stddev_samp_fields';
  asset_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "assets" */
export type Assets_Stddev_Samp_Order_By = {
  asset_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "assets" */
export type Assets_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Assets_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Assets_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  asset_id?: InputMaybe<Scalars['Int']['input']>;
  asset_object?: InputMaybe<Scalars['jsonb']['input']>;
  asset_type?: InputMaybe<Scalars['String']['input']>;
  asset_uid?: InputMaybe<Scalars['bpchar']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Assets_Sum_Fields = {
  __typename?: 'assets_sum_fields';
  asset_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "assets" */
export type Assets_Sum_Order_By = {
  asset_id?: InputMaybe<Order_By>;
};

/** update columns of table "assets" */
export enum Assets_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  AssetId = 'asset_id',
  /** column name */
  AssetObject = 'asset_object',
  /** column name */
  AssetType = 'asset_type',
  /** column name */
  AssetUid = 'asset_uid',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Url = 'url'
}

export type Assets_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Assets_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Assets_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Assets_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Assets_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Assets_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Assets_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Assets_Set_Input>;
  /** filter the rows which have to be updated */
  where: Assets_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Assets_Var_Pop_Fields = {
  __typename?: 'assets_var_pop_fields';
  asset_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "assets" */
export type Assets_Var_Pop_Order_By = {
  asset_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Assets_Var_Samp_Fields = {
  __typename?: 'assets_var_samp_fields';
  asset_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "assets" */
export type Assets_Var_Samp_Order_By = {
  asset_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Assets_Variance_Fields = {
  __typename?: 'assets_variance_fields';
  asset_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "assets" */
export type Assets_Variance_Order_By = {
  asset_id?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "bpchar". All fields are combined with logical 'AND'. */
export type Bpchar_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bpchar']['input']>;
  _gt?: InputMaybe<Scalars['bpchar']['input']>;
  _gte?: InputMaybe<Scalars['bpchar']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['bpchar']['input']>;
  _in?: InputMaybe<Array<Scalars['bpchar']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['bpchar']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['bpchar']['input']>;
  _lt?: InputMaybe<Scalars['bpchar']['input']>;
  _lte?: InputMaybe<Scalars['bpchar']['input']>;
  _neq?: InputMaybe<Scalars['bpchar']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['bpchar']['input']>;
  _nin?: InputMaybe<Array<Scalars['bpchar']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['bpchar']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['bpchar']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['bpchar']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['bpchar']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['bpchar']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['bpchar']['input']>;
};

/** columns and relationships of "cat_contentguidance" */
export type Cat_Contentguidance = {
  __typename?: 'cat_contentguidance';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  contentguidance_area?: Maybe<Scalars['String']['output']>;
  contentguidance_code?: Maybe<Scalars['String']['output']>;
  contentguidance_description?: Maybe<Scalars['String']['output']>;
  contentguidance_id: Scalars['Int']['output'];
  contentguidance_label?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** A computed field, executes function "function__cat_contentguidance__lessons" */
  lessons_with_contentguidance?: Maybe<Array<Lessons>>;
  /** A computed field, executes function "function__cat_contentguidance__lessons__count" */
  lessons_with_contentguidance_count?: Maybe<Scalars['Int']['output']>;
  programme_fields: Scalars['jsonb']['output'];
  /** An object relationship */
  supervisionlevel?: Maybe<Cat_Supervisionlevels>;
  supervisionlevel_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "cat_contentguidance" */
export type Cat_ContentguidanceLessons_With_ContentguidanceArgs = {
  distinct_on?: InputMaybe<Array<Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Lessons_Order_By>>;
  where?: InputMaybe<Lessons_Bool_Exp>;
};


/** columns and relationships of "cat_contentguidance" */
export type Cat_ContentguidanceProgramme_FieldsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "cat_contentguidance" */
export type Cat_Contentguidance_Aggregate = {
  __typename?: 'cat_contentguidance_aggregate';
  aggregate?: Maybe<Cat_Contentguidance_Aggregate_Fields>;
  nodes: Array<Cat_Contentguidance>;
};

/** aggregate fields of "cat_contentguidance" */
export type Cat_Contentguidance_Aggregate_Fields = {
  __typename?: 'cat_contentguidance_aggregate_fields';
  avg?: Maybe<Cat_Contentguidance_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Cat_Contentguidance_Max_Fields>;
  min?: Maybe<Cat_Contentguidance_Min_Fields>;
  stddev?: Maybe<Cat_Contentguidance_Stddev_Fields>;
  stddev_pop?: Maybe<Cat_Contentguidance_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Cat_Contentguidance_Stddev_Samp_Fields>;
  sum?: Maybe<Cat_Contentguidance_Sum_Fields>;
  var_pop?: Maybe<Cat_Contentguidance_Var_Pop_Fields>;
  var_samp?: Maybe<Cat_Contentguidance_Var_Samp_Fields>;
  variance?: Maybe<Cat_Contentguidance_Variance_Fields>;
};


/** aggregate fields of "cat_contentguidance" */
export type Cat_Contentguidance_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cat_Contentguidance_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Cat_Contentguidance_Append_Input = {
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Cat_Contentguidance_Avg_Fields = {
  __typename?: 'cat_contentguidance_avg_fields';
  contentguidance_id?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "cat_contentguidance". All fields are combined with a logical 'AND'. */
export type Cat_Contentguidance_Bool_Exp = {
  _and?: InputMaybe<Array<Cat_Contentguidance_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Cat_Contentguidance_Bool_Exp>;
  _or?: InputMaybe<Array<Cat_Contentguidance_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  contentguidance_area?: InputMaybe<String_Comparison_Exp>;
  contentguidance_code?: InputMaybe<String_Comparison_Exp>;
  contentguidance_description?: InputMaybe<String_Comparison_Exp>;
  contentguidance_id?: InputMaybe<Int_Comparison_Exp>;
  contentguidance_label?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  lessons_with_contentguidance?: InputMaybe<Lessons_Bool_Exp>;
  lessons_with_contentguidance_count?: InputMaybe<Int_Comparison_Exp>;
  programme_fields?: InputMaybe<Jsonb_Comparison_Exp>;
  supervisionlevel?: InputMaybe<Cat_Supervisionlevels_Bool_Exp>;
  supervisionlevel_id?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "cat_contentguidance" */
export enum Cat_Contentguidance_Constraint {
  /** unique or primary key constraint on columns "_state", "contentguidance_id" */
  CatContentguidancePkey = 'cat_contentguidance_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Cat_Contentguidance_Delete_At_Path_Input = {
  programme_fields?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Cat_Contentguidance_Delete_Elem_Input = {
  programme_fields?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Cat_Contentguidance_Delete_Key_Input = {
  programme_fields?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "cat_contentguidance" */
export type Cat_Contentguidance_Inc_Input = {
  contentguidance_id?: InputMaybe<Scalars['Int']['input']>;
  supervisionlevel_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "cat_contentguidance" */
export type Cat_Contentguidance_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  contentguidance_area?: InputMaybe<Scalars['String']['input']>;
  contentguidance_code?: InputMaybe<Scalars['String']['input']>;
  contentguidance_description?: InputMaybe<Scalars['String']['input']>;
  contentguidance_id?: InputMaybe<Scalars['Int']['input']>;
  contentguidance_label?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  supervisionlevel?: InputMaybe<Cat_Supervisionlevels_Obj_Rel_Insert_Input>;
  supervisionlevel_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Cat_Contentguidance_Max_Fields = {
  __typename?: 'cat_contentguidance_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  contentguidance_area?: Maybe<Scalars['String']['output']>;
  contentguidance_code?: Maybe<Scalars['String']['output']>;
  contentguidance_description?: Maybe<Scalars['String']['output']>;
  contentguidance_id?: Maybe<Scalars['Int']['output']>;
  contentguidance_label?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Cat_Contentguidance_Min_Fields = {
  __typename?: 'cat_contentguidance_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  contentguidance_area?: Maybe<Scalars['String']['output']>;
  contentguidance_code?: Maybe<Scalars['String']['output']>;
  contentguidance_description?: Maybe<Scalars['String']['output']>;
  contentguidance_id?: Maybe<Scalars['Int']['output']>;
  contentguidance_label?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "cat_contentguidance" */
export type Cat_Contentguidance_Mutation_Response = {
  __typename?: 'cat_contentguidance_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Cat_Contentguidance>;
};

/** on_conflict condition type for table "cat_contentguidance" */
export type Cat_Contentguidance_On_Conflict = {
  constraint: Cat_Contentguidance_Constraint;
  update_columns?: Array<Cat_Contentguidance_Update_Column>;
  where?: InputMaybe<Cat_Contentguidance_Bool_Exp>;
};

/** Ordering options when selecting data from "cat_contentguidance". */
export type Cat_Contentguidance_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  contentguidance_area?: InputMaybe<Order_By>;
  contentguidance_code?: InputMaybe<Order_By>;
  contentguidance_description?: InputMaybe<Order_By>;
  contentguidance_id?: InputMaybe<Order_By>;
  contentguidance_label?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  lessons_with_contentguidance_aggregate?: InputMaybe<Lessons_Aggregate_Order_By>;
  lessons_with_contentguidance_count?: InputMaybe<Order_By>;
  programme_fields?: InputMaybe<Order_By>;
  supervisionlevel?: InputMaybe<Cat_Supervisionlevels_Order_By>;
  supervisionlevel_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cat_contentguidance */
export type Cat_Contentguidance_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  contentguidance_id: Scalars['Int']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Cat_Contentguidance_Prepend_Input = {
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "cat_contentguidance" */
export enum Cat_Contentguidance_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  ContentguidanceArea = 'contentguidance_area',
  /** column name */
  ContentguidanceCode = 'contentguidance_code',
  /** column name */
  ContentguidanceDescription = 'contentguidance_description',
  /** column name */
  ContentguidanceId = 'contentguidance_id',
  /** column name */
  ContentguidanceLabel = 'contentguidance_label',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  ProgrammeFields = 'programme_fields',
  /** column name */
  SupervisionlevelId = 'supervisionlevel_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "cat_contentguidance" */
export type Cat_Contentguidance_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  contentguidance_area?: InputMaybe<Scalars['String']['input']>;
  contentguidance_code?: InputMaybe<Scalars['String']['input']>;
  contentguidance_description?: InputMaybe<Scalars['String']['input']>;
  contentguidance_id?: InputMaybe<Scalars['Int']['input']>;
  contentguidance_label?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  supervisionlevel_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Cat_Contentguidance_Stddev_Fields = {
  __typename?: 'cat_contentguidance_stddev_fields';
  contentguidance_id?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Cat_Contentguidance_Stddev_Pop_Fields = {
  __typename?: 'cat_contentguidance_stddev_pop_fields';
  contentguidance_id?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Cat_Contentguidance_Stddev_Samp_Fields = {
  __typename?: 'cat_contentguidance_stddev_samp_fields';
  contentguidance_id?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "cat_contentguidance" */
export type Cat_Contentguidance_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Cat_Contentguidance_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Cat_Contentguidance_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  contentguidance_area?: InputMaybe<Scalars['String']['input']>;
  contentguidance_code?: InputMaybe<Scalars['String']['input']>;
  contentguidance_description?: InputMaybe<Scalars['String']['input']>;
  contentguidance_id?: InputMaybe<Scalars['Int']['input']>;
  contentguidance_label?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  supervisionlevel_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Cat_Contentguidance_Sum_Fields = {
  __typename?: 'cat_contentguidance_sum_fields';
  contentguidance_id?: Maybe<Scalars['Int']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "cat_contentguidance" */
export enum Cat_Contentguidance_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  ContentguidanceArea = 'contentguidance_area',
  /** column name */
  ContentguidanceCode = 'contentguidance_code',
  /** column name */
  ContentguidanceDescription = 'contentguidance_description',
  /** column name */
  ContentguidanceId = 'contentguidance_id',
  /** column name */
  ContentguidanceLabel = 'contentguidance_label',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  ProgrammeFields = 'programme_fields',
  /** column name */
  SupervisionlevelId = 'supervisionlevel_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Cat_Contentguidance_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Cat_Contentguidance_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Cat_Contentguidance_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Cat_Contentguidance_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Cat_Contentguidance_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Cat_Contentguidance_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Cat_Contentguidance_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Cat_Contentguidance_Set_Input>;
  /** filter the rows which have to be updated */
  where: Cat_Contentguidance_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Cat_Contentguidance_Var_Pop_Fields = {
  __typename?: 'cat_contentguidance_var_pop_fields';
  contentguidance_id?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Cat_Contentguidance_Var_Samp_Fields = {
  __typename?: 'cat_contentguidance_var_samp_fields';
  contentguidance_id?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Cat_Contentguidance_Variance_Fields = {
  __typename?: 'cat_contentguidance_variance_fields';
  contentguidance_id?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "cat_examboardspecs" */
export type Cat_Examboardspecs = {
  __typename?: 'cat_examboardspecs';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  examboardspecs_id: Scalars['Int']['output'];
  programme_fields: Scalars['jsonb']['output'];
  title?: Maybe<Scalars['String']['output']>;
  /** A computed field, executes function "function__cat_examboardspecs__units" */
  units_with_exam_board_specification?: Maybe<Array<Units>>;
  /** A computed field, executes function "function__cat_examboardspecs__units__count" */
  units_with_exam_board_specification_count?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "cat_examboardspecs" */
export type Cat_ExamboardspecsProgramme_FieldsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "cat_examboardspecs" */
export type Cat_ExamboardspecsUnits_With_Exam_Board_SpecificationArgs = {
  distinct_on?: InputMaybe<Array<Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Units_Order_By>>;
  where?: InputMaybe<Units_Bool_Exp>;
};

/** aggregated selection of "cat_examboardspecs" */
export type Cat_Examboardspecs_Aggregate = {
  __typename?: 'cat_examboardspecs_aggregate';
  aggregate?: Maybe<Cat_Examboardspecs_Aggregate_Fields>;
  nodes: Array<Cat_Examboardspecs>;
};

/** aggregate fields of "cat_examboardspecs" */
export type Cat_Examboardspecs_Aggregate_Fields = {
  __typename?: 'cat_examboardspecs_aggregate_fields';
  avg?: Maybe<Cat_Examboardspecs_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Cat_Examboardspecs_Max_Fields>;
  min?: Maybe<Cat_Examboardspecs_Min_Fields>;
  stddev?: Maybe<Cat_Examboardspecs_Stddev_Fields>;
  stddev_pop?: Maybe<Cat_Examboardspecs_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Cat_Examboardspecs_Stddev_Samp_Fields>;
  sum?: Maybe<Cat_Examboardspecs_Sum_Fields>;
  var_pop?: Maybe<Cat_Examboardspecs_Var_Pop_Fields>;
  var_samp?: Maybe<Cat_Examboardspecs_Var_Samp_Fields>;
  variance?: Maybe<Cat_Examboardspecs_Variance_Fields>;
};


/** aggregate fields of "cat_examboardspecs" */
export type Cat_Examboardspecs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cat_Examboardspecs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Cat_Examboardspecs_Append_Input = {
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Cat_Examboardspecs_Avg_Fields = {
  __typename?: 'cat_examboardspecs_avg_fields';
  examboardspecs_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "cat_examboardspecs". All fields are combined with a logical 'AND'. */
export type Cat_Examboardspecs_Bool_Exp = {
  _and?: InputMaybe<Array<Cat_Examboardspecs_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Cat_Examboardspecs_Bool_Exp>;
  _or?: InputMaybe<Array<Cat_Examboardspecs_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  examboardspecs_id?: InputMaybe<Int_Comparison_Exp>;
  programme_fields?: InputMaybe<Jsonb_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  units_with_exam_board_specification?: InputMaybe<Units_Bool_Exp>;
  units_with_exam_board_specification_count?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "cat_examboardspecs" */
export enum Cat_Examboardspecs_Constraint {
  /** unique or primary key constraint on columns "_state", "examboardspecs_id" */
  CatExamboardspecsPkey = 'cat_examboardspecs_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Cat_Examboardspecs_Delete_At_Path_Input = {
  programme_fields?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Cat_Examboardspecs_Delete_Elem_Input = {
  programme_fields?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Cat_Examboardspecs_Delete_Key_Input = {
  programme_fields?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "cat_examboardspecs" */
export type Cat_Examboardspecs_Inc_Input = {
  examboardspecs_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "cat_examboardspecs" */
export type Cat_Examboardspecs_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  examboardspecs_id?: InputMaybe<Scalars['Int']['input']>;
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Cat_Examboardspecs_Max_Fields = {
  __typename?: 'cat_examboardspecs_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  examboardspecs_id?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Cat_Examboardspecs_Min_Fields = {
  __typename?: 'cat_examboardspecs_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  examboardspecs_id?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "cat_examboardspecs" */
export type Cat_Examboardspecs_Mutation_Response = {
  __typename?: 'cat_examboardspecs_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Cat_Examboardspecs>;
};

/** on_conflict condition type for table "cat_examboardspecs" */
export type Cat_Examboardspecs_On_Conflict = {
  constraint: Cat_Examboardspecs_Constraint;
  update_columns?: Array<Cat_Examboardspecs_Update_Column>;
  where?: InputMaybe<Cat_Examboardspecs_Bool_Exp>;
};

/** Ordering options when selecting data from "cat_examboardspecs". */
export type Cat_Examboardspecs_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  examboardspecs_id?: InputMaybe<Order_By>;
  programme_fields?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  units_with_exam_board_specification_aggregate?: InputMaybe<Units_Aggregate_Order_By>;
  units_with_exam_board_specification_count?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cat_examboardspecs */
export type Cat_Examboardspecs_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  examboardspecs_id: Scalars['Int']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Cat_Examboardspecs_Prepend_Input = {
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "cat_examboardspecs" */
export enum Cat_Examboardspecs_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  ExamboardspecsId = 'examboardspecs_id',
  /** column name */
  ProgrammeFields = 'programme_fields',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "cat_examboardspecs" */
export type Cat_Examboardspecs_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  examboardspecs_id?: InputMaybe<Scalars['Int']['input']>;
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Cat_Examboardspecs_Stddev_Fields = {
  __typename?: 'cat_examboardspecs_stddev_fields';
  examboardspecs_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Cat_Examboardspecs_Stddev_Pop_Fields = {
  __typename?: 'cat_examboardspecs_stddev_pop_fields';
  examboardspecs_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Cat_Examboardspecs_Stddev_Samp_Fields = {
  __typename?: 'cat_examboardspecs_stddev_samp_fields';
  examboardspecs_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "cat_examboardspecs" */
export type Cat_Examboardspecs_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Cat_Examboardspecs_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Cat_Examboardspecs_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  examboardspecs_id?: InputMaybe<Scalars['Int']['input']>;
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Cat_Examboardspecs_Sum_Fields = {
  __typename?: 'cat_examboardspecs_sum_fields';
  examboardspecs_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "cat_examboardspecs" */
export enum Cat_Examboardspecs_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  ExamboardspecsId = 'examboardspecs_id',
  /** column name */
  ProgrammeFields = 'programme_fields',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Cat_Examboardspecs_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Cat_Examboardspecs_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Cat_Examboardspecs_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Cat_Examboardspecs_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Cat_Examboardspecs_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Cat_Examboardspecs_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Cat_Examboardspecs_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Cat_Examboardspecs_Set_Input>;
  /** filter the rows which have to be updated */
  where: Cat_Examboardspecs_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Cat_Examboardspecs_Var_Pop_Fields = {
  __typename?: 'cat_examboardspecs_var_pop_fields';
  examboardspecs_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Cat_Examboardspecs_Var_Samp_Fields = {
  __typename?: 'cat_examboardspecs_var_samp_fields';
  examboardspecs_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Cat_Examboardspecs_Variance_Fields = {
  __typename?: 'cat_examboardspecs_variance_fields';
  examboardspecs_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "cat_nationalcurriculum" */
export type Cat_Nationalcurriculum = {
  __typename?: 'cat_nationalcurriculum';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  nationalcurriculum_id: Scalars['Int']['output'];
  programme_fields: Scalars['jsonb']['output'];
  title?: Maybe<Scalars['String']['output']>;
  /** A computed field, executes function "function__cat_nationalcurriculum__units" */
  units_with_national_curriculum_content?: Maybe<Array<Units>>;
  /** A computed field, executes function "function__cat_nationalcurriculum__units__count" */
  units_with_national_curriculum_content_count?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "cat_nationalcurriculum" */
export type Cat_NationalcurriculumProgramme_FieldsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "cat_nationalcurriculum" */
export type Cat_NationalcurriculumUnits_With_National_Curriculum_ContentArgs = {
  distinct_on?: InputMaybe<Array<Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Units_Order_By>>;
  where?: InputMaybe<Units_Bool_Exp>;
};

/** aggregated selection of "cat_nationalcurriculum" */
export type Cat_Nationalcurriculum_Aggregate = {
  __typename?: 'cat_nationalcurriculum_aggregate';
  aggregate?: Maybe<Cat_Nationalcurriculum_Aggregate_Fields>;
  nodes: Array<Cat_Nationalcurriculum>;
};

/** aggregate fields of "cat_nationalcurriculum" */
export type Cat_Nationalcurriculum_Aggregate_Fields = {
  __typename?: 'cat_nationalcurriculum_aggregate_fields';
  avg?: Maybe<Cat_Nationalcurriculum_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Cat_Nationalcurriculum_Max_Fields>;
  min?: Maybe<Cat_Nationalcurriculum_Min_Fields>;
  stddev?: Maybe<Cat_Nationalcurriculum_Stddev_Fields>;
  stddev_pop?: Maybe<Cat_Nationalcurriculum_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Cat_Nationalcurriculum_Stddev_Samp_Fields>;
  sum?: Maybe<Cat_Nationalcurriculum_Sum_Fields>;
  var_pop?: Maybe<Cat_Nationalcurriculum_Var_Pop_Fields>;
  var_samp?: Maybe<Cat_Nationalcurriculum_Var_Samp_Fields>;
  variance?: Maybe<Cat_Nationalcurriculum_Variance_Fields>;
};


/** aggregate fields of "cat_nationalcurriculum" */
export type Cat_Nationalcurriculum_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cat_Nationalcurriculum_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Cat_Nationalcurriculum_Append_Input = {
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Cat_Nationalcurriculum_Avg_Fields = {
  __typename?: 'cat_nationalcurriculum_avg_fields';
  nationalcurriculum_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "cat_nationalcurriculum". All fields are combined with a logical 'AND'. */
export type Cat_Nationalcurriculum_Bool_Exp = {
  _and?: InputMaybe<Array<Cat_Nationalcurriculum_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Cat_Nationalcurriculum_Bool_Exp>;
  _or?: InputMaybe<Array<Cat_Nationalcurriculum_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  nationalcurriculum_id?: InputMaybe<Int_Comparison_Exp>;
  programme_fields?: InputMaybe<Jsonb_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  units_with_national_curriculum_content?: InputMaybe<Units_Bool_Exp>;
  units_with_national_curriculum_content_count?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "cat_nationalcurriculum" */
export enum Cat_Nationalcurriculum_Constraint {
  /** unique or primary key constraint on columns "nationalcurriculum_id", "_state" */
  CatNationalcurriculumPkey = 'cat_nationalcurriculum_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Cat_Nationalcurriculum_Delete_At_Path_Input = {
  programme_fields?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Cat_Nationalcurriculum_Delete_Elem_Input = {
  programme_fields?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Cat_Nationalcurriculum_Delete_Key_Input = {
  programme_fields?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "cat_nationalcurriculum" */
export type Cat_Nationalcurriculum_Inc_Input = {
  nationalcurriculum_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "cat_nationalcurriculum" */
export type Cat_Nationalcurriculum_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  nationalcurriculum_id?: InputMaybe<Scalars['Int']['input']>;
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Cat_Nationalcurriculum_Max_Fields = {
  __typename?: 'cat_nationalcurriculum_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  nationalcurriculum_id?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Cat_Nationalcurriculum_Min_Fields = {
  __typename?: 'cat_nationalcurriculum_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  nationalcurriculum_id?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "cat_nationalcurriculum" */
export type Cat_Nationalcurriculum_Mutation_Response = {
  __typename?: 'cat_nationalcurriculum_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Cat_Nationalcurriculum>;
};

/** on_conflict condition type for table "cat_nationalcurriculum" */
export type Cat_Nationalcurriculum_On_Conflict = {
  constraint: Cat_Nationalcurriculum_Constraint;
  update_columns?: Array<Cat_Nationalcurriculum_Update_Column>;
  where?: InputMaybe<Cat_Nationalcurriculum_Bool_Exp>;
};

/** Ordering options when selecting data from "cat_nationalcurriculum". */
export type Cat_Nationalcurriculum_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  nationalcurriculum_id?: InputMaybe<Order_By>;
  programme_fields?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  units_with_national_curriculum_content_aggregate?: InputMaybe<Units_Aggregate_Order_By>;
  units_with_national_curriculum_content_count?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cat_nationalcurriculum */
export type Cat_Nationalcurriculum_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  nationalcurriculum_id: Scalars['Int']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Cat_Nationalcurriculum_Prepend_Input = {
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "cat_nationalcurriculum" */
export enum Cat_Nationalcurriculum_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  NationalcurriculumId = 'nationalcurriculum_id',
  /** column name */
  ProgrammeFields = 'programme_fields',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "cat_nationalcurriculum" */
export type Cat_Nationalcurriculum_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  nationalcurriculum_id?: InputMaybe<Scalars['Int']['input']>;
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Cat_Nationalcurriculum_Stddev_Fields = {
  __typename?: 'cat_nationalcurriculum_stddev_fields';
  nationalcurriculum_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Cat_Nationalcurriculum_Stddev_Pop_Fields = {
  __typename?: 'cat_nationalcurriculum_stddev_pop_fields';
  nationalcurriculum_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Cat_Nationalcurriculum_Stddev_Samp_Fields = {
  __typename?: 'cat_nationalcurriculum_stddev_samp_fields';
  nationalcurriculum_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "cat_nationalcurriculum" */
export type Cat_Nationalcurriculum_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Cat_Nationalcurriculum_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Cat_Nationalcurriculum_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  nationalcurriculum_id?: InputMaybe<Scalars['Int']['input']>;
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Cat_Nationalcurriculum_Sum_Fields = {
  __typename?: 'cat_nationalcurriculum_sum_fields';
  nationalcurriculum_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "cat_nationalcurriculum" */
export enum Cat_Nationalcurriculum_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  NationalcurriculumId = 'nationalcurriculum_id',
  /** column name */
  ProgrammeFields = 'programme_fields',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Cat_Nationalcurriculum_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Cat_Nationalcurriculum_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Cat_Nationalcurriculum_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Cat_Nationalcurriculum_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Cat_Nationalcurriculum_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Cat_Nationalcurriculum_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Cat_Nationalcurriculum_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Cat_Nationalcurriculum_Set_Input>;
  /** filter the rows which have to be updated */
  where: Cat_Nationalcurriculum_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Cat_Nationalcurriculum_Var_Pop_Fields = {
  __typename?: 'cat_nationalcurriculum_var_pop_fields';
  nationalcurriculum_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Cat_Nationalcurriculum_Var_Samp_Fields = {
  __typename?: 'cat_nationalcurriculum_var_samp_fields';
  nationalcurriculum_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Cat_Nationalcurriculum_Variance_Fields = {
  __typename?: 'cat_nationalcurriculum_variance_fields';
  nationalcurriculum_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "cat_supervisionlevels" */
export type Cat_Supervisionlevels = {
  __typename?: 'cat_supervisionlevels';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  supervisionlevel_id: Scalars['Int']['output'];
  supervisionlevel_rating?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "cat_supervisionlevels" */
export type Cat_Supervisionlevels_Aggregate = {
  __typename?: 'cat_supervisionlevels_aggregate';
  aggregate?: Maybe<Cat_Supervisionlevels_Aggregate_Fields>;
  nodes: Array<Cat_Supervisionlevels>;
};

/** aggregate fields of "cat_supervisionlevels" */
export type Cat_Supervisionlevels_Aggregate_Fields = {
  __typename?: 'cat_supervisionlevels_aggregate_fields';
  avg?: Maybe<Cat_Supervisionlevels_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Cat_Supervisionlevels_Max_Fields>;
  min?: Maybe<Cat_Supervisionlevels_Min_Fields>;
  stddev?: Maybe<Cat_Supervisionlevels_Stddev_Fields>;
  stddev_pop?: Maybe<Cat_Supervisionlevels_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Cat_Supervisionlevels_Stddev_Samp_Fields>;
  sum?: Maybe<Cat_Supervisionlevels_Sum_Fields>;
  var_pop?: Maybe<Cat_Supervisionlevels_Var_Pop_Fields>;
  var_samp?: Maybe<Cat_Supervisionlevels_Var_Samp_Fields>;
  variance?: Maybe<Cat_Supervisionlevels_Variance_Fields>;
};


/** aggregate fields of "cat_supervisionlevels" */
export type Cat_Supervisionlevels_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cat_Supervisionlevels_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Cat_Supervisionlevels_Avg_Fields = {
  __typename?: 'cat_supervisionlevels_avg_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_rating?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "cat_supervisionlevels". All fields are combined with a logical 'AND'. */
export type Cat_Supervisionlevels_Bool_Exp = {
  _and?: InputMaybe<Array<Cat_Supervisionlevels_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Cat_Supervisionlevels_Bool_Exp>;
  _or?: InputMaybe<Array<Cat_Supervisionlevels_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  display_order?: InputMaybe<Int_Comparison_Exp>;
  supervisionlevel_id?: InputMaybe<Int_Comparison_Exp>;
  supervisionlevel_rating?: InputMaybe<Int_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "cat_supervisionlevels" */
export enum Cat_Supervisionlevels_Constraint {
  /** unique or primary key constraint on columns "supervisionlevel_id", "_state" */
  CatSupervisionlevelsPkey = 'cat_supervisionlevels_pkey'
}

/** input type for incrementing numeric columns in table "cat_supervisionlevels" */
export type Cat_Supervisionlevels_Inc_Input = {
  display_order?: InputMaybe<Scalars['Int']['input']>;
  supervisionlevel_id?: InputMaybe<Scalars['Int']['input']>;
  supervisionlevel_rating?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "cat_supervisionlevels" */
export type Cat_Supervisionlevels_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  supervisionlevel_id?: InputMaybe<Scalars['Int']['input']>;
  supervisionlevel_rating?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Cat_Supervisionlevels_Max_Fields = {
  __typename?: 'cat_supervisionlevels_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Int']['output']>;
  supervisionlevel_rating?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Cat_Supervisionlevels_Min_Fields = {
  __typename?: 'cat_supervisionlevels_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Int']['output']>;
  supervisionlevel_rating?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "cat_supervisionlevels" */
export type Cat_Supervisionlevels_Mutation_Response = {
  __typename?: 'cat_supervisionlevels_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Cat_Supervisionlevels>;
};

/** input type for inserting object relation for remote table "cat_supervisionlevels" */
export type Cat_Supervisionlevels_Obj_Rel_Insert_Input = {
  data: Cat_Supervisionlevels_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Cat_Supervisionlevels_On_Conflict>;
};

/** on_conflict condition type for table "cat_supervisionlevels" */
export type Cat_Supervisionlevels_On_Conflict = {
  constraint: Cat_Supervisionlevels_Constraint;
  update_columns?: Array<Cat_Supervisionlevels_Update_Column>;
  where?: InputMaybe<Cat_Supervisionlevels_Bool_Exp>;
};

/** Ordering options when selecting data from "cat_supervisionlevels". */
export type Cat_Supervisionlevels_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  display_order?: InputMaybe<Order_By>;
  supervisionlevel_id?: InputMaybe<Order_By>;
  supervisionlevel_rating?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cat_supervisionlevels */
export type Cat_Supervisionlevels_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  supervisionlevel_id: Scalars['Int']['input'];
};

/** select columns of table "cat_supervisionlevels" */
export enum Cat_Supervisionlevels_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  DisplayOrder = 'display_order',
  /** column name */
  SupervisionlevelId = 'supervisionlevel_id',
  /** column name */
  SupervisionlevelRating = 'supervisionlevel_rating',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "cat_supervisionlevels" */
export type Cat_Supervisionlevels_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  supervisionlevel_id?: InputMaybe<Scalars['Int']['input']>;
  supervisionlevel_rating?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Cat_Supervisionlevels_Stddev_Fields = {
  __typename?: 'cat_supervisionlevels_stddev_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_rating?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Cat_Supervisionlevels_Stddev_Pop_Fields = {
  __typename?: 'cat_supervisionlevels_stddev_pop_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_rating?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Cat_Supervisionlevels_Stddev_Samp_Fields = {
  __typename?: 'cat_supervisionlevels_stddev_samp_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_rating?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "cat_supervisionlevels" */
export type Cat_Supervisionlevels_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Cat_Supervisionlevels_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Cat_Supervisionlevels_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  supervisionlevel_id?: InputMaybe<Scalars['Int']['input']>;
  supervisionlevel_rating?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Cat_Supervisionlevels_Sum_Fields = {
  __typename?: 'cat_supervisionlevels_sum_fields';
  display_order?: Maybe<Scalars['Int']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Int']['output']>;
  supervisionlevel_rating?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "cat_supervisionlevels" */
export enum Cat_Supervisionlevels_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  DisplayOrder = 'display_order',
  /** column name */
  SupervisionlevelId = 'supervisionlevel_id',
  /** column name */
  SupervisionlevelRating = 'supervisionlevel_rating',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Cat_Supervisionlevels_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Cat_Supervisionlevels_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Cat_Supervisionlevels_Set_Input>;
  /** filter the rows which have to be updated */
  where: Cat_Supervisionlevels_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Cat_Supervisionlevels_Var_Pop_Fields = {
  __typename?: 'cat_supervisionlevels_var_pop_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_rating?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Cat_Supervisionlevels_Var_Samp_Fields = {
  __typename?: 'cat_supervisionlevels_var_samp_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_rating?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Cat_Supervisionlevels_Variance_Fields = {
  __typename?: 'cat_supervisionlevels_variance_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_id?: Maybe<Scalars['Float']['output']>;
  supervisionlevel_rating?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "cat_tags" */
export type Cat_Tags = {
  __typename?: 'cat_tags';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  /** A computed field, executes function "function__cat_tags__lessons" */
  lessons_with_tag?: Maybe<Array<Lessons>>;
  /** A computed field, executes function "function__cat_tags__lessons__count" */
  lessons_with_tag_count?: Maybe<Scalars['Int']['output']>;
  programme_fields: Scalars['jsonb']['output'];
  tag_id: Scalars['Int']['output'];
  title?: Maybe<Scalars['String']['output']>;
  /** A computed field, executes function "function__cat_tags__units" */
  units_with_tag?: Maybe<Array<Units>>;
  /** A computed field, executes function "function__cat_tags__units__count" */
  units_with_tag_count?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "cat_tags" */
export type Cat_TagsLessons_With_TagArgs = {
  distinct_on?: InputMaybe<Array<Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Lessons_Order_By>>;
  where?: InputMaybe<Lessons_Bool_Exp>;
};


/** columns and relationships of "cat_tags" */
export type Cat_TagsProgramme_FieldsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "cat_tags" */
export type Cat_TagsUnits_With_TagArgs = {
  distinct_on?: InputMaybe<Array<Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Units_Order_By>>;
  where?: InputMaybe<Units_Bool_Exp>;
};

/** aggregated selection of "cat_tags" */
export type Cat_Tags_Aggregate = {
  __typename?: 'cat_tags_aggregate';
  aggregate?: Maybe<Cat_Tags_Aggregate_Fields>;
  nodes: Array<Cat_Tags>;
};

/** aggregate fields of "cat_tags" */
export type Cat_Tags_Aggregate_Fields = {
  __typename?: 'cat_tags_aggregate_fields';
  avg?: Maybe<Cat_Tags_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Cat_Tags_Max_Fields>;
  min?: Maybe<Cat_Tags_Min_Fields>;
  stddev?: Maybe<Cat_Tags_Stddev_Fields>;
  stddev_pop?: Maybe<Cat_Tags_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Cat_Tags_Stddev_Samp_Fields>;
  sum?: Maybe<Cat_Tags_Sum_Fields>;
  var_pop?: Maybe<Cat_Tags_Var_Pop_Fields>;
  var_samp?: Maybe<Cat_Tags_Var_Samp_Fields>;
  variance?: Maybe<Cat_Tags_Variance_Fields>;
};


/** aggregate fields of "cat_tags" */
export type Cat_Tags_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cat_Tags_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "cat_tags" */
export type Cat_Tags_Aggregate_Order_By = {
  avg?: InputMaybe<Cat_Tags_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Cat_Tags_Max_Order_By>;
  min?: InputMaybe<Cat_Tags_Min_Order_By>;
  stddev?: InputMaybe<Cat_Tags_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Cat_Tags_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Cat_Tags_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Cat_Tags_Sum_Order_By>;
  var_pop?: InputMaybe<Cat_Tags_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Cat_Tags_Var_Samp_Order_By>;
  variance?: InputMaybe<Cat_Tags_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Cat_Tags_Append_Input = {
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Cat_Tags_Avg_Fields = {
  __typename?: 'cat_tags_avg_fields';
  tag_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "cat_tags" */
export type Cat_Tags_Avg_Order_By = {
  tag_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "cat_tags". All fields are combined with a logical 'AND'. */
export type Cat_Tags_Bool_Exp = {
  _and?: InputMaybe<Array<Cat_Tags_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Cat_Tags_Bool_Exp>;
  _or?: InputMaybe<Array<Cat_Tags_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  lessons_with_tag?: InputMaybe<Lessons_Bool_Exp>;
  lessons_with_tag_count?: InputMaybe<Int_Comparison_Exp>;
  programme_fields?: InputMaybe<Jsonb_Comparison_Exp>;
  tag_id?: InputMaybe<Int_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  units_with_tag?: InputMaybe<Units_Bool_Exp>;
  units_with_tag_count?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "cat_tags" */
export enum Cat_Tags_Constraint {
  /** unique or primary key constraint on columns "tag_id", "_state" */
  CatTagsPkey = 'cat_tags_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Cat_Tags_Delete_At_Path_Input = {
  programme_fields?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Cat_Tags_Delete_Elem_Input = {
  programme_fields?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Cat_Tags_Delete_Key_Input = {
  programme_fields?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "cat_tags" */
export type Cat_Tags_Inc_Input = {
  tag_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "cat_tags" */
export type Cat_Tags_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  tag_id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Cat_Tags_Max_Fields = {
  __typename?: 'cat_tags_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  tag_id?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "cat_tags" */
export type Cat_Tags_Max_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Cat_Tags_Min_Fields = {
  __typename?: 'cat_tags_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  tag_id?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "cat_tags" */
export type Cat_Tags_Min_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "cat_tags" */
export type Cat_Tags_Mutation_Response = {
  __typename?: 'cat_tags_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Cat_Tags>;
};

/** on_conflict condition type for table "cat_tags" */
export type Cat_Tags_On_Conflict = {
  constraint: Cat_Tags_Constraint;
  update_columns?: Array<Cat_Tags_Update_Column>;
  where?: InputMaybe<Cat_Tags_Bool_Exp>;
};

/** Ordering options when selecting data from "cat_tags". */
export type Cat_Tags_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  lessons_with_tag_aggregate?: InputMaybe<Lessons_Aggregate_Order_By>;
  lessons_with_tag_count?: InputMaybe<Order_By>;
  programme_fields?: InputMaybe<Order_By>;
  tag_id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  units_with_tag_aggregate?: InputMaybe<Units_Aggregate_Order_By>;
  units_with_tag_count?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cat_tags */
export type Cat_Tags_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  tag_id: Scalars['Int']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Cat_Tags_Prepend_Input = {
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "cat_tags" */
export enum Cat_Tags_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  ProgrammeFields = 'programme_fields',
  /** column name */
  TagId = 'tag_id',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "cat_tags" */
export type Cat_Tags_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  tag_id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Cat_Tags_Stddev_Fields = {
  __typename?: 'cat_tags_stddev_fields';
  tag_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "cat_tags" */
export type Cat_Tags_Stddev_Order_By = {
  tag_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Cat_Tags_Stddev_Pop_Fields = {
  __typename?: 'cat_tags_stddev_pop_fields';
  tag_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "cat_tags" */
export type Cat_Tags_Stddev_Pop_Order_By = {
  tag_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Cat_Tags_Stddev_Samp_Fields = {
  __typename?: 'cat_tags_stddev_samp_fields';
  tag_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "cat_tags" */
export type Cat_Tags_Stddev_Samp_Order_By = {
  tag_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "cat_tags" */
export type Cat_Tags_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Cat_Tags_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Cat_Tags_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  tag_id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Cat_Tags_Sum_Fields = {
  __typename?: 'cat_tags_sum_fields';
  tag_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "cat_tags" */
export type Cat_Tags_Sum_Order_By = {
  tag_id?: InputMaybe<Order_By>;
};

/** update columns of table "cat_tags" */
export enum Cat_Tags_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  ProgrammeFields = 'programme_fields',
  /** column name */
  TagId = 'tag_id',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Cat_Tags_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Cat_Tags_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Cat_Tags_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Cat_Tags_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Cat_Tags_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Cat_Tags_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Cat_Tags_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Cat_Tags_Set_Input>;
  /** filter the rows which have to be updated */
  where: Cat_Tags_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Cat_Tags_Var_Pop_Fields = {
  __typename?: 'cat_tags_var_pop_fields';
  tag_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "cat_tags" */
export type Cat_Tags_Var_Pop_Order_By = {
  tag_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Cat_Tags_Var_Samp_Fields = {
  __typename?: 'cat_tags_var_samp_fields';
  tag_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "cat_tags" */
export type Cat_Tags_Var_Samp_Order_By = {
  tag_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Cat_Tags_Variance_Fields = {
  __typename?: 'cat_tags_variance_fields';
  tag_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "cat_tags" */
export type Cat_Tags_Variance_Order_By = {
  tag_id?: InputMaybe<Order_By>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** columns and relationships of "internal.review_lessons" */
export type Internal_Review_Lessons = {
  __typename?: 'internal_review_lessons';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  lesson?: Maybe<Lessons>;
  /** An array relationship */
  lesson_all_states: Array<Lessons>;
  /** An aggregate relationship */
  lesson_all_states_aggregate: Lessons_Aggregate;
  lesson_id: Scalars['Int']['output'];
  lesson_uid?: Maybe<Scalars['bpchar']['output']>;
  moderators?: Maybe<Scalars['json']['output']>;
  oak_reviews: Scalars['jsonb']['output'];
  partner_reviews: Scalars['jsonb']['output'];
  reviewers?: Maybe<Scalars['json']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "internal.review_lessons" */
export type Internal_Review_LessonsLesson_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Lessons_Order_By>>;
  where?: InputMaybe<Lessons_Bool_Exp>;
};


/** columns and relationships of "internal.review_lessons" */
export type Internal_Review_LessonsLesson_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Lessons_Order_By>>;
  where?: InputMaybe<Lessons_Bool_Exp>;
};


/** columns and relationships of "internal.review_lessons" */
export type Internal_Review_LessonsModeratorsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "internal.review_lessons" */
export type Internal_Review_LessonsOak_ReviewsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "internal.review_lessons" */
export type Internal_Review_LessonsPartner_ReviewsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "internal.review_lessons" */
export type Internal_Review_LessonsReviewersArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "internal.review_lessons" */
export type Internal_Review_Lessons_Aggregate = {
  __typename?: 'internal_review_lessons_aggregate';
  aggregate?: Maybe<Internal_Review_Lessons_Aggregate_Fields>;
  nodes: Array<Internal_Review_Lessons>;
};

export type Internal_Review_Lessons_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Internal_Review_Lessons_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Internal_Review_Lessons_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Internal_Review_Lessons_Aggregate_Bool_Exp_Count>;
};

export type Internal_Review_Lessons_Aggregate_Bool_Exp_Bool_And = {
  arguments: Internal_Review_Lessons_Select_Column_Internal_Review_Lessons_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Internal_Review_Lessons_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Internal_Review_Lessons_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Internal_Review_Lessons_Select_Column_Internal_Review_Lessons_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Internal_Review_Lessons_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Internal_Review_Lessons_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Internal_Review_Lessons_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Internal_Review_Lessons_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "internal.review_lessons" */
export type Internal_Review_Lessons_Aggregate_Fields = {
  __typename?: 'internal_review_lessons_aggregate_fields';
  avg?: Maybe<Internal_Review_Lessons_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Internal_Review_Lessons_Max_Fields>;
  min?: Maybe<Internal_Review_Lessons_Min_Fields>;
  stddev?: Maybe<Internal_Review_Lessons_Stddev_Fields>;
  stddev_pop?: Maybe<Internal_Review_Lessons_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Internal_Review_Lessons_Stddev_Samp_Fields>;
  sum?: Maybe<Internal_Review_Lessons_Sum_Fields>;
  var_pop?: Maybe<Internal_Review_Lessons_Var_Pop_Fields>;
  var_samp?: Maybe<Internal_Review_Lessons_Var_Samp_Fields>;
  variance?: Maybe<Internal_Review_Lessons_Variance_Fields>;
};


/** aggregate fields of "internal.review_lessons" */
export type Internal_Review_Lessons_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Internal_Review_Lessons_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "internal.review_lessons" */
export type Internal_Review_Lessons_Aggregate_Order_By = {
  avg?: InputMaybe<Internal_Review_Lessons_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Internal_Review_Lessons_Max_Order_By>;
  min?: InputMaybe<Internal_Review_Lessons_Min_Order_By>;
  stddev?: InputMaybe<Internal_Review_Lessons_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Internal_Review_Lessons_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Internal_Review_Lessons_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Internal_Review_Lessons_Sum_Order_By>;
  var_pop?: InputMaybe<Internal_Review_Lessons_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Internal_Review_Lessons_Var_Samp_Order_By>;
  variance?: InputMaybe<Internal_Review_Lessons_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Internal_Review_Lessons_Append_Input = {
  oak_reviews?: InputMaybe<Scalars['jsonb']['input']>;
  partner_reviews?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "internal.review_lessons" */
export type Internal_Review_Lessons_Arr_Rel_Insert_Input = {
  data: Array<Internal_Review_Lessons_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Internal_Review_Lessons_On_Conflict>;
};

/** aggregate avg on columns */
export type Internal_Review_Lessons_Avg_Fields = {
  __typename?: 'internal_review_lessons_avg_fields';
  lesson_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "internal.review_lessons" */
export type Internal_Review_Lessons_Avg_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "internal.review_lessons". All fields are combined with a logical 'AND'. */
export type Internal_Review_Lessons_Bool_Exp = {
  _and?: InputMaybe<Array<Internal_Review_Lessons_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Internal_Review_Lessons_Bool_Exp>;
  _or?: InputMaybe<Array<Internal_Review_Lessons_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  lesson?: InputMaybe<Lessons_Bool_Exp>;
  lesson_all_states?: InputMaybe<Lessons_Bool_Exp>;
  lesson_all_states_aggregate?: InputMaybe<Lessons_Aggregate_Bool_Exp>;
  lesson_id?: InputMaybe<Int_Comparison_Exp>;
  lesson_uid?: InputMaybe<Bpchar_Comparison_Exp>;
  moderators?: InputMaybe<Json_Comparison_Exp>;
  oak_reviews?: InputMaybe<Jsonb_Comparison_Exp>;
  partner_reviews?: InputMaybe<Jsonb_Comparison_Exp>;
  reviewers?: InputMaybe<Json_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "internal.review_lessons" */
export enum Internal_Review_Lessons_Constraint {
  /** unique or primary key constraint on columns "lesson_id", "_state" */
  ReviewLessonsPkey = 'review_lessons_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Internal_Review_Lessons_Delete_At_Path_Input = {
  oak_reviews?: InputMaybe<Array<Scalars['String']['input']>>;
  partner_reviews?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Internal_Review_Lessons_Delete_Elem_Input = {
  oak_reviews?: InputMaybe<Scalars['Int']['input']>;
  partner_reviews?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Internal_Review_Lessons_Delete_Key_Input = {
  oak_reviews?: InputMaybe<Scalars['String']['input']>;
  partner_reviews?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "internal.review_lessons" */
export type Internal_Review_Lessons_Inc_Input = {
  lesson_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "internal.review_lessons" */
export type Internal_Review_Lessons_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  lesson?: InputMaybe<Lessons_Obj_Rel_Insert_Input>;
  lesson_all_states?: InputMaybe<Lessons_Arr_Rel_Insert_Input>;
  lesson_id?: InputMaybe<Scalars['Int']['input']>;
  lesson_uid?: InputMaybe<Scalars['bpchar']['input']>;
  moderators?: InputMaybe<Scalars['json']['input']>;
  oak_reviews?: InputMaybe<Scalars['jsonb']['input']>;
  partner_reviews?: InputMaybe<Scalars['jsonb']['input']>;
  reviewers?: InputMaybe<Scalars['json']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Internal_Review_Lessons_Max_Fields = {
  __typename?: 'internal_review_lessons_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  lesson_id?: Maybe<Scalars['Int']['output']>;
  lesson_uid?: Maybe<Scalars['bpchar']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "internal.review_lessons" */
export type Internal_Review_Lessons_Max_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  lesson_uid?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Internal_Review_Lessons_Min_Fields = {
  __typename?: 'internal_review_lessons_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  lesson_id?: Maybe<Scalars['Int']['output']>;
  lesson_uid?: Maybe<Scalars['bpchar']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "internal.review_lessons" */
export type Internal_Review_Lessons_Min_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  lesson_uid?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "internal.review_lessons" */
export type Internal_Review_Lessons_Mutation_Response = {
  __typename?: 'internal_review_lessons_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Internal_Review_Lessons>;
};

/** input type for inserting object relation for remote table "internal.review_lessons" */
export type Internal_Review_Lessons_Obj_Rel_Insert_Input = {
  data: Internal_Review_Lessons_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Internal_Review_Lessons_On_Conflict>;
};

/** on_conflict condition type for table "internal.review_lessons" */
export type Internal_Review_Lessons_On_Conflict = {
  constraint: Internal_Review_Lessons_Constraint;
  update_columns?: Array<Internal_Review_Lessons_Update_Column>;
  where?: InputMaybe<Internal_Review_Lessons_Bool_Exp>;
};

/** Ordering options when selecting data from "internal.review_lessons". */
export type Internal_Review_Lessons_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  lesson?: InputMaybe<Lessons_Order_By>;
  lesson_all_states_aggregate?: InputMaybe<Lessons_Aggregate_Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  lesson_uid?: InputMaybe<Order_By>;
  moderators?: InputMaybe<Order_By>;
  oak_reviews?: InputMaybe<Order_By>;
  partner_reviews?: InputMaybe<Order_By>;
  reviewers?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: internal.review_lessons */
export type Internal_Review_Lessons_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  lesson_id: Scalars['Int']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Internal_Review_Lessons_Prepend_Input = {
  oak_reviews?: InputMaybe<Scalars['jsonb']['input']>;
  partner_reviews?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "internal.review_lessons" */
export enum Internal_Review_Lessons_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  LessonId = 'lesson_id',
  /** column name */
  LessonUid = 'lesson_uid',
  /** column name */
  Moderators = 'moderators',
  /** column name */
  OakReviews = 'oak_reviews',
  /** column name */
  PartnerReviews = 'partner_reviews',
  /** column name */
  Reviewers = 'reviewers',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "internal_review_lessons_aggregate_bool_exp_bool_and_arguments_columns" columns of table "internal.review_lessons" */
export enum Internal_Review_Lessons_Select_Column_Internal_Review_Lessons_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** select "internal_review_lessons_aggregate_bool_exp_bool_or_arguments_columns" columns of table "internal.review_lessons" */
export enum Internal_Review_Lessons_Select_Column_Internal_Review_Lessons_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** input type for updating data in table "internal.review_lessons" */
export type Internal_Review_Lessons_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  lesson_id?: InputMaybe<Scalars['Int']['input']>;
  lesson_uid?: InputMaybe<Scalars['bpchar']['input']>;
  moderators?: InputMaybe<Scalars['json']['input']>;
  oak_reviews?: InputMaybe<Scalars['jsonb']['input']>;
  partner_reviews?: InputMaybe<Scalars['jsonb']['input']>;
  reviewers?: InputMaybe<Scalars['json']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Internal_Review_Lessons_Stddev_Fields = {
  __typename?: 'internal_review_lessons_stddev_fields';
  lesson_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "internal.review_lessons" */
export type Internal_Review_Lessons_Stddev_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Internal_Review_Lessons_Stddev_Pop_Fields = {
  __typename?: 'internal_review_lessons_stddev_pop_fields';
  lesson_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "internal.review_lessons" */
export type Internal_Review_Lessons_Stddev_Pop_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Internal_Review_Lessons_Stddev_Samp_Fields = {
  __typename?: 'internal_review_lessons_stddev_samp_fields';
  lesson_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "internal.review_lessons" */
export type Internal_Review_Lessons_Stddev_Samp_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "internal_review_lessons" */
export type Internal_Review_Lessons_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Internal_Review_Lessons_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Internal_Review_Lessons_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  lesson_id?: InputMaybe<Scalars['Int']['input']>;
  lesson_uid?: InputMaybe<Scalars['bpchar']['input']>;
  moderators?: InputMaybe<Scalars['json']['input']>;
  oak_reviews?: InputMaybe<Scalars['jsonb']['input']>;
  partner_reviews?: InputMaybe<Scalars['jsonb']['input']>;
  reviewers?: InputMaybe<Scalars['json']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Internal_Review_Lessons_Sum_Fields = {
  __typename?: 'internal_review_lessons_sum_fields';
  lesson_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "internal.review_lessons" */
export type Internal_Review_Lessons_Sum_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
};

/** update columns of table "internal.review_lessons" */
export enum Internal_Review_Lessons_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  LessonId = 'lesson_id',
  /** column name */
  LessonUid = 'lesson_uid',
  /** column name */
  Moderators = 'moderators',
  /** column name */
  OakReviews = 'oak_reviews',
  /** column name */
  PartnerReviews = 'partner_reviews',
  /** column name */
  Reviewers = 'reviewers',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Internal_Review_Lessons_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Internal_Review_Lessons_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Internal_Review_Lessons_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Internal_Review_Lessons_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Internal_Review_Lessons_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Internal_Review_Lessons_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Internal_Review_Lessons_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Internal_Review_Lessons_Set_Input>;
  /** filter the rows which have to be updated */
  where: Internal_Review_Lessons_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Internal_Review_Lessons_Var_Pop_Fields = {
  __typename?: 'internal_review_lessons_var_pop_fields';
  lesson_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "internal.review_lessons" */
export type Internal_Review_Lessons_Var_Pop_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Internal_Review_Lessons_Var_Samp_Fields = {
  __typename?: 'internal_review_lessons_var_samp_fields';
  lesson_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "internal.review_lessons" */
export type Internal_Review_Lessons_Var_Samp_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Internal_Review_Lessons_Variance_Fields = {
  __typename?: 'internal_review_lessons_variance_fields';
  lesson_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "internal.review_lessons" */
export type Internal_Review_Lessons_Variance_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['json']['input']>;
  _gt?: InputMaybe<Scalars['json']['input']>;
  _gte?: InputMaybe<Scalars['json']['input']>;
  _in?: InputMaybe<Array<Scalars['json']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['json']['input']>;
  _lte?: InputMaybe<Scalars['json']['input']>;
  _neq?: InputMaybe<Scalars['json']['input']>;
  _nin?: InputMaybe<Array<Scalars['json']['input']>>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** columns and relationships of "lessons" */
export type Lessons = {
  __typename?: 'lessons';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  asset_id_slidedeck?: Maybe<Scalars['Int']['output']>;
  asset_id_supplementary_asset?: Maybe<Scalars['Int']['output']>;
  asset_id_worksheet?: Maybe<Scalars['Int']['output']>;
  asset_id_worksheet_answers?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  asset_slidedeck?: Maybe<Assets>;
  /** An array relationship */
  asset_slidedeck_all_states: Array<Assets>;
  /** An aggregate relationship */
  asset_slidedeck_all_states_aggregate: Assets_Aggregate;
  /** An object relationship */
  asset_supplementary_asset?: Maybe<Assets>;
  /** An array relationship */
  asset_supplementary_asset_all_states: Array<Assets>;
  /** An aggregate relationship */
  asset_supplementary_asset_all_states_aggregate: Assets_Aggregate;
  /** An object relationship */
  asset_worksheet?: Maybe<Assets>;
  /** An array relationship */
  asset_worksheet_all_states: Array<Assets>;
  /** An aggregate relationship */
  asset_worksheet_all_states_aggregate: Assets_Aggregate;
  /** An object relationship */
  asset_worksheet_answers?: Maybe<Assets>;
  /** An array relationship */
  asset_worksheet_answers_all_states: Array<Assets>;
  /** An aggregate relationship */
  asset_worksheet_answers_all_states_aggregate: Assets_Aggregate;
  attribution?: Maybe<Scalars['json']['output']>;
  content_guidance?: Maybe<Scalars['json']['output']>;
  content_guidance_details?: Maybe<Scalars['json']['output']>;
  copyright_content?: Maybe<Scalars['json']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  deprecated_fields?: Maybe<Scalars['json']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  equipment_and_resources?: Maybe<Scalars['json']['output']>;
  key_learning_points?: Maybe<Scalars['json']['output']>;
  keywords?: Maybe<Scalars['json']['output']>;
  lesson_id: Scalars['Int']['output'];
  lesson_outline?: Maybe<Scalars['json']['output']>;
  lesson_uid?: Maybe<Scalars['bpchar']['output']>;
  misconceptions_and_common_mistakes?: Maybe<Scalars['json']['output']>;
  pupil_lesson_outcome?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  quiz_exit?: Maybe<Quizzes>;
  /** An array relationship */
  quiz_exit_all_states: Array<Quizzes>;
  /** An aggregate relationship */
  quiz_exit_all_states_aggregate: Quizzes_Aggregate;
  quiz_id_exit?: Maybe<Scalars['Int']['output']>;
  quiz_id_starter?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  quiz_starter?: Maybe<Quizzes>;
  /** An array relationship */
  quiz_starter_all_states: Array<Quizzes>;
  /** An aggregate relationship */
  quiz_starter_all_states_aggregate: Quizzes_Aggregate;
  /** An object relationship */
  review_lesson?: Maybe<Internal_Review_Lessons>;
  /** An array relationship */
  review_lesson_all_states: Array<Internal_Review_Lessons>;
  /** An aggregate relationship */
  review_lesson_all_states_aggregate: Internal_Review_Lessons_Aggregate;
  sign_language_video_id?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  supervision_level?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Scalars['json']['output']>;
  teacher_details?: Maybe<Scalars['json']['output']>;
  teacher_tips?: Maybe<Scalars['json']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  unitvariant_lessons: Array<Unitvariant_Lessons>;
  /** An aggregate relationship */
  unitvariant_lessons_aggregate: Unitvariant_Lessons_Aggregate;
  /** An array relationship */
  unitvariant_lessons_all_states: Array<Unitvariant_Lessons>;
  /** An aggregate relationship */
  unitvariant_lessons_all_states_aggregate: Unitvariant_Lessons_Aggregate;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  video?: Maybe<Videos>;
  /** An array relationship */
  video_all_states: Array<Videos>;
  /** An aggregate relationship */
  video_all_states_aggregate: Videos_Aggregate;
  video_id?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  video_sign_language?: Maybe<Videos>;
  /** An array relationship */
  video_sign_language_all_states: Array<Videos>;
  /** An aggregate relationship */
  video_sign_language_all_states_aggregate: Videos_Aggregate;
};


/** columns and relationships of "lessons" */
export type LessonsAsset_Slidedeck_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Assets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Assets_Order_By>>;
  where?: InputMaybe<Assets_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsAsset_Slidedeck_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Assets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Assets_Order_By>>;
  where?: InputMaybe<Assets_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsAsset_Supplementary_Asset_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Assets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Assets_Order_By>>;
  where?: InputMaybe<Assets_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsAsset_Supplementary_Asset_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Assets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Assets_Order_By>>;
  where?: InputMaybe<Assets_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsAsset_Worksheet_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Assets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Assets_Order_By>>;
  where?: InputMaybe<Assets_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsAsset_Worksheet_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Assets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Assets_Order_By>>;
  where?: InputMaybe<Assets_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsAsset_Worksheet_Answers_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Assets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Assets_Order_By>>;
  where?: InputMaybe<Assets_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsAsset_Worksheet_Answers_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Assets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Assets_Order_By>>;
  where?: InputMaybe<Assets_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsAttributionArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "lessons" */
export type LessonsContent_GuidanceArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "lessons" */
export type LessonsContent_Guidance_DetailsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "lessons" */
export type LessonsCopyright_ContentArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "lessons" */
export type LessonsDeprecated_FieldsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "lessons" */
export type LessonsEquipment_And_ResourcesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "lessons" */
export type LessonsKey_Learning_PointsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "lessons" */
export type LessonsKeywordsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "lessons" */
export type LessonsLesson_OutlineArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "lessons" */
export type LessonsMisconceptions_And_Common_MistakesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "lessons" */
export type LessonsQuiz_Exit_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Quizzes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quizzes_Order_By>>;
  where?: InputMaybe<Quizzes_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsQuiz_Exit_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Quizzes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quizzes_Order_By>>;
  where?: InputMaybe<Quizzes_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsQuiz_Starter_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Quizzes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quizzes_Order_By>>;
  where?: InputMaybe<Quizzes_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsQuiz_Starter_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Quizzes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quizzes_Order_By>>;
  where?: InputMaybe<Quizzes_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsReview_Lesson_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Internal_Review_Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Internal_Review_Lessons_Order_By>>;
  where?: InputMaybe<Internal_Review_Lessons_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsReview_Lesson_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Internal_Review_Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Internal_Review_Lessons_Order_By>>;
  where?: InputMaybe<Internal_Review_Lessons_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsTagsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "lessons" */
export type LessonsTeacher_DetailsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "lessons" */
export type LessonsTeacher_TipsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "lessons" */
export type LessonsUnitvariant_LessonsArgs = {
  distinct_on?: InputMaybe<Array<Unitvariant_Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariant_Lessons_Order_By>>;
  where?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsUnitvariant_Lessons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Unitvariant_Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariant_Lessons_Order_By>>;
  where?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsUnitvariant_Lessons_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Unitvariant_Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariant_Lessons_Order_By>>;
  where?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsUnitvariant_Lessons_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Unitvariant_Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariant_Lessons_Order_By>>;
  where?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsVideo_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Videos_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Videos_Order_By>>;
  where?: InputMaybe<Videos_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsVideo_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Videos_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Videos_Order_By>>;
  where?: InputMaybe<Videos_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsVideo_Sign_Language_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Videos_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Videos_Order_By>>;
  where?: InputMaybe<Videos_Bool_Exp>;
};


/** columns and relationships of "lessons" */
export type LessonsVideo_Sign_Language_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Videos_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Videos_Order_By>>;
  where?: InputMaybe<Videos_Bool_Exp>;
};

/** aggregated selection of "lessons" */
export type Lessons_Aggregate = {
  __typename?: 'lessons_aggregate';
  aggregate?: Maybe<Lessons_Aggregate_Fields>;
  nodes: Array<Lessons>;
};

export type Lessons_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Lessons_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Lessons_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Lessons_Aggregate_Bool_Exp_Count>;
};

export type Lessons_Aggregate_Bool_Exp_Bool_And = {
  arguments: Lessons_Select_Column_Lessons_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Lessons_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Lessons_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Lessons_Select_Column_Lessons_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Lessons_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Lessons_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Lessons_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Lessons_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "lessons" */
export type Lessons_Aggregate_Fields = {
  __typename?: 'lessons_aggregate_fields';
  avg?: Maybe<Lessons_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Lessons_Max_Fields>;
  min?: Maybe<Lessons_Min_Fields>;
  stddev?: Maybe<Lessons_Stddev_Fields>;
  stddev_pop?: Maybe<Lessons_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Lessons_Stddev_Samp_Fields>;
  sum?: Maybe<Lessons_Sum_Fields>;
  var_pop?: Maybe<Lessons_Var_Pop_Fields>;
  var_samp?: Maybe<Lessons_Var_Samp_Fields>;
  variance?: Maybe<Lessons_Variance_Fields>;
};


/** aggregate fields of "lessons" */
export type Lessons_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Lessons_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "lessons" */
export type Lessons_Aggregate_Order_By = {
  avg?: InputMaybe<Lessons_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Lessons_Max_Order_By>;
  min?: InputMaybe<Lessons_Min_Order_By>;
  stddev?: InputMaybe<Lessons_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Lessons_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Lessons_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Lessons_Sum_Order_By>;
  var_pop?: InputMaybe<Lessons_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Lessons_Var_Samp_Order_By>;
  variance?: InputMaybe<Lessons_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "lessons" */
export type Lessons_Arr_Rel_Insert_Input = {
  data: Array<Lessons_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Lessons_On_Conflict>;
};

/** aggregate avg on columns */
export type Lessons_Avg_Fields = {
  __typename?: 'lessons_avg_fields';
  asset_id_slidedeck?: Maybe<Scalars['Float']['output']>;
  asset_id_supplementary_asset?: Maybe<Scalars['Float']['output']>;
  asset_id_worksheet?: Maybe<Scalars['Float']['output']>;
  asset_id_worksheet_answers?: Maybe<Scalars['Float']['output']>;
  lesson_id?: Maybe<Scalars['Float']['output']>;
  quiz_id_exit?: Maybe<Scalars['Float']['output']>;
  quiz_id_starter?: Maybe<Scalars['Float']['output']>;
  sign_language_video_id?: Maybe<Scalars['Float']['output']>;
  video_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "lessons" */
export type Lessons_Avg_Order_By = {
  asset_id_slidedeck?: InputMaybe<Order_By>;
  asset_id_supplementary_asset?: InputMaybe<Order_By>;
  asset_id_worksheet?: InputMaybe<Order_By>;
  asset_id_worksheet_answers?: InputMaybe<Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  quiz_id_exit?: InputMaybe<Order_By>;
  quiz_id_starter?: InputMaybe<Order_By>;
  sign_language_video_id?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "lessons". All fields are combined with a logical 'AND'. */
export type Lessons_Bool_Exp = {
  _and?: InputMaybe<Array<Lessons_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Lessons_Bool_Exp>;
  _or?: InputMaybe<Array<Lessons_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  asset_id_slidedeck?: InputMaybe<Int_Comparison_Exp>;
  asset_id_supplementary_asset?: InputMaybe<Int_Comparison_Exp>;
  asset_id_worksheet?: InputMaybe<Int_Comparison_Exp>;
  asset_id_worksheet_answers?: InputMaybe<Int_Comparison_Exp>;
  asset_slidedeck?: InputMaybe<Assets_Bool_Exp>;
  asset_slidedeck_all_states?: InputMaybe<Assets_Bool_Exp>;
  asset_slidedeck_all_states_aggregate?: InputMaybe<Assets_Aggregate_Bool_Exp>;
  asset_supplementary_asset?: InputMaybe<Assets_Bool_Exp>;
  asset_supplementary_asset_all_states?: InputMaybe<Assets_Bool_Exp>;
  asset_supplementary_asset_all_states_aggregate?: InputMaybe<Assets_Aggregate_Bool_Exp>;
  asset_worksheet?: InputMaybe<Assets_Bool_Exp>;
  asset_worksheet_all_states?: InputMaybe<Assets_Bool_Exp>;
  asset_worksheet_all_states_aggregate?: InputMaybe<Assets_Aggregate_Bool_Exp>;
  asset_worksheet_answers?: InputMaybe<Assets_Bool_Exp>;
  asset_worksheet_answers_all_states?: InputMaybe<Assets_Bool_Exp>;
  asset_worksheet_answers_all_states_aggregate?: InputMaybe<Assets_Aggregate_Bool_Exp>;
  attribution?: InputMaybe<Json_Comparison_Exp>;
  content_guidance?: InputMaybe<Json_Comparison_Exp>;
  content_guidance_details?: InputMaybe<Json_Comparison_Exp>;
  copyright_content?: InputMaybe<Json_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  deprecated_fields?: InputMaybe<Json_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  equipment_and_resources?: InputMaybe<Json_Comparison_Exp>;
  key_learning_points?: InputMaybe<Json_Comparison_Exp>;
  keywords?: InputMaybe<Json_Comparison_Exp>;
  lesson_id?: InputMaybe<Int_Comparison_Exp>;
  lesson_outline?: InputMaybe<Json_Comparison_Exp>;
  lesson_uid?: InputMaybe<Bpchar_Comparison_Exp>;
  misconceptions_and_common_mistakes?: InputMaybe<Json_Comparison_Exp>;
  pupil_lesson_outcome?: InputMaybe<String_Comparison_Exp>;
  quiz_exit?: InputMaybe<Quizzes_Bool_Exp>;
  quiz_exit_all_states?: InputMaybe<Quizzes_Bool_Exp>;
  quiz_exit_all_states_aggregate?: InputMaybe<Quizzes_Aggregate_Bool_Exp>;
  quiz_id_exit?: InputMaybe<Int_Comparison_Exp>;
  quiz_id_starter?: InputMaybe<Int_Comparison_Exp>;
  quiz_starter?: InputMaybe<Quizzes_Bool_Exp>;
  quiz_starter_all_states?: InputMaybe<Quizzes_Bool_Exp>;
  quiz_starter_all_states_aggregate?: InputMaybe<Quizzes_Aggregate_Bool_Exp>;
  review_lesson?: InputMaybe<Internal_Review_Lessons_Bool_Exp>;
  review_lesson_all_states?: InputMaybe<Internal_Review_Lessons_Bool_Exp>;
  review_lesson_all_states_aggregate?: InputMaybe<Internal_Review_Lessons_Aggregate_Bool_Exp>;
  sign_language_video_id?: InputMaybe<Int_Comparison_Exp>;
  slug?: InputMaybe<String_Comparison_Exp>;
  supervision_level?: InputMaybe<String_Comparison_Exp>;
  tags?: InputMaybe<Json_Comparison_Exp>;
  teacher_details?: InputMaybe<Json_Comparison_Exp>;
  teacher_tips?: InputMaybe<Json_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  unitvariant_lessons?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
  unitvariant_lessons_aggregate?: InputMaybe<Unitvariant_Lessons_Aggregate_Bool_Exp>;
  unitvariant_lessons_all_states?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
  unitvariant_lessons_all_states_aggregate?: InputMaybe<Unitvariant_Lessons_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  video?: InputMaybe<Videos_Bool_Exp>;
  video_all_states?: InputMaybe<Videos_Bool_Exp>;
  video_all_states_aggregate?: InputMaybe<Videos_Aggregate_Bool_Exp>;
  video_id?: InputMaybe<Int_Comparison_Exp>;
  video_sign_language?: InputMaybe<Videos_Bool_Exp>;
  video_sign_language_all_states?: InputMaybe<Videos_Bool_Exp>;
  video_sign_language_all_states_aggregate?: InputMaybe<Videos_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "lessons" */
export enum Lessons_Constraint {
  /** unique or primary key constraint on columns "lesson_id", "_state" */
  LessonsPkey = 'lessons_pkey'
}

/** input type for incrementing numeric columns in table "lessons" */
export type Lessons_Inc_Input = {
  asset_id_slidedeck?: InputMaybe<Scalars['Int']['input']>;
  asset_id_supplementary_asset?: InputMaybe<Scalars['Int']['input']>;
  asset_id_worksheet?: InputMaybe<Scalars['Int']['input']>;
  asset_id_worksheet_answers?: InputMaybe<Scalars['Int']['input']>;
  lesson_id?: InputMaybe<Scalars['Int']['input']>;
  quiz_id_exit?: InputMaybe<Scalars['Int']['input']>;
  quiz_id_starter?: InputMaybe<Scalars['Int']['input']>;
  sign_language_video_id?: InputMaybe<Scalars['Int']['input']>;
  video_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "lessons" */
export type Lessons_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  asset_id_slidedeck?: InputMaybe<Scalars['Int']['input']>;
  asset_id_supplementary_asset?: InputMaybe<Scalars['Int']['input']>;
  asset_id_worksheet?: InputMaybe<Scalars['Int']['input']>;
  asset_id_worksheet_answers?: InputMaybe<Scalars['Int']['input']>;
  asset_slidedeck?: InputMaybe<Assets_Obj_Rel_Insert_Input>;
  asset_slidedeck_all_states?: InputMaybe<Assets_Arr_Rel_Insert_Input>;
  asset_supplementary_asset?: InputMaybe<Assets_Obj_Rel_Insert_Input>;
  asset_supplementary_asset_all_states?: InputMaybe<Assets_Arr_Rel_Insert_Input>;
  asset_worksheet?: InputMaybe<Assets_Obj_Rel_Insert_Input>;
  asset_worksheet_all_states?: InputMaybe<Assets_Arr_Rel_Insert_Input>;
  asset_worksheet_answers?: InputMaybe<Assets_Obj_Rel_Insert_Input>;
  asset_worksheet_answers_all_states?: InputMaybe<Assets_Arr_Rel_Insert_Input>;
  attribution?: InputMaybe<Scalars['json']['input']>;
  content_guidance?: InputMaybe<Scalars['json']['input']>;
  content_guidance_details?: InputMaybe<Scalars['json']['input']>;
  copyright_content?: InputMaybe<Scalars['json']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deprecated_fields?: InputMaybe<Scalars['json']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  equipment_and_resources?: InputMaybe<Scalars['json']['input']>;
  key_learning_points?: InputMaybe<Scalars['json']['input']>;
  keywords?: InputMaybe<Scalars['json']['input']>;
  lesson_id?: InputMaybe<Scalars['Int']['input']>;
  lesson_outline?: InputMaybe<Scalars['json']['input']>;
  lesson_uid?: InputMaybe<Scalars['bpchar']['input']>;
  misconceptions_and_common_mistakes?: InputMaybe<Scalars['json']['input']>;
  pupil_lesson_outcome?: InputMaybe<Scalars['String']['input']>;
  quiz_exit?: InputMaybe<Quizzes_Obj_Rel_Insert_Input>;
  quiz_exit_all_states?: InputMaybe<Quizzes_Arr_Rel_Insert_Input>;
  quiz_id_exit?: InputMaybe<Scalars['Int']['input']>;
  quiz_id_starter?: InputMaybe<Scalars['Int']['input']>;
  quiz_starter?: InputMaybe<Quizzes_Obj_Rel_Insert_Input>;
  quiz_starter_all_states?: InputMaybe<Quizzes_Arr_Rel_Insert_Input>;
  review_lesson?: InputMaybe<Internal_Review_Lessons_Obj_Rel_Insert_Input>;
  review_lesson_all_states?: InputMaybe<Internal_Review_Lessons_Arr_Rel_Insert_Input>;
  sign_language_video_id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  supervision_level?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Scalars['json']['input']>;
  teacher_details?: InputMaybe<Scalars['json']['input']>;
  teacher_tips?: InputMaybe<Scalars['json']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  unitvariant_lessons?: InputMaybe<Unitvariant_Lessons_Arr_Rel_Insert_Input>;
  unitvariant_lessons_all_states?: InputMaybe<Unitvariant_Lessons_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  video?: InputMaybe<Videos_Obj_Rel_Insert_Input>;
  video_all_states?: InputMaybe<Videos_Arr_Rel_Insert_Input>;
  video_id?: InputMaybe<Scalars['Int']['input']>;
  video_sign_language?: InputMaybe<Videos_Obj_Rel_Insert_Input>;
  video_sign_language_all_states?: InputMaybe<Videos_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Lessons_Max_Fields = {
  __typename?: 'lessons_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  asset_id_slidedeck?: Maybe<Scalars['Int']['output']>;
  asset_id_supplementary_asset?: Maybe<Scalars['Int']['output']>;
  asset_id_worksheet?: Maybe<Scalars['Int']['output']>;
  asset_id_worksheet_answers?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  lesson_id?: Maybe<Scalars['Int']['output']>;
  lesson_uid?: Maybe<Scalars['bpchar']['output']>;
  pupil_lesson_outcome?: Maybe<Scalars['String']['output']>;
  quiz_id_exit?: Maybe<Scalars['Int']['output']>;
  quiz_id_starter?: Maybe<Scalars['Int']['output']>;
  sign_language_video_id?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  supervision_level?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  video_id?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "lessons" */
export type Lessons_Max_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  asset_id_slidedeck?: InputMaybe<Order_By>;
  asset_id_supplementary_asset?: InputMaybe<Order_By>;
  asset_id_worksheet?: InputMaybe<Order_By>;
  asset_id_worksheet_answers?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  lesson_uid?: InputMaybe<Order_By>;
  pupil_lesson_outcome?: InputMaybe<Order_By>;
  quiz_id_exit?: InputMaybe<Order_By>;
  quiz_id_starter?: InputMaybe<Order_By>;
  sign_language_video_id?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  supervision_level?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Lessons_Min_Fields = {
  __typename?: 'lessons_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  asset_id_slidedeck?: Maybe<Scalars['Int']['output']>;
  asset_id_supplementary_asset?: Maybe<Scalars['Int']['output']>;
  asset_id_worksheet?: Maybe<Scalars['Int']['output']>;
  asset_id_worksheet_answers?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  lesson_id?: Maybe<Scalars['Int']['output']>;
  lesson_uid?: Maybe<Scalars['bpchar']['output']>;
  pupil_lesson_outcome?: Maybe<Scalars['String']['output']>;
  quiz_id_exit?: Maybe<Scalars['Int']['output']>;
  quiz_id_starter?: Maybe<Scalars['Int']['output']>;
  sign_language_video_id?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  supervision_level?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  video_id?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "lessons" */
export type Lessons_Min_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  asset_id_slidedeck?: InputMaybe<Order_By>;
  asset_id_supplementary_asset?: InputMaybe<Order_By>;
  asset_id_worksheet?: InputMaybe<Order_By>;
  asset_id_worksheet_answers?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  lesson_uid?: InputMaybe<Order_By>;
  pupil_lesson_outcome?: InputMaybe<Order_By>;
  quiz_id_exit?: InputMaybe<Order_By>;
  quiz_id_starter?: InputMaybe<Order_By>;
  sign_language_video_id?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  supervision_level?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "lessons" */
export type Lessons_Mutation_Response = {
  __typename?: 'lessons_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Lessons>;
};

/** input type for inserting object relation for remote table "lessons" */
export type Lessons_Obj_Rel_Insert_Input = {
  data: Lessons_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Lessons_On_Conflict>;
};

/** on_conflict condition type for table "lessons" */
export type Lessons_On_Conflict = {
  constraint: Lessons_Constraint;
  update_columns?: Array<Lessons_Update_Column>;
  where?: InputMaybe<Lessons_Bool_Exp>;
};

/** Ordering options when selecting data from "lessons". */
export type Lessons_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  asset_id_slidedeck?: InputMaybe<Order_By>;
  asset_id_supplementary_asset?: InputMaybe<Order_By>;
  asset_id_worksheet?: InputMaybe<Order_By>;
  asset_id_worksheet_answers?: InputMaybe<Order_By>;
  asset_slidedeck?: InputMaybe<Assets_Order_By>;
  asset_slidedeck_all_states_aggregate?: InputMaybe<Assets_Aggregate_Order_By>;
  asset_supplementary_asset?: InputMaybe<Assets_Order_By>;
  asset_supplementary_asset_all_states_aggregate?: InputMaybe<Assets_Aggregate_Order_By>;
  asset_worksheet?: InputMaybe<Assets_Order_By>;
  asset_worksheet_all_states_aggregate?: InputMaybe<Assets_Aggregate_Order_By>;
  asset_worksheet_answers?: InputMaybe<Assets_Order_By>;
  asset_worksheet_answers_all_states_aggregate?: InputMaybe<Assets_Aggregate_Order_By>;
  attribution?: InputMaybe<Order_By>;
  content_guidance?: InputMaybe<Order_By>;
  content_guidance_details?: InputMaybe<Order_By>;
  copyright_content?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  deprecated_fields?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  equipment_and_resources?: InputMaybe<Order_By>;
  key_learning_points?: InputMaybe<Order_By>;
  keywords?: InputMaybe<Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  lesson_outline?: InputMaybe<Order_By>;
  lesson_uid?: InputMaybe<Order_By>;
  misconceptions_and_common_mistakes?: InputMaybe<Order_By>;
  pupil_lesson_outcome?: InputMaybe<Order_By>;
  quiz_exit?: InputMaybe<Quizzes_Order_By>;
  quiz_exit_all_states_aggregate?: InputMaybe<Quizzes_Aggregate_Order_By>;
  quiz_id_exit?: InputMaybe<Order_By>;
  quiz_id_starter?: InputMaybe<Order_By>;
  quiz_starter?: InputMaybe<Quizzes_Order_By>;
  quiz_starter_all_states_aggregate?: InputMaybe<Quizzes_Aggregate_Order_By>;
  review_lesson?: InputMaybe<Internal_Review_Lessons_Order_By>;
  review_lesson_all_states_aggregate?: InputMaybe<Internal_Review_Lessons_Aggregate_Order_By>;
  sign_language_video_id?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  supervision_level?: InputMaybe<Order_By>;
  tags?: InputMaybe<Order_By>;
  teacher_details?: InputMaybe<Order_By>;
  teacher_tips?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  unitvariant_lessons_aggregate?: InputMaybe<Unitvariant_Lessons_Aggregate_Order_By>;
  unitvariant_lessons_all_states_aggregate?: InputMaybe<Unitvariant_Lessons_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
  video?: InputMaybe<Videos_Order_By>;
  video_all_states_aggregate?: InputMaybe<Videos_Aggregate_Order_By>;
  video_id?: InputMaybe<Order_By>;
  video_sign_language?: InputMaybe<Videos_Order_By>;
  video_sign_language_all_states_aggregate?: InputMaybe<Videos_Aggregate_Order_By>;
};

/** primary key columns input for table: lessons */
export type Lessons_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  lesson_id: Scalars['Int']['input'];
};

/** select columns of table "lessons" */
export enum Lessons_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  AssetIdSlidedeck = 'asset_id_slidedeck',
  /** column name */
  AssetIdSupplementaryAsset = 'asset_id_supplementary_asset',
  /** column name */
  AssetIdWorksheet = 'asset_id_worksheet',
  /** column name */
  AssetIdWorksheetAnswers = 'asset_id_worksheet_answers',
  /** column name */
  Attribution = 'attribution',
  /** column name */
  ContentGuidance = 'content_guidance',
  /** column name */
  ContentGuidanceDetails = 'content_guidance_details',
  /** column name */
  CopyrightContent = 'copyright_content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeprecatedFields = 'deprecated_fields',
  /** column name */
  Description = 'description',
  /** column name */
  EquipmentAndResources = 'equipment_and_resources',
  /** column name */
  KeyLearningPoints = 'key_learning_points',
  /** column name */
  Keywords = 'keywords',
  /** column name */
  LessonId = 'lesson_id',
  /** column name */
  LessonOutline = 'lesson_outline',
  /** column name */
  LessonUid = 'lesson_uid',
  /** column name */
  MisconceptionsAndCommonMistakes = 'misconceptions_and_common_mistakes',
  /** column name */
  PupilLessonOutcome = 'pupil_lesson_outcome',
  /** column name */
  QuizIdExit = 'quiz_id_exit',
  /** column name */
  QuizIdStarter = 'quiz_id_starter',
  /** column name */
  SignLanguageVideoId = 'sign_language_video_id',
  /** column name */
  Slug = 'slug',
  /** column name */
  SupervisionLevel = 'supervision_level',
  /** column name */
  Tags = 'tags',
  /** column name */
  TeacherDetails = 'teacher_details',
  /** column name */
  TeacherTips = 'teacher_tips',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  VideoId = 'video_id'
}

/** select "lessons_aggregate_bool_exp_bool_and_arguments_columns" columns of table "lessons" */
export enum Lessons_Select_Column_Lessons_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** select "lessons_aggregate_bool_exp_bool_or_arguments_columns" columns of table "lessons" */
export enum Lessons_Select_Column_Lessons_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** input type for updating data in table "lessons" */
export type Lessons_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  asset_id_slidedeck?: InputMaybe<Scalars['Int']['input']>;
  asset_id_supplementary_asset?: InputMaybe<Scalars['Int']['input']>;
  asset_id_worksheet?: InputMaybe<Scalars['Int']['input']>;
  asset_id_worksheet_answers?: InputMaybe<Scalars['Int']['input']>;
  attribution?: InputMaybe<Scalars['json']['input']>;
  content_guidance?: InputMaybe<Scalars['json']['input']>;
  content_guidance_details?: InputMaybe<Scalars['json']['input']>;
  copyright_content?: InputMaybe<Scalars['json']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deprecated_fields?: InputMaybe<Scalars['json']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  equipment_and_resources?: InputMaybe<Scalars['json']['input']>;
  key_learning_points?: InputMaybe<Scalars['json']['input']>;
  keywords?: InputMaybe<Scalars['json']['input']>;
  lesson_id?: InputMaybe<Scalars['Int']['input']>;
  lesson_outline?: InputMaybe<Scalars['json']['input']>;
  lesson_uid?: InputMaybe<Scalars['bpchar']['input']>;
  misconceptions_and_common_mistakes?: InputMaybe<Scalars['json']['input']>;
  pupil_lesson_outcome?: InputMaybe<Scalars['String']['input']>;
  quiz_id_exit?: InputMaybe<Scalars['Int']['input']>;
  quiz_id_starter?: InputMaybe<Scalars['Int']['input']>;
  sign_language_video_id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  supervision_level?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Scalars['json']['input']>;
  teacher_details?: InputMaybe<Scalars['json']['input']>;
  teacher_tips?: InputMaybe<Scalars['json']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  video_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Lessons_Stddev_Fields = {
  __typename?: 'lessons_stddev_fields';
  asset_id_slidedeck?: Maybe<Scalars['Float']['output']>;
  asset_id_supplementary_asset?: Maybe<Scalars['Float']['output']>;
  asset_id_worksheet?: Maybe<Scalars['Float']['output']>;
  asset_id_worksheet_answers?: Maybe<Scalars['Float']['output']>;
  lesson_id?: Maybe<Scalars['Float']['output']>;
  quiz_id_exit?: Maybe<Scalars['Float']['output']>;
  quiz_id_starter?: Maybe<Scalars['Float']['output']>;
  sign_language_video_id?: Maybe<Scalars['Float']['output']>;
  video_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "lessons" */
export type Lessons_Stddev_Order_By = {
  asset_id_slidedeck?: InputMaybe<Order_By>;
  asset_id_supplementary_asset?: InputMaybe<Order_By>;
  asset_id_worksheet?: InputMaybe<Order_By>;
  asset_id_worksheet_answers?: InputMaybe<Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  quiz_id_exit?: InputMaybe<Order_By>;
  quiz_id_starter?: InputMaybe<Order_By>;
  sign_language_video_id?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Lessons_Stddev_Pop_Fields = {
  __typename?: 'lessons_stddev_pop_fields';
  asset_id_slidedeck?: Maybe<Scalars['Float']['output']>;
  asset_id_supplementary_asset?: Maybe<Scalars['Float']['output']>;
  asset_id_worksheet?: Maybe<Scalars['Float']['output']>;
  asset_id_worksheet_answers?: Maybe<Scalars['Float']['output']>;
  lesson_id?: Maybe<Scalars['Float']['output']>;
  quiz_id_exit?: Maybe<Scalars['Float']['output']>;
  quiz_id_starter?: Maybe<Scalars['Float']['output']>;
  sign_language_video_id?: Maybe<Scalars['Float']['output']>;
  video_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "lessons" */
export type Lessons_Stddev_Pop_Order_By = {
  asset_id_slidedeck?: InputMaybe<Order_By>;
  asset_id_supplementary_asset?: InputMaybe<Order_By>;
  asset_id_worksheet?: InputMaybe<Order_By>;
  asset_id_worksheet_answers?: InputMaybe<Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  quiz_id_exit?: InputMaybe<Order_By>;
  quiz_id_starter?: InputMaybe<Order_By>;
  sign_language_video_id?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Lessons_Stddev_Samp_Fields = {
  __typename?: 'lessons_stddev_samp_fields';
  asset_id_slidedeck?: Maybe<Scalars['Float']['output']>;
  asset_id_supplementary_asset?: Maybe<Scalars['Float']['output']>;
  asset_id_worksheet?: Maybe<Scalars['Float']['output']>;
  asset_id_worksheet_answers?: Maybe<Scalars['Float']['output']>;
  lesson_id?: Maybe<Scalars['Float']['output']>;
  quiz_id_exit?: Maybe<Scalars['Float']['output']>;
  quiz_id_starter?: Maybe<Scalars['Float']['output']>;
  sign_language_video_id?: Maybe<Scalars['Float']['output']>;
  video_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "lessons" */
export type Lessons_Stddev_Samp_Order_By = {
  asset_id_slidedeck?: InputMaybe<Order_By>;
  asset_id_supplementary_asset?: InputMaybe<Order_By>;
  asset_id_worksheet?: InputMaybe<Order_By>;
  asset_id_worksheet_answers?: InputMaybe<Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  quiz_id_exit?: InputMaybe<Order_By>;
  quiz_id_starter?: InputMaybe<Order_By>;
  sign_language_video_id?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "lessons" */
export type Lessons_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Lessons_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Lessons_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  asset_id_slidedeck?: InputMaybe<Scalars['Int']['input']>;
  asset_id_supplementary_asset?: InputMaybe<Scalars['Int']['input']>;
  asset_id_worksheet?: InputMaybe<Scalars['Int']['input']>;
  asset_id_worksheet_answers?: InputMaybe<Scalars['Int']['input']>;
  attribution?: InputMaybe<Scalars['json']['input']>;
  content_guidance?: InputMaybe<Scalars['json']['input']>;
  content_guidance_details?: InputMaybe<Scalars['json']['input']>;
  copyright_content?: InputMaybe<Scalars['json']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  deprecated_fields?: InputMaybe<Scalars['json']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  equipment_and_resources?: InputMaybe<Scalars['json']['input']>;
  key_learning_points?: InputMaybe<Scalars['json']['input']>;
  keywords?: InputMaybe<Scalars['json']['input']>;
  lesson_id?: InputMaybe<Scalars['Int']['input']>;
  lesson_outline?: InputMaybe<Scalars['json']['input']>;
  lesson_uid?: InputMaybe<Scalars['bpchar']['input']>;
  misconceptions_and_common_mistakes?: InputMaybe<Scalars['json']['input']>;
  pupil_lesson_outcome?: InputMaybe<Scalars['String']['input']>;
  quiz_id_exit?: InputMaybe<Scalars['Int']['input']>;
  quiz_id_starter?: InputMaybe<Scalars['Int']['input']>;
  sign_language_video_id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  supervision_level?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Scalars['json']['input']>;
  teacher_details?: InputMaybe<Scalars['json']['input']>;
  teacher_tips?: InputMaybe<Scalars['json']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  video_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Lessons_Sum_Fields = {
  __typename?: 'lessons_sum_fields';
  asset_id_slidedeck?: Maybe<Scalars['Int']['output']>;
  asset_id_supplementary_asset?: Maybe<Scalars['Int']['output']>;
  asset_id_worksheet?: Maybe<Scalars['Int']['output']>;
  asset_id_worksheet_answers?: Maybe<Scalars['Int']['output']>;
  lesson_id?: Maybe<Scalars['Int']['output']>;
  quiz_id_exit?: Maybe<Scalars['Int']['output']>;
  quiz_id_starter?: Maybe<Scalars['Int']['output']>;
  sign_language_video_id?: Maybe<Scalars['Int']['output']>;
  video_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "lessons" */
export type Lessons_Sum_Order_By = {
  asset_id_slidedeck?: InputMaybe<Order_By>;
  asset_id_supplementary_asset?: InputMaybe<Order_By>;
  asset_id_worksheet?: InputMaybe<Order_By>;
  asset_id_worksheet_answers?: InputMaybe<Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  quiz_id_exit?: InputMaybe<Order_By>;
  quiz_id_starter?: InputMaybe<Order_By>;
  sign_language_video_id?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
};

/** update columns of table "lessons" */
export enum Lessons_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  AssetIdSlidedeck = 'asset_id_slidedeck',
  /** column name */
  AssetIdSupplementaryAsset = 'asset_id_supplementary_asset',
  /** column name */
  AssetIdWorksheet = 'asset_id_worksheet',
  /** column name */
  AssetIdWorksheetAnswers = 'asset_id_worksheet_answers',
  /** column name */
  Attribution = 'attribution',
  /** column name */
  ContentGuidance = 'content_guidance',
  /** column name */
  ContentGuidanceDetails = 'content_guidance_details',
  /** column name */
  CopyrightContent = 'copyright_content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeprecatedFields = 'deprecated_fields',
  /** column name */
  Description = 'description',
  /** column name */
  EquipmentAndResources = 'equipment_and_resources',
  /** column name */
  KeyLearningPoints = 'key_learning_points',
  /** column name */
  Keywords = 'keywords',
  /** column name */
  LessonId = 'lesson_id',
  /** column name */
  LessonOutline = 'lesson_outline',
  /** column name */
  LessonUid = 'lesson_uid',
  /** column name */
  MisconceptionsAndCommonMistakes = 'misconceptions_and_common_mistakes',
  /** column name */
  PupilLessonOutcome = 'pupil_lesson_outcome',
  /** column name */
  QuizIdExit = 'quiz_id_exit',
  /** column name */
  QuizIdStarter = 'quiz_id_starter',
  /** column name */
  SignLanguageVideoId = 'sign_language_video_id',
  /** column name */
  Slug = 'slug',
  /** column name */
  SupervisionLevel = 'supervision_level',
  /** column name */
  Tags = 'tags',
  /** column name */
  TeacherDetails = 'teacher_details',
  /** column name */
  TeacherTips = 'teacher_tips',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  VideoId = 'video_id'
}

export type Lessons_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Lessons_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Lessons_Set_Input>;
  /** filter the rows which have to be updated */
  where: Lessons_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Lessons_Var_Pop_Fields = {
  __typename?: 'lessons_var_pop_fields';
  asset_id_slidedeck?: Maybe<Scalars['Float']['output']>;
  asset_id_supplementary_asset?: Maybe<Scalars['Float']['output']>;
  asset_id_worksheet?: Maybe<Scalars['Float']['output']>;
  asset_id_worksheet_answers?: Maybe<Scalars['Float']['output']>;
  lesson_id?: Maybe<Scalars['Float']['output']>;
  quiz_id_exit?: Maybe<Scalars['Float']['output']>;
  quiz_id_starter?: Maybe<Scalars['Float']['output']>;
  sign_language_video_id?: Maybe<Scalars['Float']['output']>;
  video_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "lessons" */
export type Lessons_Var_Pop_Order_By = {
  asset_id_slidedeck?: InputMaybe<Order_By>;
  asset_id_supplementary_asset?: InputMaybe<Order_By>;
  asset_id_worksheet?: InputMaybe<Order_By>;
  asset_id_worksheet_answers?: InputMaybe<Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  quiz_id_exit?: InputMaybe<Order_By>;
  quiz_id_starter?: InputMaybe<Order_By>;
  sign_language_video_id?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Lessons_Var_Samp_Fields = {
  __typename?: 'lessons_var_samp_fields';
  asset_id_slidedeck?: Maybe<Scalars['Float']['output']>;
  asset_id_supplementary_asset?: Maybe<Scalars['Float']['output']>;
  asset_id_worksheet?: Maybe<Scalars['Float']['output']>;
  asset_id_worksheet_answers?: Maybe<Scalars['Float']['output']>;
  lesson_id?: Maybe<Scalars['Float']['output']>;
  quiz_id_exit?: Maybe<Scalars['Float']['output']>;
  quiz_id_starter?: Maybe<Scalars['Float']['output']>;
  sign_language_video_id?: Maybe<Scalars['Float']['output']>;
  video_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "lessons" */
export type Lessons_Var_Samp_Order_By = {
  asset_id_slidedeck?: InputMaybe<Order_By>;
  asset_id_supplementary_asset?: InputMaybe<Order_By>;
  asset_id_worksheet?: InputMaybe<Order_By>;
  asset_id_worksheet_answers?: InputMaybe<Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  quiz_id_exit?: InputMaybe<Order_By>;
  quiz_id_starter?: InputMaybe<Order_By>;
  sign_language_video_id?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Lessons_Variance_Fields = {
  __typename?: 'lessons_variance_fields';
  asset_id_slidedeck?: Maybe<Scalars['Float']['output']>;
  asset_id_supplementary_asset?: Maybe<Scalars['Float']['output']>;
  asset_id_worksheet?: Maybe<Scalars['Float']['output']>;
  asset_id_worksheet_answers?: Maybe<Scalars['Float']['output']>;
  lesson_id?: Maybe<Scalars['Float']['output']>;
  quiz_id_exit?: Maybe<Scalars['Float']['output']>;
  quiz_id_starter?: Maybe<Scalars['Float']['output']>;
  sign_language_video_id?: Maybe<Scalars['Float']['output']>;
  video_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "lessons" */
export type Lessons_Variance_Order_By = {
  asset_id_slidedeck?: InputMaybe<Order_By>;
  asset_id_supplementary_asset?: InputMaybe<Order_By>;
  asset_id_worksheet?: InputMaybe<Order_By>;
  asset_id_worksheet_answers?: InputMaybe<Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  quiz_id_exit?: InputMaybe<Order_By>;
  quiz_id_starter?: InputMaybe<Order_By>;
  sign_language_video_id?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "assets" */
  delete_assets?: Maybe<Assets_Mutation_Response>;
  /** delete single row from the table: "assets" */
  delete_assets_by_pk?: Maybe<Assets>;
  /** delete data from the table: "cat_contentguidance" */
  delete_cat_contentguidance?: Maybe<Cat_Contentguidance_Mutation_Response>;
  /** delete single row from the table: "cat_contentguidance" */
  delete_cat_contentguidance_by_pk?: Maybe<Cat_Contentguidance>;
  /** delete data from the table: "cat_examboardspecs" */
  delete_cat_examboardspecs?: Maybe<Cat_Examboardspecs_Mutation_Response>;
  /** delete single row from the table: "cat_examboardspecs" */
  delete_cat_examboardspecs_by_pk?: Maybe<Cat_Examboardspecs>;
  /** delete data from the table: "cat_nationalcurriculum" */
  delete_cat_nationalcurriculum?: Maybe<Cat_Nationalcurriculum_Mutation_Response>;
  /** delete single row from the table: "cat_nationalcurriculum" */
  delete_cat_nationalcurriculum_by_pk?: Maybe<Cat_Nationalcurriculum>;
  /** delete data from the table: "cat_supervisionlevels" */
  delete_cat_supervisionlevels?: Maybe<Cat_Supervisionlevels_Mutation_Response>;
  /** delete single row from the table: "cat_supervisionlevels" */
  delete_cat_supervisionlevels_by_pk?: Maybe<Cat_Supervisionlevels>;
  /** delete data from the table: "cat_tags" */
  delete_cat_tags?: Maybe<Cat_Tags_Mutation_Response>;
  /** delete single row from the table: "cat_tags" */
  delete_cat_tags_by_pk?: Maybe<Cat_Tags>;
  /** delete data from the table: "internal.review_lessons" */
  delete_internal_review_lessons?: Maybe<Internal_Review_Lessons_Mutation_Response>;
  /** delete single row from the table: "internal.review_lessons" */
  delete_internal_review_lessons_by_pk?: Maybe<Internal_Review_Lessons>;
  /** delete data from the table: "lessons" */
  delete_lessons?: Maybe<Lessons_Mutation_Response>;
  /** delete single row from the table: "lessons" */
  delete_lessons_by_pk?: Maybe<Lessons>;
  /** delete data from the table: "pf_examboards" */
  delete_pf_examboards?: Maybe<Pf_Examboards_Mutation_Response>;
  /** delete single row from the table: "pf_examboards" */
  delete_pf_examboards_by_pk?: Maybe<Pf_Examboards>;
  /** delete data from the table: "pf_keystages" */
  delete_pf_keystages?: Maybe<Pf_Keystages_Mutation_Response>;
  /** delete single row from the table: "pf_keystages" */
  delete_pf_keystages_by_pk?: Maybe<Pf_Keystages>;
  /** delete data from the table: "pf_phases" */
  delete_pf_phases?: Maybe<Pf_Phases_Mutation_Response>;
  /** delete single row from the table: "pf_phases" */
  delete_pf_phases_by_pk?: Maybe<Pf_Phases>;
  /** delete data from the table: "pf_subjects" */
  delete_pf_subjects?: Maybe<Pf_Subjects_Mutation_Response>;
  /** delete single row from the table: "pf_subjects" */
  delete_pf_subjects_by_pk?: Maybe<Pf_Subjects>;
  /** delete data from the table: "pf_tiers" */
  delete_pf_tiers?: Maybe<Pf_Tiers_Mutation_Response>;
  /** delete single row from the table: "pf_tiers" */
  delete_pf_tiers_by_pk?: Maybe<Pf_Tiers>;
  /** delete data from the table: "pf_years" */
  delete_pf_years?: Maybe<Pf_Years_Mutation_Response>;
  /** delete single row from the table: "pf_years" */
  delete_pf_years_by_pk?: Maybe<Pf_Years>;
  /** delete data from the table: "programme_threads" */
  delete_programme_threads?: Maybe<Programme_Threads_Mutation_Response>;
  /** delete single row from the table: "programme_threads" */
  delete_programme_threads_by_pk?: Maybe<Programme_Threads>;
  /** delete data from the table: "programme_units" */
  delete_programme_units?: Maybe<Programme_Units_Mutation_Response>;
  /** delete single row from the table: "programme_units" */
  delete_programme_units_by_pk?: Maybe<Programme_Units>;
  /** delete data from the table: "programmes" */
  delete_programmes?: Maybe<Programmes_Mutation_Response>;
  /** delete single row from the table: "programmes" */
  delete_programmes_by_pk?: Maybe<Programmes>;
  /** delete data from the table: "published.viewmanager" */
  delete_published_viewmanager?: Maybe<Published_Viewmanager_Mutation_Response>;
  /** delete single row from the table: "published.viewmanager" */
  delete_published_viewmanager_by_pk?: Maybe<Published_Viewmanager>;
  /** delete data from the table: "questions" */
  delete_questions?: Maybe<Questions_Mutation_Response>;
  /** delete single row from the table: "questions" */
  delete_questions_by_pk?: Maybe<Questions>;
  /** delete data from the table: "quiz_questions" */
  delete_quiz_questions?: Maybe<Quiz_Questions_Mutation_Response>;
  /** delete single row from the table: "quiz_questions" */
  delete_quiz_questions_by_pk?: Maybe<Quiz_Questions>;
  /** delete data from the table: "quizzes" */
  delete_quizzes?: Maybe<Quizzes_Mutation_Response>;
  /** delete single row from the table: "quizzes" */
  delete_quizzes_by_pk?: Maybe<Quizzes>;
  /** delete data from the table: "thread_units" */
  delete_thread_units?: Maybe<Thread_Units_Mutation_Response>;
  /** delete single row from the table: "thread_units" */
  delete_thread_units_by_pk?: Maybe<Thread_Units>;
  /** delete data from the table: "threads" */
  delete_threads?: Maybe<Threads_Mutation_Response>;
  /** delete single row from the table: "threads" */
  delete_threads_by_pk?: Maybe<Threads>;
  /** delete data from the table: "units" */
  delete_units?: Maybe<Units_Mutation_Response>;
  /** delete single row from the table: "units" */
  delete_units_by_pk?: Maybe<Units>;
  /** delete data from the table: "unitvariant_lessons" */
  delete_unitvariant_lessons?: Maybe<Unitvariant_Lessons_Mutation_Response>;
  /** delete single row from the table: "unitvariant_lessons" */
  delete_unitvariant_lessons_by_pk?: Maybe<Unitvariant_Lessons>;
  /** delete data from the table: "unitvariants" */
  delete_unitvariants?: Maybe<Unitvariants_Mutation_Response>;
  /** delete single row from the table: "unitvariants" */
  delete_unitvariants_by_pk?: Maybe<Unitvariants>;
  /** delete data from the table: "videocaptions" */
  delete_videocaptions?: Maybe<Videocaptions_Mutation_Response>;
  /** delete single row from the table: "videocaptions" */
  delete_videocaptions_by_pk?: Maybe<Videocaptions>;
  /** delete data from the table: "videos" */
  delete_videos?: Maybe<Videos_Mutation_Response>;
  /** delete single row from the table: "videos" */
  delete_videos_by_pk?: Maybe<Videos>;
  /** insert data into the table: "assets" */
  insert_assets?: Maybe<Assets_Mutation_Response>;
  /** insert a single row into the table: "assets" */
  insert_assets_one?: Maybe<Assets>;
  /** insert data into the table: "cat_contentguidance" */
  insert_cat_contentguidance?: Maybe<Cat_Contentguidance_Mutation_Response>;
  /** insert a single row into the table: "cat_contentguidance" */
  insert_cat_contentguidance_one?: Maybe<Cat_Contentguidance>;
  /** insert data into the table: "cat_examboardspecs" */
  insert_cat_examboardspecs?: Maybe<Cat_Examboardspecs_Mutation_Response>;
  /** insert a single row into the table: "cat_examboardspecs" */
  insert_cat_examboardspecs_one?: Maybe<Cat_Examboardspecs>;
  /** insert data into the table: "cat_nationalcurriculum" */
  insert_cat_nationalcurriculum?: Maybe<Cat_Nationalcurriculum_Mutation_Response>;
  /** insert a single row into the table: "cat_nationalcurriculum" */
  insert_cat_nationalcurriculum_one?: Maybe<Cat_Nationalcurriculum>;
  /** insert data into the table: "cat_supervisionlevels" */
  insert_cat_supervisionlevels?: Maybe<Cat_Supervisionlevels_Mutation_Response>;
  /** insert a single row into the table: "cat_supervisionlevels" */
  insert_cat_supervisionlevels_one?: Maybe<Cat_Supervisionlevels>;
  /** insert data into the table: "cat_tags" */
  insert_cat_tags?: Maybe<Cat_Tags_Mutation_Response>;
  /** insert a single row into the table: "cat_tags" */
  insert_cat_tags_one?: Maybe<Cat_Tags>;
  /** insert data into the table: "internal.review_lessons" */
  insert_internal_review_lessons?: Maybe<Internal_Review_Lessons_Mutation_Response>;
  /** insert a single row into the table: "internal.review_lessons" */
  insert_internal_review_lessons_one?: Maybe<Internal_Review_Lessons>;
  /** insert data into the table: "lessons" */
  insert_lessons?: Maybe<Lessons_Mutation_Response>;
  /** insert a single row into the table: "lessons" */
  insert_lessons_one?: Maybe<Lessons>;
  /** insert data into the table: "pf_examboards" */
  insert_pf_examboards?: Maybe<Pf_Examboards_Mutation_Response>;
  /** insert a single row into the table: "pf_examboards" */
  insert_pf_examboards_one?: Maybe<Pf_Examboards>;
  /** insert data into the table: "pf_keystages" */
  insert_pf_keystages?: Maybe<Pf_Keystages_Mutation_Response>;
  /** insert a single row into the table: "pf_keystages" */
  insert_pf_keystages_one?: Maybe<Pf_Keystages>;
  /** insert data into the table: "pf_phases" */
  insert_pf_phases?: Maybe<Pf_Phases_Mutation_Response>;
  /** insert a single row into the table: "pf_phases" */
  insert_pf_phases_one?: Maybe<Pf_Phases>;
  /** insert data into the table: "pf_subjects" */
  insert_pf_subjects?: Maybe<Pf_Subjects_Mutation_Response>;
  /** insert a single row into the table: "pf_subjects" */
  insert_pf_subjects_one?: Maybe<Pf_Subjects>;
  /** insert data into the table: "pf_tiers" */
  insert_pf_tiers?: Maybe<Pf_Tiers_Mutation_Response>;
  /** insert a single row into the table: "pf_tiers" */
  insert_pf_tiers_one?: Maybe<Pf_Tiers>;
  /** insert data into the table: "pf_years" */
  insert_pf_years?: Maybe<Pf_Years_Mutation_Response>;
  /** insert a single row into the table: "pf_years" */
  insert_pf_years_one?: Maybe<Pf_Years>;
  /** insert data into the table: "programme_threads" */
  insert_programme_threads?: Maybe<Programme_Threads_Mutation_Response>;
  /** insert a single row into the table: "programme_threads" */
  insert_programme_threads_one?: Maybe<Programme_Threads>;
  /** insert data into the table: "programme_units" */
  insert_programme_units?: Maybe<Programme_Units_Mutation_Response>;
  /** insert a single row into the table: "programme_units" */
  insert_programme_units_one?: Maybe<Programme_Units>;
  /** insert data into the table: "programmes" */
  insert_programmes?: Maybe<Programmes_Mutation_Response>;
  /** insert a single row into the table: "programmes" */
  insert_programmes_one?: Maybe<Programmes>;
  /** insert data into the table: "published.viewmanager" */
  insert_published_viewmanager?: Maybe<Published_Viewmanager_Mutation_Response>;
  /** insert a single row into the table: "published.viewmanager" */
  insert_published_viewmanager_one?: Maybe<Published_Viewmanager>;
  /** insert data into the table: "questions" */
  insert_questions?: Maybe<Questions_Mutation_Response>;
  /** insert a single row into the table: "questions" */
  insert_questions_one?: Maybe<Questions>;
  /** insert data into the table: "quiz_questions" */
  insert_quiz_questions?: Maybe<Quiz_Questions_Mutation_Response>;
  /** insert a single row into the table: "quiz_questions" */
  insert_quiz_questions_one?: Maybe<Quiz_Questions>;
  /** insert data into the table: "quizzes" */
  insert_quizzes?: Maybe<Quizzes_Mutation_Response>;
  /** insert a single row into the table: "quizzes" */
  insert_quizzes_one?: Maybe<Quizzes>;
  /** insert data into the table: "thread_units" */
  insert_thread_units?: Maybe<Thread_Units_Mutation_Response>;
  /** insert a single row into the table: "thread_units" */
  insert_thread_units_one?: Maybe<Thread_Units>;
  /** insert data into the table: "threads" */
  insert_threads?: Maybe<Threads_Mutation_Response>;
  /** insert a single row into the table: "threads" */
  insert_threads_one?: Maybe<Threads>;
  /** insert data into the table: "units" */
  insert_units?: Maybe<Units_Mutation_Response>;
  /** insert a single row into the table: "units" */
  insert_units_one?: Maybe<Units>;
  /** insert data into the table: "unitvariant_lessons" */
  insert_unitvariant_lessons?: Maybe<Unitvariant_Lessons_Mutation_Response>;
  /** insert a single row into the table: "unitvariant_lessons" */
  insert_unitvariant_lessons_one?: Maybe<Unitvariant_Lessons>;
  /** insert data into the table: "unitvariants" */
  insert_unitvariants?: Maybe<Unitvariants_Mutation_Response>;
  /** insert a single row into the table: "unitvariants" */
  insert_unitvariants_one?: Maybe<Unitvariants>;
  /** insert data into the table: "videocaptions" */
  insert_videocaptions?: Maybe<Videocaptions_Mutation_Response>;
  /** insert a single row into the table: "videocaptions" */
  insert_videocaptions_one?: Maybe<Videocaptions>;
  /** insert data into the table: "videos" */
  insert_videos?: Maybe<Videos_Mutation_Response>;
  /** insert a single row into the table: "videos" */
  insert_videos_one?: Maybe<Videos>;
  /** update data of the table: "assets" */
  update_assets?: Maybe<Assets_Mutation_Response>;
  /** update single row of the table: "assets" */
  update_assets_by_pk?: Maybe<Assets>;
  /** update multiples rows of table: "assets" */
  update_assets_many?: Maybe<Array<Maybe<Assets_Mutation_Response>>>;
  /** update data of the table: "cat_contentguidance" */
  update_cat_contentguidance?: Maybe<Cat_Contentguidance_Mutation_Response>;
  /** update single row of the table: "cat_contentguidance" */
  update_cat_contentguidance_by_pk?: Maybe<Cat_Contentguidance>;
  /** update multiples rows of table: "cat_contentguidance" */
  update_cat_contentguidance_many?: Maybe<Array<Maybe<Cat_Contentguidance_Mutation_Response>>>;
  /** update data of the table: "cat_examboardspecs" */
  update_cat_examboardspecs?: Maybe<Cat_Examboardspecs_Mutation_Response>;
  /** update single row of the table: "cat_examboardspecs" */
  update_cat_examboardspecs_by_pk?: Maybe<Cat_Examboardspecs>;
  /** update multiples rows of table: "cat_examboardspecs" */
  update_cat_examboardspecs_many?: Maybe<Array<Maybe<Cat_Examboardspecs_Mutation_Response>>>;
  /** update data of the table: "cat_nationalcurriculum" */
  update_cat_nationalcurriculum?: Maybe<Cat_Nationalcurriculum_Mutation_Response>;
  /** update single row of the table: "cat_nationalcurriculum" */
  update_cat_nationalcurriculum_by_pk?: Maybe<Cat_Nationalcurriculum>;
  /** update multiples rows of table: "cat_nationalcurriculum" */
  update_cat_nationalcurriculum_many?: Maybe<Array<Maybe<Cat_Nationalcurriculum_Mutation_Response>>>;
  /** update data of the table: "cat_supervisionlevels" */
  update_cat_supervisionlevels?: Maybe<Cat_Supervisionlevels_Mutation_Response>;
  /** update single row of the table: "cat_supervisionlevels" */
  update_cat_supervisionlevels_by_pk?: Maybe<Cat_Supervisionlevels>;
  /** update multiples rows of table: "cat_supervisionlevels" */
  update_cat_supervisionlevels_many?: Maybe<Array<Maybe<Cat_Supervisionlevels_Mutation_Response>>>;
  /** update data of the table: "cat_tags" */
  update_cat_tags?: Maybe<Cat_Tags_Mutation_Response>;
  /** update single row of the table: "cat_tags" */
  update_cat_tags_by_pk?: Maybe<Cat_Tags>;
  /** update multiples rows of table: "cat_tags" */
  update_cat_tags_many?: Maybe<Array<Maybe<Cat_Tags_Mutation_Response>>>;
  /** update data of the table: "internal.review_lessons" */
  update_internal_review_lessons?: Maybe<Internal_Review_Lessons_Mutation_Response>;
  /** update single row of the table: "internal.review_lessons" */
  update_internal_review_lessons_by_pk?: Maybe<Internal_Review_Lessons>;
  /** update multiples rows of table: "internal.review_lessons" */
  update_internal_review_lessons_many?: Maybe<Array<Maybe<Internal_Review_Lessons_Mutation_Response>>>;
  /** update data of the table: "lessons" */
  update_lessons?: Maybe<Lessons_Mutation_Response>;
  /** update single row of the table: "lessons" */
  update_lessons_by_pk?: Maybe<Lessons>;
  /** update multiples rows of table: "lessons" */
  update_lessons_many?: Maybe<Array<Maybe<Lessons_Mutation_Response>>>;
  /** update data of the table: "pf_examboards" */
  update_pf_examboards?: Maybe<Pf_Examboards_Mutation_Response>;
  /** update single row of the table: "pf_examboards" */
  update_pf_examboards_by_pk?: Maybe<Pf_Examboards>;
  /** update multiples rows of table: "pf_examboards" */
  update_pf_examboards_many?: Maybe<Array<Maybe<Pf_Examboards_Mutation_Response>>>;
  /** update data of the table: "pf_keystages" */
  update_pf_keystages?: Maybe<Pf_Keystages_Mutation_Response>;
  /** update single row of the table: "pf_keystages" */
  update_pf_keystages_by_pk?: Maybe<Pf_Keystages>;
  /** update multiples rows of table: "pf_keystages" */
  update_pf_keystages_many?: Maybe<Array<Maybe<Pf_Keystages_Mutation_Response>>>;
  /** update data of the table: "pf_phases" */
  update_pf_phases?: Maybe<Pf_Phases_Mutation_Response>;
  /** update single row of the table: "pf_phases" */
  update_pf_phases_by_pk?: Maybe<Pf_Phases>;
  /** update multiples rows of table: "pf_phases" */
  update_pf_phases_many?: Maybe<Array<Maybe<Pf_Phases_Mutation_Response>>>;
  /** update data of the table: "pf_subjects" */
  update_pf_subjects?: Maybe<Pf_Subjects_Mutation_Response>;
  /** update single row of the table: "pf_subjects" */
  update_pf_subjects_by_pk?: Maybe<Pf_Subjects>;
  /** update multiples rows of table: "pf_subjects" */
  update_pf_subjects_many?: Maybe<Array<Maybe<Pf_Subjects_Mutation_Response>>>;
  /** update data of the table: "pf_tiers" */
  update_pf_tiers?: Maybe<Pf_Tiers_Mutation_Response>;
  /** update single row of the table: "pf_tiers" */
  update_pf_tiers_by_pk?: Maybe<Pf_Tiers>;
  /** update multiples rows of table: "pf_tiers" */
  update_pf_tiers_many?: Maybe<Array<Maybe<Pf_Tiers_Mutation_Response>>>;
  /** update data of the table: "pf_years" */
  update_pf_years?: Maybe<Pf_Years_Mutation_Response>;
  /** update single row of the table: "pf_years" */
  update_pf_years_by_pk?: Maybe<Pf_Years>;
  /** update multiples rows of table: "pf_years" */
  update_pf_years_many?: Maybe<Array<Maybe<Pf_Years_Mutation_Response>>>;
  /** update data of the table: "programme_threads" */
  update_programme_threads?: Maybe<Programme_Threads_Mutation_Response>;
  /** update single row of the table: "programme_threads" */
  update_programme_threads_by_pk?: Maybe<Programme_Threads>;
  /** update multiples rows of table: "programme_threads" */
  update_programme_threads_many?: Maybe<Array<Maybe<Programme_Threads_Mutation_Response>>>;
  /** update data of the table: "programme_units" */
  update_programme_units?: Maybe<Programme_Units_Mutation_Response>;
  /** update single row of the table: "programme_units" */
  update_programme_units_by_pk?: Maybe<Programme_Units>;
  /** update multiples rows of table: "programme_units" */
  update_programme_units_many?: Maybe<Array<Maybe<Programme_Units_Mutation_Response>>>;
  /** update data of the table: "programmes" */
  update_programmes?: Maybe<Programmes_Mutation_Response>;
  /** update single row of the table: "programmes" */
  update_programmes_by_pk?: Maybe<Programmes>;
  /** update multiples rows of table: "programmes" */
  update_programmes_many?: Maybe<Array<Maybe<Programmes_Mutation_Response>>>;
  /** update data of the table: "published.viewmanager" */
  update_published_viewmanager?: Maybe<Published_Viewmanager_Mutation_Response>;
  /** update single row of the table: "published.viewmanager" */
  update_published_viewmanager_by_pk?: Maybe<Published_Viewmanager>;
  /** update multiples rows of table: "published.viewmanager" */
  update_published_viewmanager_many?: Maybe<Array<Maybe<Published_Viewmanager_Mutation_Response>>>;
  /** update data of the table: "questions" */
  update_questions?: Maybe<Questions_Mutation_Response>;
  /** update single row of the table: "questions" */
  update_questions_by_pk?: Maybe<Questions>;
  /** update multiples rows of table: "questions" */
  update_questions_many?: Maybe<Array<Maybe<Questions_Mutation_Response>>>;
  /** update data of the table: "quiz_questions" */
  update_quiz_questions?: Maybe<Quiz_Questions_Mutation_Response>;
  /** update single row of the table: "quiz_questions" */
  update_quiz_questions_by_pk?: Maybe<Quiz_Questions>;
  /** update multiples rows of table: "quiz_questions" */
  update_quiz_questions_many?: Maybe<Array<Maybe<Quiz_Questions_Mutation_Response>>>;
  /** update data of the table: "quizzes" */
  update_quizzes?: Maybe<Quizzes_Mutation_Response>;
  /** update single row of the table: "quizzes" */
  update_quizzes_by_pk?: Maybe<Quizzes>;
  /** update multiples rows of table: "quizzes" */
  update_quizzes_many?: Maybe<Array<Maybe<Quizzes_Mutation_Response>>>;
  /** update data of the table: "thread_units" */
  update_thread_units?: Maybe<Thread_Units_Mutation_Response>;
  /** update single row of the table: "thread_units" */
  update_thread_units_by_pk?: Maybe<Thread_Units>;
  /** update multiples rows of table: "thread_units" */
  update_thread_units_many?: Maybe<Array<Maybe<Thread_Units_Mutation_Response>>>;
  /** update data of the table: "threads" */
  update_threads?: Maybe<Threads_Mutation_Response>;
  /** update single row of the table: "threads" */
  update_threads_by_pk?: Maybe<Threads>;
  /** update multiples rows of table: "threads" */
  update_threads_many?: Maybe<Array<Maybe<Threads_Mutation_Response>>>;
  /** update data of the table: "units" */
  update_units?: Maybe<Units_Mutation_Response>;
  /** update single row of the table: "units" */
  update_units_by_pk?: Maybe<Units>;
  /** update multiples rows of table: "units" */
  update_units_many?: Maybe<Array<Maybe<Units_Mutation_Response>>>;
  /** update data of the table: "unitvariant_lessons" */
  update_unitvariant_lessons?: Maybe<Unitvariant_Lessons_Mutation_Response>;
  /** update single row of the table: "unitvariant_lessons" */
  update_unitvariant_lessons_by_pk?: Maybe<Unitvariant_Lessons>;
  /** update multiples rows of table: "unitvariant_lessons" */
  update_unitvariant_lessons_many?: Maybe<Array<Maybe<Unitvariant_Lessons_Mutation_Response>>>;
  /** update data of the table: "unitvariants" */
  update_unitvariants?: Maybe<Unitvariants_Mutation_Response>;
  /** update single row of the table: "unitvariants" */
  update_unitvariants_by_pk?: Maybe<Unitvariants>;
  /** update multiples rows of table: "unitvariants" */
  update_unitvariants_many?: Maybe<Array<Maybe<Unitvariants_Mutation_Response>>>;
  /** update data of the table: "videocaptions" */
  update_videocaptions?: Maybe<Videocaptions_Mutation_Response>;
  /** update single row of the table: "videocaptions" */
  update_videocaptions_by_pk?: Maybe<Videocaptions>;
  /** update multiples rows of table: "videocaptions" */
  update_videocaptions_many?: Maybe<Array<Maybe<Videocaptions_Mutation_Response>>>;
  /** update data of the table: "videos" */
  update_videos?: Maybe<Videos_Mutation_Response>;
  /** update single row of the table: "videos" */
  update_videos_by_pk?: Maybe<Videos>;
  /** update multiples rows of table: "videos" */
  update_videos_many?: Maybe<Array<Maybe<Videos_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootDelete_AssetsArgs = {
  where: Assets_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Assets_By_PkArgs = {
  _state: Scalars['String']['input'];
  asset_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Cat_ContentguidanceArgs = {
  where: Cat_Contentguidance_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cat_Contentguidance_By_PkArgs = {
  _state: Scalars['String']['input'];
  contentguidance_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Cat_ExamboardspecsArgs = {
  where: Cat_Examboardspecs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cat_Examboardspecs_By_PkArgs = {
  _state: Scalars['String']['input'];
  examboardspecs_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Cat_NationalcurriculumArgs = {
  where: Cat_Nationalcurriculum_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cat_Nationalcurriculum_By_PkArgs = {
  _state: Scalars['String']['input'];
  nationalcurriculum_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Cat_SupervisionlevelsArgs = {
  where: Cat_Supervisionlevels_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cat_Supervisionlevels_By_PkArgs = {
  _state: Scalars['String']['input'];
  supervisionlevel_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Cat_TagsArgs = {
  where: Cat_Tags_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cat_Tags_By_PkArgs = {
  _state: Scalars['String']['input'];
  tag_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Internal_Review_LessonsArgs = {
  where: Internal_Review_Lessons_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Internal_Review_Lessons_By_PkArgs = {
  _state: Scalars['String']['input'];
  lesson_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_LessonsArgs = {
  where: Lessons_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Lessons_By_PkArgs = {
  _state: Scalars['String']['input'];
  lesson_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Pf_ExamboardsArgs = {
  where: Pf_Examboards_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Pf_Examboards_By_PkArgs = {
  _state: Scalars['String']['input'];
  examboard_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Pf_KeystagesArgs = {
  where: Pf_Keystages_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Pf_Keystages_By_PkArgs = {
  _state: Scalars['String']['input'];
  keystage_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Pf_PhasesArgs = {
  where: Pf_Phases_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Pf_Phases_By_PkArgs = {
  _state: Scalars['String']['input'];
  phase_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Pf_SubjectsArgs = {
  where: Pf_Subjects_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Pf_Subjects_By_PkArgs = {
  _state: Scalars['String']['input'];
  subject_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Pf_TiersArgs = {
  where: Pf_Tiers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Pf_Tiers_By_PkArgs = {
  _state: Scalars['String']['input'];
  tier_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Pf_YearsArgs = {
  where: Pf_Years_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Pf_Years_By_PkArgs = {
  _state: Scalars['String']['input'];
  year_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Programme_ThreadsArgs = {
  where: Programme_Threads_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Programme_Threads_By_PkArgs = {
  _state: Scalars['String']['input'];
  programme_id: Scalars['Int']['input'];
  thread_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Programme_UnitsArgs = {
  where: Programme_Units_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Programme_Units_By_PkArgs = {
  _state: Scalars['String']['input'];
  programme_id: Scalars['Int']['input'];
  unit_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_ProgrammesArgs = {
  where: Programmes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Programmes_By_PkArgs = {
  _state: Scalars['String']['input'];
  programme_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Published_ViewmanagerArgs = {
  where: Published_Viewmanager_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Published_Viewmanager_By_PkArgs = {
  viewmanager_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_QuestionsArgs = {
  where: Questions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Questions_By_PkArgs = {
  _state: Scalars['String']['input'];
  question_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Quiz_QuestionsArgs = {
  where: Quiz_Questions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Quiz_Questions_By_PkArgs = {
  _state: Scalars['String']['input'];
  question_id: Scalars['Int']['input'];
  quiz_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_QuizzesArgs = {
  where: Quizzes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Quizzes_By_PkArgs = {
  _state: Scalars['String']['input'];
  quiz_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Thread_UnitsArgs = {
  where: Thread_Units_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Thread_Units_By_PkArgs = {
  _state: Scalars['String']['input'];
  thread_id: Scalars['Int']['input'];
  unit_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_ThreadsArgs = {
  where: Threads_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Threads_By_PkArgs = {
  _state: Scalars['String']['input'];
  thread_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_UnitsArgs = {
  where: Units_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Units_By_PkArgs = {
  _state: Scalars['String']['input'];
  unit_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Unitvariant_LessonsArgs = {
  where: Unitvariant_Lessons_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Unitvariant_Lessons_By_PkArgs = {
  _state: Scalars['String']['input'];
  lesson_id: Scalars['Int']['input'];
  unitvariant_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_UnitvariantsArgs = {
  where: Unitvariants_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Unitvariants_By_PkArgs = {
  _state: Scalars['String']['input'];
  unitvariant_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_VideocaptionsArgs = {
  where: Videocaptions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Videocaptions_By_PkArgs = {
  _state: Scalars['String']['input'];
  caption_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_VideosArgs = {
  where: Videos_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Videos_By_PkArgs = {
  _state: Scalars['String']['input'];
  video_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootInsert_AssetsArgs = {
  objects: Array<Assets_Insert_Input>;
  on_conflict?: InputMaybe<Assets_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Assets_OneArgs = {
  object: Assets_Insert_Input;
  on_conflict?: InputMaybe<Assets_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cat_ContentguidanceArgs = {
  objects: Array<Cat_Contentguidance_Insert_Input>;
  on_conflict?: InputMaybe<Cat_Contentguidance_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cat_Contentguidance_OneArgs = {
  object: Cat_Contentguidance_Insert_Input;
  on_conflict?: InputMaybe<Cat_Contentguidance_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cat_ExamboardspecsArgs = {
  objects: Array<Cat_Examboardspecs_Insert_Input>;
  on_conflict?: InputMaybe<Cat_Examboardspecs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cat_Examboardspecs_OneArgs = {
  object: Cat_Examboardspecs_Insert_Input;
  on_conflict?: InputMaybe<Cat_Examboardspecs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cat_NationalcurriculumArgs = {
  objects: Array<Cat_Nationalcurriculum_Insert_Input>;
  on_conflict?: InputMaybe<Cat_Nationalcurriculum_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cat_Nationalcurriculum_OneArgs = {
  object: Cat_Nationalcurriculum_Insert_Input;
  on_conflict?: InputMaybe<Cat_Nationalcurriculum_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cat_SupervisionlevelsArgs = {
  objects: Array<Cat_Supervisionlevels_Insert_Input>;
  on_conflict?: InputMaybe<Cat_Supervisionlevels_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cat_Supervisionlevels_OneArgs = {
  object: Cat_Supervisionlevels_Insert_Input;
  on_conflict?: InputMaybe<Cat_Supervisionlevels_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cat_TagsArgs = {
  objects: Array<Cat_Tags_Insert_Input>;
  on_conflict?: InputMaybe<Cat_Tags_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cat_Tags_OneArgs = {
  object: Cat_Tags_Insert_Input;
  on_conflict?: InputMaybe<Cat_Tags_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Internal_Review_LessonsArgs = {
  objects: Array<Internal_Review_Lessons_Insert_Input>;
  on_conflict?: InputMaybe<Internal_Review_Lessons_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Internal_Review_Lessons_OneArgs = {
  object: Internal_Review_Lessons_Insert_Input;
  on_conflict?: InputMaybe<Internal_Review_Lessons_On_Conflict>;
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
export type Mutation_RootInsert_Pf_ExamboardsArgs = {
  objects: Array<Pf_Examboards_Insert_Input>;
  on_conflict?: InputMaybe<Pf_Examboards_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Pf_Examboards_OneArgs = {
  object: Pf_Examboards_Insert_Input;
  on_conflict?: InputMaybe<Pf_Examboards_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Pf_KeystagesArgs = {
  objects: Array<Pf_Keystages_Insert_Input>;
  on_conflict?: InputMaybe<Pf_Keystages_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Pf_Keystages_OneArgs = {
  object: Pf_Keystages_Insert_Input;
  on_conflict?: InputMaybe<Pf_Keystages_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Pf_PhasesArgs = {
  objects: Array<Pf_Phases_Insert_Input>;
  on_conflict?: InputMaybe<Pf_Phases_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Pf_Phases_OneArgs = {
  object: Pf_Phases_Insert_Input;
  on_conflict?: InputMaybe<Pf_Phases_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Pf_SubjectsArgs = {
  objects: Array<Pf_Subjects_Insert_Input>;
  on_conflict?: InputMaybe<Pf_Subjects_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Pf_Subjects_OneArgs = {
  object: Pf_Subjects_Insert_Input;
  on_conflict?: InputMaybe<Pf_Subjects_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Pf_TiersArgs = {
  objects: Array<Pf_Tiers_Insert_Input>;
  on_conflict?: InputMaybe<Pf_Tiers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Pf_Tiers_OneArgs = {
  object: Pf_Tiers_Insert_Input;
  on_conflict?: InputMaybe<Pf_Tiers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Pf_YearsArgs = {
  objects: Array<Pf_Years_Insert_Input>;
  on_conflict?: InputMaybe<Pf_Years_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Pf_Years_OneArgs = {
  object: Pf_Years_Insert_Input;
  on_conflict?: InputMaybe<Pf_Years_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Programme_ThreadsArgs = {
  objects: Array<Programme_Threads_Insert_Input>;
  on_conflict?: InputMaybe<Programme_Threads_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Programme_Threads_OneArgs = {
  object: Programme_Threads_Insert_Input;
  on_conflict?: InputMaybe<Programme_Threads_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Programme_UnitsArgs = {
  objects: Array<Programme_Units_Insert_Input>;
  on_conflict?: InputMaybe<Programme_Units_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Programme_Units_OneArgs = {
  object: Programme_Units_Insert_Input;
  on_conflict?: InputMaybe<Programme_Units_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ProgrammesArgs = {
  objects: Array<Programmes_Insert_Input>;
  on_conflict?: InputMaybe<Programmes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Programmes_OneArgs = {
  object: Programmes_Insert_Input;
  on_conflict?: InputMaybe<Programmes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Published_ViewmanagerArgs = {
  objects: Array<Published_Viewmanager_Insert_Input>;
  on_conflict?: InputMaybe<Published_Viewmanager_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Published_Viewmanager_OneArgs = {
  object: Published_Viewmanager_Insert_Input;
  on_conflict?: InputMaybe<Published_Viewmanager_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_QuestionsArgs = {
  objects: Array<Questions_Insert_Input>;
  on_conflict?: InputMaybe<Questions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Questions_OneArgs = {
  object: Questions_Insert_Input;
  on_conflict?: InputMaybe<Questions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Quiz_QuestionsArgs = {
  objects: Array<Quiz_Questions_Insert_Input>;
  on_conflict?: InputMaybe<Quiz_Questions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Quiz_Questions_OneArgs = {
  object: Quiz_Questions_Insert_Input;
  on_conflict?: InputMaybe<Quiz_Questions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_QuizzesArgs = {
  objects: Array<Quizzes_Insert_Input>;
  on_conflict?: InputMaybe<Quizzes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Quizzes_OneArgs = {
  object: Quizzes_Insert_Input;
  on_conflict?: InputMaybe<Quizzes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Thread_UnitsArgs = {
  objects: Array<Thread_Units_Insert_Input>;
  on_conflict?: InputMaybe<Thread_Units_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Thread_Units_OneArgs = {
  object: Thread_Units_Insert_Input;
  on_conflict?: InputMaybe<Thread_Units_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ThreadsArgs = {
  objects: Array<Threads_Insert_Input>;
  on_conflict?: InputMaybe<Threads_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Threads_OneArgs = {
  object: Threads_Insert_Input;
  on_conflict?: InputMaybe<Threads_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UnitsArgs = {
  objects: Array<Units_Insert_Input>;
  on_conflict?: InputMaybe<Units_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Units_OneArgs = {
  object: Units_Insert_Input;
  on_conflict?: InputMaybe<Units_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Unitvariant_LessonsArgs = {
  objects: Array<Unitvariant_Lessons_Insert_Input>;
  on_conflict?: InputMaybe<Unitvariant_Lessons_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Unitvariant_Lessons_OneArgs = {
  object: Unitvariant_Lessons_Insert_Input;
  on_conflict?: InputMaybe<Unitvariant_Lessons_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UnitvariantsArgs = {
  objects: Array<Unitvariants_Insert_Input>;
  on_conflict?: InputMaybe<Unitvariants_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Unitvariants_OneArgs = {
  object: Unitvariants_Insert_Input;
  on_conflict?: InputMaybe<Unitvariants_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_VideocaptionsArgs = {
  objects: Array<Videocaptions_Insert_Input>;
  on_conflict?: InputMaybe<Videocaptions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Videocaptions_OneArgs = {
  object: Videocaptions_Insert_Input;
  on_conflict?: InputMaybe<Videocaptions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_VideosArgs = {
  objects: Array<Videos_Insert_Input>;
  on_conflict?: InputMaybe<Videos_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Videos_OneArgs = {
  object: Videos_Insert_Input;
  on_conflict?: InputMaybe<Videos_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_AssetsArgs = {
  _append?: InputMaybe<Assets_Append_Input>;
  _delete_at_path?: InputMaybe<Assets_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Assets_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Assets_Delete_Key_Input>;
  _inc?: InputMaybe<Assets_Inc_Input>;
  _prepend?: InputMaybe<Assets_Prepend_Input>;
  _set?: InputMaybe<Assets_Set_Input>;
  where: Assets_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Assets_By_PkArgs = {
  _append?: InputMaybe<Assets_Append_Input>;
  _delete_at_path?: InputMaybe<Assets_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Assets_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Assets_Delete_Key_Input>;
  _inc?: InputMaybe<Assets_Inc_Input>;
  _prepend?: InputMaybe<Assets_Prepend_Input>;
  _set?: InputMaybe<Assets_Set_Input>;
  pk_columns: Assets_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Assets_ManyArgs = {
  updates: Array<Assets_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Cat_ContentguidanceArgs = {
  _append?: InputMaybe<Cat_Contentguidance_Append_Input>;
  _delete_at_path?: InputMaybe<Cat_Contentguidance_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Cat_Contentguidance_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Cat_Contentguidance_Delete_Key_Input>;
  _inc?: InputMaybe<Cat_Contentguidance_Inc_Input>;
  _prepend?: InputMaybe<Cat_Contentguidance_Prepend_Input>;
  _set?: InputMaybe<Cat_Contentguidance_Set_Input>;
  where: Cat_Contentguidance_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cat_Contentguidance_By_PkArgs = {
  _append?: InputMaybe<Cat_Contentguidance_Append_Input>;
  _delete_at_path?: InputMaybe<Cat_Contentguidance_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Cat_Contentguidance_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Cat_Contentguidance_Delete_Key_Input>;
  _inc?: InputMaybe<Cat_Contentguidance_Inc_Input>;
  _prepend?: InputMaybe<Cat_Contentguidance_Prepend_Input>;
  _set?: InputMaybe<Cat_Contentguidance_Set_Input>;
  pk_columns: Cat_Contentguidance_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cat_Contentguidance_ManyArgs = {
  updates: Array<Cat_Contentguidance_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Cat_ExamboardspecsArgs = {
  _append?: InputMaybe<Cat_Examboardspecs_Append_Input>;
  _delete_at_path?: InputMaybe<Cat_Examboardspecs_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Cat_Examboardspecs_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Cat_Examboardspecs_Delete_Key_Input>;
  _inc?: InputMaybe<Cat_Examboardspecs_Inc_Input>;
  _prepend?: InputMaybe<Cat_Examboardspecs_Prepend_Input>;
  _set?: InputMaybe<Cat_Examboardspecs_Set_Input>;
  where: Cat_Examboardspecs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cat_Examboardspecs_By_PkArgs = {
  _append?: InputMaybe<Cat_Examboardspecs_Append_Input>;
  _delete_at_path?: InputMaybe<Cat_Examboardspecs_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Cat_Examboardspecs_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Cat_Examboardspecs_Delete_Key_Input>;
  _inc?: InputMaybe<Cat_Examboardspecs_Inc_Input>;
  _prepend?: InputMaybe<Cat_Examboardspecs_Prepend_Input>;
  _set?: InputMaybe<Cat_Examboardspecs_Set_Input>;
  pk_columns: Cat_Examboardspecs_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cat_Examboardspecs_ManyArgs = {
  updates: Array<Cat_Examboardspecs_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Cat_NationalcurriculumArgs = {
  _append?: InputMaybe<Cat_Nationalcurriculum_Append_Input>;
  _delete_at_path?: InputMaybe<Cat_Nationalcurriculum_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Cat_Nationalcurriculum_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Cat_Nationalcurriculum_Delete_Key_Input>;
  _inc?: InputMaybe<Cat_Nationalcurriculum_Inc_Input>;
  _prepend?: InputMaybe<Cat_Nationalcurriculum_Prepend_Input>;
  _set?: InputMaybe<Cat_Nationalcurriculum_Set_Input>;
  where: Cat_Nationalcurriculum_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cat_Nationalcurriculum_By_PkArgs = {
  _append?: InputMaybe<Cat_Nationalcurriculum_Append_Input>;
  _delete_at_path?: InputMaybe<Cat_Nationalcurriculum_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Cat_Nationalcurriculum_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Cat_Nationalcurriculum_Delete_Key_Input>;
  _inc?: InputMaybe<Cat_Nationalcurriculum_Inc_Input>;
  _prepend?: InputMaybe<Cat_Nationalcurriculum_Prepend_Input>;
  _set?: InputMaybe<Cat_Nationalcurriculum_Set_Input>;
  pk_columns: Cat_Nationalcurriculum_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cat_Nationalcurriculum_ManyArgs = {
  updates: Array<Cat_Nationalcurriculum_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Cat_SupervisionlevelsArgs = {
  _inc?: InputMaybe<Cat_Supervisionlevels_Inc_Input>;
  _set?: InputMaybe<Cat_Supervisionlevels_Set_Input>;
  where: Cat_Supervisionlevels_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cat_Supervisionlevels_By_PkArgs = {
  _inc?: InputMaybe<Cat_Supervisionlevels_Inc_Input>;
  _set?: InputMaybe<Cat_Supervisionlevels_Set_Input>;
  pk_columns: Cat_Supervisionlevels_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cat_Supervisionlevels_ManyArgs = {
  updates: Array<Cat_Supervisionlevels_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Cat_TagsArgs = {
  _append?: InputMaybe<Cat_Tags_Append_Input>;
  _delete_at_path?: InputMaybe<Cat_Tags_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Cat_Tags_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Cat_Tags_Delete_Key_Input>;
  _inc?: InputMaybe<Cat_Tags_Inc_Input>;
  _prepend?: InputMaybe<Cat_Tags_Prepend_Input>;
  _set?: InputMaybe<Cat_Tags_Set_Input>;
  where: Cat_Tags_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cat_Tags_By_PkArgs = {
  _append?: InputMaybe<Cat_Tags_Append_Input>;
  _delete_at_path?: InputMaybe<Cat_Tags_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Cat_Tags_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Cat_Tags_Delete_Key_Input>;
  _inc?: InputMaybe<Cat_Tags_Inc_Input>;
  _prepend?: InputMaybe<Cat_Tags_Prepend_Input>;
  _set?: InputMaybe<Cat_Tags_Set_Input>;
  pk_columns: Cat_Tags_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cat_Tags_ManyArgs = {
  updates: Array<Cat_Tags_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Internal_Review_LessonsArgs = {
  _append?: InputMaybe<Internal_Review_Lessons_Append_Input>;
  _delete_at_path?: InputMaybe<Internal_Review_Lessons_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Internal_Review_Lessons_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Internal_Review_Lessons_Delete_Key_Input>;
  _inc?: InputMaybe<Internal_Review_Lessons_Inc_Input>;
  _prepend?: InputMaybe<Internal_Review_Lessons_Prepend_Input>;
  _set?: InputMaybe<Internal_Review_Lessons_Set_Input>;
  where: Internal_Review_Lessons_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Internal_Review_Lessons_By_PkArgs = {
  _append?: InputMaybe<Internal_Review_Lessons_Append_Input>;
  _delete_at_path?: InputMaybe<Internal_Review_Lessons_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Internal_Review_Lessons_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Internal_Review_Lessons_Delete_Key_Input>;
  _inc?: InputMaybe<Internal_Review_Lessons_Inc_Input>;
  _prepend?: InputMaybe<Internal_Review_Lessons_Prepend_Input>;
  _set?: InputMaybe<Internal_Review_Lessons_Set_Input>;
  pk_columns: Internal_Review_Lessons_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Internal_Review_Lessons_ManyArgs = {
  updates: Array<Internal_Review_Lessons_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_LessonsArgs = {
  _inc?: InputMaybe<Lessons_Inc_Input>;
  _set?: InputMaybe<Lessons_Set_Input>;
  where: Lessons_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Lessons_By_PkArgs = {
  _inc?: InputMaybe<Lessons_Inc_Input>;
  _set?: InputMaybe<Lessons_Set_Input>;
  pk_columns: Lessons_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Lessons_ManyArgs = {
  updates: Array<Lessons_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Pf_ExamboardsArgs = {
  _inc?: InputMaybe<Pf_Examboards_Inc_Input>;
  _set?: InputMaybe<Pf_Examboards_Set_Input>;
  where: Pf_Examboards_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Pf_Examboards_By_PkArgs = {
  _inc?: InputMaybe<Pf_Examboards_Inc_Input>;
  _set?: InputMaybe<Pf_Examboards_Set_Input>;
  pk_columns: Pf_Examboards_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Pf_Examboards_ManyArgs = {
  updates: Array<Pf_Examboards_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Pf_KeystagesArgs = {
  _inc?: InputMaybe<Pf_Keystages_Inc_Input>;
  _set?: InputMaybe<Pf_Keystages_Set_Input>;
  where: Pf_Keystages_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Pf_Keystages_By_PkArgs = {
  _inc?: InputMaybe<Pf_Keystages_Inc_Input>;
  _set?: InputMaybe<Pf_Keystages_Set_Input>;
  pk_columns: Pf_Keystages_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Pf_Keystages_ManyArgs = {
  updates: Array<Pf_Keystages_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Pf_PhasesArgs = {
  _inc?: InputMaybe<Pf_Phases_Inc_Input>;
  _set?: InputMaybe<Pf_Phases_Set_Input>;
  where: Pf_Phases_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Pf_Phases_By_PkArgs = {
  _inc?: InputMaybe<Pf_Phases_Inc_Input>;
  _set?: InputMaybe<Pf_Phases_Set_Input>;
  pk_columns: Pf_Phases_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Pf_Phases_ManyArgs = {
  updates: Array<Pf_Phases_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Pf_SubjectsArgs = {
  _inc?: InputMaybe<Pf_Subjects_Inc_Input>;
  _set?: InputMaybe<Pf_Subjects_Set_Input>;
  where: Pf_Subjects_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Pf_Subjects_By_PkArgs = {
  _inc?: InputMaybe<Pf_Subjects_Inc_Input>;
  _set?: InputMaybe<Pf_Subjects_Set_Input>;
  pk_columns: Pf_Subjects_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Pf_Subjects_ManyArgs = {
  updates: Array<Pf_Subjects_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Pf_TiersArgs = {
  _inc?: InputMaybe<Pf_Tiers_Inc_Input>;
  _set?: InputMaybe<Pf_Tiers_Set_Input>;
  where: Pf_Tiers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Pf_Tiers_By_PkArgs = {
  _inc?: InputMaybe<Pf_Tiers_Inc_Input>;
  _set?: InputMaybe<Pf_Tiers_Set_Input>;
  pk_columns: Pf_Tiers_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Pf_Tiers_ManyArgs = {
  updates: Array<Pf_Tiers_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Pf_YearsArgs = {
  _inc?: InputMaybe<Pf_Years_Inc_Input>;
  _set?: InputMaybe<Pf_Years_Set_Input>;
  where: Pf_Years_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Pf_Years_By_PkArgs = {
  _inc?: InputMaybe<Pf_Years_Inc_Input>;
  _set?: InputMaybe<Pf_Years_Set_Input>;
  pk_columns: Pf_Years_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Pf_Years_ManyArgs = {
  updates: Array<Pf_Years_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Programme_ThreadsArgs = {
  _append?: InputMaybe<Programme_Threads_Append_Input>;
  _delete_at_path?: InputMaybe<Programme_Threads_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Programme_Threads_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Programme_Threads_Delete_Key_Input>;
  _inc?: InputMaybe<Programme_Threads_Inc_Input>;
  _prepend?: InputMaybe<Programme_Threads_Prepend_Input>;
  _set?: InputMaybe<Programme_Threads_Set_Input>;
  where: Programme_Threads_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Programme_Threads_By_PkArgs = {
  _append?: InputMaybe<Programme_Threads_Append_Input>;
  _delete_at_path?: InputMaybe<Programme_Threads_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Programme_Threads_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Programme_Threads_Delete_Key_Input>;
  _inc?: InputMaybe<Programme_Threads_Inc_Input>;
  _prepend?: InputMaybe<Programme_Threads_Prepend_Input>;
  _set?: InputMaybe<Programme_Threads_Set_Input>;
  pk_columns: Programme_Threads_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Programme_Threads_ManyArgs = {
  updates: Array<Programme_Threads_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Programme_UnitsArgs = {
  _append?: InputMaybe<Programme_Units_Append_Input>;
  _delete_at_path?: InputMaybe<Programme_Units_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Programme_Units_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Programme_Units_Delete_Key_Input>;
  _inc?: InputMaybe<Programme_Units_Inc_Input>;
  _prepend?: InputMaybe<Programme_Units_Prepend_Input>;
  _set?: InputMaybe<Programme_Units_Set_Input>;
  where: Programme_Units_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Programme_Units_By_PkArgs = {
  _append?: InputMaybe<Programme_Units_Append_Input>;
  _delete_at_path?: InputMaybe<Programme_Units_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Programme_Units_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Programme_Units_Delete_Key_Input>;
  _inc?: InputMaybe<Programme_Units_Inc_Input>;
  _prepend?: InputMaybe<Programme_Units_Prepend_Input>;
  _set?: InputMaybe<Programme_Units_Set_Input>;
  pk_columns: Programme_Units_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Programme_Units_ManyArgs = {
  updates: Array<Programme_Units_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_ProgrammesArgs = {
  _append?: InputMaybe<Programmes_Append_Input>;
  _delete_at_path?: InputMaybe<Programmes_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Programmes_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Programmes_Delete_Key_Input>;
  _inc?: InputMaybe<Programmes_Inc_Input>;
  _prepend?: InputMaybe<Programmes_Prepend_Input>;
  _set?: InputMaybe<Programmes_Set_Input>;
  where: Programmes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Programmes_By_PkArgs = {
  _append?: InputMaybe<Programmes_Append_Input>;
  _delete_at_path?: InputMaybe<Programmes_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Programmes_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Programmes_Delete_Key_Input>;
  _inc?: InputMaybe<Programmes_Inc_Input>;
  _prepend?: InputMaybe<Programmes_Prepend_Input>;
  _set?: InputMaybe<Programmes_Set_Input>;
  pk_columns: Programmes_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Programmes_ManyArgs = {
  updates: Array<Programmes_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Published_ViewmanagerArgs = {
  _inc?: InputMaybe<Published_Viewmanager_Inc_Input>;
  _set?: InputMaybe<Published_Viewmanager_Set_Input>;
  where: Published_Viewmanager_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Published_Viewmanager_By_PkArgs = {
  _inc?: InputMaybe<Published_Viewmanager_Inc_Input>;
  _set?: InputMaybe<Published_Viewmanager_Set_Input>;
  pk_columns: Published_Viewmanager_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Published_Viewmanager_ManyArgs = {
  updates: Array<Published_Viewmanager_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_QuestionsArgs = {
  _inc?: InputMaybe<Questions_Inc_Input>;
  _set?: InputMaybe<Questions_Set_Input>;
  where: Questions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Questions_By_PkArgs = {
  _inc?: InputMaybe<Questions_Inc_Input>;
  _set?: InputMaybe<Questions_Set_Input>;
  pk_columns: Questions_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Questions_ManyArgs = {
  updates: Array<Questions_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Quiz_QuestionsArgs = {
  _append?: InputMaybe<Quiz_Questions_Append_Input>;
  _delete_at_path?: InputMaybe<Quiz_Questions_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Quiz_Questions_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Quiz_Questions_Delete_Key_Input>;
  _inc?: InputMaybe<Quiz_Questions_Inc_Input>;
  _prepend?: InputMaybe<Quiz_Questions_Prepend_Input>;
  _set?: InputMaybe<Quiz_Questions_Set_Input>;
  where: Quiz_Questions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Quiz_Questions_By_PkArgs = {
  _append?: InputMaybe<Quiz_Questions_Append_Input>;
  _delete_at_path?: InputMaybe<Quiz_Questions_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Quiz_Questions_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Quiz_Questions_Delete_Key_Input>;
  _inc?: InputMaybe<Quiz_Questions_Inc_Input>;
  _prepend?: InputMaybe<Quiz_Questions_Prepend_Input>;
  _set?: InputMaybe<Quiz_Questions_Set_Input>;
  pk_columns: Quiz_Questions_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Quiz_Questions_ManyArgs = {
  updates: Array<Quiz_Questions_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_QuizzesArgs = {
  _inc?: InputMaybe<Quizzes_Inc_Input>;
  _set?: InputMaybe<Quizzes_Set_Input>;
  where: Quizzes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Quizzes_By_PkArgs = {
  _inc?: InputMaybe<Quizzes_Inc_Input>;
  _set?: InputMaybe<Quizzes_Set_Input>;
  pk_columns: Quizzes_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Quizzes_ManyArgs = {
  updates: Array<Quizzes_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Thread_UnitsArgs = {
  _inc?: InputMaybe<Thread_Units_Inc_Input>;
  _set?: InputMaybe<Thread_Units_Set_Input>;
  where: Thread_Units_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Thread_Units_By_PkArgs = {
  _inc?: InputMaybe<Thread_Units_Inc_Input>;
  _set?: InputMaybe<Thread_Units_Set_Input>;
  pk_columns: Thread_Units_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Thread_Units_ManyArgs = {
  updates: Array<Thread_Units_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_ThreadsArgs = {
  _inc?: InputMaybe<Threads_Inc_Input>;
  _set?: InputMaybe<Threads_Set_Input>;
  where: Threads_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Threads_By_PkArgs = {
  _inc?: InputMaybe<Threads_Inc_Input>;
  _set?: InputMaybe<Threads_Set_Input>;
  pk_columns: Threads_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Threads_ManyArgs = {
  updates: Array<Threads_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_UnitsArgs = {
  _inc?: InputMaybe<Units_Inc_Input>;
  _set?: InputMaybe<Units_Set_Input>;
  where: Units_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Units_By_PkArgs = {
  _inc?: InputMaybe<Units_Inc_Input>;
  _set?: InputMaybe<Units_Set_Input>;
  pk_columns: Units_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Units_ManyArgs = {
  updates: Array<Units_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Unitvariant_LessonsArgs = {
  _append?: InputMaybe<Unitvariant_Lessons_Append_Input>;
  _delete_at_path?: InputMaybe<Unitvariant_Lessons_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Unitvariant_Lessons_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Unitvariant_Lessons_Delete_Key_Input>;
  _inc?: InputMaybe<Unitvariant_Lessons_Inc_Input>;
  _prepend?: InputMaybe<Unitvariant_Lessons_Prepend_Input>;
  _set?: InputMaybe<Unitvariant_Lessons_Set_Input>;
  where: Unitvariant_Lessons_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Unitvariant_Lessons_By_PkArgs = {
  _append?: InputMaybe<Unitvariant_Lessons_Append_Input>;
  _delete_at_path?: InputMaybe<Unitvariant_Lessons_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Unitvariant_Lessons_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Unitvariant_Lessons_Delete_Key_Input>;
  _inc?: InputMaybe<Unitvariant_Lessons_Inc_Input>;
  _prepend?: InputMaybe<Unitvariant_Lessons_Prepend_Input>;
  _set?: InputMaybe<Unitvariant_Lessons_Set_Input>;
  pk_columns: Unitvariant_Lessons_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Unitvariant_Lessons_ManyArgs = {
  updates: Array<Unitvariant_Lessons_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_UnitvariantsArgs = {
  _append?: InputMaybe<Unitvariants_Append_Input>;
  _delete_at_path?: InputMaybe<Unitvariants_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Unitvariants_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Unitvariants_Delete_Key_Input>;
  _inc?: InputMaybe<Unitvariants_Inc_Input>;
  _prepend?: InputMaybe<Unitvariants_Prepend_Input>;
  _set?: InputMaybe<Unitvariants_Set_Input>;
  where: Unitvariants_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Unitvariants_By_PkArgs = {
  _append?: InputMaybe<Unitvariants_Append_Input>;
  _delete_at_path?: InputMaybe<Unitvariants_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Unitvariants_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Unitvariants_Delete_Key_Input>;
  _inc?: InputMaybe<Unitvariants_Inc_Input>;
  _prepend?: InputMaybe<Unitvariants_Prepend_Input>;
  _set?: InputMaybe<Unitvariants_Set_Input>;
  pk_columns: Unitvariants_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Unitvariants_ManyArgs = {
  updates: Array<Unitvariants_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_VideocaptionsArgs = {
  _inc?: InputMaybe<Videocaptions_Inc_Input>;
  _set?: InputMaybe<Videocaptions_Set_Input>;
  where: Videocaptions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Videocaptions_By_PkArgs = {
  _inc?: InputMaybe<Videocaptions_Inc_Input>;
  _set?: InputMaybe<Videocaptions_Set_Input>;
  pk_columns: Videocaptions_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Videocaptions_ManyArgs = {
  updates: Array<Videocaptions_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_VideosArgs = {
  _inc?: InputMaybe<Videos_Inc_Input>;
  _set?: InputMaybe<Videos_Set_Input>;
  where: Videos_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Videos_By_PkArgs = {
  _inc?: InputMaybe<Videos_Inc_Input>;
  _set?: InputMaybe<Videos_Set_Input>;
  pk_columns: Videos_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Videos_ManyArgs = {
  updates: Array<Videos_Updates>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>;
  _gt?: InputMaybe<Scalars['numeric']['input']>;
  _gte?: InputMaybe<Scalars['numeric']['input']>;
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['numeric']['input']>;
  _lte?: InputMaybe<Scalars['numeric']['input']>;
  _neq?: InputMaybe<Scalars['numeric']['input']>;
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
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

/** columns and relationships of "pf_examboards" */
export type Pf_Examboards = {
  __typename?: 'pf_examboards';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  examboard?: Maybe<Scalars['String']['output']>;
  examboard_id: Scalars['Int']['output'];
  slug?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "pf_examboards" */
export type Pf_Examboards_Aggregate = {
  __typename?: 'pf_examboards_aggregate';
  aggregate?: Maybe<Pf_Examboards_Aggregate_Fields>;
  nodes: Array<Pf_Examboards>;
};

/** aggregate fields of "pf_examboards" */
export type Pf_Examboards_Aggregate_Fields = {
  __typename?: 'pf_examboards_aggregate_fields';
  avg?: Maybe<Pf_Examboards_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Pf_Examboards_Max_Fields>;
  min?: Maybe<Pf_Examboards_Min_Fields>;
  stddev?: Maybe<Pf_Examboards_Stddev_Fields>;
  stddev_pop?: Maybe<Pf_Examboards_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Pf_Examboards_Stddev_Samp_Fields>;
  sum?: Maybe<Pf_Examboards_Sum_Fields>;
  var_pop?: Maybe<Pf_Examboards_Var_Pop_Fields>;
  var_samp?: Maybe<Pf_Examboards_Var_Samp_Fields>;
  variance?: Maybe<Pf_Examboards_Variance_Fields>;
};


/** aggregate fields of "pf_examboards" */
export type Pf_Examboards_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Pf_Examboards_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Pf_Examboards_Avg_Fields = {
  __typename?: 'pf_examboards_avg_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  examboard_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "pf_examboards". All fields are combined with a logical 'AND'. */
export type Pf_Examboards_Bool_Exp = {
  _and?: InputMaybe<Array<Pf_Examboards_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Pf_Examboards_Bool_Exp>;
  _or?: InputMaybe<Array<Pf_Examboards_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  display_order?: InputMaybe<Int_Comparison_Exp>;
  examboard?: InputMaybe<String_Comparison_Exp>;
  examboard_id?: InputMaybe<Int_Comparison_Exp>;
  slug?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "pf_examboards" */
export enum Pf_Examboards_Constraint {
  /** unique or primary key constraint on columns "examboard_id", "_state" */
  PfExamboardsPkey = 'pf_examboards_pkey',
  /** unique or primary key constraint on columns "slug", "_cohort", "_state" */
  PfExamboardsSlugStateCohortKey = 'pf_examboards_slug__state__cohort_key'
}

/** input type for incrementing numeric columns in table "pf_examboards" */
export type Pf_Examboards_Inc_Input = {
  display_order?: InputMaybe<Scalars['Int']['input']>;
  examboard_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "pf_examboards" */
export type Pf_Examboards_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  examboard?: InputMaybe<Scalars['String']['input']>;
  examboard_id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Pf_Examboards_Max_Fields = {
  __typename?: 'pf_examboards_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  examboard?: Maybe<Scalars['String']['output']>;
  examboard_id?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Pf_Examboards_Min_Fields = {
  __typename?: 'pf_examboards_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  examboard?: Maybe<Scalars['String']['output']>;
  examboard_id?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "pf_examboards" */
export type Pf_Examboards_Mutation_Response = {
  __typename?: 'pf_examboards_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Pf_Examboards>;
};

/** on_conflict condition type for table "pf_examboards" */
export type Pf_Examboards_On_Conflict = {
  constraint: Pf_Examboards_Constraint;
  update_columns?: Array<Pf_Examboards_Update_Column>;
  where?: InputMaybe<Pf_Examboards_Bool_Exp>;
};

/** Ordering options when selecting data from "pf_examboards". */
export type Pf_Examboards_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  display_order?: InputMaybe<Order_By>;
  examboard?: InputMaybe<Order_By>;
  examboard_id?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: pf_examboards */
export type Pf_Examboards_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  examboard_id: Scalars['Int']['input'];
};

/** select columns of table "pf_examboards" */
export enum Pf_Examboards_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  DisplayOrder = 'display_order',
  /** column name */
  Examboard = 'examboard',
  /** column name */
  ExamboardId = 'examboard_id',
  /** column name */
  Slug = 'slug',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "pf_examboards" */
export type Pf_Examboards_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  examboard?: InputMaybe<Scalars['String']['input']>;
  examboard_id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Pf_Examboards_Stddev_Fields = {
  __typename?: 'pf_examboards_stddev_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  examboard_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Pf_Examboards_Stddev_Pop_Fields = {
  __typename?: 'pf_examboards_stddev_pop_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  examboard_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Pf_Examboards_Stddev_Samp_Fields = {
  __typename?: 'pf_examboards_stddev_samp_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  examboard_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "pf_examboards" */
export type Pf_Examboards_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Pf_Examboards_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Pf_Examboards_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  examboard?: InputMaybe<Scalars['String']['input']>;
  examboard_id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Pf_Examboards_Sum_Fields = {
  __typename?: 'pf_examboards_sum_fields';
  display_order?: Maybe<Scalars['Int']['output']>;
  examboard_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "pf_examboards" */
export enum Pf_Examboards_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  DisplayOrder = 'display_order',
  /** column name */
  Examboard = 'examboard',
  /** column name */
  ExamboardId = 'examboard_id',
  /** column name */
  Slug = 'slug',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Pf_Examboards_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Pf_Examboards_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Pf_Examboards_Set_Input>;
  /** filter the rows which have to be updated */
  where: Pf_Examboards_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Pf_Examboards_Var_Pop_Fields = {
  __typename?: 'pf_examboards_var_pop_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  examboard_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Pf_Examboards_Var_Samp_Fields = {
  __typename?: 'pf_examboards_var_samp_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  examboard_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Pf_Examboards_Variance_Fields = {
  __typename?: 'pf_examboards_variance_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  examboard_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "pf_keystages" */
export type Pf_Keystages = {
  __typename?: 'pf_keystages';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  keystage?: Maybe<Scalars['String']['output']>;
  keystage_id: Scalars['Int']['output'];
  slug?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "pf_keystages" */
export type Pf_Keystages_Aggregate = {
  __typename?: 'pf_keystages_aggregate';
  aggregate?: Maybe<Pf_Keystages_Aggregate_Fields>;
  nodes: Array<Pf_Keystages>;
};

/** aggregate fields of "pf_keystages" */
export type Pf_Keystages_Aggregate_Fields = {
  __typename?: 'pf_keystages_aggregate_fields';
  avg?: Maybe<Pf_Keystages_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Pf_Keystages_Max_Fields>;
  min?: Maybe<Pf_Keystages_Min_Fields>;
  stddev?: Maybe<Pf_Keystages_Stddev_Fields>;
  stddev_pop?: Maybe<Pf_Keystages_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Pf_Keystages_Stddev_Samp_Fields>;
  sum?: Maybe<Pf_Keystages_Sum_Fields>;
  var_pop?: Maybe<Pf_Keystages_Var_Pop_Fields>;
  var_samp?: Maybe<Pf_Keystages_Var_Samp_Fields>;
  variance?: Maybe<Pf_Keystages_Variance_Fields>;
};


/** aggregate fields of "pf_keystages" */
export type Pf_Keystages_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Pf_Keystages_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Pf_Keystages_Avg_Fields = {
  __typename?: 'pf_keystages_avg_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  keystage_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "pf_keystages". All fields are combined with a logical 'AND'. */
export type Pf_Keystages_Bool_Exp = {
  _and?: InputMaybe<Array<Pf_Keystages_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Pf_Keystages_Bool_Exp>;
  _or?: InputMaybe<Array<Pf_Keystages_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  display_order?: InputMaybe<Int_Comparison_Exp>;
  keystage?: InputMaybe<String_Comparison_Exp>;
  keystage_id?: InputMaybe<Int_Comparison_Exp>;
  slug?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "pf_keystages" */
export enum Pf_Keystages_Constraint {
  /** unique or primary key constraint on columns "_state", "keystage_id" */
  PfKeystagesPkey = 'pf_keystages_pkey',
  /** unique or primary key constraint on columns "slug", "_cohort", "_state" */
  PfKeystagesSlugStateCohortKey = 'pf_keystages_slug__state__cohort_key'
}

/** input type for incrementing numeric columns in table "pf_keystages" */
export type Pf_Keystages_Inc_Input = {
  display_order?: InputMaybe<Scalars['Int']['input']>;
  keystage_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "pf_keystages" */
export type Pf_Keystages_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  keystage?: InputMaybe<Scalars['String']['input']>;
  keystage_id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Pf_Keystages_Max_Fields = {
  __typename?: 'pf_keystages_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  keystage?: Maybe<Scalars['String']['output']>;
  keystage_id?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Pf_Keystages_Min_Fields = {
  __typename?: 'pf_keystages_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  keystage?: Maybe<Scalars['String']['output']>;
  keystage_id?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "pf_keystages" */
export type Pf_Keystages_Mutation_Response = {
  __typename?: 'pf_keystages_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Pf_Keystages>;
};

/** on_conflict condition type for table "pf_keystages" */
export type Pf_Keystages_On_Conflict = {
  constraint: Pf_Keystages_Constraint;
  update_columns?: Array<Pf_Keystages_Update_Column>;
  where?: InputMaybe<Pf_Keystages_Bool_Exp>;
};

/** Ordering options when selecting data from "pf_keystages". */
export type Pf_Keystages_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  display_order?: InputMaybe<Order_By>;
  keystage?: InputMaybe<Order_By>;
  keystage_id?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: pf_keystages */
export type Pf_Keystages_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  keystage_id: Scalars['Int']['input'];
};

/** select columns of table "pf_keystages" */
export enum Pf_Keystages_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  DisplayOrder = 'display_order',
  /** column name */
  Keystage = 'keystage',
  /** column name */
  KeystageId = 'keystage_id',
  /** column name */
  Slug = 'slug',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "pf_keystages" */
export type Pf_Keystages_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  keystage?: InputMaybe<Scalars['String']['input']>;
  keystage_id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Pf_Keystages_Stddev_Fields = {
  __typename?: 'pf_keystages_stddev_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  keystage_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Pf_Keystages_Stddev_Pop_Fields = {
  __typename?: 'pf_keystages_stddev_pop_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  keystage_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Pf_Keystages_Stddev_Samp_Fields = {
  __typename?: 'pf_keystages_stddev_samp_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  keystage_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "pf_keystages" */
export type Pf_Keystages_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Pf_Keystages_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Pf_Keystages_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  keystage?: InputMaybe<Scalars['String']['input']>;
  keystage_id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Pf_Keystages_Sum_Fields = {
  __typename?: 'pf_keystages_sum_fields';
  display_order?: Maybe<Scalars['Int']['output']>;
  keystage_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "pf_keystages" */
export enum Pf_Keystages_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  DisplayOrder = 'display_order',
  /** column name */
  Keystage = 'keystage',
  /** column name */
  KeystageId = 'keystage_id',
  /** column name */
  Slug = 'slug',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Pf_Keystages_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Pf_Keystages_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Pf_Keystages_Set_Input>;
  /** filter the rows which have to be updated */
  where: Pf_Keystages_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Pf_Keystages_Var_Pop_Fields = {
  __typename?: 'pf_keystages_var_pop_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  keystage_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Pf_Keystages_Var_Samp_Fields = {
  __typename?: 'pf_keystages_var_samp_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  keystage_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Pf_Keystages_Variance_Fields = {
  __typename?: 'pf_keystages_variance_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  keystage_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "pf_phases" */
export type Pf_Phases = {
  __typename?: 'pf_phases';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  phase?: Maybe<Scalars['String']['output']>;
  phase_id: Scalars['Int']['output'];
  slug?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "pf_phases" */
export type Pf_Phases_Aggregate = {
  __typename?: 'pf_phases_aggregate';
  aggregate?: Maybe<Pf_Phases_Aggregate_Fields>;
  nodes: Array<Pf_Phases>;
};

/** aggregate fields of "pf_phases" */
export type Pf_Phases_Aggregate_Fields = {
  __typename?: 'pf_phases_aggregate_fields';
  avg?: Maybe<Pf_Phases_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Pf_Phases_Max_Fields>;
  min?: Maybe<Pf_Phases_Min_Fields>;
  stddev?: Maybe<Pf_Phases_Stddev_Fields>;
  stddev_pop?: Maybe<Pf_Phases_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Pf_Phases_Stddev_Samp_Fields>;
  sum?: Maybe<Pf_Phases_Sum_Fields>;
  var_pop?: Maybe<Pf_Phases_Var_Pop_Fields>;
  var_samp?: Maybe<Pf_Phases_Var_Samp_Fields>;
  variance?: Maybe<Pf_Phases_Variance_Fields>;
};


/** aggregate fields of "pf_phases" */
export type Pf_Phases_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Pf_Phases_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Pf_Phases_Avg_Fields = {
  __typename?: 'pf_phases_avg_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  phase_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "pf_phases". All fields are combined with a logical 'AND'. */
export type Pf_Phases_Bool_Exp = {
  _and?: InputMaybe<Array<Pf_Phases_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Pf_Phases_Bool_Exp>;
  _or?: InputMaybe<Array<Pf_Phases_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  display_order?: InputMaybe<Int_Comparison_Exp>;
  phase?: InputMaybe<String_Comparison_Exp>;
  phase_id?: InputMaybe<Int_Comparison_Exp>;
  slug?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "pf_phases" */
export enum Pf_Phases_Constraint {
  /** unique or primary key constraint on columns "phase_id", "_state" */
  PfPhasesPkey = 'pf_phases_pkey',
  /** unique or primary key constraint on columns "slug", "_cohort", "_state" */
  PfPhasesSlugStateCohortKey = 'pf_phases_slug__state__cohort_key'
}

/** input type for incrementing numeric columns in table "pf_phases" */
export type Pf_Phases_Inc_Input = {
  display_order?: InputMaybe<Scalars['Int']['input']>;
  phase_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "pf_phases" */
export type Pf_Phases_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  phase?: InputMaybe<Scalars['String']['input']>;
  phase_id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Pf_Phases_Max_Fields = {
  __typename?: 'pf_phases_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  phase?: Maybe<Scalars['String']['output']>;
  phase_id?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Pf_Phases_Min_Fields = {
  __typename?: 'pf_phases_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  phase?: Maybe<Scalars['String']['output']>;
  phase_id?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "pf_phases" */
export type Pf_Phases_Mutation_Response = {
  __typename?: 'pf_phases_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Pf_Phases>;
};

/** on_conflict condition type for table "pf_phases" */
export type Pf_Phases_On_Conflict = {
  constraint: Pf_Phases_Constraint;
  update_columns?: Array<Pf_Phases_Update_Column>;
  where?: InputMaybe<Pf_Phases_Bool_Exp>;
};

/** Ordering options when selecting data from "pf_phases". */
export type Pf_Phases_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  display_order?: InputMaybe<Order_By>;
  phase?: InputMaybe<Order_By>;
  phase_id?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: pf_phases */
export type Pf_Phases_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  phase_id: Scalars['Int']['input'];
};

/** select columns of table "pf_phases" */
export enum Pf_Phases_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  DisplayOrder = 'display_order',
  /** column name */
  Phase = 'phase',
  /** column name */
  PhaseId = 'phase_id',
  /** column name */
  Slug = 'slug',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "pf_phases" */
export type Pf_Phases_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  phase?: InputMaybe<Scalars['String']['input']>;
  phase_id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Pf_Phases_Stddev_Fields = {
  __typename?: 'pf_phases_stddev_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  phase_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Pf_Phases_Stddev_Pop_Fields = {
  __typename?: 'pf_phases_stddev_pop_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  phase_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Pf_Phases_Stddev_Samp_Fields = {
  __typename?: 'pf_phases_stddev_samp_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  phase_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "pf_phases" */
export type Pf_Phases_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Pf_Phases_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Pf_Phases_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  phase?: InputMaybe<Scalars['String']['input']>;
  phase_id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Pf_Phases_Sum_Fields = {
  __typename?: 'pf_phases_sum_fields';
  display_order?: Maybe<Scalars['Int']['output']>;
  phase_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "pf_phases" */
export enum Pf_Phases_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  DisplayOrder = 'display_order',
  /** column name */
  Phase = 'phase',
  /** column name */
  PhaseId = 'phase_id',
  /** column name */
  Slug = 'slug',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Pf_Phases_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Pf_Phases_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Pf_Phases_Set_Input>;
  /** filter the rows which have to be updated */
  where: Pf_Phases_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Pf_Phases_Var_Pop_Fields = {
  __typename?: 'pf_phases_var_pop_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  phase_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Pf_Phases_Var_Samp_Fields = {
  __typename?: 'pf_phases_var_samp_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  phase_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Pf_Phases_Variance_Fields = {
  __typename?: 'pf_phases_variance_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  phase_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "pf_subjects" */
export type Pf_Subjects = {
  __typename?: 'pf_subjects';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  subject?: Maybe<Scalars['String']['output']>;
  subject_id: Scalars['Int']['output'];
  subject_parent_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "pf_subjects" */
export type Pf_Subjects_Aggregate = {
  __typename?: 'pf_subjects_aggregate';
  aggregate?: Maybe<Pf_Subjects_Aggregate_Fields>;
  nodes: Array<Pf_Subjects>;
};

/** aggregate fields of "pf_subjects" */
export type Pf_Subjects_Aggregate_Fields = {
  __typename?: 'pf_subjects_aggregate_fields';
  avg?: Maybe<Pf_Subjects_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Pf_Subjects_Max_Fields>;
  min?: Maybe<Pf_Subjects_Min_Fields>;
  stddev?: Maybe<Pf_Subjects_Stddev_Fields>;
  stddev_pop?: Maybe<Pf_Subjects_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Pf_Subjects_Stddev_Samp_Fields>;
  sum?: Maybe<Pf_Subjects_Sum_Fields>;
  var_pop?: Maybe<Pf_Subjects_Var_Pop_Fields>;
  var_samp?: Maybe<Pf_Subjects_Var_Samp_Fields>;
  variance?: Maybe<Pf_Subjects_Variance_Fields>;
};


/** aggregate fields of "pf_subjects" */
export type Pf_Subjects_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Pf_Subjects_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Pf_Subjects_Avg_Fields = {
  __typename?: 'pf_subjects_avg_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  subject_id?: Maybe<Scalars['Float']['output']>;
  subject_parent_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "pf_subjects". All fields are combined with a logical 'AND'. */
export type Pf_Subjects_Bool_Exp = {
  _and?: InputMaybe<Array<Pf_Subjects_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Pf_Subjects_Bool_Exp>;
  _or?: InputMaybe<Array<Pf_Subjects_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  display_order?: InputMaybe<Int_Comparison_Exp>;
  slug?: InputMaybe<String_Comparison_Exp>;
  subject?: InputMaybe<String_Comparison_Exp>;
  subject_id?: InputMaybe<Int_Comparison_Exp>;
  subject_parent_id?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "pf_subjects" */
export enum Pf_Subjects_Constraint {
  /** unique or primary key constraint on columns "subject_id", "_state" */
  PfSubjectsPkey = 'pf_subjects_pkey',
  /** unique or primary key constraint on columns "slug", "_cohort", "_state" */
  PfSubjectsSlugStateCohortKey = 'pf_subjects_slug__state__cohort_key'
}

/** input type for incrementing numeric columns in table "pf_subjects" */
export type Pf_Subjects_Inc_Input = {
  display_order?: InputMaybe<Scalars['Int']['input']>;
  subject_id?: InputMaybe<Scalars['Int']['input']>;
  subject_parent_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "pf_subjects" */
export type Pf_Subjects_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
  subject_id?: InputMaybe<Scalars['Int']['input']>;
  subject_parent_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Pf_Subjects_Max_Fields = {
  __typename?: 'pf_subjects_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  subject?: Maybe<Scalars['String']['output']>;
  subject_id?: Maybe<Scalars['Int']['output']>;
  subject_parent_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Pf_Subjects_Min_Fields = {
  __typename?: 'pf_subjects_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  subject?: Maybe<Scalars['String']['output']>;
  subject_id?: Maybe<Scalars['Int']['output']>;
  subject_parent_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "pf_subjects" */
export type Pf_Subjects_Mutation_Response = {
  __typename?: 'pf_subjects_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Pf_Subjects>;
};

/** on_conflict condition type for table "pf_subjects" */
export type Pf_Subjects_On_Conflict = {
  constraint: Pf_Subjects_Constraint;
  update_columns?: Array<Pf_Subjects_Update_Column>;
  where?: InputMaybe<Pf_Subjects_Bool_Exp>;
};

/** Ordering options when selecting data from "pf_subjects". */
export type Pf_Subjects_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  display_order?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  subject?: InputMaybe<Order_By>;
  subject_id?: InputMaybe<Order_By>;
  subject_parent_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: pf_subjects */
export type Pf_Subjects_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  subject_id: Scalars['Int']['input'];
};

/** select columns of table "pf_subjects" */
export enum Pf_Subjects_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  DisplayOrder = 'display_order',
  /** column name */
  Slug = 'slug',
  /** column name */
  Subject = 'subject',
  /** column name */
  SubjectId = 'subject_id',
  /** column name */
  SubjectParentId = 'subject_parent_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "pf_subjects" */
export type Pf_Subjects_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
  subject_id?: InputMaybe<Scalars['Int']['input']>;
  subject_parent_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Pf_Subjects_Stddev_Fields = {
  __typename?: 'pf_subjects_stddev_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  subject_id?: Maybe<Scalars['Float']['output']>;
  subject_parent_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Pf_Subjects_Stddev_Pop_Fields = {
  __typename?: 'pf_subjects_stddev_pop_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  subject_id?: Maybe<Scalars['Float']['output']>;
  subject_parent_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Pf_Subjects_Stddev_Samp_Fields = {
  __typename?: 'pf_subjects_stddev_samp_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  subject_id?: Maybe<Scalars['Float']['output']>;
  subject_parent_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "pf_subjects" */
export type Pf_Subjects_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Pf_Subjects_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Pf_Subjects_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
  subject_id?: InputMaybe<Scalars['Int']['input']>;
  subject_parent_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Pf_Subjects_Sum_Fields = {
  __typename?: 'pf_subjects_sum_fields';
  display_order?: Maybe<Scalars['Int']['output']>;
  subject_id?: Maybe<Scalars['Int']['output']>;
  subject_parent_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "pf_subjects" */
export enum Pf_Subjects_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  DisplayOrder = 'display_order',
  /** column name */
  Slug = 'slug',
  /** column name */
  Subject = 'subject',
  /** column name */
  SubjectId = 'subject_id',
  /** column name */
  SubjectParentId = 'subject_parent_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Pf_Subjects_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Pf_Subjects_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Pf_Subjects_Set_Input>;
  /** filter the rows which have to be updated */
  where: Pf_Subjects_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Pf_Subjects_Var_Pop_Fields = {
  __typename?: 'pf_subjects_var_pop_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  subject_id?: Maybe<Scalars['Float']['output']>;
  subject_parent_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Pf_Subjects_Var_Samp_Fields = {
  __typename?: 'pf_subjects_var_samp_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  subject_id?: Maybe<Scalars['Float']['output']>;
  subject_parent_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Pf_Subjects_Variance_Fields = {
  __typename?: 'pf_subjects_variance_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  subject_id?: Maybe<Scalars['Float']['output']>;
  subject_parent_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "pf_tiers" */
export type Pf_Tiers = {
  __typename?: 'pf_tiers';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  tier?: Maybe<Scalars['String']['output']>;
  tier_id: Scalars['Int']['output'];
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "pf_tiers" */
export type Pf_Tiers_Aggregate = {
  __typename?: 'pf_tiers_aggregate';
  aggregate?: Maybe<Pf_Tiers_Aggregate_Fields>;
  nodes: Array<Pf_Tiers>;
};

/** aggregate fields of "pf_tiers" */
export type Pf_Tiers_Aggregate_Fields = {
  __typename?: 'pf_tiers_aggregate_fields';
  avg?: Maybe<Pf_Tiers_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Pf_Tiers_Max_Fields>;
  min?: Maybe<Pf_Tiers_Min_Fields>;
  stddev?: Maybe<Pf_Tiers_Stddev_Fields>;
  stddev_pop?: Maybe<Pf_Tiers_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Pf_Tiers_Stddev_Samp_Fields>;
  sum?: Maybe<Pf_Tiers_Sum_Fields>;
  var_pop?: Maybe<Pf_Tiers_Var_Pop_Fields>;
  var_samp?: Maybe<Pf_Tiers_Var_Samp_Fields>;
  variance?: Maybe<Pf_Tiers_Variance_Fields>;
};


/** aggregate fields of "pf_tiers" */
export type Pf_Tiers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Pf_Tiers_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Pf_Tiers_Avg_Fields = {
  __typename?: 'pf_tiers_avg_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  tier_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "pf_tiers". All fields are combined with a logical 'AND'. */
export type Pf_Tiers_Bool_Exp = {
  _and?: InputMaybe<Array<Pf_Tiers_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Pf_Tiers_Bool_Exp>;
  _or?: InputMaybe<Array<Pf_Tiers_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  display_order?: InputMaybe<Int_Comparison_Exp>;
  slug?: InputMaybe<String_Comparison_Exp>;
  tier?: InputMaybe<String_Comparison_Exp>;
  tier_id?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "pf_tiers" */
export enum Pf_Tiers_Constraint {
  /** unique or primary key constraint on columns "tier_id", "_state" */
  PfTiersPkey = 'pf_tiers_pkey',
  /** unique or primary key constraint on columns "slug", "_cohort", "_state" */
  PfTiersSlugStateCohortKey = 'pf_tiers_slug__state__cohort_key'
}

/** input type for incrementing numeric columns in table "pf_tiers" */
export type Pf_Tiers_Inc_Input = {
  display_order?: InputMaybe<Scalars['Int']['input']>;
  tier_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "pf_tiers" */
export type Pf_Tiers_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  tier?: InputMaybe<Scalars['String']['input']>;
  tier_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Pf_Tiers_Max_Fields = {
  __typename?: 'pf_tiers_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  tier?: Maybe<Scalars['String']['output']>;
  tier_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Pf_Tiers_Min_Fields = {
  __typename?: 'pf_tiers_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  tier?: Maybe<Scalars['String']['output']>;
  tier_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "pf_tiers" */
export type Pf_Tiers_Mutation_Response = {
  __typename?: 'pf_tiers_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Pf_Tiers>;
};

/** on_conflict condition type for table "pf_tiers" */
export type Pf_Tiers_On_Conflict = {
  constraint: Pf_Tiers_Constraint;
  update_columns?: Array<Pf_Tiers_Update_Column>;
  where?: InputMaybe<Pf_Tiers_Bool_Exp>;
};

/** Ordering options when selecting data from "pf_tiers". */
export type Pf_Tiers_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  display_order?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  tier?: InputMaybe<Order_By>;
  tier_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: pf_tiers */
export type Pf_Tiers_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  tier_id: Scalars['Int']['input'];
};

/** select columns of table "pf_tiers" */
export enum Pf_Tiers_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  DisplayOrder = 'display_order',
  /** column name */
  Slug = 'slug',
  /** column name */
  Tier = 'tier',
  /** column name */
  TierId = 'tier_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "pf_tiers" */
export type Pf_Tiers_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  tier?: InputMaybe<Scalars['String']['input']>;
  tier_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Pf_Tiers_Stddev_Fields = {
  __typename?: 'pf_tiers_stddev_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  tier_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Pf_Tiers_Stddev_Pop_Fields = {
  __typename?: 'pf_tiers_stddev_pop_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  tier_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Pf_Tiers_Stddev_Samp_Fields = {
  __typename?: 'pf_tiers_stddev_samp_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  tier_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "pf_tiers" */
export type Pf_Tiers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Pf_Tiers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Pf_Tiers_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  tier?: InputMaybe<Scalars['String']['input']>;
  tier_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Pf_Tiers_Sum_Fields = {
  __typename?: 'pf_tiers_sum_fields';
  display_order?: Maybe<Scalars['Int']['output']>;
  tier_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "pf_tiers" */
export enum Pf_Tiers_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  DisplayOrder = 'display_order',
  /** column name */
  Slug = 'slug',
  /** column name */
  Tier = 'tier',
  /** column name */
  TierId = 'tier_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Pf_Tiers_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Pf_Tiers_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Pf_Tiers_Set_Input>;
  /** filter the rows which have to be updated */
  where: Pf_Tiers_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Pf_Tiers_Var_Pop_Fields = {
  __typename?: 'pf_tiers_var_pop_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  tier_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Pf_Tiers_Var_Samp_Fields = {
  __typename?: 'pf_tiers_var_samp_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  tier_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Pf_Tiers_Variance_Fields = {
  __typename?: 'pf_tiers_variance_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  tier_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "pf_years" */
export type Pf_Years = {
  __typename?: 'pf_years';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  year?: Maybe<Scalars['String']['output']>;
  year_id: Scalars['Int']['output'];
};

/** aggregated selection of "pf_years" */
export type Pf_Years_Aggregate = {
  __typename?: 'pf_years_aggregate';
  aggregate?: Maybe<Pf_Years_Aggregate_Fields>;
  nodes: Array<Pf_Years>;
};

/** aggregate fields of "pf_years" */
export type Pf_Years_Aggregate_Fields = {
  __typename?: 'pf_years_aggregate_fields';
  avg?: Maybe<Pf_Years_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Pf_Years_Max_Fields>;
  min?: Maybe<Pf_Years_Min_Fields>;
  stddev?: Maybe<Pf_Years_Stddev_Fields>;
  stddev_pop?: Maybe<Pf_Years_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Pf_Years_Stddev_Samp_Fields>;
  sum?: Maybe<Pf_Years_Sum_Fields>;
  var_pop?: Maybe<Pf_Years_Var_Pop_Fields>;
  var_samp?: Maybe<Pf_Years_Var_Samp_Fields>;
  variance?: Maybe<Pf_Years_Variance_Fields>;
};


/** aggregate fields of "pf_years" */
export type Pf_Years_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Pf_Years_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Pf_Years_Avg_Fields = {
  __typename?: 'pf_years_avg_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  year_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "pf_years". All fields are combined with a logical 'AND'. */
export type Pf_Years_Bool_Exp = {
  _and?: InputMaybe<Array<Pf_Years_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Pf_Years_Bool_Exp>;
  _or?: InputMaybe<Array<Pf_Years_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  display_order?: InputMaybe<Int_Comparison_Exp>;
  slug?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  year?: InputMaybe<String_Comparison_Exp>;
  year_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "pf_years" */
export enum Pf_Years_Constraint {
  /** unique or primary key constraint on columns "_state", "year_id" */
  PfYearsPkey = 'pf_years_pkey',
  /** unique or primary key constraint on columns "slug", "_cohort", "_state" */
  PfYearsSlugStateCohortKey = 'pf_years_slug__state__cohort_key'
}

/** input type for incrementing numeric columns in table "pf_years" */
export type Pf_Years_Inc_Input = {
  display_order?: InputMaybe<Scalars['Int']['input']>;
  year_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "pf_years" */
export type Pf_Years_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  year?: InputMaybe<Scalars['String']['input']>;
  year_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Pf_Years_Max_Fields = {
  __typename?: 'pf_years_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  year?: Maybe<Scalars['String']['output']>;
  year_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Pf_Years_Min_Fields = {
  __typename?: 'pf_years_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  year?: Maybe<Scalars['String']['output']>;
  year_id?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "pf_years" */
export type Pf_Years_Mutation_Response = {
  __typename?: 'pf_years_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Pf_Years>;
};

/** on_conflict condition type for table "pf_years" */
export type Pf_Years_On_Conflict = {
  constraint: Pf_Years_Constraint;
  update_columns?: Array<Pf_Years_Update_Column>;
  where?: InputMaybe<Pf_Years_Bool_Exp>;
};

/** Ordering options when selecting data from "pf_years". */
export type Pf_Years_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  display_order?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  year?: InputMaybe<Order_By>;
  year_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: pf_years */
export type Pf_Years_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  year_id: Scalars['Int']['input'];
};

/** select columns of table "pf_years" */
export enum Pf_Years_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  DisplayOrder = 'display_order',
  /** column name */
  Slug = 'slug',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Year = 'year',
  /** column name */
  YearId = 'year_id'
}

/** input type for updating data in table "pf_years" */
export type Pf_Years_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  year?: InputMaybe<Scalars['String']['input']>;
  year_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Pf_Years_Stddev_Fields = {
  __typename?: 'pf_years_stddev_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  year_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Pf_Years_Stddev_Pop_Fields = {
  __typename?: 'pf_years_stddev_pop_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  year_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Pf_Years_Stddev_Samp_Fields = {
  __typename?: 'pf_years_stddev_samp_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  year_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "pf_years" */
export type Pf_Years_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Pf_Years_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Pf_Years_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  year?: InputMaybe<Scalars['String']['input']>;
  year_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Pf_Years_Sum_Fields = {
  __typename?: 'pf_years_sum_fields';
  display_order?: Maybe<Scalars['Int']['output']>;
  year_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "pf_years" */
export enum Pf_Years_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  DisplayOrder = 'display_order',
  /** column name */
  Slug = 'slug',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Year = 'year',
  /** column name */
  YearId = 'year_id'
}

export type Pf_Years_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Pf_Years_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Pf_Years_Set_Input>;
  /** filter the rows which have to be updated */
  where: Pf_Years_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Pf_Years_Var_Pop_Fields = {
  __typename?: 'pf_years_var_pop_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  year_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Pf_Years_Var_Samp_Fields = {
  __typename?: 'pf_years_var_samp_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  year_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Pf_Years_Variance_Fields = {
  __typename?: 'pf_years_variance_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
  year_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "programme_threads" */
export type Programme_Threads = {
  __typename?: 'programme_threads';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  programme?: Maybe<Programmes>;
  programme_id: Scalars['Int']['output'];
  /** An array relationship */
  programmes_all_states: Array<Programmes>;
  /** An aggregate relationship */
  programmes_all_states_aggregate: Programmes_Aggregate;
  /** An object relationship */
  thread?: Maybe<Threads>;
  thread_id: Scalars['Int']['output'];
  thread_overrides: Scalars['jsonb']['output'];
  /** An array relationship */
  threads_all_states: Array<Threads>;
  /** An aggregate relationship */
  threads_all_states_aggregate: Threads_Aggregate;
  updated_at: Scalars['timestamptz']['output'];
};


/** columns and relationships of "programme_threads" */
export type Programme_ThreadsProgrammes_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Programmes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programmes_Order_By>>;
  where?: InputMaybe<Programmes_Bool_Exp>;
};


/** columns and relationships of "programme_threads" */
export type Programme_ThreadsProgrammes_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Programmes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programmes_Order_By>>;
  where?: InputMaybe<Programmes_Bool_Exp>;
};


/** columns and relationships of "programme_threads" */
export type Programme_ThreadsThread_OverridesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "programme_threads" */
export type Programme_ThreadsThreads_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Threads_Order_By>>;
  where?: InputMaybe<Threads_Bool_Exp>;
};


/** columns and relationships of "programme_threads" */
export type Programme_ThreadsThreads_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Threads_Order_By>>;
  where?: InputMaybe<Threads_Bool_Exp>;
};

/** aggregated selection of "programme_threads" */
export type Programme_Threads_Aggregate = {
  __typename?: 'programme_threads_aggregate';
  aggregate?: Maybe<Programme_Threads_Aggregate_Fields>;
  nodes: Array<Programme_Threads>;
};

export type Programme_Threads_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Programme_Threads_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Programme_Threads_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Programme_Threads_Aggregate_Bool_Exp_Count>;
};

export type Programme_Threads_Aggregate_Bool_Exp_Bool_And = {
  arguments: Programme_Threads_Select_Column_Programme_Threads_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Programme_Threads_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Programme_Threads_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Programme_Threads_Select_Column_Programme_Threads_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Programme_Threads_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Programme_Threads_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Programme_Threads_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Programme_Threads_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "programme_threads" */
export type Programme_Threads_Aggregate_Fields = {
  __typename?: 'programme_threads_aggregate_fields';
  avg?: Maybe<Programme_Threads_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Programme_Threads_Max_Fields>;
  min?: Maybe<Programme_Threads_Min_Fields>;
  stddev?: Maybe<Programme_Threads_Stddev_Fields>;
  stddev_pop?: Maybe<Programme_Threads_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Programme_Threads_Stddev_Samp_Fields>;
  sum?: Maybe<Programme_Threads_Sum_Fields>;
  var_pop?: Maybe<Programme_Threads_Var_Pop_Fields>;
  var_samp?: Maybe<Programme_Threads_Var_Samp_Fields>;
  variance?: Maybe<Programme_Threads_Variance_Fields>;
};


/** aggregate fields of "programme_threads" */
export type Programme_Threads_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Programme_Threads_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "programme_threads" */
export type Programme_Threads_Aggregate_Order_By = {
  avg?: InputMaybe<Programme_Threads_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Programme_Threads_Max_Order_By>;
  min?: InputMaybe<Programme_Threads_Min_Order_By>;
  stddev?: InputMaybe<Programme_Threads_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Programme_Threads_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Programme_Threads_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Programme_Threads_Sum_Order_By>;
  var_pop?: InputMaybe<Programme_Threads_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Programme_Threads_Var_Samp_Order_By>;
  variance?: InputMaybe<Programme_Threads_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Programme_Threads_Append_Input = {
  thread_overrides?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "programme_threads" */
export type Programme_Threads_Arr_Rel_Insert_Input = {
  data: Array<Programme_Threads_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Programme_Threads_On_Conflict>;
};

/** aggregate avg on columns */
export type Programme_Threads_Avg_Fields = {
  __typename?: 'programme_threads_avg_fields';
  order?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "programme_threads" */
export type Programme_Threads_Avg_Order_By = {
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "programme_threads". All fields are combined with a logical 'AND'. */
export type Programme_Threads_Bool_Exp = {
  _and?: InputMaybe<Array<Programme_Threads_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Programme_Threads_Bool_Exp>;
  _or?: InputMaybe<Array<Programme_Threads_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  order?: InputMaybe<Int_Comparison_Exp>;
  programme?: InputMaybe<Programmes_Bool_Exp>;
  programme_id?: InputMaybe<Int_Comparison_Exp>;
  programmes_all_states?: InputMaybe<Programmes_Bool_Exp>;
  programmes_all_states_aggregate?: InputMaybe<Programmes_Aggregate_Bool_Exp>;
  thread?: InputMaybe<Threads_Bool_Exp>;
  thread_id?: InputMaybe<Int_Comparison_Exp>;
  thread_overrides?: InputMaybe<Jsonb_Comparison_Exp>;
  threads_all_states?: InputMaybe<Threads_Bool_Exp>;
  threads_all_states_aggregate?: InputMaybe<Threads_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "programme_threads" */
export enum Programme_Threads_Constraint {
  /** unique or primary key constraint on columns "_state", "thread_id", "programme_id" */
  ProgrammeThreadsPkey = 'programme_threads_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Programme_Threads_Delete_At_Path_Input = {
  thread_overrides?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Programme_Threads_Delete_Elem_Input = {
  thread_overrides?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Programme_Threads_Delete_Key_Input = {
  thread_overrides?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "programme_threads" */
export type Programme_Threads_Inc_Input = {
  order?: InputMaybe<Scalars['Int']['input']>;
  programme_id?: InputMaybe<Scalars['Int']['input']>;
  thread_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "programme_threads" */
export type Programme_Threads_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  programme?: InputMaybe<Programmes_Obj_Rel_Insert_Input>;
  programme_id?: InputMaybe<Scalars['Int']['input']>;
  programmes_all_states?: InputMaybe<Programmes_Arr_Rel_Insert_Input>;
  thread?: InputMaybe<Threads_Obj_Rel_Insert_Input>;
  thread_id?: InputMaybe<Scalars['Int']['input']>;
  thread_overrides?: InputMaybe<Scalars['jsonb']['input']>;
  threads_all_states?: InputMaybe<Threads_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Programme_Threads_Max_Fields = {
  __typename?: 'programme_threads_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  programme_id?: Maybe<Scalars['Int']['output']>;
  thread_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "programme_threads" */
export type Programme_Threads_Max_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Programme_Threads_Min_Fields = {
  __typename?: 'programme_threads_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  programme_id?: Maybe<Scalars['Int']['output']>;
  thread_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "programme_threads" */
export type Programme_Threads_Min_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "programme_threads" */
export type Programme_Threads_Mutation_Response = {
  __typename?: 'programme_threads_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Programme_Threads>;
};

/** on_conflict condition type for table "programme_threads" */
export type Programme_Threads_On_Conflict = {
  constraint: Programme_Threads_Constraint;
  update_columns?: Array<Programme_Threads_Update_Column>;
  where?: InputMaybe<Programme_Threads_Bool_Exp>;
};

/** Ordering options when selecting data from "programme_threads". */
export type Programme_Threads_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  programme?: InputMaybe<Programmes_Order_By>;
  programme_id?: InputMaybe<Order_By>;
  programmes_all_states_aggregate?: InputMaybe<Programmes_Aggregate_Order_By>;
  thread?: InputMaybe<Threads_Order_By>;
  thread_id?: InputMaybe<Order_By>;
  thread_overrides?: InputMaybe<Order_By>;
  threads_all_states_aggregate?: InputMaybe<Threads_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: programme_threads */
export type Programme_Threads_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  programme_id: Scalars['Int']['input'];
  thread_id: Scalars['Int']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Programme_Threads_Prepend_Input = {
  thread_overrides?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "programme_threads" */
export enum Programme_Threads_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Order = 'order',
  /** column name */
  ProgrammeId = 'programme_id',
  /** column name */
  ThreadId = 'thread_id',
  /** column name */
  ThreadOverrides = 'thread_overrides',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "programme_threads_aggregate_bool_exp_bool_and_arguments_columns" columns of table "programme_threads" */
export enum Programme_Threads_Select_Column_Programme_Threads_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** select "programme_threads_aggregate_bool_exp_bool_or_arguments_columns" columns of table "programme_threads" */
export enum Programme_Threads_Select_Column_Programme_Threads_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** input type for updating data in table "programme_threads" */
export type Programme_Threads_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  programme_id?: InputMaybe<Scalars['Int']['input']>;
  thread_id?: InputMaybe<Scalars['Int']['input']>;
  thread_overrides?: InputMaybe<Scalars['jsonb']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Programme_Threads_Stddev_Fields = {
  __typename?: 'programme_threads_stddev_fields';
  order?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "programme_threads" */
export type Programme_Threads_Stddev_Order_By = {
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Programme_Threads_Stddev_Pop_Fields = {
  __typename?: 'programme_threads_stddev_pop_fields';
  order?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "programme_threads" */
export type Programme_Threads_Stddev_Pop_Order_By = {
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Programme_Threads_Stddev_Samp_Fields = {
  __typename?: 'programme_threads_stddev_samp_fields';
  order?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "programme_threads" */
export type Programme_Threads_Stddev_Samp_Order_By = {
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "programme_threads" */
export type Programme_Threads_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Programme_Threads_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Programme_Threads_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  programme_id?: InputMaybe<Scalars['Int']['input']>;
  thread_id?: InputMaybe<Scalars['Int']['input']>;
  thread_overrides?: InputMaybe<Scalars['jsonb']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Programme_Threads_Sum_Fields = {
  __typename?: 'programme_threads_sum_fields';
  order?: Maybe<Scalars['Int']['output']>;
  programme_id?: Maybe<Scalars['Int']['output']>;
  thread_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "programme_threads" */
export type Programme_Threads_Sum_Order_By = {
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
};

/** update columns of table "programme_threads" */
export enum Programme_Threads_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Order = 'order',
  /** column name */
  ProgrammeId = 'programme_id',
  /** column name */
  ThreadId = 'thread_id',
  /** column name */
  ThreadOverrides = 'thread_overrides',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Programme_Threads_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Programme_Threads_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Programme_Threads_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Programme_Threads_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Programme_Threads_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Programme_Threads_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Programme_Threads_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Programme_Threads_Set_Input>;
  /** filter the rows which have to be updated */
  where: Programme_Threads_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Programme_Threads_Var_Pop_Fields = {
  __typename?: 'programme_threads_var_pop_fields';
  order?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "programme_threads" */
export type Programme_Threads_Var_Pop_Order_By = {
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Programme_Threads_Var_Samp_Fields = {
  __typename?: 'programme_threads_var_samp_fields';
  order?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "programme_threads" */
export type Programme_Threads_Var_Samp_Order_By = {
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Programme_Threads_Variance_Fields = {
  __typename?: 'programme_threads_variance_fields';
  order?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "programme_threads" */
export type Programme_Threads_Variance_Order_By = {
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "programme_units" */
export type Programme_Units = {
  __typename?: 'programme_units';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  programme?: Maybe<Programmes>;
  programme_id: Scalars['Int']['output'];
  /** An array relationship */
  programmes_all_states: Array<Programmes>;
  /** An aggregate relationship */
  programmes_all_states_aggregate: Programmes_Aggregate;
  /** An object relationship */
  unit?: Maybe<Units>;
  unit_id: Scalars['Int']['output'];
  unit_overrides: Scalars['jsonb']['output'];
  /** An array relationship */
  units_all_states: Array<Units>;
  /** An aggregate relationship */
  units_all_states_aggregate: Units_Aggregate;
  updated_at: Scalars['timestamptz']['output'];
};


/** columns and relationships of "programme_units" */
export type Programme_UnitsProgrammes_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Programmes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programmes_Order_By>>;
  where?: InputMaybe<Programmes_Bool_Exp>;
};


/** columns and relationships of "programme_units" */
export type Programme_UnitsProgrammes_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Programmes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programmes_Order_By>>;
  where?: InputMaybe<Programmes_Bool_Exp>;
};


/** columns and relationships of "programme_units" */
export type Programme_UnitsUnit_OverridesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "programme_units" */
export type Programme_UnitsUnits_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Units_Order_By>>;
  where?: InputMaybe<Units_Bool_Exp>;
};


/** columns and relationships of "programme_units" */
export type Programme_UnitsUnits_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Units_Order_By>>;
  where?: InputMaybe<Units_Bool_Exp>;
};

/** aggregated selection of "programme_units" */
export type Programme_Units_Aggregate = {
  __typename?: 'programme_units_aggregate';
  aggregate?: Maybe<Programme_Units_Aggregate_Fields>;
  nodes: Array<Programme_Units>;
};

export type Programme_Units_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Programme_Units_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Programme_Units_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Programme_Units_Aggregate_Bool_Exp_Count>;
};

export type Programme_Units_Aggregate_Bool_Exp_Bool_And = {
  arguments: Programme_Units_Select_Column_Programme_Units_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Programme_Units_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Programme_Units_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Programme_Units_Select_Column_Programme_Units_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Programme_Units_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Programme_Units_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Programme_Units_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Programme_Units_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "programme_units" */
export type Programme_Units_Aggregate_Fields = {
  __typename?: 'programme_units_aggregate_fields';
  avg?: Maybe<Programme_Units_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Programme_Units_Max_Fields>;
  min?: Maybe<Programme_Units_Min_Fields>;
  stddev?: Maybe<Programme_Units_Stddev_Fields>;
  stddev_pop?: Maybe<Programme_Units_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Programme_Units_Stddev_Samp_Fields>;
  sum?: Maybe<Programme_Units_Sum_Fields>;
  var_pop?: Maybe<Programme_Units_Var_Pop_Fields>;
  var_samp?: Maybe<Programme_Units_Var_Samp_Fields>;
  variance?: Maybe<Programme_Units_Variance_Fields>;
};


/** aggregate fields of "programme_units" */
export type Programme_Units_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Programme_Units_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "programme_units" */
export type Programme_Units_Aggregate_Order_By = {
  avg?: InputMaybe<Programme_Units_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Programme_Units_Max_Order_By>;
  min?: InputMaybe<Programme_Units_Min_Order_By>;
  stddev?: InputMaybe<Programme_Units_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Programme_Units_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Programme_Units_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Programme_Units_Sum_Order_By>;
  var_pop?: InputMaybe<Programme_Units_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Programme_Units_Var_Samp_Order_By>;
  variance?: InputMaybe<Programme_Units_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Programme_Units_Append_Input = {
  unit_overrides?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "programme_units" */
export type Programme_Units_Arr_Rel_Insert_Input = {
  data: Array<Programme_Units_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Programme_Units_On_Conflict>;
};

/** aggregate avg on columns */
export type Programme_Units_Avg_Fields = {
  __typename?: 'programme_units_avg_fields';
  order?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "programme_units" */
export type Programme_Units_Avg_Order_By = {
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "programme_units". All fields are combined with a logical 'AND'. */
export type Programme_Units_Bool_Exp = {
  _and?: InputMaybe<Array<Programme_Units_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Programme_Units_Bool_Exp>;
  _or?: InputMaybe<Array<Programme_Units_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  order?: InputMaybe<Int_Comparison_Exp>;
  programme?: InputMaybe<Programmes_Bool_Exp>;
  programme_id?: InputMaybe<Int_Comparison_Exp>;
  programmes_all_states?: InputMaybe<Programmes_Bool_Exp>;
  programmes_all_states_aggregate?: InputMaybe<Programmes_Aggregate_Bool_Exp>;
  unit?: InputMaybe<Units_Bool_Exp>;
  unit_id?: InputMaybe<Int_Comparison_Exp>;
  unit_overrides?: InputMaybe<Jsonb_Comparison_Exp>;
  units_all_states?: InputMaybe<Units_Bool_Exp>;
  units_all_states_aggregate?: InputMaybe<Units_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "programme_units" */
export enum Programme_Units_Constraint {
  /** unique or primary key constraint on columns "unit_id", "_state", "programme_id" */
  ProgrammeUnitsPkey = 'programme_units_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Programme_Units_Delete_At_Path_Input = {
  unit_overrides?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Programme_Units_Delete_Elem_Input = {
  unit_overrides?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Programme_Units_Delete_Key_Input = {
  unit_overrides?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "programme_units" */
export type Programme_Units_Inc_Input = {
  order?: InputMaybe<Scalars['Int']['input']>;
  programme_id?: InputMaybe<Scalars['Int']['input']>;
  unit_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "programme_units" */
export type Programme_Units_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  programme?: InputMaybe<Programmes_Obj_Rel_Insert_Input>;
  programme_id?: InputMaybe<Scalars['Int']['input']>;
  programmes_all_states?: InputMaybe<Programmes_Arr_Rel_Insert_Input>;
  unit?: InputMaybe<Units_Obj_Rel_Insert_Input>;
  unit_id?: InputMaybe<Scalars['Int']['input']>;
  unit_overrides?: InputMaybe<Scalars['jsonb']['input']>;
  units_all_states?: InputMaybe<Units_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Programme_Units_Max_Fields = {
  __typename?: 'programme_units_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  programme_id?: Maybe<Scalars['Int']['output']>;
  unit_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "programme_units" */
export type Programme_Units_Max_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Programme_Units_Min_Fields = {
  __typename?: 'programme_units_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  programme_id?: Maybe<Scalars['Int']['output']>;
  unit_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "programme_units" */
export type Programme_Units_Min_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "programme_units" */
export type Programme_Units_Mutation_Response = {
  __typename?: 'programme_units_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Programme_Units>;
};

/** on_conflict condition type for table "programme_units" */
export type Programme_Units_On_Conflict = {
  constraint: Programme_Units_Constraint;
  update_columns?: Array<Programme_Units_Update_Column>;
  where?: InputMaybe<Programme_Units_Bool_Exp>;
};

/** Ordering options when selecting data from "programme_units". */
export type Programme_Units_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  programme?: InputMaybe<Programmes_Order_By>;
  programme_id?: InputMaybe<Order_By>;
  programmes_all_states_aggregate?: InputMaybe<Programmes_Aggregate_Order_By>;
  unit?: InputMaybe<Units_Order_By>;
  unit_id?: InputMaybe<Order_By>;
  unit_overrides?: InputMaybe<Order_By>;
  units_all_states_aggregate?: InputMaybe<Units_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: programme_units */
export type Programme_Units_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  programme_id: Scalars['Int']['input'];
  unit_id: Scalars['Int']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Programme_Units_Prepend_Input = {
  unit_overrides?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "programme_units" */
export enum Programme_Units_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Order = 'order',
  /** column name */
  ProgrammeId = 'programme_id',
  /** column name */
  UnitId = 'unit_id',
  /** column name */
  UnitOverrides = 'unit_overrides',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "programme_units_aggregate_bool_exp_bool_and_arguments_columns" columns of table "programme_units" */
export enum Programme_Units_Select_Column_Programme_Units_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** select "programme_units_aggregate_bool_exp_bool_or_arguments_columns" columns of table "programme_units" */
export enum Programme_Units_Select_Column_Programme_Units_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** input type for updating data in table "programme_units" */
export type Programme_Units_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  programme_id?: InputMaybe<Scalars['Int']['input']>;
  unit_id?: InputMaybe<Scalars['Int']['input']>;
  unit_overrides?: InputMaybe<Scalars['jsonb']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Programme_Units_Stddev_Fields = {
  __typename?: 'programme_units_stddev_fields';
  order?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "programme_units" */
export type Programme_Units_Stddev_Order_By = {
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Programme_Units_Stddev_Pop_Fields = {
  __typename?: 'programme_units_stddev_pop_fields';
  order?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "programme_units" */
export type Programme_Units_Stddev_Pop_Order_By = {
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Programme_Units_Stddev_Samp_Fields = {
  __typename?: 'programme_units_stddev_samp_fields';
  order?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "programme_units" */
export type Programme_Units_Stddev_Samp_Order_By = {
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "programme_units" */
export type Programme_Units_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Programme_Units_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Programme_Units_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  programme_id?: InputMaybe<Scalars['Int']['input']>;
  unit_id?: InputMaybe<Scalars['Int']['input']>;
  unit_overrides?: InputMaybe<Scalars['jsonb']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Programme_Units_Sum_Fields = {
  __typename?: 'programme_units_sum_fields';
  order?: Maybe<Scalars['Int']['output']>;
  programme_id?: Maybe<Scalars['Int']['output']>;
  unit_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "programme_units" */
export type Programme_Units_Sum_Order_By = {
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** update columns of table "programme_units" */
export enum Programme_Units_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Order = 'order',
  /** column name */
  ProgrammeId = 'programme_id',
  /** column name */
  UnitId = 'unit_id',
  /** column name */
  UnitOverrides = 'unit_overrides',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Programme_Units_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Programme_Units_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Programme_Units_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Programme_Units_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Programme_Units_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Programme_Units_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Programme_Units_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Programme_Units_Set_Input>;
  /** filter the rows which have to be updated */
  where: Programme_Units_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Programme_Units_Var_Pop_Fields = {
  __typename?: 'programme_units_var_pop_fields';
  order?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "programme_units" */
export type Programme_Units_Var_Pop_Order_By = {
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Programme_Units_Var_Samp_Fields = {
  __typename?: 'programme_units_var_samp_fields';
  order?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "programme_units" */
export type Programme_Units_Var_Samp_Order_By = {
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Programme_Units_Variance_Fields = {
  __typename?: 'programme_units_variance_fields';
  order?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "programme_units" */
export type Programme_Units_Variance_Order_By = {
  order?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "programmes" */
export type Programmes = {
  __typename?: 'programmes';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _metadata: Scalars['json']['output'];
  _state: Scalars['String']['output'];
  adapt_video_id?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  curriculum_intent?: Maybe<Scalars['String']['output']>;
  intro_video_id?: Maybe<Scalars['Int']['output']>;
  programme_fields: Scalars['jsonb']['output'];
  programme_id: Scalars['Int']['output'];
  /** An array relationship */
  programme_threads: Array<Programme_Threads>;
  /** An aggregate relationship */
  programme_threads_aggregate: Programme_Threads_Aggregate;
  /** An array relationship */
  programme_threads_all_states: Array<Programme_Threads>;
  /** An aggregate relationship */
  programme_threads_all_states_aggregate: Programme_Threads_Aggregate;
  programme_uid?: Maybe<Scalars['bpchar']['output']>;
  /** An array relationship */
  programme_units: Array<Programme_Units>;
  /** An aggregate relationship */
  programme_units_aggregate: Programme_Units_Aggregate;
  /** An array relationship */
  programme_units_all_states: Array<Programme_Units>;
  /** An aggregate relationship */
  programme_units_all_states_aggregate: Programme_Units_Aggregate;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "programmes" */
export type Programmes_MetadataArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "programmes" */
export type ProgrammesProgramme_FieldsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "programmes" */
export type ProgrammesProgramme_ThreadsArgs = {
  distinct_on?: InputMaybe<Array<Programme_Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Threads_Order_By>>;
  where?: InputMaybe<Programme_Threads_Bool_Exp>;
};


/** columns and relationships of "programmes" */
export type ProgrammesProgramme_Threads_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Programme_Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Threads_Order_By>>;
  where?: InputMaybe<Programme_Threads_Bool_Exp>;
};


/** columns and relationships of "programmes" */
export type ProgrammesProgramme_Threads_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Programme_Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Threads_Order_By>>;
  where?: InputMaybe<Programme_Threads_Bool_Exp>;
};


/** columns and relationships of "programmes" */
export type ProgrammesProgramme_Threads_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Programme_Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Threads_Order_By>>;
  where?: InputMaybe<Programme_Threads_Bool_Exp>;
};


/** columns and relationships of "programmes" */
export type ProgrammesProgramme_UnitsArgs = {
  distinct_on?: InputMaybe<Array<Programme_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Units_Order_By>>;
  where?: InputMaybe<Programme_Units_Bool_Exp>;
};


/** columns and relationships of "programmes" */
export type ProgrammesProgramme_Units_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Programme_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Units_Order_By>>;
  where?: InputMaybe<Programme_Units_Bool_Exp>;
};


/** columns and relationships of "programmes" */
export type ProgrammesProgramme_Units_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Programme_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Units_Order_By>>;
  where?: InputMaybe<Programme_Units_Bool_Exp>;
};


/** columns and relationships of "programmes" */
export type ProgrammesProgramme_Units_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Programme_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Units_Order_By>>;
  where?: InputMaybe<Programme_Units_Bool_Exp>;
};

/** aggregated selection of "programmes" */
export type Programmes_Aggregate = {
  __typename?: 'programmes_aggregate';
  aggregate?: Maybe<Programmes_Aggregate_Fields>;
  nodes: Array<Programmes>;
};

export type Programmes_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Programmes_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Programmes_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Programmes_Aggregate_Bool_Exp_Count>;
};

export type Programmes_Aggregate_Bool_Exp_Bool_And = {
  arguments: Programmes_Select_Column_Programmes_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Programmes_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Programmes_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Programmes_Select_Column_Programmes_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Programmes_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Programmes_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Programmes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Programmes_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "programmes" */
export type Programmes_Aggregate_Fields = {
  __typename?: 'programmes_aggregate_fields';
  avg?: Maybe<Programmes_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Programmes_Max_Fields>;
  min?: Maybe<Programmes_Min_Fields>;
  stddev?: Maybe<Programmes_Stddev_Fields>;
  stddev_pop?: Maybe<Programmes_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Programmes_Stddev_Samp_Fields>;
  sum?: Maybe<Programmes_Sum_Fields>;
  var_pop?: Maybe<Programmes_Var_Pop_Fields>;
  var_samp?: Maybe<Programmes_Var_Samp_Fields>;
  variance?: Maybe<Programmes_Variance_Fields>;
};


/** aggregate fields of "programmes" */
export type Programmes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Programmes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "programmes" */
export type Programmes_Aggregate_Order_By = {
  avg?: InputMaybe<Programmes_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Programmes_Max_Order_By>;
  min?: InputMaybe<Programmes_Min_Order_By>;
  stddev?: InputMaybe<Programmes_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Programmes_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Programmes_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Programmes_Sum_Order_By>;
  var_pop?: InputMaybe<Programmes_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Programmes_Var_Samp_Order_By>;
  variance?: InputMaybe<Programmes_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Programmes_Append_Input = {
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "programmes" */
export type Programmes_Arr_Rel_Insert_Input = {
  data: Array<Programmes_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Programmes_On_Conflict>;
};

/** aggregate avg on columns */
export type Programmes_Avg_Fields = {
  __typename?: 'programmes_avg_fields';
  adapt_video_id?: Maybe<Scalars['Float']['output']>;
  intro_video_id?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "programmes" */
export type Programmes_Avg_Order_By = {
  adapt_video_id?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "programmes". All fields are combined with a logical 'AND'. */
export type Programmes_Bool_Exp = {
  _and?: InputMaybe<Array<Programmes_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _metadata?: InputMaybe<Json_Comparison_Exp>;
  _not?: InputMaybe<Programmes_Bool_Exp>;
  _or?: InputMaybe<Array<Programmes_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  adapt_video_id?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  curriculum_intent?: InputMaybe<String_Comparison_Exp>;
  intro_video_id?: InputMaybe<Int_Comparison_Exp>;
  programme_fields?: InputMaybe<Jsonb_Comparison_Exp>;
  programme_id?: InputMaybe<Int_Comparison_Exp>;
  programme_threads?: InputMaybe<Programme_Threads_Bool_Exp>;
  programme_threads_aggregate?: InputMaybe<Programme_Threads_Aggregate_Bool_Exp>;
  programme_threads_all_states?: InputMaybe<Programme_Threads_Bool_Exp>;
  programme_threads_all_states_aggregate?: InputMaybe<Programme_Threads_Aggregate_Bool_Exp>;
  programme_uid?: InputMaybe<Bpchar_Comparison_Exp>;
  programme_units?: InputMaybe<Programme_Units_Bool_Exp>;
  programme_units_aggregate?: InputMaybe<Programme_Units_Aggregate_Bool_Exp>;
  programme_units_all_states?: InputMaybe<Programme_Units_Bool_Exp>;
  programme_units_all_states_aggregate?: InputMaybe<Programme_Units_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "programmes" */
export enum Programmes_Constraint {
  /** unique or primary key constraint on columns "_state", "programme_id" */
  ProgrammesPkey = 'programmes_pkey',
  /** unique or primary key constraint on columns "programme_fields", "_state" */
  ProgrammesProgrammeFieldsStateKey = 'programmes_programme_fields__state_key'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Programmes_Delete_At_Path_Input = {
  programme_fields?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Programmes_Delete_Elem_Input = {
  programme_fields?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Programmes_Delete_Key_Input = {
  programme_fields?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "programmes" */
export type Programmes_Inc_Input = {
  adapt_video_id?: InputMaybe<Scalars['Int']['input']>;
  intro_video_id?: InputMaybe<Scalars['Int']['input']>;
  programme_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "programmes" */
export type Programmes_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _metadata?: InputMaybe<Scalars['json']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  adapt_video_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  curriculum_intent?: InputMaybe<Scalars['String']['input']>;
  intro_video_id?: InputMaybe<Scalars['Int']['input']>;
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  programme_id?: InputMaybe<Scalars['Int']['input']>;
  programme_threads?: InputMaybe<Programme_Threads_Arr_Rel_Insert_Input>;
  programme_threads_all_states?: InputMaybe<Programme_Threads_Arr_Rel_Insert_Input>;
  programme_uid?: InputMaybe<Scalars['bpchar']['input']>;
  programme_units?: InputMaybe<Programme_Units_Arr_Rel_Insert_Input>;
  programme_units_all_states?: InputMaybe<Programme_Units_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Programmes_Max_Fields = {
  __typename?: 'programmes_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  adapt_video_id?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  curriculum_intent?: Maybe<Scalars['String']['output']>;
  intro_video_id?: Maybe<Scalars['Int']['output']>;
  programme_id?: Maybe<Scalars['Int']['output']>;
  programme_uid?: Maybe<Scalars['bpchar']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "programmes" */
export type Programmes_Max_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  adapt_video_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  curriculum_intent?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  programme_uid?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Programmes_Min_Fields = {
  __typename?: 'programmes_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  adapt_video_id?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  curriculum_intent?: Maybe<Scalars['String']['output']>;
  intro_video_id?: Maybe<Scalars['Int']['output']>;
  programme_id?: Maybe<Scalars['Int']['output']>;
  programme_uid?: Maybe<Scalars['bpchar']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "programmes" */
export type Programmes_Min_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  adapt_video_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  curriculum_intent?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  programme_uid?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "programmes" */
export type Programmes_Mutation_Response = {
  __typename?: 'programmes_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Programmes>;
};

/** input type for inserting object relation for remote table "programmes" */
export type Programmes_Obj_Rel_Insert_Input = {
  data: Programmes_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Programmes_On_Conflict>;
};

/** on_conflict condition type for table "programmes" */
export type Programmes_On_Conflict = {
  constraint: Programmes_Constraint;
  update_columns?: Array<Programmes_Update_Column>;
  where?: InputMaybe<Programmes_Bool_Exp>;
};

/** Ordering options when selecting data from "programmes". */
export type Programmes_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _metadata?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  adapt_video_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  curriculum_intent?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  programme_fields?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
  programme_threads_aggregate?: InputMaybe<Programme_Threads_Aggregate_Order_By>;
  programme_threads_all_states_aggregate?: InputMaybe<Programme_Threads_Aggregate_Order_By>;
  programme_uid?: InputMaybe<Order_By>;
  programme_units_aggregate?: InputMaybe<Programme_Units_Aggregate_Order_By>;
  programme_units_all_states_aggregate?: InputMaybe<Programme_Units_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: programmes */
export type Programmes_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  programme_id: Scalars['Int']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Programmes_Prepend_Input = {
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "programmes" */
export enum Programmes_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  Metadata = '_metadata',
  /** column name */
  State = '_state',
  /** column name */
  AdaptVideoId = 'adapt_video_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CurriculumIntent = 'curriculum_intent',
  /** column name */
  IntroVideoId = 'intro_video_id',
  /** column name */
  ProgrammeFields = 'programme_fields',
  /** column name */
  ProgrammeId = 'programme_id',
  /** column name */
  ProgrammeUid = 'programme_uid',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "programmes_aggregate_bool_exp_bool_and_arguments_columns" columns of table "programmes" */
export enum Programmes_Select_Column_Programmes_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** select "programmes_aggregate_bool_exp_bool_or_arguments_columns" columns of table "programmes" */
export enum Programmes_Select_Column_Programmes_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** input type for updating data in table "programmes" */
export type Programmes_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _metadata?: InputMaybe<Scalars['json']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  adapt_video_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  curriculum_intent?: InputMaybe<Scalars['String']['input']>;
  intro_video_id?: InputMaybe<Scalars['Int']['input']>;
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  programme_id?: InputMaybe<Scalars['Int']['input']>;
  programme_uid?: InputMaybe<Scalars['bpchar']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Programmes_Stddev_Fields = {
  __typename?: 'programmes_stddev_fields';
  adapt_video_id?: Maybe<Scalars['Float']['output']>;
  intro_video_id?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "programmes" */
export type Programmes_Stddev_Order_By = {
  adapt_video_id?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Programmes_Stddev_Pop_Fields = {
  __typename?: 'programmes_stddev_pop_fields';
  adapt_video_id?: Maybe<Scalars['Float']['output']>;
  intro_video_id?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "programmes" */
export type Programmes_Stddev_Pop_Order_By = {
  adapt_video_id?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Programmes_Stddev_Samp_Fields = {
  __typename?: 'programmes_stddev_samp_fields';
  adapt_video_id?: Maybe<Scalars['Float']['output']>;
  intro_video_id?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "programmes" */
export type Programmes_Stddev_Samp_Order_By = {
  adapt_video_id?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "programmes" */
export type Programmes_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Programmes_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Programmes_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _metadata?: InputMaybe<Scalars['json']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  adapt_video_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  curriculum_intent?: InputMaybe<Scalars['String']['input']>;
  intro_video_id?: InputMaybe<Scalars['Int']['input']>;
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  programme_id?: InputMaybe<Scalars['Int']['input']>;
  programme_uid?: InputMaybe<Scalars['bpchar']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Programmes_Sum_Fields = {
  __typename?: 'programmes_sum_fields';
  adapt_video_id?: Maybe<Scalars['Int']['output']>;
  intro_video_id?: Maybe<Scalars['Int']['output']>;
  programme_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "programmes" */
export type Programmes_Sum_Order_By = {
  adapt_video_id?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
};

/** update columns of table "programmes" */
export enum Programmes_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  Metadata = '_metadata',
  /** column name */
  State = '_state',
  /** column name */
  AdaptVideoId = 'adapt_video_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CurriculumIntent = 'curriculum_intent',
  /** column name */
  IntroVideoId = 'intro_video_id',
  /** column name */
  ProgrammeFields = 'programme_fields',
  /** column name */
  ProgrammeId = 'programme_id',
  /** column name */
  ProgrammeUid = 'programme_uid',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Programmes_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Programmes_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Programmes_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Programmes_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Programmes_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Programmes_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Programmes_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Programmes_Set_Input>;
  /** filter the rows which have to be updated */
  where: Programmes_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Programmes_Var_Pop_Fields = {
  __typename?: 'programmes_var_pop_fields';
  adapt_video_id?: Maybe<Scalars['Float']['output']>;
  intro_video_id?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "programmes" */
export type Programmes_Var_Pop_Order_By = {
  adapt_video_id?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Programmes_Var_Samp_Fields = {
  __typename?: 'programmes_var_samp_fields';
  adapt_video_id?: Maybe<Scalars['Float']['output']>;
  intro_video_id?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "programmes" */
export type Programmes_Var_Samp_Order_By = {
  adapt_video_id?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Programmes_Variance_Fields = {
  __typename?: 'programmes_variance_fields';
  adapt_video_id?: Maybe<Scalars['Float']['output']>;
  intro_video_id?: Maybe<Scalars['Float']['output']>;
  programme_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "programmes" */
export type Programmes_Variance_Order_By = {
  adapt_video_id?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  programme_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "published.mv_downloads" */
export type Published_Mv_Downloads = {
  __typename?: 'published_mv_downloads';
  downloads?: Maybe<Scalars['jsonb']['output']>;
  has_downloadable_resources?: Maybe<Scalars['Boolean']['output']>;
  key_stage_slug?: Maybe<Scalars['String']['output']>;
  key_stage_title?: Maybe<Scalars['String']['output']>;
  lesson_slug?: Maybe<Scalars['String']['output']>;
  lesson_title?: Maybe<Scalars['String']['output']>;
  programme_slug?: Maybe<Scalars['String']['output']>;
  subject_slug?: Maybe<Scalars['String']['output']>;
  subject_title?: Maybe<Scalars['String']['output']>;
  tier_slug?: Maybe<Scalars['String']['output']>;
  tier_title?: Maybe<Scalars['String']['output']>;
  unit_slug?: Maybe<Scalars['String']['output']>;
  unit_title?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "published.mv_downloads" */
export type Published_Mv_DownloadsDownloadsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "published.mv_downloads" */
export type Published_Mv_Downloads_Aggregate = {
  __typename?: 'published_mv_downloads_aggregate';
  aggregate?: Maybe<Published_Mv_Downloads_Aggregate_Fields>;
  nodes: Array<Published_Mv_Downloads>;
};

/** aggregate fields of "published.mv_downloads" */
export type Published_Mv_Downloads_Aggregate_Fields = {
  __typename?: 'published_mv_downloads_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Published_Mv_Downloads_Max_Fields>;
  min?: Maybe<Published_Mv_Downloads_Min_Fields>;
};


/** aggregate fields of "published.mv_downloads" */
export type Published_Mv_Downloads_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Published_Mv_Downloads_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "published.mv_downloads". All fields are combined with a logical 'AND'. */
export type Published_Mv_Downloads_Bool_Exp = {
  _and?: InputMaybe<Array<Published_Mv_Downloads_Bool_Exp>>;
  _not?: InputMaybe<Published_Mv_Downloads_Bool_Exp>;
  _or?: InputMaybe<Array<Published_Mv_Downloads_Bool_Exp>>;
  downloads?: InputMaybe<Jsonb_Comparison_Exp>;
  has_downloadable_resources?: InputMaybe<Boolean_Comparison_Exp>;
  key_stage_slug?: InputMaybe<String_Comparison_Exp>;
  key_stage_title?: InputMaybe<String_Comparison_Exp>;
  lesson_slug?: InputMaybe<String_Comparison_Exp>;
  lesson_title?: InputMaybe<String_Comparison_Exp>;
  programme_slug?: InputMaybe<String_Comparison_Exp>;
  subject_slug?: InputMaybe<String_Comparison_Exp>;
  subject_title?: InputMaybe<String_Comparison_Exp>;
  tier_slug?: InputMaybe<String_Comparison_Exp>;
  tier_title?: InputMaybe<String_Comparison_Exp>;
  unit_slug?: InputMaybe<String_Comparison_Exp>;
  unit_title?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Published_Mv_Downloads_Max_Fields = {
  __typename?: 'published_mv_downloads_max_fields';
  key_stage_slug?: Maybe<Scalars['String']['output']>;
  key_stage_title?: Maybe<Scalars['String']['output']>;
  lesson_slug?: Maybe<Scalars['String']['output']>;
  lesson_title?: Maybe<Scalars['String']['output']>;
  programme_slug?: Maybe<Scalars['String']['output']>;
  subject_slug?: Maybe<Scalars['String']['output']>;
  subject_title?: Maybe<Scalars['String']['output']>;
  tier_slug?: Maybe<Scalars['String']['output']>;
  tier_title?: Maybe<Scalars['String']['output']>;
  unit_slug?: Maybe<Scalars['String']['output']>;
  unit_title?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Published_Mv_Downloads_Min_Fields = {
  __typename?: 'published_mv_downloads_min_fields';
  key_stage_slug?: Maybe<Scalars['String']['output']>;
  key_stage_title?: Maybe<Scalars['String']['output']>;
  lesson_slug?: Maybe<Scalars['String']['output']>;
  lesson_title?: Maybe<Scalars['String']['output']>;
  programme_slug?: Maybe<Scalars['String']['output']>;
  subject_slug?: Maybe<Scalars['String']['output']>;
  subject_title?: Maybe<Scalars['String']['output']>;
  tier_slug?: Maybe<Scalars['String']['output']>;
  tier_title?: Maybe<Scalars['String']['output']>;
  unit_slug?: Maybe<Scalars['String']['output']>;
  unit_title?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "published.mv_downloads". */
export type Published_Mv_Downloads_Order_By = {
  downloads?: InputMaybe<Order_By>;
  has_downloadable_resources?: InputMaybe<Order_By>;
  key_stage_slug?: InputMaybe<Order_By>;
  key_stage_title?: InputMaybe<Order_By>;
  lesson_slug?: InputMaybe<Order_By>;
  lesson_title?: InputMaybe<Order_By>;
  programme_slug?: InputMaybe<Order_By>;
  subject_slug?: InputMaybe<Order_By>;
  subject_title?: InputMaybe<Order_By>;
  tier_slug?: InputMaybe<Order_By>;
  tier_title?: InputMaybe<Order_By>;
  unit_slug?: InputMaybe<Order_By>;
  unit_title?: InputMaybe<Order_By>;
};

/** select columns of table "published.mv_downloads" */
export enum Published_Mv_Downloads_Select_Column {
  /** column name */
  Downloads = 'downloads',
  /** column name */
  HasDownloadableResources = 'has_downloadable_resources',
  /** column name */
  KeyStageSlug = 'key_stage_slug',
  /** column name */
  KeyStageTitle = 'key_stage_title',
  /** column name */
  LessonSlug = 'lesson_slug',
  /** column name */
  LessonTitle = 'lesson_title',
  /** column name */
  ProgrammeSlug = 'programme_slug',
  /** column name */
  SubjectSlug = 'subject_slug',
  /** column name */
  SubjectTitle = 'subject_title',
  /** column name */
  TierSlug = 'tier_slug',
  /** column name */
  TierTitle = 'tier_title',
  /** column name */
  UnitSlug = 'unit_slug',
  /** column name */
  UnitTitle = 'unit_title'
}

/** Streaming cursor of the table "published_mv_downloads" */
export type Published_Mv_Downloads_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Published_Mv_Downloads_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Published_Mv_Downloads_Stream_Cursor_Value_Input = {
  downloads?: InputMaybe<Scalars['jsonb']['input']>;
  has_downloadable_resources?: InputMaybe<Scalars['Boolean']['input']>;
  key_stage_slug?: InputMaybe<Scalars['String']['input']>;
  key_stage_title?: InputMaybe<Scalars['String']['input']>;
  lesson_slug?: InputMaybe<Scalars['String']['input']>;
  lesson_title?: InputMaybe<Scalars['String']['input']>;
  programme_slug?: InputMaybe<Scalars['String']['input']>;
  subject_slug?: InputMaybe<Scalars['String']['input']>;
  subject_title?: InputMaybe<Scalars['String']['input']>;
  tier_slug?: InputMaybe<Scalars['String']['input']>;
  tier_title?: InputMaybe<Scalars['String']['input']>;
  unit_slug?: InputMaybe<Scalars['String']['input']>;
  unit_title?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "published.mv_homepage" */
export type Published_Mv_Homepage = {
  __typename?: 'published_mv_homepage';
  display_order?: Maybe<Scalars['Int']['output']>;
  short_code?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

/** columns and relationships of "published.mv_homepage_1" */
export type Published_Mv_Homepage_1 = {
  __typename?: 'published_mv_homepage_1';
  key_stages?: Maybe<Scalars['json']['output']>;
  year_groups?: Maybe<Scalars['json']['output']>;
};


/** columns and relationships of "published.mv_homepage_1" */
export type Published_Mv_Homepage_1Key_StagesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "published.mv_homepage_1" */
export type Published_Mv_Homepage_1Year_GroupsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "published.mv_homepage_1" */
export type Published_Mv_Homepage_1_Aggregate = {
  __typename?: 'published_mv_homepage_1_aggregate';
  aggregate?: Maybe<Published_Mv_Homepage_1_Aggregate_Fields>;
  nodes: Array<Published_Mv_Homepage_1>;
};

/** aggregate fields of "published.mv_homepage_1" */
export type Published_Mv_Homepage_1_Aggregate_Fields = {
  __typename?: 'published_mv_homepage_1_aggregate_fields';
  count: Scalars['Int']['output'];
};


/** aggregate fields of "published.mv_homepage_1" */
export type Published_Mv_Homepage_1_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Published_Mv_Homepage_1_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "published.mv_homepage_1". All fields are combined with a logical 'AND'. */
export type Published_Mv_Homepage_1_Bool_Exp = {
  _and?: InputMaybe<Array<Published_Mv_Homepage_1_Bool_Exp>>;
  _not?: InputMaybe<Published_Mv_Homepage_1_Bool_Exp>;
  _or?: InputMaybe<Array<Published_Mv_Homepage_1_Bool_Exp>>;
  key_stages?: InputMaybe<Json_Comparison_Exp>;
  year_groups?: InputMaybe<Json_Comparison_Exp>;
};

/** Ordering options when selecting data from "published.mv_homepage_1". */
export type Published_Mv_Homepage_1_Order_By = {
  key_stages?: InputMaybe<Order_By>;
  year_groups?: InputMaybe<Order_By>;
};

/** select columns of table "published.mv_homepage_1" */
export enum Published_Mv_Homepage_1_Select_Column {
  /** column name */
  KeyStages = 'key_stages',
  /** column name */
  YearGroups = 'year_groups'
}

/** Streaming cursor of the table "published_mv_homepage_1" */
export type Published_Mv_Homepage_1_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Published_Mv_Homepage_1_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Published_Mv_Homepage_1_Stream_Cursor_Value_Input = {
  key_stages?: InputMaybe<Scalars['json']['input']>;
  year_groups?: InputMaybe<Scalars['json']['input']>;
};

/** columns and relationships of "published.mv_homepage_2" */
export type Published_Mv_Homepage_2 = {
  __typename?: 'published_mv_homepage_2';
  key_stages?: Maybe<Scalars['jsonb']['output']>;
  year_groups?: Maybe<Scalars['jsonb']['output']>;
};


/** columns and relationships of "published.mv_homepage_2" */
export type Published_Mv_Homepage_2Key_StagesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "published.mv_homepage_2" */
export type Published_Mv_Homepage_2Year_GroupsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "published.mv_homepage_2" */
export type Published_Mv_Homepage_2_Aggregate = {
  __typename?: 'published_mv_homepage_2_aggregate';
  aggregate?: Maybe<Published_Mv_Homepage_2_Aggregate_Fields>;
  nodes: Array<Published_Mv_Homepage_2>;
};

/** aggregate fields of "published.mv_homepage_2" */
export type Published_Mv_Homepage_2_Aggregate_Fields = {
  __typename?: 'published_mv_homepage_2_aggregate_fields';
  count: Scalars['Int']['output'];
};


/** aggregate fields of "published.mv_homepage_2" */
export type Published_Mv_Homepage_2_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Published_Mv_Homepage_2_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "published.mv_homepage_2". All fields are combined with a logical 'AND'. */
export type Published_Mv_Homepage_2_Bool_Exp = {
  _and?: InputMaybe<Array<Published_Mv_Homepage_2_Bool_Exp>>;
  _not?: InputMaybe<Published_Mv_Homepage_2_Bool_Exp>;
  _or?: InputMaybe<Array<Published_Mv_Homepage_2_Bool_Exp>>;
  key_stages?: InputMaybe<Jsonb_Comparison_Exp>;
  year_groups?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** Ordering options when selecting data from "published.mv_homepage_2". */
export type Published_Mv_Homepage_2_Order_By = {
  key_stages?: InputMaybe<Order_By>;
  year_groups?: InputMaybe<Order_By>;
};

/** select columns of table "published.mv_homepage_2" */
export enum Published_Mv_Homepage_2_Select_Column {
  /** column name */
  KeyStages = 'key_stages',
  /** column name */
  YearGroups = 'year_groups'
}

/** Streaming cursor of the table "published_mv_homepage_2" */
export type Published_Mv_Homepage_2_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Published_Mv_Homepage_2_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Published_Mv_Homepage_2_Stream_Cursor_Value_Input = {
  key_stages?: InputMaybe<Scalars['jsonb']['input']>;
  year_groups?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregated selection of "published.mv_homepage" */
export type Published_Mv_Homepage_Aggregate = {
  __typename?: 'published_mv_homepage_aggregate';
  aggregate?: Maybe<Published_Mv_Homepage_Aggregate_Fields>;
  nodes: Array<Published_Mv_Homepage>;
};

/** aggregate fields of "published.mv_homepage" */
export type Published_Mv_Homepage_Aggregate_Fields = {
  __typename?: 'published_mv_homepage_aggregate_fields';
  avg?: Maybe<Published_Mv_Homepage_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Published_Mv_Homepage_Max_Fields>;
  min?: Maybe<Published_Mv_Homepage_Min_Fields>;
  stddev?: Maybe<Published_Mv_Homepage_Stddev_Fields>;
  stddev_pop?: Maybe<Published_Mv_Homepage_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Published_Mv_Homepage_Stddev_Samp_Fields>;
  sum?: Maybe<Published_Mv_Homepage_Sum_Fields>;
  var_pop?: Maybe<Published_Mv_Homepage_Var_Pop_Fields>;
  var_samp?: Maybe<Published_Mv_Homepage_Var_Samp_Fields>;
  variance?: Maybe<Published_Mv_Homepage_Variance_Fields>;
};


/** aggregate fields of "published.mv_homepage" */
export type Published_Mv_Homepage_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Published_Mv_Homepage_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Published_Mv_Homepage_Avg_Fields = {
  __typename?: 'published_mv_homepage_avg_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "published.mv_homepage". All fields are combined with a logical 'AND'. */
export type Published_Mv_Homepage_Bool_Exp = {
  _and?: InputMaybe<Array<Published_Mv_Homepage_Bool_Exp>>;
  _not?: InputMaybe<Published_Mv_Homepage_Bool_Exp>;
  _or?: InputMaybe<Array<Published_Mv_Homepage_Bool_Exp>>;
  display_order?: InputMaybe<Int_Comparison_Exp>;
  short_code?: InputMaybe<String_Comparison_Exp>;
  slug?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Published_Mv_Homepage_Max_Fields = {
  __typename?: 'published_mv_homepage_max_fields';
  display_order?: Maybe<Scalars['Int']['output']>;
  short_code?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Published_Mv_Homepage_Min_Fields = {
  __typename?: 'published_mv_homepage_min_fields';
  display_order?: Maybe<Scalars['Int']['output']>;
  short_code?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "published.mv_homepage". */
export type Published_Mv_Homepage_Order_By = {
  display_order?: InputMaybe<Order_By>;
  short_code?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
};

/** select columns of table "published.mv_homepage" */
export enum Published_Mv_Homepage_Select_Column {
  /** column name */
  DisplayOrder = 'display_order',
  /** column name */
  ShortCode = 'short_code',
  /** column name */
  Slug = 'slug',
  /** column name */
  Title = 'title'
}

/** aggregate stddev on columns */
export type Published_Mv_Homepage_Stddev_Fields = {
  __typename?: 'published_mv_homepage_stddev_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Published_Mv_Homepage_Stddev_Pop_Fields = {
  __typename?: 'published_mv_homepage_stddev_pop_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Published_Mv_Homepage_Stddev_Samp_Fields = {
  __typename?: 'published_mv_homepage_stddev_samp_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "published_mv_homepage" */
export type Published_Mv_Homepage_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Published_Mv_Homepage_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Published_Mv_Homepage_Stream_Cursor_Value_Input = {
  display_order?: InputMaybe<Scalars['Int']['input']>;
  short_code?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Published_Mv_Homepage_Sum_Fields = {
  __typename?: 'published_mv_homepage_sum_fields';
  display_order?: Maybe<Scalars['Int']['output']>;
};

/** aggregate var_pop on columns */
export type Published_Mv_Homepage_Var_Pop_Fields = {
  __typename?: 'published_mv_homepage_var_pop_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Published_Mv_Homepage_Var_Samp_Fields = {
  __typename?: 'published_mv_homepage_var_samp_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Published_Mv_Homepage_Variance_Fields = {
  __typename?: 'published_mv_homepage_variance_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "published.mv_key_stages" */
export type Published_Mv_Key_Stages = {
  __typename?: 'published_mv_key_stages';
  display_order?: Maybe<Scalars['Int']['output']>;
  short_code?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "published.mv_key_stages" */
export type Published_Mv_Key_Stages_Aggregate = {
  __typename?: 'published_mv_key_stages_aggregate';
  aggregate?: Maybe<Published_Mv_Key_Stages_Aggregate_Fields>;
  nodes: Array<Published_Mv_Key_Stages>;
};

/** aggregate fields of "published.mv_key_stages" */
export type Published_Mv_Key_Stages_Aggregate_Fields = {
  __typename?: 'published_mv_key_stages_aggregate_fields';
  avg?: Maybe<Published_Mv_Key_Stages_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Published_Mv_Key_Stages_Max_Fields>;
  min?: Maybe<Published_Mv_Key_Stages_Min_Fields>;
  stddev?: Maybe<Published_Mv_Key_Stages_Stddev_Fields>;
  stddev_pop?: Maybe<Published_Mv_Key_Stages_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Published_Mv_Key_Stages_Stddev_Samp_Fields>;
  sum?: Maybe<Published_Mv_Key_Stages_Sum_Fields>;
  var_pop?: Maybe<Published_Mv_Key_Stages_Var_Pop_Fields>;
  var_samp?: Maybe<Published_Mv_Key_Stages_Var_Samp_Fields>;
  variance?: Maybe<Published_Mv_Key_Stages_Variance_Fields>;
};


/** aggregate fields of "published.mv_key_stages" */
export type Published_Mv_Key_Stages_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Published_Mv_Key_Stages_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Published_Mv_Key_Stages_Avg_Fields = {
  __typename?: 'published_mv_key_stages_avg_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "published.mv_key_stages". All fields are combined with a logical 'AND'. */
export type Published_Mv_Key_Stages_Bool_Exp = {
  _and?: InputMaybe<Array<Published_Mv_Key_Stages_Bool_Exp>>;
  _not?: InputMaybe<Published_Mv_Key_Stages_Bool_Exp>;
  _or?: InputMaybe<Array<Published_Mv_Key_Stages_Bool_Exp>>;
  display_order?: InputMaybe<Int_Comparison_Exp>;
  short_code?: InputMaybe<String_Comparison_Exp>;
  slug?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Published_Mv_Key_Stages_Max_Fields = {
  __typename?: 'published_mv_key_stages_max_fields';
  display_order?: Maybe<Scalars['Int']['output']>;
  short_code?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Published_Mv_Key_Stages_Min_Fields = {
  __typename?: 'published_mv_key_stages_min_fields';
  display_order?: Maybe<Scalars['Int']['output']>;
  short_code?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "published.mv_key_stages". */
export type Published_Mv_Key_Stages_Order_By = {
  display_order?: InputMaybe<Order_By>;
  short_code?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
};

/** select columns of table "published.mv_key_stages" */
export enum Published_Mv_Key_Stages_Select_Column {
  /** column name */
  DisplayOrder = 'display_order',
  /** column name */
  ShortCode = 'short_code',
  /** column name */
  Slug = 'slug',
  /** column name */
  Title = 'title'
}

/** aggregate stddev on columns */
export type Published_Mv_Key_Stages_Stddev_Fields = {
  __typename?: 'published_mv_key_stages_stddev_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Published_Mv_Key_Stages_Stddev_Pop_Fields = {
  __typename?: 'published_mv_key_stages_stddev_pop_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Published_Mv_Key_Stages_Stddev_Samp_Fields = {
  __typename?: 'published_mv_key_stages_stddev_samp_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "published_mv_key_stages" */
export type Published_Mv_Key_Stages_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Published_Mv_Key_Stages_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Published_Mv_Key_Stages_Stream_Cursor_Value_Input = {
  display_order?: InputMaybe<Scalars['Int']['input']>;
  short_code?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Published_Mv_Key_Stages_Sum_Fields = {
  __typename?: 'published_mv_key_stages_sum_fields';
  display_order?: Maybe<Scalars['Int']['output']>;
};

/** aggregate var_pop on columns */
export type Published_Mv_Key_Stages_Var_Pop_Fields = {
  __typename?: 'published_mv_key_stages_var_pop_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Published_Mv_Key_Stages_Var_Samp_Fields = {
  __typename?: 'published_mv_key_stages_var_samp_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Published_Mv_Key_Stages_Variance_Fields = {
  __typename?: 'published_mv_key_stages_variance_fields';
  display_order?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "published.mv_lesson_listing_1" */
export type Published_Mv_Lesson_Listing_1 = {
  __typename?: 'published_mv_lesson_listing_1';
  keyStageSlug?: Maybe<Scalars['String']['output']>;
  keyStageTitle?: Maybe<Scalars['String']['output']>;
  lessons?: Maybe<Scalars['jsonb']['output']>;
  programmeSlug?: Maybe<Scalars['String']['output']>;
  subjectSlug?: Maybe<Scalars['String']['output']>;
  subjectTitle?: Maybe<Scalars['String']['output']>;
  tierSlug?: Maybe<Scalars['String']['output']>;
  unitSlug?: Maybe<Scalars['String']['output']>;
  unitTitle?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "published.mv_lesson_listing_1" */
export type Published_Mv_Lesson_Listing_1LessonsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "published.mv_lesson_listing_1" */
export type Published_Mv_Lesson_Listing_1_Aggregate = {
  __typename?: 'published_mv_lesson_listing_1_aggregate';
  aggregate?: Maybe<Published_Mv_Lesson_Listing_1_Aggregate_Fields>;
  nodes: Array<Published_Mv_Lesson_Listing_1>;
};

/** aggregate fields of "published.mv_lesson_listing_1" */
export type Published_Mv_Lesson_Listing_1_Aggregate_Fields = {
  __typename?: 'published_mv_lesson_listing_1_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Published_Mv_Lesson_Listing_1_Max_Fields>;
  min?: Maybe<Published_Mv_Lesson_Listing_1_Min_Fields>;
};


/** aggregate fields of "published.mv_lesson_listing_1" */
export type Published_Mv_Lesson_Listing_1_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Published_Mv_Lesson_Listing_1_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "published.mv_lesson_listing_1". All fields are combined with a logical 'AND'. */
export type Published_Mv_Lesson_Listing_1_Bool_Exp = {
  _and?: InputMaybe<Array<Published_Mv_Lesson_Listing_1_Bool_Exp>>;
  _not?: InputMaybe<Published_Mv_Lesson_Listing_1_Bool_Exp>;
  _or?: InputMaybe<Array<Published_Mv_Lesson_Listing_1_Bool_Exp>>;
  keyStageSlug?: InputMaybe<String_Comparison_Exp>;
  keyStageTitle?: InputMaybe<String_Comparison_Exp>;
  lessons?: InputMaybe<Jsonb_Comparison_Exp>;
  programmeSlug?: InputMaybe<String_Comparison_Exp>;
  subjectSlug?: InputMaybe<String_Comparison_Exp>;
  subjectTitle?: InputMaybe<String_Comparison_Exp>;
  tierSlug?: InputMaybe<String_Comparison_Exp>;
  unitSlug?: InputMaybe<String_Comparison_Exp>;
  unitTitle?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Published_Mv_Lesson_Listing_1_Max_Fields = {
  __typename?: 'published_mv_lesson_listing_1_max_fields';
  keyStageSlug?: Maybe<Scalars['String']['output']>;
  keyStageTitle?: Maybe<Scalars['String']['output']>;
  programmeSlug?: Maybe<Scalars['String']['output']>;
  subjectSlug?: Maybe<Scalars['String']['output']>;
  subjectTitle?: Maybe<Scalars['String']['output']>;
  tierSlug?: Maybe<Scalars['String']['output']>;
  unitSlug?: Maybe<Scalars['String']['output']>;
  unitTitle?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Published_Mv_Lesson_Listing_1_Min_Fields = {
  __typename?: 'published_mv_lesson_listing_1_min_fields';
  keyStageSlug?: Maybe<Scalars['String']['output']>;
  keyStageTitle?: Maybe<Scalars['String']['output']>;
  programmeSlug?: Maybe<Scalars['String']['output']>;
  subjectSlug?: Maybe<Scalars['String']['output']>;
  subjectTitle?: Maybe<Scalars['String']['output']>;
  tierSlug?: Maybe<Scalars['String']['output']>;
  unitSlug?: Maybe<Scalars['String']['output']>;
  unitTitle?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "published.mv_lesson_listing_1". */
export type Published_Mv_Lesson_Listing_1_Order_By = {
  keyStageSlug?: InputMaybe<Order_By>;
  keyStageTitle?: InputMaybe<Order_By>;
  lessons?: InputMaybe<Order_By>;
  programmeSlug?: InputMaybe<Order_By>;
  subjectSlug?: InputMaybe<Order_By>;
  subjectTitle?: InputMaybe<Order_By>;
  tierSlug?: InputMaybe<Order_By>;
  unitSlug?: InputMaybe<Order_By>;
  unitTitle?: InputMaybe<Order_By>;
};

/** select columns of table "published.mv_lesson_listing_1" */
export enum Published_Mv_Lesson_Listing_1_Select_Column {
  /** column name */
  KeyStageSlug = 'keyStageSlug',
  /** column name */
  KeyStageTitle = 'keyStageTitle',
  /** column name */
  Lessons = 'lessons',
  /** column name */
  ProgrammeSlug = 'programmeSlug',
  /** column name */
  SubjectSlug = 'subjectSlug',
  /** column name */
  SubjectTitle = 'subjectTitle',
  /** column name */
  TierSlug = 'tierSlug',
  /** column name */
  UnitSlug = 'unitSlug',
  /** column name */
  UnitTitle = 'unitTitle'
}

/** Streaming cursor of the table "published_mv_lesson_listing_1" */
export type Published_Mv_Lesson_Listing_1_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Published_Mv_Lesson_Listing_1_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Published_Mv_Lesson_Listing_1_Stream_Cursor_Value_Input = {
  keyStageSlug?: InputMaybe<Scalars['String']['input']>;
  keyStageTitle?: InputMaybe<Scalars['String']['input']>;
  lessons?: InputMaybe<Scalars['jsonb']['input']>;
  programmeSlug?: InputMaybe<Scalars['String']['input']>;
  subjectSlug?: InputMaybe<Scalars['String']['input']>;
  subjectTitle?: InputMaybe<Scalars['String']['input']>;
  tierSlug?: InputMaybe<Scalars['String']['input']>;
  unitSlug?: InputMaybe<Scalars['String']['input']>;
  unitTitle?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "published.mv_lesson_listing_2" */
export type Published_Mv_Lesson_Listing_2 = {
  __typename?: 'published_mv_lesson_listing_2';
  keyStageSlug?: Maybe<Scalars['String']['output']>;
  keyStageTitle?: Maybe<Scalars['String']['output']>;
  lessons?: Maybe<Scalars['jsonb']['output']>;
  programmeSlug?: Maybe<Scalars['String']['output']>;
  subjectSlug?: Maybe<Scalars['String']['output']>;
  subjectTitle?: Maybe<Scalars['String']['output']>;
  tierSlug?: Maybe<Scalars['String']['output']>;
  unitSlug?: Maybe<Scalars['String']['output']>;
  unitTitle?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "published.mv_lesson_listing_2" */
export type Published_Mv_Lesson_Listing_2LessonsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "published.mv_lesson_listing_2" */
export type Published_Mv_Lesson_Listing_2_Aggregate = {
  __typename?: 'published_mv_lesson_listing_2_aggregate';
  aggregate?: Maybe<Published_Mv_Lesson_Listing_2_Aggregate_Fields>;
  nodes: Array<Published_Mv_Lesson_Listing_2>;
};

/** aggregate fields of "published.mv_lesson_listing_2" */
export type Published_Mv_Lesson_Listing_2_Aggregate_Fields = {
  __typename?: 'published_mv_lesson_listing_2_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Published_Mv_Lesson_Listing_2_Max_Fields>;
  min?: Maybe<Published_Mv_Lesson_Listing_2_Min_Fields>;
};


/** aggregate fields of "published.mv_lesson_listing_2" */
export type Published_Mv_Lesson_Listing_2_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Published_Mv_Lesson_Listing_2_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "published.mv_lesson_listing_2". All fields are combined with a logical 'AND'. */
export type Published_Mv_Lesson_Listing_2_Bool_Exp = {
  _and?: InputMaybe<Array<Published_Mv_Lesson_Listing_2_Bool_Exp>>;
  _not?: InputMaybe<Published_Mv_Lesson_Listing_2_Bool_Exp>;
  _or?: InputMaybe<Array<Published_Mv_Lesson_Listing_2_Bool_Exp>>;
  keyStageSlug?: InputMaybe<String_Comparison_Exp>;
  keyStageTitle?: InputMaybe<String_Comparison_Exp>;
  lessons?: InputMaybe<Jsonb_Comparison_Exp>;
  programmeSlug?: InputMaybe<String_Comparison_Exp>;
  subjectSlug?: InputMaybe<String_Comparison_Exp>;
  subjectTitle?: InputMaybe<String_Comparison_Exp>;
  tierSlug?: InputMaybe<String_Comparison_Exp>;
  unitSlug?: InputMaybe<String_Comparison_Exp>;
  unitTitle?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Published_Mv_Lesson_Listing_2_Max_Fields = {
  __typename?: 'published_mv_lesson_listing_2_max_fields';
  keyStageSlug?: Maybe<Scalars['String']['output']>;
  keyStageTitle?: Maybe<Scalars['String']['output']>;
  programmeSlug?: Maybe<Scalars['String']['output']>;
  subjectSlug?: Maybe<Scalars['String']['output']>;
  subjectTitle?: Maybe<Scalars['String']['output']>;
  tierSlug?: Maybe<Scalars['String']['output']>;
  unitSlug?: Maybe<Scalars['String']['output']>;
  unitTitle?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Published_Mv_Lesson_Listing_2_Min_Fields = {
  __typename?: 'published_mv_lesson_listing_2_min_fields';
  keyStageSlug?: Maybe<Scalars['String']['output']>;
  keyStageTitle?: Maybe<Scalars['String']['output']>;
  programmeSlug?: Maybe<Scalars['String']['output']>;
  subjectSlug?: Maybe<Scalars['String']['output']>;
  subjectTitle?: Maybe<Scalars['String']['output']>;
  tierSlug?: Maybe<Scalars['String']['output']>;
  unitSlug?: Maybe<Scalars['String']['output']>;
  unitTitle?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "published.mv_lesson_listing_2". */
export type Published_Mv_Lesson_Listing_2_Order_By = {
  keyStageSlug?: InputMaybe<Order_By>;
  keyStageTitle?: InputMaybe<Order_By>;
  lessons?: InputMaybe<Order_By>;
  programmeSlug?: InputMaybe<Order_By>;
  subjectSlug?: InputMaybe<Order_By>;
  subjectTitle?: InputMaybe<Order_By>;
  tierSlug?: InputMaybe<Order_By>;
  unitSlug?: InputMaybe<Order_By>;
  unitTitle?: InputMaybe<Order_By>;
};

/** select columns of table "published.mv_lesson_listing_2" */
export enum Published_Mv_Lesson_Listing_2_Select_Column {
  /** column name */
  KeyStageSlug = 'keyStageSlug',
  /** column name */
  KeyStageTitle = 'keyStageTitle',
  /** column name */
  Lessons = 'lessons',
  /** column name */
  ProgrammeSlug = 'programmeSlug',
  /** column name */
  SubjectSlug = 'subjectSlug',
  /** column name */
  SubjectTitle = 'subjectTitle',
  /** column name */
  TierSlug = 'tierSlug',
  /** column name */
  UnitSlug = 'unitSlug',
  /** column name */
  UnitTitle = 'unitTitle'
}

/** Streaming cursor of the table "published_mv_lesson_listing_2" */
export type Published_Mv_Lesson_Listing_2_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Published_Mv_Lesson_Listing_2_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Published_Mv_Lesson_Listing_2_Stream_Cursor_Value_Input = {
  keyStageSlug?: InputMaybe<Scalars['String']['input']>;
  keyStageTitle?: InputMaybe<Scalars['String']['input']>;
  lessons?: InputMaybe<Scalars['jsonb']['input']>;
  programmeSlug?: InputMaybe<Scalars['String']['input']>;
  subjectSlug?: InputMaybe<Scalars['String']['input']>;
  subjectTitle?: InputMaybe<Scalars['String']['input']>;
  tierSlug?: InputMaybe<Scalars['String']['input']>;
  unitSlug?: InputMaybe<Scalars['String']['input']>;
  unitTitle?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "published.mv_lesson_overview" */
export type Published_Mv_Lesson_Overview = {
  __typename?: 'published_mv_lesson_overview';
  contentGuidanceDetails?: Maybe<Scalars['jsonb']['output']>;
  copyrightContent?: Maybe<Scalars['jsonb']['output']>;
  exitQuiz?: Maybe<Scalars['jsonb']['output']>;
  keyLearningPoints?: Maybe<Scalars['jsonb']['output']>;
  keyStageSlug?: Maybe<Scalars['String']['output']>;
  keyStageTitle?: Maybe<Scalars['String']['output']>;
  lessonEquipmentAndResources?: Maybe<Scalars['jsonb']['output']>;
  lessonKeywords?: Maybe<Scalars['jsonb']['output']>;
  lessonSlug?: Maybe<Scalars['String']['output']>;
  lessonTitle?: Maybe<Scalars['String']['output']>;
  presentationUrl?: Maybe<Scalars['String']['output']>;
  programmeSlug?: Maybe<Scalars['String']['output']>;
  pupilLessonOutcome?: Maybe<Scalars['jsonb']['output']>;
  starterQuiz?: Maybe<Scalars['jsonb']['output']>;
  subjectSlug?: Maybe<Scalars['String']['output']>;
  subjectTitle?: Maybe<Scalars['String']['output']>;
  supervisionLevel?: Maybe<Scalars['String']['output']>;
  transcriptSentences?: Maybe<Scalars['String']['output']>;
  unitSlug?: Maybe<Scalars['String']['output']>;
  unitTitle?: Maybe<Scalars['String']['output']>;
  videoMuxPlaybackId?: Maybe<Scalars['String']['output']>;
  videoWithSignLanguageMuxPlaybackId?: Maybe<Scalars['String']['output']>;
  worksheetUrl?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "published.mv_lesson_overview" */
export type Published_Mv_Lesson_OverviewContentGuidanceDetailsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "published.mv_lesson_overview" */
export type Published_Mv_Lesson_OverviewCopyrightContentArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "published.mv_lesson_overview" */
export type Published_Mv_Lesson_OverviewExitQuizArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "published.mv_lesson_overview" */
export type Published_Mv_Lesson_OverviewKeyLearningPointsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "published.mv_lesson_overview" */
export type Published_Mv_Lesson_OverviewLessonEquipmentAndResourcesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "published.mv_lesson_overview" */
export type Published_Mv_Lesson_OverviewLessonKeywordsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "published.mv_lesson_overview" */
export type Published_Mv_Lesson_OverviewPupilLessonOutcomeArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "published.mv_lesson_overview" */
export type Published_Mv_Lesson_OverviewStarterQuizArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "published.mv_lesson_overview" */
export type Published_Mv_Lesson_Overview_Aggregate = {
  __typename?: 'published_mv_lesson_overview_aggregate';
  aggregate?: Maybe<Published_Mv_Lesson_Overview_Aggregate_Fields>;
  nodes: Array<Published_Mv_Lesson_Overview>;
};

/** aggregate fields of "published.mv_lesson_overview" */
export type Published_Mv_Lesson_Overview_Aggregate_Fields = {
  __typename?: 'published_mv_lesson_overview_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Published_Mv_Lesson_Overview_Max_Fields>;
  min?: Maybe<Published_Mv_Lesson_Overview_Min_Fields>;
};


/** aggregate fields of "published.mv_lesson_overview" */
export type Published_Mv_Lesson_Overview_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Published_Mv_Lesson_Overview_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "published.mv_lesson_overview". All fields are combined with a logical 'AND'. */
export type Published_Mv_Lesson_Overview_Bool_Exp = {
  _and?: InputMaybe<Array<Published_Mv_Lesson_Overview_Bool_Exp>>;
  _not?: InputMaybe<Published_Mv_Lesson_Overview_Bool_Exp>;
  _or?: InputMaybe<Array<Published_Mv_Lesson_Overview_Bool_Exp>>;
  contentGuidanceDetails?: InputMaybe<Jsonb_Comparison_Exp>;
  copyrightContent?: InputMaybe<Jsonb_Comparison_Exp>;
  exitQuiz?: InputMaybe<Jsonb_Comparison_Exp>;
  keyLearningPoints?: InputMaybe<Jsonb_Comparison_Exp>;
  keyStageSlug?: InputMaybe<String_Comparison_Exp>;
  keyStageTitle?: InputMaybe<String_Comparison_Exp>;
  lessonEquipmentAndResources?: InputMaybe<Jsonb_Comparison_Exp>;
  lessonKeywords?: InputMaybe<Jsonb_Comparison_Exp>;
  lessonSlug?: InputMaybe<String_Comparison_Exp>;
  lessonTitle?: InputMaybe<String_Comparison_Exp>;
  presentationUrl?: InputMaybe<String_Comparison_Exp>;
  programmeSlug?: InputMaybe<String_Comparison_Exp>;
  pupilLessonOutcome?: InputMaybe<Jsonb_Comparison_Exp>;
  starterQuiz?: InputMaybe<Jsonb_Comparison_Exp>;
  subjectSlug?: InputMaybe<String_Comparison_Exp>;
  subjectTitle?: InputMaybe<String_Comparison_Exp>;
  supervisionLevel?: InputMaybe<String_Comparison_Exp>;
  transcriptSentences?: InputMaybe<String_Comparison_Exp>;
  unitSlug?: InputMaybe<String_Comparison_Exp>;
  unitTitle?: InputMaybe<String_Comparison_Exp>;
  videoMuxPlaybackId?: InputMaybe<String_Comparison_Exp>;
  videoWithSignLanguageMuxPlaybackId?: InputMaybe<String_Comparison_Exp>;
  worksheetUrl?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Published_Mv_Lesson_Overview_Max_Fields = {
  __typename?: 'published_mv_lesson_overview_max_fields';
  keyStageSlug?: Maybe<Scalars['String']['output']>;
  keyStageTitle?: Maybe<Scalars['String']['output']>;
  lessonSlug?: Maybe<Scalars['String']['output']>;
  lessonTitle?: Maybe<Scalars['String']['output']>;
  presentationUrl?: Maybe<Scalars['String']['output']>;
  programmeSlug?: Maybe<Scalars['String']['output']>;
  subjectSlug?: Maybe<Scalars['String']['output']>;
  subjectTitle?: Maybe<Scalars['String']['output']>;
  supervisionLevel?: Maybe<Scalars['String']['output']>;
  transcriptSentences?: Maybe<Scalars['String']['output']>;
  unitSlug?: Maybe<Scalars['String']['output']>;
  unitTitle?: Maybe<Scalars['String']['output']>;
  videoMuxPlaybackId?: Maybe<Scalars['String']['output']>;
  videoWithSignLanguageMuxPlaybackId?: Maybe<Scalars['String']['output']>;
  worksheetUrl?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Published_Mv_Lesson_Overview_Min_Fields = {
  __typename?: 'published_mv_lesson_overview_min_fields';
  keyStageSlug?: Maybe<Scalars['String']['output']>;
  keyStageTitle?: Maybe<Scalars['String']['output']>;
  lessonSlug?: Maybe<Scalars['String']['output']>;
  lessonTitle?: Maybe<Scalars['String']['output']>;
  presentationUrl?: Maybe<Scalars['String']['output']>;
  programmeSlug?: Maybe<Scalars['String']['output']>;
  subjectSlug?: Maybe<Scalars['String']['output']>;
  subjectTitle?: Maybe<Scalars['String']['output']>;
  supervisionLevel?: Maybe<Scalars['String']['output']>;
  transcriptSentences?: Maybe<Scalars['String']['output']>;
  unitSlug?: Maybe<Scalars['String']['output']>;
  unitTitle?: Maybe<Scalars['String']['output']>;
  videoMuxPlaybackId?: Maybe<Scalars['String']['output']>;
  videoWithSignLanguageMuxPlaybackId?: Maybe<Scalars['String']['output']>;
  worksheetUrl?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "published.mv_lesson_overview". */
export type Published_Mv_Lesson_Overview_Order_By = {
  contentGuidanceDetails?: InputMaybe<Order_By>;
  copyrightContent?: InputMaybe<Order_By>;
  exitQuiz?: InputMaybe<Order_By>;
  keyLearningPoints?: InputMaybe<Order_By>;
  keyStageSlug?: InputMaybe<Order_By>;
  keyStageTitle?: InputMaybe<Order_By>;
  lessonEquipmentAndResources?: InputMaybe<Order_By>;
  lessonKeywords?: InputMaybe<Order_By>;
  lessonSlug?: InputMaybe<Order_By>;
  lessonTitle?: InputMaybe<Order_By>;
  presentationUrl?: InputMaybe<Order_By>;
  programmeSlug?: InputMaybe<Order_By>;
  pupilLessonOutcome?: InputMaybe<Order_By>;
  starterQuiz?: InputMaybe<Order_By>;
  subjectSlug?: InputMaybe<Order_By>;
  subjectTitle?: InputMaybe<Order_By>;
  supervisionLevel?: InputMaybe<Order_By>;
  transcriptSentences?: InputMaybe<Order_By>;
  unitSlug?: InputMaybe<Order_By>;
  unitTitle?: InputMaybe<Order_By>;
  videoMuxPlaybackId?: InputMaybe<Order_By>;
  videoWithSignLanguageMuxPlaybackId?: InputMaybe<Order_By>;
  worksheetUrl?: InputMaybe<Order_By>;
};

/** select columns of table "published.mv_lesson_overview" */
export enum Published_Mv_Lesson_Overview_Select_Column {
  /** column name */
  ContentGuidanceDetails = 'contentGuidanceDetails',
  /** column name */
  CopyrightContent = 'copyrightContent',
  /** column name */
  ExitQuiz = 'exitQuiz',
  /** column name */
  KeyLearningPoints = 'keyLearningPoints',
  /** column name */
  KeyStageSlug = 'keyStageSlug',
  /** column name */
  KeyStageTitle = 'keyStageTitle',
  /** column name */
  LessonEquipmentAndResources = 'lessonEquipmentAndResources',
  /** column name */
  LessonKeywords = 'lessonKeywords',
  /** column name */
  LessonSlug = 'lessonSlug',
  /** column name */
  LessonTitle = 'lessonTitle',
  /** column name */
  PresentationUrl = 'presentationUrl',
  /** column name */
  ProgrammeSlug = 'programmeSlug',
  /** column name */
  PupilLessonOutcome = 'pupilLessonOutcome',
  /** column name */
  StarterQuiz = 'starterQuiz',
  /** column name */
  SubjectSlug = 'subjectSlug',
  /** column name */
  SubjectTitle = 'subjectTitle',
  /** column name */
  SupervisionLevel = 'supervisionLevel',
  /** column name */
  TranscriptSentences = 'transcriptSentences',
  /** column name */
  UnitSlug = 'unitSlug',
  /** column name */
  UnitTitle = 'unitTitle',
  /** column name */
  VideoMuxPlaybackId = 'videoMuxPlaybackId',
  /** column name */
  VideoWithSignLanguageMuxPlaybackId = 'videoWithSignLanguageMuxPlaybackId',
  /** column name */
  WorksheetUrl = 'worksheetUrl'
}

/** Streaming cursor of the table "published_mv_lesson_overview" */
export type Published_Mv_Lesson_Overview_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Published_Mv_Lesson_Overview_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Published_Mv_Lesson_Overview_Stream_Cursor_Value_Input = {
  contentGuidanceDetails?: InputMaybe<Scalars['jsonb']['input']>;
  copyrightContent?: InputMaybe<Scalars['jsonb']['input']>;
  exitQuiz?: InputMaybe<Scalars['jsonb']['input']>;
  keyLearningPoints?: InputMaybe<Scalars['jsonb']['input']>;
  keyStageSlug?: InputMaybe<Scalars['String']['input']>;
  keyStageTitle?: InputMaybe<Scalars['String']['input']>;
  lessonEquipmentAndResources?: InputMaybe<Scalars['jsonb']['input']>;
  lessonKeywords?: InputMaybe<Scalars['jsonb']['input']>;
  lessonSlug?: InputMaybe<Scalars['String']['input']>;
  lessonTitle?: InputMaybe<Scalars['String']['input']>;
  presentationUrl?: InputMaybe<Scalars['String']['input']>;
  programmeSlug?: InputMaybe<Scalars['String']['input']>;
  pupilLessonOutcome?: InputMaybe<Scalars['jsonb']['input']>;
  starterQuiz?: InputMaybe<Scalars['jsonb']['input']>;
  subjectSlug?: InputMaybe<Scalars['String']['input']>;
  subjectTitle?: InputMaybe<Scalars['String']['input']>;
  supervisionLevel?: InputMaybe<Scalars['String']['input']>;
  transcriptSentences?: InputMaybe<Scalars['String']['input']>;
  unitSlug?: InputMaybe<Scalars['String']['input']>;
  unitTitle?: InputMaybe<Scalars['String']['input']>;
  videoMuxPlaybackId?: InputMaybe<Scalars['String']['input']>;
  videoWithSignLanguageMuxPlaybackId?: InputMaybe<Scalars['String']['input']>;
  worksheetUrl?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "published.mv_programme_listing" */
export type Published_Mv_Programme_Listing = {
  __typename?: 'published_mv_programme_listing';
  key_stage_slug?: Maybe<Scalars['String']['output']>;
  programmes?: Maybe<Scalars['jsonb']['output']>;
  subject_slug?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "published.mv_programme_listing" */
export type Published_Mv_Programme_ListingProgrammesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "published.mv_programme_listing" */
export type Published_Mv_Programme_Listing_Aggregate = {
  __typename?: 'published_mv_programme_listing_aggregate';
  aggregate?: Maybe<Published_Mv_Programme_Listing_Aggregate_Fields>;
  nodes: Array<Published_Mv_Programme_Listing>;
};

/** aggregate fields of "published.mv_programme_listing" */
export type Published_Mv_Programme_Listing_Aggregate_Fields = {
  __typename?: 'published_mv_programme_listing_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Published_Mv_Programme_Listing_Max_Fields>;
  min?: Maybe<Published_Mv_Programme_Listing_Min_Fields>;
};


/** aggregate fields of "published.mv_programme_listing" */
export type Published_Mv_Programme_Listing_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Published_Mv_Programme_Listing_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "published.mv_programme_listing". All fields are combined with a logical 'AND'. */
export type Published_Mv_Programme_Listing_Bool_Exp = {
  _and?: InputMaybe<Array<Published_Mv_Programme_Listing_Bool_Exp>>;
  _not?: InputMaybe<Published_Mv_Programme_Listing_Bool_Exp>;
  _or?: InputMaybe<Array<Published_Mv_Programme_Listing_Bool_Exp>>;
  key_stage_slug?: InputMaybe<String_Comparison_Exp>;
  programmes?: InputMaybe<Jsonb_Comparison_Exp>;
  subject_slug?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Published_Mv_Programme_Listing_Max_Fields = {
  __typename?: 'published_mv_programme_listing_max_fields';
  key_stage_slug?: Maybe<Scalars['String']['output']>;
  subject_slug?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Published_Mv_Programme_Listing_Min_Fields = {
  __typename?: 'published_mv_programme_listing_min_fields';
  key_stage_slug?: Maybe<Scalars['String']['output']>;
  subject_slug?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "published.mv_programme_listing". */
export type Published_Mv_Programme_Listing_Order_By = {
  key_stage_slug?: InputMaybe<Order_By>;
  programmes?: InputMaybe<Order_By>;
  subject_slug?: InputMaybe<Order_By>;
};

/** select columns of table "published.mv_programme_listing" */
export enum Published_Mv_Programme_Listing_Select_Column {
  /** column name */
  KeyStageSlug = 'key_stage_slug',
  /** column name */
  Programmes = 'programmes',
  /** column name */
  SubjectSlug = 'subject_slug'
}

/** Streaming cursor of the table "published_mv_programme_listing" */
export type Published_Mv_Programme_Listing_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Published_Mv_Programme_Listing_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Published_Mv_Programme_Listing_Stream_Cursor_Value_Input = {
  key_stage_slug?: InputMaybe<Scalars['String']['input']>;
  programmes?: InputMaybe<Scalars['jsonb']['input']>;
  subject_slug?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "published.mv_search_page" */
export type Published_Mv_Search_Page = {
  __typename?: 'published_mv_search_page';
  content_type?: Maybe<Scalars['json']['output']>;
  key_stages?: Maybe<Scalars['json']['output']>;
  subjects?: Maybe<Scalars['json']['output']>;
};


/** columns and relationships of "published.mv_search_page" */
export type Published_Mv_Search_PageContent_TypeArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "published.mv_search_page" */
export type Published_Mv_Search_PageKey_StagesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "published.mv_search_page" */
export type Published_Mv_Search_PageSubjectsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "published.mv_search_page" */
export type Published_Mv_Search_Page_Aggregate = {
  __typename?: 'published_mv_search_page_aggregate';
  aggregate?: Maybe<Published_Mv_Search_Page_Aggregate_Fields>;
  nodes: Array<Published_Mv_Search_Page>;
};

/** aggregate fields of "published.mv_search_page" */
export type Published_Mv_Search_Page_Aggregate_Fields = {
  __typename?: 'published_mv_search_page_aggregate_fields';
  count: Scalars['Int']['output'];
};


/** aggregate fields of "published.mv_search_page" */
export type Published_Mv_Search_Page_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Published_Mv_Search_Page_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "published.mv_search_page". All fields are combined with a logical 'AND'. */
export type Published_Mv_Search_Page_Bool_Exp = {
  _and?: InputMaybe<Array<Published_Mv_Search_Page_Bool_Exp>>;
  _not?: InputMaybe<Published_Mv_Search_Page_Bool_Exp>;
  _or?: InputMaybe<Array<Published_Mv_Search_Page_Bool_Exp>>;
  content_type?: InputMaybe<Json_Comparison_Exp>;
  key_stages?: InputMaybe<Json_Comparison_Exp>;
  subjects?: InputMaybe<Json_Comparison_Exp>;
};

/** Ordering options when selecting data from "published.mv_search_page". */
export type Published_Mv_Search_Page_Order_By = {
  content_type?: InputMaybe<Order_By>;
  key_stages?: InputMaybe<Order_By>;
  subjects?: InputMaybe<Order_By>;
};

/** select columns of table "published.mv_search_page" */
export enum Published_Mv_Search_Page_Select_Column {
  /** column name */
  ContentType = 'content_type',
  /** column name */
  KeyStages = 'key_stages',
  /** column name */
  Subjects = 'subjects'
}

/** Streaming cursor of the table "published_mv_search_page" */
export type Published_Mv_Search_Page_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Published_Mv_Search_Page_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Published_Mv_Search_Page_Stream_Cursor_Value_Input = {
  content_type?: InputMaybe<Scalars['json']['input']>;
  key_stages?: InputMaybe<Scalars['json']['input']>;
  subjects?: InputMaybe<Scalars['json']['input']>;
};

/** columns and relationships of "published.mv_subject_listing" */
export type Published_Mv_Subject_Listing = {
  __typename?: 'published_mv_subject_listing';
  keyStageSlug?: Maybe<Scalars['String']['output']>;
  keyStageTitle?: Maybe<Scalars['String']['output']>;
  subjects?: Maybe<Scalars['jsonb']['output']>;
  subjectsUnavailable?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "published.mv_subject_listing" */
export type Published_Mv_Subject_ListingSubjectsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "published.mv_subject_listing" */
export type Published_Mv_Subject_Listing_Aggregate = {
  __typename?: 'published_mv_subject_listing_aggregate';
  aggregate?: Maybe<Published_Mv_Subject_Listing_Aggregate_Fields>;
  nodes: Array<Published_Mv_Subject_Listing>;
};

/** aggregate fields of "published.mv_subject_listing" */
export type Published_Mv_Subject_Listing_Aggregate_Fields = {
  __typename?: 'published_mv_subject_listing_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Published_Mv_Subject_Listing_Max_Fields>;
  min?: Maybe<Published_Mv_Subject_Listing_Min_Fields>;
};


/** aggregate fields of "published.mv_subject_listing" */
export type Published_Mv_Subject_Listing_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Published_Mv_Subject_Listing_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "published.mv_subject_listing". All fields are combined with a logical 'AND'. */
export type Published_Mv_Subject_Listing_Bool_Exp = {
  _and?: InputMaybe<Array<Published_Mv_Subject_Listing_Bool_Exp>>;
  _not?: InputMaybe<Published_Mv_Subject_Listing_Bool_Exp>;
  _or?: InputMaybe<Array<Published_Mv_Subject_Listing_Bool_Exp>>;
  keyStageSlug?: InputMaybe<String_Comparison_Exp>;
  keyStageTitle?: InputMaybe<String_Comparison_Exp>;
  subjects?: InputMaybe<Jsonb_Comparison_Exp>;
  subjectsUnavailable?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Published_Mv_Subject_Listing_Max_Fields = {
  __typename?: 'published_mv_subject_listing_max_fields';
  keyStageSlug?: Maybe<Scalars['String']['output']>;
  keyStageTitle?: Maybe<Scalars['String']['output']>;
  subjectsUnavailable?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Published_Mv_Subject_Listing_Min_Fields = {
  __typename?: 'published_mv_subject_listing_min_fields';
  keyStageSlug?: Maybe<Scalars['String']['output']>;
  keyStageTitle?: Maybe<Scalars['String']['output']>;
  subjectsUnavailable?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "published.mv_subject_listing". */
export type Published_Mv_Subject_Listing_Order_By = {
  keyStageSlug?: InputMaybe<Order_By>;
  keyStageTitle?: InputMaybe<Order_By>;
  subjects?: InputMaybe<Order_By>;
  subjectsUnavailable?: InputMaybe<Order_By>;
};

/** select columns of table "published.mv_subject_listing" */
export enum Published_Mv_Subject_Listing_Select_Column {
  /** column name */
  KeyStageSlug = 'keyStageSlug',
  /** column name */
  KeyStageTitle = 'keyStageTitle',
  /** column name */
  Subjects = 'subjects',
  /** column name */
  SubjectsUnavailable = 'subjectsUnavailable'
}

/** Streaming cursor of the table "published_mv_subject_listing" */
export type Published_Mv_Subject_Listing_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Published_Mv_Subject_Listing_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Published_Mv_Subject_Listing_Stream_Cursor_Value_Input = {
  keyStageSlug?: InputMaybe<Scalars['String']['input']>;
  keyStageTitle?: InputMaybe<Scalars['String']['input']>;
  subjects?: InputMaybe<Scalars['jsonb']['input']>;
  subjectsUnavailable?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "published.mv_unit_listing_page" */
export type Published_Mv_Unit_Listing_Page = {
  __typename?: 'published_mv_unit_listing_page';
  key_stage_slug?: Maybe<Scalars['String']['output']>;
  key_stage_title?: Maybe<Scalars['jsonb']['output']>;
  programme_slug?: Maybe<Scalars['String']['output']>;
  subject_slug?: Maybe<Scalars['jsonb']['output']>;
  subject_title?: Maybe<Scalars['jsonb']['output']>;
  tier_slug?: Maybe<Scalars['jsonb']['output']>;
  unit_count?: Maybe<Scalars['numeric']['output']>;
  units?: Maybe<Scalars['jsonb']['output']>;
};


/** columns and relationships of "published.mv_unit_listing_page" */
export type Published_Mv_Unit_Listing_PageKey_Stage_TitleArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "published.mv_unit_listing_page" */
export type Published_Mv_Unit_Listing_PageSubject_SlugArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "published.mv_unit_listing_page" */
export type Published_Mv_Unit_Listing_PageSubject_TitleArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "published.mv_unit_listing_page" */
export type Published_Mv_Unit_Listing_PageTier_SlugArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "published.mv_unit_listing_page" */
export type Published_Mv_Unit_Listing_PageUnitsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "published.mv_unit_listing_page" */
export type Published_Mv_Unit_Listing_Page_Aggregate = {
  __typename?: 'published_mv_unit_listing_page_aggregate';
  aggregate?: Maybe<Published_Mv_Unit_Listing_Page_Aggregate_Fields>;
  nodes: Array<Published_Mv_Unit_Listing_Page>;
};

/** aggregate fields of "published.mv_unit_listing_page" */
export type Published_Mv_Unit_Listing_Page_Aggregate_Fields = {
  __typename?: 'published_mv_unit_listing_page_aggregate_fields';
  avg?: Maybe<Published_Mv_Unit_Listing_Page_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Published_Mv_Unit_Listing_Page_Max_Fields>;
  min?: Maybe<Published_Mv_Unit_Listing_Page_Min_Fields>;
  stddev?: Maybe<Published_Mv_Unit_Listing_Page_Stddev_Fields>;
  stddev_pop?: Maybe<Published_Mv_Unit_Listing_Page_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Published_Mv_Unit_Listing_Page_Stddev_Samp_Fields>;
  sum?: Maybe<Published_Mv_Unit_Listing_Page_Sum_Fields>;
  var_pop?: Maybe<Published_Mv_Unit_Listing_Page_Var_Pop_Fields>;
  var_samp?: Maybe<Published_Mv_Unit_Listing_Page_Var_Samp_Fields>;
  variance?: Maybe<Published_Mv_Unit_Listing_Page_Variance_Fields>;
};


/** aggregate fields of "published.mv_unit_listing_page" */
export type Published_Mv_Unit_Listing_Page_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Published_Mv_Unit_Listing_Page_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Published_Mv_Unit_Listing_Page_Avg_Fields = {
  __typename?: 'published_mv_unit_listing_page_avg_fields';
  unit_count?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "published.mv_unit_listing_page". All fields are combined with a logical 'AND'. */
export type Published_Mv_Unit_Listing_Page_Bool_Exp = {
  _and?: InputMaybe<Array<Published_Mv_Unit_Listing_Page_Bool_Exp>>;
  _not?: InputMaybe<Published_Mv_Unit_Listing_Page_Bool_Exp>;
  _or?: InputMaybe<Array<Published_Mv_Unit_Listing_Page_Bool_Exp>>;
  key_stage_slug?: InputMaybe<String_Comparison_Exp>;
  key_stage_title?: InputMaybe<Jsonb_Comparison_Exp>;
  programme_slug?: InputMaybe<String_Comparison_Exp>;
  subject_slug?: InputMaybe<Jsonb_Comparison_Exp>;
  subject_title?: InputMaybe<Jsonb_Comparison_Exp>;
  tier_slug?: InputMaybe<Jsonb_Comparison_Exp>;
  unit_count?: InputMaybe<Numeric_Comparison_Exp>;
  units?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** aggregate max on columns */
export type Published_Mv_Unit_Listing_Page_Max_Fields = {
  __typename?: 'published_mv_unit_listing_page_max_fields';
  key_stage_slug?: Maybe<Scalars['String']['output']>;
  programme_slug?: Maybe<Scalars['String']['output']>;
  unit_count?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type Published_Mv_Unit_Listing_Page_Min_Fields = {
  __typename?: 'published_mv_unit_listing_page_min_fields';
  key_stage_slug?: Maybe<Scalars['String']['output']>;
  programme_slug?: Maybe<Scalars['String']['output']>;
  unit_count?: Maybe<Scalars['numeric']['output']>;
};

/** Ordering options when selecting data from "published.mv_unit_listing_page". */
export type Published_Mv_Unit_Listing_Page_Order_By = {
  key_stage_slug?: InputMaybe<Order_By>;
  key_stage_title?: InputMaybe<Order_By>;
  programme_slug?: InputMaybe<Order_By>;
  subject_slug?: InputMaybe<Order_By>;
  subject_title?: InputMaybe<Order_By>;
  tier_slug?: InputMaybe<Order_By>;
  unit_count?: InputMaybe<Order_By>;
  units?: InputMaybe<Order_By>;
};

/** select columns of table "published.mv_unit_listing_page" */
export enum Published_Mv_Unit_Listing_Page_Select_Column {
  /** column name */
  KeyStageSlug = 'key_stage_slug',
  /** column name */
  KeyStageTitle = 'key_stage_title',
  /** column name */
  ProgrammeSlug = 'programme_slug',
  /** column name */
  SubjectSlug = 'subject_slug',
  /** column name */
  SubjectTitle = 'subject_title',
  /** column name */
  TierSlug = 'tier_slug',
  /** column name */
  UnitCount = 'unit_count',
  /** column name */
  Units = 'units'
}

/** aggregate stddev on columns */
export type Published_Mv_Unit_Listing_Page_Stddev_Fields = {
  __typename?: 'published_mv_unit_listing_page_stddev_fields';
  unit_count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Published_Mv_Unit_Listing_Page_Stddev_Pop_Fields = {
  __typename?: 'published_mv_unit_listing_page_stddev_pop_fields';
  unit_count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Published_Mv_Unit_Listing_Page_Stddev_Samp_Fields = {
  __typename?: 'published_mv_unit_listing_page_stddev_samp_fields';
  unit_count?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "published_mv_unit_listing_page" */
export type Published_Mv_Unit_Listing_Page_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Published_Mv_Unit_Listing_Page_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Published_Mv_Unit_Listing_Page_Stream_Cursor_Value_Input = {
  key_stage_slug?: InputMaybe<Scalars['String']['input']>;
  key_stage_title?: InputMaybe<Scalars['jsonb']['input']>;
  programme_slug?: InputMaybe<Scalars['String']['input']>;
  subject_slug?: InputMaybe<Scalars['jsonb']['input']>;
  subject_title?: InputMaybe<Scalars['jsonb']['input']>;
  tier_slug?: InputMaybe<Scalars['jsonb']['input']>;
  unit_count?: InputMaybe<Scalars['numeric']['input']>;
  units?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate sum on columns */
export type Published_Mv_Unit_Listing_Page_Sum_Fields = {
  __typename?: 'published_mv_unit_listing_page_sum_fields';
  unit_count?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate var_pop on columns */
export type Published_Mv_Unit_Listing_Page_Var_Pop_Fields = {
  __typename?: 'published_mv_unit_listing_page_var_pop_fields';
  unit_count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Published_Mv_Unit_Listing_Page_Var_Samp_Fields = {
  __typename?: 'published_mv_unit_listing_page_var_samp_fields';
  unit_count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Published_Mv_Unit_Listing_Page_Variance_Fields = {
  __typename?: 'published_mv_unit_listing_page_variance_fields';
  unit_count?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "published.viewmanager" */
export type Published_Viewmanager = {
  __typename?: 'published_viewmanager';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  has_updated: Scalars['Boolean']['output'];
  last_error?: Maybe<Scalars['json']['output']>;
  next_update?: Maybe<Scalars['timestamptz']['output']>;
  orginal_tablename?: Maybe<Scalars['String']['output']>;
  trigger_status: Scalars['String']['output'];
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  viewmanager_id: Scalars['Int']['output'];
};


/** columns and relationships of "published.viewmanager" */
export type Published_ViewmanagerLast_ErrorArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "published.viewmanager" */
export type Published_Viewmanager_Aggregate = {
  __typename?: 'published_viewmanager_aggregate';
  aggregate?: Maybe<Published_Viewmanager_Aggregate_Fields>;
  nodes: Array<Published_Viewmanager>;
};

/** aggregate fields of "published.viewmanager" */
export type Published_Viewmanager_Aggregate_Fields = {
  __typename?: 'published_viewmanager_aggregate_fields';
  avg?: Maybe<Published_Viewmanager_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Published_Viewmanager_Max_Fields>;
  min?: Maybe<Published_Viewmanager_Min_Fields>;
  stddev?: Maybe<Published_Viewmanager_Stddev_Fields>;
  stddev_pop?: Maybe<Published_Viewmanager_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Published_Viewmanager_Stddev_Samp_Fields>;
  sum?: Maybe<Published_Viewmanager_Sum_Fields>;
  var_pop?: Maybe<Published_Viewmanager_Var_Pop_Fields>;
  var_samp?: Maybe<Published_Viewmanager_Var_Samp_Fields>;
  variance?: Maybe<Published_Viewmanager_Variance_Fields>;
};


/** aggregate fields of "published.viewmanager" */
export type Published_Viewmanager_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Published_Viewmanager_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Published_Viewmanager_Avg_Fields = {
  __typename?: 'published_viewmanager_avg_fields';
  viewmanager_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "published.viewmanager". All fields are combined with a logical 'AND'. */
export type Published_Viewmanager_Bool_Exp = {
  _and?: InputMaybe<Array<Published_Viewmanager_Bool_Exp>>;
  _not?: InputMaybe<Published_Viewmanager_Bool_Exp>;
  _or?: InputMaybe<Array<Published_Viewmanager_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  has_updated?: InputMaybe<Boolean_Comparison_Exp>;
  last_error?: InputMaybe<Json_Comparison_Exp>;
  next_update?: InputMaybe<Timestamptz_Comparison_Exp>;
  orginal_tablename?: InputMaybe<String_Comparison_Exp>;
  trigger_status?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  viewmanager_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "published.viewmanager" */
export enum Published_Viewmanager_Constraint {
  /** unique or primary key constraint on columns "viewmanager_id" */
  ViewmanagerPkey = 'viewmanager_pkey'
}

/** input type for incrementing numeric columns in table "published.viewmanager" */
export type Published_Viewmanager_Inc_Input = {
  viewmanager_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "published.viewmanager" */
export type Published_Viewmanager_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  has_updated?: InputMaybe<Scalars['Boolean']['input']>;
  last_error?: InputMaybe<Scalars['json']['input']>;
  next_update?: InputMaybe<Scalars['timestamptz']['input']>;
  orginal_tablename?: InputMaybe<Scalars['String']['input']>;
  trigger_status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  viewmanager_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Published_Viewmanager_Max_Fields = {
  __typename?: 'published_viewmanager_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  next_update?: Maybe<Scalars['timestamptz']['output']>;
  orginal_tablename?: Maybe<Scalars['String']['output']>;
  trigger_status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  viewmanager_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Published_Viewmanager_Min_Fields = {
  __typename?: 'published_viewmanager_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  next_update?: Maybe<Scalars['timestamptz']['output']>;
  orginal_tablename?: Maybe<Scalars['String']['output']>;
  trigger_status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  viewmanager_id?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "published.viewmanager" */
export type Published_Viewmanager_Mutation_Response = {
  __typename?: 'published_viewmanager_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Published_Viewmanager>;
};

/** on_conflict condition type for table "published.viewmanager" */
export type Published_Viewmanager_On_Conflict = {
  constraint: Published_Viewmanager_Constraint;
  update_columns?: Array<Published_Viewmanager_Update_Column>;
  where?: InputMaybe<Published_Viewmanager_Bool_Exp>;
};

/** Ordering options when selecting data from "published.viewmanager". */
export type Published_Viewmanager_Order_By = {
  created_at?: InputMaybe<Order_By>;
  has_updated?: InputMaybe<Order_By>;
  last_error?: InputMaybe<Order_By>;
  next_update?: InputMaybe<Order_By>;
  orginal_tablename?: InputMaybe<Order_By>;
  trigger_status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  viewmanager_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: published.viewmanager */
export type Published_Viewmanager_Pk_Columns_Input = {
  viewmanager_id: Scalars['Int']['input'];
};

/** select columns of table "published.viewmanager" */
export enum Published_Viewmanager_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HasUpdated = 'has_updated',
  /** column name */
  LastError = 'last_error',
  /** column name */
  NextUpdate = 'next_update',
  /** column name */
  OrginalTablename = 'orginal_tablename',
  /** column name */
  TriggerStatus = 'trigger_status',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  ViewmanagerId = 'viewmanager_id'
}

/** input type for updating data in table "published.viewmanager" */
export type Published_Viewmanager_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  has_updated?: InputMaybe<Scalars['Boolean']['input']>;
  last_error?: InputMaybe<Scalars['json']['input']>;
  next_update?: InputMaybe<Scalars['timestamptz']['input']>;
  orginal_tablename?: InputMaybe<Scalars['String']['input']>;
  trigger_status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  viewmanager_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Published_Viewmanager_Stddev_Fields = {
  __typename?: 'published_viewmanager_stddev_fields';
  viewmanager_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Published_Viewmanager_Stddev_Pop_Fields = {
  __typename?: 'published_viewmanager_stddev_pop_fields';
  viewmanager_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Published_Viewmanager_Stddev_Samp_Fields = {
  __typename?: 'published_viewmanager_stddev_samp_fields';
  viewmanager_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "published_viewmanager" */
export type Published_Viewmanager_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Published_Viewmanager_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Published_Viewmanager_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  has_updated?: InputMaybe<Scalars['Boolean']['input']>;
  last_error?: InputMaybe<Scalars['json']['input']>;
  next_update?: InputMaybe<Scalars['timestamptz']['input']>;
  orginal_tablename?: InputMaybe<Scalars['String']['input']>;
  trigger_status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  viewmanager_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Published_Viewmanager_Sum_Fields = {
  __typename?: 'published_viewmanager_sum_fields';
  viewmanager_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "published.viewmanager" */
export enum Published_Viewmanager_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HasUpdated = 'has_updated',
  /** column name */
  LastError = 'last_error',
  /** column name */
  NextUpdate = 'next_update',
  /** column name */
  OrginalTablename = 'orginal_tablename',
  /** column name */
  TriggerStatus = 'trigger_status',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  ViewmanagerId = 'viewmanager_id'
}

export type Published_Viewmanager_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Published_Viewmanager_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Published_Viewmanager_Set_Input>;
  /** filter the rows which have to be updated */
  where: Published_Viewmanager_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Published_Viewmanager_Var_Pop_Fields = {
  __typename?: 'published_viewmanager_var_pop_fields';
  viewmanager_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Published_Viewmanager_Var_Samp_Fields = {
  __typename?: 'published_viewmanager_var_samp_fields';
  viewmanager_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Published_Viewmanager_Variance_Fields = {
  __typename?: 'published_viewmanager_variance_fields';
  viewmanager_id?: Maybe<Scalars['Float']['output']>;
};

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "assets" */
  assets: Array<Assets>;
  /** fetch aggregated fields from the table: "assets" */
  assets_aggregate: Assets_Aggregate;
  /** fetch data from the table: "assets" using primary key columns */
  assets_by_pk?: Maybe<Assets>;
  /** fetch data from the table: "cat_contentguidance" */
  cat_contentguidance: Array<Cat_Contentguidance>;
  /** fetch aggregated fields from the table: "cat_contentguidance" */
  cat_contentguidance_aggregate: Cat_Contentguidance_Aggregate;
  /** fetch data from the table: "cat_contentguidance" using primary key columns */
  cat_contentguidance_by_pk?: Maybe<Cat_Contentguidance>;
  /** fetch data from the table: "cat_examboardspecs" */
  cat_examboardspecs: Array<Cat_Examboardspecs>;
  /** fetch aggregated fields from the table: "cat_examboardspecs" */
  cat_examboardspecs_aggregate: Cat_Examboardspecs_Aggregate;
  /** fetch data from the table: "cat_examboardspecs" using primary key columns */
  cat_examboardspecs_by_pk?: Maybe<Cat_Examboardspecs>;
  /** fetch data from the table: "cat_nationalcurriculum" */
  cat_nationalcurriculum: Array<Cat_Nationalcurriculum>;
  /** fetch aggregated fields from the table: "cat_nationalcurriculum" */
  cat_nationalcurriculum_aggregate: Cat_Nationalcurriculum_Aggregate;
  /** fetch data from the table: "cat_nationalcurriculum" using primary key columns */
  cat_nationalcurriculum_by_pk?: Maybe<Cat_Nationalcurriculum>;
  /** fetch data from the table: "cat_supervisionlevels" */
  cat_supervisionlevels: Array<Cat_Supervisionlevels>;
  /** fetch aggregated fields from the table: "cat_supervisionlevels" */
  cat_supervisionlevels_aggregate: Cat_Supervisionlevels_Aggregate;
  /** fetch data from the table: "cat_supervisionlevels" using primary key columns */
  cat_supervisionlevels_by_pk?: Maybe<Cat_Supervisionlevels>;
  /** fetch data from the table: "cat_tags" */
  cat_tags: Array<Cat_Tags>;
  /** fetch aggregated fields from the table: "cat_tags" */
  cat_tags_aggregate: Cat_Tags_Aggregate;
  /** fetch data from the table: "cat_tags" using primary key columns */
  cat_tags_by_pk?: Maybe<Cat_Tags>;
  /** fetch data from the table: "internal.review_lessons" */
  internal_review_lessons: Array<Internal_Review_Lessons>;
  /** fetch aggregated fields from the table: "internal.review_lessons" */
  internal_review_lessons_aggregate: Internal_Review_Lessons_Aggregate;
  /** fetch data from the table: "internal.review_lessons" using primary key columns */
  internal_review_lessons_by_pk?: Maybe<Internal_Review_Lessons>;
  /** fetch data from the table: "lessons" */
  lessons: Array<Lessons>;
  /** fetch aggregated fields from the table: "lessons" */
  lessons_aggregate: Lessons_Aggregate;
  /** fetch data from the table: "lessons" using primary key columns */
  lessons_by_pk?: Maybe<Lessons>;
  /** fetch data from the table: "pf_examboards" */
  pf_examboards: Array<Pf_Examboards>;
  /** fetch aggregated fields from the table: "pf_examboards" */
  pf_examboards_aggregate: Pf_Examboards_Aggregate;
  /** fetch data from the table: "pf_examboards" using primary key columns */
  pf_examboards_by_pk?: Maybe<Pf_Examboards>;
  /** fetch data from the table: "pf_keystages" */
  pf_keystages: Array<Pf_Keystages>;
  /** fetch aggregated fields from the table: "pf_keystages" */
  pf_keystages_aggregate: Pf_Keystages_Aggregate;
  /** fetch data from the table: "pf_keystages" using primary key columns */
  pf_keystages_by_pk?: Maybe<Pf_Keystages>;
  /** fetch data from the table: "pf_phases" */
  pf_phases: Array<Pf_Phases>;
  /** fetch aggregated fields from the table: "pf_phases" */
  pf_phases_aggregate: Pf_Phases_Aggregate;
  /** fetch data from the table: "pf_phases" using primary key columns */
  pf_phases_by_pk?: Maybe<Pf_Phases>;
  /** fetch data from the table: "pf_subjects" */
  pf_subjects: Array<Pf_Subjects>;
  /** fetch aggregated fields from the table: "pf_subjects" */
  pf_subjects_aggregate: Pf_Subjects_Aggregate;
  /** fetch data from the table: "pf_subjects" using primary key columns */
  pf_subjects_by_pk?: Maybe<Pf_Subjects>;
  /** fetch data from the table: "pf_tiers" */
  pf_tiers: Array<Pf_Tiers>;
  /** fetch aggregated fields from the table: "pf_tiers" */
  pf_tiers_aggregate: Pf_Tiers_Aggregate;
  /** fetch data from the table: "pf_tiers" using primary key columns */
  pf_tiers_by_pk?: Maybe<Pf_Tiers>;
  /** fetch data from the table: "pf_years" */
  pf_years: Array<Pf_Years>;
  /** fetch aggregated fields from the table: "pf_years" */
  pf_years_aggregate: Pf_Years_Aggregate;
  /** fetch data from the table: "pf_years" using primary key columns */
  pf_years_by_pk?: Maybe<Pf_Years>;
  /** An array relationship */
  programme_threads: Array<Programme_Threads>;
  /** An aggregate relationship */
  programme_threads_aggregate: Programme_Threads_Aggregate;
  /** fetch data from the table: "programme_threads" using primary key columns */
  programme_threads_by_pk?: Maybe<Programme_Threads>;
  /** An array relationship */
  programme_units: Array<Programme_Units>;
  /** An aggregate relationship */
  programme_units_aggregate: Programme_Units_Aggregate;
  /** fetch data from the table: "programme_units" using primary key columns */
  programme_units_by_pk?: Maybe<Programme_Units>;
  /** fetch data from the table: "programmes" */
  programmes: Array<Programmes>;
  /** fetch aggregated fields from the table: "programmes" */
  programmes_aggregate: Programmes_Aggregate;
  /** fetch data from the table: "programmes" using primary key columns */
  programmes_by_pk?: Maybe<Programmes>;
  /** fetch data from the table: "published.mv_downloads" */
  published_mv_downloads: Array<Published_Mv_Downloads>;
  /** fetch aggregated fields from the table: "published.mv_downloads" */
  published_mv_downloads_aggregate: Published_Mv_Downloads_Aggregate;
  /** fetch data from the table: "published.mv_homepage" */
  published_mv_homepage: Array<Published_Mv_Homepage>;
  /** fetch data from the table: "published.mv_homepage_1" */
  published_mv_homepage_1: Array<Published_Mv_Homepage_1>;
  /** fetch aggregated fields from the table: "published.mv_homepage_1" */
  published_mv_homepage_1_aggregate: Published_Mv_Homepage_1_Aggregate;
  /** fetch data from the table: "published.mv_homepage_2" */
  published_mv_homepage_2: Array<Published_Mv_Homepage_2>;
  /** fetch aggregated fields from the table: "published.mv_homepage_2" */
  published_mv_homepage_2_aggregate: Published_Mv_Homepage_2_Aggregate;
  /** fetch aggregated fields from the table: "published.mv_homepage" */
  published_mv_homepage_aggregate: Published_Mv_Homepage_Aggregate;
  /** fetch data from the table: "published.mv_key_stages" */
  published_mv_key_stages: Array<Published_Mv_Key_Stages>;
  /** fetch aggregated fields from the table: "published.mv_key_stages" */
  published_mv_key_stages_aggregate: Published_Mv_Key_Stages_Aggregate;
  /** fetch data from the table: "published.mv_lesson_listing_1" */
  published_mv_lesson_listing_1: Array<Published_Mv_Lesson_Listing_1>;
  /** fetch aggregated fields from the table: "published.mv_lesson_listing_1" */
  published_mv_lesson_listing_1_aggregate: Published_Mv_Lesson_Listing_1_Aggregate;
  /** fetch data from the table: "published.mv_lesson_listing_2" */
  published_mv_lesson_listing_2: Array<Published_Mv_Lesson_Listing_2>;
  /** fetch aggregated fields from the table: "published.mv_lesson_listing_2" */
  published_mv_lesson_listing_2_aggregate: Published_Mv_Lesson_Listing_2_Aggregate;
  /** fetch data from the table: "published.mv_lesson_overview" */
  published_mv_lesson_overview: Array<Published_Mv_Lesson_Overview>;
  /** fetch aggregated fields from the table: "published.mv_lesson_overview" */
  published_mv_lesson_overview_aggregate: Published_Mv_Lesson_Overview_Aggregate;
  /** fetch data from the table: "published.mv_programme_listing" */
  published_mv_programme_listing: Array<Published_Mv_Programme_Listing>;
  /** fetch aggregated fields from the table: "published.mv_programme_listing" */
  published_mv_programme_listing_aggregate: Published_Mv_Programme_Listing_Aggregate;
  /** fetch data from the table: "published.mv_search_page" */
  published_mv_search_page: Array<Published_Mv_Search_Page>;
  /** fetch aggregated fields from the table: "published.mv_search_page" */
  published_mv_search_page_aggregate: Published_Mv_Search_Page_Aggregate;
  /** fetch data from the table: "published.mv_subject_listing" */
  published_mv_subject_listing: Array<Published_Mv_Subject_Listing>;
  /** fetch aggregated fields from the table: "published.mv_subject_listing" */
  published_mv_subject_listing_aggregate: Published_Mv_Subject_Listing_Aggregate;
  /** fetch data from the table: "published.mv_unit_listing_page" */
  published_mv_unit_listing_page: Array<Published_Mv_Unit_Listing_Page>;
  /** fetch aggregated fields from the table: "published.mv_unit_listing_page" */
  published_mv_unit_listing_page_aggregate: Published_Mv_Unit_Listing_Page_Aggregate;
  /** fetch data from the table: "published.viewmanager" */
  published_viewmanager: Array<Published_Viewmanager>;
  /** fetch aggregated fields from the table: "published.viewmanager" */
  published_viewmanager_aggregate: Published_Viewmanager_Aggregate;
  /** fetch data from the table: "published.viewmanager" using primary key columns */
  published_viewmanager_by_pk?: Maybe<Published_Viewmanager>;
  /** fetch data from the table: "questions" */
  questions: Array<Questions>;
  /** fetch aggregated fields from the table: "questions" */
  questions_aggregate: Questions_Aggregate;
  /** fetch data from the table: "questions" using primary key columns */
  questions_by_pk?: Maybe<Questions>;
  /** An array relationship */
  quiz_questions: Array<Quiz_Questions>;
  /** An aggregate relationship */
  quiz_questions_aggregate: Quiz_Questions_Aggregate;
  /** fetch data from the table: "quiz_questions" using primary key columns */
  quiz_questions_by_pk?: Maybe<Quiz_Questions>;
  /** fetch data from the table: "quizzes" */
  quizzes: Array<Quizzes>;
  /** fetch aggregated fields from the table: "quizzes" */
  quizzes_aggregate: Quizzes_Aggregate;
  /** fetch data from the table: "quizzes" using primary key columns */
  quizzes_by_pk?: Maybe<Quizzes>;
  /** An array relationship */
  thread_units: Array<Thread_Units>;
  /** An aggregate relationship */
  thread_units_aggregate: Thread_Units_Aggregate;
  /** fetch data from the table: "thread_units" using primary key columns */
  thread_units_by_pk?: Maybe<Thread_Units>;
  /** fetch data from the table: "threads" */
  threads: Array<Threads>;
  /** fetch aggregated fields from the table: "threads" */
  threads_aggregate: Threads_Aggregate;
  /** fetch data from the table: "threads" using primary key columns */
  threads_by_pk?: Maybe<Threads>;
  /** fetch data from the table: "units" */
  units: Array<Units>;
  /** fetch aggregated fields from the table: "units" */
  units_aggregate: Units_Aggregate;
  /** fetch data from the table: "units" using primary key columns */
  units_by_pk?: Maybe<Units>;
  /** An array relationship */
  unitvariant_lessons: Array<Unitvariant_Lessons>;
  /** An aggregate relationship */
  unitvariant_lessons_aggregate: Unitvariant_Lessons_Aggregate;
  /** fetch data from the table: "unitvariant_lessons" using primary key columns */
  unitvariant_lessons_by_pk?: Maybe<Unitvariant_Lessons>;
  /** fetch data from the table: "unitvariants" */
  unitvariants: Array<Unitvariants>;
  /** fetch aggregated fields from the table: "unitvariants" */
  unitvariants_aggregate: Unitvariants_Aggregate;
  /** fetch data from the table: "unitvariants" using primary key columns */
  unitvariants_by_pk?: Maybe<Unitvariants>;
  /** fetch data from the table: "videocaptions" */
  videocaptions: Array<Videocaptions>;
  /** fetch aggregated fields from the table: "videocaptions" */
  videocaptions_aggregate: Videocaptions_Aggregate;
  /** fetch data from the table: "videocaptions" using primary key columns */
  videocaptions_by_pk?: Maybe<Videocaptions>;
  /** fetch data from the table: "videos" */
  videos: Array<Videos>;
  /** fetch aggregated fields from the table: "videos" */
  videos_aggregate: Videos_Aggregate;
  /** fetch data from the table: "videos" using primary key columns */
  videos_by_pk?: Maybe<Videos>;
};


export type Query_RootAssetsArgs = {
  distinct_on?: InputMaybe<Array<Assets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Assets_Order_By>>;
  where?: InputMaybe<Assets_Bool_Exp>;
};


export type Query_RootAssets_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Assets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Assets_Order_By>>;
  where?: InputMaybe<Assets_Bool_Exp>;
};


export type Query_RootAssets_By_PkArgs = {
  _state: Scalars['String']['input'];
  asset_id: Scalars['Int']['input'];
};


export type Query_RootCat_ContentguidanceArgs = {
  distinct_on?: InputMaybe<Array<Cat_Contentguidance_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Contentguidance_Order_By>>;
  where?: InputMaybe<Cat_Contentguidance_Bool_Exp>;
};


export type Query_RootCat_Contentguidance_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cat_Contentguidance_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Contentguidance_Order_By>>;
  where?: InputMaybe<Cat_Contentguidance_Bool_Exp>;
};


export type Query_RootCat_Contentguidance_By_PkArgs = {
  _state: Scalars['String']['input'];
  contentguidance_id: Scalars['Int']['input'];
};


export type Query_RootCat_ExamboardspecsArgs = {
  distinct_on?: InputMaybe<Array<Cat_Examboardspecs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Examboardspecs_Order_By>>;
  where?: InputMaybe<Cat_Examboardspecs_Bool_Exp>;
};


export type Query_RootCat_Examboardspecs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cat_Examboardspecs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Examboardspecs_Order_By>>;
  where?: InputMaybe<Cat_Examboardspecs_Bool_Exp>;
};


export type Query_RootCat_Examboardspecs_By_PkArgs = {
  _state: Scalars['String']['input'];
  examboardspecs_id: Scalars['Int']['input'];
};


export type Query_RootCat_NationalcurriculumArgs = {
  distinct_on?: InputMaybe<Array<Cat_Nationalcurriculum_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Nationalcurriculum_Order_By>>;
  where?: InputMaybe<Cat_Nationalcurriculum_Bool_Exp>;
};


export type Query_RootCat_Nationalcurriculum_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cat_Nationalcurriculum_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Nationalcurriculum_Order_By>>;
  where?: InputMaybe<Cat_Nationalcurriculum_Bool_Exp>;
};


export type Query_RootCat_Nationalcurriculum_By_PkArgs = {
  _state: Scalars['String']['input'];
  nationalcurriculum_id: Scalars['Int']['input'];
};


export type Query_RootCat_SupervisionlevelsArgs = {
  distinct_on?: InputMaybe<Array<Cat_Supervisionlevels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Supervisionlevels_Order_By>>;
  where?: InputMaybe<Cat_Supervisionlevels_Bool_Exp>;
};


export type Query_RootCat_Supervisionlevels_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cat_Supervisionlevels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Supervisionlevels_Order_By>>;
  where?: InputMaybe<Cat_Supervisionlevels_Bool_Exp>;
};


export type Query_RootCat_Supervisionlevels_By_PkArgs = {
  _state: Scalars['String']['input'];
  supervisionlevel_id: Scalars['Int']['input'];
};


export type Query_RootCat_TagsArgs = {
  distinct_on?: InputMaybe<Array<Cat_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Tags_Order_By>>;
  where?: InputMaybe<Cat_Tags_Bool_Exp>;
};


export type Query_RootCat_Tags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cat_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Tags_Order_By>>;
  where?: InputMaybe<Cat_Tags_Bool_Exp>;
};


export type Query_RootCat_Tags_By_PkArgs = {
  _state: Scalars['String']['input'];
  tag_id: Scalars['Int']['input'];
};


export type Query_RootInternal_Review_LessonsArgs = {
  distinct_on?: InputMaybe<Array<Internal_Review_Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Internal_Review_Lessons_Order_By>>;
  where?: InputMaybe<Internal_Review_Lessons_Bool_Exp>;
};


export type Query_RootInternal_Review_Lessons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Internal_Review_Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Internal_Review_Lessons_Order_By>>;
  where?: InputMaybe<Internal_Review_Lessons_Bool_Exp>;
};


export type Query_RootInternal_Review_Lessons_By_PkArgs = {
  _state: Scalars['String']['input'];
  lesson_id: Scalars['Int']['input'];
};


export type Query_RootLessonsArgs = {
  distinct_on?: InputMaybe<Array<Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Lessons_Order_By>>;
  where?: InputMaybe<Lessons_Bool_Exp>;
};


export type Query_RootLessons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Lessons_Order_By>>;
  where?: InputMaybe<Lessons_Bool_Exp>;
};


export type Query_RootLessons_By_PkArgs = {
  _state: Scalars['String']['input'];
  lesson_id: Scalars['Int']['input'];
};


export type Query_RootPf_ExamboardsArgs = {
  distinct_on?: InputMaybe<Array<Pf_Examboards_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Examboards_Order_By>>;
  where?: InputMaybe<Pf_Examboards_Bool_Exp>;
};


export type Query_RootPf_Examboards_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pf_Examboards_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Examboards_Order_By>>;
  where?: InputMaybe<Pf_Examboards_Bool_Exp>;
};


export type Query_RootPf_Examboards_By_PkArgs = {
  _state: Scalars['String']['input'];
  examboard_id: Scalars['Int']['input'];
};


export type Query_RootPf_KeystagesArgs = {
  distinct_on?: InputMaybe<Array<Pf_Keystages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Keystages_Order_By>>;
  where?: InputMaybe<Pf_Keystages_Bool_Exp>;
};


export type Query_RootPf_Keystages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pf_Keystages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Keystages_Order_By>>;
  where?: InputMaybe<Pf_Keystages_Bool_Exp>;
};


export type Query_RootPf_Keystages_By_PkArgs = {
  _state: Scalars['String']['input'];
  keystage_id: Scalars['Int']['input'];
};


export type Query_RootPf_PhasesArgs = {
  distinct_on?: InputMaybe<Array<Pf_Phases_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Phases_Order_By>>;
  where?: InputMaybe<Pf_Phases_Bool_Exp>;
};


export type Query_RootPf_Phases_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pf_Phases_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Phases_Order_By>>;
  where?: InputMaybe<Pf_Phases_Bool_Exp>;
};


export type Query_RootPf_Phases_By_PkArgs = {
  _state: Scalars['String']['input'];
  phase_id: Scalars['Int']['input'];
};


export type Query_RootPf_SubjectsArgs = {
  distinct_on?: InputMaybe<Array<Pf_Subjects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Subjects_Order_By>>;
  where?: InputMaybe<Pf_Subjects_Bool_Exp>;
};


export type Query_RootPf_Subjects_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pf_Subjects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Subjects_Order_By>>;
  where?: InputMaybe<Pf_Subjects_Bool_Exp>;
};


export type Query_RootPf_Subjects_By_PkArgs = {
  _state: Scalars['String']['input'];
  subject_id: Scalars['Int']['input'];
};


export type Query_RootPf_TiersArgs = {
  distinct_on?: InputMaybe<Array<Pf_Tiers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Tiers_Order_By>>;
  where?: InputMaybe<Pf_Tiers_Bool_Exp>;
};


export type Query_RootPf_Tiers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pf_Tiers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Tiers_Order_By>>;
  where?: InputMaybe<Pf_Tiers_Bool_Exp>;
};


export type Query_RootPf_Tiers_By_PkArgs = {
  _state: Scalars['String']['input'];
  tier_id: Scalars['Int']['input'];
};


export type Query_RootPf_YearsArgs = {
  distinct_on?: InputMaybe<Array<Pf_Years_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Years_Order_By>>;
  where?: InputMaybe<Pf_Years_Bool_Exp>;
};


export type Query_RootPf_Years_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pf_Years_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Years_Order_By>>;
  where?: InputMaybe<Pf_Years_Bool_Exp>;
};


export type Query_RootPf_Years_By_PkArgs = {
  _state: Scalars['String']['input'];
  year_id: Scalars['Int']['input'];
};


export type Query_RootProgramme_ThreadsArgs = {
  distinct_on?: InputMaybe<Array<Programme_Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Threads_Order_By>>;
  where?: InputMaybe<Programme_Threads_Bool_Exp>;
};


export type Query_RootProgramme_Threads_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Programme_Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Threads_Order_By>>;
  where?: InputMaybe<Programme_Threads_Bool_Exp>;
};


export type Query_RootProgramme_Threads_By_PkArgs = {
  _state: Scalars['String']['input'];
  programme_id: Scalars['Int']['input'];
  thread_id: Scalars['Int']['input'];
};


export type Query_RootProgramme_UnitsArgs = {
  distinct_on?: InputMaybe<Array<Programme_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Units_Order_By>>;
  where?: InputMaybe<Programme_Units_Bool_Exp>;
};


export type Query_RootProgramme_Units_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Programme_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Units_Order_By>>;
  where?: InputMaybe<Programme_Units_Bool_Exp>;
};


export type Query_RootProgramme_Units_By_PkArgs = {
  _state: Scalars['String']['input'];
  programme_id: Scalars['Int']['input'];
  unit_id: Scalars['Int']['input'];
};


export type Query_RootProgrammesArgs = {
  distinct_on?: InputMaybe<Array<Programmes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programmes_Order_By>>;
  where?: InputMaybe<Programmes_Bool_Exp>;
};


export type Query_RootProgrammes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Programmes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programmes_Order_By>>;
  where?: InputMaybe<Programmes_Bool_Exp>;
};


export type Query_RootProgrammes_By_PkArgs = {
  _state: Scalars['String']['input'];
  programme_id: Scalars['Int']['input'];
};


export type Query_RootPublished_Mv_DownloadsArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Downloads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Downloads_Order_By>>;
  where?: InputMaybe<Published_Mv_Downloads_Bool_Exp>;
};


export type Query_RootPublished_Mv_Downloads_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Downloads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Downloads_Order_By>>;
  where?: InputMaybe<Published_Mv_Downloads_Bool_Exp>;
};


export type Query_RootPublished_Mv_HomepageArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Homepage_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Homepage_Order_By>>;
  where?: InputMaybe<Published_Mv_Homepage_Bool_Exp>;
};


export type Query_RootPublished_Mv_Homepage_1Args = {
  distinct_on?: InputMaybe<Array<Published_Mv_Homepage_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Homepage_1_Order_By>>;
  where?: InputMaybe<Published_Mv_Homepage_1_Bool_Exp>;
};


export type Query_RootPublished_Mv_Homepage_1_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Homepage_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Homepage_1_Order_By>>;
  where?: InputMaybe<Published_Mv_Homepage_1_Bool_Exp>;
};


export type Query_RootPublished_Mv_Homepage_2Args = {
  distinct_on?: InputMaybe<Array<Published_Mv_Homepage_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Homepage_2_Order_By>>;
  where?: InputMaybe<Published_Mv_Homepage_2_Bool_Exp>;
};


export type Query_RootPublished_Mv_Homepage_2_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Homepage_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Homepage_2_Order_By>>;
  where?: InputMaybe<Published_Mv_Homepage_2_Bool_Exp>;
};


export type Query_RootPublished_Mv_Homepage_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Homepage_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Homepage_Order_By>>;
  where?: InputMaybe<Published_Mv_Homepage_Bool_Exp>;
};


export type Query_RootPublished_Mv_Key_StagesArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Key_Stages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Key_Stages_Order_By>>;
  where?: InputMaybe<Published_Mv_Key_Stages_Bool_Exp>;
};


export type Query_RootPublished_Mv_Key_Stages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Key_Stages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Key_Stages_Order_By>>;
  where?: InputMaybe<Published_Mv_Key_Stages_Bool_Exp>;
};


export type Query_RootPublished_Mv_Lesson_Listing_1Args = {
  distinct_on?: InputMaybe<Array<Published_Mv_Lesson_Listing_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Lesson_Listing_1_Order_By>>;
  where?: InputMaybe<Published_Mv_Lesson_Listing_1_Bool_Exp>;
};


export type Query_RootPublished_Mv_Lesson_Listing_1_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Lesson_Listing_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Lesson_Listing_1_Order_By>>;
  where?: InputMaybe<Published_Mv_Lesson_Listing_1_Bool_Exp>;
};


export type Query_RootPublished_Mv_Lesson_Listing_2Args = {
  distinct_on?: InputMaybe<Array<Published_Mv_Lesson_Listing_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Lesson_Listing_2_Order_By>>;
  where?: InputMaybe<Published_Mv_Lesson_Listing_2_Bool_Exp>;
};


export type Query_RootPublished_Mv_Lesson_Listing_2_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Lesson_Listing_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Lesson_Listing_2_Order_By>>;
  where?: InputMaybe<Published_Mv_Lesson_Listing_2_Bool_Exp>;
};


export type Query_RootPublished_Mv_Lesson_OverviewArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Lesson_Overview_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Lesson_Overview_Order_By>>;
  where?: InputMaybe<Published_Mv_Lesson_Overview_Bool_Exp>;
};


export type Query_RootPublished_Mv_Lesson_Overview_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Lesson_Overview_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Lesson_Overview_Order_By>>;
  where?: InputMaybe<Published_Mv_Lesson_Overview_Bool_Exp>;
};


export type Query_RootPublished_Mv_Programme_ListingArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Programme_Listing_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Programme_Listing_Order_By>>;
  where?: InputMaybe<Published_Mv_Programme_Listing_Bool_Exp>;
};


export type Query_RootPublished_Mv_Programme_Listing_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Programme_Listing_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Programme_Listing_Order_By>>;
  where?: InputMaybe<Published_Mv_Programme_Listing_Bool_Exp>;
};


export type Query_RootPublished_Mv_Search_PageArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Search_Page_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Search_Page_Order_By>>;
  where?: InputMaybe<Published_Mv_Search_Page_Bool_Exp>;
};


export type Query_RootPublished_Mv_Search_Page_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Search_Page_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Search_Page_Order_By>>;
  where?: InputMaybe<Published_Mv_Search_Page_Bool_Exp>;
};


export type Query_RootPublished_Mv_Subject_ListingArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Subject_Listing_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Subject_Listing_Order_By>>;
  where?: InputMaybe<Published_Mv_Subject_Listing_Bool_Exp>;
};


export type Query_RootPublished_Mv_Subject_Listing_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Subject_Listing_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Subject_Listing_Order_By>>;
  where?: InputMaybe<Published_Mv_Subject_Listing_Bool_Exp>;
};


export type Query_RootPublished_Mv_Unit_Listing_PageArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Unit_Listing_Page_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Unit_Listing_Page_Order_By>>;
  where?: InputMaybe<Published_Mv_Unit_Listing_Page_Bool_Exp>;
};


export type Query_RootPublished_Mv_Unit_Listing_Page_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Unit_Listing_Page_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Unit_Listing_Page_Order_By>>;
  where?: InputMaybe<Published_Mv_Unit_Listing_Page_Bool_Exp>;
};


export type Query_RootPublished_ViewmanagerArgs = {
  distinct_on?: InputMaybe<Array<Published_Viewmanager_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Viewmanager_Order_By>>;
  where?: InputMaybe<Published_Viewmanager_Bool_Exp>;
};


export type Query_RootPublished_Viewmanager_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Viewmanager_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Viewmanager_Order_By>>;
  where?: InputMaybe<Published_Viewmanager_Bool_Exp>;
};


export type Query_RootPublished_Viewmanager_By_PkArgs = {
  viewmanager_id: Scalars['Int']['input'];
};


export type Query_RootQuestionsArgs = {
  distinct_on?: InputMaybe<Array<Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Questions_Order_By>>;
  where?: InputMaybe<Questions_Bool_Exp>;
};


export type Query_RootQuestions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Questions_Order_By>>;
  where?: InputMaybe<Questions_Bool_Exp>;
};


export type Query_RootQuestions_By_PkArgs = {
  _state: Scalars['String']['input'];
  question_id: Scalars['Int']['input'];
};


export type Query_RootQuiz_QuestionsArgs = {
  distinct_on?: InputMaybe<Array<Quiz_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quiz_Questions_Order_By>>;
  where?: InputMaybe<Quiz_Questions_Bool_Exp>;
};


export type Query_RootQuiz_Questions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Quiz_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quiz_Questions_Order_By>>;
  where?: InputMaybe<Quiz_Questions_Bool_Exp>;
};


export type Query_RootQuiz_Questions_By_PkArgs = {
  _state: Scalars['String']['input'];
  question_id: Scalars['Int']['input'];
  quiz_id: Scalars['Int']['input'];
};


export type Query_RootQuizzesArgs = {
  distinct_on?: InputMaybe<Array<Quizzes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quizzes_Order_By>>;
  where?: InputMaybe<Quizzes_Bool_Exp>;
};


export type Query_RootQuizzes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Quizzes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quizzes_Order_By>>;
  where?: InputMaybe<Quizzes_Bool_Exp>;
};


export type Query_RootQuizzes_By_PkArgs = {
  _state: Scalars['String']['input'];
  quiz_id: Scalars['Int']['input'];
};


export type Query_RootThread_UnitsArgs = {
  distinct_on?: InputMaybe<Array<Thread_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Thread_Units_Order_By>>;
  where?: InputMaybe<Thread_Units_Bool_Exp>;
};


export type Query_RootThread_Units_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Thread_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Thread_Units_Order_By>>;
  where?: InputMaybe<Thread_Units_Bool_Exp>;
};


export type Query_RootThread_Units_By_PkArgs = {
  _state: Scalars['String']['input'];
  thread_id: Scalars['Int']['input'];
  unit_id: Scalars['Int']['input'];
};


export type Query_RootThreadsArgs = {
  distinct_on?: InputMaybe<Array<Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Threads_Order_By>>;
  where?: InputMaybe<Threads_Bool_Exp>;
};


export type Query_RootThreads_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Threads_Order_By>>;
  where?: InputMaybe<Threads_Bool_Exp>;
};


export type Query_RootThreads_By_PkArgs = {
  _state: Scalars['String']['input'];
  thread_id: Scalars['Int']['input'];
};


export type Query_RootUnitsArgs = {
  distinct_on?: InputMaybe<Array<Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Units_Order_By>>;
  where?: InputMaybe<Units_Bool_Exp>;
};


export type Query_RootUnits_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Units_Order_By>>;
  where?: InputMaybe<Units_Bool_Exp>;
};


export type Query_RootUnits_By_PkArgs = {
  _state: Scalars['String']['input'];
  unit_id: Scalars['Int']['input'];
};


export type Query_RootUnitvariant_LessonsArgs = {
  distinct_on?: InputMaybe<Array<Unitvariant_Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariant_Lessons_Order_By>>;
  where?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
};


export type Query_RootUnitvariant_Lessons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Unitvariant_Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariant_Lessons_Order_By>>;
  where?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
};


export type Query_RootUnitvariant_Lessons_By_PkArgs = {
  _state: Scalars['String']['input'];
  lesson_id: Scalars['Int']['input'];
  unitvariant_id: Scalars['Int']['input'];
};


export type Query_RootUnitvariantsArgs = {
  distinct_on?: InputMaybe<Array<Unitvariants_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariants_Order_By>>;
  where?: InputMaybe<Unitvariants_Bool_Exp>;
};


export type Query_RootUnitvariants_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Unitvariants_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariants_Order_By>>;
  where?: InputMaybe<Unitvariants_Bool_Exp>;
};


export type Query_RootUnitvariants_By_PkArgs = {
  _state: Scalars['String']['input'];
  unitvariant_id: Scalars['Int']['input'];
};


export type Query_RootVideocaptionsArgs = {
  distinct_on?: InputMaybe<Array<Videocaptions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Videocaptions_Order_By>>;
  where?: InputMaybe<Videocaptions_Bool_Exp>;
};


export type Query_RootVideocaptions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Videocaptions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Videocaptions_Order_By>>;
  where?: InputMaybe<Videocaptions_Bool_Exp>;
};


export type Query_RootVideocaptions_By_PkArgs = {
  _state: Scalars['String']['input'];
  caption_id: Scalars['Int']['input'];
};


export type Query_RootVideosArgs = {
  distinct_on?: InputMaybe<Array<Videos_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Videos_Order_By>>;
  where?: InputMaybe<Videos_Bool_Exp>;
};


export type Query_RootVideos_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Videos_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Videos_Order_By>>;
  where?: InputMaybe<Videos_Bool_Exp>;
};


export type Query_RootVideos_By_PkArgs = {
  _state: Scalars['String']['input'];
  video_id: Scalars['Int']['input'];
};

/** columns and relationships of "questions" */
export type Questions = {
  __typename?: 'questions';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  active: Scalars['Boolean']['output'];
  answers?: Maybe<Scalars['json']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  feedback?: Maybe<Scalars['String']['output']>;
  hint?: Maybe<Scalars['String']['output']>;
  question_id: Scalars['Int']['output'];
  question_stem?: Maybe<Scalars['json']['output']>;
  question_type: Scalars['String']['output'];
  question_uid?: Maybe<Scalars['bpchar']['output']>;
  /** An array relationship */
  quiz_questions: Array<Quiz_Questions>;
  /** An aggregate relationship */
  quiz_questions_aggregate: Quiz_Questions_Aggregate;
  /** An array relationship */
  quiz_questions_all_states: Array<Quiz_Questions>;
  /** An aggregate relationship */
  quiz_questions_all_states_aggregate: Quiz_Questions_Aggregate;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "questions" */
export type QuestionsAnswersArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "questions" */
export type QuestionsQuestion_StemArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "questions" */
export type QuestionsQuiz_QuestionsArgs = {
  distinct_on?: InputMaybe<Array<Quiz_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quiz_Questions_Order_By>>;
  where?: InputMaybe<Quiz_Questions_Bool_Exp>;
};


/** columns and relationships of "questions" */
export type QuestionsQuiz_Questions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Quiz_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quiz_Questions_Order_By>>;
  where?: InputMaybe<Quiz_Questions_Bool_Exp>;
};


/** columns and relationships of "questions" */
export type QuestionsQuiz_Questions_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Quiz_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quiz_Questions_Order_By>>;
  where?: InputMaybe<Quiz_Questions_Bool_Exp>;
};


/** columns and relationships of "questions" */
export type QuestionsQuiz_Questions_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Quiz_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quiz_Questions_Order_By>>;
  where?: InputMaybe<Quiz_Questions_Bool_Exp>;
};

/** aggregated selection of "questions" */
export type Questions_Aggregate = {
  __typename?: 'questions_aggregate';
  aggregate?: Maybe<Questions_Aggregate_Fields>;
  nodes: Array<Questions>;
};

export type Questions_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Questions_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Questions_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Questions_Aggregate_Bool_Exp_Count>;
};

export type Questions_Aggregate_Bool_Exp_Bool_And = {
  arguments: Questions_Select_Column_Questions_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Questions_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Questions_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Questions_Select_Column_Questions_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Questions_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Questions_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Questions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Questions_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "questions" */
export type Questions_Aggregate_Fields = {
  __typename?: 'questions_aggregate_fields';
  avg?: Maybe<Questions_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Questions_Max_Fields>;
  min?: Maybe<Questions_Min_Fields>;
  stddev?: Maybe<Questions_Stddev_Fields>;
  stddev_pop?: Maybe<Questions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Questions_Stddev_Samp_Fields>;
  sum?: Maybe<Questions_Sum_Fields>;
  var_pop?: Maybe<Questions_Var_Pop_Fields>;
  var_samp?: Maybe<Questions_Var_Samp_Fields>;
  variance?: Maybe<Questions_Variance_Fields>;
};


/** aggregate fields of "questions" */
export type Questions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Questions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "questions" */
export type Questions_Aggregate_Order_By = {
  avg?: InputMaybe<Questions_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Questions_Max_Order_By>;
  min?: InputMaybe<Questions_Min_Order_By>;
  stddev?: InputMaybe<Questions_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Questions_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Questions_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Questions_Sum_Order_By>;
  var_pop?: InputMaybe<Questions_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Questions_Var_Samp_Order_By>;
  variance?: InputMaybe<Questions_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "questions" */
export type Questions_Arr_Rel_Insert_Input = {
  data: Array<Questions_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Questions_On_Conflict>;
};

/** aggregate avg on columns */
export type Questions_Avg_Fields = {
  __typename?: 'questions_avg_fields';
  question_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "questions" */
export type Questions_Avg_Order_By = {
  question_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "questions". All fields are combined with a logical 'AND'. */
export type Questions_Bool_Exp = {
  _and?: InputMaybe<Array<Questions_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Questions_Bool_Exp>;
  _or?: InputMaybe<Array<Questions_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  active?: InputMaybe<Boolean_Comparison_Exp>;
  answers?: InputMaybe<Json_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  feedback?: InputMaybe<String_Comparison_Exp>;
  hint?: InputMaybe<String_Comparison_Exp>;
  question_id?: InputMaybe<Int_Comparison_Exp>;
  question_stem?: InputMaybe<Json_Comparison_Exp>;
  question_type?: InputMaybe<String_Comparison_Exp>;
  question_uid?: InputMaybe<Bpchar_Comparison_Exp>;
  quiz_questions?: InputMaybe<Quiz_Questions_Bool_Exp>;
  quiz_questions_aggregate?: InputMaybe<Quiz_Questions_Aggregate_Bool_Exp>;
  quiz_questions_all_states?: InputMaybe<Quiz_Questions_Bool_Exp>;
  quiz_questions_all_states_aggregate?: InputMaybe<Quiz_Questions_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "questions" */
export enum Questions_Constraint {
  /** unique or primary key constraint on columns "question_id", "_state" */
  QuestionsPkey = 'questions_pkey'
}

/** input type for incrementing numeric columns in table "questions" */
export type Questions_Inc_Input = {
  question_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "questions" */
export type Questions_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  answers?: InputMaybe<Scalars['json']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  feedback?: InputMaybe<Scalars['String']['input']>;
  hint?: InputMaybe<Scalars['String']['input']>;
  question_id?: InputMaybe<Scalars['Int']['input']>;
  question_stem?: InputMaybe<Scalars['json']['input']>;
  question_type?: InputMaybe<Scalars['String']['input']>;
  question_uid?: InputMaybe<Scalars['bpchar']['input']>;
  quiz_questions?: InputMaybe<Quiz_Questions_Arr_Rel_Insert_Input>;
  quiz_questions_all_states?: InputMaybe<Quiz_Questions_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Questions_Max_Fields = {
  __typename?: 'questions_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  feedback?: Maybe<Scalars['String']['output']>;
  hint?: Maybe<Scalars['String']['output']>;
  question_id?: Maybe<Scalars['Int']['output']>;
  question_type?: Maybe<Scalars['String']['output']>;
  question_uid?: Maybe<Scalars['bpchar']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "questions" */
export type Questions_Max_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  feedback?: InputMaybe<Order_By>;
  hint?: InputMaybe<Order_By>;
  question_id?: InputMaybe<Order_By>;
  question_type?: InputMaybe<Order_By>;
  question_uid?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Questions_Min_Fields = {
  __typename?: 'questions_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  feedback?: Maybe<Scalars['String']['output']>;
  hint?: Maybe<Scalars['String']['output']>;
  question_id?: Maybe<Scalars['Int']['output']>;
  question_type?: Maybe<Scalars['String']['output']>;
  question_uid?: Maybe<Scalars['bpchar']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "questions" */
export type Questions_Min_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  feedback?: InputMaybe<Order_By>;
  hint?: InputMaybe<Order_By>;
  question_id?: InputMaybe<Order_By>;
  question_type?: InputMaybe<Order_By>;
  question_uid?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "questions" */
export type Questions_Mutation_Response = {
  __typename?: 'questions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Questions>;
};

/** input type for inserting object relation for remote table "questions" */
export type Questions_Obj_Rel_Insert_Input = {
  data: Questions_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Questions_On_Conflict>;
};

/** on_conflict condition type for table "questions" */
export type Questions_On_Conflict = {
  constraint: Questions_Constraint;
  update_columns?: Array<Questions_Update_Column>;
  where?: InputMaybe<Questions_Bool_Exp>;
};

/** Ordering options when selecting data from "questions". */
export type Questions_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  active?: InputMaybe<Order_By>;
  answers?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  feedback?: InputMaybe<Order_By>;
  hint?: InputMaybe<Order_By>;
  question_id?: InputMaybe<Order_By>;
  question_stem?: InputMaybe<Order_By>;
  question_type?: InputMaybe<Order_By>;
  question_uid?: InputMaybe<Order_By>;
  quiz_questions_aggregate?: InputMaybe<Quiz_Questions_Aggregate_Order_By>;
  quiz_questions_all_states_aggregate?: InputMaybe<Quiz_Questions_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: questions */
export type Questions_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  question_id: Scalars['Int']['input'];
};

/** select columns of table "questions" */
export enum Questions_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  Active = 'active',
  /** column name */
  Answers = 'answers',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Feedback = 'feedback',
  /** column name */
  Hint = 'hint',
  /** column name */
  QuestionId = 'question_id',
  /** column name */
  QuestionStem = 'question_stem',
  /** column name */
  QuestionType = 'question_type',
  /** column name */
  QuestionUid = 'question_uid',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "questions_aggregate_bool_exp_bool_and_arguments_columns" columns of table "questions" */
export enum Questions_Select_Column_Questions_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Deleted = '_deleted',
  /** column name */
  Active = 'active'
}

/** select "questions_aggregate_bool_exp_bool_or_arguments_columns" columns of table "questions" */
export enum Questions_Select_Column_Questions_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Deleted = '_deleted',
  /** column name */
  Active = 'active'
}

/** input type for updating data in table "questions" */
export type Questions_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  answers?: InputMaybe<Scalars['json']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  feedback?: InputMaybe<Scalars['String']['input']>;
  hint?: InputMaybe<Scalars['String']['input']>;
  question_id?: InputMaybe<Scalars['Int']['input']>;
  question_stem?: InputMaybe<Scalars['json']['input']>;
  question_type?: InputMaybe<Scalars['String']['input']>;
  question_uid?: InputMaybe<Scalars['bpchar']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Questions_Stddev_Fields = {
  __typename?: 'questions_stddev_fields';
  question_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "questions" */
export type Questions_Stddev_Order_By = {
  question_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Questions_Stddev_Pop_Fields = {
  __typename?: 'questions_stddev_pop_fields';
  question_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "questions" */
export type Questions_Stddev_Pop_Order_By = {
  question_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Questions_Stddev_Samp_Fields = {
  __typename?: 'questions_stddev_samp_fields';
  question_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "questions" */
export type Questions_Stddev_Samp_Order_By = {
  question_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "questions" */
export type Questions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Questions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Questions_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  answers?: InputMaybe<Scalars['json']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  feedback?: InputMaybe<Scalars['String']['input']>;
  hint?: InputMaybe<Scalars['String']['input']>;
  question_id?: InputMaybe<Scalars['Int']['input']>;
  question_stem?: InputMaybe<Scalars['json']['input']>;
  question_type?: InputMaybe<Scalars['String']['input']>;
  question_uid?: InputMaybe<Scalars['bpchar']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Questions_Sum_Fields = {
  __typename?: 'questions_sum_fields';
  question_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "questions" */
export type Questions_Sum_Order_By = {
  question_id?: InputMaybe<Order_By>;
};

/** update columns of table "questions" */
export enum Questions_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  Active = 'active',
  /** column name */
  Answers = 'answers',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Feedback = 'feedback',
  /** column name */
  Hint = 'hint',
  /** column name */
  QuestionId = 'question_id',
  /** column name */
  QuestionStem = 'question_stem',
  /** column name */
  QuestionType = 'question_type',
  /** column name */
  QuestionUid = 'question_uid',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Questions_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Questions_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Questions_Set_Input>;
  /** filter the rows which have to be updated */
  where: Questions_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Questions_Var_Pop_Fields = {
  __typename?: 'questions_var_pop_fields';
  question_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "questions" */
export type Questions_Var_Pop_Order_By = {
  question_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Questions_Var_Samp_Fields = {
  __typename?: 'questions_var_samp_fields';
  question_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "questions" */
export type Questions_Var_Samp_Order_By = {
  question_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Questions_Variance_Fields = {
  __typename?: 'questions_variance_fields';
  question_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "questions" */
export type Questions_Variance_Order_By = {
  question_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "quiz_questions" */
export type Quiz_Questions = {
  __typename?: 'quiz_questions';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  question?: Maybe<Questions>;
  /** An array relationship */
  question_all_states: Array<Questions>;
  /** An aggregate relationship */
  question_all_states_aggregate: Questions_Aggregate;
  question_id: Scalars['Int']['output'];
  question_overrides: Scalars['jsonb']['output'];
  /** An object relationship */
  quiz?: Maybe<Quizzes>;
  /** An array relationship */
  quiz_all_states: Array<Quizzes>;
  /** An aggregate relationship */
  quiz_all_states_aggregate: Quizzes_Aggregate;
  quiz_id: Scalars['Int']['output'];
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "quiz_questions" */
export type Quiz_QuestionsQuestion_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Questions_Order_By>>;
  where?: InputMaybe<Questions_Bool_Exp>;
};


/** columns and relationships of "quiz_questions" */
export type Quiz_QuestionsQuestion_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Questions_Order_By>>;
  where?: InputMaybe<Questions_Bool_Exp>;
};


/** columns and relationships of "quiz_questions" */
export type Quiz_QuestionsQuestion_OverridesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "quiz_questions" */
export type Quiz_QuestionsQuiz_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Quizzes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quizzes_Order_By>>;
  where?: InputMaybe<Quizzes_Bool_Exp>;
};


/** columns and relationships of "quiz_questions" */
export type Quiz_QuestionsQuiz_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Quizzes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quizzes_Order_By>>;
  where?: InputMaybe<Quizzes_Bool_Exp>;
};

/** aggregated selection of "quiz_questions" */
export type Quiz_Questions_Aggregate = {
  __typename?: 'quiz_questions_aggregate';
  aggregate?: Maybe<Quiz_Questions_Aggregate_Fields>;
  nodes: Array<Quiz_Questions>;
};

export type Quiz_Questions_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Quiz_Questions_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Quiz_Questions_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Quiz_Questions_Aggregate_Bool_Exp_Count>;
};

export type Quiz_Questions_Aggregate_Bool_Exp_Bool_And = {
  arguments: Quiz_Questions_Select_Column_Quiz_Questions_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Quiz_Questions_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Quiz_Questions_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Quiz_Questions_Select_Column_Quiz_Questions_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Quiz_Questions_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Quiz_Questions_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Quiz_Questions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Quiz_Questions_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "quiz_questions" */
export type Quiz_Questions_Aggregate_Fields = {
  __typename?: 'quiz_questions_aggregate_fields';
  avg?: Maybe<Quiz_Questions_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Quiz_Questions_Max_Fields>;
  min?: Maybe<Quiz_Questions_Min_Fields>;
  stddev?: Maybe<Quiz_Questions_Stddev_Fields>;
  stddev_pop?: Maybe<Quiz_Questions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Quiz_Questions_Stddev_Samp_Fields>;
  sum?: Maybe<Quiz_Questions_Sum_Fields>;
  var_pop?: Maybe<Quiz_Questions_Var_Pop_Fields>;
  var_samp?: Maybe<Quiz_Questions_Var_Samp_Fields>;
  variance?: Maybe<Quiz_Questions_Variance_Fields>;
};


/** aggregate fields of "quiz_questions" */
export type Quiz_Questions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Quiz_Questions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "quiz_questions" */
export type Quiz_Questions_Aggregate_Order_By = {
  avg?: InputMaybe<Quiz_Questions_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Quiz_Questions_Max_Order_By>;
  min?: InputMaybe<Quiz_Questions_Min_Order_By>;
  stddev?: InputMaybe<Quiz_Questions_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Quiz_Questions_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Quiz_Questions_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Quiz_Questions_Sum_Order_By>;
  var_pop?: InputMaybe<Quiz_Questions_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Quiz_Questions_Var_Samp_Order_By>;
  variance?: InputMaybe<Quiz_Questions_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Quiz_Questions_Append_Input = {
  question_overrides?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "quiz_questions" */
export type Quiz_Questions_Arr_Rel_Insert_Input = {
  data: Array<Quiz_Questions_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Quiz_Questions_On_Conflict>;
};

/** aggregate avg on columns */
export type Quiz_Questions_Avg_Fields = {
  __typename?: 'quiz_questions_avg_fields';
  order?: Maybe<Scalars['Float']['output']>;
  question_id?: Maybe<Scalars['Float']['output']>;
  quiz_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "quiz_questions" */
export type Quiz_Questions_Avg_Order_By = {
  order?: InputMaybe<Order_By>;
  question_id?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "quiz_questions". All fields are combined with a logical 'AND'. */
export type Quiz_Questions_Bool_Exp = {
  _and?: InputMaybe<Array<Quiz_Questions_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Quiz_Questions_Bool_Exp>;
  _or?: InputMaybe<Array<Quiz_Questions_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  order?: InputMaybe<Int_Comparison_Exp>;
  question?: InputMaybe<Questions_Bool_Exp>;
  question_all_states?: InputMaybe<Questions_Bool_Exp>;
  question_all_states_aggregate?: InputMaybe<Questions_Aggregate_Bool_Exp>;
  question_id?: InputMaybe<Int_Comparison_Exp>;
  question_overrides?: InputMaybe<Jsonb_Comparison_Exp>;
  quiz?: InputMaybe<Quizzes_Bool_Exp>;
  quiz_all_states?: InputMaybe<Quizzes_Bool_Exp>;
  quiz_all_states_aggregate?: InputMaybe<Quizzes_Aggregate_Bool_Exp>;
  quiz_id?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "quiz_questions" */
export enum Quiz_Questions_Constraint {
  /** unique or primary key constraint on columns "question_id", "quiz_id", "_state" */
  QuizQuestionsPkey = 'quiz_questions_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Quiz_Questions_Delete_At_Path_Input = {
  question_overrides?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Quiz_Questions_Delete_Elem_Input = {
  question_overrides?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Quiz_Questions_Delete_Key_Input = {
  question_overrides?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "quiz_questions" */
export type Quiz_Questions_Inc_Input = {
  order?: InputMaybe<Scalars['Int']['input']>;
  question_id?: InputMaybe<Scalars['Int']['input']>;
  quiz_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "quiz_questions" */
export type Quiz_Questions_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  question?: InputMaybe<Questions_Obj_Rel_Insert_Input>;
  question_all_states?: InputMaybe<Questions_Arr_Rel_Insert_Input>;
  question_id?: InputMaybe<Scalars['Int']['input']>;
  question_overrides?: InputMaybe<Scalars['jsonb']['input']>;
  quiz?: InputMaybe<Quizzes_Obj_Rel_Insert_Input>;
  quiz_all_states?: InputMaybe<Quizzes_Arr_Rel_Insert_Input>;
  quiz_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Quiz_Questions_Max_Fields = {
  __typename?: 'quiz_questions_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  question_id?: Maybe<Scalars['Int']['output']>;
  quiz_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "quiz_questions" */
export type Quiz_Questions_Max_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  question_id?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Quiz_Questions_Min_Fields = {
  __typename?: 'quiz_questions_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  question_id?: Maybe<Scalars['Int']['output']>;
  quiz_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "quiz_questions" */
export type Quiz_Questions_Min_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  question_id?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "quiz_questions" */
export type Quiz_Questions_Mutation_Response = {
  __typename?: 'quiz_questions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Quiz_Questions>;
};

/** on_conflict condition type for table "quiz_questions" */
export type Quiz_Questions_On_Conflict = {
  constraint: Quiz_Questions_Constraint;
  update_columns?: Array<Quiz_Questions_Update_Column>;
  where?: InputMaybe<Quiz_Questions_Bool_Exp>;
};

/** Ordering options when selecting data from "quiz_questions". */
export type Quiz_Questions_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  question?: InputMaybe<Questions_Order_By>;
  question_all_states_aggregate?: InputMaybe<Questions_Aggregate_Order_By>;
  question_id?: InputMaybe<Order_By>;
  question_overrides?: InputMaybe<Order_By>;
  quiz?: InputMaybe<Quizzes_Order_By>;
  quiz_all_states_aggregate?: InputMaybe<Quizzes_Aggregate_Order_By>;
  quiz_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: quiz_questions */
export type Quiz_Questions_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  question_id: Scalars['Int']['input'];
  quiz_id: Scalars['Int']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Quiz_Questions_Prepend_Input = {
  question_overrides?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "quiz_questions" */
export enum Quiz_Questions_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Order = 'order',
  /** column name */
  QuestionId = 'question_id',
  /** column name */
  QuestionOverrides = 'question_overrides',
  /** column name */
  QuizId = 'quiz_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "quiz_questions_aggregate_bool_exp_bool_and_arguments_columns" columns of table "quiz_questions" */
export enum Quiz_Questions_Select_Column_Quiz_Questions_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** select "quiz_questions_aggregate_bool_exp_bool_or_arguments_columns" columns of table "quiz_questions" */
export enum Quiz_Questions_Select_Column_Quiz_Questions_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** input type for updating data in table "quiz_questions" */
export type Quiz_Questions_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  question_id?: InputMaybe<Scalars['Int']['input']>;
  question_overrides?: InputMaybe<Scalars['jsonb']['input']>;
  quiz_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Quiz_Questions_Stddev_Fields = {
  __typename?: 'quiz_questions_stddev_fields';
  order?: Maybe<Scalars['Float']['output']>;
  question_id?: Maybe<Scalars['Float']['output']>;
  quiz_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "quiz_questions" */
export type Quiz_Questions_Stddev_Order_By = {
  order?: InputMaybe<Order_By>;
  question_id?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Quiz_Questions_Stddev_Pop_Fields = {
  __typename?: 'quiz_questions_stddev_pop_fields';
  order?: Maybe<Scalars['Float']['output']>;
  question_id?: Maybe<Scalars['Float']['output']>;
  quiz_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "quiz_questions" */
export type Quiz_Questions_Stddev_Pop_Order_By = {
  order?: InputMaybe<Order_By>;
  question_id?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Quiz_Questions_Stddev_Samp_Fields = {
  __typename?: 'quiz_questions_stddev_samp_fields';
  order?: Maybe<Scalars['Float']['output']>;
  question_id?: Maybe<Scalars['Float']['output']>;
  quiz_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "quiz_questions" */
export type Quiz_Questions_Stddev_Samp_Order_By = {
  order?: InputMaybe<Order_By>;
  question_id?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "quiz_questions" */
export type Quiz_Questions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Quiz_Questions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Quiz_Questions_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  question_id?: InputMaybe<Scalars['Int']['input']>;
  question_overrides?: InputMaybe<Scalars['jsonb']['input']>;
  quiz_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Quiz_Questions_Sum_Fields = {
  __typename?: 'quiz_questions_sum_fields';
  order?: Maybe<Scalars['Int']['output']>;
  question_id?: Maybe<Scalars['Int']['output']>;
  quiz_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "quiz_questions" */
export type Quiz_Questions_Sum_Order_By = {
  order?: InputMaybe<Order_By>;
  question_id?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
};

/** update columns of table "quiz_questions" */
export enum Quiz_Questions_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Order = 'order',
  /** column name */
  QuestionId = 'question_id',
  /** column name */
  QuestionOverrides = 'question_overrides',
  /** column name */
  QuizId = 'quiz_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Quiz_Questions_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Quiz_Questions_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Quiz_Questions_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Quiz_Questions_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Quiz_Questions_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Quiz_Questions_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Quiz_Questions_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Quiz_Questions_Set_Input>;
  /** filter the rows which have to be updated */
  where: Quiz_Questions_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Quiz_Questions_Var_Pop_Fields = {
  __typename?: 'quiz_questions_var_pop_fields';
  order?: Maybe<Scalars['Float']['output']>;
  question_id?: Maybe<Scalars['Float']['output']>;
  quiz_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "quiz_questions" */
export type Quiz_Questions_Var_Pop_Order_By = {
  order?: InputMaybe<Order_By>;
  question_id?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Quiz_Questions_Var_Samp_Fields = {
  __typename?: 'quiz_questions_var_samp_fields';
  order?: Maybe<Scalars['Float']['output']>;
  question_id?: Maybe<Scalars['Float']['output']>;
  quiz_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "quiz_questions" */
export type Quiz_Questions_Var_Samp_Order_By = {
  order?: InputMaybe<Order_By>;
  question_id?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Quiz_Questions_Variance_Fields = {
  __typename?: 'quiz_questions_variance_fields';
  order?: Maybe<Scalars['Float']['output']>;
  question_id?: Maybe<Scalars['Float']['output']>;
  quiz_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "quiz_questions" */
export type Quiz_Questions_Variance_Order_By = {
  order?: InputMaybe<Order_By>;
  question_id?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "quizzes" */
export type Quizzes = {
  __typename?: 'quizzes';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  quiz_id: Scalars['Int']['output'];
  /** An array relationship */
  quiz_questions: Array<Quiz_Questions>;
  /** An aggregate relationship */
  quiz_questions_aggregate: Quiz_Questions_Aggregate;
  /** An array relationship */
  quiz_questions_all_states: Array<Quiz_Questions>;
  /** An aggregate relationship */
  quiz_questions_all_states_aggregate: Quiz_Questions_Aggregate;
  quiz_uid?: Maybe<Scalars['bpchar']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "quizzes" */
export type QuizzesQuiz_QuestionsArgs = {
  distinct_on?: InputMaybe<Array<Quiz_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quiz_Questions_Order_By>>;
  where?: InputMaybe<Quiz_Questions_Bool_Exp>;
};


/** columns and relationships of "quizzes" */
export type QuizzesQuiz_Questions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Quiz_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quiz_Questions_Order_By>>;
  where?: InputMaybe<Quiz_Questions_Bool_Exp>;
};


/** columns and relationships of "quizzes" */
export type QuizzesQuiz_Questions_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Quiz_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quiz_Questions_Order_By>>;
  where?: InputMaybe<Quiz_Questions_Bool_Exp>;
};


/** columns and relationships of "quizzes" */
export type QuizzesQuiz_Questions_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Quiz_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quiz_Questions_Order_By>>;
  where?: InputMaybe<Quiz_Questions_Bool_Exp>;
};

/** aggregated selection of "quizzes" */
export type Quizzes_Aggregate = {
  __typename?: 'quizzes_aggregate';
  aggregate?: Maybe<Quizzes_Aggregate_Fields>;
  nodes: Array<Quizzes>;
};

export type Quizzes_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Quizzes_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Quizzes_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Quizzes_Aggregate_Bool_Exp_Count>;
};

export type Quizzes_Aggregate_Bool_Exp_Bool_And = {
  arguments: Quizzes_Select_Column_Quizzes_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Quizzes_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Quizzes_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Quizzes_Select_Column_Quizzes_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Quizzes_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Quizzes_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Quizzes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Quizzes_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "quizzes" */
export type Quizzes_Aggregate_Fields = {
  __typename?: 'quizzes_aggregate_fields';
  avg?: Maybe<Quizzes_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Quizzes_Max_Fields>;
  min?: Maybe<Quizzes_Min_Fields>;
  stddev?: Maybe<Quizzes_Stddev_Fields>;
  stddev_pop?: Maybe<Quizzes_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Quizzes_Stddev_Samp_Fields>;
  sum?: Maybe<Quizzes_Sum_Fields>;
  var_pop?: Maybe<Quizzes_Var_Pop_Fields>;
  var_samp?: Maybe<Quizzes_Var_Samp_Fields>;
  variance?: Maybe<Quizzes_Variance_Fields>;
};


/** aggregate fields of "quizzes" */
export type Quizzes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Quizzes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "quizzes" */
export type Quizzes_Aggregate_Order_By = {
  avg?: InputMaybe<Quizzes_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Quizzes_Max_Order_By>;
  min?: InputMaybe<Quizzes_Min_Order_By>;
  stddev?: InputMaybe<Quizzes_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Quizzes_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Quizzes_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Quizzes_Sum_Order_By>;
  var_pop?: InputMaybe<Quizzes_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Quizzes_Var_Samp_Order_By>;
  variance?: InputMaybe<Quizzes_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "quizzes" */
export type Quizzes_Arr_Rel_Insert_Input = {
  data: Array<Quizzes_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Quizzes_On_Conflict>;
};

/** aggregate avg on columns */
export type Quizzes_Avg_Fields = {
  __typename?: 'quizzes_avg_fields';
  quiz_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "quizzes" */
export type Quizzes_Avg_Order_By = {
  quiz_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "quizzes". All fields are combined with a logical 'AND'. */
export type Quizzes_Bool_Exp = {
  _and?: InputMaybe<Array<Quizzes_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Quizzes_Bool_Exp>;
  _or?: InputMaybe<Array<Quizzes_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  quiz_id?: InputMaybe<Int_Comparison_Exp>;
  quiz_questions?: InputMaybe<Quiz_Questions_Bool_Exp>;
  quiz_questions_aggregate?: InputMaybe<Quiz_Questions_Aggregate_Bool_Exp>;
  quiz_questions_all_states?: InputMaybe<Quiz_Questions_Bool_Exp>;
  quiz_questions_all_states_aggregate?: InputMaybe<Quiz_Questions_Aggregate_Bool_Exp>;
  quiz_uid?: InputMaybe<Bpchar_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "quizzes" */
export enum Quizzes_Constraint {
  /** unique or primary key constraint on columns "quiz_id", "_state" */
  QuizzesPkey = 'quizzes_pkey'
}

/** input type for incrementing numeric columns in table "quizzes" */
export type Quizzes_Inc_Input = {
  quiz_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "quizzes" */
export type Quizzes_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  quiz_id?: InputMaybe<Scalars['Int']['input']>;
  quiz_questions?: InputMaybe<Quiz_Questions_Arr_Rel_Insert_Input>;
  quiz_questions_all_states?: InputMaybe<Quiz_Questions_Arr_Rel_Insert_Input>;
  quiz_uid?: InputMaybe<Scalars['bpchar']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Quizzes_Max_Fields = {
  __typename?: 'quizzes_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  quiz_id?: Maybe<Scalars['Int']['output']>;
  quiz_uid?: Maybe<Scalars['bpchar']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "quizzes" */
export type Quizzes_Max_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
  quiz_uid?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Quizzes_Min_Fields = {
  __typename?: 'quizzes_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  quiz_id?: Maybe<Scalars['Int']['output']>;
  quiz_uid?: Maybe<Scalars['bpchar']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "quizzes" */
export type Quizzes_Min_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
  quiz_uid?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "quizzes" */
export type Quizzes_Mutation_Response = {
  __typename?: 'quizzes_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Quizzes>;
};

/** input type for inserting object relation for remote table "quizzes" */
export type Quizzes_Obj_Rel_Insert_Input = {
  data: Quizzes_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Quizzes_On_Conflict>;
};

/** on_conflict condition type for table "quizzes" */
export type Quizzes_On_Conflict = {
  constraint: Quizzes_Constraint;
  update_columns?: Array<Quizzes_Update_Column>;
  where?: InputMaybe<Quizzes_Bool_Exp>;
};

/** Ordering options when selecting data from "quizzes". */
export type Quizzes_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
  quiz_questions_aggregate?: InputMaybe<Quiz_Questions_Aggregate_Order_By>;
  quiz_questions_all_states_aggregate?: InputMaybe<Quiz_Questions_Aggregate_Order_By>;
  quiz_uid?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: quizzes */
export type Quizzes_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  quiz_id: Scalars['Int']['input'];
};

/** select columns of table "quizzes" */
export enum Quizzes_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  QuizId = 'quiz_id',
  /** column name */
  QuizUid = 'quiz_uid',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "quizzes_aggregate_bool_exp_bool_and_arguments_columns" columns of table "quizzes" */
export enum Quizzes_Select_Column_Quizzes_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** select "quizzes_aggregate_bool_exp_bool_or_arguments_columns" columns of table "quizzes" */
export enum Quizzes_Select_Column_Quizzes_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** input type for updating data in table "quizzes" */
export type Quizzes_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  quiz_id?: InputMaybe<Scalars['Int']['input']>;
  quiz_uid?: InputMaybe<Scalars['bpchar']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Quizzes_Stddev_Fields = {
  __typename?: 'quizzes_stddev_fields';
  quiz_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "quizzes" */
export type Quizzes_Stddev_Order_By = {
  quiz_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Quizzes_Stddev_Pop_Fields = {
  __typename?: 'quizzes_stddev_pop_fields';
  quiz_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "quizzes" */
export type Quizzes_Stddev_Pop_Order_By = {
  quiz_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Quizzes_Stddev_Samp_Fields = {
  __typename?: 'quizzes_stddev_samp_fields';
  quiz_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "quizzes" */
export type Quizzes_Stddev_Samp_Order_By = {
  quiz_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "quizzes" */
export type Quizzes_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Quizzes_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Quizzes_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  quiz_id?: InputMaybe<Scalars['Int']['input']>;
  quiz_uid?: InputMaybe<Scalars['bpchar']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Quizzes_Sum_Fields = {
  __typename?: 'quizzes_sum_fields';
  quiz_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "quizzes" */
export type Quizzes_Sum_Order_By = {
  quiz_id?: InputMaybe<Order_By>;
};

/** update columns of table "quizzes" */
export enum Quizzes_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  QuizId = 'quiz_id',
  /** column name */
  QuizUid = 'quiz_uid',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Quizzes_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Quizzes_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Quizzes_Set_Input>;
  /** filter the rows which have to be updated */
  where: Quizzes_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Quizzes_Var_Pop_Fields = {
  __typename?: 'quizzes_var_pop_fields';
  quiz_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "quizzes" */
export type Quizzes_Var_Pop_Order_By = {
  quiz_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Quizzes_Var_Samp_Fields = {
  __typename?: 'quizzes_var_samp_fields';
  quiz_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "quizzes" */
export type Quizzes_Var_Samp_Order_By = {
  quiz_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Quizzes_Variance_Fields = {
  __typename?: 'quizzes_variance_fields';
  quiz_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "quizzes" */
export type Quizzes_Variance_Order_By = {
  quiz_id?: InputMaybe<Order_By>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "assets" */
  assets: Array<Assets>;
  /** fetch aggregated fields from the table: "assets" */
  assets_aggregate: Assets_Aggregate;
  /** fetch data from the table: "assets" using primary key columns */
  assets_by_pk?: Maybe<Assets>;
  /** fetch data from the table in a streaming manner: "assets" */
  assets_stream: Array<Assets>;
  /** fetch data from the table: "cat_contentguidance" */
  cat_contentguidance: Array<Cat_Contentguidance>;
  /** fetch aggregated fields from the table: "cat_contentguidance" */
  cat_contentguidance_aggregate: Cat_Contentguidance_Aggregate;
  /** fetch data from the table: "cat_contentguidance" using primary key columns */
  cat_contentguidance_by_pk?: Maybe<Cat_Contentguidance>;
  /** fetch data from the table in a streaming manner: "cat_contentguidance" */
  cat_contentguidance_stream: Array<Cat_Contentguidance>;
  /** fetch data from the table: "cat_examboardspecs" */
  cat_examboardspecs: Array<Cat_Examboardspecs>;
  /** fetch aggregated fields from the table: "cat_examboardspecs" */
  cat_examboardspecs_aggregate: Cat_Examboardspecs_Aggregate;
  /** fetch data from the table: "cat_examboardspecs" using primary key columns */
  cat_examboardspecs_by_pk?: Maybe<Cat_Examboardspecs>;
  /** fetch data from the table in a streaming manner: "cat_examboardspecs" */
  cat_examboardspecs_stream: Array<Cat_Examboardspecs>;
  /** fetch data from the table: "cat_nationalcurriculum" */
  cat_nationalcurriculum: Array<Cat_Nationalcurriculum>;
  /** fetch aggregated fields from the table: "cat_nationalcurriculum" */
  cat_nationalcurriculum_aggregate: Cat_Nationalcurriculum_Aggregate;
  /** fetch data from the table: "cat_nationalcurriculum" using primary key columns */
  cat_nationalcurriculum_by_pk?: Maybe<Cat_Nationalcurriculum>;
  /** fetch data from the table in a streaming manner: "cat_nationalcurriculum" */
  cat_nationalcurriculum_stream: Array<Cat_Nationalcurriculum>;
  /** fetch data from the table: "cat_supervisionlevels" */
  cat_supervisionlevels: Array<Cat_Supervisionlevels>;
  /** fetch aggregated fields from the table: "cat_supervisionlevels" */
  cat_supervisionlevels_aggregate: Cat_Supervisionlevels_Aggregate;
  /** fetch data from the table: "cat_supervisionlevels" using primary key columns */
  cat_supervisionlevels_by_pk?: Maybe<Cat_Supervisionlevels>;
  /** fetch data from the table in a streaming manner: "cat_supervisionlevels" */
  cat_supervisionlevels_stream: Array<Cat_Supervisionlevels>;
  /** fetch data from the table: "cat_tags" */
  cat_tags: Array<Cat_Tags>;
  /** fetch aggregated fields from the table: "cat_tags" */
  cat_tags_aggregate: Cat_Tags_Aggregate;
  /** fetch data from the table: "cat_tags" using primary key columns */
  cat_tags_by_pk?: Maybe<Cat_Tags>;
  /** fetch data from the table in a streaming manner: "cat_tags" */
  cat_tags_stream: Array<Cat_Tags>;
  /** fetch data from the table: "internal.review_lessons" */
  internal_review_lessons: Array<Internal_Review_Lessons>;
  /** fetch aggregated fields from the table: "internal.review_lessons" */
  internal_review_lessons_aggregate: Internal_Review_Lessons_Aggregate;
  /** fetch data from the table: "internal.review_lessons" using primary key columns */
  internal_review_lessons_by_pk?: Maybe<Internal_Review_Lessons>;
  /** fetch data from the table in a streaming manner: "internal.review_lessons" */
  internal_review_lessons_stream: Array<Internal_Review_Lessons>;
  /** fetch data from the table: "lessons" */
  lessons: Array<Lessons>;
  /** fetch aggregated fields from the table: "lessons" */
  lessons_aggregate: Lessons_Aggregate;
  /** fetch data from the table: "lessons" using primary key columns */
  lessons_by_pk?: Maybe<Lessons>;
  /** fetch data from the table in a streaming manner: "lessons" */
  lessons_stream: Array<Lessons>;
  /** fetch data from the table: "pf_examboards" */
  pf_examboards: Array<Pf_Examboards>;
  /** fetch aggregated fields from the table: "pf_examboards" */
  pf_examboards_aggregate: Pf_Examboards_Aggregate;
  /** fetch data from the table: "pf_examboards" using primary key columns */
  pf_examboards_by_pk?: Maybe<Pf_Examboards>;
  /** fetch data from the table in a streaming manner: "pf_examboards" */
  pf_examboards_stream: Array<Pf_Examboards>;
  /** fetch data from the table: "pf_keystages" */
  pf_keystages: Array<Pf_Keystages>;
  /** fetch aggregated fields from the table: "pf_keystages" */
  pf_keystages_aggregate: Pf_Keystages_Aggregate;
  /** fetch data from the table: "pf_keystages" using primary key columns */
  pf_keystages_by_pk?: Maybe<Pf_Keystages>;
  /** fetch data from the table in a streaming manner: "pf_keystages" */
  pf_keystages_stream: Array<Pf_Keystages>;
  /** fetch data from the table: "pf_phases" */
  pf_phases: Array<Pf_Phases>;
  /** fetch aggregated fields from the table: "pf_phases" */
  pf_phases_aggregate: Pf_Phases_Aggregate;
  /** fetch data from the table: "pf_phases" using primary key columns */
  pf_phases_by_pk?: Maybe<Pf_Phases>;
  /** fetch data from the table in a streaming manner: "pf_phases" */
  pf_phases_stream: Array<Pf_Phases>;
  /** fetch data from the table: "pf_subjects" */
  pf_subjects: Array<Pf_Subjects>;
  /** fetch aggregated fields from the table: "pf_subjects" */
  pf_subjects_aggregate: Pf_Subjects_Aggregate;
  /** fetch data from the table: "pf_subjects" using primary key columns */
  pf_subjects_by_pk?: Maybe<Pf_Subjects>;
  /** fetch data from the table in a streaming manner: "pf_subjects" */
  pf_subjects_stream: Array<Pf_Subjects>;
  /** fetch data from the table: "pf_tiers" */
  pf_tiers: Array<Pf_Tiers>;
  /** fetch aggregated fields from the table: "pf_tiers" */
  pf_tiers_aggregate: Pf_Tiers_Aggregate;
  /** fetch data from the table: "pf_tiers" using primary key columns */
  pf_tiers_by_pk?: Maybe<Pf_Tiers>;
  /** fetch data from the table in a streaming manner: "pf_tiers" */
  pf_tiers_stream: Array<Pf_Tiers>;
  /** fetch data from the table: "pf_years" */
  pf_years: Array<Pf_Years>;
  /** fetch aggregated fields from the table: "pf_years" */
  pf_years_aggregate: Pf_Years_Aggregate;
  /** fetch data from the table: "pf_years" using primary key columns */
  pf_years_by_pk?: Maybe<Pf_Years>;
  /** fetch data from the table in a streaming manner: "pf_years" */
  pf_years_stream: Array<Pf_Years>;
  /** An array relationship */
  programme_threads: Array<Programme_Threads>;
  /** An aggregate relationship */
  programme_threads_aggregate: Programme_Threads_Aggregate;
  /** fetch data from the table: "programme_threads" using primary key columns */
  programme_threads_by_pk?: Maybe<Programme_Threads>;
  /** fetch data from the table in a streaming manner: "programme_threads" */
  programme_threads_stream: Array<Programme_Threads>;
  /** An array relationship */
  programme_units: Array<Programme_Units>;
  /** An aggregate relationship */
  programme_units_aggregate: Programme_Units_Aggregate;
  /** fetch data from the table: "programme_units" using primary key columns */
  programme_units_by_pk?: Maybe<Programme_Units>;
  /** fetch data from the table in a streaming manner: "programme_units" */
  programme_units_stream: Array<Programme_Units>;
  /** fetch data from the table: "programmes" */
  programmes: Array<Programmes>;
  /** fetch aggregated fields from the table: "programmes" */
  programmes_aggregate: Programmes_Aggregate;
  /** fetch data from the table: "programmes" using primary key columns */
  programmes_by_pk?: Maybe<Programmes>;
  /** fetch data from the table in a streaming manner: "programmes" */
  programmes_stream: Array<Programmes>;
  /** fetch data from the table: "published.mv_downloads" */
  published_mv_downloads: Array<Published_Mv_Downloads>;
  /** fetch aggregated fields from the table: "published.mv_downloads" */
  published_mv_downloads_aggregate: Published_Mv_Downloads_Aggregate;
  /** fetch data from the table in a streaming manner: "published.mv_downloads" */
  published_mv_downloads_stream: Array<Published_Mv_Downloads>;
  /** fetch data from the table: "published.mv_homepage" */
  published_mv_homepage: Array<Published_Mv_Homepage>;
  /** fetch data from the table: "published.mv_homepage_1" */
  published_mv_homepage_1: Array<Published_Mv_Homepage_1>;
  /** fetch aggregated fields from the table: "published.mv_homepage_1" */
  published_mv_homepage_1_aggregate: Published_Mv_Homepage_1_Aggregate;
  /** fetch data from the table in a streaming manner: "published.mv_homepage_1" */
  published_mv_homepage_1_stream: Array<Published_Mv_Homepage_1>;
  /** fetch data from the table: "published.mv_homepage_2" */
  published_mv_homepage_2: Array<Published_Mv_Homepage_2>;
  /** fetch aggregated fields from the table: "published.mv_homepage_2" */
  published_mv_homepage_2_aggregate: Published_Mv_Homepage_2_Aggregate;
  /** fetch data from the table in a streaming manner: "published.mv_homepage_2" */
  published_mv_homepage_2_stream: Array<Published_Mv_Homepage_2>;
  /** fetch aggregated fields from the table: "published.mv_homepage" */
  published_mv_homepage_aggregate: Published_Mv_Homepage_Aggregate;
  /** fetch data from the table in a streaming manner: "published.mv_homepage" */
  published_mv_homepage_stream: Array<Published_Mv_Homepage>;
  /** fetch data from the table: "published.mv_key_stages" */
  published_mv_key_stages: Array<Published_Mv_Key_Stages>;
  /** fetch aggregated fields from the table: "published.mv_key_stages" */
  published_mv_key_stages_aggregate: Published_Mv_Key_Stages_Aggregate;
  /** fetch data from the table in a streaming manner: "published.mv_key_stages" */
  published_mv_key_stages_stream: Array<Published_Mv_Key_Stages>;
  /** fetch data from the table: "published.mv_lesson_listing_1" */
  published_mv_lesson_listing_1: Array<Published_Mv_Lesson_Listing_1>;
  /** fetch aggregated fields from the table: "published.mv_lesson_listing_1" */
  published_mv_lesson_listing_1_aggregate: Published_Mv_Lesson_Listing_1_Aggregate;
  /** fetch data from the table in a streaming manner: "published.mv_lesson_listing_1" */
  published_mv_lesson_listing_1_stream: Array<Published_Mv_Lesson_Listing_1>;
  /** fetch data from the table: "published.mv_lesson_listing_2" */
  published_mv_lesson_listing_2: Array<Published_Mv_Lesson_Listing_2>;
  /** fetch aggregated fields from the table: "published.mv_lesson_listing_2" */
  published_mv_lesson_listing_2_aggregate: Published_Mv_Lesson_Listing_2_Aggregate;
  /** fetch data from the table in a streaming manner: "published.mv_lesson_listing_2" */
  published_mv_lesson_listing_2_stream: Array<Published_Mv_Lesson_Listing_2>;
  /** fetch data from the table: "published.mv_lesson_overview" */
  published_mv_lesson_overview: Array<Published_Mv_Lesson_Overview>;
  /** fetch aggregated fields from the table: "published.mv_lesson_overview" */
  published_mv_lesson_overview_aggregate: Published_Mv_Lesson_Overview_Aggregate;
  /** fetch data from the table in a streaming manner: "published.mv_lesson_overview" */
  published_mv_lesson_overview_stream: Array<Published_Mv_Lesson_Overview>;
  /** fetch data from the table: "published.mv_programme_listing" */
  published_mv_programme_listing: Array<Published_Mv_Programme_Listing>;
  /** fetch aggregated fields from the table: "published.mv_programme_listing" */
  published_mv_programme_listing_aggregate: Published_Mv_Programme_Listing_Aggregate;
  /** fetch data from the table in a streaming manner: "published.mv_programme_listing" */
  published_mv_programme_listing_stream: Array<Published_Mv_Programme_Listing>;
  /** fetch data from the table: "published.mv_search_page" */
  published_mv_search_page: Array<Published_Mv_Search_Page>;
  /** fetch aggregated fields from the table: "published.mv_search_page" */
  published_mv_search_page_aggregate: Published_Mv_Search_Page_Aggregate;
  /** fetch data from the table in a streaming manner: "published.mv_search_page" */
  published_mv_search_page_stream: Array<Published_Mv_Search_Page>;
  /** fetch data from the table: "published.mv_subject_listing" */
  published_mv_subject_listing: Array<Published_Mv_Subject_Listing>;
  /** fetch aggregated fields from the table: "published.mv_subject_listing" */
  published_mv_subject_listing_aggregate: Published_Mv_Subject_Listing_Aggregate;
  /** fetch data from the table in a streaming manner: "published.mv_subject_listing" */
  published_mv_subject_listing_stream: Array<Published_Mv_Subject_Listing>;
  /** fetch data from the table: "published.mv_unit_listing_page" */
  published_mv_unit_listing_page: Array<Published_Mv_Unit_Listing_Page>;
  /** fetch aggregated fields from the table: "published.mv_unit_listing_page" */
  published_mv_unit_listing_page_aggregate: Published_Mv_Unit_Listing_Page_Aggregate;
  /** fetch data from the table in a streaming manner: "published.mv_unit_listing_page" */
  published_mv_unit_listing_page_stream: Array<Published_Mv_Unit_Listing_Page>;
  /** fetch data from the table: "published.viewmanager" */
  published_viewmanager: Array<Published_Viewmanager>;
  /** fetch aggregated fields from the table: "published.viewmanager" */
  published_viewmanager_aggregate: Published_Viewmanager_Aggregate;
  /** fetch data from the table: "published.viewmanager" using primary key columns */
  published_viewmanager_by_pk?: Maybe<Published_Viewmanager>;
  /** fetch data from the table in a streaming manner: "published.viewmanager" */
  published_viewmanager_stream: Array<Published_Viewmanager>;
  /** fetch data from the table: "questions" */
  questions: Array<Questions>;
  /** fetch aggregated fields from the table: "questions" */
  questions_aggregate: Questions_Aggregate;
  /** fetch data from the table: "questions" using primary key columns */
  questions_by_pk?: Maybe<Questions>;
  /** fetch data from the table in a streaming manner: "questions" */
  questions_stream: Array<Questions>;
  /** An array relationship */
  quiz_questions: Array<Quiz_Questions>;
  /** An aggregate relationship */
  quiz_questions_aggregate: Quiz_Questions_Aggregate;
  /** fetch data from the table: "quiz_questions" using primary key columns */
  quiz_questions_by_pk?: Maybe<Quiz_Questions>;
  /** fetch data from the table in a streaming manner: "quiz_questions" */
  quiz_questions_stream: Array<Quiz_Questions>;
  /** fetch data from the table: "quizzes" */
  quizzes: Array<Quizzes>;
  /** fetch aggregated fields from the table: "quizzes" */
  quizzes_aggregate: Quizzes_Aggregate;
  /** fetch data from the table: "quizzes" using primary key columns */
  quizzes_by_pk?: Maybe<Quizzes>;
  /** fetch data from the table in a streaming manner: "quizzes" */
  quizzes_stream: Array<Quizzes>;
  /** An array relationship */
  thread_units: Array<Thread_Units>;
  /** An aggregate relationship */
  thread_units_aggregate: Thread_Units_Aggregate;
  /** fetch data from the table: "thread_units" using primary key columns */
  thread_units_by_pk?: Maybe<Thread_Units>;
  /** fetch data from the table in a streaming manner: "thread_units" */
  thread_units_stream: Array<Thread_Units>;
  /** fetch data from the table: "threads" */
  threads: Array<Threads>;
  /** fetch aggregated fields from the table: "threads" */
  threads_aggregate: Threads_Aggregate;
  /** fetch data from the table: "threads" using primary key columns */
  threads_by_pk?: Maybe<Threads>;
  /** fetch data from the table in a streaming manner: "threads" */
  threads_stream: Array<Threads>;
  /** fetch data from the table: "units" */
  units: Array<Units>;
  /** fetch aggregated fields from the table: "units" */
  units_aggregate: Units_Aggregate;
  /** fetch data from the table: "units" using primary key columns */
  units_by_pk?: Maybe<Units>;
  /** fetch data from the table in a streaming manner: "units" */
  units_stream: Array<Units>;
  /** An array relationship */
  unitvariant_lessons: Array<Unitvariant_Lessons>;
  /** An aggregate relationship */
  unitvariant_lessons_aggregate: Unitvariant_Lessons_Aggregate;
  /** fetch data from the table: "unitvariant_lessons" using primary key columns */
  unitvariant_lessons_by_pk?: Maybe<Unitvariant_Lessons>;
  /** fetch data from the table in a streaming manner: "unitvariant_lessons" */
  unitvariant_lessons_stream: Array<Unitvariant_Lessons>;
  /** fetch data from the table: "unitvariants" */
  unitvariants: Array<Unitvariants>;
  /** fetch aggregated fields from the table: "unitvariants" */
  unitvariants_aggregate: Unitvariants_Aggregate;
  /** fetch data from the table: "unitvariants" using primary key columns */
  unitvariants_by_pk?: Maybe<Unitvariants>;
  /** fetch data from the table in a streaming manner: "unitvariants" */
  unitvariants_stream: Array<Unitvariants>;
  /** fetch data from the table: "videocaptions" */
  videocaptions: Array<Videocaptions>;
  /** fetch aggregated fields from the table: "videocaptions" */
  videocaptions_aggregate: Videocaptions_Aggregate;
  /** fetch data from the table: "videocaptions" using primary key columns */
  videocaptions_by_pk?: Maybe<Videocaptions>;
  /** fetch data from the table in a streaming manner: "videocaptions" */
  videocaptions_stream: Array<Videocaptions>;
  /** fetch data from the table: "videos" */
  videos: Array<Videos>;
  /** fetch aggregated fields from the table: "videos" */
  videos_aggregate: Videos_Aggregate;
  /** fetch data from the table: "videos" using primary key columns */
  videos_by_pk?: Maybe<Videos>;
  /** fetch data from the table in a streaming manner: "videos" */
  videos_stream: Array<Videos>;
};


export type Subscription_RootAssetsArgs = {
  distinct_on?: InputMaybe<Array<Assets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Assets_Order_By>>;
  where?: InputMaybe<Assets_Bool_Exp>;
};


export type Subscription_RootAssets_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Assets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Assets_Order_By>>;
  where?: InputMaybe<Assets_Bool_Exp>;
};


export type Subscription_RootAssets_By_PkArgs = {
  _state: Scalars['String']['input'];
  asset_id: Scalars['Int']['input'];
};


export type Subscription_RootAssets_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Assets_Stream_Cursor_Input>>;
  where?: InputMaybe<Assets_Bool_Exp>;
};


export type Subscription_RootCat_ContentguidanceArgs = {
  distinct_on?: InputMaybe<Array<Cat_Contentguidance_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Contentguidance_Order_By>>;
  where?: InputMaybe<Cat_Contentguidance_Bool_Exp>;
};


export type Subscription_RootCat_Contentguidance_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cat_Contentguidance_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Contentguidance_Order_By>>;
  where?: InputMaybe<Cat_Contentguidance_Bool_Exp>;
};


export type Subscription_RootCat_Contentguidance_By_PkArgs = {
  _state: Scalars['String']['input'];
  contentguidance_id: Scalars['Int']['input'];
};


export type Subscription_RootCat_Contentguidance_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Cat_Contentguidance_Stream_Cursor_Input>>;
  where?: InputMaybe<Cat_Contentguidance_Bool_Exp>;
};


export type Subscription_RootCat_ExamboardspecsArgs = {
  distinct_on?: InputMaybe<Array<Cat_Examboardspecs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Examboardspecs_Order_By>>;
  where?: InputMaybe<Cat_Examboardspecs_Bool_Exp>;
};


export type Subscription_RootCat_Examboardspecs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cat_Examboardspecs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Examboardspecs_Order_By>>;
  where?: InputMaybe<Cat_Examboardspecs_Bool_Exp>;
};


export type Subscription_RootCat_Examboardspecs_By_PkArgs = {
  _state: Scalars['String']['input'];
  examboardspecs_id: Scalars['Int']['input'];
};


export type Subscription_RootCat_Examboardspecs_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Cat_Examboardspecs_Stream_Cursor_Input>>;
  where?: InputMaybe<Cat_Examboardspecs_Bool_Exp>;
};


export type Subscription_RootCat_NationalcurriculumArgs = {
  distinct_on?: InputMaybe<Array<Cat_Nationalcurriculum_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Nationalcurriculum_Order_By>>;
  where?: InputMaybe<Cat_Nationalcurriculum_Bool_Exp>;
};


export type Subscription_RootCat_Nationalcurriculum_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cat_Nationalcurriculum_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Nationalcurriculum_Order_By>>;
  where?: InputMaybe<Cat_Nationalcurriculum_Bool_Exp>;
};


export type Subscription_RootCat_Nationalcurriculum_By_PkArgs = {
  _state: Scalars['String']['input'];
  nationalcurriculum_id: Scalars['Int']['input'];
};


export type Subscription_RootCat_Nationalcurriculum_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Cat_Nationalcurriculum_Stream_Cursor_Input>>;
  where?: InputMaybe<Cat_Nationalcurriculum_Bool_Exp>;
};


export type Subscription_RootCat_SupervisionlevelsArgs = {
  distinct_on?: InputMaybe<Array<Cat_Supervisionlevels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Supervisionlevels_Order_By>>;
  where?: InputMaybe<Cat_Supervisionlevels_Bool_Exp>;
};


export type Subscription_RootCat_Supervisionlevels_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cat_Supervisionlevels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Supervisionlevels_Order_By>>;
  where?: InputMaybe<Cat_Supervisionlevels_Bool_Exp>;
};


export type Subscription_RootCat_Supervisionlevels_By_PkArgs = {
  _state: Scalars['String']['input'];
  supervisionlevel_id: Scalars['Int']['input'];
};


export type Subscription_RootCat_Supervisionlevels_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Cat_Supervisionlevels_Stream_Cursor_Input>>;
  where?: InputMaybe<Cat_Supervisionlevels_Bool_Exp>;
};


export type Subscription_RootCat_TagsArgs = {
  distinct_on?: InputMaybe<Array<Cat_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Tags_Order_By>>;
  where?: InputMaybe<Cat_Tags_Bool_Exp>;
};


export type Subscription_RootCat_Tags_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cat_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Tags_Order_By>>;
  where?: InputMaybe<Cat_Tags_Bool_Exp>;
};


export type Subscription_RootCat_Tags_By_PkArgs = {
  _state: Scalars['String']['input'];
  tag_id: Scalars['Int']['input'];
};


export type Subscription_RootCat_Tags_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Cat_Tags_Stream_Cursor_Input>>;
  where?: InputMaybe<Cat_Tags_Bool_Exp>;
};


export type Subscription_RootInternal_Review_LessonsArgs = {
  distinct_on?: InputMaybe<Array<Internal_Review_Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Internal_Review_Lessons_Order_By>>;
  where?: InputMaybe<Internal_Review_Lessons_Bool_Exp>;
};


export type Subscription_RootInternal_Review_Lessons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Internal_Review_Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Internal_Review_Lessons_Order_By>>;
  where?: InputMaybe<Internal_Review_Lessons_Bool_Exp>;
};


export type Subscription_RootInternal_Review_Lessons_By_PkArgs = {
  _state: Scalars['String']['input'];
  lesson_id: Scalars['Int']['input'];
};


export type Subscription_RootInternal_Review_Lessons_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Internal_Review_Lessons_Stream_Cursor_Input>>;
  where?: InputMaybe<Internal_Review_Lessons_Bool_Exp>;
};


export type Subscription_RootLessonsArgs = {
  distinct_on?: InputMaybe<Array<Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Lessons_Order_By>>;
  where?: InputMaybe<Lessons_Bool_Exp>;
};


export type Subscription_RootLessons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Lessons_Order_By>>;
  where?: InputMaybe<Lessons_Bool_Exp>;
};


export type Subscription_RootLessons_By_PkArgs = {
  _state: Scalars['String']['input'];
  lesson_id: Scalars['Int']['input'];
};


export type Subscription_RootLessons_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Lessons_Stream_Cursor_Input>>;
  where?: InputMaybe<Lessons_Bool_Exp>;
};


export type Subscription_RootPf_ExamboardsArgs = {
  distinct_on?: InputMaybe<Array<Pf_Examboards_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Examboards_Order_By>>;
  where?: InputMaybe<Pf_Examboards_Bool_Exp>;
};


export type Subscription_RootPf_Examboards_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pf_Examboards_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Examboards_Order_By>>;
  where?: InputMaybe<Pf_Examboards_Bool_Exp>;
};


export type Subscription_RootPf_Examboards_By_PkArgs = {
  _state: Scalars['String']['input'];
  examboard_id: Scalars['Int']['input'];
};


export type Subscription_RootPf_Examboards_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Pf_Examboards_Stream_Cursor_Input>>;
  where?: InputMaybe<Pf_Examboards_Bool_Exp>;
};


export type Subscription_RootPf_KeystagesArgs = {
  distinct_on?: InputMaybe<Array<Pf_Keystages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Keystages_Order_By>>;
  where?: InputMaybe<Pf_Keystages_Bool_Exp>;
};


export type Subscription_RootPf_Keystages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pf_Keystages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Keystages_Order_By>>;
  where?: InputMaybe<Pf_Keystages_Bool_Exp>;
};


export type Subscription_RootPf_Keystages_By_PkArgs = {
  _state: Scalars['String']['input'];
  keystage_id: Scalars['Int']['input'];
};


export type Subscription_RootPf_Keystages_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Pf_Keystages_Stream_Cursor_Input>>;
  where?: InputMaybe<Pf_Keystages_Bool_Exp>;
};


export type Subscription_RootPf_PhasesArgs = {
  distinct_on?: InputMaybe<Array<Pf_Phases_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Phases_Order_By>>;
  where?: InputMaybe<Pf_Phases_Bool_Exp>;
};


export type Subscription_RootPf_Phases_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pf_Phases_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Phases_Order_By>>;
  where?: InputMaybe<Pf_Phases_Bool_Exp>;
};


export type Subscription_RootPf_Phases_By_PkArgs = {
  _state: Scalars['String']['input'];
  phase_id: Scalars['Int']['input'];
};


export type Subscription_RootPf_Phases_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Pf_Phases_Stream_Cursor_Input>>;
  where?: InputMaybe<Pf_Phases_Bool_Exp>;
};


export type Subscription_RootPf_SubjectsArgs = {
  distinct_on?: InputMaybe<Array<Pf_Subjects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Subjects_Order_By>>;
  where?: InputMaybe<Pf_Subjects_Bool_Exp>;
};


export type Subscription_RootPf_Subjects_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pf_Subjects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Subjects_Order_By>>;
  where?: InputMaybe<Pf_Subjects_Bool_Exp>;
};


export type Subscription_RootPf_Subjects_By_PkArgs = {
  _state: Scalars['String']['input'];
  subject_id: Scalars['Int']['input'];
};


export type Subscription_RootPf_Subjects_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Pf_Subjects_Stream_Cursor_Input>>;
  where?: InputMaybe<Pf_Subjects_Bool_Exp>;
};


export type Subscription_RootPf_TiersArgs = {
  distinct_on?: InputMaybe<Array<Pf_Tiers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Tiers_Order_By>>;
  where?: InputMaybe<Pf_Tiers_Bool_Exp>;
};


export type Subscription_RootPf_Tiers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pf_Tiers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Tiers_Order_By>>;
  where?: InputMaybe<Pf_Tiers_Bool_Exp>;
};


export type Subscription_RootPf_Tiers_By_PkArgs = {
  _state: Scalars['String']['input'];
  tier_id: Scalars['Int']['input'];
};


export type Subscription_RootPf_Tiers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Pf_Tiers_Stream_Cursor_Input>>;
  where?: InputMaybe<Pf_Tiers_Bool_Exp>;
};


export type Subscription_RootPf_YearsArgs = {
  distinct_on?: InputMaybe<Array<Pf_Years_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Years_Order_By>>;
  where?: InputMaybe<Pf_Years_Bool_Exp>;
};


export type Subscription_RootPf_Years_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pf_Years_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pf_Years_Order_By>>;
  where?: InputMaybe<Pf_Years_Bool_Exp>;
};


export type Subscription_RootPf_Years_By_PkArgs = {
  _state: Scalars['String']['input'];
  year_id: Scalars['Int']['input'];
};


export type Subscription_RootPf_Years_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Pf_Years_Stream_Cursor_Input>>;
  where?: InputMaybe<Pf_Years_Bool_Exp>;
};


export type Subscription_RootProgramme_ThreadsArgs = {
  distinct_on?: InputMaybe<Array<Programme_Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Threads_Order_By>>;
  where?: InputMaybe<Programme_Threads_Bool_Exp>;
};


export type Subscription_RootProgramme_Threads_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Programme_Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Threads_Order_By>>;
  where?: InputMaybe<Programme_Threads_Bool_Exp>;
};


export type Subscription_RootProgramme_Threads_By_PkArgs = {
  _state: Scalars['String']['input'];
  programme_id: Scalars['Int']['input'];
  thread_id: Scalars['Int']['input'];
};


export type Subscription_RootProgramme_Threads_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Programme_Threads_Stream_Cursor_Input>>;
  where?: InputMaybe<Programme_Threads_Bool_Exp>;
};


export type Subscription_RootProgramme_UnitsArgs = {
  distinct_on?: InputMaybe<Array<Programme_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Units_Order_By>>;
  where?: InputMaybe<Programme_Units_Bool_Exp>;
};


export type Subscription_RootProgramme_Units_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Programme_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Units_Order_By>>;
  where?: InputMaybe<Programme_Units_Bool_Exp>;
};


export type Subscription_RootProgramme_Units_By_PkArgs = {
  _state: Scalars['String']['input'];
  programme_id: Scalars['Int']['input'];
  unit_id: Scalars['Int']['input'];
};


export type Subscription_RootProgramme_Units_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Programme_Units_Stream_Cursor_Input>>;
  where?: InputMaybe<Programme_Units_Bool_Exp>;
};


export type Subscription_RootProgrammesArgs = {
  distinct_on?: InputMaybe<Array<Programmes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programmes_Order_By>>;
  where?: InputMaybe<Programmes_Bool_Exp>;
};


export type Subscription_RootProgrammes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Programmes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programmes_Order_By>>;
  where?: InputMaybe<Programmes_Bool_Exp>;
};


export type Subscription_RootProgrammes_By_PkArgs = {
  _state: Scalars['String']['input'];
  programme_id: Scalars['Int']['input'];
};


export type Subscription_RootProgrammes_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Programmes_Stream_Cursor_Input>>;
  where?: InputMaybe<Programmes_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_DownloadsArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Downloads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Downloads_Order_By>>;
  where?: InputMaybe<Published_Mv_Downloads_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Downloads_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Downloads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Downloads_Order_By>>;
  where?: InputMaybe<Published_Mv_Downloads_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Downloads_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Published_Mv_Downloads_Stream_Cursor_Input>>;
  where?: InputMaybe<Published_Mv_Downloads_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_HomepageArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Homepage_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Homepage_Order_By>>;
  where?: InputMaybe<Published_Mv_Homepage_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Homepage_1Args = {
  distinct_on?: InputMaybe<Array<Published_Mv_Homepage_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Homepage_1_Order_By>>;
  where?: InputMaybe<Published_Mv_Homepage_1_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Homepage_1_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Homepage_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Homepage_1_Order_By>>;
  where?: InputMaybe<Published_Mv_Homepage_1_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Homepage_1_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Published_Mv_Homepage_1_Stream_Cursor_Input>>;
  where?: InputMaybe<Published_Mv_Homepage_1_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Homepage_2Args = {
  distinct_on?: InputMaybe<Array<Published_Mv_Homepage_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Homepage_2_Order_By>>;
  where?: InputMaybe<Published_Mv_Homepage_2_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Homepage_2_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Homepage_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Homepage_2_Order_By>>;
  where?: InputMaybe<Published_Mv_Homepage_2_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Homepage_2_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Published_Mv_Homepage_2_Stream_Cursor_Input>>;
  where?: InputMaybe<Published_Mv_Homepage_2_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Homepage_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Homepage_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Homepage_Order_By>>;
  where?: InputMaybe<Published_Mv_Homepage_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Homepage_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Published_Mv_Homepage_Stream_Cursor_Input>>;
  where?: InputMaybe<Published_Mv_Homepage_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Key_StagesArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Key_Stages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Key_Stages_Order_By>>;
  where?: InputMaybe<Published_Mv_Key_Stages_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Key_Stages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Key_Stages_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Key_Stages_Order_By>>;
  where?: InputMaybe<Published_Mv_Key_Stages_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Key_Stages_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Published_Mv_Key_Stages_Stream_Cursor_Input>>;
  where?: InputMaybe<Published_Mv_Key_Stages_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Lesson_Listing_1Args = {
  distinct_on?: InputMaybe<Array<Published_Mv_Lesson_Listing_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Lesson_Listing_1_Order_By>>;
  where?: InputMaybe<Published_Mv_Lesson_Listing_1_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Lesson_Listing_1_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Lesson_Listing_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Lesson_Listing_1_Order_By>>;
  where?: InputMaybe<Published_Mv_Lesson_Listing_1_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Lesson_Listing_1_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Published_Mv_Lesson_Listing_1_Stream_Cursor_Input>>;
  where?: InputMaybe<Published_Mv_Lesson_Listing_1_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Lesson_Listing_2Args = {
  distinct_on?: InputMaybe<Array<Published_Mv_Lesson_Listing_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Lesson_Listing_2_Order_By>>;
  where?: InputMaybe<Published_Mv_Lesson_Listing_2_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Lesson_Listing_2_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Lesson_Listing_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Lesson_Listing_2_Order_By>>;
  where?: InputMaybe<Published_Mv_Lesson_Listing_2_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Lesson_Listing_2_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Published_Mv_Lesson_Listing_2_Stream_Cursor_Input>>;
  where?: InputMaybe<Published_Mv_Lesson_Listing_2_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Lesson_OverviewArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Lesson_Overview_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Lesson_Overview_Order_By>>;
  where?: InputMaybe<Published_Mv_Lesson_Overview_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Lesson_Overview_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Lesson_Overview_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Lesson_Overview_Order_By>>;
  where?: InputMaybe<Published_Mv_Lesson_Overview_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Lesson_Overview_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Published_Mv_Lesson_Overview_Stream_Cursor_Input>>;
  where?: InputMaybe<Published_Mv_Lesson_Overview_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Programme_ListingArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Programme_Listing_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Programme_Listing_Order_By>>;
  where?: InputMaybe<Published_Mv_Programme_Listing_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Programme_Listing_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Programme_Listing_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Programme_Listing_Order_By>>;
  where?: InputMaybe<Published_Mv_Programme_Listing_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Programme_Listing_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Published_Mv_Programme_Listing_Stream_Cursor_Input>>;
  where?: InputMaybe<Published_Mv_Programme_Listing_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Search_PageArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Search_Page_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Search_Page_Order_By>>;
  where?: InputMaybe<Published_Mv_Search_Page_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Search_Page_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Search_Page_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Search_Page_Order_By>>;
  where?: InputMaybe<Published_Mv_Search_Page_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Search_Page_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Published_Mv_Search_Page_Stream_Cursor_Input>>;
  where?: InputMaybe<Published_Mv_Search_Page_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Subject_ListingArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Subject_Listing_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Subject_Listing_Order_By>>;
  where?: InputMaybe<Published_Mv_Subject_Listing_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Subject_Listing_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Subject_Listing_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Subject_Listing_Order_By>>;
  where?: InputMaybe<Published_Mv_Subject_Listing_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Subject_Listing_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Published_Mv_Subject_Listing_Stream_Cursor_Input>>;
  where?: InputMaybe<Published_Mv_Subject_Listing_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Unit_Listing_PageArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Unit_Listing_Page_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Unit_Listing_Page_Order_By>>;
  where?: InputMaybe<Published_Mv_Unit_Listing_Page_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Unit_Listing_Page_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Mv_Unit_Listing_Page_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Mv_Unit_Listing_Page_Order_By>>;
  where?: InputMaybe<Published_Mv_Unit_Listing_Page_Bool_Exp>;
};


export type Subscription_RootPublished_Mv_Unit_Listing_Page_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Published_Mv_Unit_Listing_Page_Stream_Cursor_Input>>;
  where?: InputMaybe<Published_Mv_Unit_Listing_Page_Bool_Exp>;
};


export type Subscription_RootPublished_ViewmanagerArgs = {
  distinct_on?: InputMaybe<Array<Published_Viewmanager_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Viewmanager_Order_By>>;
  where?: InputMaybe<Published_Viewmanager_Bool_Exp>;
};


export type Subscription_RootPublished_Viewmanager_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Published_Viewmanager_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Published_Viewmanager_Order_By>>;
  where?: InputMaybe<Published_Viewmanager_Bool_Exp>;
};


export type Subscription_RootPublished_Viewmanager_By_PkArgs = {
  viewmanager_id: Scalars['Int']['input'];
};


export type Subscription_RootPublished_Viewmanager_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Published_Viewmanager_Stream_Cursor_Input>>;
  where?: InputMaybe<Published_Viewmanager_Bool_Exp>;
};


export type Subscription_RootQuestionsArgs = {
  distinct_on?: InputMaybe<Array<Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Questions_Order_By>>;
  where?: InputMaybe<Questions_Bool_Exp>;
};


export type Subscription_RootQuestions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Questions_Order_By>>;
  where?: InputMaybe<Questions_Bool_Exp>;
};


export type Subscription_RootQuestions_By_PkArgs = {
  _state: Scalars['String']['input'];
  question_id: Scalars['Int']['input'];
};


export type Subscription_RootQuestions_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Questions_Stream_Cursor_Input>>;
  where?: InputMaybe<Questions_Bool_Exp>;
};


export type Subscription_RootQuiz_QuestionsArgs = {
  distinct_on?: InputMaybe<Array<Quiz_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quiz_Questions_Order_By>>;
  where?: InputMaybe<Quiz_Questions_Bool_Exp>;
};


export type Subscription_RootQuiz_Questions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Quiz_Questions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quiz_Questions_Order_By>>;
  where?: InputMaybe<Quiz_Questions_Bool_Exp>;
};


export type Subscription_RootQuiz_Questions_By_PkArgs = {
  _state: Scalars['String']['input'];
  question_id: Scalars['Int']['input'];
  quiz_id: Scalars['Int']['input'];
};


export type Subscription_RootQuiz_Questions_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Quiz_Questions_Stream_Cursor_Input>>;
  where?: InputMaybe<Quiz_Questions_Bool_Exp>;
};


export type Subscription_RootQuizzesArgs = {
  distinct_on?: InputMaybe<Array<Quizzes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quizzes_Order_By>>;
  where?: InputMaybe<Quizzes_Bool_Exp>;
};


export type Subscription_RootQuizzes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Quizzes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Quizzes_Order_By>>;
  where?: InputMaybe<Quizzes_Bool_Exp>;
};


export type Subscription_RootQuizzes_By_PkArgs = {
  _state: Scalars['String']['input'];
  quiz_id: Scalars['Int']['input'];
};


export type Subscription_RootQuizzes_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Quizzes_Stream_Cursor_Input>>;
  where?: InputMaybe<Quizzes_Bool_Exp>;
};


export type Subscription_RootThread_UnitsArgs = {
  distinct_on?: InputMaybe<Array<Thread_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Thread_Units_Order_By>>;
  where?: InputMaybe<Thread_Units_Bool_Exp>;
};


export type Subscription_RootThread_Units_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Thread_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Thread_Units_Order_By>>;
  where?: InputMaybe<Thread_Units_Bool_Exp>;
};


export type Subscription_RootThread_Units_By_PkArgs = {
  _state: Scalars['String']['input'];
  thread_id: Scalars['Int']['input'];
  unit_id: Scalars['Int']['input'];
};


export type Subscription_RootThread_Units_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Thread_Units_Stream_Cursor_Input>>;
  where?: InputMaybe<Thread_Units_Bool_Exp>;
};


export type Subscription_RootThreadsArgs = {
  distinct_on?: InputMaybe<Array<Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Threads_Order_By>>;
  where?: InputMaybe<Threads_Bool_Exp>;
};


export type Subscription_RootThreads_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Threads_Order_By>>;
  where?: InputMaybe<Threads_Bool_Exp>;
};


export type Subscription_RootThreads_By_PkArgs = {
  _state: Scalars['String']['input'];
  thread_id: Scalars['Int']['input'];
};


export type Subscription_RootThreads_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Threads_Stream_Cursor_Input>>;
  where?: InputMaybe<Threads_Bool_Exp>;
};


export type Subscription_RootUnitsArgs = {
  distinct_on?: InputMaybe<Array<Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Units_Order_By>>;
  where?: InputMaybe<Units_Bool_Exp>;
};


export type Subscription_RootUnits_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Units_Order_By>>;
  where?: InputMaybe<Units_Bool_Exp>;
};


export type Subscription_RootUnits_By_PkArgs = {
  _state: Scalars['String']['input'];
  unit_id: Scalars['Int']['input'];
};


export type Subscription_RootUnits_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Units_Stream_Cursor_Input>>;
  where?: InputMaybe<Units_Bool_Exp>;
};


export type Subscription_RootUnitvariant_LessonsArgs = {
  distinct_on?: InputMaybe<Array<Unitvariant_Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariant_Lessons_Order_By>>;
  where?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
};


export type Subscription_RootUnitvariant_Lessons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Unitvariant_Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariant_Lessons_Order_By>>;
  where?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
};


export type Subscription_RootUnitvariant_Lessons_By_PkArgs = {
  _state: Scalars['String']['input'];
  lesson_id: Scalars['Int']['input'];
  unitvariant_id: Scalars['Int']['input'];
};


export type Subscription_RootUnitvariant_Lessons_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Unitvariant_Lessons_Stream_Cursor_Input>>;
  where?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
};


export type Subscription_RootUnitvariantsArgs = {
  distinct_on?: InputMaybe<Array<Unitvariants_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariants_Order_By>>;
  where?: InputMaybe<Unitvariants_Bool_Exp>;
};


export type Subscription_RootUnitvariants_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Unitvariants_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariants_Order_By>>;
  where?: InputMaybe<Unitvariants_Bool_Exp>;
};


export type Subscription_RootUnitvariants_By_PkArgs = {
  _state: Scalars['String']['input'];
  unitvariant_id: Scalars['Int']['input'];
};


export type Subscription_RootUnitvariants_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Unitvariants_Stream_Cursor_Input>>;
  where?: InputMaybe<Unitvariants_Bool_Exp>;
};


export type Subscription_RootVideocaptionsArgs = {
  distinct_on?: InputMaybe<Array<Videocaptions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Videocaptions_Order_By>>;
  where?: InputMaybe<Videocaptions_Bool_Exp>;
};


export type Subscription_RootVideocaptions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Videocaptions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Videocaptions_Order_By>>;
  where?: InputMaybe<Videocaptions_Bool_Exp>;
};


export type Subscription_RootVideocaptions_By_PkArgs = {
  _state: Scalars['String']['input'];
  caption_id: Scalars['Int']['input'];
};


export type Subscription_RootVideocaptions_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Videocaptions_Stream_Cursor_Input>>;
  where?: InputMaybe<Videocaptions_Bool_Exp>;
};


export type Subscription_RootVideosArgs = {
  distinct_on?: InputMaybe<Array<Videos_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Videos_Order_By>>;
  where?: InputMaybe<Videos_Bool_Exp>;
};


export type Subscription_RootVideos_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Videos_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Videos_Order_By>>;
  where?: InputMaybe<Videos_Bool_Exp>;
};


export type Subscription_RootVideos_By_PkArgs = {
  _state: Scalars['String']['input'];
  video_id: Scalars['Int']['input'];
};


export type Subscription_RootVideos_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Videos_Stream_Cursor_Input>>;
  where?: InputMaybe<Videos_Bool_Exp>;
};

/** columns and relationships of "thread_units" */
export type Thread_Units = {
  __typename?: 'thread_units';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  thread?: Maybe<Threads>;
  thread_id: Scalars['Int']['output'];
  /** An array relationship */
  threads_all_states: Array<Threads>;
  /** An aggregate relationship */
  threads_all_states_aggregate: Threads_Aggregate;
  /** An object relationship */
  unit?: Maybe<Units>;
  unit_id: Scalars['Int']['output'];
  /** An array relationship */
  units_all_states: Array<Units>;
  /** An aggregate relationship */
  units_all_states_aggregate: Units_Aggregate;
  updated_at: Scalars['timestamptz']['output'];
};


/** columns and relationships of "thread_units" */
export type Thread_UnitsThreads_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Threads_Order_By>>;
  where?: InputMaybe<Threads_Bool_Exp>;
};


/** columns and relationships of "thread_units" */
export type Thread_UnitsThreads_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Threads_Order_By>>;
  where?: InputMaybe<Threads_Bool_Exp>;
};


/** columns and relationships of "thread_units" */
export type Thread_UnitsUnits_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Units_Order_By>>;
  where?: InputMaybe<Units_Bool_Exp>;
};


/** columns and relationships of "thread_units" */
export type Thread_UnitsUnits_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Units_Order_By>>;
  where?: InputMaybe<Units_Bool_Exp>;
};

/** aggregated selection of "thread_units" */
export type Thread_Units_Aggregate = {
  __typename?: 'thread_units_aggregate';
  aggregate?: Maybe<Thread_Units_Aggregate_Fields>;
  nodes: Array<Thread_Units>;
};

export type Thread_Units_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Thread_Units_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Thread_Units_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Thread_Units_Aggregate_Bool_Exp_Count>;
};

export type Thread_Units_Aggregate_Bool_Exp_Bool_And = {
  arguments: Thread_Units_Select_Column_Thread_Units_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Thread_Units_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Thread_Units_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Thread_Units_Select_Column_Thread_Units_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Thread_Units_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Thread_Units_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Thread_Units_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Thread_Units_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "thread_units" */
export type Thread_Units_Aggregate_Fields = {
  __typename?: 'thread_units_aggregate_fields';
  avg?: Maybe<Thread_Units_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Thread_Units_Max_Fields>;
  min?: Maybe<Thread_Units_Min_Fields>;
  stddev?: Maybe<Thread_Units_Stddev_Fields>;
  stddev_pop?: Maybe<Thread_Units_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Thread_Units_Stddev_Samp_Fields>;
  sum?: Maybe<Thread_Units_Sum_Fields>;
  var_pop?: Maybe<Thread_Units_Var_Pop_Fields>;
  var_samp?: Maybe<Thread_Units_Var_Samp_Fields>;
  variance?: Maybe<Thread_Units_Variance_Fields>;
};


/** aggregate fields of "thread_units" */
export type Thread_Units_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Thread_Units_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "thread_units" */
export type Thread_Units_Aggregate_Order_By = {
  avg?: InputMaybe<Thread_Units_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Thread_Units_Max_Order_By>;
  min?: InputMaybe<Thread_Units_Min_Order_By>;
  stddev?: InputMaybe<Thread_Units_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Thread_Units_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Thread_Units_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Thread_Units_Sum_Order_By>;
  var_pop?: InputMaybe<Thread_Units_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Thread_Units_Var_Samp_Order_By>;
  variance?: InputMaybe<Thread_Units_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "thread_units" */
export type Thread_Units_Arr_Rel_Insert_Input = {
  data: Array<Thread_Units_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Thread_Units_On_Conflict>;
};

/** aggregate avg on columns */
export type Thread_Units_Avg_Fields = {
  __typename?: 'thread_units_avg_fields';
  order?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "thread_units" */
export type Thread_Units_Avg_Order_By = {
  order?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "thread_units". All fields are combined with a logical 'AND'. */
export type Thread_Units_Bool_Exp = {
  _and?: InputMaybe<Array<Thread_Units_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Thread_Units_Bool_Exp>;
  _or?: InputMaybe<Array<Thread_Units_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  order?: InputMaybe<Int_Comparison_Exp>;
  thread?: InputMaybe<Threads_Bool_Exp>;
  thread_id?: InputMaybe<Int_Comparison_Exp>;
  threads_all_states?: InputMaybe<Threads_Bool_Exp>;
  threads_all_states_aggregate?: InputMaybe<Threads_Aggregate_Bool_Exp>;
  unit?: InputMaybe<Units_Bool_Exp>;
  unit_id?: InputMaybe<Int_Comparison_Exp>;
  units_all_states?: InputMaybe<Units_Bool_Exp>;
  units_all_states_aggregate?: InputMaybe<Units_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "thread_units" */
export enum Thread_Units_Constraint {
  /** unique or primary key constraint on columns "unit_id", "_state", "thread_id" */
  ThreadUnitsPkey = 'thread_units_pkey'
}

/** input type for incrementing numeric columns in table "thread_units" */
export type Thread_Units_Inc_Input = {
  order?: InputMaybe<Scalars['Int']['input']>;
  thread_id?: InputMaybe<Scalars['Int']['input']>;
  unit_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "thread_units" */
export type Thread_Units_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  thread?: InputMaybe<Threads_Obj_Rel_Insert_Input>;
  thread_id?: InputMaybe<Scalars['Int']['input']>;
  threads_all_states?: InputMaybe<Threads_Arr_Rel_Insert_Input>;
  unit?: InputMaybe<Units_Obj_Rel_Insert_Input>;
  unit_id?: InputMaybe<Scalars['Int']['input']>;
  units_all_states?: InputMaybe<Units_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Thread_Units_Max_Fields = {
  __typename?: 'thread_units_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  thread_id?: Maybe<Scalars['Int']['output']>;
  unit_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "thread_units" */
export type Thread_Units_Max_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Thread_Units_Min_Fields = {
  __typename?: 'thread_units_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  thread_id?: Maybe<Scalars['Int']['output']>;
  unit_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "thread_units" */
export type Thread_Units_Min_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "thread_units" */
export type Thread_Units_Mutation_Response = {
  __typename?: 'thread_units_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Thread_Units>;
};

/** on_conflict condition type for table "thread_units" */
export type Thread_Units_On_Conflict = {
  constraint: Thread_Units_Constraint;
  update_columns?: Array<Thread_Units_Update_Column>;
  where?: InputMaybe<Thread_Units_Bool_Exp>;
};

/** Ordering options when selecting data from "thread_units". */
export type Thread_Units_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  thread?: InputMaybe<Threads_Order_By>;
  thread_id?: InputMaybe<Order_By>;
  threads_all_states_aggregate?: InputMaybe<Threads_Aggregate_Order_By>;
  unit?: InputMaybe<Units_Order_By>;
  unit_id?: InputMaybe<Order_By>;
  units_all_states_aggregate?: InputMaybe<Units_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: thread_units */
export type Thread_Units_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  thread_id: Scalars['Int']['input'];
  unit_id: Scalars['Int']['input'];
};

/** select columns of table "thread_units" */
export enum Thread_Units_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Order = 'order',
  /** column name */
  ThreadId = 'thread_id',
  /** column name */
  UnitId = 'unit_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "thread_units_aggregate_bool_exp_bool_and_arguments_columns" columns of table "thread_units" */
export enum Thread_Units_Select_Column_Thread_Units_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** select "thread_units_aggregate_bool_exp_bool_or_arguments_columns" columns of table "thread_units" */
export enum Thread_Units_Select_Column_Thread_Units_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** input type for updating data in table "thread_units" */
export type Thread_Units_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  thread_id?: InputMaybe<Scalars['Int']['input']>;
  unit_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Thread_Units_Stddev_Fields = {
  __typename?: 'thread_units_stddev_fields';
  order?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "thread_units" */
export type Thread_Units_Stddev_Order_By = {
  order?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Thread_Units_Stddev_Pop_Fields = {
  __typename?: 'thread_units_stddev_pop_fields';
  order?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "thread_units" */
export type Thread_Units_Stddev_Pop_Order_By = {
  order?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Thread_Units_Stddev_Samp_Fields = {
  __typename?: 'thread_units_stddev_samp_fields';
  order?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "thread_units" */
export type Thread_Units_Stddev_Samp_Order_By = {
  order?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "thread_units" */
export type Thread_Units_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Thread_Units_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Thread_Units_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  thread_id?: InputMaybe<Scalars['Int']['input']>;
  unit_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Thread_Units_Sum_Fields = {
  __typename?: 'thread_units_sum_fields';
  order?: Maybe<Scalars['Int']['output']>;
  thread_id?: Maybe<Scalars['Int']['output']>;
  unit_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "thread_units" */
export type Thread_Units_Sum_Order_By = {
  order?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** update columns of table "thread_units" */
export enum Thread_Units_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Order = 'order',
  /** column name */
  ThreadId = 'thread_id',
  /** column name */
  UnitId = 'unit_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Thread_Units_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Thread_Units_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Thread_Units_Set_Input>;
  /** filter the rows which have to be updated */
  where: Thread_Units_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Thread_Units_Var_Pop_Fields = {
  __typename?: 'thread_units_var_pop_fields';
  order?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "thread_units" */
export type Thread_Units_Var_Pop_Order_By = {
  order?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Thread_Units_Var_Samp_Fields = {
  __typename?: 'thread_units_var_samp_fields';
  order?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "thread_units" */
export type Thread_Units_Var_Samp_Order_By = {
  order?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Thread_Units_Variance_Fields = {
  __typename?: 'thread_units_variance_fields';
  order?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "thread_units" */
export type Thread_Units_Variance_Order_By = {
  order?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "threads" */
export type Threads = {
  __typename?: 'threads';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  /** An array relationship */
  child_threads: Array<Threads>;
  /** An aggregate relationship */
  child_threads_aggregate: Threads_Aggregate;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  parent_thread?: Maybe<Threads>;
  parent_thread_id?: Maybe<Scalars['Int']['output']>;
  /** An array relationship */
  programme_threads: Array<Programme_Threads>;
  /** An aggregate relationship */
  programme_threads_aggregate: Programme_Threads_Aggregate;
  /** An array relationship */
  programme_threads_all_states: Array<Programme_Threads>;
  /** An aggregate relationship */
  programme_threads_all_states_aggregate: Programme_Threads_Aggregate;
  slug?: Maybe<Scalars['String']['output']>;
  thread_id: Scalars['Int']['output'];
  thread_uid?: Maybe<Scalars['bpchar']['output']>;
  /** An array relationship */
  thread_units: Array<Thread_Units>;
  /** An aggregate relationship */
  thread_units_aggregate: Thread_Units_Aggregate;
  /** An array relationship */
  thread_units_all_states: Array<Thread_Units>;
  /** An aggregate relationship */
  thread_units_all_states_aggregate: Thread_Units_Aggregate;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "threads" */
export type ThreadsChild_ThreadsArgs = {
  distinct_on?: InputMaybe<Array<Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Threads_Order_By>>;
  where?: InputMaybe<Threads_Bool_Exp>;
};


/** columns and relationships of "threads" */
export type ThreadsChild_Threads_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Threads_Order_By>>;
  where?: InputMaybe<Threads_Bool_Exp>;
};


/** columns and relationships of "threads" */
export type ThreadsProgramme_ThreadsArgs = {
  distinct_on?: InputMaybe<Array<Programme_Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Threads_Order_By>>;
  where?: InputMaybe<Programme_Threads_Bool_Exp>;
};


/** columns and relationships of "threads" */
export type ThreadsProgramme_Threads_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Programme_Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Threads_Order_By>>;
  where?: InputMaybe<Programme_Threads_Bool_Exp>;
};


/** columns and relationships of "threads" */
export type ThreadsProgramme_Threads_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Programme_Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Threads_Order_By>>;
  where?: InputMaybe<Programme_Threads_Bool_Exp>;
};


/** columns and relationships of "threads" */
export type ThreadsProgramme_Threads_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Programme_Threads_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Threads_Order_By>>;
  where?: InputMaybe<Programme_Threads_Bool_Exp>;
};


/** columns and relationships of "threads" */
export type ThreadsThread_UnitsArgs = {
  distinct_on?: InputMaybe<Array<Thread_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Thread_Units_Order_By>>;
  where?: InputMaybe<Thread_Units_Bool_Exp>;
};


/** columns and relationships of "threads" */
export type ThreadsThread_Units_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Thread_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Thread_Units_Order_By>>;
  where?: InputMaybe<Thread_Units_Bool_Exp>;
};


/** columns and relationships of "threads" */
export type ThreadsThread_Units_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Thread_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Thread_Units_Order_By>>;
  where?: InputMaybe<Thread_Units_Bool_Exp>;
};


/** columns and relationships of "threads" */
export type ThreadsThread_Units_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Thread_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Thread_Units_Order_By>>;
  where?: InputMaybe<Thread_Units_Bool_Exp>;
};

/** aggregated selection of "threads" */
export type Threads_Aggregate = {
  __typename?: 'threads_aggregate';
  aggregate?: Maybe<Threads_Aggregate_Fields>;
  nodes: Array<Threads>;
};

export type Threads_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Threads_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Threads_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Threads_Aggregate_Bool_Exp_Count>;
};

export type Threads_Aggregate_Bool_Exp_Bool_And = {
  arguments: Threads_Select_Column_Threads_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Threads_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Threads_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Threads_Select_Column_Threads_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Threads_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Threads_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Threads_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Threads_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "threads" */
export type Threads_Aggregate_Fields = {
  __typename?: 'threads_aggregate_fields';
  avg?: Maybe<Threads_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Threads_Max_Fields>;
  min?: Maybe<Threads_Min_Fields>;
  stddev?: Maybe<Threads_Stddev_Fields>;
  stddev_pop?: Maybe<Threads_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Threads_Stddev_Samp_Fields>;
  sum?: Maybe<Threads_Sum_Fields>;
  var_pop?: Maybe<Threads_Var_Pop_Fields>;
  var_samp?: Maybe<Threads_Var_Samp_Fields>;
  variance?: Maybe<Threads_Variance_Fields>;
};


/** aggregate fields of "threads" */
export type Threads_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Threads_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "threads" */
export type Threads_Aggregate_Order_By = {
  avg?: InputMaybe<Threads_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Threads_Max_Order_By>;
  min?: InputMaybe<Threads_Min_Order_By>;
  stddev?: InputMaybe<Threads_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Threads_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Threads_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Threads_Sum_Order_By>;
  var_pop?: InputMaybe<Threads_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Threads_Var_Samp_Order_By>;
  variance?: InputMaybe<Threads_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "threads" */
export type Threads_Arr_Rel_Insert_Input = {
  data: Array<Threads_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Threads_On_Conflict>;
};

/** aggregate avg on columns */
export type Threads_Avg_Fields = {
  __typename?: 'threads_avg_fields';
  parent_thread_id?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "threads" */
export type Threads_Avg_Order_By = {
  parent_thread_id?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "threads". All fields are combined with a logical 'AND'. */
export type Threads_Bool_Exp = {
  _and?: InputMaybe<Array<Threads_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Threads_Bool_Exp>;
  _or?: InputMaybe<Array<Threads_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  child_threads?: InputMaybe<Threads_Bool_Exp>;
  child_threads_aggregate?: InputMaybe<Threads_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  parent_thread?: InputMaybe<Threads_Bool_Exp>;
  parent_thread_id?: InputMaybe<Int_Comparison_Exp>;
  programme_threads?: InputMaybe<Programme_Threads_Bool_Exp>;
  programme_threads_aggregate?: InputMaybe<Programme_Threads_Aggregate_Bool_Exp>;
  programme_threads_all_states?: InputMaybe<Programme_Threads_Bool_Exp>;
  programme_threads_all_states_aggregate?: InputMaybe<Programme_Threads_Aggregate_Bool_Exp>;
  slug?: InputMaybe<String_Comparison_Exp>;
  thread_id?: InputMaybe<Int_Comparison_Exp>;
  thread_uid?: InputMaybe<Bpchar_Comparison_Exp>;
  thread_units?: InputMaybe<Thread_Units_Bool_Exp>;
  thread_units_aggregate?: InputMaybe<Thread_Units_Aggregate_Bool_Exp>;
  thread_units_all_states?: InputMaybe<Thread_Units_Bool_Exp>;
  thread_units_all_states_aggregate?: InputMaybe<Thread_Units_Aggregate_Bool_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "threads" */
export enum Threads_Constraint {
  /** unique or primary key constraint on columns "_state", "thread_id" */
  ThreadsPkey = 'threads_pkey'
}

/** input type for incrementing numeric columns in table "threads" */
export type Threads_Inc_Input = {
  parent_thread_id?: InputMaybe<Scalars['Int']['input']>;
  thread_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "threads" */
export type Threads_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  child_threads?: InputMaybe<Threads_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  parent_thread?: InputMaybe<Threads_Obj_Rel_Insert_Input>;
  parent_thread_id?: InputMaybe<Scalars['Int']['input']>;
  programme_threads?: InputMaybe<Programme_Threads_Arr_Rel_Insert_Input>;
  programme_threads_all_states?: InputMaybe<Programme_Threads_Arr_Rel_Insert_Input>;
  slug?: InputMaybe<Scalars['String']['input']>;
  thread_id?: InputMaybe<Scalars['Int']['input']>;
  thread_uid?: InputMaybe<Scalars['bpchar']['input']>;
  thread_units?: InputMaybe<Thread_Units_Arr_Rel_Insert_Input>;
  thread_units_all_states?: InputMaybe<Thread_Units_Arr_Rel_Insert_Input>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Threads_Max_Fields = {
  __typename?: 'threads_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  parent_thread_id?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  thread_id?: Maybe<Scalars['Int']['output']>;
  thread_uid?: Maybe<Scalars['bpchar']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "threads" */
export type Threads_Max_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  parent_thread_id?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
  thread_uid?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Threads_Min_Fields = {
  __typename?: 'threads_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  parent_thread_id?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  thread_id?: Maybe<Scalars['Int']['output']>;
  thread_uid?: Maybe<Scalars['bpchar']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "threads" */
export type Threads_Min_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  parent_thread_id?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
  thread_uid?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "threads" */
export type Threads_Mutation_Response = {
  __typename?: 'threads_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Threads>;
};

/** input type for inserting object relation for remote table "threads" */
export type Threads_Obj_Rel_Insert_Input = {
  data: Threads_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Threads_On_Conflict>;
};

/** on_conflict condition type for table "threads" */
export type Threads_On_Conflict = {
  constraint: Threads_Constraint;
  update_columns?: Array<Threads_Update_Column>;
  where?: InputMaybe<Threads_Bool_Exp>;
};

/** Ordering options when selecting data from "threads". */
export type Threads_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  child_threads_aggregate?: InputMaybe<Threads_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  parent_thread?: InputMaybe<Threads_Order_By>;
  parent_thread_id?: InputMaybe<Order_By>;
  programme_threads_aggregate?: InputMaybe<Programme_Threads_Aggregate_Order_By>;
  programme_threads_all_states_aggregate?: InputMaybe<Programme_Threads_Aggregate_Order_By>;
  slug?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
  thread_uid?: InputMaybe<Order_By>;
  thread_units_aggregate?: InputMaybe<Thread_Units_Aggregate_Order_By>;
  thread_units_all_states_aggregate?: InputMaybe<Thread_Units_Aggregate_Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: threads */
export type Threads_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  thread_id: Scalars['Int']['input'];
};

/** select columns of table "threads" */
export enum Threads_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  ParentThreadId = 'parent_thread_id',
  /** column name */
  Slug = 'slug',
  /** column name */
  ThreadId = 'thread_id',
  /** column name */
  ThreadUid = 'thread_uid',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "threads_aggregate_bool_exp_bool_and_arguments_columns" columns of table "threads" */
export enum Threads_Select_Column_Threads_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** select "threads_aggregate_bool_exp_bool_or_arguments_columns" columns of table "threads" */
export enum Threads_Select_Column_Threads_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** input type for updating data in table "threads" */
export type Threads_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  parent_thread_id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  thread_id?: InputMaybe<Scalars['Int']['input']>;
  thread_uid?: InputMaybe<Scalars['bpchar']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Threads_Stddev_Fields = {
  __typename?: 'threads_stddev_fields';
  parent_thread_id?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "threads" */
export type Threads_Stddev_Order_By = {
  parent_thread_id?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Threads_Stddev_Pop_Fields = {
  __typename?: 'threads_stddev_pop_fields';
  parent_thread_id?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "threads" */
export type Threads_Stddev_Pop_Order_By = {
  parent_thread_id?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Threads_Stddev_Samp_Fields = {
  __typename?: 'threads_stddev_samp_fields';
  parent_thread_id?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "threads" */
export type Threads_Stddev_Samp_Order_By = {
  parent_thread_id?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "threads" */
export type Threads_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Threads_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Threads_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  parent_thread_id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  thread_id?: InputMaybe<Scalars['Int']['input']>;
  thread_uid?: InputMaybe<Scalars['bpchar']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Threads_Sum_Fields = {
  __typename?: 'threads_sum_fields';
  parent_thread_id?: Maybe<Scalars['Int']['output']>;
  thread_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "threads" */
export type Threads_Sum_Order_By = {
  parent_thread_id?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
};

/** update columns of table "threads" */
export enum Threads_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  ParentThreadId = 'parent_thread_id',
  /** column name */
  Slug = 'slug',
  /** column name */
  ThreadId = 'thread_id',
  /** column name */
  ThreadUid = 'thread_uid',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Threads_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Threads_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Threads_Set_Input>;
  /** filter the rows which have to be updated */
  where: Threads_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Threads_Var_Pop_Fields = {
  __typename?: 'threads_var_pop_fields';
  parent_thread_id?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "threads" */
export type Threads_Var_Pop_Order_By = {
  parent_thread_id?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Threads_Var_Samp_Fields = {
  __typename?: 'threads_var_samp_fields';
  parent_thread_id?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "threads" */
export type Threads_Var_Samp_Order_By = {
  parent_thread_id?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Threads_Variance_Fields = {
  __typename?: 'threads_variance_fields';
  parent_thread_id?: Maybe<Scalars['Float']['output']>;
  thread_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "threads" */
export type Threads_Variance_Order_By = {
  parent_thread_id?: InputMaybe<Order_By>;
  thread_id?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

/** columns and relationships of "units" */
export type Units = {
  __typename?: 'units';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  adaptable?: Maybe<Scalars['Boolean']['output']>;
  /** An object relationship */
  connection_future_unit?: Maybe<Units>;
  /** An array relationship */
  connection_future_unit_all_states: Array<Units>;
  /** An aggregate relationship */
  connection_future_unit_all_states_aggregate: Units_Aggregate;
  connection_future_unit_description?: Maybe<Scalars['String']['output']>;
  connection_future_unit_id?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  connection_prior_unit?: Maybe<Units>;
  /** An array relationship */
  connection_prior_unit_all_states: Array<Units>;
  /** An aggregate relationship */
  connection_prior_unit_all_states_aggregate: Units_Aggregate;
  connection_prior_unit_description?: Maybe<Scalars['String']['output']>;
  connection_prior_unit_id?: Maybe<Scalars['Int']['output']>;
  connections_future_units?: Maybe<Scalars['json']['output']>;
  connections_prior_units?: Maybe<Scalars['json']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  cross_subject_links?: Maybe<Scalars['json']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  exam_board_specification_content?: Maybe<Scalars['json']['output']>;
  intro_video_id?: Maybe<Scalars['Int']['output']>;
  national_curriculum_content?: Maybe<Scalars['json']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  planned_number_of_lessons?: Maybe<Scalars['Int']['output']>;
  prior_knowledge_requirements?: Maybe<Scalars['json']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Scalars['json']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  unit_id: Scalars['Int']['output'];
  /** An array relationship */
  unit_programmes: Array<Programme_Units>;
  /** An aggregate relationship */
  unit_programmes_aggregate: Programme_Units_Aggregate;
  /** An array relationship */
  unit_programmes_all_states: Array<Programme_Units>;
  /** An aggregate relationship */
  unit_programmes_all_states_aggregate: Programme_Units_Aggregate;
  /** A computed field, executes function "function__units__cat_tags" */
  unit_tags?: Maybe<Array<Cat_Tags>>;
  /** An array relationship */
  unit_threads: Array<Thread_Units>;
  /** An aggregate relationship */
  unit_threads_aggregate: Thread_Units_Aggregate;
  /** An array relationship */
  unit_threads_all_states: Array<Thread_Units>;
  /** An aggregate relationship */
  unit_threads_all_states_aggregate: Thread_Units_Aggregate;
  unit_uid?: Maybe<Scalars['bpchar']['output']>;
  /** An array relationship */
  unit_unitvariants: Array<Unitvariants>;
  /** An aggregate relationship */
  unit_unitvariants_aggregate: Unitvariants_Aggregate;
  /** An array relationship */
  unit_unitvariants_all_states: Array<Unitvariants>;
  /** An aggregate relationship */
  unit_unitvariants_all_states_aggregate: Unitvariants_Aggregate;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "units" */
export type UnitsConnection_Future_Unit_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Units_Order_By>>;
  where?: InputMaybe<Units_Bool_Exp>;
};


/** columns and relationships of "units" */
export type UnitsConnection_Future_Unit_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Units_Order_By>>;
  where?: InputMaybe<Units_Bool_Exp>;
};


/** columns and relationships of "units" */
export type UnitsConnection_Prior_Unit_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Units_Order_By>>;
  where?: InputMaybe<Units_Bool_Exp>;
};


/** columns and relationships of "units" */
export type UnitsConnection_Prior_Unit_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Units_Order_By>>;
  where?: InputMaybe<Units_Bool_Exp>;
};


/** columns and relationships of "units" */
export type UnitsConnections_Future_UnitsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "units" */
export type UnitsConnections_Prior_UnitsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "units" */
export type UnitsCross_Subject_LinksArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "units" */
export type UnitsExam_Board_Specification_ContentArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "units" */
export type UnitsNational_Curriculum_ContentArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "units" */
export type UnitsPrior_Knowledge_RequirementsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "units" */
export type UnitsTagsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "units" */
export type UnitsUnit_ProgrammesArgs = {
  distinct_on?: InputMaybe<Array<Programme_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Units_Order_By>>;
  where?: InputMaybe<Programme_Units_Bool_Exp>;
};


/** columns and relationships of "units" */
export type UnitsUnit_Programmes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Programme_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Units_Order_By>>;
  where?: InputMaybe<Programme_Units_Bool_Exp>;
};


/** columns and relationships of "units" */
export type UnitsUnit_Programmes_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Programme_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Units_Order_By>>;
  where?: InputMaybe<Programme_Units_Bool_Exp>;
};


/** columns and relationships of "units" */
export type UnitsUnit_Programmes_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Programme_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Programme_Units_Order_By>>;
  where?: InputMaybe<Programme_Units_Bool_Exp>;
};


/** columns and relationships of "units" */
export type UnitsUnit_TagsArgs = {
  distinct_on?: InputMaybe<Array<Cat_Tags_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cat_Tags_Order_By>>;
  where?: InputMaybe<Cat_Tags_Bool_Exp>;
};


/** columns and relationships of "units" */
export type UnitsUnit_ThreadsArgs = {
  distinct_on?: InputMaybe<Array<Thread_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Thread_Units_Order_By>>;
  where?: InputMaybe<Thread_Units_Bool_Exp>;
};


/** columns and relationships of "units" */
export type UnitsUnit_Threads_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Thread_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Thread_Units_Order_By>>;
  where?: InputMaybe<Thread_Units_Bool_Exp>;
};


/** columns and relationships of "units" */
export type UnitsUnit_Threads_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Thread_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Thread_Units_Order_By>>;
  where?: InputMaybe<Thread_Units_Bool_Exp>;
};


/** columns and relationships of "units" */
export type UnitsUnit_Threads_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Thread_Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Thread_Units_Order_By>>;
  where?: InputMaybe<Thread_Units_Bool_Exp>;
};


/** columns and relationships of "units" */
export type UnitsUnit_UnitvariantsArgs = {
  distinct_on?: InputMaybe<Array<Unitvariants_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariants_Order_By>>;
  where?: InputMaybe<Unitvariants_Bool_Exp>;
};


/** columns and relationships of "units" */
export type UnitsUnit_Unitvariants_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Unitvariants_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariants_Order_By>>;
  where?: InputMaybe<Unitvariants_Bool_Exp>;
};


/** columns and relationships of "units" */
export type UnitsUnit_Unitvariants_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Unitvariants_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariants_Order_By>>;
  where?: InputMaybe<Unitvariants_Bool_Exp>;
};


/** columns and relationships of "units" */
export type UnitsUnit_Unitvariants_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Unitvariants_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariants_Order_By>>;
  where?: InputMaybe<Unitvariants_Bool_Exp>;
};

/** aggregated selection of "units" */
export type Units_Aggregate = {
  __typename?: 'units_aggregate';
  aggregate?: Maybe<Units_Aggregate_Fields>;
  nodes: Array<Units>;
};

export type Units_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Units_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Units_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Units_Aggregate_Bool_Exp_Count>;
};

export type Units_Aggregate_Bool_Exp_Bool_And = {
  arguments: Units_Select_Column_Units_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Units_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Units_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Units_Select_Column_Units_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Units_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Units_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Units_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Units_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "units" */
export type Units_Aggregate_Fields = {
  __typename?: 'units_aggregate_fields';
  avg?: Maybe<Units_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Units_Max_Fields>;
  min?: Maybe<Units_Min_Fields>;
  stddev?: Maybe<Units_Stddev_Fields>;
  stddev_pop?: Maybe<Units_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Units_Stddev_Samp_Fields>;
  sum?: Maybe<Units_Sum_Fields>;
  var_pop?: Maybe<Units_Var_Pop_Fields>;
  var_samp?: Maybe<Units_Var_Samp_Fields>;
  variance?: Maybe<Units_Variance_Fields>;
};


/** aggregate fields of "units" */
export type Units_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Units_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "units" */
export type Units_Aggregate_Order_By = {
  avg?: InputMaybe<Units_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Units_Max_Order_By>;
  min?: InputMaybe<Units_Min_Order_By>;
  stddev?: InputMaybe<Units_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Units_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Units_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Units_Sum_Order_By>;
  var_pop?: InputMaybe<Units_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Units_Var_Samp_Order_By>;
  variance?: InputMaybe<Units_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "units" */
export type Units_Arr_Rel_Insert_Input = {
  data: Array<Units_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Units_On_Conflict>;
};

/** aggregate avg on columns */
export type Units_Avg_Fields = {
  __typename?: 'units_avg_fields';
  connection_future_unit_id?: Maybe<Scalars['Float']['output']>;
  connection_prior_unit_id?: Maybe<Scalars['Float']['output']>;
  intro_video_id?: Maybe<Scalars['Float']['output']>;
  planned_number_of_lessons?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "units" */
export type Units_Avg_Order_By = {
  connection_future_unit_id?: InputMaybe<Order_By>;
  connection_prior_unit_id?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  planned_number_of_lessons?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "units". All fields are combined with a logical 'AND'. */
export type Units_Bool_Exp = {
  _and?: InputMaybe<Array<Units_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Units_Bool_Exp>;
  _or?: InputMaybe<Array<Units_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  adaptable?: InputMaybe<Boolean_Comparison_Exp>;
  connection_future_unit?: InputMaybe<Units_Bool_Exp>;
  connection_future_unit_all_states?: InputMaybe<Units_Bool_Exp>;
  connection_future_unit_all_states_aggregate?: InputMaybe<Units_Aggregate_Bool_Exp>;
  connection_future_unit_description?: InputMaybe<String_Comparison_Exp>;
  connection_future_unit_id?: InputMaybe<Int_Comparison_Exp>;
  connection_prior_unit?: InputMaybe<Units_Bool_Exp>;
  connection_prior_unit_all_states?: InputMaybe<Units_Bool_Exp>;
  connection_prior_unit_all_states_aggregate?: InputMaybe<Units_Aggregate_Bool_Exp>;
  connection_prior_unit_description?: InputMaybe<String_Comparison_Exp>;
  connection_prior_unit_id?: InputMaybe<Int_Comparison_Exp>;
  connections_future_units?: InputMaybe<Json_Comparison_Exp>;
  connections_prior_units?: InputMaybe<Json_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  cross_subject_links?: InputMaybe<Json_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  exam_board_specification_content?: InputMaybe<Json_Comparison_Exp>;
  intro_video_id?: InputMaybe<Int_Comparison_Exp>;
  national_curriculum_content?: InputMaybe<Json_Comparison_Exp>;
  notes?: InputMaybe<String_Comparison_Exp>;
  planned_number_of_lessons?: InputMaybe<Int_Comparison_Exp>;
  prior_knowledge_requirements?: InputMaybe<Json_Comparison_Exp>;
  slug?: InputMaybe<String_Comparison_Exp>;
  tags?: InputMaybe<Json_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  unit_id?: InputMaybe<Int_Comparison_Exp>;
  unit_programmes?: InputMaybe<Programme_Units_Bool_Exp>;
  unit_programmes_aggregate?: InputMaybe<Programme_Units_Aggregate_Bool_Exp>;
  unit_programmes_all_states?: InputMaybe<Programme_Units_Bool_Exp>;
  unit_programmes_all_states_aggregate?: InputMaybe<Programme_Units_Aggregate_Bool_Exp>;
  unit_tags?: InputMaybe<Cat_Tags_Bool_Exp>;
  unit_threads?: InputMaybe<Thread_Units_Bool_Exp>;
  unit_threads_aggregate?: InputMaybe<Thread_Units_Aggregate_Bool_Exp>;
  unit_threads_all_states?: InputMaybe<Thread_Units_Bool_Exp>;
  unit_threads_all_states_aggregate?: InputMaybe<Thread_Units_Aggregate_Bool_Exp>;
  unit_uid?: InputMaybe<Bpchar_Comparison_Exp>;
  unit_unitvariants?: InputMaybe<Unitvariants_Bool_Exp>;
  unit_unitvariants_aggregate?: InputMaybe<Unitvariants_Aggregate_Bool_Exp>;
  unit_unitvariants_all_states?: InputMaybe<Unitvariants_Bool_Exp>;
  unit_unitvariants_all_states_aggregate?: InputMaybe<Unitvariants_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "units" */
export enum Units_Constraint {
  /** unique or primary key constraint on columns "unit_id", "_state" */
  UnitsPkey = 'units_pkey'
}

/** input type for incrementing numeric columns in table "units" */
export type Units_Inc_Input = {
  connection_future_unit_id?: InputMaybe<Scalars['Int']['input']>;
  connection_prior_unit_id?: InputMaybe<Scalars['Int']['input']>;
  intro_video_id?: InputMaybe<Scalars['Int']['input']>;
  planned_number_of_lessons?: InputMaybe<Scalars['Int']['input']>;
  unit_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "units" */
export type Units_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  adaptable?: InputMaybe<Scalars['Boolean']['input']>;
  connection_future_unit?: InputMaybe<Units_Obj_Rel_Insert_Input>;
  connection_future_unit_all_states?: InputMaybe<Units_Arr_Rel_Insert_Input>;
  connection_future_unit_description?: InputMaybe<Scalars['String']['input']>;
  connection_future_unit_id?: InputMaybe<Scalars['Int']['input']>;
  connection_prior_unit?: InputMaybe<Units_Obj_Rel_Insert_Input>;
  connection_prior_unit_all_states?: InputMaybe<Units_Arr_Rel_Insert_Input>;
  connection_prior_unit_description?: InputMaybe<Scalars['String']['input']>;
  connection_prior_unit_id?: InputMaybe<Scalars['Int']['input']>;
  connections_future_units?: InputMaybe<Scalars['json']['input']>;
  connections_prior_units?: InputMaybe<Scalars['json']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  cross_subject_links?: InputMaybe<Scalars['json']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  exam_board_specification_content?: InputMaybe<Scalars['json']['input']>;
  intro_video_id?: InputMaybe<Scalars['Int']['input']>;
  national_curriculum_content?: InputMaybe<Scalars['json']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  planned_number_of_lessons?: InputMaybe<Scalars['Int']['input']>;
  prior_knowledge_requirements?: InputMaybe<Scalars['json']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Scalars['json']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  unit_id?: InputMaybe<Scalars['Int']['input']>;
  unit_programmes?: InputMaybe<Programme_Units_Arr_Rel_Insert_Input>;
  unit_programmes_all_states?: InputMaybe<Programme_Units_Arr_Rel_Insert_Input>;
  unit_threads?: InputMaybe<Thread_Units_Arr_Rel_Insert_Input>;
  unit_threads_all_states?: InputMaybe<Thread_Units_Arr_Rel_Insert_Input>;
  unit_uid?: InputMaybe<Scalars['bpchar']['input']>;
  unit_unitvariants?: InputMaybe<Unitvariants_Arr_Rel_Insert_Input>;
  unit_unitvariants_all_states?: InputMaybe<Unitvariants_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Units_Max_Fields = {
  __typename?: 'units_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  connection_future_unit_description?: Maybe<Scalars['String']['output']>;
  connection_future_unit_id?: Maybe<Scalars['Int']['output']>;
  connection_prior_unit_description?: Maybe<Scalars['String']['output']>;
  connection_prior_unit_id?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  intro_video_id?: Maybe<Scalars['Int']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  planned_number_of_lessons?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  unit_id?: Maybe<Scalars['Int']['output']>;
  unit_uid?: Maybe<Scalars['bpchar']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "units" */
export type Units_Max_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  connection_future_unit_description?: InputMaybe<Order_By>;
  connection_future_unit_id?: InputMaybe<Order_By>;
  connection_prior_unit_description?: InputMaybe<Order_By>;
  connection_prior_unit_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  notes?: InputMaybe<Order_By>;
  planned_number_of_lessons?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
  unit_uid?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Units_Min_Fields = {
  __typename?: 'units_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  connection_future_unit_description?: Maybe<Scalars['String']['output']>;
  connection_future_unit_id?: Maybe<Scalars['Int']['output']>;
  connection_prior_unit_description?: Maybe<Scalars['String']['output']>;
  connection_prior_unit_id?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  intro_video_id?: Maybe<Scalars['Int']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  planned_number_of_lessons?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  unit_id?: Maybe<Scalars['Int']['output']>;
  unit_uid?: Maybe<Scalars['bpchar']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "units" */
export type Units_Min_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  connection_future_unit_description?: InputMaybe<Order_By>;
  connection_future_unit_id?: InputMaybe<Order_By>;
  connection_prior_unit_description?: InputMaybe<Order_By>;
  connection_prior_unit_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  notes?: InputMaybe<Order_By>;
  planned_number_of_lessons?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
  unit_uid?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "units" */
export type Units_Mutation_Response = {
  __typename?: 'units_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Units>;
};

/** input type for inserting object relation for remote table "units" */
export type Units_Obj_Rel_Insert_Input = {
  data: Units_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Units_On_Conflict>;
};

/** on_conflict condition type for table "units" */
export type Units_On_Conflict = {
  constraint: Units_Constraint;
  update_columns?: Array<Units_Update_Column>;
  where?: InputMaybe<Units_Bool_Exp>;
};

/** Ordering options when selecting data from "units". */
export type Units_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  adaptable?: InputMaybe<Order_By>;
  connection_future_unit?: InputMaybe<Units_Order_By>;
  connection_future_unit_all_states_aggregate?: InputMaybe<Units_Aggregate_Order_By>;
  connection_future_unit_description?: InputMaybe<Order_By>;
  connection_future_unit_id?: InputMaybe<Order_By>;
  connection_prior_unit?: InputMaybe<Units_Order_By>;
  connection_prior_unit_all_states_aggregate?: InputMaybe<Units_Aggregate_Order_By>;
  connection_prior_unit_description?: InputMaybe<Order_By>;
  connection_prior_unit_id?: InputMaybe<Order_By>;
  connections_future_units?: InputMaybe<Order_By>;
  connections_prior_units?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  cross_subject_links?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  exam_board_specification_content?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  national_curriculum_content?: InputMaybe<Order_By>;
  notes?: InputMaybe<Order_By>;
  planned_number_of_lessons?: InputMaybe<Order_By>;
  prior_knowledge_requirements?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  tags?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
  unit_programmes_aggregate?: InputMaybe<Programme_Units_Aggregate_Order_By>;
  unit_programmes_all_states_aggregate?: InputMaybe<Programme_Units_Aggregate_Order_By>;
  unit_tags_aggregate?: InputMaybe<Cat_Tags_Aggregate_Order_By>;
  unit_threads_aggregate?: InputMaybe<Thread_Units_Aggregate_Order_By>;
  unit_threads_all_states_aggregate?: InputMaybe<Thread_Units_Aggregate_Order_By>;
  unit_uid?: InputMaybe<Order_By>;
  unit_unitvariants_aggregate?: InputMaybe<Unitvariants_Aggregate_Order_By>;
  unit_unitvariants_all_states_aggregate?: InputMaybe<Unitvariants_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: units */
export type Units_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  unit_id: Scalars['Int']['input'];
};

/** select columns of table "units" */
export enum Units_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  Adaptable = 'adaptable',
  /** column name */
  ConnectionFutureUnitDescription = 'connection_future_unit_description',
  /** column name */
  ConnectionFutureUnitId = 'connection_future_unit_id',
  /** column name */
  ConnectionPriorUnitDescription = 'connection_prior_unit_description',
  /** column name */
  ConnectionPriorUnitId = 'connection_prior_unit_id',
  /** column name */
  ConnectionsFutureUnits = 'connections_future_units',
  /** column name */
  ConnectionsPriorUnits = 'connections_prior_units',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CrossSubjectLinks = 'cross_subject_links',
  /** column name */
  Description = 'description',
  /** column name */
  ExamBoardSpecificationContent = 'exam_board_specification_content',
  /** column name */
  IntroVideoId = 'intro_video_id',
  /** column name */
  NationalCurriculumContent = 'national_curriculum_content',
  /** column name */
  Notes = 'notes',
  /** column name */
  PlannedNumberOfLessons = 'planned_number_of_lessons',
  /** column name */
  PriorKnowledgeRequirements = 'prior_knowledge_requirements',
  /** column name */
  Slug = 'slug',
  /** column name */
  Tags = 'tags',
  /** column name */
  Title = 'title',
  /** column name */
  UnitId = 'unit_id',
  /** column name */
  UnitUid = 'unit_uid',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "units_aggregate_bool_exp_bool_and_arguments_columns" columns of table "units" */
export enum Units_Select_Column_Units_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Deleted = '_deleted',
  /** column name */
  Adaptable = 'adaptable'
}

/** select "units_aggregate_bool_exp_bool_or_arguments_columns" columns of table "units" */
export enum Units_Select_Column_Units_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Deleted = '_deleted',
  /** column name */
  Adaptable = 'adaptable'
}

/** input type for updating data in table "units" */
export type Units_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  adaptable?: InputMaybe<Scalars['Boolean']['input']>;
  connection_future_unit_description?: InputMaybe<Scalars['String']['input']>;
  connection_future_unit_id?: InputMaybe<Scalars['Int']['input']>;
  connection_prior_unit_description?: InputMaybe<Scalars['String']['input']>;
  connection_prior_unit_id?: InputMaybe<Scalars['Int']['input']>;
  connections_future_units?: InputMaybe<Scalars['json']['input']>;
  connections_prior_units?: InputMaybe<Scalars['json']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  cross_subject_links?: InputMaybe<Scalars['json']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  exam_board_specification_content?: InputMaybe<Scalars['json']['input']>;
  intro_video_id?: InputMaybe<Scalars['Int']['input']>;
  national_curriculum_content?: InputMaybe<Scalars['json']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  planned_number_of_lessons?: InputMaybe<Scalars['Int']['input']>;
  prior_knowledge_requirements?: InputMaybe<Scalars['json']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Scalars['json']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  unit_id?: InputMaybe<Scalars['Int']['input']>;
  unit_uid?: InputMaybe<Scalars['bpchar']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Units_Stddev_Fields = {
  __typename?: 'units_stddev_fields';
  connection_future_unit_id?: Maybe<Scalars['Float']['output']>;
  connection_prior_unit_id?: Maybe<Scalars['Float']['output']>;
  intro_video_id?: Maybe<Scalars['Float']['output']>;
  planned_number_of_lessons?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "units" */
export type Units_Stddev_Order_By = {
  connection_future_unit_id?: InputMaybe<Order_By>;
  connection_prior_unit_id?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  planned_number_of_lessons?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Units_Stddev_Pop_Fields = {
  __typename?: 'units_stddev_pop_fields';
  connection_future_unit_id?: Maybe<Scalars['Float']['output']>;
  connection_prior_unit_id?: Maybe<Scalars['Float']['output']>;
  intro_video_id?: Maybe<Scalars['Float']['output']>;
  planned_number_of_lessons?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "units" */
export type Units_Stddev_Pop_Order_By = {
  connection_future_unit_id?: InputMaybe<Order_By>;
  connection_prior_unit_id?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  planned_number_of_lessons?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Units_Stddev_Samp_Fields = {
  __typename?: 'units_stddev_samp_fields';
  connection_future_unit_id?: Maybe<Scalars['Float']['output']>;
  connection_prior_unit_id?: Maybe<Scalars['Float']['output']>;
  intro_video_id?: Maybe<Scalars['Float']['output']>;
  planned_number_of_lessons?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "units" */
export type Units_Stddev_Samp_Order_By = {
  connection_future_unit_id?: InputMaybe<Order_By>;
  connection_prior_unit_id?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  planned_number_of_lessons?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "units" */
export type Units_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Units_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Units_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  adaptable?: InputMaybe<Scalars['Boolean']['input']>;
  connection_future_unit_description?: InputMaybe<Scalars['String']['input']>;
  connection_future_unit_id?: InputMaybe<Scalars['Int']['input']>;
  connection_prior_unit_description?: InputMaybe<Scalars['String']['input']>;
  connection_prior_unit_id?: InputMaybe<Scalars['Int']['input']>;
  connections_future_units?: InputMaybe<Scalars['json']['input']>;
  connections_prior_units?: InputMaybe<Scalars['json']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  cross_subject_links?: InputMaybe<Scalars['json']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  exam_board_specification_content?: InputMaybe<Scalars['json']['input']>;
  intro_video_id?: InputMaybe<Scalars['Int']['input']>;
  national_curriculum_content?: InputMaybe<Scalars['json']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  planned_number_of_lessons?: InputMaybe<Scalars['Int']['input']>;
  prior_knowledge_requirements?: InputMaybe<Scalars['json']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Scalars['json']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  unit_id?: InputMaybe<Scalars['Int']['input']>;
  unit_uid?: InputMaybe<Scalars['bpchar']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Units_Sum_Fields = {
  __typename?: 'units_sum_fields';
  connection_future_unit_id?: Maybe<Scalars['Int']['output']>;
  connection_prior_unit_id?: Maybe<Scalars['Int']['output']>;
  intro_video_id?: Maybe<Scalars['Int']['output']>;
  planned_number_of_lessons?: Maybe<Scalars['Int']['output']>;
  unit_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "units" */
export type Units_Sum_Order_By = {
  connection_future_unit_id?: InputMaybe<Order_By>;
  connection_prior_unit_id?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  planned_number_of_lessons?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** update columns of table "units" */
export enum Units_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  Adaptable = 'adaptable',
  /** column name */
  ConnectionFutureUnitDescription = 'connection_future_unit_description',
  /** column name */
  ConnectionFutureUnitId = 'connection_future_unit_id',
  /** column name */
  ConnectionPriorUnitDescription = 'connection_prior_unit_description',
  /** column name */
  ConnectionPriorUnitId = 'connection_prior_unit_id',
  /** column name */
  ConnectionsFutureUnits = 'connections_future_units',
  /** column name */
  ConnectionsPriorUnits = 'connections_prior_units',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CrossSubjectLinks = 'cross_subject_links',
  /** column name */
  Description = 'description',
  /** column name */
  ExamBoardSpecificationContent = 'exam_board_specification_content',
  /** column name */
  IntroVideoId = 'intro_video_id',
  /** column name */
  NationalCurriculumContent = 'national_curriculum_content',
  /** column name */
  Notes = 'notes',
  /** column name */
  PlannedNumberOfLessons = 'planned_number_of_lessons',
  /** column name */
  PriorKnowledgeRequirements = 'prior_knowledge_requirements',
  /** column name */
  Slug = 'slug',
  /** column name */
  Tags = 'tags',
  /** column name */
  Title = 'title',
  /** column name */
  UnitId = 'unit_id',
  /** column name */
  UnitUid = 'unit_uid',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Units_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Units_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Units_Set_Input>;
  /** filter the rows which have to be updated */
  where: Units_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Units_Var_Pop_Fields = {
  __typename?: 'units_var_pop_fields';
  connection_future_unit_id?: Maybe<Scalars['Float']['output']>;
  connection_prior_unit_id?: Maybe<Scalars['Float']['output']>;
  intro_video_id?: Maybe<Scalars['Float']['output']>;
  planned_number_of_lessons?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "units" */
export type Units_Var_Pop_Order_By = {
  connection_future_unit_id?: InputMaybe<Order_By>;
  connection_prior_unit_id?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  planned_number_of_lessons?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Units_Var_Samp_Fields = {
  __typename?: 'units_var_samp_fields';
  connection_future_unit_id?: Maybe<Scalars['Float']['output']>;
  connection_prior_unit_id?: Maybe<Scalars['Float']['output']>;
  intro_video_id?: Maybe<Scalars['Float']['output']>;
  planned_number_of_lessons?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "units" */
export type Units_Var_Samp_Order_By = {
  connection_future_unit_id?: InputMaybe<Order_By>;
  connection_prior_unit_id?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  planned_number_of_lessons?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Units_Variance_Fields = {
  __typename?: 'units_variance_fields';
  connection_future_unit_id?: Maybe<Scalars['Float']['output']>;
  connection_prior_unit_id?: Maybe<Scalars['Float']['output']>;
  intro_video_id?: Maybe<Scalars['Float']['output']>;
  planned_number_of_lessons?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "units" */
export type Units_Variance_Order_By = {
  connection_future_unit_id?: InputMaybe<Order_By>;
  connection_prior_unit_id?: InputMaybe<Order_By>;
  intro_video_id?: InputMaybe<Order_By>;
  planned_number_of_lessons?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "unitvariant_lessons" */
export type Unitvariant_Lessons = {
  __typename?: 'unitvariant_lessons';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  lesson?: Maybe<Lessons>;
  /** An array relationship */
  lesson_all_states: Array<Lessons>;
  /** An aggregate relationship */
  lesson_all_states_aggregate: Lessons_Aggregate;
  lesson_id: Scalars['Int']['output'];
  lesson_overrides: Scalars['jsonb']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  unitvariant?: Maybe<Unitvariants>;
  /** An array relationship */
  unitvariant_all_states: Array<Unitvariants>;
  /** An aggregate relationship */
  unitvariant_all_states_aggregate: Unitvariants_Aggregate;
  unitvariant_id: Scalars['Int']['output'];
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "unitvariant_lessons" */
export type Unitvariant_LessonsLesson_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Lessons_Order_By>>;
  where?: InputMaybe<Lessons_Bool_Exp>;
};


/** columns and relationships of "unitvariant_lessons" */
export type Unitvariant_LessonsLesson_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Lessons_Order_By>>;
  where?: InputMaybe<Lessons_Bool_Exp>;
};


/** columns and relationships of "unitvariant_lessons" */
export type Unitvariant_LessonsLesson_OverridesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "unitvariant_lessons" */
export type Unitvariant_LessonsUnitvariant_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Unitvariants_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariants_Order_By>>;
  where?: InputMaybe<Unitvariants_Bool_Exp>;
};


/** columns and relationships of "unitvariant_lessons" */
export type Unitvariant_LessonsUnitvariant_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Unitvariants_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariants_Order_By>>;
  where?: InputMaybe<Unitvariants_Bool_Exp>;
};

/** aggregated selection of "unitvariant_lessons" */
export type Unitvariant_Lessons_Aggregate = {
  __typename?: 'unitvariant_lessons_aggregate';
  aggregate?: Maybe<Unitvariant_Lessons_Aggregate_Fields>;
  nodes: Array<Unitvariant_Lessons>;
};

export type Unitvariant_Lessons_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Unitvariant_Lessons_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Unitvariant_Lessons_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Unitvariant_Lessons_Aggregate_Bool_Exp_Count>;
};

export type Unitvariant_Lessons_Aggregate_Bool_Exp_Bool_And = {
  arguments: Unitvariant_Lessons_Select_Column_Unitvariant_Lessons_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Unitvariant_Lessons_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Unitvariant_Lessons_Select_Column_Unitvariant_Lessons_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Unitvariant_Lessons_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Unitvariant_Lessons_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "unitvariant_lessons" */
export type Unitvariant_Lessons_Aggregate_Fields = {
  __typename?: 'unitvariant_lessons_aggregate_fields';
  avg?: Maybe<Unitvariant_Lessons_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Unitvariant_Lessons_Max_Fields>;
  min?: Maybe<Unitvariant_Lessons_Min_Fields>;
  stddev?: Maybe<Unitvariant_Lessons_Stddev_Fields>;
  stddev_pop?: Maybe<Unitvariant_Lessons_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Unitvariant_Lessons_Stddev_Samp_Fields>;
  sum?: Maybe<Unitvariant_Lessons_Sum_Fields>;
  var_pop?: Maybe<Unitvariant_Lessons_Var_Pop_Fields>;
  var_samp?: Maybe<Unitvariant_Lessons_Var_Samp_Fields>;
  variance?: Maybe<Unitvariant_Lessons_Variance_Fields>;
};


/** aggregate fields of "unitvariant_lessons" */
export type Unitvariant_Lessons_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Unitvariant_Lessons_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "unitvariant_lessons" */
export type Unitvariant_Lessons_Aggregate_Order_By = {
  avg?: InputMaybe<Unitvariant_Lessons_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Unitvariant_Lessons_Max_Order_By>;
  min?: InputMaybe<Unitvariant_Lessons_Min_Order_By>;
  stddev?: InputMaybe<Unitvariant_Lessons_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Unitvariant_Lessons_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Unitvariant_Lessons_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Unitvariant_Lessons_Sum_Order_By>;
  var_pop?: InputMaybe<Unitvariant_Lessons_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Unitvariant_Lessons_Var_Samp_Order_By>;
  variance?: InputMaybe<Unitvariant_Lessons_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Unitvariant_Lessons_Append_Input = {
  lesson_overrides?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "unitvariant_lessons" */
export type Unitvariant_Lessons_Arr_Rel_Insert_Input = {
  data: Array<Unitvariant_Lessons_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Unitvariant_Lessons_On_Conflict>;
};

/** aggregate avg on columns */
export type Unitvariant_Lessons_Avg_Fields = {
  __typename?: 'unitvariant_lessons_avg_fields';
  lesson_id?: Maybe<Scalars['Float']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  unitvariant_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "unitvariant_lessons" */
export type Unitvariant_Lessons_Avg_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "unitvariant_lessons". All fields are combined with a logical 'AND'. */
export type Unitvariant_Lessons_Bool_Exp = {
  _and?: InputMaybe<Array<Unitvariant_Lessons_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
  _or?: InputMaybe<Array<Unitvariant_Lessons_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  lesson?: InputMaybe<Lessons_Bool_Exp>;
  lesson_all_states?: InputMaybe<Lessons_Bool_Exp>;
  lesson_all_states_aggregate?: InputMaybe<Lessons_Aggregate_Bool_Exp>;
  lesson_id?: InputMaybe<Int_Comparison_Exp>;
  lesson_overrides?: InputMaybe<Jsonb_Comparison_Exp>;
  order?: InputMaybe<Int_Comparison_Exp>;
  unitvariant?: InputMaybe<Unitvariants_Bool_Exp>;
  unitvariant_all_states?: InputMaybe<Unitvariants_Bool_Exp>;
  unitvariant_all_states_aggregate?: InputMaybe<Unitvariants_Aggregate_Bool_Exp>;
  unitvariant_id?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "unitvariant_lessons" */
export enum Unitvariant_Lessons_Constraint {
  /** unique or primary key constraint on columns "lesson_id", "unitvariant_id", "_state" */
  UnitvariantLessonsPkey = 'unitvariant_lessons_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Unitvariant_Lessons_Delete_At_Path_Input = {
  lesson_overrides?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Unitvariant_Lessons_Delete_Elem_Input = {
  lesson_overrides?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Unitvariant_Lessons_Delete_Key_Input = {
  lesson_overrides?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "unitvariant_lessons" */
export type Unitvariant_Lessons_Inc_Input = {
  lesson_id?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  unitvariant_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "unitvariant_lessons" */
export type Unitvariant_Lessons_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  lesson?: InputMaybe<Lessons_Obj_Rel_Insert_Input>;
  lesson_all_states?: InputMaybe<Lessons_Arr_Rel_Insert_Input>;
  lesson_id?: InputMaybe<Scalars['Int']['input']>;
  lesson_overrides?: InputMaybe<Scalars['jsonb']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  unitvariant?: InputMaybe<Unitvariants_Obj_Rel_Insert_Input>;
  unitvariant_all_states?: InputMaybe<Unitvariants_Arr_Rel_Insert_Input>;
  unitvariant_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Unitvariant_Lessons_Max_Fields = {
  __typename?: 'unitvariant_lessons_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  lesson_id?: Maybe<Scalars['Int']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  unitvariant_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "unitvariant_lessons" */
export type Unitvariant_Lessons_Max_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Unitvariant_Lessons_Min_Fields = {
  __typename?: 'unitvariant_lessons_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  lesson_id?: Maybe<Scalars['Int']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  unitvariant_id?: Maybe<Scalars['Int']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "unitvariant_lessons" */
export type Unitvariant_Lessons_Min_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "unitvariant_lessons" */
export type Unitvariant_Lessons_Mutation_Response = {
  __typename?: 'unitvariant_lessons_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Unitvariant_Lessons>;
};

/** on_conflict condition type for table "unitvariant_lessons" */
export type Unitvariant_Lessons_On_Conflict = {
  constraint: Unitvariant_Lessons_Constraint;
  update_columns?: Array<Unitvariant_Lessons_Update_Column>;
  where?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
};

/** Ordering options when selecting data from "unitvariant_lessons". */
export type Unitvariant_Lessons_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  lesson?: InputMaybe<Lessons_Order_By>;
  lesson_all_states_aggregate?: InputMaybe<Lessons_Aggregate_Order_By>;
  lesson_id?: InputMaybe<Order_By>;
  lesson_overrides?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  unitvariant?: InputMaybe<Unitvariants_Order_By>;
  unitvariant_all_states_aggregate?: InputMaybe<Unitvariants_Aggregate_Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: unitvariant_lessons */
export type Unitvariant_Lessons_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  lesson_id: Scalars['Int']['input'];
  unitvariant_id: Scalars['Int']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Unitvariant_Lessons_Prepend_Input = {
  lesson_overrides?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "unitvariant_lessons" */
export enum Unitvariant_Lessons_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  LessonId = 'lesson_id',
  /** column name */
  LessonOverrides = 'lesson_overrides',
  /** column name */
  Order = 'order',
  /** column name */
  UnitvariantId = 'unitvariant_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "unitvariant_lessons_aggregate_bool_exp_bool_and_arguments_columns" columns of table "unitvariant_lessons" */
export enum Unitvariant_Lessons_Select_Column_Unitvariant_Lessons_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** select "unitvariant_lessons_aggregate_bool_exp_bool_or_arguments_columns" columns of table "unitvariant_lessons" */
export enum Unitvariant_Lessons_Select_Column_Unitvariant_Lessons_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** input type for updating data in table "unitvariant_lessons" */
export type Unitvariant_Lessons_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  lesson_id?: InputMaybe<Scalars['Int']['input']>;
  lesson_overrides?: InputMaybe<Scalars['jsonb']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  unitvariant_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Unitvariant_Lessons_Stddev_Fields = {
  __typename?: 'unitvariant_lessons_stddev_fields';
  lesson_id?: Maybe<Scalars['Float']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  unitvariant_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "unitvariant_lessons" */
export type Unitvariant_Lessons_Stddev_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Unitvariant_Lessons_Stddev_Pop_Fields = {
  __typename?: 'unitvariant_lessons_stddev_pop_fields';
  lesson_id?: Maybe<Scalars['Float']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  unitvariant_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "unitvariant_lessons" */
export type Unitvariant_Lessons_Stddev_Pop_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Unitvariant_Lessons_Stddev_Samp_Fields = {
  __typename?: 'unitvariant_lessons_stddev_samp_fields';
  lesson_id?: Maybe<Scalars['Float']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  unitvariant_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "unitvariant_lessons" */
export type Unitvariant_Lessons_Stddev_Samp_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "unitvariant_lessons" */
export type Unitvariant_Lessons_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Unitvariant_Lessons_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Unitvariant_Lessons_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  lesson_id?: InputMaybe<Scalars['Int']['input']>;
  lesson_overrides?: InputMaybe<Scalars['jsonb']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  unitvariant_id?: InputMaybe<Scalars['Int']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Unitvariant_Lessons_Sum_Fields = {
  __typename?: 'unitvariant_lessons_sum_fields';
  lesson_id?: Maybe<Scalars['Int']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  unitvariant_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "unitvariant_lessons" */
export type Unitvariant_Lessons_Sum_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
};

/** update columns of table "unitvariant_lessons" */
export enum Unitvariant_Lessons_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  LessonId = 'lesson_id',
  /** column name */
  LessonOverrides = 'lesson_overrides',
  /** column name */
  Order = 'order',
  /** column name */
  UnitvariantId = 'unitvariant_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Unitvariant_Lessons_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Unitvariant_Lessons_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Unitvariant_Lessons_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Unitvariant_Lessons_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Unitvariant_Lessons_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Unitvariant_Lessons_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Unitvariant_Lessons_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Unitvariant_Lessons_Set_Input>;
  /** filter the rows which have to be updated */
  where: Unitvariant_Lessons_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Unitvariant_Lessons_Var_Pop_Fields = {
  __typename?: 'unitvariant_lessons_var_pop_fields';
  lesson_id?: Maybe<Scalars['Float']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  unitvariant_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "unitvariant_lessons" */
export type Unitvariant_Lessons_Var_Pop_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Unitvariant_Lessons_Var_Samp_Fields = {
  __typename?: 'unitvariant_lessons_var_samp_fields';
  lesson_id?: Maybe<Scalars['Float']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  unitvariant_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "unitvariant_lessons" */
export type Unitvariant_Lessons_Var_Samp_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Unitvariant_Lessons_Variance_Fields = {
  __typename?: 'unitvariant_lessons_variance_fields';
  lesson_id?: Maybe<Scalars['Float']['output']>;
  order?: Maybe<Scalars['Float']['output']>;
  unitvariant_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "unitvariant_lessons" */
export type Unitvariant_Lessons_Variance_Order_By = {
  lesson_id?: InputMaybe<Order_By>;
  order?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "unitvariants" */
export type Unitvariants = {
  __typename?: 'unitvariants';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  programme_fields: Scalars['jsonb']['output'];
  quiz_id?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  unit?: Maybe<Units>;
  unit_id: Scalars['Int']['output'];
  unit_overrides: Scalars['jsonb']['output'];
  /** An array relationship */
  units_all_states: Array<Units>;
  /** An aggregate relationship */
  units_all_states_aggregate: Units_Aggregate;
  unitvariant_id: Scalars['Int']['output'];
  /** An array relationship */
  unitvariant_lessons: Array<Unitvariant_Lessons>;
  /** An aggregate relationship */
  unitvariant_lessons_aggregate: Unitvariant_Lessons_Aggregate;
  /** An array relationship */
  unitvariant_lessons_all_states: Array<Unitvariant_Lessons>;
  /** An aggregate relationship */
  unitvariant_lessons_all_states_aggregate: Unitvariant_Lessons_Aggregate;
  unitvariant_uid?: Maybe<Scalars['bpchar']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};


/** columns and relationships of "unitvariants" */
export type UnitvariantsProgramme_FieldsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "unitvariants" */
export type UnitvariantsUnit_OverridesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "unitvariants" */
export type UnitvariantsUnits_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Units_Order_By>>;
  where?: InputMaybe<Units_Bool_Exp>;
};


/** columns and relationships of "unitvariants" */
export type UnitvariantsUnits_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Units_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Units_Order_By>>;
  where?: InputMaybe<Units_Bool_Exp>;
};


/** columns and relationships of "unitvariants" */
export type UnitvariantsUnitvariant_LessonsArgs = {
  distinct_on?: InputMaybe<Array<Unitvariant_Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariant_Lessons_Order_By>>;
  where?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
};


/** columns and relationships of "unitvariants" */
export type UnitvariantsUnitvariant_Lessons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Unitvariant_Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariant_Lessons_Order_By>>;
  where?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
};


/** columns and relationships of "unitvariants" */
export type UnitvariantsUnitvariant_Lessons_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Unitvariant_Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariant_Lessons_Order_By>>;
  where?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
};


/** columns and relationships of "unitvariants" */
export type UnitvariantsUnitvariant_Lessons_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Unitvariant_Lessons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Unitvariant_Lessons_Order_By>>;
  where?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
};

/** aggregated selection of "unitvariants" */
export type Unitvariants_Aggregate = {
  __typename?: 'unitvariants_aggregate';
  aggregate?: Maybe<Unitvariants_Aggregate_Fields>;
  nodes: Array<Unitvariants>;
};

export type Unitvariants_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Unitvariants_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Unitvariants_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Unitvariants_Aggregate_Bool_Exp_Count>;
};

export type Unitvariants_Aggregate_Bool_Exp_Bool_And = {
  arguments: Unitvariants_Select_Column_Unitvariants_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Unitvariants_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Unitvariants_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Unitvariants_Select_Column_Unitvariants_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Unitvariants_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Unitvariants_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Unitvariants_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Unitvariants_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "unitvariants" */
export type Unitvariants_Aggregate_Fields = {
  __typename?: 'unitvariants_aggregate_fields';
  avg?: Maybe<Unitvariants_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Unitvariants_Max_Fields>;
  min?: Maybe<Unitvariants_Min_Fields>;
  stddev?: Maybe<Unitvariants_Stddev_Fields>;
  stddev_pop?: Maybe<Unitvariants_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Unitvariants_Stddev_Samp_Fields>;
  sum?: Maybe<Unitvariants_Sum_Fields>;
  var_pop?: Maybe<Unitvariants_Var_Pop_Fields>;
  var_samp?: Maybe<Unitvariants_Var_Samp_Fields>;
  variance?: Maybe<Unitvariants_Variance_Fields>;
};


/** aggregate fields of "unitvariants" */
export type Unitvariants_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Unitvariants_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "unitvariants" */
export type Unitvariants_Aggregate_Order_By = {
  avg?: InputMaybe<Unitvariants_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Unitvariants_Max_Order_By>;
  min?: InputMaybe<Unitvariants_Min_Order_By>;
  stddev?: InputMaybe<Unitvariants_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Unitvariants_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Unitvariants_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Unitvariants_Sum_Order_By>;
  var_pop?: InputMaybe<Unitvariants_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Unitvariants_Var_Samp_Order_By>;
  variance?: InputMaybe<Unitvariants_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Unitvariants_Append_Input = {
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  unit_overrides?: InputMaybe<Scalars['jsonb']['input']>;
};

/** input type for inserting array relation for remote table "unitvariants" */
export type Unitvariants_Arr_Rel_Insert_Input = {
  data: Array<Unitvariants_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Unitvariants_On_Conflict>;
};

/** aggregate avg on columns */
export type Unitvariants_Avg_Fields = {
  __typename?: 'unitvariants_avg_fields';
  quiz_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
  unitvariant_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "unitvariants" */
export type Unitvariants_Avg_Order_By = {
  quiz_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "unitvariants". All fields are combined with a logical 'AND'. */
export type Unitvariants_Bool_Exp = {
  _and?: InputMaybe<Array<Unitvariants_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Unitvariants_Bool_Exp>;
  _or?: InputMaybe<Array<Unitvariants_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  programme_fields?: InputMaybe<Jsonb_Comparison_Exp>;
  quiz_id?: InputMaybe<Int_Comparison_Exp>;
  unit?: InputMaybe<Units_Bool_Exp>;
  unit_id?: InputMaybe<Int_Comparison_Exp>;
  unit_overrides?: InputMaybe<Jsonb_Comparison_Exp>;
  units_all_states?: InputMaybe<Units_Bool_Exp>;
  units_all_states_aggregate?: InputMaybe<Units_Aggregate_Bool_Exp>;
  unitvariant_id?: InputMaybe<Int_Comparison_Exp>;
  unitvariant_lessons?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
  unitvariant_lessons_aggregate?: InputMaybe<Unitvariant_Lessons_Aggregate_Bool_Exp>;
  unitvariant_lessons_all_states?: InputMaybe<Unitvariant_Lessons_Bool_Exp>;
  unitvariant_lessons_all_states_aggregate?: InputMaybe<Unitvariant_Lessons_Aggregate_Bool_Exp>;
  unitvariant_uid?: InputMaybe<Bpchar_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "unitvariants" */
export enum Unitvariants_Constraint {
  /** unique or primary key constraint on columns "unitvariant_id", "_state" */
  UnitvariantsPkey = 'unitvariants_pkey',
  /** unique or primary key constraint on columns "unit_id", "programme_fields", "_state" */
  UnitvariantsUnitIdProgrammeFieldsStateKey = 'unitvariants_unit_id_programme_fields__state_key'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Unitvariants_Delete_At_Path_Input = {
  programme_fields?: InputMaybe<Array<Scalars['String']['input']>>;
  unit_overrides?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Unitvariants_Delete_Elem_Input = {
  programme_fields?: InputMaybe<Scalars['Int']['input']>;
  unit_overrides?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Unitvariants_Delete_Key_Input = {
  programme_fields?: InputMaybe<Scalars['String']['input']>;
  unit_overrides?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "unitvariants" */
export type Unitvariants_Inc_Input = {
  quiz_id?: InputMaybe<Scalars['Int']['input']>;
  unit_id?: InputMaybe<Scalars['Int']['input']>;
  unitvariant_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "unitvariants" */
export type Unitvariants_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  quiz_id?: InputMaybe<Scalars['Int']['input']>;
  unit?: InputMaybe<Units_Obj_Rel_Insert_Input>;
  unit_id?: InputMaybe<Scalars['Int']['input']>;
  unit_overrides?: InputMaybe<Scalars['jsonb']['input']>;
  units_all_states?: InputMaybe<Units_Arr_Rel_Insert_Input>;
  unitvariant_id?: InputMaybe<Scalars['Int']['input']>;
  unitvariant_lessons?: InputMaybe<Unitvariant_Lessons_Arr_Rel_Insert_Input>;
  unitvariant_lessons_all_states?: InputMaybe<Unitvariant_Lessons_Arr_Rel_Insert_Input>;
  unitvariant_uid?: InputMaybe<Scalars['bpchar']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Unitvariants_Max_Fields = {
  __typename?: 'unitvariants_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  quiz_id?: Maybe<Scalars['Int']['output']>;
  unit_id?: Maybe<Scalars['Int']['output']>;
  unitvariant_id?: Maybe<Scalars['Int']['output']>;
  unitvariant_uid?: Maybe<Scalars['bpchar']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "unitvariants" */
export type Unitvariants_Max_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
  unitvariant_uid?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Unitvariants_Min_Fields = {
  __typename?: 'unitvariants_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  quiz_id?: Maybe<Scalars['Int']['output']>;
  unit_id?: Maybe<Scalars['Int']['output']>;
  unitvariant_id?: Maybe<Scalars['Int']['output']>;
  unitvariant_uid?: Maybe<Scalars['bpchar']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "unitvariants" */
export type Unitvariants_Min_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
  unitvariant_uid?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "unitvariants" */
export type Unitvariants_Mutation_Response = {
  __typename?: 'unitvariants_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Unitvariants>;
};

/** input type for inserting object relation for remote table "unitvariants" */
export type Unitvariants_Obj_Rel_Insert_Input = {
  data: Unitvariants_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Unitvariants_On_Conflict>;
};

/** on_conflict condition type for table "unitvariants" */
export type Unitvariants_On_Conflict = {
  constraint: Unitvariants_Constraint;
  update_columns?: Array<Unitvariants_Update_Column>;
  where?: InputMaybe<Unitvariants_Bool_Exp>;
};

/** Ordering options when selecting data from "unitvariants". */
export type Unitvariants_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  programme_fields?: InputMaybe<Order_By>;
  quiz_id?: InputMaybe<Order_By>;
  unit?: InputMaybe<Units_Order_By>;
  unit_id?: InputMaybe<Order_By>;
  unit_overrides?: InputMaybe<Order_By>;
  units_all_states_aggregate?: InputMaybe<Units_Aggregate_Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
  unitvariant_lessons_aggregate?: InputMaybe<Unitvariant_Lessons_Aggregate_Order_By>;
  unitvariant_lessons_all_states_aggregate?: InputMaybe<Unitvariant_Lessons_Aggregate_Order_By>;
  unitvariant_uid?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: unitvariants */
export type Unitvariants_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  unitvariant_id: Scalars['Int']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Unitvariants_Prepend_Input = {
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  unit_overrides?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "unitvariants" */
export enum Unitvariants_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  ProgrammeFields = 'programme_fields',
  /** column name */
  QuizId = 'quiz_id',
  /** column name */
  UnitId = 'unit_id',
  /** column name */
  UnitOverrides = 'unit_overrides',
  /** column name */
  UnitvariantId = 'unitvariant_id',
  /** column name */
  UnitvariantUid = 'unitvariant_uid',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "unitvariants_aggregate_bool_exp_bool_and_arguments_columns" columns of table "unitvariants" */
export enum Unitvariants_Select_Column_Unitvariants_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** select "unitvariants_aggregate_bool_exp_bool_or_arguments_columns" columns of table "unitvariants" */
export enum Unitvariants_Select_Column_Unitvariants_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Deleted = '_deleted'
}

/** input type for updating data in table "unitvariants" */
export type Unitvariants_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  quiz_id?: InputMaybe<Scalars['Int']['input']>;
  unit_id?: InputMaybe<Scalars['Int']['input']>;
  unit_overrides?: InputMaybe<Scalars['jsonb']['input']>;
  unitvariant_id?: InputMaybe<Scalars['Int']['input']>;
  unitvariant_uid?: InputMaybe<Scalars['bpchar']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Unitvariants_Stddev_Fields = {
  __typename?: 'unitvariants_stddev_fields';
  quiz_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
  unitvariant_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "unitvariants" */
export type Unitvariants_Stddev_Order_By = {
  quiz_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Unitvariants_Stddev_Pop_Fields = {
  __typename?: 'unitvariants_stddev_pop_fields';
  quiz_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
  unitvariant_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "unitvariants" */
export type Unitvariants_Stddev_Pop_Order_By = {
  quiz_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Unitvariants_Stddev_Samp_Fields = {
  __typename?: 'unitvariants_stddev_samp_fields';
  quiz_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
  unitvariant_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "unitvariants" */
export type Unitvariants_Stddev_Samp_Order_By = {
  quiz_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "unitvariants" */
export type Unitvariants_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Unitvariants_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Unitvariants_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  programme_fields?: InputMaybe<Scalars['jsonb']['input']>;
  quiz_id?: InputMaybe<Scalars['Int']['input']>;
  unit_id?: InputMaybe<Scalars['Int']['input']>;
  unit_overrides?: InputMaybe<Scalars['jsonb']['input']>;
  unitvariant_id?: InputMaybe<Scalars['Int']['input']>;
  unitvariant_uid?: InputMaybe<Scalars['bpchar']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Unitvariants_Sum_Fields = {
  __typename?: 'unitvariants_sum_fields';
  quiz_id?: Maybe<Scalars['Int']['output']>;
  unit_id?: Maybe<Scalars['Int']['output']>;
  unitvariant_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "unitvariants" */
export type Unitvariants_Sum_Order_By = {
  quiz_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
};

/** update columns of table "unitvariants" */
export enum Unitvariants_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  ProgrammeFields = 'programme_fields',
  /** column name */
  QuizId = 'quiz_id',
  /** column name */
  UnitId = 'unit_id',
  /** column name */
  UnitOverrides = 'unit_overrides',
  /** column name */
  UnitvariantId = 'unitvariant_id',
  /** column name */
  UnitvariantUid = 'unitvariant_uid',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Unitvariants_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Unitvariants_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Unitvariants_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Unitvariants_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Unitvariants_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Unitvariants_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Unitvariants_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Unitvariants_Set_Input>;
  /** filter the rows which have to be updated */
  where: Unitvariants_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Unitvariants_Var_Pop_Fields = {
  __typename?: 'unitvariants_var_pop_fields';
  quiz_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
  unitvariant_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "unitvariants" */
export type Unitvariants_Var_Pop_Order_By = {
  quiz_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Unitvariants_Var_Samp_Fields = {
  __typename?: 'unitvariants_var_samp_fields';
  quiz_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
  unitvariant_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "unitvariants" */
export type Unitvariants_Var_Samp_Order_By = {
  quiz_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Unitvariants_Variance_Fields = {
  __typename?: 'unitvariants_variance_fields';
  quiz_id?: Maybe<Scalars['Float']['output']>;
  unit_id?: Maybe<Scalars['Float']['output']>;
  unitvariant_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "unitvariants" */
export type Unitvariants_Variance_Order_By = {
  quiz_id?: InputMaybe<Order_By>;
  unit_id?: InputMaybe<Order_By>;
  unitvariant_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "videocaptions" */
export type Videocaptions = {
  __typename?: 'videocaptions';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  bad_language_detected: Scalars['Boolean']['output'];
  caption_id: Scalars['Int']['output'];
  caption_uid?: Maybe<Scalars['bpchar']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  inappropriate_words?: Maybe<Scalars['json']['output']>;
  ingest_id?: Maybe<Scalars['String']['output']>;
  language_approved: Scalars['Boolean']['output'];
  transcript?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  video?: Maybe<Videos>;
  /** An array relationship */
  video_all_states: Array<Videos>;
  /** An aggregate relationship */
  video_all_states_aggregate: Videos_Aggregate;
};


/** columns and relationships of "videocaptions" */
export type VideocaptionsInappropriate_WordsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "videocaptions" */
export type VideocaptionsVideo_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Videos_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Videos_Order_By>>;
  where?: InputMaybe<Videos_Bool_Exp>;
};


/** columns and relationships of "videocaptions" */
export type VideocaptionsVideo_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Videos_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Videos_Order_By>>;
  where?: InputMaybe<Videos_Bool_Exp>;
};

/** aggregated selection of "videocaptions" */
export type Videocaptions_Aggregate = {
  __typename?: 'videocaptions_aggregate';
  aggregate?: Maybe<Videocaptions_Aggregate_Fields>;
  nodes: Array<Videocaptions>;
};

export type Videocaptions_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Videocaptions_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Videocaptions_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Videocaptions_Aggregate_Bool_Exp_Count>;
};

export type Videocaptions_Aggregate_Bool_Exp_Bool_And = {
  arguments: Videocaptions_Select_Column_Videocaptions_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Videocaptions_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Videocaptions_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Videocaptions_Select_Column_Videocaptions_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Videocaptions_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Videocaptions_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Videocaptions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Videocaptions_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "videocaptions" */
export type Videocaptions_Aggregate_Fields = {
  __typename?: 'videocaptions_aggregate_fields';
  avg?: Maybe<Videocaptions_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Videocaptions_Max_Fields>;
  min?: Maybe<Videocaptions_Min_Fields>;
  stddev?: Maybe<Videocaptions_Stddev_Fields>;
  stddev_pop?: Maybe<Videocaptions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Videocaptions_Stddev_Samp_Fields>;
  sum?: Maybe<Videocaptions_Sum_Fields>;
  var_pop?: Maybe<Videocaptions_Var_Pop_Fields>;
  var_samp?: Maybe<Videocaptions_Var_Samp_Fields>;
  variance?: Maybe<Videocaptions_Variance_Fields>;
};


/** aggregate fields of "videocaptions" */
export type Videocaptions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Videocaptions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "videocaptions" */
export type Videocaptions_Aggregate_Order_By = {
  avg?: InputMaybe<Videocaptions_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Videocaptions_Max_Order_By>;
  min?: InputMaybe<Videocaptions_Min_Order_By>;
  stddev?: InputMaybe<Videocaptions_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Videocaptions_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Videocaptions_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Videocaptions_Sum_Order_By>;
  var_pop?: InputMaybe<Videocaptions_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Videocaptions_Var_Samp_Order_By>;
  variance?: InputMaybe<Videocaptions_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "videocaptions" */
export type Videocaptions_Arr_Rel_Insert_Input = {
  data: Array<Videocaptions_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Videocaptions_On_Conflict>;
};

/** aggregate avg on columns */
export type Videocaptions_Avg_Fields = {
  __typename?: 'videocaptions_avg_fields';
  caption_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "videocaptions" */
export type Videocaptions_Avg_Order_By = {
  caption_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "videocaptions". All fields are combined with a logical 'AND'. */
export type Videocaptions_Bool_Exp = {
  _and?: InputMaybe<Array<Videocaptions_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Videocaptions_Bool_Exp>;
  _or?: InputMaybe<Array<Videocaptions_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  bad_language_detected?: InputMaybe<Boolean_Comparison_Exp>;
  caption_id?: InputMaybe<Int_Comparison_Exp>;
  caption_uid?: InputMaybe<Bpchar_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  inappropriate_words?: InputMaybe<Json_Comparison_Exp>;
  ingest_id?: InputMaybe<String_Comparison_Exp>;
  language_approved?: InputMaybe<Boolean_Comparison_Exp>;
  transcript?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  video?: InputMaybe<Videos_Bool_Exp>;
  video_all_states?: InputMaybe<Videos_Bool_Exp>;
  video_all_states_aggregate?: InputMaybe<Videos_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "videocaptions" */
export enum Videocaptions_Constraint {
  /** unique or primary key constraint on columns "caption_id", "_state" */
  VideocaptionsPkey = 'videocaptions_pkey'
}

/** input type for incrementing numeric columns in table "videocaptions" */
export type Videocaptions_Inc_Input = {
  caption_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "videocaptions" */
export type Videocaptions_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  bad_language_detected?: InputMaybe<Scalars['Boolean']['input']>;
  caption_id?: InputMaybe<Scalars['Int']['input']>;
  caption_uid?: InputMaybe<Scalars['bpchar']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  inappropriate_words?: InputMaybe<Scalars['json']['input']>;
  ingest_id?: InputMaybe<Scalars['String']['input']>;
  language_approved?: InputMaybe<Scalars['Boolean']['input']>;
  transcript?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  video?: InputMaybe<Videos_Obj_Rel_Insert_Input>;
  video_all_states?: InputMaybe<Videos_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Videocaptions_Max_Fields = {
  __typename?: 'videocaptions_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  caption_id?: Maybe<Scalars['Int']['output']>;
  caption_uid?: Maybe<Scalars['bpchar']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  ingest_id?: Maybe<Scalars['String']['output']>;
  transcript?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "videocaptions" */
export type Videocaptions_Max_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  caption_id?: InputMaybe<Order_By>;
  caption_uid?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  ingest_id?: InputMaybe<Order_By>;
  transcript?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Videocaptions_Min_Fields = {
  __typename?: 'videocaptions_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  caption_id?: Maybe<Scalars['Int']['output']>;
  caption_uid?: Maybe<Scalars['bpchar']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  ingest_id?: Maybe<Scalars['String']['output']>;
  transcript?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "videocaptions" */
export type Videocaptions_Min_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  caption_id?: InputMaybe<Order_By>;
  caption_uid?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  ingest_id?: InputMaybe<Order_By>;
  transcript?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "videocaptions" */
export type Videocaptions_Mutation_Response = {
  __typename?: 'videocaptions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Videocaptions>;
};

/** input type for inserting object relation for remote table "videocaptions" */
export type Videocaptions_Obj_Rel_Insert_Input = {
  data: Videocaptions_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Videocaptions_On_Conflict>;
};

/** on_conflict condition type for table "videocaptions" */
export type Videocaptions_On_Conflict = {
  constraint: Videocaptions_Constraint;
  update_columns?: Array<Videocaptions_Update_Column>;
  where?: InputMaybe<Videocaptions_Bool_Exp>;
};

/** Ordering options when selecting data from "videocaptions". */
export type Videocaptions_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  bad_language_detected?: InputMaybe<Order_By>;
  caption_id?: InputMaybe<Order_By>;
  caption_uid?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  inappropriate_words?: InputMaybe<Order_By>;
  ingest_id?: InputMaybe<Order_By>;
  language_approved?: InputMaybe<Order_By>;
  transcript?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  video?: InputMaybe<Videos_Order_By>;
  video_all_states_aggregate?: InputMaybe<Videos_Aggregate_Order_By>;
};

/** primary key columns input for table: videocaptions */
export type Videocaptions_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  caption_id: Scalars['Int']['input'];
};

/** select columns of table "videocaptions" */
export enum Videocaptions_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  BadLanguageDetected = 'bad_language_detected',
  /** column name */
  CaptionId = 'caption_id',
  /** column name */
  CaptionUid = 'caption_uid',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  InappropriateWords = 'inappropriate_words',
  /** column name */
  IngestId = 'ingest_id',
  /** column name */
  LanguageApproved = 'language_approved',
  /** column name */
  Transcript = 'transcript',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "videocaptions_aggregate_bool_exp_bool_and_arguments_columns" columns of table "videocaptions" */
export enum Videocaptions_Select_Column_Videocaptions_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Deleted = '_deleted',
  /** column name */
  BadLanguageDetected = 'bad_language_detected',
  /** column name */
  LanguageApproved = 'language_approved'
}

/** select "videocaptions_aggregate_bool_exp_bool_or_arguments_columns" columns of table "videocaptions" */
export enum Videocaptions_Select_Column_Videocaptions_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Deleted = '_deleted',
  /** column name */
  BadLanguageDetected = 'bad_language_detected',
  /** column name */
  LanguageApproved = 'language_approved'
}

/** input type for updating data in table "videocaptions" */
export type Videocaptions_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  bad_language_detected?: InputMaybe<Scalars['Boolean']['input']>;
  caption_id?: InputMaybe<Scalars['Int']['input']>;
  caption_uid?: InputMaybe<Scalars['bpchar']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  inappropriate_words?: InputMaybe<Scalars['json']['input']>;
  ingest_id?: InputMaybe<Scalars['String']['input']>;
  language_approved?: InputMaybe<Scalars['Boolean']['input']>;
  transcript?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Videocaptions_Stddev_Fields = {
  __typename?: 'videocaptions_stddev_fields';
  caption_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "videocaptions" */
export type Videocaptions_Stddev_Order_By = {
  caption_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Videocaptions_Stddev_Pop_Fields = {
  __typename?: 'videocaptions_stddev_pop_fields';
  caption_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "videocaptions" */
export type Videocaptions_Stddev_Pop_Order_By = {
  caption_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Videocaptions_Stddev_Samp_Fields = {
  __typename?: 'videocaptions_stddev_samp_fields';
  caption_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "videocaptions" */
export type Videocaptions_Stddev_Samp_Order_By = {
  caption_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "videocaptions" */
export type Videocaptions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Videocaptions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Videocaptions_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  bad_language_detected?: InputMaybe<Scalars['Boolean']['input']>;
  caption_id?: InputMaybe<Scalars['Int']['input']>;
  caption_uid?: InputMaybe<Scalars['bpchar']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  inappropriate_words?: InputMaybe<Scalars['json']['input']>;
  ingest_id?: InputMaybe<Scalars['String']['input']>;
  language_approved?: InputMaybe<Scalars['Boolean']['input']>;
  transcript?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Videocaptions_Sum_Fields = {
  __typename?: 'videocaptions_sum_fields';
  caption_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "videocaptions" */
export type Videocaptions_Sum_Order_By = {
  caption_id?: InputMaybe<Order_By>;
};

/** update columns of table "videocaptions" */
export enum Videocaptions_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  BadLanguageDetected = 'bad_language_detected',
  /** column name */
  CaptionId = 'caption_id',
  /** column name */
  CaptionUid = 'caption_uid',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  InappropriateWords = 'inappropriate_words',
  /** column name */
  IngestId = 'ingest_id',
  /** column name */
  LanguageApproved = 'language_approved',
  /** column name */
  Transcript = 'transcript',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Videocaptions_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Videocaptions_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Videocaptions_Set_Input>;
  /** filter the rows which have to be updated */
  where: Videocaptions_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Videocaptions_Var_Pop_Fields = {
  __typename?: 'videocaptions_var_pop_fields';
  caption_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "videocaptions" */
export type Videocaptions_Var_Pop_Order_By = {
  caption_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Videocaptions_Var_Samp_Fields = {
  __typename?: 'videocaptions_var_samp_fields';
  caption_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "videocaptions" */
export type Videocaptions_Var_Samp_Order_By = {
  caption_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Videocaptions_Variance_Fields = {
  __typename?: 'videocaptions_variance_fields';
  caption_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "videocaptions" */
export type Videocaptions_Variance_Order_By = {
  caption_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "videos" */
export type Videos = {
  __typename?: 'videos';
  _cohort: Scalars['String']['output'];
  _deleted: Scalars['Boolean']['output'];
  _state: Scalars['String']['output'];
  /** An object relationship */
  caption?: Maybe<Videocaptions>;
  /** An array relationship */
  caption_all_states: Array<Videocaptions>;
  /** An aggregate relationship */
  caption_all_states_aggregate: Videocaptions_Aggregate;
  caption_id?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  ingest_id?: Maybe<Scalars['String']['output']>;
  mux_asset_id: Scalars['String']['output'];
  mux_playback_id?: Maybe<Scalars['String']['output']>;
  signed: Scalars['Boolean']['output'];
  signed_stream_id?: Maybe<Scalars['String']['output']>;
  text_track_id?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  video_id: Scalars['Int']['output'];
  video_uid?: Maybe<Scalars['bpchar']['output']>;
};


/** columns and relationships of "videos" */
export type VideosCaption_All_StatesArgs = {
  distinct_on?: InputMaybe<Array<Videocaptions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Videocaptions_Order_By>>;
  where?: InputMaybe<Videocaptions_Bool_Exp>;
};


/** columns and relationships of "videos" */
export type VideosCaption_All_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Videocaptions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Videocaptions_Order_By>>;
  where?: InputMaybe<Videocaptions_Bool_Exp>;
};

/** aggregated selection of "videos" */
export type Videos_Aggregate = {
  __typename?: 'videos_aggregate';
  aggregate?: Maybe<Videos_Aggregate_Fields>;
  nodes: Array<Videos>;
};

export type Videos_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Videos_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Videos_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Videos_Aggregate_Bool_Exp_Count>;
};

export type Videos_Aggregate_Bool_Exp_Bool_And = {
  arguments: Videos_Select_Column_Videos_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Videos_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Videos_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Videos_Select_Column_Videos_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Videos_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Videos_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Videos_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Videos_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "videos" */
export type Videos_Aggregate_Fields = {
  __typename?: 'videos_aggregate_fields';
  avg?: Maybe<Videos_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Videos_Max_Fields>;
  min?: Maybe<Videos_Min_Fields>;
  stddev?: Maybe<Videos_Stddev_Fields>;
  stddev_pop?: Maybe<Videos_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Videos_Stddev_Samp_Fields>;
  sum?: Maybe<Videos_Sum_Fields>;
  var_pop?: Maybe<Videos_Var_Pop_Fields>;
  var_samp?: Maybe<Videos_Var_Samp_Fields>;
  variance?: Maybe<Videos_Variance_Fields>;
};


/** aggregate fields of "videos" */
export type Videos_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Videos_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "videos" */
export type Videos_Aggregate_Order_By = {
  avg?: InputMaybe<Videos_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Videos_Max_Order_By>;
  min?: InputMaybe<Videos_Min_Order_By>;
  stddev?: InputMaybe<Videos_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Videos_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Videos_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Videos_Sum_Order_By>;
  var_pop?: InputMaybe<Videos_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Videos_Var_Samp_Order_By>;
  variance?: InputMaybe<Videos_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "videos" */
export type Videos_Arr_Rel_Insert_Input = {
  data: Array<Videos_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Videos_On_Conflict>;
};

/** aggregate avg on columns */
export type Videos_Avg_Fields = {
  __typename?: 'videos_avg_fields';
  caption_id?: Maybe<Scalars['Float']['output']>;
  video_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "videos" */
export type Videos_Avg_Order_By = {
  caption_id?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "videos". All fields are combined with a logical 'AND'. */
export type Videos_Bool_Exp = {
  _and?: InputMaybe<Array<Videos_Bool_Exp>>;
  _cohort?: InputMaybe<String_Comparison_Exp>;
  _deleted?: InputMaybe<Boolean_Comparison_Exp>;
  _not?: InputMaybe<Videos_Bool_Exp>;
  _or?: InputMaybe<Array<Videos_Bool_Exp>>;
  _state?: InputMaybe<String_Comparison_Exp>;
  caption?: InputMaybe<Videocaptions_Bool_Exp>;
  caption_all_states?: InputMaybe<Videocaptions_Bool_Exp>;
  caption_all_states_aggregate?: InputMaybe<Videocaptions_Aggregate_Bool_Exp>;
  caption_id?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  ingest_id?: InputMaybe<String_Comparison_Exp>;
  mux_asset_id?: InputMaybe<String_Comparison_Exp>;
  mux_playback_id?: InputMaybe<String_Comparison_Exp>;
  signed?: InputMaybe<Boolean_Comparison_Exp>;
  signed_stream_id?: InputMaybe<String_Comparison_Exp>;
  text_track_id?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
  video_id?: InputMaybe<Int_Comparison_Exp>;
  video_uid?: InputMaybe<Bpchar_Comparison_Exp>;
};

/** unique or primary key constraints on table "videos" */
export enum Videos_Constraint {
  /** unique or primary key constraint on columns "mux_asset_id", "_state" */
  VideosMuxAssetIdStateKey = 'videos_mux_asset_id__state_key',
  /** unique or primary key constraint on columns "video_id", "_state" */
  VideosPkey = 'videos_pkey'
}

/** input type for incrementing numeric columns in table "videos" */
export type Videos_Inc_Input = {
  caption_id?: InputMaybe<Scalars['Int']['input']>;
  video_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "videos" */
export type Videos_Insert_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  caption?: InputMaybe<Videocaptions_Obj_Rel_Insert_Input>;
  caption_all_states?: InputMaybe<Videocaptions_Arr_Rel_Insert_Input>;
  caption_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  ingest_id?: InputMaybe<Scalars['String']['input']>;
  mux_asset_id?: InputMaybe<Scalars['String']['input']>;
  mux_playback_id?: InputMaybe<Scalars['String']['input']>;
  signed?: InputMaybe<Scalars['Boolean']['input']>;
  signed_stream_id?: InputMaybe<Scalars['String']['input']>;
  text_track_id?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  video_id?: InputMaybe<Scalars['Int']['input']>;
  video_uid?: InputMaybe<Scalars['bpchar']['input']>;
};

/** aggregate max on columns */
export type Videos_Max_Fields = {
  __typename?: 'videos_max_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  caption_id?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  ingest_id?: Maybe<Scalars['String']['output']>;
  mux_asset_id?: Maybe<Scalars['String']['output']>;
  mux_playback_id?: Maybe<Scalars['String']['output']>;
  signed_stream_id?: Maybe<Scalars['String']['output']>;
  text_track_id?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  video_id?: Maybe<Scalars['Int']['output']>;
  video_uid?: Maybe<Scalars['bpchar']['output']>;
};

/** order by max() on columns of table "videos" */
export type Videos_Max_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  caption_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  ingest_id?: InputMaybe<Order_By>;
  mux_asset_id?: InputMaybe<Order_By>;
  mux_playback_id?: InputMaybe<Order_By>;
  signed_stream_id?: InputMaybe<Order_By>;
  text_track_id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
  video_uid?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Videos_Min_Fields = {
  __typename?: 'videos_min_fields';
  _cohort?: Maybe<Scalars['String']['output']>;
  _state?: Maybe<Scalars['String']['output']>;
  caption_id?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  ingest_id?: Maybe<Scalars['String']['output']>;
  mux_asset_id?: Maybe<Scalars['String']['output']>;
  mux_playback_id?: Maybe<Scalars['String']['output']>;
  signed_stream_id?: Maybe<Scalars['String']['output']>;
  text_track_id?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  video_id?: Maybe<Scalars['Int']['output']>;
  video_uid?: Maybe<Scalars['bpchar']['output']>;
};

/** order by min() on columns of table "videos" */
export type Videos_Min_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  caption_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  ingest_id?: InputMaybe<Order_By>;
  mux_asset_id?: InputMaybe<Order_By>;
  mux_playback_id?: InputMaybe<Order_By>;
  signed_stream_id?: InputMaybe<Order_By>;
  text_track_id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
  video_uid?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "videos" */
export type Videos_Mutation_Response = {
  __typename?: 'videos_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Videos>;
};

/** input type for inserting object relation for remote table "videos" */
export type Videos_Obj_Rel_Insert_Input = {
  data: Videos_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Videos_On_Conflict>;
};

/** on_conflict condition type for table "videos" */
export type Videos_On_Conflict = {
  constraint: Videos_Constraint;
  update_columns?: Array<Videos_Update_Column>;
  where?: InputMaybe<Videos_Bool_Exp>;
};

/** Ordering options when selecting data from "videos". */
export type Videos_Order_By = {
  _cohort?: InputMaybe<Order_By>;
  _deleted?: InputMaybe<Order_By>;
  _state?: InputMaybe<Order_By>;
  caption?: InputMaybe<Videocaptions_Order_By>;
  caption_all_states_aggregate?: InputMaybe<Videocaptions_Aggregate_Order_By>;
  caption_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  ingest_id?: InputMaybe<Order_By>;
  mux_asset_id?: InputMaybe<Order_By>;
  mux_playback_id?: InputMaybe<Order_By>;
  signed?: InputMaybe<Order_By>;
  signed_stream_id?: InputMaybe<Order_By>;
  text_track_id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
  video_uid?: InputMaybe<Order_By>;
};

/** primary key columns input for table: videos */
export type Videos_Pk_Columns_Input = {
  _state: Scalars['String']['input'];
  video_id: Scalars['Int']['input'];
};

/** select columns of table "videos" */
export enum Videos_Select_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CaptionId = 'caption_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  IngestId = 'ingest_id',
  /** column name */
  MuxAssetId = 'mux_asset_id',
  /** column name */
  MuxPlaybackId = 'mux_playback_id',
  /** column name */
  Signed = 'signed',
  /** column name */
  SignedStreamId = 'signed_stream_id',
  /** column name */
  TextTrackId = 'text_track_id',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Url = 'url',
  /** column name */
  VideoId = 'video_id',
  /** column name */
  VideoUid = 'video_uid'
}

/** select "videos_aggregate_bool_exp_bool_and_arguments_columns" columns of table "videos" */
export enum Videos_Select_Column_Videos_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Deleted = '_deleted',
  /** column name */
  Signed = 'signed'
}

/** select "videos_aggregate_bool_exp_bool_or_arguments_columns" columns of table "videos" */
export enum Videos_Select_Column_Videos_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Deleted = '_deleted',
  /** column name */
  Signed = 'signed'
}

/** input type for updating data in table "videos" */
export type Videos_Set_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  caption_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  ingest_id?: InputMaybe<Scalars['String']['input']>;
  mux_asset_id?: InputMaybe<Scalars['String']['input']>;
  mux_playback_id?: InputMaybe<Scalars['String']['input']>;
  signed?: InputMaybe<Scalars['Boolean']['input']>;
  signed_stream_id?: InputMaybe<Scalars['String']['input']>;
  text_track_id?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  video_id?: InputMaybe<Scalars['Int']['input']>;
  video_uid?: InputMaybe<Scalars['bpchar']['input']>;
};

/** aggregate stddev on columns */
export type Videos_Stddev_Fields = {
  __typename?: 'videos_stddev_fields';
  caption_id?: Maybe<Scalars['Float']['output']>;
  video_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "videos" */
export type Videos_Stddev_Order_By = {
  caption_id?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Videos_Stddev_Pop_Fields = {
  __typename?: 'videos_stddev_pop_fields';
  caption_id?: Maybe<Scalars['Float']['output']>;
  video_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "videos" */
export type Videos_Stddev_Pop_Order_By = {
  caption_id?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Videos_Stddev_Samp_Fields = {
  __typename?: 'videos_stddev_samp_fields';
  caption_id?: Maybe<Scalars['Float']['output']>;
  video_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "videos" */
export type Videos_Stddev_Samp_Order_By = {
  caption_id?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "videos" */
export type Videos_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Videos_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Videos_Stream_Cursor_Value_Input = {
  _cohort?: InputMaybe<Scalars['String']['input']>;
  _deleted?: InputMaybe<Scalars['Boolean']['input']>;
  _state?: InputMaybe<Scalars['String']['input']>;
  caption_id?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  ingest_id?: InputMaybe<Scalars['String']['input']>;
  mux_asset_id?: InputMaybe<Scalars['String']['input']>;
  mux_playback_id?: InputMaybe<Scalars['String']['input']>;
  signed?: InputMaybe<Scalars['Boolean']['input']>;
  signed_stream_id?: InputMaybe<Scalars['String']['input']>;
  text_track_id?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  video_id?: InputMaybe<Scalars['Int']['input']>;
  video_uid?: InputMaybe<Scalars['bpchar']['input']>;
};

/** aggregate sum on columns */
export type Videos_Sum_Fields = {
  __typename?: 'videos_sum_fields';
  caption_id?: Maybe<Scalars['Int']['output']>;
  video_id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "videos" */
export type Videos_Sum_Order_By = {
  caption_id?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
};

/** update columns of table "videos" */
export enum Videos_Update_Column {
  /** column name */
  Cohort = '_cohort',
  /** column name */
  Deleted = '_deleted',
  /** column name */
  State = '_state',
  /** column name */
  CaptionId = 'caption_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  IngestId = 'ingest_id',
  /** column name */
  MuxAssetId = 'mux_asset_id',
  /** column name */
  MuxPlaybackId = 'mux_playback_id',
  /** column name */
  Signed = 'signed',
  /** column name */
  SignedStreamId = 'signed_stream_id',
  /** column name */
  TextTrackId = 'text_track_id',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Url = 'url',
  /** column name */
  VideoId = 'video_id',
  /** column name */
  VideoUid = 'video_uid'
}

export type Videos_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Videos_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Videos_Set_Input>;
  /** filter the rows which have to be updated */
  where: Videos_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Videos_Var_Pop_Fields = {
  __typename?: 'videos_var_pop_fields';
  caption_id?: Maybe<Scalars['Float']['output']>;
  video_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "videos" */
export type Videos_Var_Pop_Order_By = {
  caption_id?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Videos_Var_Samp_Fields = {
  __typename?: 'videos_var_samp_fields';
  caption_id?: Maybe<Scalars['Float']['output']>;
  video_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "videos" */
export type Videos_Var_Samp_Order_By = {
  caption_id?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Videos_Variance_Fields = {
  __typename?: 'videos_variance_fields';
  caption_id?: Maybe<Scalars['Float']['output']>;
  video_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "videos" */
export type Videos_Variance_Order_By = {
  caption_id?: InputMaybe<Order_By>;
  video_id?: InputMaybe<Order_By>;
};

export type LessonListingQueryVariables = Exact<{
  programmeSlug: Scalars['String']['input'];
  unitSlug: Scalars['String']['input'];
}>;


export type LessonListingQuery = { __typename?: 'query_root', unit: Array<{ __typename?: 'published_mv_lesson_listing_1', programmeSlug?: string | null, unitSlug?: string | null, unitTitle?: string | null, keyStageSlug?: string | null, keyStageTitle?: string | null, subjectSlug?: string | null, subjectTitle?: string | null, lessons?: any | null }> };

export type LessonOverviewQueryVariables = Exact<{
  lessonSlug: Scalars['String']['input'];
}>;


export type LessonOverviewQuery = { __typename?: 'query_root', lesson: Array<{ __typename?: 'published_mv_lesson_overview', lessonSlug?: string | null, lessonTitle?: string | null, programmeSlug?: string | null, unitSlug?: string | null, unitTitle?: string | null, keyStageSlug?: string | null, keyStageTitle?: string | null, subjectSlug?: string | null, subjectTitle?: string | null, contentGuidanceDetails?: any | null, lessonEquipmentAndResources?: any | null, keyLearningPoints?: any | null, pupilLessonOutcome?: any | null, lessonKeywords?: any | null, copyrightContent?: any | null, supervisionLevel?: string | null, worksheetUrl?: string | null, presentationUrl?: string | null, videoMuxPlaybackId?: string | null, videoWithSignLanguageMuxPlaybackId?: string | null, transcriptSentences?: string | null, starterQuiz?: any | null, exitQuiz?: any | null }> };

export type SearchPageQueryVariables = Exact<{ [key: string]: never; }>;


export type SearchPageQuery = { __typename?: 'query_root', searchPage: Array<{ __typename?: 'published_mv_search_page', subjects?: any | null, contentTypes?: any | null, keyStages?: any | null }> };

export type TeachersHomePageQueryVariables = Exact<{ [key: string]: never; }>;


export type TeachersHomePageQuery = { __typename?: 'query_root', teachersHomePage: Array<{ __typename?: 'published_mv_homepage_2', keyStages?: any | null }> };


export const LessonListingDocument = gql`
    query lessonListing($programmeSlug: String!, $unitSlug: String!) {
  unit: published_mv_lesson_listing_1(
    where: {programmeSlug: {_eq: $programmeSlug}, unitSlug: {_eq: $unitSlug}}
  ) {
    programmeSlug
    unitSlug
    unitTitle
    keyStageSlug
    keyStageTitle
    subjectSlug
    subjectTitle
    lessons
  }
}
    `;
export const LessonOverviewDocument = gql`
    query lessonOverview($lessonSlug: String!) {
  lesson: published_mv_lesson_overview(where: {lessonSlug: {_eq: $lessonSlug}}) {
    lessonSlug
    lessonTitle
    programmeSlug
    unitSlug
    unitTitle
    keyStageSlug
    keyStageTitle
    subjectSlug
    subjectTitle
    contentGuidanceDetails
    lessonEquipmentAndResources
    keyLearningPoints
    pupilLessonOutcome
    lessonKeywords
    copyrightContent
    supervisionLevel
    worksheetUrl
    presentationUrl
    videoMuxPlaybackId
    videoWithSignLanguageMuxPlaybackId
    transcriptSentences
    starterQuiz
    exitQuiz
  }
}
    `;
export const SearchPageDocument = gql`
    query searchPage {
  searchPage: published_mv_search_page {
    contentTypes: content_type
    keyStages: key_stages
    subjects
  }
}
    `;
export const TeachersHomePageDocument = gql`
    query teachersHomePage {
  teachersHomePage: published_mv_homepage_2 {
    keyStages: key_stages
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    lessonListing(variables: LessonListingQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LessonListingQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LessonListingQuery>(LessonListingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'lessonListing', 'query');
    },
    lessonOverview(variables: LessonOverviewQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LessonOverviewQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LessonOverviewQuery>(LessonOverviewDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'lessonOverview', 'query');
    },
    searchPage(variables?: SearchPageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SearchPageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchPageQuery>(SearchPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'searchPage', 'query');
    },
    teachersHomePage(variables?: TeachersHomePageQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<TeachersHomePageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TeachersHomePageQuery>(TeachersHomePageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'teachersHomePage', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;