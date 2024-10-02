'use client';

import React, { useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import idl from '@/lib/idl_d.json';
import { getFile, upload } from '@/actions';
import { FileUpload } from '@/components/ui/file-uploader';

const programId = new PublicKey('C29N6MNh5XsaL94MuKd3jLeqVR3DugSyZYCqnPV6JjNf');

function CreateDatasetEntry() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [ipfsHash, setIpfsHash] = useState('');
  const [lastEntry, setLastEntry] = useState<null | { title: string; message: string; owner: string; ipfsHash: string }>(null);
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
      formData.append("type", "data");
      const { hash } = await upload(formData);
      getFile(hash,"data")
      alert(hash)
      setIpfsHash(hash);

      const [dataEntryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(title), wallet.publicKey.toBuffer()],
        programId
      );

      console.log(ipfsHash)

      const tx = await program.methods.createEntry(title, message, hash)
        .accounts({
          datasetEntry: dataEntryPda,
          owner: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log('Transaction signature', tx);
      alert('Dataset entry created successfully!');
      
      await logEntry(dataEntryPda, program);

      setTitle('');
      setMessage('');
      setFiles([]);
      setIpfsHash('');
    } catch (error) {
      console.error('Error creating dataset entry:', error);
      alert('Failed to create dataset entry');
    }
  };

  const logEntry = async (entryPda: PublicKey, program: Program<Idl>) => {
    try {
      const entryAccount = await program.account.datasetEntryState.fetch(entryPda);
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
    <div className="w-[80vw] mx-auto p-5 flex flex-col items-center">
      <h2 className="text-center text-2xl font-bold mb-6 text-white">Create Dataset Entry</h2>
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
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={20}
          className="w-full p-3 text-lg border border-gray-300 rounded-lg bg-white text-black min-h-[100px]"
        />
      </div>
      <FileUpload onChange={handleFileUpload} />
      <button
        onClick={createEntry}
        disabled={!wallet || files.length === 0}
        className={`w-[50%] p-3 text-lg font-semibold text-white rounded-lg 
        ${wallet && files.length > 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-green-500 opacity-50 cursor-not-allowed'}`}
      >
        Create Entry
      </button>
    </div>
  );
}

export default CreateDatasetEntry;