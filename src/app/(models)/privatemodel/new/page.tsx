'use client';

import React, { useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import idl from '@/lib/idl.json';
import { upload } from '@/actions';
import { FileUpload } from '@/components/ui/file-uploader';
import { hash } from 'crypto';

const programId = new PublicKey('Hzgm1oJcrME6x3qw2nRKc7ogT7uz52ixdFhHQNPancyf');

function CreateModelEntry() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [lastEntry, setLastEntry] = useState<null | { title: string; message: string; hash:string, owner: string }>(null);
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const handleFileUpload = async (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  const createEntry = async () => {
    if (!wallet) {
      alert('Please connect your wallet');
      return;
    }

    const provider = new AnchorProvider(connection, wallet, {});
    const program = new Program(idl as Idl, programId, provider);

    try {
      const [modelEntryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(title), wallet.publicKey.toBuffer()],
        programId
      );

      const tx = await program.methods.createEntry(title, message)
        .accounts({
          modelEntry: modelEntryPda,
          owner: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

        console.log('Transaction signature', tx);
        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("userId", "abc");
        await upload(formData);
        alert('Model entry created successfully!');
        
      await logEntry(modelEntryPda, program);

      setTitle('');
      setMessage('');
    } catch (error) {
      console.error('Error creating model entry:', error);
      alert('Failed to create model entry');
    }
  };

  const logEntry = async (entryPda: PublicKey, program: Program<Idl>) => {
    try {
      const entryAccount = await program.account.modelEntryState.fetch(entryPda);
      console.log('Fetched entry:', entryAccount);
      setLastEntry({
        title: entryAccount.title,
        message: entryAccount.message,
        hash: entryAccount.hash,
        owner: entryAccount.owner.toString(),
      });
    } catch (error) {
      console.error('Error fetching entry:', error);
    }
  };

  return (
    <div className="w-[80vw] mx-auto p-5 flex flex-col items-center">
      <h2 className="text-center text-2xl font-bold mb-6 text-white">Upload Your Model</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={20}
          className="w-full p-3 text-lg border border-gray-300 rounded-lg bg-white text-black"
        />
      </div>
      <div className="mb-4">
        <textarea
          placeholder="Add model hashtags"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={20}
          className="w-full p-3 text-lg border border-gray-300 rounded-lg bg-white text-black min-h-[100px]"
        />
      </div>
      <FileUpload onChange={handleFileUpload} />
      <button
        onClick={createEntry}
        disabled={!wallet}
        className={`w-[50%] p-3 text-lg font-semibold text-white rounded-lg 
        ${wallet ? 'bg-green-500 hover:bg-green-600' : 'bg-green-500 opacity-50 cursor-not-allowed'}`}
      >
        Create Entry
      </button>
    </div>
  );
}

export default CreateModelEntry;
