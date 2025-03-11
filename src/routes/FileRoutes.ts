import { Request, Response, Router } from 'express';
import multer from 'multer';
import fileController from '../controllers/FileController';

const fileRoutes = Router()

const upload = multer({ storage: multer.memoryStorage() });

fileRoutes.get('/file/user/:userId', async (req: Request, res: Response) => {
    fileController.retriveUserFiles(req, res)
})

fileRoutes.post('/file/upload/:userId', upload.single('file'), async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ error: 'File not found' });
    }
    fileController.uploadFile(req, res)
});

fileRoutes.post('/file/extract-data', upload.single('file'), async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ error: 'File not found' });
    }
    fileController.extractData(req, res)
})

fileRoutes.post('/file/convert', upload.single('file'), async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ error: 'File not found' });
    }
    fileController.convertFile(req, res)
})

export default fileRoutes;