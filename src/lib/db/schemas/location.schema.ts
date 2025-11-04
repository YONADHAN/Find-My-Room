// models/Location.ts
import mongoose, { Schema, model, models } from 'mongoose'

const LocationSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    city: { type: String, default: 'Kochi' },
    description: { type: String },
    image: { type: String },
  },
  { timestamps: true }
)

const Location = models.Location || model('Location', LocationSchema)
export default Location
