# LUKSO Build UP! #1 Hackathon - Submission Information
## up-basic-social-recovery

## Participant

- Name: **Lucas Jovanovich | en0c-026**
- Email: **bitup.games@gmail.com**


## This submission counts in two parts:
- Typescript library: **ryup-social-recovery-tool**
  - Repository: [This is the library repository](https://github.com/en0c-026/up-basic-social-recovery).
- NextJS Dapp: **RyUP - Universal Profile social recovery**
  - Repository: [https://github.com/en0c-026/ryup](https://github.com/en0c-026/ryup)


## Demo Links:
- Live Dapp: [https://ryup.vercel.app](https://ryup.vercel.app)
- Youtube Video: [https://youtu.be/1wi7zcAYTsw](https://youtu.be/1wi7zcAYTsw)


## Usage
```bash
npm install ryup-basic-social-recovery
```

## Example

**`Example`**

```javascript
const provider = new JsonRpcProvider(RPC_URL);
const signer = new Signer(PRIVATE_KEY, RPC_URL);
const basicSocialRecovery = new BasicSocialRecovery(UP_ADDRESS, provider, signer);

// From the browser
const provider = new Web3Provider(window.ethereum);
const basicSocialRecovery = new BasicSocialRecovery(UP_ADDRESS, provider);
```

For technical documentation, [click here](https://github.com/en0c-026/up-basic-social-recovery/tree/master/docs/techincal-reference).