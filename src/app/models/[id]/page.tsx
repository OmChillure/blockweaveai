"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import idl from '@/lib/idl.json';
import { Button } from '@/components/ui/button';
import { DownloadIcon, MessageCircleIcon } from 'lucide-react';

const programId = new PublicKey('81BddUVGPz7cCtvEq9LBaEGDRdQiUnfPHRydGDqogvMG');

interface ModelEntry {
  title: string;
  message: string;
  owner: string;
  ipfsHash: string;
}

export default function ModelDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [model, setModel] = useState<ModelEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected } = useWallet();

  useEffect(() => {
    if (connected && anchorWallet && id) {
      fetchModel();
    }
  }, [connected, anchorWallet, id]);

  const fetchModel = async () => {
    if (!anchorWallet) return;
    setLoading(true);

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

      const decodedId = decodeURIComponent(id).replace(/_/g, ' ');
      const detail = formattedEntries.find(model => 
        model.title.toLowerCase() === decodedId.toLowerCase()
      );

      if (detail) {
        setModel(detail);
      } else {
        console.error('Model not found');
      }
    } catch (error) {
      console.error('Error fetching model:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadModel = async () => {
    if (model?.ipfsHash) {
      const url = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_M}/ipfs/${model.ipfsHash}`;
      const filename = `${model.title}.py`;
      
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
    } else {
      alert("No IPFS hash available.");
    }
  };

  if (!connected) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
        <p className="text-white text-xl">Please connect your wallet to view this model.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
        <p className="text-white text-xl">Model not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{model.title}</h1>
        
        <p className="text-lg mb-6">{model.message}</p>
        
        <div className="mb-6">
          <p><span className="font-semibold">Owner:</span> {model.owner}</p>
          <p><span className="font-semibold">IPFS Hash:</span> {model.ipfsHash}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={downloadModel} className="flex-1 bg-purple-600 hover:bg-purple-700 transition-colors duration-200">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download Model
          </Button>
          <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200">
            <MessageCircleIcon className="mr-2 h-4 w-4" />
            Chat with AI
          </Button>
        </div>
      </div>
    </div>
  );
}