import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { register } from './interfaces/register.interface';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const BASE_URL: string = "/auth/v1";
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post(`${BASE_URL}/register`, (req:Request, res:Response)=>{
    let data:register = req.body;
    //TODO: Register logic
    return res.status(201).json({
        message:"User Registered Successfully"
    })
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});