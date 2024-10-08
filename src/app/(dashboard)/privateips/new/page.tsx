"use client"
import React, { useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl, web3, BN } from '@project-serum/anchor';
import idl from '@/lib/idlfs.json';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

const programId = new PublicKey('6rari3pcVRKnmUncWhEkJmahkphzR2q4ccVMbEDmg5eQ');

export default function AddProxyPage() {
  const [newEntry, setNewEntry] = useState({
    ip: '',
    protocols: '',
    country: '',
    port: '',
    price: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const router = useRouter();

  const handleCreate = async () => {
    if (!anchorWallet) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to add a new proxy.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const provider = new AnchorProvider(connection, anchorWallet, {});
      const program = new Program(idl as Idl, programId, provider);

      const priceNumber = parseFloat(newEntry.price);
      
      if (isNaN(priceNumber)) {
        throw new Error("Price must be a valid number");
      }

      const priceLamports = new BN(priceNumber * web3.LAMPORTS_PER_SOL);

      const [proxyEntryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(newEntry.ip), anchorWallet.publicKey.toBuffer()],
        program.programId
      );

      await program.methods.createProxy(
        newEntry.ip,
        newEntry.protocols,
        newEntry.country,
        newEntry.port,
        priceLamports
      )
      .accounts({
        proxyEntry: proxyEntryPda,
        owner: anchorWallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

      toast({
        title: "Success",
        description: "New proxy added successfully!",
      });

      setNewEntry({ ip: '', protocols: '', country: '', port: '', price: '' });
      router.push('/ips'); 
    } catch (error) {
      console.error("Error creating proxy:", error);
      toast({
        title: "Error",
        description: `Failed to add proxy: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[98.9vw] min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Proxy</h1>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="ip" className="block text-sm font-medium mb-2">IP Address</label>
            <Input
              id="ip"
              placeholder="Enter IP address"
              value={newEntry.ip}
              onChange={(e) => setNewEntry({...newEntry, ip: e.target.value})}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="protocols" className="block text-sm font-medium mb-2">Protocols</label>
            <Input
              id="protocols"
              placeholder="Enter protocols"
              value={newEntry.protocols}
              onChange={(e) => setNewEntry({...newEntry, protocols: e.target.value})}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-2">Country</label>
            <Input
              id="country"
              placeholder="Enter country"
              value={newEntry.country}
              onChange={(e) => setNewEntry({...newEntry, country: e.target.value})}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="port" className="block text-sm font-medium mb-2">Port</label>
            <Input
              id="port"
              placeholder="Enter port"
              value={newEntry.port}
              onChange={(e) => setNewEntry({...newEntry, port: e.target.value})}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-2">Price (SOL)</label>
            <Input
              id="price"
              type="number"
              step="0.000000001"
              placeholder="Enter price in SOL"
              value={newEntry.price}
              onChange={(e) => setNewEntry({...newEntry, price: e.target.value})}
              className="w-full"
            />
          </div>
          
          <div className="flex justify-between">
            <Button 
              onClick={() => router.push('/')} 
              variant="outline"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Proxy"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}