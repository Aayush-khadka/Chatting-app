import mongoose, { Document, mongo, Schema } from "mongoose";

export interface IUser extends Document {
  name: String;
  email: String;
}

const schema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const user = mongoose.model<IUser>("User", schema);
