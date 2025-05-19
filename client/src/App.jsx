import React, { useEffect } from "react";
// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login"
import Register from "./components/Register"

function Index() {
    const navigate = useNavigate();
    useEffect(() => {
        let login_token = localStorage.getItem('login_token');
        if(login_token){
            navigate('/home');
        }
        else{
            navigate('/login');
        }
    }, [navigate]);

    return (<h1>Welcome to index.</h1>);
}



function NoPage() {
    function show(){
        let element = <div>404 Page Not Found!</div>;
        return element;
    }

    return (<>
        {show()}
    </>);
}


function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route index element={<Index />} />
                <Route path="home" element={<Home />}/>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />}/>
                <Route path="*" element={<NoPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;