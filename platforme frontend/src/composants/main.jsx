import "../styles/main.css"
import {useNavigate} from "react-router-dom"

function Main({back,at=1}){
    const navigate=useNavigate();
    
    return(<>
    <div id="home1">
        <img src={back} alt=""/>
        <div></div>
        <h1> Réservez votre place dans nos frigos dès aujourd’hui</h1>
        <h3>Une solution moderne, fiable et performante pour garantir la sécurité et la conservation optimale de vos produits.</h3>
        <div>
        <button onClick={()=>{at===4?navigate("/reservation"):navigate("/demander")}}>{at===4?'Accéder à ma réservation':"Réserver un espace"}</button>
        <button onClick={()=>{at===5?navigate("/reservation"):navigate("/contact")}} className="outlined buttonvide">{at===5?'Accéder à ma réservation':"Contactez-nous"}</button>
        </div>
    </div>
    </>);
}
export default Main;