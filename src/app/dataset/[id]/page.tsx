'use client'

import { ModelEntry } from "@/components/models/right"
import { AnchorProvider, Idl, Program } from "@project-serum/anchor";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react"
import { PublicKey } from '@solana/web3.js';
import idl from '@/lib/idl_d.json';
import { ArrowDownToLine, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatasetEntry } from "@/components/models/dataset";
import { AI } from "@/components/models/AI";

const programId = new PublicKey('C29N6MNh5XsaL94MuKd3jLeqVR3DugSyZYCqnPV6JjNf');

export default function page({params}:{params:{id:string}}) {
    const [dataset,setDataset] = useState<DatasetEntry>()
    const anchorWallet = useAnchorWallet();
    const { connection } = useConnection();
    const [loading,setLoading] = useState(false)
  const { connected, publicKey } = useWallet();
  const {id} = params

  useEffect(() => {
    if (connected && anchorWallet) {
     fetchDataset();
    }
  }, [connected, anchorWallet, publicKey,id]);
  const downloadFile = async (url: any, filename: any) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };
  const fetchDataset = async () => {

    if (!anchorWallet) return;
        setLoading(true)

    const provider = new AnchorProvider(connection, anchorWallet, {});
    const program = new Program(idl as Idl, programId, provider);

    try {
      const allEntries = await program.account.datasetEntryState.all();

      const formattedEntries = allEntries.map(entry => ({
        title: entry.account.title,
        message: entry.account.message,
        owner: entry.account.owner.toString(),
        ipfsHash: entry.account.ipfsHash,
      }));
      const detail = formattedEntries.find(dataset=>dataset.title.toLocaleLowerCase().replace(" ","_")==id)
      setDataset(detail);
      setLoading(false)
    } catch (error) {
        setLoading(false)
      console.error('Error fetching datasets:', error);
    }
  };
  if(dataset)
    return(
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold mb-4">{dataset.title}</h1>
            <div className="flex items-center mb-6">
              <User className="w-5 h-5 mr-2 text-gray-400" />
              <span className="text-gray-400">{dataset.owner}</span>
            </div>
            <p className="text-gray-300 mb-8">{dataset.message}</p>
            <Button className="w-full sm:w-auto flex items-center justify-center" onClick={()=>downloadFile(`https://gateway.pinata.cloud/ipfs/${dataset.ipfsHash}`,
                    `${dataset.title}.py`)}>
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Download Dataset
            </Button>
          </div>
          <div className="bg-gray-700 px-6 py-4">
              <AI/>
          </div>
        </div>
      </div>
    </div>
    )
    else return(
        <div>
            {loading ? "Loading" : "Not found"}
        </div>
    )
}