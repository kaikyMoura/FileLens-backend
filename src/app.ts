import express, { Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';
import fileRoutes from './routes/FileRoutes';
import userRoutes from './routes/UserRoutes';
import cors from 'cors';

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

app.use(userRoutes)
app.use(fileRoutes)

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;