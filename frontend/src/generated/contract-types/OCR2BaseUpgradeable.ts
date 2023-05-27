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

export interface OCR2BaseUpgradeableInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "acceptOwnership"
      | "latestConfigDetails"
      | "latestConfigDigestAndEpoch"
      | "owner"
      | "setConfig"
      | "transferOwnership"
      | "transmit"
      | "transmitters"
      | "typeAndVersion"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "ConfigSet"
      | "Initialized"
      | "OwnershipTransferRequested"
      | "OwnershipTransferred"
      | "Transmitted"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "acceptOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "latestConfigDetails",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "latestConfigDigestAndEpoch",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setConfig",
    values: [
      AddressLike[],
      AddressLike[],
      BigNumberish,
      BytesLike,
      BigNumberish,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transmit",
    values: [
      [BytesLike, BytesLike, BytesLike],
      BytesLike,
      BytesLike[],
      BytesLike[],
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "transmitters",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "typeAndVersion",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "acceptOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "latestConfigDetails",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "latestConfigDigestAndEpoch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setConfig", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transmit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transmitters",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "typeAndVersion",
    data: BytesLike
  ): Result;
}

export namespace ConfigSetEvent {
  export type InputTuple = [
    previousConfigBlockNumber: BigNumberish,
    configDigest: BytesLike,
    configCount: BigNumberish,
    signers: AddressLike[],
    transmitters: AddressLike[],
    f: BigNumberish,
    onchainConfig: BytesLike,
    offchainConfigVersion: BigNumberish,
    offchainConfig: BytesLike
  ];
  export type OutputTuple = [
    previousConfigBlockNumber: bigint,
    configDigest: string,
    configCount: bigint,
    signers: string[],
    transmitters: string[],
    f: bigint,
    onchainConfig: string,
    offchainConfigVersion: bigint,
    offchainConfig: string
  ];
  export interface OutputObject {
    previousConfigBlockNumber: bigint;
    configDigest: string;
    configCount: bigint;
    signers: string[];
    transmitters: string[];
    f: bigint;
    onchainConfig: string;
    offchainConfigVersion: bigint;
    offchainConfig: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace InitializedEvent {
  export type InputTuple = [version: BigNumberish];
  export type OutputTuple = [version: bigint];
  export interface OutputObject {
    version: bigint;
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

export namespace TransmittedEvent {
  export type InputTuple = [configDigest: BytesLike, epoch: BigNumberish];
  export type OutputTuple = [configDigest: string, epoch: bigint];
  export interface OutputObject {
    configDigest: string;
    epoch: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface OCR2BaseUpgradeable extends BaseContract {
  connect(runner?: ContractRunner | null): BaseContract;
  attach(addressOrName: AddressLike): this;
  deployed(): Promise<this>;

  interface: OCR2BaseUpgradeableInterface;

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

  latestConfigDetails: TypedContractMethod<
    [],
    [
      [bigint, bigint, string] & {
        configCount: bigint;
        blockNumber: bigint;
        configDigest: string;
      }
    ],
    "view"
  >;

  latestConfigDigestAndEpoch: TypedContractMethod<
    [],
    [
      [boolean, string, bigint] & {
        scanLogs: boolean;
        configDigest: string;
        epoch: bigint;
      }
    ],
    "view"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  setConfig: TypedContractMethod<
    [
      _signers: AddressLike[],
      _transmitters: AddressLike[],
      _f: BigNumberish,
      _onchainConfig: BytesLike,
      _offchainConfigVersion: BigNumberish,
      _offchainConfig: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  transferOwnership: TypedContractMethod<
    [to: AddressLike],
    [void],
    "nonpayable"
  >;

  transmit: TypedContractMethod<
    [
      reportContext: [BytesLike, BytesLike, BytesLike],
      report: BytesLike,
      rs: BytesLike[],
      ss: BytesLike[],
      rawVs: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  transmitters: TypedContractMethod<[], [string[]], "view">;

  typeAndVersion: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "acceptOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "latestConfigDetails"
  ): TypedContractMethod<
    [],
    [
      [bigint, bigint, string] & {
        configCount: bigint;
        blockNumber: bigint;
        configDigest: string;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "latestConfigDigestAndEpoch"
  ): TypedContractMethod<
    [],
    [
      [boolean, string, bigint] & {
        scanLogs: boolean;
        configDigest: string;
        epoch: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "setConfig"
  ): TypedContractMethod<
    [
      _signers: AddressLike[],
      _transmitters: AddressLike[],
      _f: BigNumberish,
      _onchainConfig: BytesLike,
      _offchainConfigVersion: BigNumberish,
      _offchainConfig: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[to: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "transmit"
  ): TypedContractMethod<
    [
      reportContext: [BytesLike, BytesLike, BytesLike],
      report: BytesLike,
      rs: BytesLike[],
      ss: BytesLike[],
      rawVs: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transmitters"
  ): TypedContractMethod<[], [string[]], "view">;
  getFunction(
    nameOrSignature: "typeAndVersion"
  ): TypedContractMethod<[], [string], "view">;

  getEvent(
    key: "ConfigSet"
  ): TypedContractEvent<
    ConfigSetEvent.InputTuple,
    ConfigSetEvent.OutputTuple,
    ConfigSetEvent.OutputObject
  >;
  getEvent(
    key: "Initialized"
  ): TypedContractEvent<
    InitializedEvent.InputTuple,
    InitializedEvent.OutputTuple,
    InitializedEvent.OutputObject
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
    key: "Transmitted"
  ): TypedContractEvent<
    TransmittedEvent.InputTuple,
    TransmittedEvent.OutputTuple,
    TransmittedEvent.OutputObject
  >;

  filters: {
    "ConfigSet(uint32,bytes32,uint64,address[],address[],uint8,bytes,uint64,bytes)": TypedContractEvent<
      ConfigSetEvent.InputTuple,
      ConfigSetEvent.OutputTuple,
      ConfigSetEvent.OutputObject
    >;
    ConfigSet: TypedContractEvent<
      ConfigSetEvent.InputTuple,
      ConfigSetEvent.OutputTuple,
      ConfigSetEvent.OutputObject
    >;

    "Initialized(uint8)": TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;
    Initialized: TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
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

    "Transmitted(bytes32,uint32)": TypedContractEvent<
      TransmittedEvent.InputTuple,
      TransmittedEvent.OutputTuple,
      TransmittedEvent.OutputObject
    >;
    Transmitted: TypedContractEvent<
      TransmittedEvent.InputTuple,
      TransmittedEvent.OutputTuple,
      TransmittedEvent.OutputObject
    >;
  };
}
