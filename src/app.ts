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
    res.send("Welcome to the TaskList Service. See the documentation and learn how to use the endpoints")
});

app.use('/api/v1', userRoutes, fileRoutes)

app.use(errorMiddleware as unknown as express.ErrorRequestHandler)

app.use((err: Error, _: Request, res: Response) => {

    if (err instanceof CustomError) {
        res.status(err.statusCode).json({
            errorCode: err.statusCode,
            errorMessage: err.message,
            errorDescription: err.details,
        });
    }

    console.error(err);

    res.status(500).json({
        errorCode: 'INTERNAL_SERVER_ERROR',
        errorMessage: 'An unexpected error occurred.',
        errorDescription: 'Please try again later or contact support if the issue persists.',
    });
});

export default app;