import React, { useState } from "react";
import { Link } from "react-router-dom";
import config from "../config.json";
import "./Login-Register.css";

let offBtn = false;

export default function Register() {
    
    const [error, setError] = useState("NULL");
    const [otp, setOtp] = useState("NULL");
    
    async function onclick_createAccount() {
        try {
            if( offBtn === false){
                offBtn = true;
                setError("Please wait!");
                let usr_input = document.getElementById("login-usr");
                let email_input = document.getElementById("login-email");
                let pwd_input = document.getElementById("login-pwd");
        
                const response = await fetch(`/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: usr_input.value,
                        email: email_input.value,
                        password: pwd_input.value
                    })
                });
                usr_input.value = "";
        
                let data = await response.json();
                if(data.error){
                    setError(data.error);
                }
                if(data.status === "otp sent!"){
                    sessionStorage.setItem('otp_token', data.otp_token);
                    setOtp("SENT");
                    setError("OTP sent!, Check your email!");
                }
                offBtn = false;
            }
            
        } catch (error) {
            setError(`${error}`);
            console.log(error);
        }
    }
    
    async function onclick_verifyOtp() {
        if(offBtn === false){
            offBtn = true;
            let usr_input = document.getElementById("login-usr");
            let token = null;
            token = sessionStorage.getItem('otp_token');
            const response = await fetch(`/api/auth/register/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    otp_code: usr_input.value,
                    otp_token: token
                })
            });
            let data = await response.json();
            if(data.status === "Failed!"){
                setError(data.action);
            }
            if(data.status === "Verified!"){
                setOtp(data.action);
            }
            offBtn = false;
        }
    }
    
    function show_error(){
        if(error !== "NULL"){
            if(error === "Error: No recipients defined"){
                return (<div style={{marginTop: "6px"}}>Invaild email address!</div>);
            }
            else{
                return (<div style={{marginTop: "6px"}}>{error}</div>);
            }
        }
    }

    function show_otp() {
        return (<>
            <div className="login-content">Verify OTP</div>
            <div className="login-input">
                <input id="login-usr" type="text" placeholder="Enter OTP" /> <br />
                <button className="login-btn" style={{marginTop: "20px"}} onClick={async ()=>{await onclick_verifyOtp()}}>Verfiy</button>
                {show_error()}
            </div>
        </>);
    }

    function show_create_account(){
        if(otp === "SENT"){
            return show_otp();
        }
        else if(otp === "Account created!"){
            return (<>
                <div className="login-content">Account Created!</div>
                <div className="register">
                    Please login to your account. <br />
                    <Link to="/login" className="link-fix"><button className="login-btn" style={{marginTop: "15px"}}>Login</button></Link>
                </div>
            </>);
        }
        else{
            return (<>
                <div className="login-content">Create Account</div>
                <div className="login-input">
                    <input id="login-usr" type="text" placeholder="Username" style={{marginBottom: "5px"}}/> <br />
                    <input id="login-email" type="text" placeholder="Email" style={{marginBottom: "5px"}}/> <br />
                    <input id="login-pwd" type="password" placeholder="Password" /> <br />
                    <button className="login-btn" style={{marginTop: "20px"}} onClick={async ()=>{await onclick_createAccount()}}>Create Account</button>
                    {show_error()}
                </div>

                <div className="register">
                    Already have account? <br />
                    <Link to="/login" className="link-fix"><button className="login-btn" style={{marginTop: "15px"}}>Login</button></Link>
                </div>
            </>);
        }
    }

    return (<>
        <div className="login-box">
            <img src="notes-logo.png" alt="not found" />
            <div style={{color: "#AAC8A7", fontSize: "36px"}}>Notes</div>
            {show_create_account()}
        </div>
    </>);
};
