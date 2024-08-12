import accessAttestation from "../scripts/accessAttestation";
import Image from "next/image";
import { useId,useState,useEffect } from "react";
// @ts-ignore
import { Card, CardHeader,CardBody} from "@nextui-org/react";
import { File } from 'buffer';
const { createHash } = require('crypto');

export default function VerifyDoc() {
	const [file, setFile] = useState<File | null>(null);
	const [UID, setUID] = useState('');
	const [docHash, setdocHash] = useState('');
	const [note, setNote] = useState('');
	const [showDocStatus, setShowDocStatus] = useState<string>("null");
	let [color,setTextColor] = useState ('red'); 
	const picker = useId();

	function toggle(status:string){
		setShowDocStatus(status);
		if(status == "true")
		{
			setTextColor('green');
		}
		else{
			setTextColor('red');
		}
	}

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const fileData = event.target.files?.[0];
		if (fileData) {
		  var reader = new FileReader();
		  reader.onloadend = async function() {
			console.log("file: ",fileData);
			// @ts-ignore
			var array = new Uint8Array(this.result);
			console.log("File Converted into Buffer: ",array);
			let hash = createHash('sha256').update(array).digest('hex');
			hash='0x'+hash;
			console.log("Doc Hash to verify: ",hash);
			if(hash == docHash)
			{
				console.log("Document Verified Successfully.");
				toggle("true");
			}
			else{
				console.log("Document not verified.");
				toggle("false");
			}
		  };
		  reader.readAsArrayBuffer(fileData);
		}
	};
	useEffect(() => {
		if (localStorage?.getItem("UID")){
		  let UID = localStorage.getItem("UID") as any;
		  setUID(UID);
		  console.log("Attestation UID: ",UID);
		  accessAttestation(UID)
		  .then((attestatoinData) => {
			console.log("Attestation Document Hash: ",attestatoinData![0].value.value);
			console.log("Attestation Note: ",attestatoinData![1].value.value);
			// @ts-ignore
			setdocHash(attestatoinData![0].value.value);
			// @ts-ignore
			setNote(attestatoinData![1].value.value);
		  })
		  .catch(() => {
			console.log('Error occured when fetching attestation...');
		  });
		}
	}, []);

	return (
		<div>
			<div className="flex flex-col  items-center" style={{ margin: 50}}>
				<Card className="border rounded-md" style={{ width: 650, borderRadius: 10 }}>
				<CardHeader >
					<div style={{ marginLeft:20,marginTop:20, fontSize:25,fontWeight:'bold',color:"#000000"}}>
						<text>OnChain Attestation</text>
					</div>
				</CardHeader>
				<CardBody>
				<div className=" flex flex-col" style={{ marginLeft:20,marginRight:20, marginBottom:20,marginTop:10, fontSize:13}}>
						<text style={{marginTop:7,fontWeight:'bold',color:"#7b8794"}}>UID:</text>
						<text style={{ color:"#000000",fontWeight:'bold'}}>{UID}</text>
						<text style={{  marginTop:7,fontWeight:'bold',color:"#7b8794"}}>SCHEMA:</text>
						<div className=" flex flex-col border rounded-md" style={{ marginTop:7}}>
						<text style={{ marginLeft:8,marginTop:8,color:'#19216c',fontWeight:'bold'}}>#15 SIGN DOCUMENT</text>
						<a href={"https://sepolia.easscan.org/schema/view/" + process.env.NEXT_PUBLIC_SCHEMA_UID} style={{color:'#30377b',marginLeft:8,marginBottom:8}}>{process.env.NEXT_PUBLIC_SCHEMA_UID}</a>
						</div>
						<text style={{ fontWeight:'bold',marginTop:7,color:"#7b8794"}}>DECODED DATA:</text>
						<div className=" flex flex-col border rounded-md" style={{ marginTop:7}}>
						<text style={{ marginLeft:8,marginTop:8,color:'#19216c',fontWeight:'bold'}}>Hash of Document | BYTES32</text>
						<text style={{ marginLeft:8,marginBottom:8,color:"#7b8794"}} >{docHash}</text>
						</div>
						<div className=" flex flex-col border rounded-md" style={{ marginTop:7}}>
						<text style={{ marginLeft:8,marginTop:8,color:'#19216c',fontWeight:'bold'}}>Note | STRING</text>
						<text style={{ marginLeft:8,marginBottom:8,color:"#7b8794"}} >{note}</text>
						</div>
						<div className='aspect-square bg-gray-200 border rounded-md' style={{marginTop:20,width:607,height:210}}>
						<label htmlFor={picker}>
							<div className='relative w-full h-full rounded-md overflow-hidden flex items-center justify-center flex-col cursor-pointer gap-4'>
							<Image src='/upload.png' width={80} height={80} alt='' />
							<p className='text-base'>Drop a file here to verify its hash</p>
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
						<div className="flex flex-row items-center justify-center" style={{ marginTop:7,fontSize:15}}>
						<text style={{ marginLeft:8,marginTop:8,color:"#7b8794",fontWeight:'bold'}}>Verification Status:</text>
						<text style={{ marginLeft:8,marginTop:8,color:color,fontWeight:'bold'}}>{showDocStatus}</text>
						</div>
					</div>
				</CardBody>
				</Card>
			</div>
    	</div>
	);
}
