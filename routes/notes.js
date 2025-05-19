const express = require('express');
const jwt = require('jsonwebtoken');
const Note = require("../models/Note");
const config = require("../config/config.json");
const router = express.Router();

router.post('/get', async (req, res)=>{
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

        const all_notes = await Note.find({username: result.data.username});
        res.send(all_notes);
    }
    catch (error) {
        res.send(JSON.stringify({
           error: `${error}`
        }));
    }
});

router.post('/post', async(req, res)=>{
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

        const newNote = new Note({
            username: result.data.username,
            title: req.body.title,
            content: req.body.content
        });
        await newNote.save();

        return res.send(JSON.stringify({
            status: "Success!",
            action: "Note saved!"
        }));
    }
    catch (error) {
        console.log(`${error}`);
        return res.send(JSON.stringify({
            error: `${error}`
        }));
    }
});

router.post('/edit', async(req, res)=>{
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
            }));
        }

        let note = await Note.findById(req.body._id);
        if(!note){
            res.send(JSON.stringify({
                error: "Invaild note id!"
            }));
        }

        if(req.body.title){
            note.title = req.body.title;
        }
        if(req.body.content){
            note.content = req.body.content;
        }
        await note.save();

        res.send(JSON.stringify({
            status: "Success!",
            action: "Note edited!"
        }))
    }
    catch (error) {
        res.send(JSON.stringify({
            error: `${error}`
        }));
    }
});


router.post('/delete', async(req, res)=>{
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
            }));
        }

        let del_result = await Note.deleteOne({_id: req.body._id});
        if(del_result.deletedCount === 0){
            return res.send(JSON.stringify({
                error: "Could not find note!"
            }));
        }
        else{
            return res.send(JSON.stringify({
                status: "Success!",
                action: "Note Deleted!"
            }));
        }
    }
    catch (error) {
        res.send(JSON.stringify({
            error: `${error}`
        }));
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