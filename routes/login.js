require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require("../models/User");
const config = require("../config/config.json");
const router = express.Router();

router.post('/', async (req, res)=>{
    let check = await checkUserSendedData(req.body);
    if(check.state != true){
        return res.send(JSON.stringify({
            error: check.status
        }));
    }

    try {
        let data = await User.findOne({username: req.body.username});
        if(!data){
            data = await User.findOne({email: req.body.username});
        }

        let isVaildPass = bcrypt.compareSync(req.body.password, data.password);
        if(!isVaildPass){
            res.send(JSON.stringify({
                status: "Failed!",
                action: "Invaild password!"
            }));
        }
        else{
            let payload = {
                state: true,
                data: data
            };
            const login_token = jwt.sign(payload, process.env.LOGIN_SECRET);
            res.send(JSON.stringify({
                status: "Success!",
                action: "Logged In",
                login_token: login_token
            }))
        }
    }
    catch (error) {
        console.log(error);
        return res.send(JSON.stringify({
            error: `${error}`
        }));
    }
})

async function checkUserSendedData(data) {
    let check = {
        state: false,
        status: "User or email not found!"
    };

    try {
        const username = await User.findOne({username: data.username});
        if(username){
            check.state = true;
            check.status = "Username found!";
            return check;
        }
        const email = await User.findOne({ email: data.username});
        if(email){
            check.state = true;
            check.status = "Email found!";
            return check;
        }
        return check;
    }
    catch (error) {
        check.state = false;
        check.status = "Bad request";
        console.log(`ERROR: ${error}`);
        return check;
    }
}

module.exports = router;