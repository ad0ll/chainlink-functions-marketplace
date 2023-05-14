/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type FunctionCallCompleted = {
  __typename?: 'FunctionCallCompleted';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  callbackFunction: Scalars['Bytes'];
  caller: Scalars['Bytes'];
  err: Scalars['Bytes'];
  functionId: Scalars['Bytes'];
  id: Scalars['Bytes'];
  owner: Scalars['Bytes'];
  requestId: Scalars['Bytes'];
  response: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
  usedGas: Scalars['BigInt'];
};

export type FunctionCallCompleted_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FunctionCallCompleted_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  callbackFunction?: InputMaybe<Scalars['Bytes']>;
  callbackFunction_contains?: InputMaybe<Scalars['Bytes']>;
  callbackFunction_gt?: InputMaybe<Scalars['Bytes']>;
  callbackFunction_gte?: InputMaybe<Scalars['Bytes']>;
  callbackFunction_in?: InputMaybe<Array<Scalars['Bytes']>>;
  callbackFunction_lt?: InputMaybe<Scalars['Bytes']>;
  callbackFunction_lte?: InputMaybe<Scalars['Bytes']>;
  callbackFunction_not?: InputMaybe<Scalars['Bytes']>;
  callbackFunction_not_contains?: InputMaybe<Scalars['Bytes']>;
  callbackFunction_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_gt?: InputMaybe<Scalars['Bytes']>;
  caller_gte?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_lt?: InputMaybe<Scalars['Bytes']>;
  caller_lte?: InputMaybe<Scalars['Bytes']>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  err?: InputMaybe<Scalars['Bytes']>;
  err_contains?: InputMaybe<Scalars['Bytes']>;
  err_gt?: InputMaybe<Scalars['Bytes']>;
  err_gte?: InputMaybe<Scalars['Bytes']>;
  err_in?: InputMaybe<Array<Scalars['Bytes']>>;
  err_lt?: InputMaybe<Scalars['Bytes']>;
  err_lte?: InputMaybe<Scalars['Bytes']>;
  err_not?: InputMaybe<Scalars['Bytes']>;
  err_not_contains?: InputMaybe<Scalars['Bytes']>;
  err_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  functionId?: InputMaybe<Scalars['Bytes']>;
  functionId_contains?: InputMaybe<Scalars['Bytes']>;
  functionId_gt?: InputMaybe<Scalars['Bytes']>;
  functionId_gte?: InputMaybe<Scalars['Bytes']>;
  functionId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  functionId_lt?: InputMaybe<Scalars['Bytes']>;
  functionId_lte?: InputMaybe<Scalars['Bytes']>;
  functionId_not?: InputMaybe<Scalars['Bytes']>;
  functionId_not_contains?: InputMaybe<Scalars['Bytes']>;
  functionId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<FunctionCallCompleted_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_gt?: InputMaybe<Scalars['Bytes']>;
  owner_gte?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']>;
  owner_lte?: InputMaybe<Scalars['Bytes']>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  requestId?: InputMaybe<Scalars['Bytes']>;
  requestId_contains?: InputMaybe<Scalars['Bytes']>;
  requestId_gt?: InputMaybe<Scalars['Bytes']>;
  requestId_gte?: InputMaybe<Scalars['Bytes']>;
  requestId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  requestId_lt?: InputMaybe<Scalars['Bytes']>;
  requestId_lte?: InputMaybe<Scalars['Bytes']>;
  requestId_not?: InputMaybe<Scalars['Bytes']>;
  requestId_not_contains?: InputMaybe<Scalars['Bytes']>;
  requestId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  response?: InputMaybe<Scalars['Bytes']>;
  response_contains?: InputMaybe<Scalars['Bytes']>;
  response_gt?: InputMaybe<Scalars['Bytes']>;
  response_gte?: InputMaybe<Scalars['Bytes']>;
  response_in?: InputMaybe<Array<Scalars['Bytes']>>;
  response_lt?: InputMaybe<Scalars['Bytes']>;
  response_lte?: InputMaybe<Scalars['Bytes']>;
  response_not?: InputMaybe<Scalars['Bytes']>;
  response_not_contains?: InputMaybe<Scalars['Bytes']>;
  response_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  usedGas?: InputMaybe<Scalars['BigInt']>;
  usedGas_gt?: InputMaybe<Scalars['BigInt']>;
  usedGas_gte?: InputMaybe<Scalars['BigInt']>;
  usedGas_in?: InputMaybe<Array<Scalars['BigInt']>>;
  usedGas_lt?: InputMaybe<Scalars['BigInt']>;
  usedGas_lte?: InputMaybe<Scalars['BigInt']>;
  usedGas_not?: InputMaybe<Scalars['BigInt']>;
  usedGas_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum FunctionCallCompleted_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  CallbackFunction = 'callbackFunction',
  Caller = 'caller',
  Err = 'err',
  FunctionId = 'functionId',
  Id = 'id',
  Owner = 'owner',
  RequestId = 'requestId',
  Response = 'response',
  TransactionHash = 'transactionHash',
  UsedGas = 'usedGas'
}

export type FunctionCalled = {
  __typename?: 'FunctionCalled';
  baseFee: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  callbackFunction: Scalars['Bytes'];
  caller: Scalars['Bytes'];
  fee: Scalars['BigInt'];
  functionId: Scalars['Bytes'];
  gasDeposit: Scalars['BigInt'];
  id: Scalars['Bytes'];
  owner: Scalars['Bytes'];
  requestId: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type FunctionCalled_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FunctionCalled_Filter>>>;
  baseFee?: InputMaybe<Scalars['BigInt']>;
  baseFee_gt?: InputMaybe<Scalars['BigInt']>;
  baseFee_gte?: InputMaybe<Scalars['BigInt']>;
  baseFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  baseFee_lt?: InputMaybe<Scalars['BigInt']>;
  baseFee_lte?: InputMaybe<Scalars['BigInt']>;
  baseFee_not?: InputMaybe<Scalars['BigInt']>;
  baseFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  callbackFunction?: InputMaybe<Scalars['Bytes']>;
  callbackFunction_contains?: InputMaybe<Scalars['Bytes']>;
  callbackFunction_gt?: InputMaybe<Scalars['Bytes']>;
  callbackFunction_gte?: InputMaybe<Scalars['Bytes']>;
  callbackFunction_in?: InputMaybe<Array<Scalars['Bytes']>>;
  callbackFunction_lt?: InputMaybe<Scalars['Bytes']>;
  callbackFunction_lte?: InputMaybe<Scalars['Bytes']>;
  callbackFunction_not?: InputMaybe<Scalars['Bytes']>;
  callbackFunction_not_contains?: InputMaybe<Scalars['Bytes']>;
  callbackFunction_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_gt?: InputMaybe<Scalars['Bytes']>;
  caller_gte?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_lt?: InputMaybe<Scalars['Bytes']>;
  caller_lte?: InputMaybe<Scalars['Bytes']>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  fee?: InputMaybe<Scalars['BigInt']>;
  fee_gt?: InputMaybe<Scalars['BigInt']>;
  fee_gte?: InputMaybe<Scalars['BigInt']>;
  fee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fee_lt?: InputMaybe<Scalars['BigInt']>;
  fee_lte?: InputMaybe<Scalars['BigInt']>;
  fee_not?: InputMaybe<Scalars['BigInt']>;
  fee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  functionId?: InputMaybe<Scalars['Bytes']>;
  functionId_contains?: InputMaybe<Scalars['Bytes']>;
  functionId_gt?: InputMaybe<Scalars['Bytes']>;
  functionId_gte?: InputMaybe<Scalars['Bytes']>;
  functionId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  functionId_lt?: InputMaybe<Scalars['Bytes']>;
  functionId_lte?: InputMaybe<Scalars['Bytes']>;
  functionId_not?: InputMaybe<Scalars['Bytes']>;
  functionId_not_contains?: InputMaybe<Scalars['Bytes']>;
  functionId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  gasDeposit?: InputMaybe<Scalars['BigInt']>;
  gasDeposit_gt?: InputMaybe<Scalars['BigInt']>;
  gasDeposit_gte?: InputMaybe<Scalars['BigInt']>;
  gasDeposit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasDeposit_lt?: InputMaybe<Scalars['BigInt']>;
  gasDeposit_lte?: InputMaybe<Scalars['BigInt']>;
  gasDeposit_not?: InputMaybe<Scalars['BigInt']>;
  gasDeposit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<FunctionCalled_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_gt?: InputMaybe<Scalars['Bytes']>;
  owner_gte?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']>;
  owner_lte?: InputMaybe<Scalars['Bytes']>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  requestId?: InputMaybe<Scalars['Bytes']>;
  requestId_contains?: InputMaybe<Scalars['Bytes']>;
  requestId_gt?: InputMaybe<Scalars['Bytes']>;
  requestId_gte?: InputMaybe<Scalars['Bytes']>;
  requestId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  requestId_lt?: InputMaybe<Scalars['Bytes']>;
  requestId_lte?: InputMaybe<Scalars['Bytes']>;
  requestId_not?: InputMaybe<Scalars['Bytes']>;
  requestId_not_contains?: InputMaybe<Scalars['Bytes']>;
  requestId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum FunctionCalled_OrderBy {
  BaseFee = 'baseFee',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  CallbackFunction = 'callbackFunction',
  Caller = 'caller',
  Fee = 'fee',
  FunctionId = 'functionId',
  GasDeposit = 'gasDeposit',
  Id = 'id',
  Owner = 'owner',
  RequestId = 'requestId',
  TransactionHash = 'transactionHash'
}

export type FunctionRegistered = {
  __typename?: 'FunctionRegistered';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  functionId: Scalars['Bytes'];
  id: Scalars['Bytes'];
  metadata_category: Scalars['Bytes'];
  metadata_desc: Scalars['String'];
  metadata_expectedArgs: Array<Scalars['String']>;
  metadata_fee: Scalars['BigInt'];
  metadata_imageUrl: Scalars['String'];
  metadata_lockedProfitPool: Scalars['BigInt'];
  metadata_name: Scalars['String'];
  metadata_owner: Scalars['Bytes'];
  metadata_request_args: Array<Scalars['String']>;
  metadata_request_codeLocation: Scalars['Int'];
  metadata_request_language: Scalars['Int'];
  metadata_request_secrets: Scalars['Bytes'];
  metadata_request_secretsLocation: Scalars['Int'];
  metadata_request_source: Scalars['String'];
  metadata_subId: Scalars['BigInt'];
  metadata_subscriptionPool: Scalars['BigInt'];
  metadata_unlockedProfitPool: Scalars['BigInt'];
  owner: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type FunctionRegistered_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FunctionRegistered_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  functionId?: InputMaybe<Scalars['Bytes']>;
  functionId_contains?: InputMaybe<Scalars['Bytes']>;
  functionId_gt?: InputMaybe<Scalars['Bytes']>;
  functionId_gte?: InputMaybe<Scalars['Bytes']>;
  functionId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  functionId_lt?: InputMaybe<Scalars['Bytes']>;
  functionId_lte?: InputMaybe<Scalars['Bytes']>;
  functionId_not?: InputMaybe<Scalars['Bytes']>;
  functionId_not_contains?: InputMaybe<Scalars['Bytes']>;
  functionId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  metadata_category?: InputMaybe<Scalars['Bytes']>;
  metadata_category_contains?: InputMaybe<Scalars['Bytes']>;
  metadata_category_gt?: InputMaybe<Scalars['Bytes']>;
  metadata_category_gte?: InputMaybe<Scalars['Bytes']>;
  metadata_category_in?: InputMaybe<Array<Scalars['Bytes']>>;
  metadata_category_lt?: InputMaybe<Scalars['Bytes']>;
  metadata_category_lte?: InputMaybe<Scalars['Bytes']>;
  metadata_category_not?: InputMaybe<Scalars['Bytes']>;
  metadata_category_not_contains?: InputMaybe<Scalars['Bytes']>;
  metadata_category_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  metadata_desc?: InputMaybe<Scalars['String']>;
  metadata_desc_contains?: InputMaybe<Scalars['String']>;
  metadata_desc_contains_nocase?: InputMaybe<Scalars['String']>;
  metadata_desc_ends_with?: InputMaybe<Scalars['String']>;
  metadata_desc_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadata_desc_gt?: InputMaybe<Scalars['String']>;
  metadata_desc_gte?: InputMaybe<Scalars['String']>;
  metadata_desc_in?: InputMaybe<Array<Scalars['String']>>;
  metadata_desc_lt?: InputMaybe<Scalars['String']>;
  metadata_desc_lte?: InputMaybe<Scalars['String']>;
  metadata_desc_not?: InputMaybe<Scalars['String']>;
  metadata_desc_not_contains?: InputMaybe<Scalars['String']>;
  metadata_desc_not_contains_nocase?: InputMaybe<Scalars['String']>;
  metadata_desc_not_ends_with?: InputMaybe<Scalars['String']>;
  metadata_desc_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadata_desc_not_in?: InputMaybe<Array<Scalars['String']>>;
  metadata_desc_not_starts_with?: InputMaybe<Scalars['String']>;
  metadata_desc_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadata_desc_starts_with?: InputMaybe<Scalars['String']>;
  metadata_desc_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadata_expectedArgs?: InputMaybe<Array<Scalars['String']>>;
  metadata_expectedArgs_contains?: InputMaybe<Array<Scalars['String']>>;
  metadata_expectedArgs_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  metadata_expectedArgs_not?: InputMaybe<Array<Scalars['String']>>;
  metadata_expectedArgs_not_contains?: InputMaybe<Array<Scalars['String']>>;
  metadata_expectedArgs_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  metadata_fee?: InputMaybe<Scalars['BigInt']>;
  metadata_fee_gt?: InputMaybe<Scalars['BigInt']>;
  metadata_fee_gte?: InputMaybe<Scalars['BigInt']>;
  metadata_fee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  metadata_fee_lt?: InputMaybe<Scalars['BigInt']>;
  metadata_fee_lte?: InputMaybe<Scalars['BigInt']>;
  metadata_fee_not?: InputMaybe<Scalars['BigInt']>;
  metadata_fee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  metadata_imageUrl?: InputMaybe<Scalars['String']>;
  metadata_imageUrl_contains?: InputMaybe<Scalars['String']>;
  metadata_imageUrl_contains_nocase?: InputMaybe<Scalars['String']>;
  metadata_imageUrl_ends_with?: InputMaybe<Scalars['String']>;
  metadata_imageUrl_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadata_imageUrl_gt?: InputMaybe<Scalars['String']>;
  metadata_imageUrl_gte?: InputMaybe<Scalars['String']>;
  metadata_imageUrl_in?: InputMaybe<Array<Scalars['String']>>;
  metadata_imageUrl_lt?: InputMaybe<Scalars['String']>;
  metadata_imageUrl_lte?: InputMaybe<Scalars['String']>;
  metadata_imageUrl_not?: InputMaybe<Scalars['String']>;
  metadata_imageUrl_not_contains?: InputMaybe<Scalars['String']>;
  metadata_imageUrl_not_contains_nocase?: InputMaybe<Scalars['String']>;
  metadata_imageUrl_not_ends_with?: InputMaybe<Scalars['String']>;
  metadata_imageUrl_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadata_imageUrl_not_in?: InputMaybe<Array<Scalars['String']>>;
  metadata_imageUrl_not_starts_with?: InputMaybe<Scalars['String']>;
  metadata_imageUrl_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadata_imageUrl_starts_with?: InputMaybe<Scalars['String']>;
  metadata_imageUrl_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadata_lockedProfitPool?: InputMaybe<Scalars['BigInt']>;
  metadata_lockedProfitPool_gt?: InputMaybe<Scalars['BigInt']>;
  metadata_lockedProfitPool_gte?: InputMaybe<Scalars['BigInt']>;
  metadata_lockedProfitPool_in?: InputMaybe<Array<Scalars['BigInt']>>;
  metadata_lockedProfitPool_lt?: InputMaybe<Scalars['BigInt']>;
  metadata_lockedProfitPool_lte?: InputMaybe<Scalars['BigInt']>;
  metadata_lockedProfitPool_not?: InputMaybe<Scalars['BigInt']>;
  metadata_lockedProfitPool_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  metadata_name?: InputMaybe<Scalars['String']>;
  metadata_name_contains?: InputMaybe<Scalars['String']>;
  metadata_name_contains_nocase?: InputMaybe<Scalars['String']>;
  metadata_name_ends_with?: InputMaybe<Scalars['String']>;
  metadata_name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadata_name_gt?: InputMaybe<Scalars['String']>;
  metadata_name_gte?: InputMaybe<Scalars['String']>;
  metadata_name_in?: InputMaybe<Array<Scalars['String']>>;
  metadata_name_lt?: InputMaybe<Scalars['String']>;
  metadata_name_lte?: InputMaybe<Scalars['String']>;
  metadata_name_not?: InputMaybe<Scalars['String']>;
  metadata_name_not_contains?: InputMaybe<Scalars['String']>;
  metadata_name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  metadata_name_not_ends_with?: InputMaybe<Scalars['String']>;
  metadata_name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadata_name_not_in?: InputMaybe<Array<Scalars['String']>>;
  metadata_name_not_starts_with?: InputMaybe<Scalars['String']>;
  metadata_name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadata_name_starts_with?: InputMaybe<Scalars['String']>;
  metadata_name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadata_owner?: InputMaybe<Scalars['Bytes']>;
  metadata_owner_contains?: InputMaybe<Scalars['Bytes']>;
  metadata_owner_gt?: InputMaybe<Scalars['Bytes']>;
  metadata_owner_gte?: InputMaybe<Scalars['Bytes']>;
  metadata_owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  metadata_owner_lt?: InputMaybe<Scalars['Bytes']>;
  metadata_owner_lte?: InputMaybe<Scalars['Bytes']>;
  metadata_owner_not?: InputMaybe<Scalars['Bytes']>;
  metadata_owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  metadata_owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  metadata_request_args?: InputMaybe<Array<Scalars['String']>>;
  metadata_request_args_contains?: InputMaybe<Array<Scalars['String']>>;
  metadata_request_args_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  metadata_request_args_not?: InputMaybe<Array<Scalars['String']>>;
  metadata_request_args_not_contains?: InputMaybe<Array<Scalars['String']>>;
  metadata_request_args_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  metadata_request_codeLocation?: InputMaybe<Scalars['Int']>;
  metadata_request_codeLocation_gt?: InputMaybe<Scalars['Int']>;
  metadata_request_codeLocation_gte?: InputMaybe<Scalars['Int']>;
  metadata_request_codeLocation_in?: InputMaybe<Array<Scalars['Int']>>;
  metadata_request_codeLocation_lt?: InputMaybe<Scalars['Int']>;
  metadata_request_codeLocation_lte?: InputMaybe<Scalars['Int']>;
  metadata_request_codeLocation_not?: InputMaybe<Scalars['Int']>;
  metadata_request_codeLocation_not_in?: InputMaybe<Array<Scalars['Int']>>;
  metadata_request_language?: InputMaybe<Scalars['Int']>;
  metadata_request_language_gt?: InputMaybe<Scalars['Int']>;
  metadata_request_language_gte?: InputMaybe<Scalars['Int']>;
  metadata_request_language_in?: InputMaybe<Array<Scalars['Int']>>;
  metadata_request_language_lt?: InputMaybe<Scalars['Int']>;
  metadata_request_language_lte?: InputMaybe<Scalars['Int']>;
  metadata_request_language_not?: InputMaybe<Scalars['Int']>;
  metadata_request_language_not_in?: InputMaybe<Array<Scalars['Int']>>;
  metadata_request_secrets?: InputMaybe<Scalars['Bytes']>;
  metadata_request_secretsLocation?: InputMaybe<Scalars['Int']>;
  metadata_request_secretsLocation_gt?: InputMaybe<Scalars['Int']>;
  metadata_request_secretsLocation_gte?: InputMaybe<Scalars['Int']>;
  metadata_request_secretsLocation_in?: InputMaybe<Array<Scalars['Int']>>;
  metadata_request_secretsLocation_lt?: InputMaybe<Scalars['Int']>;
  metadata_request_secretsLocation_lte?: InputMaybe<Scalars['Int']>;
  metadata_request_secretsLocation_not?: InputMaybe<Scalars['Int']>;
  metadata_request_secretsLocation_not_in?: InputMaybe<Array<Scalars['Int']>>;
  metadata_request_secrets_contains?: InputMaybe<Scalars['Bytes']>;
  metadata_request_secrets_gt?: InputMaybe<Scalars['Bytes']>;
  metadata_request_secrets_gte?: InputMaybe<Scalars['Bytes']>;
  metadata_request_secrets_in?: InputMaybe<Array<Scalars['Bytes']>>;
  metadata_request_secrets_lt?: InputMaybe<Scalars['Bytes']>;
  metadata_request_secrets_lte?: InputMaybe<Scalars['Bytes']>;
  metadata_request_secrets_not?: InputMaybe<Scalars['Bytes']>;
  metadata_request_secrets_not_contains?: InputMaybe<Scalars['Bytes']>;
  metadata_request_secrets_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  metadata_request_source?: InputMaybe<Scalars['String']>;
  metadata_request_source_contains?: InputMaybe<Scalars['String']>;
  metadata_request_source_contains_nocase?: InputMaybe<Scalars['String']>;
  metadata_request_source_ends_with?: InputMaybe<Scalars['String']>;
  metadata_request_source_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadata_request_source_gt?: InputMaybe<Scalars['String']>;
  metadata_request_source_gte?: InputMaybe<Scalars['String']>;
  metadata_request_source_in?: InputMaybe<Array<Scalars['String']>>;
  metadata_request_source_lt?: InputMaybe<Scalars['String']>;
  metadata_request_source_lte?: InputMaybe<Scalars['String']>;
  metadata_request_source_not?: InputMaybe<Scalars['String']>;
  metadata_request_source_not_contains?: InputMaybe<Scalars['String']>;
  metadata_request_source_not_contains_nocase?: InputMaybe<Scalars['String']>;
  metadata_request_source_not_ends_with?: InputMaybe<Scalars['String']>;
  metadata_request_source_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadata_request_source_not_in?: InputMaybe<Array<Scalars['String']>>;
  metadata_request_source_not_starts_with?: InputMaybe<Scalars['String']>;
  metadata_request_source_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadata_request_source_starts_with?: InputMaybe<Scalars['String']>;
  metadata_request_source_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadata_subId?: InputMaybe<Scalars['BigInt']>;
  metadata_subId_gt?: InputMaybe<Scalars['BigInt']>;
  metadata_subId_gte?: InputMaybe<Scalars['BigInt']>;
  metadata_subId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  metadata_subId_lt?: InputMaybe<Scalars['BigInt']>;
  metadata_subId_lte?: InputMaybe<Scalars['BigInt']>;
  metadata_subId_not?: InputMaybe<Scalars['BigInt']>;
  metadata_subId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  metadata_subscriptionPool?: InputMaybe<Scalars['BigInt']>;
  metadata_subscriptionPool_gt?: InputMaybe<Scalars['BigInt']>;
  metadata_subscriptionPool_gte?: InputMaybe<Scalars['BigInt']>;
  metadata_subscriptionPool_in?: InputMaybe<Array<Scalars['BigInt']>>;
  metadata_subscriptionPool_lt?: InputMaybe<Scalars['BigInt']>;
  metadata_subscriptionPool_lte?: InputMaybe<Scalars['BigInt']>;
  metadata_subscriptionPool_not?: InputMaybe<Scalars['BigInt']>;
  metadata_subscriptionPool_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  metadata_unlockedProfitPool?: InputMaybe<Scalars['BigInt']>;
  metadata_unlockedProfitPool_gt?: InputMaybe<Scalars['BigInt']>;
  metadata_unlockedProfitPool_gte?: InputMaybe<Scalars['BigInt']>;
  metadata_unlockedProfitPool_in?: InputMaybe<Array<Scalars['BigInt']>>;
  metadata_unlockedProfitPool_lt?: InputMaybe<Scalars['BigInt']>;
  metadata_unlockedProfitPool_lte?: InputMaybe<Scalars['BigInt']>;
  metadata_unlockedProfitPool_not?: InputMaybe<Scalars['BigInt']>;
  metadata_unlockedProfitPool_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  or?: InputMaybe<Array<InputMaybe<FunctionRegistered_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_gt?: InputMaybe<Scalars['Bytes']>;
  owner_gte?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']>;
  owner_lte?: InputMaybe<Scalars['Bytes']>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum FunctionRegistered_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  FunctionId = 'functionId',
  Id = 'id',
  MetadataCategory = 'metadata_category',
  MetadataDesc = 'metadata_desc',
  MetadataExpectedArgs = 'metadata_expectedArgs',
  MetadataFee = 'metadata_fee',
  MetadataImageUrl = 'metadata_imageUrl',
  MetadataLockedProfitPool = 'metadata_lockedProfitPool',
  MetadataName = 'metadata_name',
  MetadataOwner = 'metadata_owner',
  MetadataRequestArgs = 'metadata_request_args',
  MetadataRequestCodeLocation = 'metadata_request_codeLocation',
  MetadataRequestLanguage = 'metadata_request_language',
  MetadataRequestSecrets = 'metadata_request_secrets',
  MetadataRequestSecretsLocation = 'metadata_request_secretsLocation',
  MetadataRequestSource = 'metadata_request_source',
  MetadataSubId = 'metadata_subId',
  MetadataSubscriptionPool = 'metadata_subscriptionPool',
  MetadataUnlockedProfitPool = 'metadata_unlockedProfitPool',
  Owner = 'owner',
  TransactionHash = 'transactionHash'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type OwnershipTransferred = {
  __typename?: 'OwnershipTransferred';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  newOwner: Scalars['Bytes'];
  previousOwner: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type OwnershipTransferred_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<OwnershipTransferred_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  newOwner?: InputMaybe<Scalars['Bytes']>;
  newOwner_contains?: InputMaybe<Scalars['Bytes']>;
  newOwner_gt?: InputMaybe<Scalars['Bytes']>;
  newOwner_gte?: InputMaybe<Scalars['Bytes']>;
  newOwner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  newOwner_lt?: InputMaybe<Scalars['Bytes']>;
  newOwner_lte?: InputMaybe<Scalars['Bytes']>;
  newOwner_not?: InputMaybe<Scalars['Bytes']>;
  newOwner_not_contains?: InputMaybe<Scalars['Bytes']>;
  newOwner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<OwnershipTransferred_Filter>>>;
  previousOwner?: InputMaybe<Scalars['Bytes']>;
  previousOwner_contains?: InputMaybe<Scalars['Bytes']>;
  previousOwner_gt?: InputMaybe<Scalars['Bytes']>;
  previousOwner_gte?: InputMaybe<Scalars['Bytes']>;
  previousOwner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  previousOwner_lt?: InputMaybe<Scalars['Bytes']>;
  previousOwner_lte?: InputMaybe<Scalars['Bytes']>;
  previousOwner_not?: InputMaybe<Scalars['Bytes']>;
  previousOwner_not_contains?: InputMaybe<Scalars['Bytes']>;
  previousOwner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum OwnershipTransferred_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  NewOwner = 'newOwner',
  PreviousOwner = 'previousOwner',
  TransactionHash = 'transactionHash'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  functionCallCompleted?: Maybe<FunctionCallCompleted>;
  functionCallCompleteds: Array<FunctionCallCompleted>;
  functionCalled?: Maybe<FunctionCalled>;
  functionCalleds: Array<FunctionCalled>;
  functionRegistered?: Maybe<FunctionRegistered>;
  functionRegistereds: Array<FunctionRegistered>;
  ownershipTransferred?: Maybe<OwnershipTransferred>;
  ownershipTransferreds: Array<OwnershipTransferred>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryFunctionCallCompletedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFunctionCallCompletedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FunctionCallCompleted_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FunctionCallCompleted_Filter>;
};


export type QueryFunctionCalledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFunctionCalledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FunctionCalled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FunctionCalled_Filter>;
};


export type QueryFunctionRegisteredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFunctionRegisteredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FunctionRegistered_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FunctionRegistered_Filter>;
};


export type QueryOwnershipTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOwnershipTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OwnershipTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OwnershipTransferred_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  functionCallCompleted?: Maybe<FunctionCallCompleted>;
  functionCallCompleteds: Array<FunctionCallCompleted>;
  functionCalled?: Maybe<FunctionCalled>;
  functionCalleds: Array<FunctionCalled>;
  functionRegistered?: Maybe<FunctionRegistered>;
  functionRegistereds: Array<FunctionRegistered>;
  ownershipTransferred?: Maybe<OwnershipTransferred>;
  ownershipTransferreds: Array<OwnershipTransferred>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionFunctionCallCompletedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFunctionCallCompletedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FunctionCallCompleted_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FunctionCallCompleted_Filter>;
};


export type SubscriptionFunctionCalledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFunctionCalledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FunctionCalled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FunctionCalled_Filter>;
};


export type SubscriptionFunctionRegisteredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFunctionRegisteredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FunctionRegistered_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FunctionRegistered_Filter>;
};


export type SubscriptionOwnershipTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOwnershipTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OwnershipTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OwnershipTransferred_Filter>;
};

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type DrilldownPageQueryVariables = Exact<{
  functionId: Scalars['ID'];
}>;


export type DrilldownPageQuery = { __typename?: 'Query', functionRegistered?: { __typename?: 'FunctionRegistered', id: any, functionId: any, owner: any, metadata_fee: any, metadata_owner: any, metadata_subId: any, metadata_name: string, metadata_desc: string, metadata_imageUrl: string, metadata_subscriptionPool: any, metadata_lockedProfitPool: any, metadata_unlockedProfitPool: any } | null };

export type EventSpammerFunctionRegisteredQueryVariables = Exact<{
  first: Scalars['Int'];
  skip: Scalars['Int'];
}>;


export type EventSpammerFunctionRegisteredQuery = { __typename?: 'Query', functionRegistereds: Array<{ __typename?: 'FunctionRegistered', id: any, functionId: any, owner: any, metadata_fee: any, metadata_name: string, metadata_desc: string, metadata_imageUrl: string }> };

export type EventSpammerRecentFunctionRegisteredQueryVariables = Exact<{ [key: string]: never; }>;


export type EventSpammerRecentFunctionRegisteredQuery = { __typename?: 'Query', functionRegistereds: Array<{ __typename?: 'FunctionRegistered', id: any, functionId: any, owner: any, metadata_name: string, metadata_desc: string, metadata_imageUrl: string }> };

export type EventSpammerOwnerPageQueryVariables = Exact<{
  owner: Scalars['Bytes'];
}>;


export type EventSpammerOwnerPageQuery = { __typename?: 'Query', functionRegistereds: Array<{ __typename?: 'FunctionRegistered', id: any, functionId: any, owner: any, metadata_fee: any, metadata_subId: any, metadata_name: string, metadata_imageUrl: string, metadata_subscriptionPool: any, metadata_lockedProfitPool: any, metadata_unlockedProfitPool: any }> };


export const DrilldownPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DrilldownPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionRegistered"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"functionId"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_fee"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_owner"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_subId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_name"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_desc"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_subscriptionPool"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_lockedProfitPool"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_unlockedProfitPool"}}]}}]}}]} as unknown as DocumentNode<DrilldownPageQuery, DrilldownPageQueryVariables>;
export const EventSpammerFunctionRegisteredDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventSpammerFunctionRegistered"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionRegistereds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"blockNumber"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"functionId"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_fee"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_name"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_desc"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_imageUrl"}}]}}]}}]} as unknown as DocumentNode<EventSpammerFunctionRegisteredQuery, EventSpammerFunctionRegisteredQueryVariables>;
export const EventSpammerRecentFunctionRegisteredDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventSpammerRecentFunctionRegistered"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionRegistereds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"blockNumber"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"3"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"functionId"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_name"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_desc"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_imageUrl"}}]}}]}}]} as unknown as DocumentNode<EventSpammerRecentFunctionRegisteredQuery, EventSpammerRecentFunctionRegisteredQueryVariables>;
export const EventSpammerOwnerPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventSpammerOwnerPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"owner"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Bytes"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionRegistereds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"metadata_unlockedProfitPool"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"owner"},"value":{"kind":"Variable","name":{"kind":"Name","value":"owner"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"functionId"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_fee"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_subId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_name"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_subscriptionPool"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_lockedProfitPool"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_unlockedProfitPool"}}]}}]}}]} as unknown as DocumentNode<EventSpammerOwnerPageQuery, EventSpammerOwnerPageQueryVariables>;