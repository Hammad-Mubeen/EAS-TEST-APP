require("dotenv").config();
var { EAS, SchemaEncoder} = require('@ethereum-attestation-service/eas-sdk');
var { ethers }  = require("ethers");
var fs = require('fs');
const { createHash } = require('crypto');

const EASContractAddress = process.env.EASContractAddress;
const schemaUID = process.env.schemaUID;
const privateKey = process.env.privateKey;
const attestationUID = process.env.attestationUID;

const getBinary = (pathToBinary) => {
    return fs.readFileSync(pathToBinary,null);
};

async function testUpdateOnChainAttestation()
{
    const eas = new EAS(EASContractAddress);
    const provider = ethers.getDefaultProvider(
      "sepolia"
    );
    const signer = new ethers.Wallet(privateKey, provider);
    eas.connect(signer);
    let data=getBinary('././public/Muhammad Hammad Mubeen Resume.pdf');
    var hash = createHash('sha256').update(data).digest('hex');
    hash='0x'+hash;
    const schemaEncoder = new SchemaEncoder("uint256 timestamp,string metadata,bytes32 contentHash");
    const encodedData = schemaEncoder.encodeData([
      { name: "timestamp", value: "1720530959", type: "uint256" },
      { name: "metadata", value: "This is my resume. (Hammad)", type: "string" },
      { name: "contentHash", value: hash, type: "bytes32" }
    ]);
    const tx = await eas.attest({
        schema: schemaUID,
        data: {
            refUID: attestationUID,
            recipient: "0x0000000000000000000000000000000000000000",
            expirationTime: 0,
            revocable: true, // Be aware that if your schema is not revocable, this MUST be false
            data: encodedData,
        },
    });
    const updatedAttestationUID = await tx.wait();
    console.log("Updated attestation UID:", updatedAttestationUID);
}
testUpdateOnChainAttestation();
