require("dotenv").config();
const {EAS, SchemaEncoder} =require('@ethereum-attestation-service/eas-sdk');
import provider from '../ethers/ether';

const EASContractAddress = process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS; // Sepolia v0.26
const schemaUID = process.env.NEXT_PUBLIC_SCHEMA_UID;
const docHash = process.env.NEXT_PUBLIC_DOC_HASH;
const signerPublicKey=process.env.NEXT_PUBLIC_USER_PUBLIC_KEY;
const timestamp = BigInt(Math.floor(Date.now() / 1000));

const eas = new EAS(EASContractAddress);

export default async function createOffChainAttestation()
{
    const signer = await provider.getSigner();
    eas.connect(signer);
    const offchain = await eas.getOffchain();
    
    const schemaEncoder = new SchemaEncoder("bytes32 hashOfDocument,string note");
    const encodedData = schemaEncoder.encodeData([
        { name: "hashOfDocument", value: docHash, type: "bytes32" },
        { name: "note", value: "This is a document", type: "string" }
    ]);

    const offchainAttestation = await offchain.signOffchainAttestation({
      recipient: signerPublicKey,
      expirationTime: 0n,
      time: timestamp,
      revocable: true,
      schema: schemaUID,
      refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
      data: encodedData,
    }, signer);
    console.log("OffChain Attestation: ", offchainAttestation);
    return offchainAttestation;
}
