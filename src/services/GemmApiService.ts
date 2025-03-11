import { model } from "../api/GenerativeApi/GoogleGenApi";
import FileLensUpload from "../model/FileLensUpload";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { ResponseModel } from "../model/ResponseModel";
import path from "path";
import { GenerateContentResult } from "@google/generative-ai";

class GemmApiService {

    protected async generateGeminiContent(file: FileLensUpload, question: string): Promise<GenerateContentResult> {
        const fileManager = new GoogleAIFileManager(model.apiKey);

        try {
            const uploadResponse = await fileManager.uploadFile(file.buffer, {
                mimeType: file.mimetype,
                displayName: 'File'
            })

            const result = await model.generateContent([
                question,
                {
                    fileData: {
                        fileUri: uploadResponse.file.uri,
                        mimeType: uploadResponse.file.mimeType
                    }
                }
            ]);
            return result
        }
        catch (err) {
            if (err instanceof Error) {
                throw new Error(err.message)
            }
            else {
                throw new Error("INTERNAL_SERVER_ERROR")
            }
        }
    }

    async extractDataFromFile(file: FileLensUpload): Promise<ResponseModel<string>> {
        try {

            if (!file) {
                throw new Error("REQUIRED_PROPERTIES_MISSING")
            }
            const result = await this.generateGeminiContent(file, "Extract only the raw text content from this file. Keep the original line breaks and text structure exactly as it appears. Do NOT add explanations, captions, or extra formatting. Return only the extracted text as plain text.")

            return {
                data: result.response.text().trim()
            }
        }
        catch (err) {
            if (err instanceof Error) {
                throw new Error(err.message)
            }
            else {
                throw new Error("INTERNAL_SERVER_ERROR")
            }
        }
    }
}

export default new GemmApiService()