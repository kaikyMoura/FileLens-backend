import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import FileLensUpload from '../model/FileLensUpload'
import userService from './UserService'

class GoogleStorageService {

    private storage = new Storage({ keyFilename: process.env.GOOGLE_APLICATION_CREDENTIALS });

    async uploadFileToGCS(file: FileLensUpload) {
        let bucketName = "filelens_bucket"

        try {

            console.log(file)

            if (!file) {
                throw new Error("REQUIRED_PROPERTIES_MISSING")
            }

            const retrievedUser = await userService.retriveUserById(file.userId)

            console.log(retrievedUser)

            if(!retrievedUser) {
                throw new Error("USER_NOT_FOUND")
            }

            const fileName = file.generateUniqueFileName()

            const bucket = this.storage.bucket(bucketName).file(fileName)

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
                temp_url: url

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

    async deleteFile(fileUrl: string) {
        try {
            let bucketName = "aqua_llm"

            let fileName = new URL(fileUrl).pathname.split('/').slice(2).join('/')

            const bucket = this.storage.bucket(bucketName).file(fileName)

            await bucket.delete()

            return true
        }
        catch (e) {
            return false
        }
    }
}

export default new GoogleStorageService()