import nodemailer from "nodemailer";

const getTransporter = () => {
    if (!process.env.EMAIL || !process.env.PASSWORD) return null;
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
};

export const sendOtpMail = async (toEmail, otp) => {
    try {
        const transporter = getTransporter();
        if (!transporter) {
            console.log(`[DEV OTP] OTP for ${toEmail}: ${otp}`);
            return;
        }

        const mailOptions = {
            from: `"Maharaj Ji - Pandit Booking" <${process.env.EMAIL}>`,
            to: toEmail,
            subject: "Password Reset OTP - Maharaj Ji",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ffaa80; border-radius: 12px; background-color: #fff9f6;">
                    <h2 style="color: #ff4d2d; text-align: center;">🕉️ Maharaj Ji Partner Portal</h2>
                    <hr style="border: 0; border-top: 1px solid #ffe0d6;" />
                    <p style="font-size: 15px; color: #333;">Your OTP for password reset is:</p>
                    <div style="background-color: #ff4d2d; color: #ffffff; text-align: center; font-size: 28px; font-weight: bold; padding: 12px; border-radius: 8px; letter-spacing: 4px; margin: 15px 0;">
                        ${otp}
                    </div>
                    <p style="font-size: 13px; color: #666;">This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SUCCESS] OTP mail sent to ${toEmail}`);
    } catch (err) {
        console.error("[EMAIL ERROR] Error sending OTP mail:", err.message);
        console.log(`[FALLBACK DEV OTP] OTP for ${toEmail}: ${otp}`);
    }
};

export const sendBookingRequestMail = async (booking) => {
    try {
        const transporter = getTransporter();
        const panditEmail = booking.pandit?.email || booking.pandit?.user?.email;

        if (!transporter || !panditEmail) {
            console.log(`[DEV BOOKING MAIL] New booking request alert for Pandit Ji (${panditEmail || "No Email"}): ${booking.serviceName}`);
            return;
        }

        const mailOptions = {
            from: `"Maharaj Ji Booking" <${process.env.EMAIL}>`,
            to: panditEmail,
            subject: `🕉️ New Booking Request: ${booking.serviceName} - ₹${booking.totalAmount}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #ff4d2d; border-radius: 16px; background-color: #fff9f6;">
                    <div style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #ffe0d6;">
                        <h1 style="color: #ff4d2d; margin: 0; font-size: 24px;">🕉️ Maharaj Ji Partner Alert</h1>
                        <p style="color: #666; font-size: 14px; margin-top: 4px;">New Pooja Request Received!</p>
                    </div>

                    <div style="margin: 20px 0; background: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid #ffe0d6;">
                        <h3 style="color: #111; margin-top: 0;">Service Details:</h3>
                        <p style="margin: 6px 0;"><strong>Pooja Service:</strong> ${booking.serviceName}</p>
                        <p style="margin: 6px 0;"><strong>Booking Mode:</strong> ${booking.bookingType === 'instant' ? '⚡ Instant Booking' : '📅 Scheduled Booking'}</p>
                        <p style="margin: 6px 0;"><strong>Date & Time:</strong> ${booking.date} (${booking.time})</p>
                        <p style="margin: 6px 0;"><strong>Total Dakshina:</strong> ₹${booking.totalAmount}</p>
                    </div>

                    <div style="margin: 20px 0; background: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid #ffe0d6;">
                        <h3 style="color: #111; margin-top: 0;">Customer Venue & Contact:</h3>
                        <p style="margin: 6px 0;"><strong>Devotee Name:</strong> ${booking.userName}</p>
                        <p style="margin: 6px 0;"><strong>Mobile:</strong> <a href="tel:${booking.userMobile}" style="color: #ff4d2d; font-weight: bold;">${booking.userMobile}</a></p>
                        <p style="margin: 6px 0;"><strong>Venue Address:</strong> ${booking.address}</p>
                        ${booking.customRequirement ? `<p style="margin: 6px 0; color: #b45309;"><strong>Requirement:</strong> ${booking.customRequirement}</p>` : ''}
                    </div>

                    <p style="text-align: center; font-size: 13px; color: #777;">Please log in to your Pandit Ji Dashboard to accept or manage this booking request.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SUCCESS] Booking request email sent to Pandit Ji (${panditEmail})`);
    } catch (err) {
        console.error("[EMAIL ERROR] Failed to send booking request email:", err.message);
    }
};

export const sendBookingConfirmationMail = async (booking) => {
    try {
        const transporter = getTransporter();
        const userEmail = booking.user?.email;
        const panditEmail = booking.pandit?.email || booking.pandit?.user?.email;

        const recipientEmails = [userEmail, panditEmail].filter(Boolean);

        if (!transporter || recipientEmails.length === 0) {
            console.log(`[DEV CONFIRMATION MAIL] Booking confirmed for ${booking.serviceName} (${recipientEmails.join(", ")})`);
            return;
        }

        const mailOptions = {
            from: `"Maharaj Ji Booking" <${process.env.EMAIL}>`,
            to: recipientEmails.join(", "),
            subject: `🎉 Booking Confirmed! ${booking.serviceName} with ${booking.pandit?.name || 'Pandit Ji'}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 2px solid #22c55e; border-radius: 16px; background-color: #f0fdf4;">
                    <div style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #bbf7d0;">
                        <h1 style="color: #15803d; margin: 0; font-size: 24px;">🎉 Booking Confirmed!</h1>
                        <p style="color: #166534; font-size: 14px; margin-top: 4px;">Your Pooja request has been accepted by Pandit Ji.</p>
                    </div>

                    <div style="margin: 20px 0; background: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid #bbf7d0;">
                        <h3 style="color: #111; margin-top: 0;">Booking Summary:</h3>
                        <p style="margin: 6px 0;"><strong>Booking ID:</strong> #${booking._id.toString().slice(-6).toUpperCase()}</p>
                        <p style="margin: 6px 0;"><strong>Pooja Service:</strong> ${booking.serviceName}</p>
                        <p style="margin: 6px 0;"><strong>Pandit Ji:</strong> ${booking.pandit?.name || 'Vedic Acharya'}</p>
                        <p style="margin: 6px 0;"><strong>Date & Time:</strong> ${booking.date} (${booking.time})</p>
                        <p style="margin: 6px 0;"><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
                        <p style="margin: 6px 0;"><strong>Venue Address:</strong> ${booking.address}</p>
                    </div>

                    <p style="text-align: center; font-size: 13px; color: #166534;">You can track Pandit Ji's live location and updates in real-time from the <strong>My Bookings</strong> section on Maharaj Ji!</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SUCCESS] Booking confirmation email sent to ${recipientEmails.join(", ")}`);
    } catch (err) {
        console.error("[EMAIL ERROR] Failed to send booking confirmation email:", err.message);
    }
};

export const sendBookingCompletedMail = async (booking) => {
    try {
        const transporter = getTransporter();
        const userEmail = booking.user?.email;

        if (!transporter || !userEmail) {
            console.log(`[DEV COMPLETE MAIL] Ceremony completed email for ${userEmail}: ${booking.serviceName}`);
            return;
        }

        const mailOptions = {
            from: `"Maharaj Ji Booking" <${process.env.EMAIL}>`,
            to: userEmail,
            subject: `🚩 Ceremony Completed: ${booking.serviceName} - Maharaj Ji`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #3b82f6; border-radius: 16px; background-color: #eff6ff;">
                    <div style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #bfdbfe;">
                        <h1 style="color: #1d4ed8; margin: 0; font-size: 24px;">🚩 Ceremony Completed</h1>
                        <p style="color: #1e40af; font-size: 14px; margin-top: 4px;">Thank you for conducting your Vedic rituals with Maharaj Ji!</p>
                    </div>

                    <div style="margin: 20px 0; background: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid #bfdbfe;">
                        <p style="margin: 6px 0;"><strong>Service Name:</strong> ${booking.serviceName}</p>
                        <p style="margin: 6px 0;"><strong>Pandit Ji:</strong> ${booking.pandit?.name || 'Vedic Acharya'}</p>
                        <p style="margin: 6px 0;"><strong>Date:</strong> ${booking.date}</p>
                    </div>

                    <p style="text-align: center; font-size: 13px; color: #1e40af;">Please share your valuable feedback and rate Pandit Ji on Maharaj Ji!</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SUCCESS] Ceremony completed email sent to ${userEmail}`);
    } catch (err) {
        console.error("[EMAIL ERROR] Failed to send completion email:", err.message);
    }
};
