'use client';

import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import idl from '@/lib/idl.json';
import Link from 'next/link';
import Image from 'next/image';

const programId = new PublicKey('Hzgm1oJcrME6x3qw2nRKc7ogT7uz52ixdFhHQNPancyf');

function Models() {
  const [entries, setEntries] = useState<Array<{ title: string; message: string; owner: string }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    if (connected && anchorWallet) {
      fetchAllModels();
    } else {
      setEntries([]);  // Clear entries when wallet disconnects
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
    <div className="min-h-screen w-full overflow-y-auto flex flex-col pb-20">
      <div className='flex mb-10 gap-3 justify-end w-[99%]'>
        {/* <div className="search-container relative top-3">
          <input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}
      </div>
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mx-4 sm:mx-20 gap-10 content-start">
        {!connected ? (
          <p className="text-gray-400 col-span-full text-center">Please connect your wallet to view models.</p>
        ) : filteredEntries.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center">No models found. Create some models first!</p>
        ) : (
          filteredEntries.reverse().map((entry, index) => (
            <Link href={`/dashboard/${encodeURIComponent(entry.title)}`} key={index}>
              <div className="bg-[#0d0c0c] rounded-md shadow-md p-8 w-full flex flex-col items-center h-[250px]">
                <Image src={'/superteam.jpg'} height={110} width={110} alt='bg' className='rounded-md'/>
                <h3 className="text-xl font-medium text-white pt-3 text-center">{entry.title}</h3>
                <p className="text-gray-400 overflow-hidden text-center mt-2">{entry.message}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Models;
