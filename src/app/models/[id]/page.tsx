'use client'

import { ModelEntry } from "@/components/models/right"
import { AnchorProvider, Idl, Program } from "@project-serum/anchor";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react"
import { PublicKey } from '@solana/web3.js';
import idl from '@/lib/idl.json';
import { ArrowDownToLine, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Details from "@/components/details-page";

const programId = new PublicKey('81BddUVGPz7cCtvEq9LBaEGDRdQiUnfPHRydGDqogvMG');

export default function page({params}:{params:{id:string}}) {
    const [model,setModel] = useState<ModelEntry>()
    const anchorWallet = useAnchorWallet();
    const { connection } = useConnection();
    const [loading,setLoading] = useState(false)
  const { connected, publicKey } = useWallet();
  const {id} = params

  useEffect(() => {
    if (connected && anchorWallet) {
     fetchModel();
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
  const fetchModel = async () => {

    if (!anchorWallet) return;
        setLoading(true)

    const provider = new AnchorProvider(connection, anchorWallet, {});
    const program = new Program(idl as Idl, programId, provider);

    try {
      const allEntries = await program.account.modelEntryState.all();

      const formattedEntries = allEntries.map(entry => ({
        title: entry.account.title,
        message: entry.account.message,
        owner: entry.account.owner.toString(),
        ipfsHash: entry.account.ipfsHash,
      }));
      const detail = formattedEntries.find(model=>model.title.toLocaleLowerCase().replace(" ","_")==id)
      setModel(detail);
      setLoading(false)
    } catch (error) {
        setLoading(false)
      console.error('Error fetching models:', error);
    }
  };
  if(model)
    return(
    <Details dataset={model} />
    )
    else return(
        <div>
            {loading ? "Loading" : "Not found"}
        </div>
    )
}