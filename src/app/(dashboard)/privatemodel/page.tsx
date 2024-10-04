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
import { Loader2 } from 'lucide-react';

const programId = new PublicKey('81BddUVGPz7cCtvEq9LBaEGDRdQiUnfPHRydGDqogvMG');

function PersonalModels() {
  interface Entry {
    title: string;
    message: string;
    owner: string;
    hash: string;
    ipfsHash: string;
  }

  const [entries, setEntries] = useState<Entry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected } = useWallet();

  useEffect(() => {
    if (connected && anchorWallet) {
      fetchPersonalModels();
    } else {
      setEntries([]);
      setIsLoading(false);
    }
  }, [connected, anchorWallet]);

  const fetchPersonalModels = async () => {
    if (!anchorWallet) return;
    setIsLoading(true);

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
      
      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error fetching personal models:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 w-[82.4vw] bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Personal Models</h1>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs bg-gray-800 text-white border-gray-700"
          />
          <Link href="/privatemodel/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-md">
              Create
            </Button>
          </Link>
      </div>
      </div>
      
      {!connected ? (
        <p className="text-gray-400 text-center">Please connect your wallet to view your personal models.</p>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : filteredEntries.length === 0 ? (
        <p className="text-gray-400 text-center">No personal models found. Create some models first!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.reverse().map((entry, index) => (
            <Link href={`/models/${entry.title}`} key={`${entry.title}-${index}`}>
              <Card className="bg-white dark:bg-gray-800 backdrop-blur-lg border border-white/20 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4 flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-600 rounded-md flex items-center justify-center text-white font-bold text-xl mr-4 flex-shrink-0">
                    {entry.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h2 className="text-lg font-semibold text-white truncate">{entry.title}</h2>
                    <h2 className="text-sm text-gray-300 truncate">{entry.message}</h2>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default PersonalModels;