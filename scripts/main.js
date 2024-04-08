import dotenv from 'dotenv';
dotenv.config();
import {getValidatorIndex, createOracleBlockHeaderFile, createStateFile} from "./beacon-chain-api.js";
import { getValidatorFieldsProof } from './eigenPod-proof-generation.js';

async function main(validatorPubKey) {
    
    const API_ENDPOINT = process.env.BASE_API_URL;
    const API_KEY = process.env.API_KEY;
    const CHAIN_ID = process.env.CHAIN_ID;

    const validator_index = await getValidatorIndex(
        API_KEY,
        API_ENDPOINT,
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

const validatorPubKey = process.argv[2];

if (!validatorPubKey) {
    console.log("Usage: node scripts/main.js <validatorPubKey>");
    process.exit(1);
}

main(validatorPubKey);