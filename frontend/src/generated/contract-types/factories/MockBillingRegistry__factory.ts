/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
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
  "0x6080806040523461001657611664908161001c8239f35b600080fdfe6080604052600436101561001257600080fd5b6000803560e01c90816323cdb670146100aa5750806326392e70146100a55780633d18651e146100a057806358091e991461009b57806364d51a2a146100965780637341c10c14610091578063a21a23e41461008c578063a47c7696146100875763a9d03c051461008257600080fd5b6108e1565b61081a565b610641565b610533565b610517565b6101ef565b61019e565b610155565b34610114576040366003190112610114576101116004356100ca81610117565b67ffffffffffffffff602435916100e08361012e565b168352600260205260408320906bffffffffffffffffffffffff166bffffffffffffffffffffffff19825416179055565b80f35b80fd5b67ffffffffffffffff81160361012957565b600080fd5b6bffffffffffffffffffffffff81160361012957565b6001600160a01b0381160361012957565b34610129576020366003190112610129576001600160a01b0360043561017a81610144565b1673ffffffffffffffffffffffffffffffffffffffff196004541617600455600080f35b346101295760003660031901126101295760206040516702c68af0bb1400008152f35b9181601f840112156101295782359167ffffffffffffffff8311610129576020838186019501011161012957565b3461012957606036600319011261012957600480359067ffffffffffffffff6024358181116101295761022590369084016101c1565b936044358381116101295761023d90369086016101c1565b61025061024b949294610fac565b6114eb565b6040948551967f0ca7617500000000000000000000000000000000000000000000000000000000602089015261029f8861029185898d898b60248701611006565b03601f1981018a5289610ade565b6102bf6102b382546001600160a01b031690565b6001600160a01b031690565b978751987f4351077d000000000000000000000000000000000000000000000000000000008a526000998a81806102fd8b8883019190602083019252565b0381855afa9081156104f05761034e918c9182916104f5575b50518b51809381927f228764b20000000000000000000000000000000000000000000000000000000083528883019190602083019252565b0381855afa9a8b156104f057809b6104c1575b505060209161036f91611489565b9801906702c68af0bb1400006bffffffffffffffffffffffff6103cc6103ba6103a0865167ffffffffffffffff1690565b67ffffffffffffffff166000526002602052604060002090565b546bffffffffffffffffffffffff1690565b161061049a57508761049699937fe78a9d260916838466aae25ad88054a6ad04e8883bec99bea8212698cdc78fb4959361046b8461045d61041b6103a0610478985167ffffffffffffffff1690565b61043961043482546bffffffffffffffffffffffff1690565b6113f8565b6bffffffffffffffffffffffff166bffffffffffffffffffffffff19825416179055565b5167ffffffffffffffff1690565b169789519586958661141d565b0390a361048661024b611450565b5190151581529081906020820190565b0390f35b87517ff4d678b8000000000000000000000000000000000000000000000000000000008152fd5b61036f929b50602093916104e6913d8091833e6104de8183610ade565b8101906112aa565b9a91819350610361565b611149565b61051191503d8084833e6105098183610ade565b8101906110b2565b38610316565b3461012957600036600319011261012957602060405160648152f35b346101295760403660031901126101295760043561055081610117565b60243561055c81610144565b67ffffffffffffffff82169182600052600160205261059b61058a60406000206001600160a01b0390541690565b93843391610596610d3b565b6115bb565b6001600160a01b03831680156106175733036105bd576105bb9250610dd3565b005b610613836105d381336105ce610d9a565b61154d565b6040517fd8a3fb520000000000000000000000000000000000000000000000000000000081526001600160a01b0390911660048201529081906024820190565b0390fd5b60046040517f1f6a65b6000000000000000000000000000000000000000000000000000000008152fd5b3461012957600080600319360112610114576104969061076b6003549167ffffffffffffffff610672818516610b70565b16809367ffffffffffffffff19161760035561068c610c01565b610732610697610b8e565b8381528360208201526106be8667ffffffffffffffff166000526002602052604060002090565b815181546bffffffffffffffffffffffff19166bffffffffffffffffffffffff9190911617815590602001517fffffffffffffffff000000000000000000000000ffffffffffffffffffffffff77ffffffffffffffffffffffff00000000000000000000000083549260601b169116179055565b61073a610b9b565b33815291602083015260408201526107668367ffffffffffffffff166000526001602052604060002090565b610c2a565b60405133815281907f464722b4166576d3dcbba877b999bc35cf911f4eaf434b7eba68fa113951d0bf90602090a260405167ffffffffffffffff90911681529081906020820190565b906080926bffffffffffffffffffffffff60608401921683526001600160a01b03938493602094859316838201526060604082015286518094520194019160005b82811061080457505050505090565b83518516865294810194928101926001016107f5565b346101295760203660031901126101295760043561083781610117565b67ffffffffffffffff81168060005260016020526001600160a01b0360406000205416156106175760005260026020526bffffffffffffffffffffffff604060002054166104966108d560026108cf6108b46108a78767ffffffffffffffff166000526001602052604060002090565b546001600160a01b031690565b9567ffffffffffffffff166000526001602052604060002090565b01610b00565b604051938493846107b4565b346101295760a03660031901126101295767ffffffffffffffff600435818111610129576109139036906004016101c1565b50506080366023190112610129576001600160a01b036109516108a7610937610f78565b67ffffffffffffffff166000526001602052604060002090565b1615610617576109af6109a1610981610968610f87565b6001600160a01b03166000526000602052604060002090565b610989610f78565b67ffffffffffffffff16600052602052604060002090565b5467ffffffffffffffff1690565b90811615610a30576109c361049691610f93565b610a0f610a1d6109d1610f78565b926109db81610b70565b50604051928391602083019542908791939290604091606084019567ffffffffffffffff8093168552602085015216910152565b03601f198101835282610ade565b5190206040519081529081906020820190565b610a38610f78565b610a40610f87565b6040517ff0019fe600000000000000000000000000000000000000000000000000000000815267ffffffffffffffff9290921660048301526001600160a01b03166024820152604490fd5b634e487b7160e01b600052604160045260246000fd5b6040810190811067ffffffffffffffff821117610abd57604052565b610a8b565b6060810190811067ffffffffffffffff821117610abd57604052565b90601f8019910116810190811067ffffffffffffffff821117610abd57604052565b9060405191828154918282526020928383019160005283600020936000905b828210610b3757505050610b3592500383610ade565b565b85546001600160a01b031684526001958601958895509381019390910190610b1f565b634e487b7160e01b600052601160045260246000fd5b67ffffffffffffffff809116908114610b895760010190565b610b5a565b60405190610b3582610aa1565b60405190610b3582610ac2565b6040519060c0820182811067ffffffffffffffff821117610abd57604052565b604051906101e0820182811067ffffffffffffffff821117610abd57604052565b67ffffffffffffffff8111610abd5760051b60200190565b6040516020810181811067ffffffffffffffff821117610abd5760405260008152906000368137565b8151815473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b03918216178255909160406002602093848401511694610c93600196878301906001600160a01b031673ffffffffffffffffffffffffffffffffffffffff19825416179055565b019101519182519267ffffffffffffffff8411610abd57680100000000000000008411610abd57818354858555808610610d0e575b50610cda910192600052602060002090565b9060005b848110610ced57505050505050565b859082610d0186516001600160a01b031690565b9501948185015501610cde565b6000858152878784832093840193015b838110610d2d57505050610cc8565b828155869450899101610d1e565b60405190610d4882610ac2565b602c82527f672e73656e6465723a20257300000000000000000000000000000000000000006040837f6f776e6572206f6620737562736372697074696f6e2025643a2025732c206d7360208201520152565b60405190610da782610aa1565b601d82527f6d73672e73656e646572202573206973206e6f74206f776e65722025730000006020830152565b60646002610df58367ffffffffffffffff166000526001602052604060002090565b015414610f4e5767ffffffffffffffff80610e4083610e27866001600160a01b03166000526000602052604060002090565b9067ffffffffffffffff16600052602052604060002090565b5416610f4957610e6782610e27856001600160a01b03166000526000602052604060002090565b600167ffffffffffffffff198254161790556002610e998367ffffffffffffffff166000526001602052604060002090565b0191825468010000000000000000811015610abd5760018101808555811015610f33577f43dc749a04ac8fb825cbd514f7c0e13f13bc6f2ee66043b76629d51776cff8e0936000526020600020016001600160a01b03851673ffffffffffffffffffffffffffffffffffffffff19825416179055610f2e6040519283921694829190916001600160a01b036020820193169052565b0390a2565b634e487b7160e01b600052603260045260246000fd5b505050565b60046040517f05a48e0f000000000000000000000000000000000000000000000000000000008152fd5b602435610f8481610117565b90565b604435610f8481610144565b90600167ffffffffffffffff80931601918211610b8957565b60405190610fb982610aa1565b601182527f496e2066756c66696c6c416e6442696c6c0000000000000000000000000000006020830152565b908060209392818452848401376000828201840152601f01601f1916010190565b9391610f849593611024928652606060208701526060860191610fe5565b926040818503910152610fe5565b5190610b3582610144565b60005b8381106110505750506000910152565b8181015183820152602001611040565b81601f8201121561012957805167ffffffffffffffff8111610abd5760405192611094601f8301601f191660200185610ade565b8184526020828401011161012957610f84916020808501910161103d565b9060208282031261012957815167ffffffffffffffff9283821161012957019060c082820312610129576110e4610ba8565b92825184526110f560208401611032565b6020850152604083015160408501526060830151606085015260808301518181116101295782611126918501611060565b608085015260a0830151908111610129576111419201611060565b60a082015290565b6040513d6000823e3d90fd5b5190610b3582610117565b9080601f830112156101295781519061117882610be9565b926111866040519485610ade565b828452602092838086019160051b8301019280841161012957848301915b8483106111b45750505050505090565b825167ffffffffffffffff81116101295786916111d684848094890101611060565b8152019201916111a4565b5190600282101561012957565b5190600182101561012957565b91909160c08184031261012957611210610ba8565b9261121a826111e1565b8452611228602083016111e1565b6020850152611239604083016111ee565b6040850152606082015167ffffffffffffffff908181116101295782611260918501611060565b60608601526080830151818111610129578261127d918501611060565b608086015260a0830151908111610129576112989201611160565b60a0830152565b5190610b358261012e565b60208183031261012957805167ffffffffffffffff918282116101295701906101e082840312610129576112dc610bc8565b926112e683611032565b84526112f460208401611155565b602085015260408301518281116101295781611311918501611060565b60408501526060830151828111610129578161132e918501611060565b60608501526080830151828111610129578161134b918501611060565b608085015260a08301518281116101295781611368918501611160565b60a085015260c0830151918211610129576113849183016111fb565b60c083015260e081015160e08301526101006113a181830161129f565b908301526101206113b381830161129f565b908301526101406113c581830161129f565b90830152610160808201519083015261018080820151908301526101a080820151908301526101c0809101519082015290565b6bffffffffffffffffffffffff9081166702c68af0bb13ffff190191908211610b8957565b9361143a6040949261144894989798606088526060880191610fe5565b918583036020870152610fe5565b931515910152565b6040519061145d82610aa1565b601f82527f46696e69736865642063616c6c696e672066756c66696c6c416e6442696c6c006020830152565b5a91611388831061012957622dc6c08093611387199081810160061c900301111561012957813b156101295760009283809360208451940192f190565b906020916114df8151809281855285808601910161103d565b601f01601f1916010190565b610a0f611532610b35926040519283917f41304fac0000000000000000000000000000000000000000000000000000000060208401526020602484015260448301906114c6565b600080916020815191016a636f6e736f6c652e6c6f675afa50565b61153290610b3593611596936040519485937ffcec75e00000000000000000000000000000000000000000000000000000000060208601526060602486015260848501906114c6565b6001600160a01b0391821660448501529116606483015203601f198101835282610ade565b6115329161160493610b35956040519586947f5ea2b7ae0000000000000000000000000000000000000000000000000000000060208701526080602487015260a48601906114c6565b9260448501526001600160a01b03809216606485015216608483015203601f198101835282610ade56fea2646970667358221220cc6d128018e9d19adaf55888f86f3c5039cfa62f440dfe5f515f5745f0d36c6664736f6c63430008120033";

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
