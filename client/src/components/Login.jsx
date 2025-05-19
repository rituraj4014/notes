import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../config.json";
import "./Login-Register.css";

let offBtn = false;
export default function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState("NULL");

    async function onclick_login() {
        try {
            if(offBtn === false){
                offBtn = true;
                let usr_input = document.getElementById('login-usr');
                let pwd_input = document.getElementById('login-pwd');
        
                const response = await fetch(`/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: usr_input.value,
                        password: pwd_input.value
                    })
                });
                usr_input.value = "";
                usr_input.value = "";

                let data = await response.json();
                if(data.status === "Failed!"){
                    setError(data.action);
                }
                else if(data.status === "Success!"){
                    localStorage.setItem('login_token', data.login_token);
                    setError("Logged In!");
                    setTimeout(() => {
                        navigate('/home');
                    }, 750);
                }
                else if(data.error){
                    setError(data.error);
                }
                offBtn = false;
            }
        }
        catch (error) {
            setError(`${error}`);
            console.log(error);
        }
    }
    
    function show_error(){
        if(error !== "NULL"){
            return (<div style={{marginTop: "6px"}}>{error}</div>);
        }
    }

    return (<>
        <div className="login-box">
            <img src="notes-logo.png" alt="not found" />
            <div style={{color: "#AAC8A7", fontSize: "36px"}}>Notes</div>
            <div className="login-content">Login</div>
            <div className="login-input">
                <input id="login-usr" type="text" placeholder="Username or Email" style={{marginBottom: "5px"}}/> <br />
                <input id="login-pwd" type="password" placeholder="Password" /> <br />
                <button className="login-btn" style={{marginTop: "20px"}} onClick={async ()=>{await onclick_login()}}>Login</button>
            </div>
            {show_error()}

            <div className="register">
                Do not have account? <br />
                <Link to="/register" className="link-fix"><button className="login-btn" style={{marginTop: "15px"}}>Create Account</button></Link>
            </div>
        </div>
    </>);
};
