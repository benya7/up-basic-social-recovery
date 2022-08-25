import { NonceManager } from '@ethersproject/experimental';
import { ExternalProvider, JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { BigNumberish, ContractReceipt, providers, Signer, Wallet } from 'ethers';

import { UniversalProfile } from '..';
import { UniversalProfile__factory } from '..';
import {
  LSP11BasicSocialRecovery,
  LSP11BasicSocialRecovery__factory,
  LSP6KeyManager,
  LSP6KeyManager__factory,
} from '..';

import { LSP6_INTERFACE_ID } from './constants';
import { getPermissionData, getReceipt, getStaticBsrInstance } from './helpers/basic-social-recovery.helper';
import { DeployBSROptions, RecoverOwnershipParams, VoteToRecoverParams } from './interfaces';

/**
 * Class for deploy and manage Basic Social Recovery Tool
 *
 * @property { string } targetRecovery
 * @property { JsonRpcProvider | Web3Provider } provider
 * @property { Signer} signer
 */
export class BasicSocialRecovery {
  public targetRecovery: string;
  public provider: JsonRpcProvider | Web3Provider;
  public signer: Signer;

  constructor(targetRecovery: string, rpcUrlOrProvider: string | Web3Provider, privateKeyOrSigner?: string | Signer) {
    if (typeof rpcUrlOrProvider === 'string') {
      this.provider = new providers.JsonRpcProvider(rpcUrlOrProvider);
    } else {
      this.provider = rpcUrlOrProvider;
    }

    if (privateKeyOrSigner instanceof Signer) {
      this.signer = privateKeyOrSigner;
    } else if (typeof privateKeyOrSigner === 'string') {
      this.signer = new Wallet(privateKeyOrSigner, this.provider);
    } else {
      this.signer = this.provider.getSigner();
    }

    this.signer = new NonceManager(this.signer);
    this.targetRecovery = targetRecovery;
  }

  private async _grantPermissionsTo(to: string): Promise<ContractReceipt> {
    const keyManager = await this.getKMInstance();
    const permissionData = await getPermissionData(this.targetRecovery, this.provider.connection.url, to);
    const payload = this.getUPInstance().interface.encodeFunctionData('setData(bytes32[],bytes[])', [
      permissionData.keys,
      permissionData.values,
    ]);
    const tx = await keyManager.execute(payload);
    return await getReceipt(tx);
  }

  private async _executePayload(bsrAddress: string, bsrPayload: string): Promise<ContractReceipt> {
    const keyManager = await this.getKMInstance();
    const payload = this.getUPInstance().interface.encodeFunctionData('execute', [0, bsrAddress, 0, bsrPayload]);
    const tx = await keyManager.execute(payload);
    return await getReceipt(tx);
  }

  public getUPInstance(): UniversalProfile {
    return UniversalProfile__factory.connect(this.targetRecovery, this.provider);
  }

  public async getKMInstance(): Promise<LSP6KeyManager> {
    const ownerAddress = await this.getUPInstance().owner();
    const keyManager = new LSP6KeyManager__factory(this.signer).attach(ownerAddress);
    const isKeyManager = keyManager.supportsInterface(LSP6_INTERFACE_ID);
    if (!isKeyManager) throw new Error('Universal Profile owner is not a Key Manager');
    return keyManager;
  }

  public async getBSRInstance(): Promise<LSP11BasicSocialRecovery> {
    const up = this.getUPInstance();
    const bsrAddress = await up['getData(bytes32)'](
      '0x372626dc510c09a8871d6c9731204d9d418b49e4da4d1945e745e3cbad9fed81',
    );
    if (!bsrAddress) throw new Error('Basic Social Recovery not deployed');

    return LSP11BasicSocialRecovery__factory.connect(bsrAddress, this.provider);
  }

  public async deployBSR(options: DeployBSROptions): Promise<string> {
    const bsrFactory = new LSP11BasicSocialRecovery__factory(this.signer);
    const bsrDeployed = await bsrFactory.deploy(this.targetRecovery);
    await this._grantPermissionsTo(bsrDeployed.address);

    if (options.guardians) {
      for (const guardian of options.guardians) {
        await this.addGuardian(guardian);
      }
    }

    if (options.secret) {
      await this.setSecret(options.secret);
    }

    if (options.guardiansThreshold) {
      await this.setThreshold(options.guardiansThreshold);
    }

    return bsrDeployed.address;
  }

  public async addGuardian(newGuardian: string): Promise<ContractReceipt> {
    const basicSocialRecovery = await this.getBSRInstance();
    const bsrPayload = basicSocialRecovery.interface.encodeFunctionData('addGuardian', [newGuardian]);

    return await this._executePayload(basicSocialRecovery.address, bsrPayload);
  }

  public async removeGuardian(guardian: string): Promise<ContractReceipt> {
    const basicSocialRecovery = await this.getBSRInstance();
    const bsrPayload = basicSocialRecovery.interface.encodeFunctionData('removeGuardian', [guardian]);

    return await this._executePayload(basicSocialRecovery.address, bsrPayload);
  }

  public async setThreshold(guardianThreshold: BigNumberish): Promise<ContractReceipt> {
    const basicSocialRecovery = await this.getBSRInstance();
    const bsrPayload = basicSocialRecovery.interface.encodeFunctionData('setThreshold', [guardianThreshold]);
    return await this._executePayload(basicSocialRecovery.address, bsrPayload);
  }

  public async setSecret(secret: string): Promise<ContractReceipt> {
    const basicSocialRecovery = await this.getBSRInstance();
    const bsrPayload = basicSocialRecovery.interface.encodeFunctionData('setSecret', [secret]);
    return await this._executePayload(basicSocialRecovery.address, bsrPayload);
  }

  static async voteToRecover(
    upAddress: string,
    providerOrSigner: ExternalProvider | Signer,
    params: VoteToRecoverParams,
  ): Promise<ContractReceipt> {
    const basicSocialRecovery = await getStaticBsrInstance(upAddress, providerOrSigner);

    const tx = await basicSocialRecovery.voteToRecover(params.recoverProcessId, params.address);
    return await getReceipt(tx);
  }

  static async recoverOwnership(
    upAddress: string,
    providerOrSigner: ExternalProvider | Signer,
    params: RecoverOwnershipParams,
  ): Promise<ContractReceipt> {
    const basicSocialRecovery = await getStaticBsrInstance(upAddress, providerOrSigner);

    const tx = await basicSocialRecovery.recoverOwnership(params.recoverProcessId, params.secret, params.newSecret);
    return await getReceipt(tx);
  }
}
