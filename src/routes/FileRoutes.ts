import { Router } from 'express';
import multer from 'multer';
import fileController from '../controllers/FileController';
import { CustomError } from '../model/CustomError';

const fileRoutes = Router()

const upload = multer({ storage: multer.memoryStorage() });

fileRoutes.get('/file/user/:userId', async (req, res) => {
    await fileController.retriveUserFiles(req, res)
})

fileRoutes.post('/file/upload/:userId', upload.single('file'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: new CustomError("FILE_NOT_FOUND", 404, "The requested file could not be found. Please verify the request and try again, or contact support for assistance.") });
    }
    await fileController.uploadFile(req, res)
});

fileRoutes.post('/file/extract-data', upload.single('file'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: new CustomError("FILE_NOT_FOUND", 404, "The requested file could not be found. Please verify the request and try again, or contact support for assistance.") });
    }
    await fileController.extractDataFromFile(req, res)
})

fileRoutes.post('/file/generate/f/text', async (req, res) => {
    await fileController.generateFileFromText(req, res)
})

fileRoutes.post('/file/generate/f/data', upload.single('file'), async (req, res) => {
    if (!req.file) {
        res.status(404).json({ error: new CustomError("FILE_NOT_FOUND", 404, "The requested file could not be found. Please verify the request and try again, or contact support for assistance.") });
    }
    await fileController.generateFileFromData(req, res)
})

fileRoutes.post('/file/convert', upload.single('file'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: new CustomError("FILE_NOT_FOUND", 404, "The requested file could not be found. Please verify the request and try again, or contact support for assistance.") });
    }
    await fileController.convertFile(req, res)
})

export default fileRoutes;