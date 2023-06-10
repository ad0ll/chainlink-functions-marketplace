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
  WebappSnippet2,
  WebappSnippet2Interface,
} from "../WebappSnippet2";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "sendRequest",
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
  "0x608080604052346101095773326c977e6efc84e512bb9c30f76e30c160ed06fb9060208160448160018060a01b03196000968181899384541617835573ac427515a3897e1321f4d50e15e267c4b7120e008091600154161760015563095ea7b360e01b845260048401526b033b2e3c9fd0803ce800000060248401525af180156100fe57610097575b60405161057b908161010f8239f35b60203d81116100f7575b601f8101601f191682016001600160401b038111838210176100e3576020918391604052810103126100df5751801515036100dc5780610088565b80fd5b5080fd5b634e487b7160e01b84526041600452602484fd5b503d6100a1565b6040513d84823e3d90fd5b600080fdfe608060408181526004908136101561001657600080fd5b600091823560e01c631bee2f2a1461002d57600080fd5b346104ba57826003193601126104ba5773ffffffffffffffffffffffffffffffffffffffff908184541691636eb1769f60e11b8652338287015260249230848801526020968781604481855afa9081156104b057879161047f575b50670429d069189e00008091106103f15785516370a0823160e01b8152338582015288818781865afa9081156103e75790829189916103b2575b501061034a57869160648992885194859384926323b872dd60e01b8452338a850152308b85015260448401525af1801561034057610305575b50835190606080830183811067ffffffffffffffff8211176102f3579288948892889795885260028352835b8881106102dd575050865161013b816104be565b600881527f657468657265756d0000000000000000000000000000000000000000000000008782015261016d83610512565b5261017782610512565b508651610183816104be565b60038152621d5cd960ea1b8782015261019b83610535565b526101a582610535565b5060019384541693875197889663f831284160e01b88527f4384ec9b548391dcd7fc8a9fdcaa6b1a196aca144fc9b515500aac41964f02ea6044890194890152870152825180925260648601918760648260051b89010194019285905b82821061026c5750505050509083809203925af192831561026157809361022c575b505051908152f35b909192508382813d831161025a575b61024581836104f0565b81010312610257575051903880610224565b80fd5b503d61023b565b8251903d90823e3d90fd5b93975093919597509350606319888203018252848b87518c815191828652815b8381106102be575050938183949584809484010152601f801991011601019701920192019389938b9795899794610202565b8493955080925081949101015182828701015201918c8e92899461028c565b83810188018290528998508b978b955001610127565b634e487b7160e01b8852604185528588fd5b8681813d8311610339575b61031a81836104f0565b8101031261033557518015150361033157386100fb565b8480fd5b8580fd5b503d610310565b85513d88823e3d90fd5b855162461bcd60e51b81528085018990526028818701527f28536e697070657429205573657220646f6573206e6f74206861766520656e6f60448201527f756768204c494e4b0000000000000000000000000000000000000000000000006064820152608490fd5b8092508a8092503d83116103e0575b6103cb81836104f0565b810103126103dc57819051386100c2565b8780fd5b503d6103c1565b87513d8a823e3d90fd5b855162461bcd60e51b81528085018990526047818701527f28536e6970706574292055736572206973206e6f7420617070726f766564207460448201527f6f207472616e73666572204c494e4b20746f207468652046756e6374696f6e7360648201527f4d616e6167657200000000000000000000000000000000000000000000000000608482015260a490fd5b90508781813d83116104a9575b61049681836104f0565b810103126104a5575138610088565b8680fd5b503d61048c565b86513d89823e3d90fd5b8280fd5b6040810190811067ffffffffffffffff8211176104da57604052565b634e487b7160e01b600052604160045260246000fd5b90601f8019910116810190811067ffffffffffffffff8211176104da57604052565b80511561051f5760200190565b634e487b7160e01b600052603260045260246000fd5b80516001101561051f576040019056fea26469706673582212203be93dd720fc7eff9eddc5b35afde0602c91b460b4487d55193c5f3e489d90f864736f6c63430008120033";

type WebappSnippet2ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: WebappSnippet2ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class WebappSnippet2__factory extends ContractFactory {
  constructor(...args: WebappSnippet2ConstructorParams) {
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
      WebappSnippet2 & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): WebappSnippet2__factory {
    return super.connect(runner) as WebappSnippet2__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): WebappSnippet2Interface {
    return new Interface(_abi) as WebappSnippet2Interface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): WebappSnippet2 {
    return new Contract(address, _abi, runner) as unknown as WebappSnippet2;
  }
}
