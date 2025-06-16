import express, { Request, Response, Router } from "express";
import User from "../models/User";
import nodemailer from "nodemailer";

const router: Router = express.Router();

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
}

async function sendOTP(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // user: process.env.EMAIL_USER,
      user: "vikaskumar264802@gmail.com",
      pass: "AIzaSyBGCC5kBWsi7UzU7_0cqVHwpmfWgk8-4iM",
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`,
  });
}

router.post("/register", async (req: Request, res: Response) => {
  const { email } = req.body;
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 300 * 1000); // OTP valid for 5 mins

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, otp, otpExpires });
      await user.save();
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
      console.log(user, "This is user $$$$$$");
      await user.save();
    }
    await sendOTP(email, otp);
    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.log(error, "this is errror");
    res.status(500).json({ error: "Error registering user." });
  }
});

// router.post("/login", async (req: Request, res: Response) => {
//     const { email, otp } = req.body;

//     try {
//         const user :any= await User.findOne({ email });
//         if  (!user || user.otp !== otp || Date.now() > user?.otpExpires.getTime()) {
//             return res.status(400).json({ message: "Invalid OTP or expired." });
//         }
//         res.status(200).json({ message: "Login successful!" });
//     } catch (error) {
//         res.status(500).json({ error: "Error logging in." });
//     }
// });

// router.post("/login", async (req: Request, res: Response) => {
//   const { email, otp } = req.body;

//   try {
//     const user: any = await User.findOne({ email });
//     if (!user || user.otp !== otp || Date.now() > user?.otpExpires.getTime()) {
//       return res.status(400).json({ message: "Invalid OTP or expired." });
//     }
//     res.status(200).json({ message: "Login successful!" });
//   } catch (error) {
//     res.status(500).json({ error: "Error logging in." });
//   }
// });

export default router;
