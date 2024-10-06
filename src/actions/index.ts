"use server"

import { PinataSDK } from "pinata-web3";
import axios from "axios";
const pinata_m = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT_M!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY_M!,
});
const pinata_d = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT_D!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY_D!,
});
export const upload = async (data: FormData) => {
  try {
    if (data.get('type')=="data") {
      const uploadResult = await pinata_d.upload.file(data.get("file") as File);
      console.log(uploadResult.IpfsHash)
      const res = await axios.post("https://solface-fastapi.onrender.com/upload", {id:uploadResult.IpfsHash,url:"https://"+process.env.NEXT_PUBLIC_PINATA_GATEWAY_D+"/ipfs/"+uploadResult.IpfsHash})
      console.log(res)
      return { hash: uploadResult.IpfsHash };
    }else{
      const uploadResult = await pinata_m.upload.file(data.get("file") as File);
      console.log(uploadResult)
      return { hash: uploadResult.IpfsHash };
    }
    
  } catch (error) {
    console.error("File upload error:", error);
    throw new Error('File upload failed');
  }
};

export const getFile = async (hash: string,type:string) => {
  try {
    if(type=="data"){
      const data = await pinata_d.gateways.get(hash);
      console.log(data);
    }
    const data = await pinata_m.gateways.get(hash);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
