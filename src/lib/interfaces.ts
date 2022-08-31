import { BigNumberish } from "ethers";

export interface DeployOptions {
  secret?: string;
  threshold?: BigNumberish;
  guardians?: string[];
}

export interface VoteToRecoverParams {
  recoverProcessId: string;
  address: string;
}
export interface RecoverOwnershipParams {
  recoverProcessId: string;
  secret: string;
  newSecret: string;
}

export type Network = {
  name: string;
  rpcUrl: string;
};
