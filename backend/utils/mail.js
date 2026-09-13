import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config();
// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {

        // email and password apni gamil ka
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});




export const sendOtpMail = async(to, otp) => {
    await transporter.sendMail({

        from: process.env.EMAIL,
        to,
        subject: "Password Reset Request",
        html: `    
          Dear User,
Dear User,

We received a request to reset your password for your **Vingo Pvt Ltd** account.

Your One-Time Password (OTP) is:

<h2 style="letter-spacing: 3px; color: #1a73e8;">${otp}</h2>

⏳ This OTP is valid for <b>5 minutes</b> only.

For your security, please do not share this code with anyone.

If you did not request this password reset, please ignore this email or contact our support team immediately.

Warm regards,
**Vingo Pvt Ltd**
Support Team


 `
    })



}