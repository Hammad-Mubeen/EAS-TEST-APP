import createOnChainAttestation from "../scripts/createOnChainAttestation";
import createOffChainAttestation from "../scripts/createAndVerifyOffChainAttestation";
import ig from "./../../public/kresuslogo.png"
import Image from "next/image";
import { SetStateAction,useState } from "react";

export default function Home() {

	let [OnChainUIDLink,setOnChainUIDLink] = useState (" not found");
	let [OnChainUIDColor,setOnChainTextColor] = useState ('red'); 

	function toggleOnChain(link: SetStateAction<string>){
		setOnChainUIDLink(link);
		setOnChainTextColor('green');
	}
	async function callOnChainAttestationFunction(){
		var createOnChainAttestationResult = await createOnChainAttestation();
		console.log("Attestation UID: " + createOnChainAttestationResult);
		window.alert("OnChain Attestation Successfull \nAttestation UID: " + createOnChainAttestationResult);
		toggleOnChain(process.env.NEXT_PUBLIC_ATTESTATION_LINK! + createOnChainAttestationResult);
	}
	async function callOffChainAttestationFunction(){
		await createOffChainAttestation();
	}
	return (
		<div>
			<div className="flex flex-col items-center justify-center align-middle h-screen">
				<Image  src={ig} width={150} alt="Kresus logo"/>
				<br/>
				<p className="text-2xl mb-5">EAS X Kresus</p>
				
				<button className="border border-black rounded-md" style={{marginTop:15}} onClick={callOnChainAttestationFunction} >
					<div className="mx-3 my-1">Test OnChain Attestation</div>
				</button>
				
				<button className="border border-black rounded-md" style={{marginTop:15}} onClick={callOffChainAttestationFunction} >
					<div className="mx-3 my-1">Test OffChain Attestation</div>
				</button>

				<div style={{textAlign: 'center', marginTop:15}}>
					Onchain Attestation UID: 
					<a href={OnChainUIDLink} style={{color: OnChainUIDColor}}>{OnChainUIDLink}</a>
				</div>

			</div>
		</div>
	);
}
