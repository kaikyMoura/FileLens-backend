import { Request, Response } from 'express';
import FileLensUpload from '../model/FileLensUpload';
import fileService from '../services/FileService';
import gemmAiService from '../services/GemmApiService';
import userService from '../services/UserService';
import { convertTo } from './../utils/fileUtils';

class FileController {

    async extractDataFromFile(req: Request, res: Response) {
        const { buffer, mimetype, originalname } = req.file!;

        const data = await gemmAiService.extractDataFromFile(new FileLensUpload(undefined, buffer, mimetype, originalname))

        return res.status(200).json(data)
    }

    async convertFile(req: Request, res: Response) {
        const { buffer, mimetype, originalname } = req.file!;
        const { to } = req.body

        const data = await convertTo(to, new FileLensUpload(undefined, buffer, mimetype, originalname))

        res.setHeader('Content-Disposition', `attachment; filename="${data.fileName}"`);
        res.setHeader('Content-Type', data.mimeType);

        return res.status(200).send(data.buffer);
    }

    async generateFileFromText(req: Request, res: Response) {
        const { type, text, fileTitle } = req.body

        console.log(req.body)

        const result = await fileService.generateFileFromText(type, text, fileTitle)

        res.setHeader('Content-Disposition', `attachment; filename="${result!.data.fileName}"`);
        res.setHeader('Content-Type', result!.data.mimeType);

        return res.status(200).send(result!.data.buffer);
    }


    async generateFileFromData(req: Request, res: Response) {
        const { buffer, mimetype, originalname } = req.file!

        const { type, userId } = req.body

        const result = await fileService.generateFileFromFileData(new FileLensUpload(userId, buffer, mimetype, originalname), type)

        res.setHeader('Content-Disposition', `attachment; filename="${result!.data.fileName}"`);
        res.setHeader('Content-Type', result!.data.mimeType);

        return res.status(200).send(result!.data.buffer);
    }

    async uploadFile(req: Request, res: Response) {
        console.log(req.file)
        const { buffer, mimetype, originalname } = req.file!;
        const { email } = req.body;
        
        console.log(buffer)

        const userId = (await userService.retrieveUserByEmail(email)).data?.id!
        const fileLensUpload = new FileLensUpload(userId, buffer, mimetype, originalname);

        const response = await fileService.uploadFileToGCS(fileLensUpload)

        return res.status(200).json(response)
    }


    async retriveUserFiles(req: Request, res: Response) {
        const { email } = req.body;

        const userId = (await userService.retrieveUserByEmail(email)).data?.id!

        return res.status(200).json(await fileService.retrieveFilesFromGCS(userId))
    }
}

export default new FileController()