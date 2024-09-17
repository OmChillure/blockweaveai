"use server"

import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.PINATA_GATEWAY,
});

export const upload = async (data: FormData) => {
  try {
    const uploadResult = await pinata.upload.file(data.get("file") as File);
    console.log(uploadResult)
    return { hash: uploadResult.IpfsHash };
  } catch (error) {
    console.error("File upload error:", error);
    throw new Error('File upload failed');
  }
};

export const getFile = async (hash: string) => {
  try {
    const data = await pinata.gateways.get(hash);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
