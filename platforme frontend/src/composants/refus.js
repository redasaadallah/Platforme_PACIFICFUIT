import "../styles/refus.css"
import "../styles/repondre.css"
import close from "../img/close.png"
import send from "../img/send1.png"
import React,{useEffect,useState} from "react"
import resoning from "../img/reasoning.png"
import axios from "axios";

export default function Refus({msg,closeWindow,refuser,sendText}){
    const [text,setText]=useState("")
    const handleSubmit=async(e)=>{
        e.preventDefault();
        refuser()
    }
    const handleChange=(e)=>{
            setText(e.target.value)
            sendText(text)
    }
    return(<>
    <div  id="black"></div>
     <form id="refus" onSubmit={handleSubmit} >
        <div>
            <img onClick={closeWindow} src={close}/>
        </div>
        <img src={resoning}/>
        <h1>La raison du refus de la demande</h1>
        
        <textarea required onChange={handleChange} name="reponce" placeholder="Raison"></textarea>
        <button  ><img src={send}/>Envoyer</button>
    </form>
    </>);
}