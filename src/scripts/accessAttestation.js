require("dotenv").config();
var {EAS,SchemaEncoder} = require('@ethereum-attestation-service/eas-sdk');
import provider from '../ethers/ether';

const EASContractAddress = process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS; // Sepolia v0.26

export default async function accessAttestation(attestationId) {
    try {
        const signer = await provider.getSigner();
        const eas = new EAS(EASContractAddress);
        eas.connect(signer);
        const attestation = await eas.getAttestation(attestationId);
        if (!attestation) {
            throw new Error('Attestation not found');
        }
        // Decode the attestation data
        const schemaEncoder = new SchemaEncoder("bytes32 hashOfDocument,string note");
        const decodedData = schemaEncoder.decodeData(attestation.data);
        return decodedData;
    } catch (error) {
        console.error('Error decoding attestation:', error);
    }
}