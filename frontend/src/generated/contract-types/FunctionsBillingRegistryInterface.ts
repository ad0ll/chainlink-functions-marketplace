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
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "./common";

export declare namespace FunctionsBillingRegistryInterface {
  export type RequestBillingStruct = {
    subscriptionId: BigNumberish;
    client: AddressLike;
    gasLimit: BigNumberish;
    gasPrice: BigNumberish;
  };

  export type RequestBillingStructOutput = [
    subscriptionId: bigint,
    client: string,
    gasLimit: bigint,
    gasPrice: bigint
  ] & {
    subscriptionId: bigint;
    client: string;
    gasLimit: bigint;
    gasPrice: bigint;
  };
}

export interface FunctionsBillingRegistryInterfaceInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "estimateCost"
      | "fulfillAndBill"
      | "getRequestConfig"
      | "getRequiredFee"
      | "getSubscriptionOwner"
      | "startBilling"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "estimateCost",
    values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "fulfillAndBill",
    values: [
      BytesLike,
      BytesLike,
      BytesLike,
      AddressLike,
      AddressLike[],
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getRequestConfig",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRequiredFee",
    values: [BytesLike, FunctionsBillingRegistryInterface.RequestBillingStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "getSubscriptionOwner",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "startBilling",
    values: [BytesLike, FunctionsBillingRegistryInterface.RequestBillingStruct]
  ): string;

  decodeFunctionResult(
    functionFragment: "estimateCost",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fulfillAndBill",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRequestConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRequiredFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSubscriptionOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "startBilling",
    data: BytesLike
  ): Result;
}

export interface FunctionsBillingRegistryInterface extends BaseContract {
  connect(runner?: ContractRunner | null): BaseContract;
  attach(addressOrName: AddressLike): this;
  deployed(): Promise<this>;

  interface: FunctionsBillingRegistryInterfaceInterface;

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

  estimateCost: TypedContractMethod<
    [
      gasLimit: BigNumberish,
      gasPrice: BigNumberish,
      donFee: BigNumberish,
      registryFee: BigNumberish
    ],
    [bigint],
    "view"
  >;

  fulfillAndBill: TypedContractMethod<
    [
      requestId: BytesLike,
      response: BytesLike,
      err: BytesLike,
      transmitter: AddressLike,
      signers: AddressLike[],
      signerCount: BigNumberish,
      reportValidationGas: BigNumberish,
      initialGas: BigNumberish
    ],
    [bigint],
    "nonpayable"
  >;

  getRequestConfig: TypedContractMethod<[], [[bigint, string[]]], "view">;

  getRequiredFee: TypedContractMethod<
    [
      data: BytesLike,
      billing: FunctionsBillingRegistryInterface.RequestBillingStruct
    ],
    [bigint],
    "view"
  >;

  getSubscriptionOwner: TypedContractMethod<
    [subscriptionId: BigNumberish],
    [string],
    "view"
  >;

  startBilling: TypedContractMethod<
    [
      data: BytesLike,
      billing: FunctionsBillingRegistryInterface.RequestBillingStruct
    ],
    [string],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "estimateCost"
  ): TypedContractMethod<
    [
      gasLimit: BigNumberish,
      gasPrice: BigNumberish,
      donFee: BigNumberish,
      registryFee: BigNumberish
    ],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "fulfillAndBill"
  ): TypedContractMethod<
    [
      requestId: BytesLike,
      response: BytesLike,
      err: BytesLike,
      transmitter: AddressLike,
      signers: AddressLike[],
      signerCount: BigNumberish,
      reportValidationGas: BigNumberish,
      initialGas: BigNumberish
    ],
    [bigint],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getRequestConfig"
  ): TypedContractMethod<[], [[bigint, string[]]], "view">;
  getFunction(
    nameOrSignature: "getRequiredFee"
  ): TypedContractMethod<
    [
      data: BytesLike,
      billing: FunctionsBillingRegistryInterface.RequestBillingStruct
    ],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getSubscriptionOwner"
  ): TypedContractMethod<[subscriptionId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "startBilling"
  ): TypedContractMethod<
    [
      data: BytesLike,
      billing: FunctionsBillingRegistryInterface.RequestBillingStruct
    ],
    [string],
    "nonpayable"
  >;

  filters: {};
}