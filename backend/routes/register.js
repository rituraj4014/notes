require('dotenv').config();
const express = require('express');
const User = require("../models/User");
const Otp = require("../models/Otp");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {send_mail} = require("../config/email");
const config = require("../config/config.json");
const router = express.Router();

// root
router.post('/', async (req, res)=>{

    let check = await checkUserSendedData(req.body);
    if(check.state != true){
        return res.send(JSON.stringify({
            error: check.status
        }));
    }

    
    try {
        let otp_code = generate_otp_code();
        let payload = {
            type: "Account creation",
            code: otp_code,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };
        
        const otp_token = jwt.sign(payload, process.env.OTP_SECRET);

        let mailOptions = {
            from: config.gmail_info.email,
            to: req.body.email,
            subject: 'Notes Verification OTP',
            text: `Your one-time password (OTP) for registering your account is: ${otp_code}.`
        };
        let email_info = await send_mail(mailOptions);

        if(email_info.accepted == req.body.email){
            await Otp.deleteMany({otp_email: req.body.email});
            
            const newOtp = new Otp({
                otp_type: "Account creation",
                otp_code: otp_code,
                otp_email: req.body.email,
            });
            await newOtp.save();
            
            res.send(JSON.stringify({
                status: "otp sent!",
                otp_token: otp_token
            }));
        }
        else{
            res.send(JSON.stringify({
                status: "otp failed!",
                error: "Check your email."
            }));
        }
    }
    catch (err){
        console.log(`ERROR: ${err}`);
        return res.send(JSON.stringify({
            error: `${err}`
        }));
    }
})

async function checkUserSendedData(data) {
    let check = {
        state: false,
        status: "bad"
    };

    try {
        if(data.username.length < 5){
            check.state = false;
            check.status = "Invalid username length";
        }
        else if(data.password.length < 8){
            check.state = false;
            check.status = "Invalid password length";
        }
        else{
            const username = await User.findOne({username: data.username});
            if(username){
                check.state = false;
                check.status = "Username already exists!";
                return check;
            }

            const email = await User.findOne({ email: data.email});
            if(email){
                check.state = false;
                check.status = "Email already registered!";
                return check;
            }

            check.state = true;
            check.status = "okay";
        }
        return check;
    } catch (error) {
        check.state = false;
        check.status = "Bad request";
        console.log(`ERROR: ${error}`);
        return check;
    }
}

function generate_otp_code() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// /verify
router.post('/verify', async (req, res)=>{
    try {
        let result = await verifyToken(req.body.otp_token, process.env.OTP_SECRET);

        let current_timestamp = Date.now() / 1000;
        if(current_timestamp > (result.iat + process.env.OTP_TIME)){
            return res.send(JSON.stringify({
                status: "Failed!",
                action: "OTP expired!"
            }));
        }
        
        const otp_exists = await Otp.findOne({otp_email: result.email});
        if(!otp_exists){
            return res.send(JSON.stringify({
                status: "Failed!",
                action: "OTP not exists!"
            }));
        }

        if(result.code == req.body.otp_code){

            let saltPass = bcrypt.genSaltSync(10);
            let hashPass = bcrypt.hashSync(result.password, saltPass);
            
            const newUser = new User({
                username: result.username,
                email: result.email,
                password: hashPass
            });
            await newUser.save();

            await Otp.deleteMany({otp_email: result.email});

            return res.send(JSON.stringify({
                status: "Verified!",
                action: "Account created!"
            }));
        }
        else{
            return res.send(JSON.stringify({
                status: "Failed!",
                action: "Invaild OTP!"
            }));
        }
    }
    catch (err) {
        return res.send(JSON.stringify({
            status: "verify failed!",
            error: `${err}`
        }));
    }
});


function verifyToken(token, secret) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
}


module.exports = router;