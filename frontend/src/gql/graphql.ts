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

export type FeeManagerCutUpdated = {
  __typename?: 'FeeManagerCutUpdated';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  newFeeManagerCut: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type FeeManagerCutUpdated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FeeManagerCutUpdated_Filter>>>;
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
  newFeeManagerCut?: InputMaybe<Scalars['BigInt']>;
  newFeeManagerCut_gt?: InputMaybe<Scalars['BigInt']>;
  newFeeManagerCut_gte?: InputMaybe<Scalars['BigInt']>;
  newFeeManagerCut_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newFeeManagerCut_lt?: InputMaybe<Scalars['BigInt']>;
  newFeeManagerCut_lte?: InputMaybe<Scalars['BigInt']>;
  newFeeManagerCut_not?: InputMaybe<Scalars['BigInt']>;
  newFeeManagerCut_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  or?: InputMaybe<Array<InputMaybe<FeeManagerCutUpdated_Filter>>>;
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

export enum FeeManagerCutUpdated_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  NewFeeManagerCut = 'newFeeManagerCut',
  TransactionHash = 'transactionHash'
}

export type FulfillRequest = {
  __typename?: 'FulfillRequest';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  err: Scalars['Bytes'];
  id: Scalars['Bytes'];
  requestId: Scalars['Bytes'];
  response: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type FulfillRequest_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FulfillRequest_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<FulfillRequest_Filter>>>;
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
};

export enum FulfillRequest_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Err = 'err',
  Id = 'id',
  RequestId = 'requestId',
  Response = 'response',
  TransactionHash = 'transactionHash'
}

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
  TransactionHash = 'transactionHash'
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
  Id = 'id',
  Owner = 'owner',
  RequestId = 'requestId',
  TransactionHash = 'transactionHash'
}

export type FunctionRegistered = {
  __typename?: 'FunctionRegistered';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  category: Scalars['Bytes'];
  fee: Scalars['BigInt'];
  functionId: Scalars['Bytes'];
  id: Scalars['Bytes'];
  metadata_category: Scalars['Bytes'];
  metadata_desc: Scalars['String'];
  metadata_expectedArgs: Array<Scalars['String']>;
  metadata_expectedReturnType: Scalars['Int'];
  metadata_imageUrl: Scalars['String'];
  metadata_name: Scalars['String'];
  metadata_owner: Scalars['Bytes'];
  owner: Scalars['Bytes'];
  subId: Scalars['BigInt'];
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
  category?: InputMaybe<Scalars['Bytes']>;
  category_contains?: InputMaybe<Scalars['Bytes']>;
  category_gt?: InputMaybe<Scalars['Bytes']>;
  category_gte?: InputMaybe<Scalars['Bytes']>;
  category_in?: InputMaybe<Array<Scalars['Bytes']>>;
  category_lt?: InputMaybe<Scalars['Bytes']>;
  category_lte?: InputMaybe<Scalars['Bytes']>;
  category_not?: InputMaybe<Scalars['Bytes']>;
  category_not_contains?: InputMaybe<Scalars['Bytes']>;
  category_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
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
  metadata_expectedReturnType?: InputMaybe<Scalars['Int']>;
  metadata_expectedReturnType_gt?: InputMaybe<Scalars['Int']>;
  metadata_expectedReturnType_gte?: InputMaybe<Scalars['Int']>;
  metadata_expectedReturnType_in?: InputMaybe<Array<Scalars['Int']>>;
  metadata_expectedReturnType_lt?: InputMaybe<Scalars['Int']>;
  metadata_expectedReturnType_lte?: InputMaybe<Scalars['Int']>;
  metadata_expectedReturnType_not?: InputMaybe<Scalars['Int']>;
  metadata_expectedReturnType_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  subId?: InputMaybe<Scalars['BigInt']>;
  subId_gt?: InputMaybe<Scalars['BigInt']>;
  subId_gte?: InputMaybe<Scalars['BigInt']>;
  subId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  subId_lt?: InputMaybe<Scalars['BigInt']>;
  subId_lte?: InputMaybe<Scalars['BigInt']>;
  subId_not?: InputMaybe<Scalars['BigInt']>;
  subId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  Category = 'category',
  Fee = 'fee',
  FunctionId = 'functionId',
  Id = 'id',
  MetadataCategory = 'metadata_category',
  MetadataDesc = 'metadata_desc',
  MetadataExpectedArgs = 'metadata_expectedArgs',
  MetadataExpectedReturnType = 'metadata_expectedReturnType',
  MetadataImageUrl = 'metadata_imageUrl',
  MetadataName = 'metadata_name',
  MetadataOwner = 'metadata_owner',
  Owner = 'owner',
  SubId = 'subId',
  TransactionHash = 'transactionHash'
}

export type MaxGasLimitUpdated = {
  __typename?: 'MaxGasLimitUpdated';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  newMaxGasLimit: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type MaxGasLimitUpdated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<MaxGasLimitUpdated_Filter>>>;
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
  newMaxGasLimit?: InputMaybe<Scalars['BigInt']>;
  newMaxGasLimit_gt?: InputMaybe<Scalars['BigInt']>;
  newMaxGasLimit_gte?: InputMaybe<Scalars['BigInt']>;
  newMaxGasLimit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newMaxGasLimit_lt?: InputMaybe<Scalars['BigInt']>;
  newMaxGasLimit_lte?: InputMaybe<Scalars['BigInt']>;
  newMaxGasLimit_not?: InputMaybe<Scalars['BigInt']>;
  newMaxGasLimit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  or?: InputMaybe<Array<InputMaybe<MaxGasLimitUpdated_Filter>>>;
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

export enum MaxGasLimitUpdated_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  NewMaxGasLimit = 'newMaxGasLimit',
  TransactionHash = 'transactionHash'
}

export type MinimumSubscriptionBalanceUpdated = {
  __typename?: 'MinimumSubscriptionBalanceUpdated';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  newMinimumSubscriptionBalance: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type MinimumSubscriptionBalanceUpdated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<MinimumSubscriptionBalanceUpdated_Filter>>>;
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
  newMinimumSubscriptionBalance?: InputMaybe<Scalars['BigInt']>;
  newMinimumSubscriptionBalance_gt?: InputMaybe<Scalars['BigInt']>;
  newMinimumSubscriptionBalance_gte?: InputMaybe<Scalars['BigInt']>;
  newMinimumSubscriptionBalance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newMinimumSubscriptionBalance_lt?: InputMaybe<Scalars['BigInt']>;
  newMinimumSubscriptionBalance_lte?: InputMaybe<Scalars['BigInt']>;
  newMinimumSubscriptionBalance_not?: InputMaybe<Scalars['BigInt']>;
  newMinimumSubscriptionBalance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  or?: InputMaybe<Array<InputMaybe<MinimumSubscriptionBalanceUpdated_Filter>>>;
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

export enum MinimumSubscriptionBalanceUpdated_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  NewMinimumSubscriptionBalance = 'newMinimumSubscriptionBalance',
  TransactionHash = 'transactionHash'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type OwnershipTransferRequested = {
  __typename?: 'OwnershipTransferRequested';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  from: Scalars['Bytes'];
  id: Scalars['Bytes'];
  to: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type OwnershipTransferRequested_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<OwnershipTransferRequested_Filter>>>;
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
  from?: InputMaybe<Scalars['Bytes']>;
  from_contains?: InputMaybe<Scalars['Bytes']>;
  from_gt?: InputMaybe<Scalars['Bytes']>;
  from_gte?: InputMaybe<Scalars['Bytes']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']>>;
  from_lt?: InputMaybe<Scalars['Bytes']>;
  from_lte?: InputMaybe<Scalars['Bytes']>;
  from_not?: InputMaybe<Scalars['Bytes']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
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
  or?: InputMaybe<Array<InputMaybe<OwnershipTransferRequested_Filter>>>;
  to?: InputMaybe<Scalars['Bytes']>;
  to_contains?: InputMaybe<Scalars['Bytes']>;
  to_gt?: InputMaybe<Scalars['Bytes']>;
  to_gte?: InputMaybe<Scalars['Bytes']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_lt?: InputMaybe<Scalars['Bytes']>;
  to_lte?: InputMaybe<Scalars['Bytes']>;
  to_not?: InputMaybe<Scalars['Bytes']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
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

export enum OwnershipTransferRequested_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  From = 'from',
  Id = 'id',
  To = 'to',
  TransactionHash = 'transactionHash'
}

export type OwnershipTransferred = {
  __typename?: 'OwnershipTransferred';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  from: Scalars['Bytes'];
  id: Scalars['Bytes'];
  to: Scalars['Bytes'];
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
  from?: InputMaybe<Scalars['Bytes']>;
  from_contains?: InputMaybe<Scalars['Bytes']>;
  from_gt?: InputMaybe<Scalars['Bytes']>;
  from_gte?: InputMaybe<Scalars['Bytes']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']>>;
  from_lt?: InputMaybe<Scalars['Bytes']>;
  from_lte?: InputMaybe<Scalars['Bytes']>;
  from_not?: InputMaybe<Scalars['Bytes']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
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
  or?: InputMaybe<Array<InputMaybe<OwnershipTransferred_Filter>>>;
  to?: InputMaybe<Scalars['Bytes']>;
  to_contains?: InputMaybe<Scalars['Bytes']>;
  to_gt?: InputMaybe<Scalars['Bytes']>;
  to_gte?: InputMaybe<Scalars['Bytes']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_lt?: InputMaybe<Scalars['Bytes']>;
  to_lte?: InputMaybe<Scalars['Bytes']>;
  to_not?: InputMaybe<Scalars['Bytes']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
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
  From = 'from',
  Id = 'id',
  To = 'to',
  TransactionHash = 'transactionHash'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  feeManagerCutUpdated?: Maybe<FeeManagerCutUpdated>;
  feeManagerCutUpdateds: Array<FeeManagerCutUpdated>;
  fulfillRequest?: Maybe<FulfillRequest>;
  fulfillRequests: Array<FulfillRequest>;
  functionCallCompleted?: Maybe<FunctionCallCompleted>;
  functionCallCompleteds: Array<FunctionCallCompleted>;
  functionCalled?: Maybe<FunctionCalled>;
  functionCalleds: Array<FunctionCalled>;
  functionRegistered?: Maybe<FunctionRegistered>;
  functionRegistereds: Array<FunctionRegistered>;
  maxGasLimitUpdated?: Maybe<MaxGasLimitUpdated>;
  maxGasLimitUpdateds: Array<MaxGasLimitUpdated>;
  minimumSubscriptionBalanceUpdated?: Maybe<MinimumSubscriptionBalanceUpdated>;
  minimumSubscriptionBalanceUpdateds: Array<MinimumSubscriptionBalanceUpdated>;
  ownershipTransferRequested?: Maybe<OwnershipTransferRequested>;
  ownershipTransferRequesteds: Array<OwnershipTransferRequested>;
  ownershipTransferred?: Maybe<OwnershipTransferred>;
  ownershipTransferreds: Array<OwnershipTransferred>;
  requestFulfilled?: Maybe<RequestFulfilled>;
  requestFulfilleds: Array<RequestFulfilled>;
  requestSent?: Maybe<RequestSent>;
  requestSents: Array<RequestSent>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryFeeManagerCutUpdatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFeeManagerCutUpdatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FeeManagerCutUpdated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FeeManagerCutUpdated_Filter>;
};


export type QueryFulfillRequestArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFulfillRequestsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FulfillRequest_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FulfillRequest_Filter>;
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


export type QueryMaxGasLimitUpdatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMaxGasLimitUpdatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MaxGasLimitUpdated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MaxGasLimitUpdated_Filter>;
};


export type QueryMinimumSubscriptionBalanceUpdatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMinimumSubscriptionBalanceUpdatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MinimumSubscriptionBalanceUpdated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MinimumSubscriptionBalanceUpdated_Filter>;
};


export type QueryOwnershipTransferRequestedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOwnershipTransferRequestedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OwnershipTransferRequested_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OwnershipTransferRequested_Filter>;
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


export type QueryRequestFulfilledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRequestFulfilledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RequestFulfilled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RequestFulfilled_Filter>;
};


export type QueryRequestSentArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRequestSentsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RequestSent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RequestSent_Filter>;
};

export type RequestFulfilled = {
  __typename?: 'RequestFulfilled';
  FunctionsManager_id: Scalars['Bytes'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type RequestFulfilled_Filter = {
  FunctionsManager_id?: InputMaybe<Scalars['Bytes']>;
  FunctionsManager_id_contains?: InputMaybe<Scalars['Bytes']>;
  FunctionsManager_id_gt?: InputMaybe<Scalars['Bytes']>;
  FunctionsManager_id_gte?: InputMaybe<Scalars['Bytes']>;
  FunctionsManager_id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  FunctionsManager_id_lt?: InputMaybe<Scalars['Bytes']>;
  FunctionsManager_id_lte?: InputMaybe<Scalars['Bytes']>;
  FunctionsManager_id_not?: InputMaybe<Scalars['Bytes']>;
  FunctionsManager_id_not_contains?: InputMaybe<Scalars['Bytes']>;
  FunctionsManager_id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RequestFulfilled_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<RequestFulfilled_Filter>>>;
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

export enum RequestFulfilled_OrderBy {
  FunctionsManagerId = 'FunctionsManager_id',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  TransactionHash = 'transactionHash'
}

export type RequestSent = {
  __typename?: 'RequestSent';
  FunctionsManager_id: Scalars['Bytes'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type RequestSent_Filter = {
  FunctionsManager_id?: InputMaybe<Scalars['Bytes']>;
  FunctionsManager_id_contains?: InputMaybe<Scalars['Bytes']>;
  FunctionsManager_id_gt?: InputMaybe<Scalars['Bytes']>;
  FunctionsManager_id_gte?: InputMaybe<Scalars['Bytes']>;
  FunctionsManager_id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  FunctionsManager_id_lt?: InputMaybe<Scalars['Bytes']>;
  FunctionsManager_id_lte?: InputMaybe<Scalars['Bytes']>;
  FunctionsManager_id_not?: InputMaybe<Scalars['Bytes']>;
  FunctionsManager_id_not_contains?: InputMaybe<Scalars['Bytes']>;
  FunctionsManager_id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RequestSent_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<RequestSent_Filter>>>;
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

export enum RequestSent_OrderBy {
  FunctionsManagerId = 'FunctionsManager_id',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  TransactionHash = 'transactionHash'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  feeManagerCutUpdated?: Maybe<FeeManagerCutUpdated>;
  feeManagerCutUpdateds: Array<FeeManagerCutUpdated>;
  fulfillRequest?: Maybe<FulfillRequest>;
  fulfillRequests: Array<FulfillRequest>;
  functionCallCompleted?: Maybe<FunctionCallCompleted>;
  functionCallCompleteds: Array<FunctionCallCompleted>;
  functionCalled?: Maybe<FunctionCalled>;
  functionCalleds: Array<FunctionCalled>;
  functionRegistered?: Maybe<FunctionRegistered>;
  functionRegistereds: Array<FunctionRegistered>;
  maxGasLimitUpdated?: Maybe<MaxGasLimitUpdated>;
  maxGasLimitUpdateds: Array<MaxGasLimitUpdated>;
  minimumSubscriptionBalanceUpdated?: Maybe<MinimumSubscriptionBalanceUpdated>;
  minimumSubscriptionBalanceUpdateds: Array<MinimumSubscriptionBalanceUpdated>;
  ownershipTransferRequested?: Maybe<OwnershipTransferRequested>;
  ownershipTransferRequesteds: Array<OwnershipTransferRequested>;
  ownershipTransferred?: Maybe<OwnershipTransferred>;
  ownershipTransferreds: Array<OwnershipTransferred>;
  requestFulfilled?: Maybe<RequestFulfilled>;
  requestFulfilleds: Array<RequestFulfilled>;
  requestSent?: Maybe<RequestSent>;
  requestSents: Array<RequestSent>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionFeeManagerCutUpdatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFeeManagerCutUpdatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FeeManagerCutUpdated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FeeManagerCutUpdated_Filter>;
};


export type SubscriptionFulfillRequestArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFulfillRequestsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FulfillRequest_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FulfillRequest_Filter>;
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


export type SubscriptionMaxGasLimitUpdatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMaxGasLimitUpdatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MaxGasLimitUpdated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MaxGasLimitUpdated_Filter>;
};


export type SubscriptionMinimumSubscriptionBalanceUpdatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMinimumSubscriptionBalanceUpdatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MinimumSubscriptionBalanceUpdated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MinimumSubscriptionBalanceUpdated_Filter>;
};


export type SubscriptionOwnershipTransferRequestedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOwnershipTransferRequestedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OwnershipTransferRequested_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OwnershipTransferRequested_Filter>;
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


export type SubscriptionRequestFulfilledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRequestFulfilledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RequestFulfilled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RequestFulfilled_Filter>;
};


export type SubscriptionRequestSentArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRequestSentsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RequestSent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RequestSent_Filter>;
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

export type AuthorFunctionRegisteredsQueryVariables = Exact<{
  first: Scalars['Int'];
  skip: Scalars['Int'];
  owner: Scalars['Bytes'];
}>;


export type AuthorFunctionRegisteredsQuery = { __typename?: 'Query', functionRegistereds: Array<{ __typename?: 'FunctionRegistered', id: any, functionId: any, owner: any, metadata_name: string, metadata_desc: string, metadata_imageUrl: string, metadata_category: any, fee: any, blockTimestamp: any }> };

export type DrilldownPageQueryVariables = Exact<{
  functionId: Scalars['ID'];
}>;


export type DrilldownPageQuery = { __typename?: 'Query', functionRegistered?: { __typename?: 'FunctionRegistered', id: any, functionId: any, owner: any, metadata_owner: any, metadata_name: string, metadata_desc: string, metadata_imageUrl: string, metadata_expectedArgs: Array<string>, metadata_category: any, fee: any, subId: any } | null };

export type EventSpammerFunctionRegisteredQueryVariables = Exact<{
  first: Scalars['Int'];
  skip: Scalars['Int'];
}>;


export type EventSpammerFunctionRegisteredQuery = { __typename?: 'Query', functionRegistereds: Array<{ __typename?: 'FunctionRegistered', id: any, functionId: any, owner: any, fee: any, metadata_name: string, metadata_desc: string, metadata_imageUrl: string, metadata_category: any, blockTimestamp: any }> };

export type EventSpammerRecentFunctionRegisteredQueryVariables = Exact<{ [key: string]: never; }>;


export type EventSpammerRecentFunctionRegisteredQuery = { __typename?: 'Query', functionRegistereds: Array<{ __typename?: 'FunctionRegistered', id: any, functionId: any, owner: any, metadata_name: string, metadata_desc: string, metadata_imageUrl: string, metadata_category: any }> };

export type EventSpammerOwnerPageQueryVariables = Exact<{
  owner: Scalars['Bytes'];
}>;


export type EventSpammerOwnerPageQuery = { __typename?: 'Query', functionRegistereds: Array<{ __typename?: 'FunctionRegistered', id: any, functionId: any, owner: any, blockTimestamp: any, fee: any, subId: any, metadata_name: string, metadata_imageUrl: string }> };

export type EventSpammerOwnerPageCountsQueryVariables = Exact<{
  functionId: Scalars['Bytes'];
  blockTimestamp_gt: Scalars['BigInt'];
}>;


export type EventSpammerOwnerPageCountsQuery = { __typename?: 'Query', functionCalleds: Array<{ __typename?: 'FunctionCalled', blockTimestamp: any }> };

export type EventSpammerOwnerPageStatsQueryVariables = Exact<{
  owner: Scalars['Bytes'];
  blockTimestamp_gt: Scalars['BigInt'];
}>;


export type EventSpammerOwnerPageStatsQuery = { __typename?: 'Query', functionCalleds: Array<{ __typename?: 'FunctionCalled', fee: any, blockTimestamp: any }> };


export const AuthorFunctionRegisteredsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuthorFunctionRegistereds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"owner"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Bytes"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionRegistereds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"blockNumber"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"owner"},"value":{"kind":"Variable","name":{"kind":"Name","value":"owner"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"functionId"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_name"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_desc"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_category"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"blockTimestamp"}}]}}]}}]} as unknown as DocumentNode<AuthorFunctionRegisteredsQuery, AuthorFunctionRegisteredsQueryVariables>;
export const DrilldownPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DrilldownPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionRegistered"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"functionId"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_owner"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_name"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_desc"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_expectedArgs"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_category"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"subId"}}]}}]}}]} as unknown as DocumentNode<DrilldownPageQuery, DrilldownPageQueryVariables>;
export const EventSpammerFunctionRegisteredDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventSpammerFunctionRegistered"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionRegistereds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"blockNumber"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"functionId"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_name"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_desc"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_category"}},{"kind":"Field","name":{"kind":"Name","value":"blockTimestamp"}}]}}]}}]} as unknown as DocumentNode<EventSpammerFunctionRegisteredQuery, EventSpammerFunctionRegisteredQueryVariables>;
export const EventSpammerRecentFunctionRegisteredDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventSpammerRecentFunctionRegistered"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionRegistereds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"blockNumber"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"3"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"functionId"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_name"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_desc"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_category"}}]}}]}}]} as unknown as DocumentNode<EventSpammerRecentFunctionRegisteredQuery, EventSpammerRecentFunctionRegisteredQueryVariables>;
export const EventSpammerOwnerPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventSpammerOwnerPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"owner"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Bytes"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionRegistereds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"blockTimestamp"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"owner"},"value":{"kind":"Variable","name":{"kind":"Name","value":"owner"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"functionId"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"blockTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"subId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_name"}},{"kind":"Field","name":{"kind":"Name","value":"metadata_imageUrl"}}]}}]}}]} as unknown as DocumentNode<EventSpammerOwnerPageQuery, EventSpammerOwnerPageQueryVariables>;
export const EventSpammerOwnerPageCountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventSpammerOwnerPageCounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Bytes"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"blockTimestamp_gt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionCalleds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"functionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"functionId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"blockTimestamp_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"blockTimestamp_gt"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10000"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockTimestamp"}}]}}]}}]} as unknown as DocumentNode<EventSpammerOwnerPageCountsQuery, EventSpammerOwnerPageCountsQueryVariables>;
export const EventSpammerOwnerPageStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventSpammerOwnerPageStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"owner"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Bytes"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"blockTimestamp_gt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"functionCalleds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"owner"},"value":{"kind":"Variable","name":{"kind":"Name","value":"owner"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"blockTimestamp_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"blockTimestamp_gt"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10000"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"blockTimestamp"}}]}}]}}]} as unknown as DocumentNode<EventSpammerOwnerPageStatsQuery, EventSpammerOwnerPageStatsQueryVariables>;