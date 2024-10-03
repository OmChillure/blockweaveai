"use client"
import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import idl from '@/lib/idl_d.json';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';

const programId = new PublicKey('C29N6MNh5XsaL94MuKd3jLeqVR3DugSyZYCqnPV6JjNf');

export interface DatasetEntry {
  title: string;
  message: string;
  owner: string;
  ipfsHash: string;
}

export default function PersonalDatasets() {
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

  const downloadFile = async (url: string, filename: string) => {
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
    <div className="container mx-auto px-4 py-3 w-[95%] from-black via-gray-900 to-purple-900">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Datasets</h1>
        <Input
          type="text"
          placeholder="Search datasets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>
      
      {!connected ? (
        <p className="text-gray-400 text-center">Please connect your wallet to view your personal datasets.</p>
      ) : filteredEntries.length === 0 ? (
        <p className="text-gray-400 text-center">No datasets found. Create some datasets first!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.reverse().map((entry, index) => (
          <Link href={`/dataset/${entry.title}`}>
            <Card key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-600 rounded-md flex items-center justify-center text-white font-bold text-xl mr-4 flex-shrink-0">
                  {entry.title.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{entry.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{entry.message}</p>
                  {/* <div className="mt-2 flex space-x-2">
                    <Link href={`/dataset/${entry.title}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => downloadFile(
                        `https://gateway.pinata.cloud/ipfs/${entry.ipfsHash}`,
                        `${entry.title}.pdf`
                      )}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div> */}
                </div>
              </CardContent>
            </Card>
          </ Link>
          ))}
        </div>
      )}
    </div>
  );
}