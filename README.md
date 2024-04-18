# Byzantine API - Access the Ethereum Beacon Chain state

API for accessing the Beacon Chain state and generate the `validatorFieldsProofs` to properly call the `verifyWithdrawalCredentials` function of the [EigenPod smart contracts](https://github.com/Layr-Labs/eigenlayer-contracts/blob/dev/docs/core/EigenPodManager.md#eigenpodverifywithdrawalcredentials).<br/>
**The final purpose is to allow a validator to restake its native ETH.**

## Get started

Create a `.env` file by coping the `.env.example` file and fill your `API_KEY` (you can get one by creating a [spice.ai account](https://spice.ai/login)).

## Generate the proof

You will only need to provide the **validator public key** you want to prove the withdrawal credential.<br/>
You can generate the proof by running the following command:
```bash
$ node scripts/main.js <validatorPubKey>
```

It will create the 3 following files:
- `./data/holesky_block_header_<slot>.json`: The block header of the last finalized slot (hopefully not empty)
- `./data/holesky_state_<slot>.json`: The state of the Holesky blockchain at that same slot (very heavy file)
- `withdrawal_credential_proof_<validatorIndex>.json`: The withdrawal credential proof of a specific validator

## Future work

- Move in Rust for more resilience 