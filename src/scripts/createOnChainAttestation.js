require("dotenv").config();
var { EAS, SchemaEncoder} = require('@ethereum-attestation-service/eas-sdk');
import provider from '../ethers/ether';

const EASContractAddress = process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS; // Sepolia v0.26
const schemaUID = process.env.NEXT_PUBLIC_SCHEMA_UID;

export default async function createOnChainAttestation(recipient,docHash,note)
{
    const signer = await provider.getSigner();
    const eas = new EAS(EASContractAddress);
    eas.connect(signer);

    const schemaEncoder = new SchemaEncoder("bytes32 hashOfDocument,string note");
    const encodedData = schemaEncoder.encodeData([
        { name: "hashOfDocument", value: docHash, type: "bytes32" },
        { name: "note", value: note, type: "string" }
    ]);

    const tx = await eas.attest({
        schema: schemaUID,
        data: {
            recipient: recipient,
            expirationTime: 0,
            revocable: true, // Be aware that if your schema is not revocable, this MUST be false
            data: encodedData,
        },
    });
    const newAttestationUID = await tx.wait();
    return newAttestationUID;
}
