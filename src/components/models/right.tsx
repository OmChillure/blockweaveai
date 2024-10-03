"use client"
import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import idl from '@/lib/idl.json';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const programId = new PublicKey('81BddUVGPz7cCtvEq9LBaEGDRdQiUnfPHRydGDqogvMG');
export interface ModelEntry {
  title: string;
  message: string;
  owner: string;
  ipfsHash: string;
}

function Models() {
  const [entries, setEntries] = useState<ModelEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    if (connected && anchorWallet) {
      fetchAllModels();
    }
  }, [connected, anchorWallet, publicKey]);

  const fetchAllModels = async () => {
    if (!anchorWallet) return;

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

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 w-[95%] from-black via-gray-900 to-purple-900">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Models</h1>
        <Input
          type="text"
          placeholder="Search models..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>
      
      {!connected ? (
        <p className="text-gray-400 text-center">Please connect your wallet to view models.</p>
      ) : filteredEntries.length === 0 ? (
        <p className="text-gray-400 text-center">No models found. Create some models first!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.reverse().map((entry, index) => (
          <Link key={entry.ipfsHash} href={`/models/${entry.title}`}>
            <Card key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-600 rounded-md flex items-center justify-center text-white font-bold text-xl mr-4 flex-shrink-0">
                  {entry.title.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{entry.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{entry.message}</p>
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

export default Models;