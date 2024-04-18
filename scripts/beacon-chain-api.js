import axios from 'axios';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

// AROUND 2.5 epochs to reach finality (32+32+16)
const FINALITY_IN_SLOTS = 80;

async function getValidatorIndex(apiKey, apiEndpoint, pubKey) {

    const url = `${apiEndpoint}/eth/v1/beacon/states/finalized/validators/${pubKey}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'X-API-Key': apiKey
            }
        });
        return response.data.data.index;
    } catch (error) {
        console.error("axios error: ", error);

    }
}

async function createOracleBlockHeaderFile(apiKey, apiEndpoint) {

    // Variables to prevent to fetch empty slots data
    let emptySlot = true;

    const url = `${apiEndpoint}/eth/v1/beacon/headers`;

    try {
        const responseForLastSlot = await axios.get(url, {
            headers: {
                'X-API-Key': apiKey
            }
        });

        const lastSlot = responseForLastSlot.data.data[0].header.message.slot;
        let lastFinalizedSlot = lastSlot - FINALITY_IN_SLOTS;

        while(emptySlot) {
            try {

                const response = await axios.get(`${url}/${lastFinalizedSlot}`, {
                    headers: {
                        'X-API-Key': apiKey
                    }
                });

                const dataAsString = JSON.stringify(response.data, null, 2);
                emptySlot = false;

                const filePath = `data/holesky_block_header_${lastFinalizedSlot}.json`;

                fs.writeFileSync(filePath, dataAsString, 'utf8', (err) => {
                    if (err) {
                        console.error(`Failed to save block header file at slot ${lastFinalizedSlot}: `, err);
                    } else {
                        console.log(`File ${filePath} created successfully.`);
                    }
                });

            } catch (error) {
                if (error.response.data.message.includes('NOT_FOUND')) {
                    console.log(`No beacon block found at slot ${lastFinalizedSlot}, trying next slot...`);
                    lastFinalizedSlot++;
                } else {
                    console.error("Error in createOracleBlockHeaderFile() function: ", error);
                    break;
                }
            }
        }

        return lastFinalizedSlot;

    } catch (error) {
        console.error("Error in createOracleBlockHeaderFile() function: ", error);

    }

}

async function createStateFile(apiKey, apiEndpoint, slot) {

    const pipelineAsync = promisify(pipeline);

    const url = `${apiEndpoint}/eth/v2/debug/beacon/states/${slot}`;
    const filePath = `data/holesky_state_${slot}.json`;

    try {
        const response = await axios.get(url, {
            responseType:'stream',
            headers: {
                'X-API-Key': apiKey
            }
        });

        await pipelineAsync(response.data, fs.createWriteStream(filePath));
        console.log(`File ${filePath} created successfully.`);

    } catch (error) {
        console.error("Error in createStateFile() function: ", error);

    }

}

export {getValidatorIndex, createOracleBlockHeaderFile, createStateFile};
