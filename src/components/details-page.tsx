"use client"
import { Card } from "@/components/ui/card" 
import { DownloadIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageCircleIcon } from "lucide-react"
import { useChat } from 'ai/react';
import { RefreshCcw, SendIcon, StopCircleIcon, TrashIcon } from 'lucide-react';
import { DatasetEntry } from "./models/dataset"
import { useEffect, useState } from "react"
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
export default function Details({dataset,type}:{dataset:DatasetEntry,type:string}) {
  const [id,setId] = useState("")
  const { messages, input, handleInputChange,setMessages, handleSubmit,isLoading,error,reload,stop } = useChat({
    keepLastMessageOnError:true,
    onFinish: (message, { usage, finishReason }) => {
      console.log('Finished streaming message:', message);
      console.log('Token usage:', usage);
      console.log('Finish reason:', finishReason);
    },
    onError: error => {
      alert('An error occurred:'+error.message+"\n"+error.cause);
    },
    onResponse: response => {
      console.log('Received HTTP response from server:', response);
    },
  });
  const handleDelete = (id:string) => {
    setMessages(messages.filter(msg=>msg.id!==id))
  }
  useEffect(()=>{
    setId(dataset.ipfsHash)
  },[])
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
              <p className="text-gray-400 text-sm w-[80%] overflow-x-scroll ">{dataset.ipfsHash??"By Climate Research Institute"}</p>
            </div>
            <div className="grid content-start gap-4">
              <p className="text-gray-300">
                {dataset.message??"This comprehensive dataset includes global temperature records, CO2 levels, and sea level measurements from the past century, providing crucial insights into climate change trends and impacts."}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-y-4 sm:gap-x-4">
              {type=="data" ? <Button variant="outline" className="w-full" onClick={()=>
                  downloadFile(`https://${process.env.PINATA_GATEWAY_D}/ipfs/${dataset.ipfsHash}`,
                  `${dataset.title}.py`) 
              } >
                <DownloadIcon className="mr-2 h-4 w-4"/> Download Dataset
              </Button> :
              <Button variant="outline" className="w-full" onClick={async()=>
            await downloadFile(`https://${process.env.PINATA_GATEWAY_M}/ipfs/${dataset.ipfsHash}`,
                    `${dataset.title}.py`)
              } >
                <DownloadIcon className="mr-2 h-4 w-4"/> Download Model
              </Button>
              }
              <Button className="w-full">
              <Dialog>
      <DialogTrigger asChild>
        <Button className="hover:bg-transparent hover:text-black" variant="ghost">
        <MessageCircleIcon className="mr-2 h-4 w-4" />
          Chat with AI
          </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:w-[80%]">
        <DialogHeader>
          <DialogTitle>Hey User</DialogTitle>
          <DialogDescription>
            Ask anything about {dataset.title.length<=10 ? dataset.title :dataset.title.slice(0,10)+"..."}.
          </DialogDescription>
        </DialogHeader>
        <div className="">
        <div className='text-white/70 overflow-hidden scroll-hidden relative flex flex-col items-center gap-y-3 p-5 bg-zinc-900'>
      <div className='md:w-[50%] h-[50svh] md:h-[60svh] no-scrollbar w-[97%] overflow-y-scroll flex flex-col gap-y-1'>
        {messages.map(message => (
          <div key={message.id} className={`flex flex-col w-fit gap-y-1 ${message.role==='user'? " self-end":" self-start"}`}>
            <div key={message.id} className={`p-3 w-fit rounded-lg ${message.role==='user'? " bg-green-600":" bg-white/5"}`}>
              {message.content}
            </div>
            <TrashIcon onClick={()=>handleDelete(message.id)} size={17} className='right-1 self-end mx-1 bottom-1'/>
          </div>
        ))}
        {error && (
       <div className={`flex w-fit self-start`}>
        <div className={`p-3 w-fit rounded-lg flex bg-white/5`}>
          {"Error: "+error.message}
        </div>
       </div>
        )}
        {isLoading && (
       <div className={`flex w-fit self-start`}>
        <div className={`p-3 w-fit rounded-lg flex bg-white/5`}>
          Loading...
          <StopCircleIcon onClick={()=>stop()} size={17} className='mx-1'/>
        </div>
       </div>
        )}
      </div>
    </div>
        </div>
        <DialogFooter>
        <form onSubmit={(e)=>{
          e.preventDefault()
          handleSubmit(e,{body:{id}})
        }} className='grid grid-cols-12 h-[9svh] place-content-center bg-white/10 rounded-lg border border-white/60 gap-x-1 md:w-[50%] w-[97%]  p-1'>
        <input className='rounded-md p-3 bg-transparent md:col-span-11 col-span-10 outline-none' name="prompt" value={input} placeholder='Your prompt...' onChange={handleInputChange} disabled={isLoading}/>
        <button type="submit" className='col-span-2 md:col-span-1 flex justify-center items-center text-white font-bold rounded-lg' disabled={isLoading}>
          <SendIcon/>
        </button>
      </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}