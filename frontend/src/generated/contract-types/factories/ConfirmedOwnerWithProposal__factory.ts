/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../common";
import type {
  ConfirmedOwnerWithProposal,
  ConfirmedOwnerWithProposalInterface,
} from "../ConfirmedOwnerWithProposal";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "pendingOwner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "OwnershipTransferRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60803461015a57601f61041838819003918201601f19168301916001600160401b0383118484101761015f57808492604094855283398101031261015a57610052602061004b83610175565b9201610175565b906001600160a01b0390811690811561011557600080546001600160a01b0319908116841790915592169182610092575b60405161028e908161018a8239f35b3383146100d057829060015416176001557fed8889f560326eb138920d842192f0eb3dd22b4f139c87a2c57538e05bae1278600080a3388080610083565b60405162461bcd60e51b815260206004820152601760248201527f43616e6e6f74207472616e7366657220746f2073656c660000000000000000006044820152606490fd5b60405162461bcd60e51b815260206004820152601860248201527f43616e6e6f7420736574206f776e657220746f207a65726f00000000000000006044820152606490fd5b600080fd5b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b038216820361015a5756fe608080604052600436101561001357600080fd5b600090813560e01c90816379ba50971461018e575080638da5cb5b1461015b5763f2fde38b1461004257600080fd5b346101585760203660031901126101585760043573ffffffffffffffffffffffffffffffffffffffff80821680920361015457825416803303610110573382146100cc578173ffffffffffffffffffffffffffffffffffffffff1960015416176001557fed8889f560326eb138920d842192f0eb3dd22b4f139c87a2c57538e05bae12788380a380f35b606460405162461bcd60e51b815260206004820152601760248201527f43616e6e6f74207472616e7366657220746f2073656c660000000000000000006044820152fd5b606460405162461bcd60e51b815260206004820152601660248201527f4f6e6c792063616c6c61626c65206279206f776e6572000000000000000000006044820152fd5b8280fd5b80fd5b503461015857806003193601126101585773ffffffffffffffffffffffffffffffffffffffff6020915416604051908152f35b9050346102545781600319360112610254576001549073ffffffffffffffffffffffffffffffffffffffff9081831633036102125750825473ffffffffffffffffffffffffffffffffffffffff198082163390811786559316600155167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08380a380f35b8062461bcd60e51b6064925260206004820152601660248201527f4d7573742062652070726f706f736564206f776e6572000000000000000000006044820152fd5b5080fdfea26469706673582212200108dec7206585b4f55673b3606da03cae00eacb1261826c9eb44a8f1ceff5b264736f6c63430008120033";

type ConfirmedOwnerWithProposalConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ConfirmedOwnerWithProposalConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ConfirmedOwnerWithProposal__factory extends ContractFactory {
  constructor(...args: ConfirmedOwnerWithProposalConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    newOwner: AddressLike,
    pendingOwner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(newOwner, pendingOwner, overrides || {});
  }
  override deploy(
    newOwner: AddressLike,
    pendingOwner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(newOwner, pendingOwner, overrides || {}) as Promise<
      ConfirmedOwnerWithProposal & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): ConfirmedOwnerWithProposal__factory {
    return super.connect(runner) as ConfirmedOwnerWithProposal__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ConfirmedOwnerWithProposalInterface {
    return new Interface(_abi) as ConfirmedOwnerWithProposalInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ConfirmedOwnerWithProposal {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as ConfirmedOwnerWithProposal;
  }
}