'use client';

import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import idl from '@/lib/idl.json';
import Link from 'next/link';
import Image from 'next/image';
import { getFile } from '@/actions';
import { Button } from '../ui/button';

const programId = new PublicKey('81BddUVGPz7cCtvEq9LBaEGDRdQiUnfPHRydGDqogvMG');

function Models() {
  const [entries, setEntries] = useState<Array<{
    ipfsHash: any; title: string; message: string; owner: string 
}>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    if (connected && anchorWallet) {
      fetchAllModels().then(() => {
        entries.forEach((entry) => {
          if (entry.ipfsHash) {
            getFile(entry.ipfsHash).then((data) => {
              console.log(data);
            });
          }
        });
      });
    }
  }, [connected, anchorWallet,publicKey]);

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
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const fetchAllModels = async () => {
    if (!anchorWallet) return;

    const provider = new AnchorProvider(connection, anchorWallet, {});
    const program = new Program(idl as Idl, programId, provider);

    try {
      const allEntries = await program.account.modelEntryState.all();
      console.log(allEntries);

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
    <div className="min-h-screen flex flex-col pb-15">
      <div className='flex mb-10 gap-3 justify-end w-[98%]'>
        <div className="search-container relative top-3">
          <input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 ml-10 sm:ml-[25%] gap-5 content-start w-[60vw]">
        {!connected ? (
          <p className="text-gray-400 col-span-full text-center">Please connect your wallet to view models.</p>
        ) : filteredEntries.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center">No models found. Create some models first!</p>
        ) : (
          filteredEntries.reverse().map((entry, index) => (
              <div className="bg-[#0d0c0c] rounded-md shadow-md p-2 px-5 w-full flex flex-col h-[65px]">
                <div className='flex gap-3'>
                <h3 className="text-xl font-medium text-white">{entry.title}</h3>
                </div>
                <div>
                <p className="text-gray-400 font-light text-sm overflow-hidden ">{entry.message}</p>
                </div>
                <div>
                <Link href={`/dashboard/${encodeURIComponent(entry.title)}`}>
                  <Button>
                    View
                  </Button>
                  </Link>
                  <Button
                  onClick={() => downloadFile(
                    `https://gateway.pinata.cloud/ipfs/${entry.ipfsHash}`,
                    `${entry.title}.py`
                  )}
                >
                  Download
                  </Button>
                </div>
              </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Models;
