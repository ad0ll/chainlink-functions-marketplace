/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  ERC677ReceiverInterface,
  ERC677ReceiverInterfaceInterface,
} from "../ERC677ReceiverInterface";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "onTokenTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class ERC677ReceiverInterface__factory {
  static readonly abi = _abi;
  static createInterface(): ERC677ReceiverInterfaceInterface {
    return new Interface(_abi) as ERC677ReceiverInterfaceInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ERC677ReceiverInterface {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as ERC677ReceiverInterface;
  }
}
