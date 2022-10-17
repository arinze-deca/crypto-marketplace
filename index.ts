import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { register } from './interfaces/register.interface';
import { login } from './interfaces/login.interface';
import mongoose, { ConnectOptions } from 'mongoose';
import crypto from "crypto"
import { credential } from './models/credential.model';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const VERSION: string = "/api/v1";
const BASE_URL: string = "auth";
app.use(express.json());
app.use(express.urlencoded());

mongoose.connect('mongodb://localhost:27017/crypto-market', {
  autoIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions, (data: any) => {
  if (!data) {
    console.log("Connected")
  }
})

app.get('/', (req: Request, res: Response) => {
  res.send('Express is your firend + TypeScript Server');
});

app.post(`${VERSION}/${BASE_URL}/register`, (req: Request, res: Response) => {
  let data: register = req.body;
  const hash512 = crypto.createHash('sha512');
  const hashData = hash512.update(data.password, 'utf-8');
  const hashedPassword = hashData.digest("hex");
  credential.create({
    email: data.email,
    username: data.username,
    password: hashedPassword
  }).then(data => {
    return res.status(201).json({
      message: "User Registered Successfully"
    })
  }).catch(error => {
    return res.status(500).json({
      message: "Error Occured",
      error
    })
  })
})

app.post(`${VERSION}/${BASE_URL}/login`, (req: Request, res: Response) => {
  const data: login = req.body;
  //Assignment: Refactor hashing strategy to have it in one place only as it is repeated
  const hash512 = crypto.createHash('sha512');
  const hashData = hash512.update(data.password, 'utf-8');
  const hashedPassword = hashData.digest("hex");
  credential.findOne({
    username: data.username
  }).then(user => {
    return user?.password === hashedPassword ? res.status(200).json({
      message: "User Logged In Successfully"
    }) : res.status(403).json({
      message: "Incorrect Credentials"
    })
  }).catch(error => {
    return res.status(500).json({
      message: "Error Ocured",
      error
    })
  })
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});