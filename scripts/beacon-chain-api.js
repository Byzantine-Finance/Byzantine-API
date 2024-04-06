import axios from 'axios';

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

export {getValidatorIndex};
