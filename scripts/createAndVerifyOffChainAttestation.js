require("dotenv").config();
const {EAS, SchemaEncoder,OffchainAttestationVersion,Offchain} =require('@ethereum-attestation-service/eas-sdk');
var { ethers }  = require("ethers");
var fs = require('fs');
const { createHash } = require('crypto');

const EASContractAddress = process.env.EASContractAddress; // Sepolia v0.26
const schemaUID = process.env.schemaUID;
const signerPublicKey=process.env.signerPublicKey;
const privateKey = process.env.privateKey;
const timestamp = BigInt(Math.floor(Date.now() / 1000));

const getBinary = (pathToBinary) => {
  return fs.readFileSync(pathToBinary,null);
};

const eas = new EAS(EASContractAddress);

async function testCreateOffChainAttestation()
{
    const provider = ethers.getDefaultProvider(
      "sepolia"
    );
    const signer = new ethers.Wallet(privateKey,provider);
    eas.connect(signer);
    const offchain = await eas.getOffchain();
    
    let data=getBinary('././public/Muhammad Hammad Mubeen Resume.pdf');
    var hash = createHash('sha256').update(data).digest('hex');
    hash='0x'+hash;

    const schemaEncoder = new SchemaEncoder("uint256 timestamp,string metadata,bytes32 contentHash");
    const encodedData = schemaEncoder.encodeData([
      { name: "timestamp", value: timestamp, type: "uint256" },
      { name: "metadata", value: "This is my resume.", type: "string" },
      { name: "contentHash", value: hash, type: "bytes32" }
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
    return offchainAttestation;
}

async function verifySignature()
{
  const  offchainAttestation = await testCreateOffChainAttestation();
  console.log("offchainAttestation:", offchainAttestation);
  const EAS_CONFIG = {
    address: offchainAttestation.domain.verifyingContract,
    version: offchainAttestation.domain.version,
    chainId: offchainAttestation.domain.chainId
  };
  const offchain = new Offchain(EAS_CONFIG, OffchainAttestationVersion.Version2,eas);
  const isValidAttestation = offchain.verifyOffchainAttestationSignature(
    signerPublicKey,
    offchainAttestation
  );
  console.log("isValidAttestation: ",isValidAttestation);
}
verifySignature();