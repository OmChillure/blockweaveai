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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SendHorizontalIcon } from "lucide-react"
import { useChat } from 'ai/react';
import { RefreshCcw, SendIcon, StopCircleIcon, TrashIcon } from 'lucide-react';

interface ChatProps{
  name: string;
  goal: string;
  task: string;
  author: string;
  image: string;
  gender: string;
  personality: string;
}
export function AI() {
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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Chat with AI</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:w-[80%]">
        <DialogHeader>
          <DialogTitle>Hey User</DialogTitle>
          <DialogDescription>
            Ask anything about data.
          </DialogDescription>
        </DialogHeader>
        <div className="">
        <div className='text-white/70 overflow-hidden scroll-hidden relative flex flex-col items-center gap-y-3 p-5 bg-zinc-900'>
      <div className='md:w-[50%] h-[50svh] md:h-[60svh] no-scrollbar w-[97%] overflow-y-scroll flex flex-col gap-y-1'>
        {messages.map(message => (
          <div className={`flex flex-col w-fit gap-y-1 ${message.role==='user'? " self-end":" self-start"}`}>
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
          <RefreshCcw onClick={()=>reload()} size={17} className='mx-1'/>
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
        <form onSubmit={handleSubmit} className='grid grid-cols-12 h-[9svh] place-content-center bg-white/10 rounded-lg border border-white/60 gap-x-1 md:w-[50%] w-[97%]  p-1'>
        <input className='rounded-md p-3 bg-transparent md:col-span-11 col-span-10 outline-none' name="prompt" value={input} placeholder='Your prompt...' onChange={handleInputChange} disabled={isLoading}/>
        <button type="submit" className='col-span-2 md:col-span-1 flex justify-center items-center text-white font-bold rounded-lg' disabled={isLoading}>
          <SendIcon/>
        </button>
      </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
