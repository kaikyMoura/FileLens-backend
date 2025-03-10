import { model } from "../api/GenerativeApi/GoogleGenApi";
import FileLensUpload from "../model/FileLensUpload";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { ResponseModel } from "../model/ResponseModel";
import path from "path";

class GemmApiService {

    async extractDataFromFile(file: FileLensUpload): Promise<ResponseModel<string>> {
        const fileManager = new GoogleAIFileManager(model.apiKey);

        try {
            const uploadResponse = await fileManager.uploadFile(file.buffer, {
                mimeType: file.mimetype,
                displayName: 'File'
            });

            const result = await model.generateContent([
                "Extract only the raw text content from this image. Keep the original line breaks and text structure exactly as it appears. Do NOT add explanations, captions, or extra formatting. Return only the extracted text as plain text.",
                {
                    fileData: {
                        fileUri: uploadResponse.file.uri,
                        mimeType: uploadResponse.file.mimeType
                    }
                }
            ]);

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