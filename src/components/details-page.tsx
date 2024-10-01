"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DownloadIcon, MessageCircleIcon } from 'lucide-react'
import { DatasetEntry } from "./models/dataset"
import { AI } from "./models/AI";
const downloadFile = async (url: any, filename: any) => {
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
};
export default function Details({dataset}:{dataset:DatasetEntry}) {
  return (
    <div className="bg-gray-900 text-gray-100 grid place-items-center">
      <Card className="w-full min-h-[100svh] max-w-7xl overflow-hidden">
        <div className="grid lg:grid-cols-[2fr,3fr]">
          <div className="relative aspect-[4/3] lg:aspect-auto">
            <img
              src="/placeholder.svg?height=600&width=800"
              alt="Dataset visualization"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-rows-[auto,1fr,auto] gap-4 p-4 lg:p-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{dataset.title??"Global Climate Change Dataset"}</h1>
              <p className="text-gray-400 text-sm w-[80%] overflow-x-scroll ">{dataset.owner??"By Climate Research Institute"}</p>
            </div>
            <div className="grid content-start gap-4">
              <p className="text-gray-300">
                {dataset.message??"This comprehensive dataset includes global temperature records, CO2 levels, and sea level measurements from the past century, providing crucial insights into climate change trends and impacts."}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-y-4 sm:gap-x-4">
              <Button variant="outline" className="w-full" onClick={()=>downloadFile(`https://gateway.pinata.cloud/ipfs/${dataset.ipfsHash}`,
                    `${dataset.title}.py`)} >
                <DownloadIcon className="mr-2 h-4 w-4"/> Download Dataset
              </Button>
              <Button className="w-full">
                <AI/>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}