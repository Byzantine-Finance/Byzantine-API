import { exec } from 'child_process';

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

async function getBalanceUpdateProof(
    slot,
    validatorIndex,
    chainID
) {

    const blockHeaderFileInput = `./data/holesky_block_header_${slot}.json`;
    const stateFileInput = `./data/holesky_state_${slot}.json`;
    const outputFile = `./data/balance_update_proof_${validatorIndex}.json`;

    const command = `./bin/generation \
        -command BalanceUpdateProof \
        -oracleBlockHeaderFile  ${blockHeaderFileInput} \
        -stateFile ${stateFileInput} \
        -validatorIndex ${validatorIndex} \
        -outputFile ${outputFile} \
        -chainID ${chainID}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Command BalanceUpdateProof failed: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`BalanceUpdateProof generation error: ${stderr}`);
            return;
        }
        console.log(`${outputFile} created successfully.`);
    });

}

export {getValidatorFieldsProof, getBalanceUpdateProof};