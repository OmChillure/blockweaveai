'use client';

import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import idl from '@/lib/idl.json';
import Link from 'next/link';
import Image from 'next/image';
import Left from '@/components/models/left-wrapper';
import { hash } from 'crypto';

const programId = new PublicKey('Hzgm1oJcrME6x3qw2nRKc7ogT7uz52ixdFhHQNPancyf');

function PersonalModels() {
  const [entries, setEntries] = useState<Array<{
    hash: string; title: string; message: string; owner: string 
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
        hash: entry.account.hash,
        owner: entry.account.owner.toString(),
      }));

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error fetching personal Modells:', error);
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='flex min-h-[90vh] w-full col-span-10'>
    <div className="h-full w-full  overflow-y-auto flex flex-col pb-20">
      <div className='flex mb-10 gap-3 justify-end w-[99%]'>
        <div className="search-container relative top-3">
          <input
            type="text"
            placeholder="Search personal Modells..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Link href="/privatemodel/new">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md relative top-3">
            Create Model
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 ml-10 sm:ml-[25%] gap-5 content-start w-[60vw]">
        {!connected ? (
          <p className="text-gray-400 col-span-full text-center">Please connect your wallet to view your personal Modells.</p>
        ) : filteredEntries.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center">No personal Modells found. Create some Modells first!</p>
        ) : (
          filteredEntries.reverse().map((entry, index) => (
            <Link href={`/dashboard/modell/${encodeURIComponent(entry.title)}`} key={index}>
              <div className="bg-[#0d0c0c] rounded-md shadow-md p-2 px-5 w-full flex flex-col h-[65px]">
              <div className='flex gap-3'>
                <Image src="/ai.png" width={20} height={20} alt={''} className='py-1' />
                <h3 className="text-xl font-medium text-white">{entry.title}</h3>
                </div>
                <p className="text-gray-400 font-light overflow-hidden">{entry.message}</p>
                <p className="text-gray-400 font-light overflow-hidden">{entry.hash}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
    </div>
  );
}

export default PersonalModels;
