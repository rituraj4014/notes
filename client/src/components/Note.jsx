import React, { useEffect, useState, useRef} from "react";
import config from "../config.json"
;import "./Note.css";

function Note(props) {
    const [editable, setEditable] = useState(false);
    const [action, setAction] = useState("NULL");
    const noteRef = useRef(null);

    const onclick_note = async() => {
        let note_main = noteRef.current.querySelector("#note-main-id");
        let note_content = noteRef.current.querySelector("#note-content-id");
        note_main.classList.add("animate");
        note_content.classList.add("overflow");
        setEditable(true);
    }

    async function onclick_noteSaved() {
        let note_title = noteRef.current.querySelector("#note-title-id");
        let note_content = noteRef.current.querySelector("#note-content-id");

        try {
            const response = await fetch(`/api/notes/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    _id: props._id,
                    title: note_title.innerText,
                    content: note_content.innerText,
                    login_token: localStorage.getItem('login_token')
                })
            });
    
            const data = await response.json();
            setAction(data.action);

            setTimeout(async () => {
                let note_main = noteRef.current.querySelector("#note-main-id");
                let note_content = noteRef.current.querySelector("#note-content-id");
                note_main.classList.remove("animate");
                note_content.classList.remove("overflow");
                setEditable(false);
                setAction("NULL");
                props.updateNotes(await fetchNotes());
            }, 1000);
        }
        catch (error) {
            console.error(error);
        }
    }

    async function onclick_noteDelete() {
        try {
            const response = await fetch(`/api/notes/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    _id: props._id,
                    login_token: localStorage.getItem('login_token')
                })
            });

            const data = await response.json();
            setAction(data.action);

            setTimeout(async () => {
                let note_main = noteRef.current.querySelector("#note-main-id");
                let note_content = noteRef.current.querySelector("#note-content-id");
                note_main.classList.remove("animate");
                note_content.classList.remove("overflow");
                setEditable(false);
                setAction("NULL");
                props.updateNotes(await fetchNotes());
            }, 1000);
        }
        catch (error) {
            console.log(error);   
        }
    }

    
    useEffect(()=>{
        document.addEventListener("click", function(event) {
            if(noteRef.current){
                let element = noteRef.current.querySelector("#note-main-id");
                if (event.target !== element && !element.contains(event.target)) {
                    if(editable === true){
                        let note_main = noteRef.current.querySelector("#note-main-id");
                        let note_content = noteRef.current.querySelector("#note-content-id");
                        note_main.classList.remove("animate");
                        note_content.classList.remove("overflow");
                        setAction("NULL");
                        setEditable(false);
                    }
                }
            }
        });
    }, [editable]);

    const show_btn = ()=>{
        if(editable === true){
            return (
                <div className="note-btns">
                    <div className="note-btn" id="note-save-btn" onClick={async ()=>{await onclick_noteSaved()}}>Save</div>
                    <div className="note-btn" id="note-del-btn" onClick={async ()=>{await onclick_noteDelete()}} style={{marginLeft: "5px"}}>Delete</div>
                </div>
            );
        }
    }

    function show_action() {
        if(action !== "NULL"){
            return (<div className="note-isSaved">{action}</div>);
        }
    }

    return (<>
        <div className="top-note" ref={noteRef}>
            <div className="note-main" id="note-main-id" onClick={async ()=>{await onclick_note()}}>
                <div className="note-title" id="note-title-id" contentEditable={editable}>{props.title}</div>
                <div className="note-content" id="note-content-id" contentEditable={editable}>{props.content}</div>
                {show_btn()}
                {show_action()}
            </div>
        </div>
    </>);
}


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
        return data;
    }
    catch (error) {
        console.error(error);
    }
}

export default Note;