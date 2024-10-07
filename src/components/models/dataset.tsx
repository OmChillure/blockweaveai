"use client";

import React, { useState, useEffect } from "react";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey, Connection } from "@solana/web3.js";
import { Program, AnchorProvider, Idl } from "@project-serum/anchor";
import idl from "@/lib/idl_ud.json";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { X, Search } from "lucide-react";

const programId = new PublicKey("BCH6tbQXrQtpPmtzwHcitQrpYTbqDeSDNCDVhz26xuxZ");

export interface DatasetEntry {
  title: string;
  message: string;
  owner: string;
  ipfsHash: string;
}

interface TagCategories {
  [category: string]: string[];
}

const tagCategories: TagCategories = {
  "Data Type": ["Text", "Image", "Audio", "Video", "Time Series", "Tabular"],
  Domain: [
    "Natural Language Processing",
    "Computer Vision",
    "Speech Recognition",
    "Bioinformatics",
    "Finance",
    "Healthcare",
  ],
  Size: [
    "Small (< 1GB)",
    "Medium (1-10GB)",
    "Large (10-100GB)",
    "Very Large (> 100GB)",
  ],
  Language: [
    "English",
    "Chinese",
    "Spanish",
    "French",
    "German",
    "Multilingual",
  ],
  License: [
    "Open Source",
    "Research Only",
    "Commercial Use",
    "Creative Commons",
  ],
};

interface FilterSidebarProps {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

function FilterSidebar({ selectedTags, setSelectedTags }: FilterSidebarProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleReset = () => {
    setSelectedTags([]);
    setSearchTerm("");
  };

  const filteredCategories = Object.entries(tagCategories).reduce(
    (acc, [category, tags]) => {
      const filteredTags = tags.filter((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredTags.length > 0) {
        acc[category] = filteredTags;
      }
      return acc;
    },
    {} as TagCategories
  );

  return (
    <aside className=" text-white px-3 rounded-xl shadow-lg flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-6">Filter Datasets</h2>

      <div className="relative mb-6">
        <Input
          type="search"
          placeholder="Search tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#131619] border-gray-700 focus:border-purple-500 text-white placeholder-gray-400 rounded-lg"
        />
      </div>

      <ScrollArea className="flex-grow mb-6">
        <div className="space-y-6">
          {Object.entries(filteredCategories).map(([category, tags]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-3 text-gray-300">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    className={`rounded-lg ${
                      selectedTags.includes(tag)
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "border-gray-600 text-gray-300 hover:bg-gray-700"
                    }`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedTags.map((tag) => (
            <div
              key={tag}
              className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center"
            >
              {tag}
              <button
                onClick={() => handleTagClick(tag)}
                className="ml-2 focus:outline-none hover:text-purple-200"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={handleReset}
        variant="outline"
        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
      >
        Reset Filters
      </Button>
    </aside>
  );
}

function Datasets() {
  const [entries, setEntries] = useState<DatasetEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    if (connected && anchorWallet) {
      fetchAllDatasets();
    }
  }, [connected, anchorWallet, publicKey]);

  const fetchAllDatasets = async () => {
    if (!anchorWallet) return;

    const provider = new AnchorProvider(
      connection as Connection,
      anchorWallet,
      {}
    );
    const program = new Program(idl as Idl, programId, provider);

    try {
      const allEntries = await program.account.datasetEntryState.all();

      const formattedEntries: DatasetEntry[] = allEntries.map((entry) => ({
        title: entry.account.title,
        message: entry.account.message,
        owner: entry.account.owner.toString(),
        ipfsHash: entry.account.ipfsHash,
      }));

      setEntries(formattedEntries);
    } catch (error) {
      console.error("Error fetching datasets:", error);
    }
  };

  const filteredEntries = entries.filter(
    (entry) =>
      (entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.message.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedTags.length === 0 ||
        selectedTags.every((tag) =>
          entry.message.toLowerCase().includes(tag.toLowerCase())
        ))
  );

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen ">
      {!connected ? (
        <p className="text-gray-400 text-center">
          Please connect your wallet to view datasets.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterSidebar
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </div>
          <div className="lg:col-span-3">
            {filteredEntries.length === 0 ? (
              <p className="text-gray-400 text-center">
                No datasets found. Create some datasets first!
              </p>
            ) : (
              <>
                <div className="mb-4 flex justify-between">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                    Datasets
                  </h1>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search datasets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 bg-black/30 border-gray-700 focus:border-purple-500 text-white transition-all duration-200 hover:border-purple-400"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {filteredEntries.reverse().map((entry) => (
                    <Link
                      key={entry.ipfsHash}
                      href={`/dataset/${encodeURIComponent(
                        entry.title.toLowerCase().replace(/\s+/g, "_")
                      )}`}
                    >
                      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-4 flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-600 rounded-md flex items-center justify-center text-white font-bold text-xl mr-4 flex-shrink-0">
                            {entry.title.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-grow min-w-0">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                              {entry.title}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {entry.message}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Datasets;
