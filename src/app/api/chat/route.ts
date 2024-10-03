import { google } from '@ai-sdk/google';
import { convertToCoreMessages, Message, streamText } from 'ai';
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
export const maxDuration = 10;
// import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

// const embeddings = new HuggingFaceInferenceEmbeddings({
//   model:"sentence-transformers/all-mpnet-base-v2",
// });
const pinecone = new PineconeClient({apiKey:`${process.env.PINECONE_API_KEY}`});
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

// const groq = google({
//   baseURL: 'https://api.groq.com/openai/v1',
//   apiKey: process.env.GROQ_API_KEY,
// });

export async function POST(req: Request) {
  const { messages ,id}:{messages:Message[],id:string} = await req.json();
  console.log({id,messages});
  // const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  //   pineconeIndex,
  //   maxConcurrency: 5,
  //   namespace: "abc",
  // });
  // var data = ""

  // const similaritySearchResults = await vectorStore.similaritySearch(JSON.stringify(messages),20);
  // for (const doc of similaritySearchResults) {
  //   data+=`* ${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]\n`
  // }
  const res = await pineconeIndex.namespace(id).query({
    topK:10000,
    vector:new Array(768).fill(0),
    includeMetadata:true,
  })
  const data = res.matches.map(match=>({metadata:match.metadata}))
  console.log(JSON.stringify(data));
  const system = `You are assistant. Answer user's query according to your context json data only. if you cant find relevant answers from context, say "I don't know". Your Context JSON: ${JSON.stringify(data)}`
  const result = await streamText({
    model: google("gemini-1.5-flash"),
    system: system,
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
