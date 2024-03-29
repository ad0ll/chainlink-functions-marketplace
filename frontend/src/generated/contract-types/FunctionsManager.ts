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

export declare namespace FunctionsManager {
  export type FunctionMetadataStruct = {
    functionId: BytesLike;
    owner: AddressLike;
    category: BytesLike;
    expectedReturnType: BigNumberish;
    codeLocation: BigNumberish;
    secretsLocation: BigNumberish;
    language: BigNumberish;
    name: string;
    desc: string;
    imageUrl: string;
    expectedArgs: string[];
  };

  export type FunctionMetadataStructOutput = [
    functionId: string,
    owner: string,
    category: string,
    expectedReturnType: bigint,
    codeLocation: bigint,
    secretsLocation: bigint,
    language: bigint,
    name: string,
    desc: string,
    imageUrl: string,
    expectedArgs: string[]
  ] & {
    functionId: string;
    owner: string;
    category: string;
    expectedReturnType: bigint;
    codeLocation: bigint;
    secretsLocation: bigint;
    language: bigint;
    name: string;
    desc: string;
    imageUrl: string;
    expectedArgs: string[];
  };

  export type FunctionExecuteMetadataStruct = {
    owner: AddressLike;
    subId: BigNumberish;
    fee: BigNumberish;
    unlockedProfitPool: BigNumberish;
    functionsCalledCount: BigNumberish;
    lockedProfitPool: BigNumberish;
    totalFeesCollected: BigNumberish;
    successfulResponseCount: BigNumberish;
    failedResponseCount: BigNumberish;
  };

  export type FunctionExecuteMetadataStructOutput = [
    owner: string,
    subId: bigint,
    fee: bigint,
    unlockedProfitPool: bigint,
    functionsCalledCount: bigint,
    lockedProfitPool: bigint,
    totalFeesCollected: bigint,
    successfulResponseCount: bigint,
    failedResponseCount: bigint
  ] & {
    owner: string;
    subId: bigint;
    fee: bigint;
    unlockedProfitPool: bigint;
    functionsCalledCount: bigint;
    lockedProfitPool: bigint;
    totalFeesCollected: bigint;
    successfulResponseCount: bigint;
    failedResponseCount: bigint;
  };

  export type FunctionResponseStruct = {
    functionId: BytesLike;
    caller: AddressLike;
    callbackFunction: BytesLike;
    premiumFee: BigNumberish;
    baseFee: BigNumberish;
    functionsManagerCut: BigNumberish;
    args: string[];
    response: BytesLike;
    err: BytesLike;
  };

  export type FunctionResponseStructOutput = [
    functionId: string,
    caller: string,
    callbackFunction: string,
    premiumFee: bigint,
    baseFee: bigint,
    functionsManagerCut: bigint,
    args: string[],
    response: string,
    err: string
  ] & {
    functionId: string;
    caller: string;
    callbackFunction: string;
    premiumFee: bigint;
    baseFee: bigint;
    functionsManagerCut: bigint;
    args: string[];
    response: string;
    err: string;
  };

  export type FunctionsRegisterRequestStruct = {
    fees: BigNumberish;
    functionName: string;
    desc: string;
    imageUrl: string;
    source: string;
    expectedArgs: string[];
    codeLocation: BigNumberish;
    secretsLocation: BigNumberish;
    language: BigNumberish;
    category: BytesLike;
    subId: BigNumberish;
    expectedReturnType: BigNumberish;
    secrets: BytesLike;
  };

  export type FunctionsRegisterRequestStructOutput = [
    fees: bigint,
    functionName: string,
    desc: string,
    imageUrl: string,
    source: string,
    expectedArgs: string[],
    codeLocation: bigint,
    secretsLocation: bigint,
    language: bigint,
    category: string,
    subId: bigint,
    expectedReturnType: bigint,
    secrets: string
  ] & {
    fees: bigint;
    functionName: string;
    desc: string;
    imageUrl: string;
    source: string;
    expectedArgs: string[];
    codeLocation: bigint;
    secretsLocation: bigint;
    language: bigint;
    category: string;
    subId: bigint;
    expectedReturnType: bigint;
    secrets: string;
  };
}

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

export interface FunctionsManagerInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "acceptOwnership"
      | "estimateCost"
      | "executeRequest"
      | "feeManagerCut"
      | "forceUnlockFees"
      | "functionExecuteMetadatas"
      | "functionManagerProfitPool"
      | "functionMetadatas"
      | "functionResponses"
      | "functionsCalledCount"
      | "functionsRegisteredCount"
      | "getDONPublicKey"
      | "getFunctionExecuteMetadata"
      | "getFunctionMetadata"
      | "getFunctionResponse"
      | "getFunctionResponseValue"
      | "getGasPrice"
      | "getSubscriptionBalance"
      | "handleOracleFulfillment"
      | "maxGasLimit"
      | "minimumSubscriptionBalance"
      | "owner"
      | "refillSubscription"
      | "registerFunction"
      | "setFeeManagerCut"
      | "setMaxGasLimit"
      | "setMinimumSubscriptionBalance"
      | "subscriptionBalances"
      | "totalFeesCollected"
      | "transferOwnership"
      | "withdrawFunctionProfitToAuthor"
      | "withdrawFunctionsManagerProfitToOwner"
      | "withdrawMultipleFunctionProfitToAuthor"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "FeeManagerCutUpdated"
      | "FulfillRequest"
      | "FunctionCallCompleted"
      | "FunctionCalled"
      | "FunctionRegistered"
      | "MaxGasLimitUpdated"
      | "MinimumSubscriptionBalanceUpdated"
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
    functionFragment: "estimateCost",
    values: [Functions.RequestStruct, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "executeRequest",
    values: [BytesLike, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "feeManagerCut",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "forceUnlockFees",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "functionExecuteMetadatas",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "functionManagerProfitPool",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "functionMetadatas",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "functionResponses",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "functionsCalledCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "functionsRegisteredCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getDONPublicKey",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getFunctionExecuteMetadata",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getFunctionMetadata",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getFunctionResponse",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getFunctionResponseValue",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getGasPrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSubscriptionBalance",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "handleOracleFulfillment",
    values: [BytesLike, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "maxGasLimit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "minimumSubscriptionBalance",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "refillSubscription",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "registerFunction",
    values: [FunctionsManager.FunctionsRegisterRequestStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "setFeeManagerCut",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxGasLimit",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setMinimumSubscriptionBalance",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "subscriptionBalances",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "totalFeesCollected",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawFunctionProfitToAuthor",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawFunctionsManagerProfitToOwner",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawMultipleFunctionProfitToAuthor",
    values: [BytesLike[]]
  ): string;

  decodeFunctionResult(
    functionFragment: "acceptOwnership",
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
    functionFragment: "feeManagerCut",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "forceUnlockFees",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "functionExecuteMetadatas",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "functionManagerProfitPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "functionMetadatas",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "functionResponses",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "functionsCalledCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "functionsRegisteredCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDONPublicKey",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFunctionExecuteMetadata",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFunctionMetadata",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFunctionResponse",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFunctionResponseValue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getGasPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSubscriptionBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "handleOracleFulfillment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxGasLimit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "minimumSubscriptionBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "refillSubscription",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerFunction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setFeeManagerCut",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxGasLimit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMinimumSubscriptionBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "subscriptionBalances",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalFeesCollected",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFunctionProfitToAuthor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFunctionsManagerProfitToOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawMultipleFunctionProfitToAuthor",
    data: BytesLike
  ): Result;
}

export namespace FeeManagerCutUpdatedEvent {
  export type InputTuple = [newFeeManagerCut: BigNumberish];
  export type OutputTuple = [newFeeManagerCut: bigint];
  export interface OutputObject {
    newFeeManagerCut: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
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

export namespace FunctionCallCompletedEvent {
  export type InputTuple = [
    functionId: BytesLike,
    requestId: BytesLike,
    caller: AddressLike,
    owner: AddressLike,
    callbackFunction: BytesLike,
    response: BytesLike,
    err: BytesLike
  ];
  export type OutputTuple = [
    functionId: string,
    requestId: string,
    caller: string,
    owner: string,
    callbackFunction: string,
    response: string,
    err: string
  ];
  export interface OutputObject {
    functionId: string;
    requestId: string;
    caller: string;
    owner: string;
    callbackFunction: string;
    response: string;
    err: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace FunctionCalledEvent {
  export type InputTuple = [
    functionId: BytesLike,
    requestId: BytesLike,
    caller: AddressLike,
    owner: AddressLike,
    callbackFunction: BytesLike,
    baseFee: BigNumberish,
    fee: BigNumberish,
    functionsManagerCut: BigNumberish,
    args: string[]
  ];
  export type OutputTuple = [
    functionId: string,
    requestId: string,
    caller: string,
    owner: string,
    callbackFunction: string,
    baseFee: bigint,
    fee: bigint,
    functionsManagerCut: bigint,
    args: string[]
  ];
  export interface OutputObject {
    functionId: string;
    requestId: string;
    caller: string;
    owner: string;
    callbackFunction: string;
    baseFee: bigint;
    fee: bigint;
    functionsManagerCut: bigint;
    args: string[];
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace FunctionRegisteredEvent {
  export type InputTuple = [
    functionId: BytesLike,
    owner: AddressLike,
    category: BytesLike,
    metadata: FunctionsManager.FunctionMetadataStruct,
    fee: BigNumberish,
    subId: BigNumberish
  ];
  export type OutputTuple = [
    functionId: string,
    owner: string,
    category: string,
    metadata: FunctionsManager.FunctionMetadataStructOutput,
    fee: bigint,
    subId: bigint
  ];
  export interface OutputObject {
    functionId: string;
    owner: string;
    category: string;
    metadata: FunctionsManager.FunctionMetadataStructOutput;
    fee: bigint;
    subId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MaxGasLimitUpdatedEvent {
  export type InputTuple = [newMaxGasLimit: BigNumberish];
  export type OutputTuple = [newMaxGasLimit: bigint];
  export interface OutputObject {
    newMaxGasLimit: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MinimumSubscriptionBalanceUpdatedEvent {
  export type InputTuple = [newMinimumSubscriptionBalance: BigNumberish];
  export type OutputTuple = [newMinimumSubscriptionBalance: bigint];
  export interface OutputObject {
    newMinimumSubscriptionBalance: bigint;
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

export interface FunctionsManager extends BaseContract {
  connect(runner?: ContractRunner | null): BaseContract;
  attach(addressOrName: AddressLike): this;
  deployed(): Promise<this>;

  interface: FunctionsManagerInterface;

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
    [functionId: BytesLike, args: string[]],
    [string],
    "nonpayable"
  >;

  feeManagerCut: TypedContractMethod<[], [bigint], "view">;

  forceUnlockFees: TypedContractMethod<
    [functionId: BytesLike],
    [void],
    "nonpayable"
  >;

  functionExecuteMetadatas: TypedContractMethod<
    [arg0: BytesLike],
    [
      [
        string,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint
      ] & {
        owner: string;
        subId: bigint;
        fee: bigint;
        unlockedProfitPool: bigint;
        functionsCalledCount: bigint;
        lockedProfitPool: bigint;
        totalFeesCollected: bigint;
        successfulResponseCount: bigint;
        failedResponseCount: bigint;
      }
    ],
    "view"
  >;

  functionManagerProfitPool: TypedContractMethod<[], [bigint], "view">;

  functionMetadatas: TypedContractMethod<
    [arg0: BytesLike],
    [
      [
        string,
        string,
        string,
        bigint,
        bigint,
        bigint,
        bigint,
        string,
        string,
        string
      ] & {
        functionId: string;
        owner: string;
        category: string;
        expectedReturnType: bigint;
        codeLocation: bigint;
        secretsLocation: bigint;
        language: bigint;
        name: string;
        desc: string;
        imageUrl: string;
      }
    ],
    "view"
  >;

  functionResponses: TypedContractMethod<
    [arg0: BytesLike],
    [
      [string, string, string, bigint, bigint, bigint, string, string] & {
        functionId: string;
        caller: string;
        callbackFunction: string;
        premiumFee: bigint;
        baseFee: bigint;
        functionsManagerCut: bigint;
        response: string;
        err: string;
      }
    ],
    "view"
  >;

  functionsCalledCount: TypedContractMethod<[], [bigint], "view">;

  functionsRegisteredCount: TypedContractMethod<[], [bigint], "view">;

  getDONPublicKey: TypedContractMethod<[], [string], "view">;

  getFunctionExecuteMetadata: TypedContractMethod<
    [_functionId: BytesLike],
    [FunctionsManager.FunctionExecuteMetadataStructOutput],
    "view"
  >;

  getFunctionMetadata: TypedContractMethod<
    [_functionId: BytesLike],
    [FunctionsManager.FunctionMetadataStructOutput],
    "view"
  >;

  getFunctionResponse: TypedContractMethod<
    [_requestId: BytesLike],
    [FunctionsManager.FunctionResponseStructOutput],
    "view"
  >;

  getFunctionResponseValue: TypedContractMethod<
    [_requestId: BytesLike],
    [string],
    "view"
  >;

  getGasPrice: TypedContractMethod<[], [bigint], "view">;

  getSubscriptionBalance: TypedContractMethod<
    [_subscriptionId: BigNumberish],
    [bigint],
    "view"
  >;

  handleOracleFulfillment: TypedContractMethod<
    [requestId: BytesLike, response: BytesLike, err: BytesLike],
    [void],
    "nonpayable"
  >;

  maxGasLimit: TypedContractMethod<[], [bigint], "view">;

  minimumSubscriptionBalance: TypedContractMethod<[], [bigint], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  refillSubscription: TypedContractMethod<
    [_subscriptionId: BigNumberish],
    [void],
    "nonpayable"
  >;

  registerFunction: TypedContractMethod<
    [request: FunctionsManager.FunctionsRegisterRequestStruct],
    [string],
    "payable"
  >;

  setFeeManagerCut: TypedContractMethod<
    [_feeManagerCut: BigNumberish],
    [void],
    "nonpayable"
  >;

  setMaxGasLimit: TypedContractMethod<
    [_maxGasLimit: BigNumberish],
    [void],
    "nonpayable"
  >;

  setMinimumSubscriptionBalance: TypedContractMethod<
    [_minimumSubBalance: BigNumberish],
    [void],
    "nonpayable"
  >;

  subscriptionBalances: TypedContractMethod<
    [arg0: BigNumberish],
    [bigint],
    "view"
  >;

  totalFeesCollected: TypedContractMethod<[], [bigint], "view">;

  transferOwnership: TypedContractMethod<
    [to: AddressLike],
    [void],
    "nonpayable"
  >;

  withdrawFunctionProfitToAuthor: TypedContractMethod<
    [functionId: BytesLike],
    [void],
    "nonpayable"
  >;

  withdrawFunctionsManagerProfitToOwner: TypedContractMethod<
    [],
    [void],
    "nonpayable"
  >;

  withdrawMultipleFunctionProfitToAuthor: TypedContractMethod<
    [functionIds: BytesLike[]],
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
    [functionId: BytesLike, args: string[]],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "feeManagerCut"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "forceUnlockFees"
  ): TypedContractMethod<[functionId: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "functionExecuteMetadatas"
  ): TypedContractMethod<
    [arg0: BytesLike],
    [
      [
        string,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint
      ] & {
        owner: string;
        subId: bigint;
        fee: bigint;
        unlockedProfitPool: bigint;
        functionsCalledCount: bigint;
        lockedProfitPool: bigint;
        totalFeesCollected: bigint;
        successfulResponseCount: bigint;
        failedResponseCount: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "functionManagerProfitPool"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "functionMetadatas"
  ): TypedContractMethod<
    [arg0: BytesLike],
    [
      [
        string,
        string,
        string,
        bigint,
        bigint,
        bigint,
        bigint,
        string,
        string,
        string
      ] & {
        functionId: string;
        owner: string;
        category: string;
        expectedReturnType: bigint;
        codeLocation: bigint;
        secretsLocation: bigint;
        language: bigint;
        name: string;
        desc: string;
        imageUrl: string;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "functionResponses"
  ): TypedContractMethod<
    [arg0: BytesLike],
    [
      [string, string, string, bigint, bigint, bigint, string, string] & {
        functionId: string;
        caller: string;
        callbackFunction: string;
        premiumFee: bigint;
        baseFee: bigint;
        functionsManagerCut: bigint;
        response: string;
        err: string;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "functionsCalledCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "functionsRegisteredCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getDONPublicKey"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getFunctionExecuteMetadata"
  ): TypedContractMethod<
    [_functionId: BytesLike],
    [FunctionsManager.FunctionExecuteMetadataStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getFunctionMetadata"
  ): TypedContractMethod<
    [_functionId: BytesLike],
    [FunctionsManager.FunctionMetadataStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getFunctionResponse"
  ): TypedContractMethod<
    [_requestId: BytesLike],
    [FunctionsManager.FunctionResponseStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getFunctionResponseValue"
  ): TypedContractMethod<[_requestId: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "getGasPrice"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getSubscriptionBalance"
  ): TypedContractMethod<[_subscriptionId: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "handleOracleFulfillment"
  ): TypedContractMethod<
    [requestId: BytesLike, response: BytesLike, err: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "maxGasLimit"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "minimumSubscriptionBalance"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "refillSubscription"
  ): TypedContractMethod<[_subscriptionId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "registerFunction"
  ): TypedContractMethod<
    [request: FunctionsManager.FunctionsRegisterRequestStruct],
    [string],
    "payable"
  >;
  getFunction(
    nameOrSignature: "setFeeManagerCut"
  ): TypedContractMethod<[_feeManagerCut: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setMaxGasLimit"
  ): TypedContractMethod<[_maxGasLimit: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setMinimumSubscriptionBalance"
  ): TypedContractMethod<
    [_minimumSubBalance: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "subscriptionBalances"
  ): TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "totalFeesCollected"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[to: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawFunctionProfitToAuthor"
  ): TypedContractMethod<[functionId: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawFunctionsManagerProfitToOwner"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawMultipleFunctionProfitToAuthor"
  ): TypedContractMethod<[functionIds: BytesLike[]], [void], "nonpayable">;

  getEvent(
    key: "FeeManagerCutUpdated"
  ): TypedContractEvent<
    FeeManagerCutUpdatedEvent.InputTuple,
    FeeManagerCutUpdatedEvent.OutputTuple,
    FeeManagerCutUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "FulfillRequest"
  ): TypedContractEvent<
    FulfillRequestEvent.InputTuple,
    FulfillRequestEvent.OutputTuple,
    FulfillRequestEvent.OutputObject
  >;
  getEvent(
    key: "FunctionCallCompleted"
  ): TypedContractEvent<
    FunctionCallCompletedEvent.InputTuple,
    FunctionCallCompletedEvent.OutputTuple,
    FunctionCallCompletedEvent.OutputObject
  >;
  getEvent(
    key: "FunctionCalled"
  ): TypedContractEvent<
    FunctionCalledEvent.InputTuple,
    FunctionCalledEvent.OutputTuple,
    FunctionCalledEvent.OutputObject
  >;
  getEvent(
    key: "FunctionRegistered"
  ): TypedContractEvent<
    FunctionRegisteredEvent.InputTuple,
    FunctionRegisteredEvent.OutputTuple,
    FunctionRegisteredEvent.OutputObject
  >;
  getEvent(
    key: "MaxGasLimitUpdated"
  ): TypedContractEvent<
    MaxGasLimitUpdatedEvent.InputTuple,
    MaxGasLimitUpdatedEvent.OutputTuple,
    MaxGasLimitUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "MinimumSubscriptionBalanceUpdated"
  ): TypedContractEvent<
    MinimumSubscriptionBalanceUpdatedEvent.InputTuple,
    MinimumSubscriptionBalanceUpdatedEvent.OutputTuple,
    MinimumSubscriptionBalanceUpdatedEvent.OutputObject
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
    "FeeManagerCutUpdated(uint32)": TypedContractEvent<
      FeeManagerCutUpdatedEvent.InputTuple,
      FeeManagerCutUpdatedEvent.OutputTuple,
      FeeManagerCutUpdatedEvent.OutputObject
    >;
    FeeManagerCutUpdated: TypedContractEvent<
      FeeManagerCutUpdatedEvent.InputTuple,
      FeeManagerCutUpdatedEvent.OutputTuple,
      FeeManagerCutUpdatedEvent.OutputObject
    >;

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

    "FunctionCallCompleted(bytes32,bytes32,address,address,bytes32,bytes,bytes)": TypedContractEvent<
      FunctionCallCompletedEvent.InputTuple,
      FunctionCallCompletedEvent.OutputTuple,
      FunctionCallCompletedEvent.OutputObject
    >;
    FunctionCallCompleted: TypedContractEvent<
      FunctionCallCompletedEvent.InputTuple,
      FunctionCallCompletedEvent.OutputTuple,
      FunctionCallCompletedEvent.OutputObject
    >;

    "FunctionCalled(bytes32,bytes32,address,address,bytes32,uint96,uint96,uint96,string[])": TypedContractEvent<
      FunctionCalledEvent.InputTuple,
      FunctionCalledEvent.OutputTuple,
      FunctionCalledEvent.OutputObject
    >;
    FunctionCalled: TypedContractEvent<
      FunctionCalledEvent.InputTuple,
      FunctionCalledEvent.OutputTuple,
      FunctionCalledEvent.OutputObject
    >;

    "FunctionRegistered(bytes32,address,bytes32,tuple,uint96,uint64)": TypedContractEvent<
      FunctionRegisteredEvent.InputTuple,
      FunctionRegisteredEvent.OutputTuple,
      FunctionRegisteredEvent.OutputObject
    >;
    FunctionRegistered: TypedContractEvent<
      FunctionRegisteredEvent.InputTuple,
      FunctionRegisteredEvent.OutputTuple,
      FunctionRegisteredEvent.OutputObject
    >;

    "MaxGasLimitUpdated(uint32)": TypedContractEvent<
      MaxGasLimitUpdatedEvent.InputTuple,
      MaxGasLimitUpdatedEvent.OutputTuple,
      MaxGasLimitUpdatedEvent.OutputObject
    >;
    MaxGasLimitUpdated: TypedContractEvent<
      MaxGasLimitUpdatedEvent.InputTuple,
      MaxGasLimitUpdatedEvent.OutputTuple,
      MaxGasLimitUpdatedEvent.OutputObject
    >;

    "MinimumSubscriptionBalanceUpdated(uint96)": TypedContractEvent<
      MinimumSubscriptionBalanceUpdatedEvent.InputTuple,
      MinimumSubscriptionBalanceUpdatedEvent.OutputTuple,
      MinimumSubscriptionBalanceUpdatedEvent.OutputObject
    >;
    MinimumSubscriptionBalanceUpdated: TypedContractEvent<
      MinimumSubscriptionBalanceUpdatedEvent.InputTuple,
      MinimumSubscriptionBalanceUpdatedEvent.OutputTuple,
      MinimumSubscriptionBalanceUpdatedEvent.OutputObject
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
