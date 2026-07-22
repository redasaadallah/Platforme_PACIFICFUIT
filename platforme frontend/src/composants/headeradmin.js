import "../styles/headeradmin.css"
import logout from "../img/log-out.png"
import france from "../img/france.png"
import arow from "../img/up-down-arow.png"
import React,{useEffect,useState} from "react"
import menu from "../img/menu.png"
function Headeradmin({closeWindow}){
    const [show, setShow] = useState(false);
    const toggleAnimation = () => {
        setShow(prev => !prev);
    };
    //   ==================affichage pour la date
     const [date, setDate] = useState(new Date());
    
      useEffect(() => {
    
        const interval = setInterval(() => {
          setDate(new Date());
        }, 1000);
    
        return () => clearInterval(interval);
    
      }, []);
    return(<>
    
    <div id="ha">
        <div>
            <div>
                <hr/>
                <h1>Espace <span className="span">Administrateur</span></h1>
                <p>{date.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })}</p>
            </div>
            <div>
                <div>
                    <div></div>
                    <img/>
                </div>
                <button onClick={closeWindow}><img src={logout} />Se déconnecter</button>

            </div>
        </div>
        
    </div>
    </>);
}
export default Headeradmin;