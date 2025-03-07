import { catchErrorResponse } from "../exception/CatchErrorResponse";
import FileLensUpload from "../model/FileLensUpload"
import googleStorageService from "../services/GoogleStorageService"
import { Request, Response } from 'express';

class GoogleStorageController {

    async uploadFile(req: Request, res: Response): Promise<any> {
        const { buffer, mimetype, originalname } = req.file!;
        const { userId } = req.params;

        try {

            const fileLensUpload = new FileLensUpload(userId, buffer, mimetype, originalname);

            const response = await googleStorageService.uploadFileToGCS(fileLensUpload)

            return res.status(200).json(response)
               }
               catch (err) {
                   if (err === "REQUIRED_PROPERTIES_MISSING") {
                       throw catchErrorResponse(res, 400, "REQUIRED_PROPERTIES_MISSING", "Missing required properties", "Some required properties are missing from the request.")
                   }
                   if (err === "USER_NOT_FOUND") {
                       throw catchErrorResponse(res, 404, "NOT_FOUND", "Not found", "User not found")
                   }
                   if (err === "FILE_UPLOAD_ERROR") {
                       throw catchErrorResponse(res, 400, "FILE_UPLOAD_ERROR", "An Error occurred during the file upload process. Details: ", err)
                   }
                   else {
                       throw catchErrorResponse(res, 500, "INTERNAL_SERVER_ERROR", "Internal server error",
                           "An error occurred while processing the operation. Please try again or contact support if the issue persists.")
                   }
               }
    }

}

export default new GoogleStorageController()