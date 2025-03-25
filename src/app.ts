import cors from 'cors';
import express, { Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';
import errorHandler from './middlewares/errorHandler';
import fileRoutes from './routes/FileRoutes';
import userRoutes from './routes/UserRoutes';

const app = express();

const environment = process.env.NODE_ENV || 'dev'

console.log(`Environment: ${environment}`);

app.use(cors({
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200
}))

app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('combined'));


app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the FileLens Service. See the documentation and learn how to use the endpoints")
});

app.use('/api/v1', userRoutes, fileRoutes)

app.use(errorHandler)

export default app;