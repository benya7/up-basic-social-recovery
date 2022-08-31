import { NonceManager } from "@ethersproject/experimental";
import {
  JsonRpcProvider,
  Provider,
  Web3Provider,
} from "@ethersproject/providers";
import {
  BigNumberish,
  ContractReceipt,
  providers,
  Signer,
  Wallet,
} from "ethers";

import { UniversalProfile } from "..";
import { UniversalProfile__factory } from "..";
import {
  LSP11BasicSocialRecovery,
  LSP11BasicSocialRecovery__factory,
  LSP6KeyManager,
  LSP6KeyManager__factory,
} from "..";

import {
  addressIsUniversalProfile,
  callerIsAllowed,
  encodeExecutePayload,
  encodePermissionsData,
  encodeSetDataPayload,
  getBSRContractAddress,
  getReceipt,
  ownerIsKeyManager,
} from "./helpers/basic-social-recovery.helper";
import { getRpcUrl } from "./helpers/config.helper";
import {
  DeployOptions,
  RecoverOwnershipParams,
  VoteToRecoverParams,
} from "./interfaces";

/**
 * Class for deploy and manage a social recovery tool for Lukso Universal Profile
 *
 * @property { string } targetRecovery
 * @property { JsonRpcProvider | Web3Provider } provider
 * @property { Signer} signer
 */
export class BasicSocialRecovery {
  public targetRecovery: string;
  public provider: JsonRpcProvider | Web3Provider;
  public signer: Signer;
  /**
   *
   * @param { string } targetRecovery
   * @param { string | providers.Web3Provider | providers.JsonRpcProvider } rpcUrlOrProvider
   * @param { string | Signer } [privateKeyOrSigner]
   *
   * @example
   * ```javascript
   * const provider = new JsonRpcProvider(RPC_URL);
   * const signer = new Signer(PRIVATE_KEY, RPC_URL);
   * const basicSocialRecovery = new BasicSocialRecovery(UP_ADDRESS, provider, signer);
   *
   * // From the browser
   * const provider = new Web3Provider(window.ethereum);
   * const basicSocialRecovery = new BasicSocialRecovery(UP_ADDRESS, provider);
   * ```
   */
  constructor(
    targetRecovery: string,
    rpcUrlOrProvider:
      | string
      | providers.Web3Provider
      | providers.JsonRpcProvider,
    privateKeyOrSigner?: string | Signer
  ) {
    if (typeof rpcUrlOrProvider === "string") {
      this.provider = new JsonRpcProvider(rpcUrlOrProvider);
    } else if ("chainId" in rpcUrlOrProvider) {
      this.provider = new Web3Provider(rpcUrlOrProvider);
    } else {
      this.provider = rpcUrlOrProvider as
        | providers.Web3Provider
        | providers.JsonRpcProvider;
    }

    if (privateKeyOrSigner instanceof Signer) {
      this.signer = privateKeyOrSigner;
    } else if (typeof privateKeyOrSigner === "string") {
      this.signer = new Wallet(privateKeyOrSigner, this.provider);
    } else {
      this.signer = this.provider.getSigner();
    }
    this.targetRecovery = targetRecovery;
    this.signer = new NonceManager(this.signer);
  }
  /**
   * Returns a read-only instance of the Universal Profile contract
   * @returns {Promise<UniversalProfile>}
   * @memberOf BasicSocialRecovery
   */
  public async getUPInstance(): Promise<UniversalProfile> {
    try {
      await addressIsUniversalProfile(this.targetRecovery, this.provider);
    } catch (error) {
      throw new Error("Address is not an Universal Profile");
    }
    return UniversalProfile__factory.connect(
      this.targetRecovery,
      this.provider
    );
  }
  /**
   * @private
   */

  private async _getKMInstance(): Promise<LSP6KeyManager> {
    const universalProfile = await this.getUPInstance();
    const owner = await universalProfile.owner();
    const isOwnerKeyManager = await ownerIsKeyManager(owner, this.provider);
    if (!isOwnerKeyManager) throw new Error("Owner is not a Key Manager");

    return new LSP6KeyManager__factory(this.signer).attach(owner);
  }
  /**
   *
   * @private
   */
  private async _grantPermissionsTo(to: string): Promise<ContractReceipt> {
    const rpcUrl = await getRpcUrl(this.provider);
    const encodedData = await encodePermissionsData(
      this.targetRecovery,
      rpcUrl,
      to
    );
    return await this._setDataKeyManager(encodedData.keys, encodedData.values);
  }
  /**
   * @private
   */
  private async _setDataKeyManager(
    keys: string[],
    values: string[]
  ): Promise<ContractReceipt> {
    const payload = encodeSetDataPayload([keys, values]);
    return await this._executeKeyManager(payload);
  }
  /**
   * @private
   */
  private async _executeKeyManager(payload: string): Promise<ContractReceipt> {
    const keyManager = await this._getKMInstance();
    const rpcUrl = await getRpcUrl(this.provider);
    const caller = await this.signer.getAddress();
    const isCallerAllowed = await callerIsAllowed(
      this.targetRecovery,
      caller,
      rpcUrl
    );
    if (!isCallerAllowed) throw new Error("Caller is not allowed");
    const tx = await keyManager.execute(payload);
    return await getReceipt(tx);
  }
  /**
   * Returns an instance of the LPS11BasicSocialRecovery contract, linked to the address of the implemented contract stored in the Universal Profile keys.
   * @param {Provider | Signer} signerOrProvider
   * @returns {Promise<LSP11BasicSocialRecovery>}
   */
  public async getBSRInstance(
    signerOrProvider: Provider | Signer
  ): Promise<LSP11BasicSocialRecovery> {
    try {
      await addressIsUniversalProfile(this.targetRecovery, this.provider);
    } catch (error) {
      throw new Error("Address is not an Universal Profile");
    }
    const rpcUrl = await getRpcUrl(this.provider);
    const bsrAddress = await getBSRContractAddress(this.targetRecovery, rpcUrl);
    if (!bsrAddress) throw new Error("Basic Social Recovery not deployed");
    return LSP11BasicSocialRecovery__factory.connect(
      bsrAddress,
      signerOrProvider
    );
  }
  /**
   * Deploying a new contract LSP11BasicSocial Recovery returns the address of the contract.
   * @param {DeployOptions} options
   * @param {(currentStep: string, onError?: string) => void} [callback]
   * @returns {Promise<string>} Address of deployed contract
   *
   *@example
   *```javascript
   * const secret = ethers.utils.toKeccak256(ethers.utils.toUtf8Bytes("mysecret"));
   *
   * // Threshold can't be less than guardians array length
   * const threshold = 1;
   * const guardians = [GUARDIAN_ADDRESS1, GUARDIAN_GUARDIAN2];
   * await basicSocialRecovery.deploy({
   *  secret,
   *  threshold,
   *  guardians
   * })
   *
   * ```
   */
  public async deploy(
    options: DeployOptions,
    callback?: (currentStep: string, onError?: string) => void
  ): Promise<string> {
    try {
      await addressIsUniversalProfile(this.targetRecovery, this.provider);
    } catch (error) {
      throw new Error("Address is not an Universal Profile");
    }

    const bsrFactory = new LSP11BasicSocialRecovery__factory(this.signer);
    try {
      if (callback) callback("Deploy BSR contract");
      const bsrDeployed = await bsrFactory.deploy(this.targetRecovery);
      await bsrDeployed.deployed();

      if (callback) callback("Grant permissions to BSR");
      await this._grantPermissionsTo(bsrDeployed.address);

      if (options.secret) {
        if (callback) callback("Call to setSecret");
        await this.setSecret(options.secret);
      }
      if (options.guardians) {
        for (const guardian of options.guardians) {
          if (callback) callback(`Call addGuardian to ${guardian}`);
          await this.addGuardian(guardian);
        }
      }
      if (options.threshold) {
        if (callback) callback("Call setThreshold");
        await this.setThreshold(options.threshold);
      }

      if (callback) callback("Deployment succesfully");
      return bsrDeployed.address;
    } catch (error) {
      if (callback) callback("Error in deployment process", error as string);
      throw new Error(error as string);
    }
  }
  /**
   * Add a new guardian
   * @param {string} newGuardian new guardian address
   * @returns {Promise<ContractReceipt>}
   */
  public async addGuardian(newGuardian: string): Promise<ContractReceipt> {
    const basicSocialRecovery = await this.getBSRInstance(this.provider);
    const bsrPayload = basicSocialRecovery.interface.encodeFunctionData(
      "addGuardian",
      [newGuardian]
    );

    const payload = encodeExecutePayload(
      basicSocialRecovery.address,
      bsrPayload
    );
    return await this._executeKeyManager(payload);
  }
  /**
   * Remove a guardian
   * @param {string} guardian target guardian address
   * @returns {Promise<ContractReceipt>}
   */
  public async removeGuardian(guardian: string): Promise<ContractReceipt> {
    const basicSocialRecovery = await this.getBSRInstance(this.provider);
    const bsrPayload = basicSocialRecovery.interface.encodeFunctionData(
      "removeGuardian",
      [guardian]
    );

    const payload = encodeExecutePayload(
      basicSocialRecovery.address,
      bsrPayload
    );
    return await this._executeKeyManager(payload);
  }
  /**
   * Set a guardian threshold
   * @param {BigNumberish} guardianThreshold
   * @returns {Promise<ContractReceipt>}
   */
  public async setThreshold(
    guardianThreshold: BigNumberish
  ): Promise<ContractReceipt> {
    const basicSocialRecovery = await this.getBSRInstance(this.provider);
    const bsrPayload = basicSocialRecovery.interface.encodeFunctionData(
      "setThreshold",
      [guardianThreshold]
    );
    const payload = encodeExecutePayload(
      basicSocialRecovery.address,
      bsrPayload
    );
    return await this._executeKeyManager(payload);
  }
  /**
   * Set new secret
   * @param {string} secret 0x + 32-byte hexadecimal text string
   * @returns {Promise<ContractReceipt>}
   */
  public async setSecret(secret: string): Promise<ContractReceipt> {
    const basicSocialRecovery = await this.getBSRInstance(this.provider);
    const bsrPayload = basicSocialRecovery.interface.encodeFunctionData(
      "setSecret",
      [secret]
    );
    const payload = encodeExecutePayload(
      basicSocialRecovery.address,
      bsrPayload
    );
    return await this._executeKeyManager(payload);
  }
  /**
   * Return all recover processes ids in the current recovery process
   * @returns {Promise<string>}
   */
  public async getRecoverProcessesIds(): Promise<string[]> {
    const basicSocialRecovery = await this.getBSRInstance(this.provider);
    return await basicSocialRecovery.getRecoverProcessesIds();
  }
  /**
   * Return a list of the current guardians
   * @returns {Promise<string>}
   */
  public async getGuardians(): Promise<string[]> {
    const basicSocialRecovery = await this.getBSRInstance(this.provider);
    return await basicSocialRecovery.getGuardians();
  }
  /**
   * Return current guardians threshold
   * @returns {Promise<string>}
   */
  public async getGuardiansThreshold(): Promise<string> {
    const basicSocialRecovery = await this.getBSRInstance(this.provider);
    const threshold = await basicSocialRecovery.getGuardiansThreshold();
    return threshold.toString();
  }
  /**
   * Return guardian vote given a processId and guardian address
   * @param {string} processId
   * @param {string} guardian
   * @returns {Promise<string>}
   */
  public async getGuardianVote(
    processId: string,
    guardian: string
  ): Promise<string> {
    const basicSocialRecovery = await this.getBSRInstance(this.provider);
    return await basicSocialRecovery.getGuardianVote(processId, guardian);
  }
  /**
   * Vote a new address for recover Universal Profile
   * Can only be called by the guardians
   * @param {VoteToRecoverParams} params
   * @returns {Promise<ContractReceipt>}
   */
  public async voteToRecover(
    params: VoteToRecoverParams
  ): Promise<ContractReceipt> {
    const basicSocialRecovery = await this.getBSRInstance(this.signer);

    const tx = await basicSocialRecovery.voteToRecover(
      params.recoverProcessId,
      params.address
    );
    return await getReceipt(tx);
  }
  /**
   * Recover the Universal Profile ownership.
   * Can only be called by the address that reached the threshold in a recovery process id.
   * @param params
   * @returns
   */
  public async recoverOwnership(
    params: RecoverOwnershipParams
  ): Promise<ContractReceipt> {
    const basicSocialRecovery = await this.getBSRInstance(this.signer);

    const tx = await basicSocialRecovery.recoverOwnership(
      params.recoverProcessId,
      params.secret,
      params.newSecret
    );
    return await getReceipt(tx);
  }
}
