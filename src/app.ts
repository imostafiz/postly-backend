import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './app/routers';
import errorMiddleware from './app/erros/errorMiddlewares';
const app: Application = express();

//parser
app.use(express.json());
app.use(cors());

//application routes

app.use('/',router)

const getAController = (req: Request, res: Response) => {
  res.send('Postly social media platform backend server is running.');
};


app.get('/', getAController);

app.use((req: Request, res: Response) => {
  res.status(400).json({
    statusCode:400,
   success:false,
   message:"Route not found"
  })
 });
 
 app.use(errorMiddleware);


console.log(process.cwd());
export default app;
