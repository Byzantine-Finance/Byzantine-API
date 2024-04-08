import dotenv from 'dotenv';
dotenv.config();
import {getValidatorIndex, createOracleBlockHeaderFile, createStateFile} from "./beacon-chain-api.js";
import { getValidatorFieldsProof } from './eigenPod-proof-generation.js';

async function main(beaconStateId, validatorPubKey) {
    
    const API_ENDPOINT = process.env.BASE_API_URL;
    const API_KEY = process.env.API_KEY;
    const CHAIN_ID = process.env.CHAIN_ID;

    const validator_index = await getValidatorIndex(
        API_KEY,
        API_ENDPOINT,
        beaconStateId,
        validatorPubKey,
    );
    
    const lastFinalizedSlot = await createOracleBlockHeaderFile(
        API_KEY,
        API_ENDPOINT,
    );

    await createStateFile(
        API_KEY,
        API_ENDPOINT,
        lastFinalizedSlot,
    );

    await getValidatorFieldsProof(
        lastFinalizedSlot,
        validator_index,
        CHAIN_ID,
    );
    
}

const beaconStateId = process.argv[2];
const validatorPubKey = process.argv[3];

if (!beaconStateId || !validatorPubKey) {
    console.log("Usage: node scripts/main.js <beaconStateId> <validatorPubKey>");
    process.exit(1);
}

main(beaconStateId, validatorPubKey);