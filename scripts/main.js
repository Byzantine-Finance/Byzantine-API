import dotenv from 'dotenv';
dotenv.config();
import {getValidatorIndex} from "./beacon-chain-api.js";


async function main(beaconStateId, validatorPubKey) {
    
    const API_ENDPOINT = process.env.BASE_API_URL;
    const API_KEY = process.env.API_KEY;

    const validator_index = await getValidatorIndex(
        API_KEY,
        API_ENDPOINT,
        beaconStateId,
        validatorPubKey,
    );
    
    console.log(validator_index);
}

const beaconStateId = process.argv[2];
const validatorPubKey = process.argv[3];

if (!beaconStateId || !validatorPubKey) {
    console.log("Usage: node scripts/main.js <beaconStateId> <validatorPubKey>");
    process.exit(1);
}

main(beaconStateId, validatorPubKey);