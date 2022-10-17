import mongoose from "mongoose"

const credentialSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    }
  })
  
export const credential = mongoose.model("credential", credentialSchema, "credentials")