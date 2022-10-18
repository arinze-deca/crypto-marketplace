import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { register } from './interfaces/register.interface';
import { login } from './interfaces/login.interface';
import mongoose, { ConnectOptions } from 'mongoose';
import crypto from "crypto"
import { credential } from './models/credential.model';
import fs from "fs"
import { getDefaultFormatCodeSettings } from 'typescript';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const VERSION: string = "/api/v1";
const AUTH_URL: string = "auth";
const ONBOARDING_URL: string = "onboarding";
app.use(express.json());
app.use(express.urlencoded());

mongoose.connect('mongodb://localhost:27017', {
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

app.post(`${VERSION}/${AUTH_URL}/register`, (req: Request, res: Response) => {
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
    console.log(error)
    return res.status(500).json({
      message: "Error Occured",
      error
    })
  })
})

app.post(`${VERSION}/${AUTH_URL}/login`, async (req: Request, res: Response) => {
  const data: login = req.body;
  //Assignment: Refactor hashing strategy to have it in one place only as it is repeated
  const hash512 = crypto.createHash('sha512');
  const hashData = hash512.update(data.password, 'utf-8');
  const hashedPassword = hashData.digest("hex");
  try {
    let user = await credential.findOne({
      username: data.username
    })
    if(user){
      return user?.password === hashedPassword ? res.status(200).json({
        message: "User Logged In Successfully"
      }) : res.status(403).json({
        message: "Incorrect Credentials"
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error Ocured",
      error
    })
  }
})

app.get(`${VERSION}/${ONBOARDING_URL}/welcome`, (_req: Request, res: Response) => {
  fs.readFile("./resource/welcome.json", 'utf-8', (err, data)=>{
    if(err){
      return res.status(500).json({
        message:"An Error Occured",
        error: err
      })
    }
    const file = JSON.parse(data)
    file.Status = true;

    fs.writeFile("./resource/welcome.json", JSON.stringify(file), (err)=>{
      if(err){
        return res.status(500).json({
          message:"An Error Occured",
          error: err
        })
      }
      return res.status(200).json({
        message:"Successful",
        data: {...file}
      })
    })
  })
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});