import express, { NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';
import fileRoutes from './routes/FileRoutes';
import userRoutes from './routes/UserRoutes';
import cors from 'cors';
import { CustomError } from './model/CustomError';
import errorMiddleware from './middlewares/errorMidleware';

const app = express();

const environment = process.env.NODE_ENV || 'dev'

console.log(`Environment: ${environment}`);

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}))

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the FileLens Service. See the documentation and learn how to use the endpoints")
});

app.use('/api/v1', userRoutes, fileRoutes)

app.use(errorMiddleware)

export default app;