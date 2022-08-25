import ERC725 from '@erc725/erc725.js';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { ContractTransaction, Signer } from 'ethers';
import Web3 from 'web3';

import { LSP11BasicSocialRecovery__factory, UniversalProfile__factory } from '../../';
import { schemas } from '../constants';

export async function getPermissionData(upAddress: string, rpcUrl: string, to: string) {
  const erc725 = new ERC725(schemas, upAddress, new Web3.providers.HttpProvider(rpcUrl));

  const permissionAddressList = (await erc725.getData('AddressPermissions[]')).value as string[];

  const permissionData = erc725.encodeData([
    {
      keyName: 'AddressPermissions:Permissions:<address>',
      dynamicKeyParts: to,
      value: ERC725.encodePermissions({
        ADDPERMISSIONS: true,
        CHANGEPERMISSIONS: true,
      }),
    },
    {
      keyName: 'LSP11BasicSocialRecovery',
      value: to,
    },
    {
      keyName: 'AddressPermissions[]',
      value: [...permissionAddressList, to],
    },
  ]);
  return permissionData;
}

export async function getReceipt(transaction: ContractTransaction) {
  const receipt = await transaction.wait();
  return receipt;
}

export async function getStaticBsrInstance(upAddress: string, providerOrSigner: ExternalProvider | Signer) {
  let signer: Signer;

  if (providerOrSigner instanceof Signer) {
    signer = providerOrSigner;
  } else {
    signer = new Web3Provider(providerOrSigner).getSigner();
  }
  const up = UniversalProfile__factory.connect(upAddress, signer);
  const bsrAddress = await up['getData(bytes32)']('0x372626dc510c09a8871d6c9731204d9d418b49e4da4d1945e745e3cbad9fed81');
  return LSP11BasicSocialRecovery__factory.connect(bsrAddress, signer);
}
