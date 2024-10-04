'use client'

import { ModelEntry } from "@/components/models/right"
import { AnchorProvider, Idl, Program } from "@project-serum/anchor";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react"
import { PublicKey } from '@solana/web3.js';
import idl from '@/lib/idl.json';
import { ArrowDownToLine, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Details from "@/components/details-page";

const programId = new PublicKey('81BddUVGPz7cCtvEq9LBaEGDRdQiUnfPHRydGDqogvMG');

export default function ModelDetailsPage({params}:{params:{id:string}}) {
    const [model, setModel] = useState<ModelEntry | null>(null)
    const anchorWallet = useAnchorWallet();
    const { connection } = useConnection();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { connected, publicKey } = useWallet();
    const { id } = params

    useEffect(() => {
        if (connected && anchorWallet) {
            fetchModel();
        } else {
            setLoading(false);
            setError("Please connect your wallet to view this model.");
        }
    }, [connected, anchorWallet, publicKey, id]);

    const downloadFile = async (url: string, filename: string) => {
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
            setError("Failed to download the file. Please try again.");
        }
    };

    const fetchModel = async () => {
        if (!anchorWallet) return;
        setLoading(true);
        setError(null);

        const provider = new AnchorProvider(connection, anchorWallet, {});
        const program = new Program(idl as Idl, programId, provider);

        try {
            const allEntries = await program.account.modelEntryState.all();

            const formattedEntries = allEntries.map(entry => ({
                title: entry.account.title,
                message: entry.account.message,
                owner: entry.account.owner.toString(),
                ipfsHash: entry.account.ipfsHash,
            }));
            const detail = formattedEntries.find(model => model.title.toLowerCase().replace(/\s+/g, "_") === id);
            if (detail) {
                setModel(detail);
            } else {
                setError("Model not found.");
            }
        } catch (error) {
            console.error('Error fetching models:', error);
            setError("Failed to fetch model details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 className="w-12 h-12 animate-spin mb-4" />
                        <p className="text-xl">Loading model details...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4 text-center">
                        <p className="text-xl font-semibold mb-2">Error</p>
                        <p>{error}</p>
                        <Button 
                            onClick={fetchModel} 
                            className="mt-4 bg-red-500 hover:bg-red-600 text-white"
                        >
                            Try Again
                        </Button>
                    </div>
                ) : model ? (
                    <Details dataset={model} type="model"/>
                ) : (
                    <div className="text-center">
                        <p className="text-2xl font-bold mb-4">Model Not Found</p>
                        <p>The model you're looking for doesn't exist or has been removed.</p>
                    </div>
                )}
            </div>
        </div>
    )
}