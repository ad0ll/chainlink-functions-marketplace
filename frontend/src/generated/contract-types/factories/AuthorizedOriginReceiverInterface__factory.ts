/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, ContractRunner } from "ethers";
import type {
  AuthorizedOriginReceiverInterface,
  AuthorizedOriginReceiverInterfaceInterface,
} from "../AuthorizedOriginReceiverInterface";

const _abi = [
  {
    inputs: [],
    name: "activateAuthorizedReceiver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "senders",
        type: "address[]",
      },
    ],
    name: "addAuthorizedSenders",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "authorizedReceiverActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "deactivateAuthorizedReceiver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAuthorizedSenders",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "isAuthorizedSender",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "senders",
        type: "address[]",
      },
    ],
    name: "removeAuthorizedSenders",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class AuthorizedOriginReceiverInterface__factory {
  static readonly abi = _abi;
  static createInterface(): AuthorizedOriginReceiverInterfaceInterface {
    return new Interface(_abi) as AuthorizedOriginReceiverInterfaceInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): AuthorizedOriginReceiverInterface {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as AuthorizedOriginReceiverInterface;
  }
}