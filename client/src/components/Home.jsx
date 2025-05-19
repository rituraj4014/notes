import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Note from "./Note";
import config from "../config.json";
import "./Home.css";


function Home() {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [takeNote, setTakeNote] = useState(false);
    const [takeNoteError, setTakeNoteError] = useState("NULL");

    async function fetchNotes() {
        try {
            const response = await fetch(`/api/notes/get`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login_token: localStorage.getItem('login_token')
                })
            });
    
            const data = await response.json();
            setNotes(data);
        }
        catch (error) {
            console.error(error);
        }
    }

    async function fetchUserInfo() {
        try {
            const response = await fetch(`/api/user/info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login_token: localStorage.getItem('login_token')
                })
            });

            const data = await response.json();
            setUserInfo(data);
        } 
        catch (error) {
            console.log(error);    
        }
    }
    
    const updateNotes = (newNotes) => {
        setNotes(newNotes);
    };

    useEffect(() => {
        let login_token = localStorage.getItem('login_token');
        if(login_token){
            fetchNotes();
            fetchUserInfo();
        }
        else{
            navigate('/login');
        }
    }, [navigate]);

    useEffect(()=>{
        document.addEventListener("click", function(event) {
            let element = document.getElementById("note-create-id");
            if (event.target !== element && !element.contains(event.target)) {
                if(takeNote === true){
                    onclick_createNoteCancel();
                }
            }
        });
    }, [takeNote]);

    function onclick_createNote() {
        let note_create = document.getElementById("note-create-id");
        note_create.classList.add("createNote");
        setTakeNote(true);
    }

    function onclick_createNoteCancel(){
        let note_create = document.getElementById("note-create-id");
        note_create.classList.remove("createNote");
        setTakeNote(false);
    }

    async function onclick_createNoteSave() {
        let note_title = document.getElementById("create-note-title-id");
        let note_content = document.getElementById("create-note-content-id");
        if(!note_title.innerText){
            return setTakeNoteError("Empty title!");
        }
        if(!note_content.innerText){
            return setTakeNoteError("Empty content!");
        }

        try {
            const response = await fetch(`/api/notes/post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: note_title.innerText,
                    content: note_content.innerText,
                    login_token: localStorage.getItem('login_token')
                })
            });
    
            const data = await response.json();
            setTakeNoteError(data.action);
            await fetchNotes();
            onclick_createNoteCancel();
        }
        catch (error) {
            console.error(error);
        }
    }

    function show_create_note_error() {
        if(takeNoteError !== "NULL"){
            setTimeout(() => {
                setTakeNoteError("NULL");
            }, 1000);
            return (<div style={{marginTop: "5px", marginBottom: "5px", textAlign: "center"}}>{takeNoteError}</div>)
        }
    }

    function create_take_note() {
        if(takeNote === false){
            return (<>
                <div className="note-add" id="note-create-id" onClick={()=>{onclick_createNote()}}>
                    Take a note...
                </div>
            </>);
        }
        else{
            return (<>
                <div className="note-add" id="note-create-id">
                    <div className="note-title create-note-title-placeholder" id="create-note-title-id" contentEditable={true} style={{overflowY: "scroll", maxHeight: "30px"}}></div>
                    <div className="note-content create-note-content-placeholder" id="create-note-content-id" contentEditable={true} style={{overflowY: "scroll"}}></div>
                    <div className="note-btns">
                        <div className="note-btn" id="note-save-btn" onClick={async ()=>{await onclick_createNoteSave()}} >Save</div>
                        <div className="note-btn" id="note-del-btn" onClick={()=>{onclick_createNoteCancel()}} style={{marginLeft: "5px"}}>Cancel</div>
                    </div>
                    {show_create_note_error()}
                </div>
            </>);
        }
    }

    return (<>
        <nav>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <div style={{display: "inline-block"}}>
                    <div className="icon-notes">
                        <img src="./notes-logo.png" alt="not found!" />
                        <div className="icon-notes-text">
                            Notes
                        </div>
                    </div>
                </div>
                <div style={{display: "inline-block", marginRight: "15px"}}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div className="profile-username-text">
                            {userInfo.username}
                        </div>
                        <img id="user-profile-img" src="./profile-logo.png" alt="not found!"/>
                    </div>
                </div>
            </div>
        </nav>
        {create_take_note()}
        <div className="notes" >
            {notes.map((note, index) => (
                <Note key={index} title={note.title} content={note.content} _id={note._id} updateNotes={updateNotes} />
            ))}
        </div>
    </>);
}

export default Home;