import { Request, Response } from 'express';
import { catchErrorResponse } from '../exception/CatchErrorResponse';
import FileLensUpload from '../model/FileLensUpload';
import fileService from '../services/FileService';
import gemmAiService from '../services/GemmApiService';

class GemmApiController {

    async extractData(req: Request, res: Response): Promise<Response> {
        const { buffer, mimetype, originalname } = req.file!;

        try {
            const data = await gemmAiService.extractDataFromFile(new FileLensUpload(undefined, buffer, mimetype, originalname))

            return res.status(200).json(data)
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

    // async fileConvertion(req: Request, res: Response): Promise<Response> {
    //     const { buffer, mimetype, originalname } = req.file!;
    //     const { type } = req.body

    //     try {
    //         const data = await fileService.fileConvertion(new FileLensUpload(undefined, buffer, mimetype, originalname), type)

    //         res.setHeader('Content-Disposition', `attachment; filename="${data.data!.fileName}"`);
    //         res.setHeader('Content-Type', data.data!.mimeType);

    //         return res.status(200).send(data.data!.buffer);
    //     } catch (err) {
    //         if (err === "REQUIRED_PROPERTIES_MISSING") {
    //             throw catchErrorResponse(res, 400, "REQUIRED_PROPERTIES_MISSING", "Missing required properties", "Some required properties are missing from the request.");
    //         }

    //         if (err === "DUPLICATED_MIMETYPE") {
    //             throw catchErrorResponse(res, 404, "DUPLICATED_MIMETYPE", "Duplicated mymetype", "Cannot convert files from the same type");
    //         }

    //         if (err === "INVALID_TYPE") {
    //             throw catchErrorResponse(res, 400, "INVALID_TYPE", "An Error occurred during the file upload process. Details: ", err);
    //         }

    //         throw catchErrorResponse(res, 500, "INTERNAL_SERVER_ERROR", "Internal server error", "An error occurred while processing the operation. Please try again or contact support if the issue persists.");
    //     }
    // }

    async uploadFile(req: Request, res: Response): Promise<Response> {
        const { buffer, mimetype, originalname } = req.file!;
        const { userId } = req.params;

        try {

            const fileLensUpload = new FileLensUpload(userId, buffer, mimetype, originalname);

            const response = await fileService.uploadFileToGCS(fileLensUpload)

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


    async retriveUserFiles(req: Request, res: Response): Promise<Response> {
        const { userId } = req.params;

        try {
            return res.status(200).json(await fileService.retrieveFilesFromGCS(userId))
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

export default new GemmApiController()