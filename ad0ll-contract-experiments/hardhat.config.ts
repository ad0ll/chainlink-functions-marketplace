import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-watcher";

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
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    localhost: {
      allowUnlimitedContractSize: true,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  // paths: {
  //   sources: "./contracts",
  //   tests: "./test",
  //   cache: "./build/cache",
  //   artifacts: "./build/artifacts",
  // },
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
};

export default config;
