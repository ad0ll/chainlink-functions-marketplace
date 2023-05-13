import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import "hardhat-watcher";

dotenv.config();

const DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS = 2;
const SHARED_DON_PUBLIC_KEY =
  "a30264e813edc9927f73e036b7885ee25445b836979cb00ef112bc644bd16de2db866fa74648438b34f52bb196ffa386992e94e0a3dc6913cee52e2e98f1619c";

const PRIVATE_KEYS = process.env.PRIVATE_KEYS;

const networks = {
  hardhat: {
    allowUnlimitedContractSize: true,
  },
  localhost: {
    allowUnlimitedContractSize: true,
  },
  ethereumSepolia: {
    url: process.env.ETHEREUM_SEPOLIA_RPC_URL || "UNSET",
    accounts: PRIVATE_KEYS !== undefined ? PRIVATE_KEYS.split(",") : [],
    verifyApiKey: process.env.ETHERSCAN_API_KEY || "UNSET",
    chainId: 11155111,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    linkPriceFeed: "0x42585eD362B3f1BCa95c640FdFf35Ef899212734",
    functionsOracleProxy: "0x649a2C205BE7A3d5e99206CEEFF30c794f0E31EC",
    functionsBillingRegistryProxy: "0x3c79f56407DCB9dc9b852D139a317246f43750Cc",
    functionsPublicKey: SHARED_DON_PUBLIC_KEY,
  },
  polygonMumbai: {
    url: process.env.POLYGON_MUMBAI_RPC_URL || "UNSET",
    accounts: PRIVATE_KEYS !== undefined ? PRIVATE_KEYS.split(",") : [],
    verifyApiKey: process.env.POLYGONSCAN_API_KEY || "UNSET",
    chainId: 80001,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    linkPriceFeed: "0x12162c3E810393dEC01362aBf156D7ecf6159528", // LINK/MATIC
    functionsOracleProxy: "0xeA6721aC65BCeD841B8ec3fc5fEdeA6141a0aDE4",
    functionsBillingRegistryProxy: "0xEe9Bf52E5Ea228404bB54BCFbbDa8c21131b9039",
    functionsPublicKey: SHARED_DON_PUBLIC_KEY,
  },
  avalancheFuji: {
    url: process.env.AVALANCHE_FUJI_RPC_URL || "UNSET",
    accounts: PRIVATE_KEYS !== undefined ? PRIVATE_KEYS.split(",") : [],
    verifyApiKey: process.env.SNOWTRACE_API_KEY || "UNSET",
    chainId: 43113,
    confirmations: 2 * DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    linkToken: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
    linkPriceFeed: "0x79c91fd4F8b3DaBEe17d286EB11cEE4D83521775", // LINK/AVAX
    functionsOracleProxy: "0xE569061eD8244643169e81293b0aA0d3335fD563",
    functionsBillingRegistryProxy: "0x452C33Cef9Bc773267Ac5F8D85c1Aca2bA4bcf0C",
    functionsPublicKey: SHARED_DON_PUBLIC_KEY,
  },
};

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.4.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1_000,
          },
        },
      },
      {
        version: "0.4.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1_000,
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1_000,
          },
        },
      },
      {
        version: "0.8.#",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1_000,
          },
        },
      },
      {
        version: "0.8.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1_000,
          },
        },
      },
    ],
  },
  networks,
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  watcher: {
    compile: {
      tasks: ["compile"],
      files: ["./contracts"],
      ignoredFiles: ["**/.vscode"],
      verbose: true,
      clearOnStart: true,
      start: "echo Running my compilation task now..",
    },
    test: {
      tasks: ["test"],
      files: ["./contracts", "./test"],
      ignoredFiles: ["**/.vscode"],
      verbose: true,
      clearOnStart: true,
      start: "echo Running my test task now...",
    },
    ci: {
      tasks: [
        "clean",
        { command: "compile", params: { quiet: true } },
        {
          command: "test",
          params: { noCompile: true, testFiles: ["testfile.ts"] },
        },
      ],
    },
  },
  // paths: {
  //   sources: "./contracts",
  //   tests: "./test",
  // },
};

export default config;
