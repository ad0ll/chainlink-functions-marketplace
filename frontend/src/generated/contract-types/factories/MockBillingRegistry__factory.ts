/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../common";
import type {
  MockBillingRegistry,
  MockBillingRegistryInterface,
} from "../MockBillingRegistry";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "internalBalance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "externalBalance",
        type: "uint256",
      },
    ],
    name: "BalanceInvariantViolated",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidCalldata",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "subscriptionId",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "consumer",
        type: "address",
      },
    ],
    name: "InvalidConsumer",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSubscription",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "proposedOwner",
        type: "address",
      },
    ],
    name: "MustBeRequestedOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "MustBeSubOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyCallableFromLink",
    type: "error",
  },
  {
    inputs: [],
    name: "PendingRequestExists",
    type: "error",
  },
  {
    inputs: [],
    name: "TooManyConsumers",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint64",
        name: "subscriptionId",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "res",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "err",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    name: "FulfillAndBillLog",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "subscriptionId",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "SubscriptionCanceled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "subscriptionId",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "consumer",
        type: "address",
      },
    ],
    name: "SubscriptionConsumerAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "subscriptionId",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "consumer",
        type: "address",
      },
    ],
    name: "SubscriptionConsumerRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "subscriptionId",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "SubscriptionCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "subscriptionId",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "oldBalance",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newBalance",
        type: "uint256",
      },
    ],
    name: "SubscriptionFunded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "subscriptionId",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "SubscriptionOwnerTransferRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "subscriptionId",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "SubscriptionOwnerTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "BASE_FEE",
    outputs: [
      {
        internalType: "uint96",
        name: "",
        type: "uint96",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_CONSUMERS",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "subscriptionId",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "consumer",
        type: "address",
      },
    ],
    name: "addConsumer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "createSubscription",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "subscriptionId",
        type: "uint64",
      },
      {
        internalType: "uint96",
        name: "balance",
        type: "uint96",
      },
    ],
    name: "forceBalance",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "fulfillAndBill",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        components: [
          {
            internalType: "uint64",
            name: "subscriptionId",
            type: "uint64",
          },
          {
            internalType: "address",
            name: "client",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "gasLimit",
            type: "uint32",
          },
          {
            internalType: "uint256",
            name: "gasPrice",
            type: "uint256",
          },
        ],
        internalType: "struct FunctionsBillingRegistryInterface.RequestBilling",
        name: "billing",
        type: "tuple",
      },
    ],
    name: "getRequiredFee",
    outputs: [
      {
        internalType: "uint96",
        name: "",
        type: "uint96",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "subscriptionId",
        type: "uint64",
      },
    ],
    name: "getSubscription",
    outputs: [
      {
        internalType: "uint96",
        name: "balance",
        type: "uint96",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "consumers",
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
        name: "_functionsManager",
        type: "address",
      },
    ],
    name: "setFunctionsManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        components: [
          {
            internalType: "uint64",
            name: "subscriptionId",
            type: "uint64",
          },
          {
            internalType: "address",
            name: "client",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "gasLimit",
            type: "uint32",
          },
          {
            internalType: "uint256",
            name: "gasPrice",
            type: "uint256",
          },
        ],
        internalType: "struct FunctionsBillingRegistryInterface.RequestBilling",
        name: "billing",
        type: "tuple",
      },
    ],
    name: "startBilling",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60808060405234610016576113f8908161001c8239f35b600080fdfe6080604052600436101561001257600080fd5b6000803560e01c90816323cdb670146100ba5750806326392e70146100b55780633d18651e146100b057806358091e99146100ab57806364d51a2a146100a65780637341c10c146100a1578063a21a23e41461009c578063a47c769614610097578063a9d03c05146100925763f1e14a211461008d57600080fd5b6109bd565b610846565b610744565b610575565b610498565b61047c565b6101e3565b610192565b610156565b3461011a57604036600319011261011a576101176004356100da8161011d565b67ffffffffffffffff602435916100f083610134565b168352600260205260408320906001600160601b03166001600160601b0319825416179055565b80f35b80fd5b67ffffffffffffffff81160361012f57565b600080fd5b6001600160601b0381160361012f57565b6001600160a01b0381160361012f57565b3461012f57602036600319011261012f576001600160a01b0360043561017b81610145565b166001600160a01b03196004541617600455600080f35b3461012f57600036600319011261012f5760206040516702c68af0bb1400008152f35b9181601f8401121561012f5782359167ffffffffffffffff831161012f576020838186019501011161012f57565b3461012f57606036600319011261012f5767ffffffffffffffff6004803560243583811161012f5761021890369084016101b5565b9160443585811161012f5761023090369086016101b5565b61024361023e959295610ebe565b6112ca565b604094855192630ca7617560e01b60208501526102798461026b8585858b8b60248701610f18565b03601f198101865285610a33565b61029961028d89546001600160a01b031690565b6001600160a01b031690565b8751634351077d60e01b8152808a01878152919591600090829081906020010381895afa9081156104565760009161045b575b50518851631f08a99b60e31b81528a8101918252610120929183908290819060200103818a5afa928315610456576103249361031e92602092600092610429575b5050015167ffffffffffffffff1690565b95611268565b976702c68af0bb1400006001600160601b036103646103578867ffffffffffffffff166000526002602052604060002090565b546001600160601b031690565b161061041b575087610417999385936103f9936103ec6103b97fe78a9d260916838466aae25ad88054a6ad04e8883bec99bea8212698cdc78fb49967ffffffffffffffff166000526002602052604060002090565b6103d26103cd82546001600160601b031690565b6111dc565b6001600160601b03166001600160601b0319825416179055565b8a519687961699866111fc565b0390a361040761023e61122f565b5190151581529081906020820190565b0390f35b8751631e9acf1760e31b8152fd5b6104489250803d1061044f575b6104408183610a33565b810190611130565b388061030d565b503d610436565b61110e565b610476913d8091833e61046e8183610a33565b810190611064565b386102cc565b3461012f57600036600319011261012f57602060405160648152f35b3461012f57604036600319011261012f576004356104b58161011d565b6024356104c181610145565b67ffffffffffffffff8216918260005260016020526105006104ef60406000206001600160a01b0390541690565b938433916104fb610c76565b611368565b6001600160a01b0383168015610563573303610522576105209250610d0e565b005b61055f836105388133610533610cd5565b611313565b604051636c51fda960e11b81526001600160a01b0390911660048201529081906024820190565b0390fd5b604051630fb532db60e11b8152600490fd5b3461012f5760008060031936011261011a576104179061069a6003549167ffffffffffffffff6105a6818516610ac5565b16809367ffffffffffffffff1916176003556105c0610b56565b6106616105cb610ae3565b8381528360208201526105f28667ffffffffffffffff166000526002602052604060002090565b815181546bffffffffffffffffffffffff19166001600160601b039190911617815590602001517fffffffffffffffff000000000000000000000000ffffffffffffffffffffffff77ffffffffffffffffffffffff00000000000000000000000083549260601b169116179055565b610669610af0565b33815291602083015260408201526106958367ffffffffffffffff166000526001602052604060002090565b610b7f565b60405133815281907f464722b4166576d3dcbba877b999bc35cf911f4eaf434b7eba68fa113951d0bf90602090a260405167ffffffffffffffff90911681529081906020820190565b906080926001600160601b0360608401921683526001600160a01b03938493602094859316838201526060604082015286518094520194019160005b82811061072e57505050505090565b835185168652948101949281019260010161071f565b3461012f57602036600319011261012f576004356107618161011d565b67ffffffffffffffff81168060005260016020526001600160a01b0360406000205416156105635760005260026020526001600160601b03604060002054166104176107fa60026107f46107d96107cc8767ffffffffffffffff166000526001602052604060002090565b546001600160a01b031690565b9567ffffffffffffffff166000526001602052604060002090565b01610a55565b604051938493846106e3565b60a060031982011261012f576004359167ffffffffffffffff831161012f57610834826080946004016101b5565b90939092602319011261012f57602490565b3461012f5761085436610806565b9150506001600160a01b036108886107cc61086e84610e8e565b67ffffffffffffffff166000526001602052604060002090565b16156105635760208101906108ed6108df6108be6108a585610e9b565b6001600160a01b03166000526000602052604060002090565b6108c784610e8e565b67ffffffffffffffff16600052602052604060002090565b5467ffffffffffffffff1690565b9167ffffffffffffffff831615610979575061095861096661091a61091461041795610ea5565b93610e8e565b9261092481610ac5565b50604051928391602083019542908791939290604091606084019567ffffffffffffffff8093168552602085015216910152565b03601f198101835282610a33565b5190206040519081529081906020820190565b61098b61098583610e8e565b91610e9b565b604051637800cff360e11b815267ffffffffffffffff9290921660048301526001600160a01b03166024820152604490fd5b3461012f576109cb36610806565b50505060206040516702c68af0bb1400008152f35b634e487b7160e01b600052604160045260246000fd5b6040810190811067ffffffffffffffff821117610a1257604052565b6109e0565b6060810190811067ffffffffffffffff821117610a1257604052565b90601f8019910116810190811067ffffffffffffffff821117610a1257604052565b9060405191828154918282526020928383019160005283600020936000905b828210610a8c57505050610a8a92500383610a33565b565b85546001600160a01b031684526001958601958895509381019390910190610a74565b634e487b7160e01b600052601160045260246000fd5b67ffffffffffffffff809116908114610ade5760010190565b610aaf565b60405190610a8a826109f6565b60405190610a8a82610a17565b6040519060c0820182811067ffffffffffffffff821117610a1257604052565b60405190610120820182811067ffffffffffffffff821117610a1257604052565b67ffffffffffffffff8111610a125760051b60200190565b6040516020810181811067ffffffffffffffff821117610a125760405260008152906000368137565b815181546001600160a01b0319166001600160a01b03918216178255909160406002602093848401511694610bce600196878301906001600160a01b03166001600160a01b0319825416179055565b019101519182519267ffffffffffffffff8411610a1257680100000000000000008411610a1257818354858555808610610c49575b50610c15910192600052602060002090565b9060005b848110610c2857505050505050565b859082610c3c86516001600160a01b031690565b9501948185015501610c19565b6000858152878784832093840193015b838110610c6857505050610c03565b828155869450899101610c59565b60405190610c8382610a17565b602c82527f672e73656e6465723a20257300000000000000000000000000000000000000006040837f6f776e6572206f6620737562736372697074696f6e2025643a2025732c206d7360208201520152565b60405190610ce2826109f6565b601d82527f6d73672e73656e646572202573206973206e6f74206f776e65722025730000006020830152565b60646002610d308367ffffffffffffffff166000526001602052604060002090565b015414610e7c5767ffffffffffffffff80610d7b83610d62866001600160a01b03166000526000602052604060002090565b9067ffffffffffffffff16600052602052604060002090565b5416610e7757610da282610d62856001600160a01b03166000526000602052604060002090565b600167ffffffffffffffff198254161790556002610dd48367ffffffffffffffff166000526001602052604060002090565b0191825468010000000000000000811015610a125760018101808555811015610e61577f43dc749a04ac8fb825cbd514f7c0e13f13bc6f2ee66043b76629d51776cff8e0936000526020600020016001600160a01b0385166001600160a01b0319825416179055610e5c6040519283921694829190916001600160a01b036020820193169052565b0390a2565b634e487b7160e01b600052603260045260246000fd5b505050565b6040516305a48e0f60e01b8152600490fd5b35610e988161011d565b90565b35610e9881610145565b90600167ffffffffffffffff80931601918211610ade57565b60405190610ecb826109f6565b601182527f496e2066756c66696c6c416e6442696c6c0000000000000000000000000000006020830152565b908060209392818452848401376000828201840152601f01601f1916010190565b9391610e989593610f36928652606060208701526060860191610ef7565b926040818503910152610ef7565b5190610a8a82610145565b60005b838110610f625750506000910152565b8181015183820152602001610f52565b9092919267ffffffffffffffff8111610a125760405191610f9d601f8301601f191660200184610a33565b82948284528282011161012f576020610a8a930190610f4f565b81601f8201121561012f57805190610fce82610b3e565b92604092610fde84519586610a33565b808552602093848087019260051b8501019383851161012f57858101925b85841061100d575050505050505090565b835167ffffffffffffffff811161012f57820185603f8201121561012f57879161103f87838786809601519101610f72565b815201930192610ffc565b9080601f8301121561012f578151610e9892602001610f72565b9060208282031261012f57815167ffffffffffffffff9283821161012f57019060c08282031261012f57611096610afd565b92825184526110a760208401610f44565b602085015260408301516040850152606083015181811161012f57826110ce918501610fb7565b6060850152608083015181811161012f57826110eb91850161104a565b608085015260a083015190811161012f57611106920161104a565b60a082015290565b6040513d6000823e3d90fd5b5190610a8a8261011d565b5190610a8a82610134565b908161012091031261012f57611144610b1d565b9061114e81610f44565b825261115c6020820161111a565b602083015261116d60408201611125565b604083015261117e60608201611125565b606083015261118f6080820161111a565b60808301526111a060a08201611125565b60a08301526111b160c08201611125565b60c08301526111c260e0820161111a565b60e08301526111d561010080920161111a565b9082015290565b6001600160601b039081166702c68af0bb13ffff190191908211610ade57565b936112196040949261122794989798606088526060880191610ef7565b918583036020870152610ef7565b931515910152565b6040519061123c826109f6565b601f82527f46696e69736865642063616c6c696e672066756c66696c6c416e6442696c6c006020830152565b5a91611388831061012f57622dc6c08093611387199081810160061c900301111561012f57813b1561012f5760009283809360208451940192f190565b906020916112be81518092818552858086019101610f4f565b601f01601f1916010190565b6109586112f8610a8a9260405192839163104c13eb60e21b60208401526020602484015260448301906112a5565b600080916020815191016a636f6e736f6c652e6c6f675afa50565b6112f890610a8a93611343936040519485936307e763af60e51b60208601526060602486015260848501906112a5565b6001600160a01b0391821660448501529116606483015203601f198101835282610a33565b6112f89161139893610a8a95604051958694632f515bd760e11b60208701526080602487015260a48601906112a5565b9260448501526001600160a01b03809216606485015216608483015203601f198101835282610a3356fea2646970667358221220a12f48cc8d4f15c69d575ee2f2eae6d8b69a633542c8e657aaa1fb484a3a5b1064736f6c63430008120033";

type MockBillingRegistryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockBillingRegistryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockBillingRegistry__factory extends ContractFactory {
  constructor(...args: MockBillingRegistryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      MockBillingRegistry & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): MockBillingRegistry__factory {
    return super.connect(runner) as MockBillingRegistry__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockBillingRegistryInterface {
    return new Interface(_abi) as MockBillingRegistryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): MockBillingRegistry {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as MockBillingRegistry;
  }
}
