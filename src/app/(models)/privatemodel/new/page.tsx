'use client';

import React, { useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import idl from '@/lib/idl.json';

const programId = new PublicKey('Hzgm1oJcrME6x3qw2nRKc7ogT7uz52ixdFhHQNPancyf');

function CreateModelEntry() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [lastEntry, setLastEntry] = useState<null | { title: string; message: string; owner: string }>(null);
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

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
        owner: entryAccount.owner.toString(),
      });
    } catch (error) {
      console.error('Error fetching entry:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Your Model</h2>
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={20}
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={20}
          style={{ width: '100%', padding: '10px', fontSize: '16px', minHeight: '100px' }}
        />
      </div>
      <button 
        onClick={createEntry} 
        disabled={!wallet}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          opacity: wallet ? 1 : 0.5
        }}
      >
        Create Entry
      </button>
    </div>
  );
}

export default CreateModelEntry;
