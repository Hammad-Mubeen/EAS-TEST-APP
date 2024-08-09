require("dotenv").config();
var { EAS} = require('@ethereum-attestation-service/eas-sdk');
import provider from '../ethers/ether';

const EASContractAddress = process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS; // Sepolia v0.26

export default async function accessAttestation(attestationUID)
{
    const eas = new EAS(EASContractAddress);
    const signer = await provider.getSigner();
    eas.connect(signer);
    const attestation = await eas.getAttestation(attestationUID);
    return attestation;
}


