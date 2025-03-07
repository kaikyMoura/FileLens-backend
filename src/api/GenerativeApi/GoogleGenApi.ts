import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from 'dotenv';

config({ path: '.env' })

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })