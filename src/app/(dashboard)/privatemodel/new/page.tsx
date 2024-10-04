'use client';

import React, { useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import idl from '@/lib/idl.json';
import { upload } from '@/actions';
import { FileUpload } from '@/components/file-uploader';

const programId = new PublicKey('81BddUVGPz7cCtvEq9LBaEGDRdQiUnfPHRydGDqogvMG');

function CreateModelEntry() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [lastEntry, setLastEntry] = useState<null | { title: string; message: string; owner: string; ipfsHash: string }>(null);
  const [ipfsHash, setIpfsHash] = useState('');
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

    if (files.length === 0) {
      alert('Please select a file to upload');
      return;
    }

    const provider = new AnchorProvider(connection, wallet, {});
    const program = new Program(idl as Idl, programId, provider);

    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("userId", wallet.publicKey.toString());
      formData.append("type", "model");
      const { hash } = await upload(formData);
      alert(hash)
      setIpfsHash(hash);
      const [modelEntryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(title), wallet.publicKey.toBuffer()],
        programId
      );

      console.log(ipfsHash)

      const tx = await program.methods.createEntry(title, message, hash)
        .accounts({
          modelEntry: modelEntryPda,
          owner: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log('Transaction signature', tx);
      alert('Model entry created successfully!');
      
      await logEntry(modelEntryPda, program);

      setTitle('');
      setMessage('');
      setFiles([]);
      setIpfsHash('');
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
        owner: entryAccount.owner.toString(),
        ipfsHash: entryAccount.ipfsHash,
      });
    } catch (error) {
      console.error('Error fetching entry:', error);
    }
  };

  return (
    <div className="w-screen md:w-[82.4vw] mx-auto p-8 flex flex-col items-center bg-gradient-to-br from-black via-gray-900 to-purple-900 shadow-xl">
      <h2 className="text-center text-3xl font-extrabold mb-6 text-white">Upload Your Model</h2>
      <div className="w-full mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={20}
          className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="w-full mb-6">
        <textarea
          placeholder="Add model hashtags"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={20}
          className="w-full p-4 text-lg border border-gray-600 rounded-lg bg-gray-800 text-white min-h-[120px] focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <FileUpload onChange={handleFileUpload} />
      <button
        onClick={createEntry}
        disabled={!wallet || files.length === 0}
        className={`w-full p-4 text-lg font-semibold text-white rounded-lg mt-6 
        ${wallet && files.length > 0 ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 opacity-50 cursor-not-allowed'}`}
      >
        Create Entry
      </button>
    </div>
  );
}

export default CreateModelEntry;
