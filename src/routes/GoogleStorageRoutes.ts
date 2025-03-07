import { Request, Response, Router } from 'express';
import googleStorageController from '../controllers/GoogleStorageController';
import authenticateToken from '../middlewares/middleware';
import multer from 'multer';

const taskRoutes = Router()

const storage = multer.memoryStorage();
const upload = multer({ storage });

taskRoutes.post('/file/upload', authenticateToken, upload.single('file'), (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ error: 'Arquivo não enviado' });
    }
    googleStorageController.uploadFile(req, res)
});

export default taskRoutes;