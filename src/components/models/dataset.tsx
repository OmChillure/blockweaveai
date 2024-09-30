'use client';

import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import idl from '@/lib/idl_d.json';
import Link from 'next/link';
import { getFile } from '@/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Download, Eye } from 'lucide-react';

const programId = new PublicKey('C29N6MNh5XsaL94MuKd3jLeqVR3DugSyZYCqnPV6JjNf');

export interface DatasetEntry {
  title: string;
  message: string;
  owner: string;
  ipfsHash: string;
}
function PersonalDatasets() {
  
  
  const [entries, setEntries] = useState<DatasetEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected } = useWallet();

  useEffect(() => {
    if (connected && anchorWallet) {
      fetchAllDatasets();
    }
  }, [connected, anchorWallet]);

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

  const fetchAllDatasets = async () => {
    if (!anchorWallet) return;

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

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error fetching personal datasets:', error);
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Personal Datasets</h1>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search datasets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          {/* Uncomment when create dataset functionality is ready
          <Link href="/privatedataset/new">
            <Button>Create Dataset</Button>
          </Link>
          */}
        </div>
      </div>
      
      {!connected ? (
        <p className="text-gray-400 text-center">Please connect your wallet to view your personal datasets.</p>
      ) : filteredEntries.length === 0 ? (
        <p className="text-gray-400 text-center">No datasets found. Create some datasets first!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.reverse().map((entry, index) => (
            <Card key={index} className="bg-gray-800 text-white">
              <CardHeader>
                <CardTitle>{entry.title}</CardTitle>
                <CardDescription className="text-gray-400">{entry.message}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Link href={`/dataset/${entry.title}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(
                    `https://gateway.pinata.cloud/ipfs/${entry.ipfsHash}`,
                    `${entry.title}.pdf`
                  )}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default PersonalDatasets;