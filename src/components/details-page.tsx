"use client";
import { Card } from "@/components/ui/card";
import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageCircleIcon } from "lucide-react";
import { useChat } from "ai/react";
import {
  RefreshCcw,
  SendIcon,
  StopCircleIcon,
  TrashIcon,
  InfoIcon,
} from "lucide-react";
import { DatasetEntry } from "./models/dataset";
import { useEffect, useState } from "react";
// import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area";

const downloadFile = async (url: any, filename: any) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

export default function Details({
  dataset,
  type,
}: {
  dataset: DatasetEntry;
  type: string;
}) {
  const [id, setId] = useState("");
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
    setId(dataset.ipfsHash);
  }, []);

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-purple-900 text-gray-100 min-h-screen py-8 px-4">
      <Card className="max-w-7xl mx-auto overflow-hidden border-none">
        <div className="grid lg:grid-cols-[2fr,3fr] gap-6">
          <div className="relative aspect-square lg:aspect-auto rounded-xl overflow-hidden">
            <img
              src="/placeholder.svg?height=600&width=800"
              alt="Dataset visualization"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <Button variant="secondary" className="mb-2">
                {type.toUpperCase()}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-6 p-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                {dataset.title ?? "Global Climate Change Dataset"}
              </h1>
              <div className="flex items-center text-gray-400 text-sm">
                <InfoIcon size={16} className="mr-2" />
                <ScrollArea className="w-full h-6">
                  <p className="whitespace-nowrap">
                    {dataset.ipfsHash ?? "By Climate Research Institute"}
                  </p>
                </ScrollArea>
              </div>
            </div>
            <ScrollArea className="flex-grow">
              <p className="text-gray-300 leading-relaxed">
                {dataset.message ??
                  "This comprehensive dataset includes global temperature records, CO2 levels, and sea level measurements from the past century, providing crucial insights into climate change trends and impacts."}
              </p>
            </ScrollArea>
            <div className="grid sm:grid-cols-2 gap-4">
              {type=="data" ? <Button
                variant="outline"
                className="w-full h-12 text-lg font-medium hover:bg-gray-800"
                onClick={() => {
                  if (dataset.ipfsHash) {
                    const url = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_D}/ipfs/${dataset.ipfsHash}`;
                    console.log("Download URL:", url);
                    downloadFile(url, `${dataset.title}.csv`);
                  } else {
                    alert("No IPFS hash available.");
                  }
                }}
              ><DownloadIcon className="mr-2 h-5 w-5" />
              Download Dataset
            </Button> : <Button
              variant="outline"
              className="w-full h-12 text-lg font-medium hover:bg-gray-800"
              onClick={() => {
                if (dataset.ipfsHash) {
                  const url = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_M!}/ipfs/${dataset.ipfsHash}`;
                  console.log("Download URL:", url);
                  downloadFile(url, `${dataset.title}.py`);
                } else {
                  alert("No IPFS hash available.");
                }
              }}
            > <DownloadIcon className="mr-2 h-5 w-5" />
            Download Model
          </Button>}
                
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
                        handleSubmit(e, { body: { id } });
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
      </Card>
    </div>
  );
}
