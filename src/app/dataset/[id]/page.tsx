"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, Idl, BN } from '@project-serum/anchor';
import idl from '@/lib/idl_ud.json';
import { Button } from '@/components/ui/button';
import { DownloadIcon, MessageCircleIcon, SendIcon, StopCircleIcon, TrashIcon } from 'lucide-react';
import { useChat } from 'ai/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from '@radix-ui/react-scroll-area';

const programId = new PublicKey('BCH6tbQXrQtpPmtzwHcitQrpYTbqDeSDNCDVhz26xuxZ');

interface DataEntry {
  title: string;
  message: string;
  owner: string;
  ipfsHash: string;
  publicKey?: PublicKey;
}

export default function ModelDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [dataset, setDataset] = useState<DataEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected } = useWallet();
  const {
    messages,
    input,
    handleInputChange,
    setMessages,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
  } = useChat({
    keepLastMessageOnError: true,
    onFinish: (message, { usage, finishReason }) => {
      console.log("Finished streaming message:", message);
      console.log("Token usage:", usage);
      console.log("Finish reason:", finishReason);
    },
    onError: (error) => {
      alert("An error occurred:" + error.message + "\n" + error.cause);
    },
    onResponse: (response) => {
      console.log("Received HTTP response from server:", response);
    },
  });

  const handleDelete = (id: string) => {
    setMessages(messages.filter((msg) => msg.id !== id));
  };

  useEffect(() => {
    if (connected && anchorWallet && id) {
      fetchModel();
    }
  }, [connected, anchorWallet, id]);

  const fetchModel = async () => {
    if (!anchorWallet) return;
    setLoading(true);

    const provider = new AnchorProvider(connection, anchorWallet, {});
    const program = new Program(idl as Idl, programId, provider);

    try {
      const allEntries = await program.account.datasetEntryState.all();
      const formattedEntries = allEntries.map(entry => ({
        title: entry.account.title,
        message: entry.account.message,
        owner: entry.account.owner.toString(),
        ipfsHash: entry.account.ipfsHash,
        publicKey: entry.publicKey, // Save the public key for later use
      }));

      const decodedId = decodeURIComponent(id).replace(/_/g, ' ');
      const detail = formattedEntries.find(dataset => 
        dataset.title.toLowerCase() === decodedId.toLowerCase()
      );

      if (detail) {
        setDataset(detail);
      } else {
        console.error('dataset not found');
      }
    } catch (error) {
      console.error('Error fetching dataset:', error);
    } finally {
      setLoading(false);
    }
  };

  const purchaseAndDownload = async () => {
    if (!anchorWallet || !dataset || !dataset.publicKey) {
      alert("Unable to process purchase. Please check your wallet connection.");
      return;
    }

    setPurchasing(true);
    
    try {
      const provider = new AnchorProvider(connection, anchorWallet, {});
      const program = new Program(idl as Idl, programId, provider);

      const amount = new BN(1000000); 

      const tx = await program.methods
        .purchaseDatset(amount)
        .accounts({
          datasetEntry: dataset.publicKey,
          buyer: anchorWallet.publicKey,
          creator: new PublicKey(dataset.owner),
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Purchase transaction successful:", tx);
      
      // After successful purchase, proceed with download
      await downloadDataset();
      
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Purchase failed. Please try again.");
    } finally {
      setPurchasing(false);
    }
  };

  const downloadDataset = async () => {
    if (dataset?.ipfsHash) {
      const url = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_D}/ipfs/${dataset.ipfsHash}`;
      const filename = `${dataset.title}.csv`;
      
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
        
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error('Download failed:', error);
      }
    } else {
      alert("No IPFS hash available.");
    }
  };

  if (!connected) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
        <p className="text-white text-xl">Please connect your wallet to view this Dataset.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
        <p className="text-white text-xl">Dataset not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{dataset.title}</h1>
        
        <p className="text-lg mb-6">{dataset.message}</p>
        
        <div className="mb-6">
          <p><span className="font-semibold">Owner:</span> {dataset.owner}</p>
          <p><span className="font-semibold">IPFS Hash:</span> {dataset.ipfsHash}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-x-2">
          <Button 
            onClick={purchaseAndDownload} 
            disabled={purchasing}
            className="h-full bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            {purchasing ? 'Processing...' : 'Purchase & Download dataset'}
          </Button>
          <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700">
                    <MessageCircleIcon className="mr-2 h-5 w-5" />
                    Chat with AI
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] md:w-[80%] bg-gray-900 text-gray-100">
                  <DialogHeader>
                    <DialogTitle className="text-xl">AI Assistant</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Ask anything about{" "}
                      {dataset.title.length <= 10
                        ? dataset.title
                        : dataset.title.slice(0, 10) + "..."}
                      .
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[50vh] md:h-[60vh] pr-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex flex-col ${
                            message.role === "user"
                              ? "items-end"
                              : "items-start"
                          }`}
                        >
                          <div
                            className={`p-3 rounded-lg max-w-[80%] ${
                              message.role === "user"
                                ? "bg-blue-600"
                                : "bg-gray-800"
                            }`}
                          >
                            {message.content}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(message.id)}
                          >
                            <TrashIcon size={14} />
                          </Button>
                        </div>
                      ))}
                      {error && (
                        <div className="bg-red-900/50 p-3 rounded-lg">
                          Error: {error.message}
                        </div>
                      )}
                      {isLoading && (
                        <div className="flex items-center bg-gray-800 p-3 rounded-lg">
                          <span className="mr-2">Loading...</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => stop()}
                          >
                            <StopCircleIcon size={14} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <DialogFooter>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(e, { body: { id:dataset.ipfsHash } });
                      }}
                      className="flex w-full space-x-2"
                    >
                      <input
                        className="flex-1 rounded-md p-3 bg-gray-800 outline-none border border-gray-700 focus:border-blue-500"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        disabled={isLoading}
                      />
                      <Button type="submit" disabled={isLoading}>
                        <SendIcon />
                      </Button>
                    </form>
                  </DialogFooter>
                </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}