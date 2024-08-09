require("dotenv").config();
var { EAS, SchemaEncoder} = require('@ethereum-attestation-service/eas-sdk');
var { ethers }  = require("ethers");
var fs = require('fs');
const { createHash } = require('crypto');

const EASContractAddress = process.env.EASContractAddress; // Sepolia v0.26
const schemaUID = process.env.schemaUID;
const privateKey = process.env.privateKey;

const getBinary = (pathToBinary) => {
  return fs.readFileSync(pathToBinary,null);
};

async function testCreateOnChainAttestation()
{
    // Initialize the sdk with the address of the EAS Schema contract address
    const eas = new EAS(EASContractAddress);

    // Gets a default provider (in production use something else like infura/alchemy)
    const provider = ethers.getDefaultProvider(
      "sepolia"
    );
    const signer = new ethers.Wallet(privateKey, provider);
    //Connects an ethers style provider/signingProvider to perform read/write functions.
    //MUST be a signer to do write operations!
    eas.connect(signer);
    
    let data=getBinary('././public/Muhammad Hammad Mubeen Resume.pdf');
    var hash = createHash('sha256').update(data).digest('hex');
    hash='0x'+hash;

    // // Initialize SchemaEncoder with the schema string
    // const schemaEncoder = new SchemaEncoder("bool isTrustable,string Name");
    // const encodedData = schemaEncoder.encodeData([
    //     { name: "isTrustable", value: true, type: "bool" },
    //     { name: "Name", value: "Arsal", type: "string" }
    // ]);

    // // Initialize SchemaEncoder with the schema string
    // const schemaEncoder = new SchemaEncoder("bytes32 contentHash");
    // const encodedData = schemaEncoder.encodeData([
    //     { name: "contentHash", value: hash, type: "bytes32" }
    // ]);

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder("uint256 timestamp,string metadata,bytes32 contentHash");
    const encodedData = schemaEncoder.encodeData([
      { name: "timestamp", value: "1720530959", type: "uint256" },
      { name: "metadata", value: "This is my resume.", type: "string" },
      { name: "contentHash", value: hash, type: "bytes32" }
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
    console.log("New attestation UID:", newAttestationUID);
}
testCreateOnChainAttestation();
