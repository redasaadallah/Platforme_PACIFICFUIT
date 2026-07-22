import "../styles/message.css"
import logoo from "../img/logo.png"
import close from "../img/close.png"
function Message({type,closeWindow}){
    return(<>
    <div id="black"></div>
    <div id="success">
        <div>
            <img onClick={closeWindow} src={close}/>
        </div>
        <img src={logoo}/>
        <h1>Merci pour votre {type===0?"message":"confiance"}</h1>
        <h3>Votre {type===0?"message":"demande"} a été envoyée avec succès.<br/> Notre équipe vous répondra dans les plus brefs délais.</h3>
    </div>
    </>);
}
export default Message;