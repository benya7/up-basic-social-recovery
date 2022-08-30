[up-basic-social-recovery - v1.0.0](../README.md) / BasicSocialRecovery

# Class: BasicSocialRecovery

Class for deploy and manage a social recovery tool for Lukso Universal Profile

**`Property`**

**`Property`**

**`Property`**

## Table of contents

### Constructors

- [constructor](BasicSocialRecovery.md#constructor)

### Properties

- [provider](BasicSocialRecovery.md#provider)
- [signer](BasicSocialRecovery.md#signer)
- [targetRecovery](BasicSocialRecovery.md#targetrecovery)

### Methods

- [\_executeKeyManager](BasicSocialRecovery.md#_executekeymanager)
- [\_getKMInstance](BasicSocialRecovery.md#_getkminstance)
- [\_grantPermissionsTo](BasicSocialRecovery.md#_grantpermissionsto)
- [\_setDataKeyManager](BasicSocialRecovery.md#_setdatakeymanager)
- [addGuardian](BasicSocialRecovery.md#addguardian)
- [deploy](BasicSocialRecovery.md#deploy)
- [getBSRInstance](BasicSocialRecovery.md#getbsrinstance)
- [getGuardianVote](BasicSocialRecovery.md#getguardianvote)
- [getGuardians](BasicSocialRecovery.md#getguardians)
- [getGuardiansThreshold](BasicSocialRecovery.md#getguardiansthreshold)
- [getRecoverProcessesIds](BasicSocialRecovery.md#getrecoverprocessesids)
- [getUPInstance](BasicSocialRecovery.md#getupinstance)
- [recoverOwnership](BasicSocialRecovery.md#recoverownership)
- [removeGuardian](BasicSocialRecovery.md#removeguardian)
- [setSecret](BasicSocialRecovery.md#setsecret)
- [setThreshold](BasicSocialRecovery.md#setthreshold)
- [voteToRecover](BasicSocialRecovery.md#votetorecover)

## Constructors

### constructor

• **new BasicSocialRecovery**(`targetRecovery`, `rpcUrlOrProvider`, `privateKeyOrSigner?`)

**`Example`**

```javascript
const provider = new JsonRpcProvider(RPC_URL);
const signer = new Signer(PRIVATE_KEY, RPC_URL);
const basicSocialRecovery = new BasicSocialRecovery(UP_ADDRESS, provider, signer);

// From the browser
const provider = new Web3Provider(window.ethereum);
const basicSocialRecovery = new BasicSocialRecovery(UP_ADDRESS, provider);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetRecovery` | `string` |
| `rpcUrlOrProvider` | `string` \| `JsonRpcProvider` \| `Web3Provider` |
| `privateKeyOrSigner?` | `string` \| `Signer` |

#### Defined in

[lib/BasicSocialRecovery.ts:69](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L69)

## Properties

### provider

• **provider**: `JsonRpcProvider` \| `Web3Provider`

#### Defined in

[lib/BasicSocialRecovery.ts:50](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L50)

___

### signer

• **signer**: `Signer`

#### Defined in

[lib/BasicSocialRecovery.ts:51](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L51)

___

### targetRecovery

• **targetRecovery**: `string`

#### Defined in

[lib/BasicSocialRecovery.ts:49](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L49)

## Methods

### \_executeKeyManager

▸ `Private` **_executeKeyManager**(`payload`): `Promise`<`ContractReceipt`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `string` |

#### Returns

`Promise`<`ContractReceipt`\>

#### Defined in

[lib/BasicSocialRecovery.ts:151](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L151)

___

### \_getKMInstance

▸ `Private` **_getKMInstance**(): `Promise`<`LSP6KeyManager`\>

#### Returns

`Promise`<`LSP6KeyManager`\>

#### Defined in

[lib/BasicSocialRecovery.ts:117](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L117)

___

### \_grantPermissionsTo

▸ `Private` **_grantPermissionsTo**(`to`): `Promise`<`ContractReceipt`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `to` | `string` |

#### Returns

`Promise`<`ContractReceipt`\>

#### Defined in

[lib/BasicSocialRecovery.ts:129](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L129)

___

### \_setDataKeyManager

▸ `Private` **_setDataKeyManager**(`keys`, `values`): `Promise`<`ContractReceipt`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keys` | `string`[] |
| `values` | `string`[] |

#### Returns

`Promise`<`ContractReceipt`\>

#### Defined in

[lib/BasicSocialRecovery.ts:141](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L141)

___

### addGuardian

▸ **addGuardian**(`newGuardian`): `Promise`<`ContractReceipt`\>

Add a new guardian

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `newGuardian` | `string` | new guardian address |

#### Returns

`Promise`<`ContractReceipt`\>

#### Defined in

[lib/BasicSocialRecovery.ts:252](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L252)

___

### deploy

▸ **deploy**(`options`, `callback?`): `Promise`<`string`\>

Deploying a new contract LSP11BasicSocial Recovery returns the address of the contract.

**`Example`**

```javascript
const secret = ethers.utils.toKeccak256(ethers.utils.toUtf8Bytes("mysecret"));

// Threshold can't be less than guardians array length
const threshold = 1;
const guardians = [GUARDIAN_ADDRESS1, GUARDIAN_GUARDIAN2];
await basicSocialRecovery.deploy({
 secret,
 threshold,
 guardians
})

```

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`DeployOptions`](../interfaces/DeployOptions.md) |
| `callback?` | (`currentStep`: `string`, `onError?`: `string`) => `void` |

#### Returns

`Promise`<`string`\>

Address of deployed contract

#### Defined in

[lib/BasicSocialRecovery.ts:206](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L206)

___

### getBSRInstance

▸ **getBSRInstance**(`signerOrProvider`): `Promise`<`LSP11BasicSocialRecovery`\>

Returns an instance of the LPS11BasicSocialRecovery contract, linked to the address of the implemented contract stored in the Universal Profile keys.

#### Parameters

| Name | Type |
| :------ | :------ |
| `signerOrProvider` | `Signer` \| `Provider` |

#### Returns

`Promise`<`LSP11BasicSocialRecovery`\>

#### Defined in

[lib/BasicSocialRecovery.ts:169](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L169)

___

### getGuardianVote

▸ **getGuardianVote**(`processId`, `guardian`): `Promise`<`string`\>

Return guardian vote given a processId and guardian address

#### Parameters

| Name | Type |
| :------ | :------ |
| `processId` | `string` |
| `guardian` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[lib/BasicSocialRecovery.ts:350](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L350)

___

### getGuardians

▸ **getGuardians**(): `Promise`<`string`[]\>

Return a list of the current guardians

#### Returns

`Promise`<`string`[]\>

#### Defined in

[lib/BasicSocialRecovery.ts:331](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L331)

___

### getGuardiansThreshold

▸ **getGuardiansThreshold**(): `Promise`<`string`\>

Return current guardians threshold

#### Returns

`Promise`<`string`\>

#### Defined in

[lib/BasicSocialRecovery.ts:339](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L339)

___

### getRecoverProcessesIds

▸ **getRecoverProcessesIds**(): `Promise`<`string`[]\>

Return all recover processes ids in the current recovery process

#### Returns

`Promise`<`string`[]\>

#### Defined in

[lib/BasicSocialRecovery.ts:323](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L323)

___

### getUPInstance

▸ **getUPInstance**(): `Promise`<`UniversalProfile`\>

Returns a read-only instance of the Universal Profile contract

**`Member Of`**

BasicSocialRecovery

#### Returns

`Promise`<`UniversalProfile`\>

#### Defined in

[lib/BasicSocialRecovery.ts:102](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L102)

___

### recoverOwnership

▸ **recoverOwnership**(`params`): `Promise`<`ContractReceipt`\>

Recover the Universal Profile ownership.
Can only be called by the address that reached the threshold in a recovery process id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`RecoverOwnershipParams`](../interfaces/RecoverOwnershipParams.md) |

#### Returns

`Promise`<`ContractReceipt`\>

#### Defined in

[lib/BasicSocialRecovery.ts:380](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L380)

___

### removeGuardian

▸ **removeGuardian**(`guardian`): `Promise`<`ContractReceipt`\>

Remove a guardian

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `guardian` | `string` | target guardian address |

#### Returns

`Promise`<`ContractReceipt`\>

#### Defined in

[lib/BasicSocialRecovery.ts:270](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L270)

___

### setSecret

▸ **setSecret**(`secret`): `Promise`<`ContractReceipt`\>

Set new secret

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `secret` | `string` | 0x + 32-byte hexadecimal text string |

#### Returns

`Promise`<`ContractReceipt`\>

#### Defined in

[lib/BasicSocialRecovery.ts:307](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L307)

___

### setThreshold

▸ **setThreshold**(`guardianThreshold`): `Promise`<`ContractReceipt`\>

Set a guardian threshold

#### Parameters

| Name | Type |
| :------ | :------ |
| `guardianThreshold` | `BigNumberish` |

#### Returns

`Promise`<`ContractReceipt`\>

#### Defined in

[lib/BasicSocialRecovery.ts:288](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L288)

___

### voteToRecover

▸ **voteToRecover**(`params`): `Promise`<`ContractReceipt`\>

Vote a new address for recover Universal Profile
Can only be called by the guardians

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`VoteToRecoverParams`](../interfaces/VoteToRecoverParams.md) |

#### Returns

`Promise`<`ContractReceipt`\>

#### Defined in

[lib/BasicSocialRecovery.ts:363](https://github.com/en0c-026/up-basic-social-recovery/blob/20697e5/src/lib/BasicSocialRecovery.ts#L363)
