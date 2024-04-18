import dotenv from 'dotenv';
dotenv.config();
import {getValidatorIndex, createOracleBlockHeaderFile, createStateFile} from "./beacon-chain-api.js";
import { getValidatorFieldsProof, getBalanceUpdateProof } from './eigenPod-proof-generation.js';

async function main(proof, validatorPubKey) {
    
    const API_ENDPOINT = process.env.BASE_API_URL;
    const API_KEY = process.env.API_KEY;
    const CHAIN_ID = process.env.CHAIN_ID;

    if (proof != 'ValidatorFieldsProof' && proof != 'BalanceUpdateProof') {
        console.error('Invalid proof function: choose "ValidatorFieldsProof" or "BalanceUpdateProof"');
        return;
    }

    const validatorIndex = await getValidatorIndex(
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

    if (proof === 'ValidatorFieldsProof') {
        await getValidatorFieldsProof(
            lastFinalizedSlot,
            validatorIndex,
            CHAIN_ID,
        );
    } else if (proof === 'BalanceUpdateProof') {
        await getBalanceUpdateProof(
            lastFinalizedSlot,
            validatorIndex,
            CHAIN_ID,
        );
    } else {
        console.log('Invalid proof function: choose "ValidatorFieldsProof" or "BalanceUpdateProof"');
    }

    
}

const proof = process.argv[2];
const validatorPubKey = process.argv[3];

if (!proof || !validatorPubKey) {
    console.log("Usage: node scripts/main.js <ProofFunction> <validatorPubKey>");
    console.log('Proof Functions: ValidatorFieldsProof, BalanceUpdateProof');
    process.exit(1);
}

main(proof, validatorPubKey);