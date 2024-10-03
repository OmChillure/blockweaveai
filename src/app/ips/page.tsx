"use client"

import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl, web3, BN } from '@project-serum/anchor';
import idl from '@/lib/idl_ip.json';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash, Plus, Save, X, Copy, Check } from 'lucide-react';
import Header from '@/components/models/header';

const programId = new PublicKey('BiQLNadXADtdXfV1Uk2YEUUFUgHLqEC7V8YnhonPoog6');

export default function ProxyEntries() {
  interface ProxyEntry {
    id: string;
    ip: string;
    protocols: string;
    country: string;
    port: string;
    updated: number;
  }

  const [entries, setEntries] = useState<ProxyEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newEntry, setNewEntry] = useState({ id: '', ip: '', protocols: '', country: '', port: '' });
  const [editingEntry, setEditingEntry] = useState<ProxyEntry | null>(null);
  const [copiedField, setCopiedField] = useState<{ id: string, field: string } | null>(null);
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected } = useWallet();

  useEffect(() => {
    if (connected && anchorWallet) {
      fetchAllProxies();
    }
  }, [connected, anchorWallet]);

  const fetchAllProxies = async () => {
    if (!anchorWallet) return;

    const provider = new AnchorProvider(connection, anchorWallet, {});
    const program = new Program(idl as Idl, programId, provider);

    try {
      const allEntries = await program.account.proxyEntryState.all();

      const formattedEntries = allEntries.map(entry => ({
        id: entry.account.id.toString(),
        ip: entry.account.ip,
        protocols: entry.account.protocols,
        country: entry.account.country,
        port: entry.account.port,
        updated: entry.account.updated.toNumber(),
      }));

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error fetching proxies:', error);
    }
  };

  const handleCreate = async () => {
    if (!anchorWallet) return;

    const provider = new AnchorProvider(connection, anchorWallet, {});
    const program = new Program(idl as Idl, programId, provider);

    try {
      const idNumber = parseInt(newEntry.id);
      if (isNaN(idNumber)) {
        throw new Error("ID must be a valid number");
      }

      const [proxyEntryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(new BN(idNumber).toArray('le', 8)), anchorWallet.publicKey.toBuffer()],
        program.programId
      );

      await program.methods.createProxy(
        new BN(idNumber),
        newEntry.ip,
        newEntry.protocols,
        newEntry.country,
        newEntry.port
      )
      .accounts({
        proxyEntry: proxyEntryPda,
        owner: anchorWallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

      fetchAllProxies();
      setNewEntry({ id: '', ip: '', protocols: '', country: '', port: '' });
    } catch (error) {
      console.error("Error creating proxy:", error);
    }
  };

  const handleUpdate = async (entry: ProxyEntry) => {
    if (!anchorWallet) return;

    const provider = new AnchorProvider(connection, anchorWallet, {});
    const program = new Program(idl as Idl, programId, provider);

    try {
      const idNumber = parseInt(entry.id);
      if (isNaN(idNumber)) {
        throw new Error("ID must be a valid number");
      }

      const [proxyEntryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(new BN(idNumber).toArray('le', 8)), anchorWallet.publicKey.toBuffer()],
        program.programId
      );

      await program.methods.updateProxy(
        entry.ip,
        entry.protocols,
        entry.country,
        entry.port
      )
      .accounts({
        proxyEntry: proxyEntryPda,
        owner: anchorWallet.publicKey,
      })
      .rpc();

      fetchAllProxies();
      setEditingEntry(null);
    } catch (error) {
      console.error("Error updating proxy:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!anchorWallet) return;

    const provider = new AnchorProvider(connection, anchorWallet, {});
    const program = new Program(idl as Idl, programId, provider);

    try {
      const idNumber = parseInt(id);
      if (isNaN(idNumber)) {
        throw new Error("ID must be a valid number");
      }

      const [proxyEntryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(new BN(idNumber).toArray('le', 8)), anchorWallet.publicKey.toBuffer()],
        program.programId
      );

      await program.methods.deleteProxy()
        .accounts({
          proxyEntry: proxyEntryPda,
          owner: anchorWallet.publicKey,
        })
        .rpc();

      fetchAllProxies();
    } catch (error) {
      console.error("Error deleting proxy:", error);
    }
  };

  const handleCopy = (id: string, field: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField({ id, field });
      setTimeout(() => setCopiedField(null), 2000); // Reset after 2 seconds
    });
  };

  const filteredEntries = entries.filter(entry =>
    entry.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.protocols.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.port.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <Header />
      <div className="flex justify-between items-center my-8 px-4">
        <h1 className="text-3xl font-bold text-white">Proxy Entries</h1>
        <Input
          type="text"
          placeholder="Search proxies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>
      
      {!connected ? (
        <p className="text-gray-400 text-center">Please connect your wallet to view proxy entries.</p>
      ) : filteredEntries.length === 0 ? (
        <p className="text-gray-400 text-center">No proxy entries found. Create some entries first!</p>
      ) : (
        <Table className='px-4'>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Protocols</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Port</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.id}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{editingEntry?.id === entry.id ? 
                      <Input value={editingEntry.ip} onChange={(e) => setEditingEntry({...editingEntry, ip: e.target.value})} /> : 
                      entry.ip}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(entry.id, 'ip', entry.ip)}
                      className="p-1"
                    >
                      {copiedField?.id === entry.id && copiedField?.field === 'ip' ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  {editingEntry?.id === entry.id ? 
                    <Input value={editingEntry.protocols} onChange={(e) => setEditingEntry({...editingEntry, protocols: e.target.value})} /> : 
                    entry.protocols
                  }
                </TableCell>
                <TableCell>
                  {editingEntry?.id === entry.id ? 
                    <Input value={editingEntry.country} onChange={(e) => setEditingEntry({...editingEntry, country: e.target.value})} /> : 
                    entry.country
                  }
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{editingEntry?.id === entry.id ? 
                      <Input value={editingEntry.port} onChange={(e) => setEditingEntry({...editingEntry, port: e.target.value})} /> : 
                      entry.port}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(entry.id, 'port', entry.port)}
                      className="p-1"
                    >
                      {copiedField?.id === entry.id && copiedField?.field === 'port' ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{new Date(entry.updated * 1000).toLocaleString()}</TableCell>
                <TableCell>
                  {editingEntry?.id === entry.id ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleUpdate(editingEntry)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingEntry(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setEditingEntry(entry)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(entry.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="mt-8 px-4">
        <h2 className="text-2xl font-bold text-white mb-4">Add New Proxy</h2>
        <div className="flex space-x-2">
          <Input
            placeholder="ID"
            value={newEntry.id}
            onChange={(e) => setNewEntry({...newEntry, id: e.target.value})}
          />
          <Input
            placeholder="IP"
            value={newEntry.ip}
            onChange={(e) => setNewEntry({...newEntry, ip: e.target.value})}
          />
          <Input
            placeholder="Protocols"
            value={newEntry.protocols}
            onChange={(e) => setNewEntry({...newEntry, protocols: e.target.value})}
          />
          <Input
            placeholder="Country"
            value={newEntry.country}
            onChange={(e) => setNewEntry({...newEntry, country: e.target.value})}
          />
          <Input
            placeholder="Port"
            value={newEntry.port}
            onChange={(e) => setNewEntry({...newEntry, port: e.target.value})}
          />
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Proxy
          </Button>
        </div>
      </div>
    </div>
  );
}