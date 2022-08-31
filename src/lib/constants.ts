import { ERC725JSONSchema } from "@erc725/erc725.js";
import LSP6Schema from "@erc725/erc725.js/schemas/LSP6KeyManager.json";

import { Network } from "./interfaces";
export const LSP11_KEY_NAME = "LSP11BasicSocialRecovery";
export const LSP11_INTERFACE_ID = "0xcb81043b";
export const LSP6_INTERFACE_ID = "0xc403d48f";
export const ERC725_ACCOUNT_INTERFACE = "0x9a3bfe88";

export const schemas: ERC725JSONSchema[] = [
  {
    name: "SupportedStandards:LSP3UniversalProfile",
    key: "0xeafec4d89fa9619884b60000abe425d64acd861a49b8ddf5c0b6962110481f38",
    keyType: "Mapping",
    valueType: "bytes",
    valueContent: "0xabe425d6",
  },
  {
    name: "LSP3Profile",
    key: "0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5",
    keyType: "Singleton",
    valueType: "bytes",
    valueContent: "JSONURL",
  },
  {
    name: "LSP1UniversalReceiverDelegate",
    key: "0x0cfc51aec37c55a4d0b1a65c6255c4bf2fbdf6277f3cc0730c45b828b6db8b47",
    keyType: "Singleton",
    valueType: "address",
    valueContent: "Address",
  },
  {
    name: "LSP11BasicSocialRecovery",
    key: "0x372626dc510c09a8871d6c9731204d9d418b49e4da4d1945e745e3cbad9fed81",
    keyType: "Singleton",
    valueType: "address",
    valueContent: "Address",
  },
  {
    name: "AddressPermissions:Permissions:<address>",
    key: "0x4b80742de2bf82acb3630000<address>",
    keyType: "MappingWithGrouping",
    valueType: "bytes32",
    valueContent: "BitArray",
  },
  ...(LSP6Schema as ERC725JSONSchema[]),
];

export const networks: { [key: number]: Network } = {
  2828: {
    name: "L16",
    rpcUrl: "https://rpc.l16.lukso.network/",
  },
  22: {
    name: "L14",
    rpcUrl: "https://rpc.l14.lukso.network/",
  },
};
