import { Request, Response } from 'express'
import gemmAiService from '../services/GemmApiService'
import { catchErrorResponse } from '../exception/CatchErrorResponse'
import FileLensUpload from '../model/FileLensUpload';

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
}

export default new GemmApiController()