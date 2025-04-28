import express, { Application, Request, Response } from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser'
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';

const app :Application = express();

// middleware
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}
))


app.use(cookieParser())
app.use(express.json())

app.use('/api/', router)

app.use(globalErrorHandler)


//global api route
app.get('/', (req: Request, res: Response) => {
    res.json({
        status: true,
        message: 'Welcome to PH Healthcare',
    })
})


app.use(notFound)


export default app
