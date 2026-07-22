import "../styles/success.css"
import close from "../img/close.png"
import success from "../img/success.png"
import exclamation from "../img/exclamation.png"
export default function Success({closeWindow,type}){
    return(<>
    <div id="black"></div>
    {type===0 &&
    <div id="successful">
        <div>
            <img onClick={closeWindow} src={close}/>
        </div>
        <img src={success}/>
        <p>La demande de réservation a bien été validée.<br/> un message a été envoyé au client.</p>
    </div>}
    {type===1 &&
    <div id="successful">
        <div>
            <img onClick={closeWindow} src={close}/>
        </div>
        <img src={exclamation}/>
        <p>La demande de réservation a bien été rejetée.<br/> un message a été envoyé au client.</p>
    </div>}
     {type===2 &&
    <div id="successful">
        <div>
            <img onClick={closeWindow} src={close}/>
        </div>
        <img src={success}/>
        <p>La réservation a été bien supprimée.</p>
    </div>}
    
    </>)
}