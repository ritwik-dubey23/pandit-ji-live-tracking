import nodemailer from "nodemailer";

export const sendOtpMail = async (toEmail, otp) => {
    try {
        if (!process.env.EMAIL || !process.env.PASSWORD) {
            console.log(`[DEV OTP] OTP for ${toEmail}: ${otp}`);
            return;
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        const mailOptions = {
            from: `"Pandit Ji Booking" <${process.env.EMAIL}>`,
            to: toEmail,
            subject: "Password Reset OTP - Pandit Ji Booking Platform",
            html: `<h2>Your OTP for password reset is: <b>${otp}</b></h2><p>Valid for 5 minutes.</p>`
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP mail sent to ${toEmail}`);
    } catch (err) {
        console.error("Error sending mail:", err.message);
        console.log(`[FALLBACK DEV OTP] OTP for ${toEmail}: ${otp}`);
    }
};
