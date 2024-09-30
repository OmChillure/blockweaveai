import { createOpenAI } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';

export const maxDuration = 10;

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const system = `You are assistant`

  const result = await streamText({
    model: groq("llama-3.2-90b-text-preview"),
    system: system,
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}