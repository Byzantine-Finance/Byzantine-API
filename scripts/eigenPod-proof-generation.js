import { exec } from 'child_process';
import fs from 'fs';

async function getValidatorFieldsProof(
    slot,
    validatorIndex,
    chainID
) {

    const blockHeaderFileInput = `./data/holesky_block_header_${slot}.json`;
    const stateFileInput = `./data/holesky_state_${slot}.json`;
    const outputFile = `./data/withdrawal_credential_proof_${validatorIndex}.json`;

    const command = `./bin/generation \
        -command ValidatorFieldsProof \
        -oracleBlockHeaderFile  ${blockHeaderFileInput} \
        -stateFile ${stateFileInput} \
        -validatorIndex ${validatorIndex} \
        -outputFile ${outputFile} \
        -chainID ${chainID}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Command ValidatorFieldsProof failed: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`ValidatorFieldsProof generation error: ${stderr}`);
            return;
        }
        console.log(`${outputFile} created successfully.`);
    });
    
}

export {getValidatorFieldsProof};