import axios from 'axios';
import fs from 'fs';

async function getValidatorIndex(apiKey, apiEndpoint, stateId, pubKey) {

    const url = `${apiEndpoint}/eth/v1/beacon/states/${stateId}/validators/${pubKey}`;

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

    const url = `${apiEndpoint}/eth/v1/beacon/headers`;

    try {
        const response = await axios.get(url, {
            headers: {
                'X-API-Key': apiKey
            }
        });

        const lastSlot = response.data.data[0].header.message.slot;
        const dataAsString = JSON.stringify(response.data, null, 2);
        const filePath = `data/holesky_block_header_${lastSlot}.json`;

        fs.writeFileSync(filePath, dataAsString, 'utf8', (err) => {
            if (err) {
                console.error(`Failed to save block header file at slot ${lastSlot}: `, err);
            } else {
                console.log(`File ${filePath} created successfully.`);
            }
        });

        return lastSlot;

    } catch (error) {
        console.error("Error in createOracleBlockHeaderFile() function: ", error);

    }

}

export {getValidatorIndex, createOracleBlockHeaderFile};
