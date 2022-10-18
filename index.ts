import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { register } from './interfaces/register.interface';
import { login } from './interfaces/login.interface';
import mongoose, { ConnectOptions } from 'mongoose';
import crypto from "crypto"
import { credential } from './models/credential.model'
import fs from "fs"
import { getDefaultFormatCodeSettings } from 'typescript';
import { GenPassword, validatePassword } from './utils/PasswordUtils';
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

app.post(`${VERSION}/${AUTH_URL}/register`, async (req: Request, res: Response) => {
  let data: register = req.body;
  const hashedPassword = await GenPassword(data.password)
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
  try {
    let isValid = await validatePassword(req.body)
    if (isValid) {
      let user = await credential.findOne({ username: req.body?.username })
      res.status(200).json(user)
    } else {
      throw ('Password or Username is Incorrect')
    }
  } catch (error:any) {

    return res.status(500).json({ error })
  }

})

app.get(`${VERSION}/${ONBOARDING_URL}/welcome`, (_req: Request, res: Response) => {
  fs.readFile("./resource/welcome.json", 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "An Error Occured",
        error: err
      })
    }
    const file = JSON.parse(data)
    file.Status = true;

    fs.writeFile("./resource/welcome.json", JSON.stringify(file), (err) => {
      if (err) {
        return res.status(500).json({
          message: "An Error Occured",
          error: err
        })
      }
      return res.status(200).json({
        message: "Successful",
        data: { ...file }
      })
    })
  })
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});