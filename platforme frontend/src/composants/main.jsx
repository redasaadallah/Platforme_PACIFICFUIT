import "../styles/main.css"
import {useNavigate} from "react-router-dom"

function Main({back}){
    const navigate=useNavigate();
    
    return(<>
    <div id="home1">
        <img src={back} alt="" loading="lazy"/>
        <div></div>
        <h1> Réservez votre place dans nos frigos dès aujourd’hui</h1>
        <h3>Une solution moderne, fiable et performante pour garantir la sécurité et la conservation optimale de vos produits.</h3>
        <div>
        <button onClick={()=>{navigate("/demander")}}>Réserver un espace</button>
        <button onClick={()=>{navigate("/contact")}} className="outlined buttonvide">Contactez-nous</button>
        </div>
    </div>
    </>);
}
export default Main;