import { Request, Response, Router } from 'express';
import multer from 'multer';
import googleStorageController from '../controllers/GoogleStorageController';

const gcsRoutes = Router()

const upload = multer({ storage: multer.memoryStorage() });

gcsRoutes.post('/file/upload/:userId', upload.single('file'), async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ error: 'File not found' });
    }
    googleStorageController.uploadFile(req, res)
});

export default gcsRoutes;