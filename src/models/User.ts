import mongoose from "mongoose";

interface IUser extends mongoose.Document {
  email: string;
  otp?: string;
  otpExpires?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpires: { type: Date },
});

export default mongoose.model<IUser>("User", userSchema);
