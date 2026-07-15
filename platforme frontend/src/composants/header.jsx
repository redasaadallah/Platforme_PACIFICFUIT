import "../styles/header.css"
import france from "../img/france.png"
import arow from "../img/up-down-arow.png"
import logoclient from "../img/client.png"
import arow1 from "../img/arowupdown.png"
import logo from "../img/logo.png"
import logoo from "../img/logoo.png"
import menu from "../img/menu.png"
import close from "../img/close.png"
import homefilled from "../img/home.png"
import homevide from "../img/homevide.png"
import info from "../img/info.png"
import infofilled from "../img/infofilled.png"
import contact from "../img/contact.png"
import booking from "../img/booking.png"
import cancel from "../img/cancel.png"
import contactfilled from "../img/contactfilled.png"
import { useState } from "react"
import {useNavigate} from "react-router-dom"
import timetable from "../img/timetable.png"
function Header({at,atphone,at1}){
    const [show,setshow]=useState(0);
    const [showR,setshowR]=useState(0);
    const navigate=useNavigate();
    
    return(<>
    <div id="header">
        <div ></div>
        <img src={logo} alt=""/>
        <img onClick={()=>{setshow(1)}} src={menu} alt=""/>
        <div>
        <button onClick={()=>{navigate("/home")}} style={at === 0 ? { color: "#0A8D47",borderBottom:"solid 2px #0A8D47" } : {}}>Accueil</button>
        <button onClick={()=>{navigate("/apropos")}} style={at === 1 ? { color: "#0A8D47",borderBottom:"solid 2px #0A8D47" } : {}}>À propos</button>
       <div style={{position:"relative"}} className="reservation-menu">
        <button onMouseEnter={()=>{setshowR(1)}}  style={at === 2 ? { color: "#0A8D47",borderBottom:"solid 2px #0A8D47" } : {}}>Réservation</button>    
        {showR===1 && <div onMouseLeave={()=>{setshowR(0)}} id="menuR"><button style={at1 === 1 ? { color: "#0A8D47",borderBottom:"solid 2px #0A8D47" } : {}} onClick={()=>{navigate("/reservation")}}>Accéder à ma réservation</button><button style={at1 === 2 ? { color: "#0A8D47",borderBottom:"solid 2px #0A8D47" } : {}} onClick={()=>{navigate("/demander")}}>Réserver un espace</button></div>}

       </div>
        <button onClick={()=>{navigate("/contact")}} style={at === 4 ? { color: "#0A8D47",borderBottom:"solid 2px #0A8D47" } : {}}>Contact</button>
        </div>
        <button onClick={()=>{navigate("/reservation");}}><img src={logoclient} alt=""/>Espace Client</button>
     </div>
     {/* ===================================================== */}
     <div className={show===0?"headermenu":"showmenu"}>
        <div>
        </div>
        <div >
            <div><img onClick={()=>{setshow(0);setshowR(0)}} src={close}/></div>
            <img src={logoo}/>
            <div>
                <button onClick={()=>{atphone!==0 && navigate("/home")}} id={atphone===0?"atphone":"natphone"} ><img src={atphone===0?homefilled:homevide}/>Accueil</button>
                <button onClick={()=>{atphone!==1 && navigate("/apropos")}} id={atphone===1?"atphone":"natphone"}><img src={atphone===1?infofilled:info}/>À propos</button>
                <div style={{position:"relative",display:"flex",flexDirection:"column",gap:"5px"}}>
                <button id={(atphone === 2 || atphone === 3) ? "atphone" : "natphone"} onClick={()=>{showR===0?setshowR(1):setshowR(0)}}><img img src={(atphone === 2 || atphone === 3)?timetable:booking} />Réservation</button>
                {showR===1&&
                <div id="menuphone">
                    <button  style={atphone===2?{
                        backgroundColor: "#0A8D47",
                        fontSize: "clamp(1rem, 1vw, 3rem)",
                        whiteSpace: "nowrap",
                        color: "white",
                    }:{}} onClick={()=>{navigate("/reservation")}}>Accéder à ma réservation</button>
                    <button style={atphone===3?{
                        backgroundColor: "#0A8D47",
                        fontSize: "clamp(1rem, 1vw, 3rem)",
                        whiteSpace: "nowrap",
                        color: "white",
                    }:{}} onClick={()=>{navigate("/demander")}}>Réserver un espace</button>
                </div>}
                </div>
                <button 
                 onClick={()=>{atphone!==4 && navigate("/contact")}} id={atphone===4?"atphone":"natphone"}><img src={atphone===4?contactfilled:contact}/>Contact</button>
                
            </div>
           

        </div>
     </div>
     </>
     );
}
export default Header;