import "../styles/baradmin.css"
import logo from "../img/logo.png"
import homefilled from "../img/home.png"
import home from "../img/home (1).png"
import ad1 from "../img/ad1.png"
import ad2 from "../img/ad2.png"
import ad3 from "../img/ad3.png"
import ad4 from "../img/ad4.png"
import ad5 from "../img/ad5.png"
import ad6 from "../img/ad6.png"
import ad7 from "../img/ad7.png"
import ad8 from "../img/ad8.png"
import logout from "../img/log-out.png"
import {useNavigate} from "react-router-dom"
import menu from "../img/menu.png"
import { useState } from "react"
function Baradmin({closeWindow,page}){
    const navigate=useNavigate();
    const [show, setShow] = useState(false);
    const toggleAnimation = () => {
        setShow(prev => !prev);
    };
    return(<>
    <div id="baradmin">
        <img src={logo}/>
        <div>
        <div id={page===1?"indiv":""}>
            <img src={page===1?homefilled:home}/>
            <button onClick={()=>{navigate("/dashboard")}} className="b" id={page===1?"in":""}id={page===1?"in":""}>Accueil</button>
        </div>
        <div id={page===2?"indiv":""}>
            <img src={page===2?ad5:ad1}/>
            <button onClick={()=>{navigate("/admindemande")}} className="b" id={page===2?"in":""}>Demandes</button>
        </div>
        <div id={page===3?"indiv":""}>
            <img src={page===3?ad6:ad2}/>
            <button className="b" onClick={()=>{navigate("/adminreservation")}} id={page===3?"in":""}>Réservations</button>
        </div>
        <div id={page===4?"indiv":""}>
            <img src={page===4?ad7:ad3}/>
            <button className="b" onClick={()=>{navigate("/statistic")}} id={page===4?"in":""}>Statistiques</button>
        </div>
        <div id={page===5?"indiv":""}>
            <img src={page===5?ad8:ad4}/>
            <button className="b" onClick={()=>{navigate("/parametre")}} id={page===5?"in":""}>Paramètres</button>
        </div>
        </div>
        <div>
            <img src={logout}/>
            <button onClick={closeWindow} className="b">Se déconnecter</button>
        </div>
    </div>
    {/* ===============================la bare pour les telephones */}
    <div className={`white ${show ? "cover" : ""}`}></div>
    <div className={`box ${show ? "show" : ""}`}>
        reda
    </div>
    <button onClick={toggleAnimation} id='buttonmenu'><img src={menu}/></button>
    <div id='baradminphone'>
        <div id='selected'><button id='selectedbutton'><img id='selectedimg' src={ad5}/></button>
        <p id='selectedp'>Accueil</p>
        </div>
        <div><button><img src={ad1}/></button>
        <p>Demandes</p>
        </div>
        <div><button><img src={ad2}/></button>
        <p>Réservations</p>
        </div>
        <div><button><img src={ad3}/></button>
        <p>Statistiques</p>
        </div>
        <div><button><img src={ad4}/></button>
        <p>Paramètres</p>
        </div>
        
    </div>
    </>);
}
export default Baradmin;