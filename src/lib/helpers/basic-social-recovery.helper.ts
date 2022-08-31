import ERC725 from "@erc725/erc725.js";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { ContractTransaction } from "ethers";
import Web3 from "web3";

import { LSP6KeyManager__factory, UniversalProfile__factory } from "../../";
import {
  ERC725_ACCOUNT_INTERFACE,
  LSP11_KEY_NAME,
  LSP6_INTERFACE_ID,
  schemas,
} from "../constants";

export async function encodePermissionsData(
  upAddress: string,
  rpcUrl: string,
  to: string
) {
  const provider = new Web3.providers.HttpProvider(rpcUrl);
  const erc725 = new ERC725(schemas, upAddress, provider);

  const currentAddressPermissionsList = (
    await erc725.getData("AddressPermissions[]")
  ).value as string[];

  const encodedData = erc725.encodeData([
    {
      keyName: "AddressPermissions:Permissions:<address>",
      dynamicKeyParts: to,
      value: ERC725.encodePermissions({
        ADDPERMISSIONS: true,
        CHANGEPERMISSIONS: true,
      }),
    },
    {
      keyName: "LSP11BasicSocialRecovery",
      value: to,
    },
    {
      keyName: "AddressPermissions[]",
      value: [...currentAddressPermissionsList, to],
    },
  ]);
  return encodedData;
}

export async function getReceipt(transaction: ContractTransaction) {
  const receipt = await transaction.wait();
  return receipt;
}

export async function addressIsUniversalProfile(
  address: string,
  provider: JsonRpcProvider | Web3Provider
) {
  const contract = UniversalProfile__factory.connect(address, provider);
  let _isUniversalProfile = await contract.supportsInterface(
    ERC725_ACCOUNT_INTERFACE
  );

  if (!_isUniversalProfile) {
    _isUniversalProfile = await contract.supportsInterface("0x63cb749b");
  }
  return _isUniversalProfile;
}

export async function ownerIsKeyManager(
  owner: string,
  provider: JsonRpcProvider | Web3Provider
) {
  try {
    const contract = LSP6KeyManager__factory.connect(owner, provider);
    return await contract.supportsInterface(LSP6_INTERFACE_ID);
  } catch (error) {
    return false;
  }
}

export function encodeExecutePayload(address: string, data: string) {
  const universalProfile = UniversalProfile__factory.createInterface();
  const payload = universalProfile.encodeFunctionData("execute", [
    0,
    address,
    0,
    data,
  ]);
  return payload;
}

export function encodeSetDataPayload(data: [string[], string[]]) {
  const universalProfile = UniversalProfile__factory.createInterface();
  const payload = universalProfile.encodeFunctionData(
    "setData(bytes32[],bytes[])",
    data
  );
  return payload;
}

export async function getBSRContractAddress(upAddress: string, rpcUrl: string) {
  const httpProvider = new Web3.providers.HttpProvider(rpcUrl);
  const erc725 = new ERC725(schemas, upAddress, httpProvider);
  const decodedData = await erc725.getData(LSP11_KEY_NAME);
  return decodedData.value as string;
}

export async function callerIsAllowed(
  upAddress: string,
  caller: string,
  rpcUrl: string
) {
  const httpProvider = new Web3.providers.HttpProvider(rpcUrl);
  const erc725 = new ERC725(schemas, upAddress, httpProvider);
  const encodedPermisssions = await erc725.getData({
    keyName: "AddressPermissions:Permissions:<address>",
    dynamicKeyParts: caller,
  });
  const decodedPermissions = erc725.decodePermissions(
    encodedPermisssions.value as string
  );

  return decodedPermissions["CALL"];
}
