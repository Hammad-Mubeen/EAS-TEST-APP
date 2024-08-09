require("dotenv").config();
var { EAS} = require('@ethereum-attestation-service/eas-sdk');
var { ethers }  = require("ethers");

const EASContractAddress = process.env.EASContractAddress; // Sepolia v0.26
const attestationUID = process.env.attestationUID;
const privateKey = process.env.privateKey;

async function testAccessAttestation()
{
    const eas = new EAS(EASContractAddress);
    const provider = ethers.getDefaultProvider(
        "sepolia"
    );
    const signer = new ethers.Wallet(privateKey, provider);
    eas.connect(signer);

    const attestation = await eas.getAttestation(attestationUID);

    console.log(attestation);
}
testAccessAttestation();

