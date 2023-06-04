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
import type { EventSpammer, EventSpammerInterface } from "../EventSpammer";

const _abi = [
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_authorizedCallers",
        type: "address[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "EmptySource",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "functionId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "callbackFunction",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "usedGas",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "response",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "err",
        type: "bytes",
      },
    ],
    name: "FunctionCallCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "functionId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "callbackFunction",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "gasDeposit",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "baseFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "FunctionCalled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "functionId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "fee",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "category",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "subId",
            type: "uint64",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "desc",
            type: "string",
          },
          {
            internalType: "string",
            name: "imageUrl",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "expectedArgs",
            type: "string[]",
          },
          {
            components: [
              {
                internalType: "enum Functions.Location",
                name: "codeLocation",
                type: "uint8",
              },
              {
                internalType: "enum Functions.Location",
                name: "secretsLocation",
                type: "uint8",
              },
              {
                internalType: "enum Functions.CodeLanguage",
                name: "language",
                type: "uint8",
              },
              {
                internalType: "string",
                name: "source",
                type: "string",
              },
              {
                internalType: "bytes",
                name: "secrets",
                type: "bytes",
              },
              {
                internalType: "string[]",
                name: "args",
                type: "string[]",
              },
            ],
            internalType: "struct Functions.Request",
            name: "request",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "subscriptionPool",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "unlockedProfitPool",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lockedProfitPool",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct EventSpammer.FunctionMetadata",
        name: "metadata",
        type: "tuple",
      },
    ],
    name: "FunctionRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_caller",
        type: "address",
      },
    ],
    name: "addAuthorizedCaller",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "authorizedCallers",
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
        internalType: "bytes32",
        name: "_functionId",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_caller",
        type: "address",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_callbackFunction",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_gasDeposit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_fee",
        type: "uint256",
      },
    ],
    name: "emitCallFunction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_functionId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_caller",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_callbackFunction",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_usedGas",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_response",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "_err",
        type: "bytes",
      },
    ],
    name: "emitCallbackWithData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_functionId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_desc",
        type: "string",
      },
      {
        internalType: "string",
        name: "_imageUrl",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "_expectedArgs",
        type: "string[]",
      },
      {
        internalType: "bytes32",
        name: "_category",
        type: "bytes32",
      },
      {
        internalType: "uint64",
        name: "_subId",
        type: "uint64",
      },
      {
        internalType: "uint256",
        name: "_fee",
        type: "uint256",
      },
      {
        internalType: "enum Functions.Location",
        name: "_codeLocation",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "_source",
        type: "string",
      },
    ],
    name: "emitRegisterFunction",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
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
  "0x6040608081523461019957610d1a8038038061001a816101b4565b928339810190602080828403126101995781516001600160401b039283821161019957019280601f8501121561019957835192831161019e5760059383851b9083806100678185016101b4565b809781520192820101928311610199579083879594939201905b82821061016d57505060008054336001600160a01b0319821681178355919492506001600160a01b03919082167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08680a360019567016345785d8a000087558685905b61010c575b5050505060029033835252209060ff1982541617905551610b4090816101da8239f35b9091929394958451821015610165575080821b84018501518316865260028552878620805460ff191688179055600019811461015157879594939291908701876100e4565b634e487b7160e01b86526011600452602486fd5b9594936100e9565b81519495509293919290916001600160a01b038116810361019957815286949392918301908301610081565b600080fd5b634e487b7160e01b600052604160045260246000fd5b6040519190601f01601f191682016001600160401b0381118382101761019e5760405256fe6080604052600436101561001257600080fd5b60003560e01c806313a155ea1461083f57806332b12c74146107505780634a742358146102ca5780634d6f7fc11461022a578063536fff6c146101eb578063715018a6146101855780638da5cb5b1461015e5763f2fde38b1461007457600080fd5b346101595760203660031901126101595761008d610884565b61009561097a565b6001600160a01b038091169081156100ef576000548273ffffffffffffffffffffffffffffffffffffffff19821617600055167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3005b608460405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152fd5b600080fd5b346101595760003660031901126101595760206001600160a01b0360005416604051908152f35b346101595760003660031901126101595761019e61097a565b60006001600160a01b03815473ffffffffffffffffffffffffffffffffffffffff1981168355167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a3005b34610159576020366003190112610159576001600160a01b0361020c610884565b166000526002602052602060ff604060002054166040519015158152f35b346101595760e0366003190112610159576102436108b0565b606435906001600160a01b03908183168093036101595733600052600260205261027460ff604060002054166109d2565b600154604051938452608435602085015260a4356040850152606084015260c43560808401521690602435907fc9720022133669f887636011749fb494b606ffd3a817aab09e90b8a2427dbe0860a060043592a4005b3461015957610160366003190112610159576102e461089a565b6044803567ffffffffffffffff81116101595761030590369060040161094c565b9160643567ffffffffffffffff81116101595761032690369060040161094c565b91909360843567ffffffffffffffff81116101595761034990369060040161094c565b60a4359367ffffffffffffffff851161015957366023860112156101595784600401359467ffffffffffffffff86116106fa578560051b91602460206103908186016108c6565b809981520193830101913683116101595760248101935b83851061071057505050505060e4359767ffffffffffffffff89168903610159576002610124351015610159576101443567ffffffffffffffff8111610159576103f590369060040161094c565b98909633600052600260205261041260ff604060002054166109d2565b6040519a8b67ffffffffffffffff6101808281810110920111176106fa5761051b996104e1978d606067ffffffffffffffff6104c9956001600160a01b036104d59a61018086016040526000865260006020870152600060408701526000858701528460808701528460a08701528460c08701528460e0870152610494610a1d565b6101008701526000610120870152600061014087015260006101608701521660208501526101043584521691015236916108ec565b60808c015236916108ec565b60a089015236916108ec565b60c086015260e085015260c4356040850152600061012085015260006101408501526000610160850152610513610a1d565b9236916108ec565b8051156106d0576101243582526000604083015260608201526101008201526040519060208252805160208301526001600160a01b0360208201511660408301526040810151606083015267ffffffffffffffff60608201511660808301526105e16105ca6105b461059e608085015161018060a08801526101a0870190610a61565b60a0850151868203601f190160c0880152610a61565b60c0840151858203601f190160e0870152610a61565b60e0830151848203601f1901610100860152610aa1565b610100820151601f19848303016101208501526105ff828251610afd565b61061160208201516020840190610afd565b60408101519060018210156106ba578261066e92604061016095015260a061065d61064b606085015160c0606086015260c0850190610a61565b60808501518482036080860152610a61565b9201519060a0818403910152610aa1565b916101208101516101408501526101408101518285015201516101808301527fcea057783a286810a204bfea7fec5a68e759c8ec0953960755b283c5517fc2b7339280600435930390a3005b634e487b7160e01b600052602160045260246000fd5b60046040517f22ce3edd000000000000000000000000000000000000000000000000000000008152fd5b634e487b7160e01b600052604160045260246000fd5b843567ffffffffffffffff811161015957820136604382011215610159576020916107458392369087602482013591016108ec565b8152019401936103a7565b34610159576101003660031901126101595761076a61089a565b6107726108b0565b67ffffffffffffffff9160c4358381116101595761079490369060040161092e565b9260e435908111610159576107ce7f6968e95d7bc2605bb814d168859020d6e2f617bc615d1ae5aef0ce68af0d163191369060040161092e565b913360005260026020526107e960ff604060002054166109d2565b61081e604051956001600160a01b038093168752608435602088015260a435604088015260a0606088015260a0870190610a61565b93858503608087015216938061083a6064359560043595610a61565b0390a4005b34610159576020366003190112610159576001600160a01b03610860610884565b61086861097a565b166000908152600260205260409020805460ff19166001179055005b600435906001600160a01b038216820361015957565b602435906001600160a01b038216820361015957565b604435906001600160a01b038216820361015957565b6040519190601f01601f1916820167ffffffffffffffff8111838210176106fa57604052565b92919267ffffffffffffffff82116106fa57610911601f8301601f19166020016108c6565b938285528282011161015957816000926020928387013784010152565b9080601f8301121561015957816020610949933591016108ec565b90565b9181601f840112156101595782359167ffffffffffffffff8311610159576020838186019501011161015957565b6001600160a01b0360005416330361098e57565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b156109d957565b606460405162461bcd60e51b815260206004820152600e60248201527f4e6f7420617574686f72697a65640000000000000000000000000000000000006044820152fd5b6040519060c0820182811067ffffffffffffffff8211176106fa57604052606060a08360008152600060208201526000604082015282808201528260808201520152565b919082519283825260005b848110610a8d575050826000602080949584010152601f8019910116010190565b602081830181015184830182015201610a6c565b908082519081815260208091019281808460051b8301019501936000915b848310610acf5750505050505090565b9091929394958480610aed600193601f198682030187528a51610a61565b9801930193019194939290610abf565b9060028210156106ba575256fea2646970667358221220871ddc4ccf874d2aa5a0f5df0366ce80866a54b63a4f46b4afce35099c07526e64736f6c63430008120033";

type EventSpammerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EventSpammerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EventSpammer__factory extends ContractFactory {
  constructor(...args: EventSpammerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _authorizedCallers: AddressLike[],
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_authorizedCallers, overrides || {});
  }
  override deploy(
    _authorizedCallers: AddressLike[],
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_authorizedCallers, overrides || {}) as Promise<
      EventSpammer & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): EventSpammer__factory {
    return super.connect(runner) as EventSpammer__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EventSpammerInterface {
    return new Interface(_abi) as EventSpammerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): EventSpammer {
    return new Contract(address, _abi, runner) as unknown as EventSpammer;
  }
}
