import { Schema, model } from 'mongoose'

const viewSchema = new Schema({
   name: {
      type: String,
      required: false,
      unique: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   date: {
      type: Date,
      default: Date.now,
      unique: false,
   },
})

const User = model('user1', viewSchema)

export default User

const test = 'Hello world shfdbjsdf'
const abc = 'abc'
