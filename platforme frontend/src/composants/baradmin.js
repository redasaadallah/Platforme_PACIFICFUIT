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
import clipboardgreen from "../img/clipboardgreen.png"
import menugreen from "../img/menugreen.png"
import homegreen from "../img/homegreen.png"
import adjustgreen from "../img/adjustgreen.png"
import statisticsgreen from "../img/statisticsgreen.png"
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
   
    <div id='baradminphone'>
        <div ><button onClick={()=>{navigate("/dashboard")}} id={page===1?'selectedbutton':""}><img  src={page===1?homegreen:home} /></button>
        <p >Accueil</p>
        </div>
        <div><button onClick={()=>{navigate("/admindemande")}} id={page===2?'selectedbutton':""}><img src={page===2?clipboardgreen:ad1}/></button>
        <p>Demandes</p>
        </div>
        <div><button onClick={()=>{navigate("/adminreservation")}} id={page===3?'selectedbutton':""}><img src={page===3?menugreen:ad2}/></button>
        <p>Réservations</p>
        </div>
        <div><button onClick={()=>{navigate("/statistic")}} id={page===4?'selectedbutton':""}><img src={page===4?statisticsgreen:ad3}/></button>
        <p>Statistiques</p>
        </div>
        <div><button onClick={()=>{navigate("/parametre")}} id={page===5?'selectedbutton':""}><img src={page===5?adjustgreen:ad4}/></button>
        <p>Paramètres</p>
        </div>
        
    </div>
    </>);
}
export default Baradmin;