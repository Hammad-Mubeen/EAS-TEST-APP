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
	const picker = useId();

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
			console.log("Attestation UID: ",UID);
			var attestatoinData = await accessAttestation(UID);
			console.log("Attestatoion Data: ",attestatoinData);
		  };
		  reader.readAsArrayBuffer(fileData);
		}
	};
	useEffect(() => {
		if (localStorage?.getItem("UID")){
		  setUID(localStorage.getItem("UID") as any);
		}
	}, []);
	return (
		<div>
			<div className="flex flex-col  items-center" style={{ margin: 50}}>
				<Card className="border rounded-md" style={{ width: 650, borderRadius: 10 }}>
				<CardHeader >
					<div style={{ marginLeft:20,marginTop:20, fontSize:25,fontWeight:'bold',color:"#3e4c59"}}>
						<text>OnChain Attestation</text>
					</div>
				</CardHeader>
				<CardBody>
				<div className=" flex flex-col" style={{ margin:20, fontSize:13,color:"#7b8794"}}>
						<text style={{ fontWeight:'bold'}}>SCHEMA</text>
						<div className=" flex flex-col border rounded-md" style={{ marginTop:7}}>
						<text style={{ marginLeft:8,marginTop:8,color:'#19216c',fontWeight:'bold'}}>#15 SIGN DOCUMENT</text>
						<a href={"https://sepolia.easscan.org/schema/view/" + process.env.NEXT_PUBLIC_SCHEMA_UID} style={{color:'#30377b',marginLeft:8,marginBottom:8}}>{process.env.NEXT_PUBLIC_SCHEMA_UID}</a>
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
					</div>
				</CardBody>
				</Card>
			</div>
    	</div>
	);
}
