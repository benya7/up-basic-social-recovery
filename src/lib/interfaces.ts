import { BigNumberish } from 'ethers';

export interface DeployBSROptions {
  secret?: string;
  guardiansThreshold?: BigNumberish;
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
