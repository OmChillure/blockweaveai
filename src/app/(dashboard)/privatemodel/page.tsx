'use client';

import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import idl from '@/lib/idl.json';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const programId = new PublicKey('81BddUVGPz7cCtvEq9LBaEGDRdQiUnfPHRydGDqogvMG');

function PersonalModels() {
  const [entries, setEntries] = useState<Array<{
    ipfsHash: any;
    hash: string; 
    title: string; 
    message: string; 
    owner: string
  }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected } = useWallet();

  useEffect(() => {
    if (connected && anchorWallet) {
      fetchPersonalModells();
    } else {
      setEntries([]);
    }
  }, [connected, anchorWallet]);

  const fetchPersonalModells = async () => {
    if (!anchorWallet) return;

    const provider = new AnchorProvider(connection, anchorWallet, {});
    const program = new Program(idl as Idl, programId, provider);

    try {
      const allEntries = await program.account.modelEntryState.all([
        {
          memcmp: {
            offset: 8,
            bytes: anchorWallet.publicKey.toBase58(),
          },
        },
      ]);

      const formattedEntries = allEntries.map(entry => ({
        title: entry.account.title,
        message: entry.account.message,
        owner: entry.account.owner.toString(),
        hash: entry.account.hash,
        ipfsHash: entry.account.ipfsHash,
      }));
      
      console.log(formattedEntries);
      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error fetching personal Modells:', error);
    }
  };
  
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

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 w-[83vw]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Personal Models</h1>
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Link href="/privatemodel/new">
            <Button className="bg-blue-500 hover:bg-blue-600">
              Create Model
            </Button>
          </Link>
        </div>
      </div>
      
      {!connected ? (
        <p className="text-gray-400 text-center">Please connect your wallet to view your personal models.</p>
      ) : filteredEntries.length === 0 ? (
        <p className="text-gray-400 text-center">No personal models found. Create some models first!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.reverse().map((entry, index) => (
            <Card key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-600 rounded-md flex items-center justify-center text-white font-bold text-xl mr-4 flex-shrink-0">
                    {entry.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{entry.title}</h2>
                    <h2 className="text-sm text-gray-500 dark:text-gray-400 truncate">{entry.message}</h2>
                  </div>
                </div>
                {/* <div className="flex gap-2">
                  <Link href={`/dashboard/${encodeURIComponent(entry.title)}`}>
                    <Button className="w-full">View</Button>
                  </Link>
                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      downloadFile(
                        `https://gateway.pinata.cloud/ipfs/${entry.ipfsHash}`,
                        `${entry.title}.py`
                      );
                    }}
                  >
                    Download
                  </Button>
                </div> */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default PersonalModels;