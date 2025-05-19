const express = require('express');
const jwt = require('jsonwebtoken');
const config = require("../config/config.json");
const router = express.Router();

router.post('/info', async (req, res)=>{
    try {
        let check = check_request_body(req.body);
        if(check.state === false){
            return res.send(JSON.stringify({
                error: check.error
            }));
        }

        let result = await verifyToken(req.body.login_token, process.env.LOGIN_SECRET);
        if(result.state === false){
            return res.send(JSON.stringify({
                error: "Token expired!"
            }))
        }

        res.send(JSON.stringify({
            username: result.data.username,
            email: result.data.email,
            date: result.data.date
        }));
    }
    catch (error) {
        res.send(JSON.stringify({
            error: `${error}`
        }))    
    }
});

function check_request_body(body){
    if(!body.login_token){
        return {
            state: false,
            error: "Token not found!"
        }
    }
    else{
        return {
            state: true
        }
    }
}

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