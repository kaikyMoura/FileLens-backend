import { File, GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import FileLensUpload from '../model/FileLensUpload';
import { ResponseModel } from '../model/ResponseModel';
import userService from './UserService';
import { createPdfFromText, createDocxFromText } from '../utils/generateFile';
import gemmApiService from './GemmApiService';
import { CustomError } from '../model/CustomError';



class FileService {

    private storage = new Storage();
    private bucketName = process.env.GOOGLE_BUCKET_NAME!

    async uploadFileToGCS(file: FileLensUpload): Promise<ResponseModel<string>> {

        if (!file) {
            throw new CustomError("REQUIRED_PROPERTIES_MISSING", 400, "Some required properties are missing from the request. Please verify the request and try again, or contact support for assistance.")
        }

        const retrievedUser = await userService.retrieveUserById(file.userId)

        if (!retrievedUser) {
            throw new CustomError("USER_NOT_FOUND", 404, "User not found.")
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
        }).catch(() => new CustomError("FILE_UPLOAD_ERROR", 401, "An Error occurred during the file upload process. Please verify the request and try again, or contact support for assistance."))

        return {
            message: "File uploaded sucessfully",
            data: url
        }
    }

    async retrieveFilesFromGCS(userId: string): Promise<ResponseModel<unknown>> {
        if (!userId) {
            throw new CustomError("REQUIRED_PROPERTIES_MISSING", 400, "Some required properties are missing from the request. Please verify the request and try again, or contact support for assistance.")
        }

        const retrievedUser = await userService.retrieveUserById(userId)

        if (!retrievedUser) {
            throw new CustomError("USER_NOT_FOUND", 404, "User not found")
        }

        const [files] = await this.storage.bucket(this.bucketName).getFiles({
            prefix: `user-${userId}/`
        });

        const fileData = files.map((file: File) => ({
            filePath: file.name,
            fileId: file.id
        }))
        return {
            data: fileData
        }
    }

    async deleteFileFromGCS(fileUrl: string): Promise<boolean> {
        try {
            let fileName = new URL(fileUrl).pathname.split('/').slice(2).join('/')

            const bucket = this.storage.bucket(this.bucketName).file(fileName)

            await bucket.delete().catch(() => new CustomError("FILE_NOT_FOUND", 404, "The requested file could not be found. Please verify the request and try again, or contact support for assistance."))
            
            return true
        }
        catch (e) {
            return false
        }
    }

    async generateFileFromText(type: string, text: string, fileTitle?: string) {
        if (!text || !type) {
            throw new CustomError("REQUIRED_PROPERTIES_MISSING", 400, "Some required properties are missing from the request.")
        }

        let fileBuffer: Buffer | undefined;
        let fileName: string;
        let mimeType: string;

        if (type === ".docx") {
            fileBuffer = await createDocxFromText(text)
            fileName = fileTitle ? `${fileTitle}` : "generated_file.docx";
            mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        }

        else if (type === '.pdf') {
            fileBuffer = await createPdfFromText(text);
            fileName = fileTitle ? `${fileTitle}` : "generated_file.pdf";
            mimeType = 'application/pdf';
        }
        else {
            throw new CustomError("INVALID_TYPE", 400, "An invalid type was provided in the request. Please check the list of supported types and ensure you are using a valid option to generate the file.")
        }

        return {
            data: {
                buffer: fileBuffer!,
                fileName: fileName,
                mimeType: mimeType

            }
        }
    }

    async generateFileFromFileData(file: FileLensUpload, type: string) {
        if (!file || !type) {
            throw new CustomError("REQUIRED_PROPERTIES_MISSING", 400, "Some required properties are missing from the request.")
        }

        if (file.mimetype === type) {
            throw new CustomError("DUPLICATED_MIMETYPE", 401, "Conversion between files of the same type is not allowed. Please choose a different target type to proceed.")
        }

        const result = await gemmApiService.extractDataFromFile(file)

        let fileBuffer: Buffer | undefined;
        let fileName: string;
        let mimeType: string;

        if (type === ".docx") {
            fileBuffer = await createDocxFromText(result.data!)
            fileName = `${file.originalFileName.replace('.pdf', '.docx')}`;
            mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        }

        else if (type === 'pdf') {
            fileBuffer = await createPdfFromText(result.data!);
            fileName = `${file.originalFileName.replace('.docx', 'pdf')}`;
            mimeType = 'application/pdf';
        }
        else {
            throw new CustomError("INVALID_TYPE", 400, "An invalid type was provided in the request. Please check the list of supported types and ensure you are using a valid option to generate the file.")
        }

        return {
            data: {
                buffer: fileBuffer!,
                fileName: fileName,
                mimeType: mimeType

            }
        }
    }
}

export default new FileService()