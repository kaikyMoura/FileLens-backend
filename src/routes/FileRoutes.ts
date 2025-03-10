import { Request, Response, Router } from 'express';
import multer from 'multer';
import googleStorageController from '../controllers/GoogleStorageController';
import gemmApiController from '../controllers/GemmApiController';
import authenticateToken from '../middlewares/middleware';

const fileRoutes = Router()

const upload = multer({ storage: multer.memoryStorage() });

fileRoutes.post('/file/upload/:userId', upload.single('file'), async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ error: 'File not found' });
    }
    googleStorageController.uploadFile(req, res)
});

fileRoutes.post('/file/extract-data/', upload.single('file'), async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ error: 'File not found' });
    }
    gemmApiController.extractData(req, res)
})

export default fileRoutes;