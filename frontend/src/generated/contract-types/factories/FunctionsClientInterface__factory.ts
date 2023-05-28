/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, ContractRunner } from "ethers";
import type {
  FunctionsClientInterface,
  FunctionsClientInterfaceInterface,
} from "../FunctionsClientInterface";

const _abi = [
  {
    inputs: [],
    name: "getDONPublicKey",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "response",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "err",
        type: "bytes",
      },
    ],
    name: "handleOracleFulfillment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class FunctionsClientInterface__factory {
  static readonly abi = _abi;
  static createInterface(): FunctionsClientInterfaceInterface {
    return new Interface(_abi) as FunctionsClientInterfaceInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): FunctionsClientInterface {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as FunctionsClientInterface;
  }
}