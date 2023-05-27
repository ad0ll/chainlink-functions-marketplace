/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
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

export interface AuthorizedReceiverInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "getAuthorizedSenders"
      | "isAuthorizedSender"
      | "setAuthorizedSenders"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "AuthorizedSendersChanged"): EventFragment;

  encodeFunctionData(
    functionFragment: "getAuthorizedSenders",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isAuthorizedSender",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setAuthorizedSenders",
    values: [AddressLike[]]
  ): string;

  decodeFunctionResult(
    functionFragment: "getAuthorizedSenders",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isAuthorizedSender",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAuthorizedSenders",
    data: BytesLike
  ): Result;
}

export namespace AuthorizedSendersChangedEvent {
  export type InputTuple = [senders: AddressLike[], changedBy: AddressLike];
  export type OutputTuple = [senders: string[], changedBy: string];
  export interface OutputObject {
    senders: string[];
    changedBy: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface AuthorizedReceiver extends BaseContract {
  connect(runner?: ContractRunner | null): BaseContract;
  attach(addressOrName: AddressLike): this;
  deployed(): Promise<this>;

  interface: AuthorizedReceiverInterface;

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

  getAuthorizedSenders: TypedContractMethod<[], [string[]], "view">;

  isAuthorizedSender: TypedContractMethod<
    [sender: AddressLike],
    [boolean],
    "view"
  >;

  setAuthorizedSenders: TypedContractMethod<
    [senders: AddressLike[]],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getAuthorizedSenders"
  ): TypedContractMethod<[], [string[]], "view">;
  getFunction(
    nameOrSignature: "isAuthorizedSender"
  ): TypedContractMethod<[sender: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "setAuthorizedSenders"
  ): TypedContractMethod<[senders: AddressLike[]], [void], "nonpayable">;

  getEvent(
    key: "AuthorizedSendersChanged"
  ): TypedContractEvent<
    AuthorizedSendersChangedEvent.InputTuple,
    AuthorizedSendersChangedEvent.OutputTuple,
    AuthorizedSendersChangedEvent.OutputObject
  >;

  filters: {
    "AuthorizedSendersChanged(address[],address)": TypedContractEvent<
      AuthorizedSendersChangedEvent.InputTuple,
      AuthorizedSendersChangedEvent.OutputTuple,
      AuthorizedSendersChangedEvent.OutputObject
    >;
    AuthorizedSendersChanged: TypedContractEvent<
      AuthorizedSendersChangedEvent.InputTuple,
      AuthorizedSendersChangedEvent.OutputTuple,
      AuthorizedSendersChangedEvent.OutputObject
    >;
  };
}
