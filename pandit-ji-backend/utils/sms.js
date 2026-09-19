export const sendWhatsAppBookingAlert = async (booking) => {
    try {
        const panditPhone = booking.pandit?.mobile || booking.userMobile;
        const sid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

        const textMessage = `🕉️ *Maharaj Ji Booking Request Alert!*\n\n` +
            `*Service:* ${booking.serviceName}\n` +
            `*Mode:* ${booking.bookingType === 'instant' ? '⚡ Instant' : '📅 Scheduled'}\n` +
            `*Customer:* ${booking.userName} (${booking.userMobile})\n` +
            `*Date & Time:* ${booking.date} (${booking.time})\n` +
            `*Venue:* ${booking.address}\n` +
            `*Dakshina Amount:* ₹${booking.totalAmount}\n\n` +
            `Please open your Partner Dashboard to accept/manage this booking!`;

        if (sid && authToken && panditPhone) {
            const formattedPhone = panditPhone.startsWith("+") ? panditPhone : `+91${panditPhone.replace(/\D/g, '')}`;
            const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
            const params = new URLSearchParams();
            params.append("From", fromWhatsApp);
            params.append("To", `whatsapp:${formattedPhone}`);
            params.append("Body", textMessage);

            const authHeader = "Basic " + Buffer.from(`${sid}:${authToken}`).toString("base64");
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": authHeader,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: params.toString()
            });

            if (response.ok) {
                console.log(`[WHATSAPP SUCCESS] WhatsApp alert sent to ${formattedPhone}`);
            } else {
                const errData = await response.text();
                console.error("[WHATSAPP ERROR] Twilio response error:", errData);
            }
        } else {
            console.log(`[DEV WHATSAPP ALERT] To ${panditPhone || "Pandit Ji"}:\n${textMessage}`);
        }
    } catch (err) {
        console.error("[WHATSAPP ERROR] Failed to send WhatsApp alert:", err.message);
    }
};

export const sendSMSBookingAlert = async (booking) => {
    try {
        const panditPhone = booking.pandit?.mobile || booking.userMobile;
        const sid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromPhone = process.env.TWILIO_PHONE_NUMBER;

        const smsText = `Maharaj Ji Alert: New booking request for ${booking.serviceName} on ${booking.date} (${booking.time}) from ${booking.userName} (${booking.userMobile}). Amount: Rs.${booking.totalAmount}. Address: ${booking.address}`;

        if (sid && authToken && fromPhone && panditPhone) {
            const formattedPhone = panditPhone.startsWith("+") ? panditPhone : `+91${panditPhone.replace(/\D/g, '')}`;
            const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
            const params = new URLSearchParams();
            params.append("From", fromPhone);
            params.append("To", formattedPhone);
            params.append("Body", smsText);

            const authHeader = "Basic " + Buffer.from(`${sid}:${authToken}`).toString("base64");
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": authHeader,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: params.toString()
            });

            if (response.ok) {
                console.log(`[SMS SUCCESS] SMS alert sent to ${formattedPhone}`);
            } else {
                const errData = await response.text();
                console.error("[SMS ERROR] Twilio response error:", errData);
            }
        } else {
            console.log(`[DEV SMS ALERT] To ${panditPhone || "Pandit Ji"}:\n${smsText}`);
        }
    } catch (err) {
        console.error("[SMS ERROR] Failed to send SMS alert:", err.message);
    }
};
