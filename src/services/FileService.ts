import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import FileLensUpload from '../model/FileLensUpload';
import { ResponseModel } from '../model/ResponseModel';
import userService from './UserService';
import { generateDocx } from '../utils/generateFile';
import gemmApiService from './GemmApiService';



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

    async generateFileFromText(type: string, text: string, fileTitle?: string) {
        try {
            if (!text || !type) {
                throw new Error("REQUIRED_PROPERTIES_MISSING")
            }

            let fileBuffer: Buffer | undefined;
            let fileName: string;
            let mimeType: string;

            if (type === ".docx") {
                fileBuffer = await generateDocx(text)
                fileName = fileTitle ? `${fileTitle}` : "generated_file.docx";
                mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            }

            else if (type === '.pdf') {
                //fileBuffer = await generatePdfBuffer(text);
                fileName = fileTitle ? `${fileTitle}` : "generated_file.pdf";
                mimeType = 'application/pdf';
            }
            else {
                throw new Error("INVALID_TYPE")
            }


            console.log(fileBuffer)

            return {
                data: {
                    buffer: fileBuffer!,
                    fileName: fileName,
                    mimeType: mimeType

                }
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

    async generateFileFromData(file: FileLensUpload, type: string) {
        try {
            if (!file || !type) {
                throw new Error("REQUIRED_PROPERTIES_MISSING")
            }

            if (file.mimetype === type) {
                throw new Error("DUPLICATED_MIMETYPE")
            }

            const result = await gemmApiService.extractDataFromFile(file)

            let fileBuffer: Buffer | undefined;
            let fileName: string;
            let mimeType: string;

            if (type === ".docx") {
                fileBuffer = await generateDocx(result.data!)
                fileName = `${file.originalFileName.replace('.pdf', '.docx')}`;
                mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            }

            else if (type === 'pdf') {
                //fileBuffer = await generatePdfBuffer(text);
                fileName = `${file.originalFileName.replace('.docx', 'pdf')}`;
                mimeType = 'application/pdf';
            }
            else {
                throw new Error("INVALID_TYPE")
            }


            console.log(fileBuffer)

            return {
                data: {
                    buffer: fileBuffer!,
                    fileName: fileName,
                    mimeType: mimeType

                }
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

export default new FileService()