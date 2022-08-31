import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";

import { networks } from "./../constants";

export const getRpcUrl = async (provider: JsonRpcProvider | Web3Provider) => {
  const network = await provider.getNetwork();
  return networks[network.chainId].rpcUrl;
};
