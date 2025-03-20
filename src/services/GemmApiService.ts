import { model } from "../api/GenerativeApi/GoogleGenApi";
import FileLensUpload from "../model/FileLensUpload";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { ResponseModel } from "../model/ResponseModel";
import path from "path";
import { GenerateContentResult } from "@google/generative-ai";
import { CustomError } from "../model/CustomError";

class GemmApiService {

    protected async generateGeminiContent(file: FileLensUpload, question: string): Promise<GenerateContentResult> {
        const fileManager = new GoogleAIFileManager(model.apiKey);

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

    async extractDataFromFile(file: FileLensUpload): Promise<ResponseModel<string>> {
            if (!file) {
                throw new CustomError("REQUIRED_PROPERTIES_MISSING", 401, "Some required properties are missing from the request.")
            }
            const result = await this.generateGeminiContent(file, "Extract only the raw text content from this file. Keep the original line breaks and text structure exactly as it appears. Do NOT add explanations, captions, or extra formatting. Return only the extracted text as plain text.")

            return {
                message: "Data extracted successfully.",
                data: result.response.text().trim()
            }
        }
}

export default new GemmApiService()