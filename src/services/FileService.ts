import { File, GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import FileLensUpload from '../model/FileLensUpload'
import userService from './UserService'
import { ResponseModel } from '../model/ResponseModel';
import { generateDocx } from '../utils/generateFile';
import gemmAiService from './GemmApiService'

interface FileConversionResponseModel {
    buffer: Buffer;
    fileName: string;
    mimeType: string;
}

class FileService {

    private storage = new Storage({ keyFilename: process.env.GOOGLE_APLICATION_CREDENTIALS });
    private bucketName = "filelens_bucket"
    
    async uploadFileToGCS(file: FileLensUpload): Promise<ResponseModel<string>> {
        try {

            if (!file) {
                throw new Error("REQUIRED_PROPERTIES_MISSING")
            }

            const retrievedUser = await userService.retriveUserById(file.userId)

            console.log(retrievedUser)

            if (!retrievedUser) {
                throw new Error("USER_NOT_FOUND")
            }

            const fileName = file.generateUniqueFileName()

            const bucket = this.storage.bucket(this.bucketName).file(fileName)

            const options: GetSignedUrlConfig = {
                version: 'v4',
                action: "read",
                expires: Date.now() + 15 * 60 * 1000,
            };

            const [url] = await bucket.getSignedUrl(options);

            await bucket.save(file.buffer, {
                contentType: file.mimetype,
                metadata: {
                    cacheControl: 'public, max-age=31536000',
                },
            })

            // image_url: `https://storage.googleapis.com/${bucketName}/${fileName}`,
            return {
                message: "File uploaded sucessfully",
                data: url
            }
        }
        catch (err) {
            console.error(err)
            if (err instanceof Error) {
                throw new Error(err.message)
            }
            else {
                throw new Error("INTERNAL_SERVER_ERROR")
            }
        }
    }

    async retrieveFilesFromGCS(userId: string): Promise<ResponseModel<any>> {
        try {
            if (!userId) {
                throw new Error("REQUIRED_PROPERTIES_MISSING")
            }

            const retrievedUser = await userService.retriveUserById(userId)

            if (!retrievedUser) {
                throw new Error("USER_NOT_FOUND")
            }
            console.log(retrievedUser)

            const [files] = await this.storage.bucket(this.bucketName).getFiles({
                prefix: `user-${userId}/`
            });

            const fileData = files.map(file => ({
                filePath: file.name,
                fileId: file.id
            }))
            return {
                data: fileData
            }
        }
        catch (err) {
            console.error(err)
            if (err instanceof Error) {
                throw new Error(err.message)
            }
            else {
                throw new Error("INTERNAL_SERVER_ERROR")
            }
        }
    }

    async deleteFileFromGCS(fileUrl: string): Promise<boolean> {
        try {
            let fileName = new URL(fileUrl).pathname.split('/').slice(2).join('/')

            const bucket = this.storage.bucket(this.bucketName).file(fileName)

            await bucket.delete()

            return true
        }
        catch (e) {
            return false
        }
    }
}

export default new FileService()