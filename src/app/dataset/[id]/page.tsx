"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import idl from '@/lib/idl_d.json';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadIcon, MessageCircleIcon } from 'lucide-react';

const programId = new PublicKey('C29N6MNh5XsaL94MuKd3jLeqVR3DugSyZYCqnPV6JjNf');

interface DatasetEntry {
  title: string;
  message: string;
  owner: string;
  ipfsHash: string;
}

export default function DatasetDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [datasets, setDatasets] = useState<DatasetEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected } = useWallet();

  useEffect(() => {
    if (connected && anchorWallet && id) {
        fetchDataset();
    }
  }, [connected, anchorWallet, id]);

  const fetchDataset = async () => {
    if (!anchorWallet) return;
    setLoading(true);

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

      const decodedId = decodeURIComponent(id).replace(/_/g, ' ');
      const detail = formattedEntries.find(dataset => 
        dataset.title.toLowerCase() === decodedId.toLowerCase()
      );

      if (detail) {
        setDatasets(detail);
      } else {
        console.error('Model not found');
      }
    } catch (error) {
      console.error('Error fetching datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadDataset = async () => {
    if (datasets?.ipfsHash) {
      const url = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_D}/ipfs/${datasets.ipfsHash}`;
      const filename = `${datasets.title}.py`;
      
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
    return <div className="text-center mt-8">Please connect your wallet to view this dataset.</div>;
  }

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (!datasets) {
    return <div className="text-center mt-8">Dataset not found.</div>;
  }

  return (
    <div className="w-screen h-screen mx-auto px-4 py-8 bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <Card className="rounded-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{datasets.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{datasets.message}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Owner: {datasets.owner}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">IPFS Hash: {datasets.ipfsHash}</p>
          <div className="flex space-x-4">
            <Button onClick={downloadDataset} className="flex items-center">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download Datasets
            </Button>
            <Button className="flex items-center">
              <MessageCircleIcon className="mr-2 h-4 w-4" />
              Chat with AI
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}