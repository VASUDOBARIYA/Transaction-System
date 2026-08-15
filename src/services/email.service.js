import nodemailer from "nodemailer"
import { clientsecret, clientid, emailuser, refreshtoken } from "../../env.js"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        type: 'OAUTH2',
        user: emailuser,
        clientId: clientid,
        clientSecret: clientsecret,
        refreshToken: refreshtoken
    },
});

transporter.verify((err, success) => {
    if(err){
        console.error('Error connecting to email server:', err);
    }else{
        console.log('Email server is ready to send messages');
    }
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Payment-System" <${emailuser}>`,
            to,
            subject,
            text,
            html
        });
    } catch (error) {
        console.error('Error while sending email', error);
    }
}

export const sendSignupEmail = async (userEmail, name)=>{
    const subject = "Welcome to our application!";
    const text = `Hello ${name},\n\nThank you for signing up for our application! We're excited to have you on board.\n\nBest regards,\nThe Team`;
    const html = `<p>Hello ${name},</p><p>Thank you for signing up for our application! We're excited to have you on board.</p><p>Best regards,<br>The Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

const getUserinfo = async ()=>{
    const now = new Date();

    if (typeof navigator === "undefined" || !navigator.geolocation) {
        return {
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString(),
            location: "Unknown location"
        };
    }

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {

                    console.log(position.coords.latitude,position.coords.longitude);

                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`);
                    const data = await response.json();

                    resolve({
                        date: now.toLocaleDateString(),
                        time: now.toLocaleTimeString(),
                        location: data.display_name ?? "Unknown location"
                    });
                } catch (error) {
                    console.log(error.message);
                    resolve({
                        date: now.toLocaleDateString(),
                        time: now.toLocaleTimeString(),
                        location: "Unknown location"
                    });
                }
            },
            (error) => {
                console.log(error.message);
                resolve({
                    date: now.toLocaleDateString(),
                    time: now.toLocaleTimeString(),
                    location: "Unknown location"
                });
            }
        );
    });
}

export const sendLoginEmail = async (userEmail, name) => {
    const userInfo = await getUserinfo();
    const subject = "Login Notification";
    const text = `Hello ${name},\n\nYou have successfully logged in on ${userInfo.date} at ${userInfo.time} from ${userInfo.location}.\n\nBest regards,\nThe Team`;
    const html = `<p>Hello ${name},</p><p>You have successfully logged in on ${userInfo.date} at ${userInfo.time} from ${userInfo.location}.</p><p>Best regards,<br>The Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

export const sendDebitEmail = async (userEmail, amount, transactionId) => {
    const subject = "Transaction Successful";
    const text = `Hello,\n\nYour transaction of ₹${amount.toFixed(2)} has been completed successfully with transaction ID: ${transactionId}.\n\nBest regards,\nThe Team`;
    const html = `<p>Hello,</p><p>Your transaction of ₹${amount.toFixed(2)} has been completed successfully with transaction ID: ${transactionId}.</p><p>Best regards,<br>The Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

export const sendCreditEmail = async (userEmail, amount, transactionId) => {
    const subject = "Transaction Successful";
    const text = `Hello,\n\nYou have received a credit of ₹${amount.toFixed(2)} with transaction ID: ${transactionId}.\n\nBest regards,\nThe Team`;
    const html = `<p>Hello,</p><p>You have received a credit of ₹${amount.toFixed(2)} with transaction ID: ${transactionId}.</p><p>Best regards,<br>The Team</p>`;  

    await sendEmail(userEmail, subject, text, html);
}

export const sendFailedTransectionEmail = async (userEmail, amount, transactionId) => {
    const subject = "Transaction Failed";
    const text = `Hello,\n\nYour transaction of ₹${amount.toFixed(2)} has failed with transaction ID: ${transactionId}.\n\nBest regards,\nThe Team`;
    const html = `<p>Hello,</p><p>Your transaction of ₹${amount.toFixed(2)} has failed with transaction ID: ${transactionId}.</p><p>Best regards,<br>The Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}