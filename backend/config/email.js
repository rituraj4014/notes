require('dotenv').config();
const nodemailer = require('nodemailer');
const config = require("./config.json")

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
});

const send_mail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        try {
            transporter.sendMail(mailOptions, (error, info) => {
                if(error){
                    reject(error);
                }
                else{
                    resolve(info);
                }
            });
        } catch (error) {
            reject(error);
        }
    })
};

module.exports = {transporter, send_mail};