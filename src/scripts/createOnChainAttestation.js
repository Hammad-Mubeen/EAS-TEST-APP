require("dotenv").config();
var { EAS, SchemaEncoder} = require('@ethereum-attestation-service/eas-sdk');
import provider from '../ethers/ether';

const EASContractAddress = process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS; // Sepolia v0.26
const schemaUID = process.env.NEXT_PUBLIC_SCHEMA_UID;
const docHash = process.env.NEXT_PUBLIC_DOC_HASH;

export default async function createOnChainAttestation()
{
    const signer = await provider.getSigner();
    const eas = new EAS(EASContractAddress);
    eas.connect(signer);

    const schemaEncoder = new SchemaEncoder("uint256 timestamp,string metadata,bytes32 contentHash");
    const encodedData = schemaEncoder.encodeData([
      { name: "timestamp", value: "1720530959", type: "uint256" },
      { name: "metadata", value: "This is my resume.", type: "string" },
      { name: "contentHash", value: docHash, type: "bytes32" }
    ]);

    const tx = await eas.attest({
        schema: schemaUID,
        data: {
            recipient: "0x0000000000000000000000000000000000000000",
            expirationTime: 0,
            revocable: true, // Be aware that if your schema is not revocable, this MUST be false
            data: encodedData,
        },
    });
    const newAttestationUID = await tx.wait();
    return newAttestationUID;
}
