import { Schema, model } from "mongoose";

export interface IUser {
  _id?: unknown;
  name: string;
  username: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user", required: true },
  },
  { timestamps: true },
);

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
