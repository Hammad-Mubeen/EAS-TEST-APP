import createOnChainAttestation from "../scripts/createOnChainAttestation";
import createOffChainAttestation from "../scripts/createAndVerifyOffChainAttestation";
import Image from "next/image";
import { SetStateAction,useId,useState } from "react";
// @ts-ignore
import { Card, CardHeader,CardBody} from "@nextui-org/react";
import { File } from 'buffer';
// @ts-ignore
import ReactConfetti from "react-confetti";
const { createHash } = require('crypto');
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();
	const [file, setFile] = useState<File | null>(null);
	const [recipient, setRecipient] = useState('');
	const [docHash, setdocHash] = useState('');
	const [note, setNote] = useState('');
	const [openModal, setOpenModal] = useState(false);
  	const [showConfetti, setShowConfetti] = useState(false);
	let [UID,setUID] = useState<String | null>(null);
	const picker = useId();
	
	const handleCloseModal = () => {
		setOpenModal(false);
		if (localStorage.getItem("UID")) {
			localStorage.removeItem("UID");
		}
		localStorage.setItem("UID", UID as string);
		router.push("./verifyDoc");
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const fileData = event.target.files?.[0];
		if (fileData) {
		  var reader = new FileReader();
		  reader.onloadend = function() {
			console.log("Recipient: ",recipient);
			console.log("Note: ",note);
			console.log("file: ",fileData);
			// @ts-ignore
			var array = new Uint8Array(this.result);
			console.log("File Converted into Buffer: ",array);
			let hash = createHash('sha256').update(array).digest('hex');
			hash='0x'+hash;
			console.log("DocHash: ",hash);
			setdocHash(hash);
		  };
		  reader.readAsArrayBuffer(fileData);
		}
		
	};

	async function callOnChainAttestationFunction(){
		var createOnChainAttestationResult = await createOnChainAttestation(recipient,docHash,note);
		console.log("Attestation UID: " + process.env.NEXT_PUBLIC_ATTESTATION_LINK! + createOnChainAttestationResult);
		setUID(createOnChainAttestationResult);
		setOpenModal(true);
    	setShowConfetti(true);
	}
	async function callOffChainAttestationFunction(){
		await createOffChainAttestation();
	}

	return (
		<div>
			<div className="flex flex-col  items-center" style={{ margin: 50}}>
				<Card className="border rounded-md" style={{ width: 650, borderRadius: 10 }}>
				<CardHeader >
					<div style={{ marginLeft:20,marginTop:20, fontSize:25,fontWeight:'bold',color:"#3e4c59"}}>
						<text>New Attestation</text>
					</div>
				</CardHeader>
				<CardBody>
				<div className=" flex flex-col" style={{ margin:20, fontSize:13,color:"#7b8794"}}>
						<text style={{ fontWeight:'bold'}}>SCHEMA</text>
						<div className=" flex flex-col border rounded-md" style={{ marginTop:7}}>
						<text style={{ marginLeft:8,marginTop:8,color:'#19216c',fontWeight:'bold'}}>#15 SIGN DOCUMENT</text>
						<a href={"https://sepolia.easscan.org/schema/view/" + process.env.NEXT_PUBLIC_SCHEMA_UID} style={{color:'#30377b',marginLeft:8,marginBottom:8}}>{process.env.NEXT_PUBLIC_SCHEMA_UID}</a>
						</div>
						<text style={{ marginTop:15,fontWeight:'bold'}}>RECIPIENT</text>
						<text style={{fontSize:'8'}}>Optional address or ENS name of the recipient</text>
						<input
						className="border rounded-md"
						style={{
							height: 50,
							width: 607,
							marginTop:7,
							outline: "none",
							padding: '10px'
						}}
						type="recipient"
						name="recipient"
						value={recipient}
						onChange={e => setRecipient(e.target.value)}
						placeholder="  Ex. vitalik.eth or 0x0000000000000000000000000000000000000000"
						/>
						<text style={{ marginTop:15,fontWeight:'bold'}}>HASH OF DOCUMENT | bytes32</text>
						<input
						className="border rounded-md"
						style={{
							height: 50,
							width: 607,
							marginTop:7,
							outline: "none",
							padding: '10px'
						}}
						type="hash"
						name="hash"
						value={docHash}
						onChange={e => setdocHash(e.target.value)}
						placeholder="  Hash of Document"
						/>
						<text style={{ marginTop:15,fontWeight:'bold'}}>NOTE | string</text>
						<input
						className="border rounded-md"
						style={{
							height: 50,
							width: 607,
							marginTop:7,
							outline: "none",
							padding: '10px'
						}}
						type="note"
						name="note"
						value={note}
						onChange={e => setNote(e.target.value)}
						placeholder="  Note"
						/>
						<div className='aspect-square bg-gray-200 border rounded-md' style={{marginTop:20,width:607,height:210}}>
						<label htmlFor={picker}>
							<div className='relative w-full h-full rounded-md overflow-hidden flex items-center justify-center flex-col cursor-pointer gap-4'>
							<Image src='/upload.png' width={80} height={80} alt='' />
							<p className='text-base'>Drop a file here to get its hash</p>
							{file && (
								<Image
								// @ts-ignore
								src={URL.createObjectURL(file)}
								className='aspect-square rounded'
								fill
								style={{ objectFit: 'cover' }}
								alt=''
								/>
							)}
							</div>
						</label>
						<input
							type='file'
							name='file'
							className='hidden'
							id={picker}
							onChange={handleFileChange}
						/>
						</div>
						<div className='relative w-full h-full overflow-hidden flex items-center justify-center'>
							<button onClick={callOnChainAttestationFunction}
							className="rounded-full text-white font-bold" 
							style={{height:45,width:200,marginTop:25,background:'#4c63b6'}} >
							Make Attestation 
							</button>
						</div>
						
					</div>
				</CardBody>
				</Card>
			</div>
			{openModal && (
				<div
				className="fixed top-0 left-0 h-full w-full bg-[#00000033] flex items-center justify-center"
				style={{ backdropFilter: "blur(2px)" }}
				>
				<div className="w-full max-w-[320px] bg-white rounded-lg p-6">
					<p className="text-2xl font-semibold  text-center mt-5" style={{ color: "#0e1273" }}>
					Congratulations 🎉🎉
					</p>
					<p className="text-base text-center mt-1" style={{ color: "#0e1273" }}>
					OnChain Attestation Successfull sepolia on testnet chain
					</p>
					<a
					href={`${process.env.NEXT_PUBLIC_ATTESTATION_LINK!}${UID}`}
					rel="noopenner noreferrer"
					target="_blank"
					>
					<p className="text-base  mt-4 break-words text-[#0000EE]">
						{`${process.env.NEXT_PUBLIC_ATTESTATION_LINK!}${UID}`}
					</p>
					</a>
					<button
					onClick={handleCloseModal}
					className="w-full h-12 rounded-lg mt-5 text-white font-medium text-base bg-[#030a74]"
					>
					Continue
					</button>
				</div>
				{showConfetti && (
					<ReactConfetti
					className="z-20"
					onConfettiComplete={(confetti: any) => {
						confetti?.stop();
						setShowConfetti(false);
					}}
					/>
				)}
				</div>
			)}
    	</div>
	);
}
