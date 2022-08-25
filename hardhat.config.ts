import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
    typechain: {
    outDir: "../../../types/ethers-v5",
  },
  paths: {
    root: "node_modules/@lukso/lsp-smart-contracts"
  }
};

export default config;
