"use client"
import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, Idl, web3 } from '@project-serum/anchor';
import idl from '@/lib/idlf.json';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Check, Search, AlertCircle, Database, Globe, Lock, Unlock } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

const programId = new PublicKey('6H6k7YwaCqyW5a2gnrqxTJcEJk1cLkfgdnm2FJPABqca');

interface ProxyEntry {
  owner: PublicKey;
  ip: string;
  protocols: string;
  country: string;
  port: string;
  updated: number;
  price: number;
  purchased: boolean;
  buyer: PublicKey | null;
}

export default function ProxyEntries() {
  const [entries, setEntries] = useState<ProxyEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedField, setCopiedField] = useState<{ ip: string, field: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [final,setFinal] = useState<ProxyEntry[]>([])
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    if (connected && anchorWallet) {
      Privateproxy();
    } else {
      setEntries([]);
      setIsLoading(false);
    }
  }, [connected, anchorWallet]);

  async function Privateproxy() {
    if (!anchorWallet) return;
    setIsLoading(true);

    const provider = new AnchorProvider(connection, anchorWallet, {});
    const program = new Program(idl as Idl, programId, provider);

    try {
      const allEntries = await program.account.proxyEntryState.all([
        {
          memcmp: {
            offset: 8,
            bytes: anchorWallet.publicKey.toBase58(),
          },
        },
      ]);

      const formattedEntries = allEntries.map((entry) => ({
        owner: entry.account.owner,
        ip: entry.account.ip || '',
        protocols: entry.account.protocols || '',
        country: entry.account.country || '',
        port: entry.account.port || '',
        updated: entry.account.updated || 0,
        price: entry.account.price || 0,
        purchased: entry.account.purchased || false,
        buyer: entry.account.buyer || null,
      }));
      const filteredEntries =publicKey ? formattedEntries.filter(entry =>
        entry.owner.equals(publicKey) ||
        entry.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.protocols.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.port.toLowerCase().includes(searchTerm.toLowerCase())
      ) : []
      setEntries(filteredEntries);
    } catch (error) {
      console.error("Error fetching personal models:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (ip: string, field: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField({ ip, field });
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const handlePurchase = async (entry: ProxyEntry) => {
    if (!anchorWallet) return;

    const provider = new AnchorProvider(connection, anchorWallet, {});
    const program = new Program(idl as Idl, programId, provider);

    try {
      const [proxyEntryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(entry.ip), entry.owner.toBuffer()],
        program.programId
      );

      await program.methods.purchaseProxy()
        .accounts({
          proxyEntry: proxyEntryPda,
          buyer: anchorWallet.publicKey,
          seller: entry.owner,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      toast({
        title: "Purchase Successful",
        description: "You have successfully purchased the proxy.",
      });

      setEntries(prevEntries => prevEntries.map(e => 
        e.ip === entry.ip ? { ...e, purchased: true, buyer: anchorWallet.publicKey } : e
      ));

    } catch (error) {
      console.error('Error purchasing proxy:', error);
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase the proxy. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  

  return (
    <div className="w-[98.9vw] min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white px-3">
      <div className="max-w-11xl mx-auto space-y-6">
        <Card className="border-transparent">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Database className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                    Proxy Entries Dashboard
                  </CardTitle>
                  <CardDescription className="text-gray-400 mt-2 flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>View, monitor, and purchase proxies from your global network</span>
                  </CardDescription>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search proxies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-black/30 border-gray-700 focus:border-purple-500 text-white transition-all duration-200 hover:border-purple-400"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!connected ? (
              <div className="text-center py-12 bg-gray-900/30 rounded-lg border border-gray-800">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-400 text-lg">Please connect your wallet to view proxy entries.</p>
              </div>
            ) : isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full bg-gray-800/50" />
                ))}
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12 bg-gray-900/30 rounded-lg border border-gray-800">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-400 text-lg">No proxy entries found.</p>
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden border border-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-900/50 hover:bg-gray-900/50">
                      <TableHead className="text-gray-400 font-semibold">IP</TableHead>
                      <TableHead className="text-gray-400 font-semibold">Protocols</TableHead>
                      <TableHead className="text-gray-400 font-semibold">Country</TableHead>
                      <TableHead className="text-gray-400 font-semibold">Port</TableHead>
                      <TableHead className="text-gray-400 font-semibold">Updated</TableHead>
                      <TableHead className="text-gray-400 font-semibold">Price</TableHead>
                      <TableHead className="text-gray-400 font-semibold">Status</TableHead>
                      <TableHead className="text-gray-400 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries && entries.map((entry) => (
                      <TableRow key={entry.ip} className="hover:bg-purple-900/20 transition-colors duration-200">
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono">
                              {entry.purchased && entry.buyer?.equals(publicKey!) ? entry.ip : '*.*.*.* (Hidden)'}
                            </span>
                            {entry.purchased && entry.buyer?.equals(publicKey!) ? (
                              <Unlock className="h-4 w-4 text-green-500" />
                            ) : (
                              <Lock className="h-4 w-4 text-yellow-500" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(entry.ip, 'ip', entry.purchased && entry.buyer?.equals(publicKey!) ? entry.ip : '*.*.*.* (Hidden)')}
                              className="hover:bg-purple-500/20 transition-colors duration-200"
                            >
                              {copiedField?.ip === entry.ip && copiedField?.field === 'ip' ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
                            {entry.protocols}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <span>{entry.country}</span>
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono">{entry.port}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(entry.ip, 'port', entry.port)}
                              className="hover:bg-purple-500/20 transition-colors duration-200"
                            >
                              {copiedField?.ip === entry.ip && copiedField?.field === 'port' ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {new Date(entry.updated * 1000).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {Number(entry.price).toFixed(9)} SOL
                        </TableCell>
                        <TableCell>
                          <Badge variant={entry.purchased ? "default" : "secondary"} className={entry.purchased ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"}>
                            {entry.purchased ? "Purchased" : "Available"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {!entry.purchased && (
                            <Button
                              onClick={() => handlePurchase(entry)}
                              className="bg-purple-500 hover:bg-purple-600 text-white"
                            >
                              Purchase
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}