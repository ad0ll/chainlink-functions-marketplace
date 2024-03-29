/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "./common";

export declare namespace Functions {
  export type RequestStruct = {
    codeLocation: BigNumberish;
    secretsLocation: BigNumberish;
    language: BigNumberish;
    source: string;
    secrets: BytesLike;
    args: string[];
  };

  export type RequestStructOutput = [
    codeLocation: bigint,
    secretsLocation: bigint,
    language: bigint,
    source: string,
    secrets: string,
    args: string[]
  ] & {
    codeLocation: bigint;
    secretsLocation: bigint;
    language: bigint;
    source: string;
    secrets: string;
    args: string[];
  };
}

export interface FunctionsConsumerInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "acceptOwnership"
      | "addSimulatedRequestId"
      | "estimateCost"
      | "executeRequest"
      | "getDONPublicKey"
      | "handleOracleFulfillment"
      | "latestError"
      | "latestRequestId"
      | "latestResponse"
      | "owner"
      | "transferOwnership"
      | "updateOracleAddress"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "FulfillRequest"
      | "OCRResponse"
      | "OwnershipTransferRequested"
      | "OwnershipTransferred"
      | "RequestFulfilled"
      | "RequestSent"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "acceptOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addSimulatedRequestId",
    values: [AddressLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "estimateCost",
    values: [Functions.RequestStruct, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "executeRequest",
    values: [string, BytesLike, string[], BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getDONPublicKey",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "handleOracleFulfillment",
    values: [BytesLike, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "latestError",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "latestRequestId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "latestResponse",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateOracleAddress",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "acceptOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addSimulatedRequestId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "estimateCost",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDONPublicKey",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "handleOracleFulfillment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "latestError",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "latestRequestId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "latestResponse",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateOracleAddress",
    data: BytesLike
  ): Result;
}

export namespace FulfillRequestEvent {
  export type InputTuple = [
    requestId: BytesLike,
    response: BytesLike,
    err: BytesLike
  ];
  export type OutputTuple = [requestId: string, response: string, err: string];
  export interface OutputObject {
    requestId: string;
    response: string;
    err: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OCRResponseEvent {
  export type InputTuple = [
    requestId: BytesLike,
    result: BytesLike,
    err: BytesLike
  ];
  export type OutputTuple = [requestId: string, result: string, err: string];
  export interface OutputObject {
    requestId: string;
    result: string;
    err: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferRequestedEvent {
  export type InputTuple = [from: AddressLike, to: AddressLike];
  export type OutputTuple = [from: string, to: string];
  export interface OutputObject {
    from: string;
    to: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [from: AddressLike, to: AddressLike];
  export type OutputTuple = [from: string, to: string];
  export interface OutputObject {
    from: string;
    to: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RequestFulfilledEvent {
  export type InputTuple = [id: BytesLike];
  export type OutputTuple = [id: string];
  export interface OutputObject {
    id: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RequestSentEvent {
  export type InputTuple = [id: BytesLike];
  export type OutputTuple = [id: string];
  export interface OutputObject {
    id: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface FunctionsConsumer extends BaseContract {
  connect(runner?: ContractRunner | null): BaseContract;
  attach(addressOrName: AddressLike): this;
  deployed(): Promise<this>;

  interface: FunctionsConsumerInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  acceptOwnership: TypedContractMethod<[], [void], "nonpayable">;

  addSimulatedRequestId: TypedContractMethod<
    [oracleAddress: AddressLike, requestId: BytesLike],
    [void],
    "nonpayable"
  >;

  estimateCost: TypedContractMethod<
    [
      req: Functions.RequestStruct,
      subscriptionId: BigNumberish,
      gasLimit: BigNumberish,
      gasPrice: BigNumberish
    ],
    [bigint],
    "view"
  >;

  executeRequest: TypedContractMethod<
    [
      source: string,
      secrets: BytesLike,
      args: string[],
      subscriptionId: BigNumberish,
      gasLimit: BigNumberish
    ],
    [string],
    "nonpayable"
  >;

  getDONPublicKey: TypedContractMethod<[], [string], "view">;

  handleOracleFulfillment: TypedContractMethod<
    [requestId: BytesLike, response: BytesLike, err: BytesLike],
    [void],
    "nonpayable"
  >;

  latestError: TypedContractMethod<[], [string], "view">;

  latestRequestId: TypedContractMethod<[], [string], "view">;

  latestResponse: TypedContractMethod<[], [string], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  transferOwnership: TypedContractMethod<
    [to: AddressLike],
    [void],
    "nonpayable"
  >;

  updateOracleAddress: TypedContractMethod<
    [oracle: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "acceptOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "addSimulatedRequestId"
  ): TypedContractMethod<
    [oracleAddress: AddressLike, requestId: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "estimateCost"
  ): TypedContractMethod<
    [
      req: Functions.RequestStruct,
      subscriptionId: BigNumberish,
      gasLimit: BigNumberish,
      gasPrice: BigNumberish
    ],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "executeRequest"
  ): TypedContractMethod<
    [
      source: string,
      secrets: BytesLike,
      args: string[],
      subscriptionId: BigNumberish,
      gasLimit: BigNumberish
    ],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getDONPublicKey"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "handleOracleFulfillment"
  ): TypedContractMethod<
    [requestId: BytesLike, response: BytesLike, err: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "latestError"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "latestRequestId"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "latestResponse"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[to: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateOracleAddress"
  ): TypedContractMethod<[oracle: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "FulfillRequest"
  ): TypedContractEvent<
    FulfillRequestEvent.InputTuple,
    FulfillRequestEvent.OutputTuple,
    FulfillRequestEvent.OutputObject
  >;
  getEvent(
    key: "OCRResponse"
  ): TypedContractEvent<
    OCRResponseEvent.InputTuple,
    OCRResponseEvent.OutputTuple,
    OCRResponseEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferRequested"
  ): TypedContractEvent<
    OwnershipTransferRequestedEvent.InputTuple,
    OwnershipTransferRequestedEvent.OutputTuple,
    OwnershipTransferRequestedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "RequestFulfilled"
  ): TypedContractEvent<
    RequestFulfilledEvent.InputTuple,
    RequestFulfilledEvent.OutputTuple,
    RequestFulfilledEvent.OutputObject
  >;
  getEvent(
    key: "RequestSent"
  ): TypedContractEvent<
    RequestSentEvent.InputTuple,
    RequestSentEvent.OutputTuple,
    RequestSentEvent.OutputObject
  >;

  filters: {
    "FulfillRequest(bytes32,bytes,bytes)": TypedContractEvent<
      FulfillRequestEvent.InputTuple,
      FulfillRequestEvent.OutputTuple,
      FulfillRequestEvent.OutputObject
    >;
    FulfillRequest: TypedContractEvent<
      FulfillRequestEvent.InputTuple,
      FulfillRequestEvent.OutputTuple,
      FulfillRequestEvent.OutputObject
    >;

    "OCRResponse(bytes32,bytes,bytes)": TypedContractEvent<
      OCRResponseEvent.InputTuple,
      OCRResponseEvent.OutputTuple,
      OCRResponseEvent.OutputObject
    >;
    OCRResponse: TypedContractEvent<
      OCRResponseEvent.InputTuple,
      OCRResponseEvent.OutputTuple,
      OCRResponseEvent.OutputObject
    >;

    "OwnershipTransferRequested(address,address)": TypedContractEvent<
      OwnershipTransferRequestedEvent.InputTuple,
      OwnershipTransferRequestedEvent.OutputTuple,
      OwnershipTransferRequestedEvent.OutputObject
    >;
    OwnershipTransferRequested: TypedContractEvent<
      OwnershipTransferRequestedEvent.InputTuple,
      OwnershipTransferRequestedEvent.OutputTuple,
      OwnershipTransferRequestedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "RequestFulfilled(bytes32)": TypedContractEvent<
      RequestFulfilledEvent.InputTuple,
      RequestFulfilledEvent.OutputTuple,
      RequestFulfilledEvent.OutputObject
    >;
    RequestFulfilled: TypedContractEvent<
      RequestFulfilledEvent.InputTuple,
      RequestFulfilledEvent.OutputTuple,
      RequestFulfilledEvent.OutputObject
    >;

    "RequestSent(bytes32)": TypedContractEvent<
      RequestSentEvent.InputTuple,
      RequestSentEvent.OutputTuple,
      RequestSentEvent.OutputObject
    >;
    RequestSent: TypedContractEvent<
      RequestSentEvent.InputTuple,
      RequestSentEvent.OutputTuple,
      RequestSentEvent.OutputObject
    >;
  };
}
