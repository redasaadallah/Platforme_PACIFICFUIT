import question from "../img/questionmark.png"
import "../styles/ouinon.css"
function Ouinon({sortir,annuler,type}){
    return(<>
    <div id="black" style={{zIndex:"300"}}></div>
    <div  id="question">
        {type===0 &&<><img src={question}/>
        <h3>Êtes-vous sûr de vouloir envoyer cette demande ? </h3>
        <h3>Vérifiez vos informations avant de confirmer.</h3>
        <div>
            <button onClick={sortir}>Envoyer</button>
             <button onClick={annuler}>Annuler</button>
        </div></>}
        {type===1 &&<><img src={question}/>
        <h3>Êtes-vous sûr de vouloir vous déconnecter ?</h3>
        <div>
            <button onClick={sortir}>Oui</button>
             <button onClick={annuler}>Non</button>
        </div></>}
         {type===2 &&<><img src={question}/>
        <h3>Êtes-vous sûr de vouloir supprimer cette réservation ?</h3>
        <div>
            <button onClick={sortir}>Supprimer</button>
             <button onClick={annuler}>Annuler</button>
        </div></>}
         {type===3 &&<><img src={question}/>
        <h3>Voulez-vous supprimer cette chambre ?</h3>
        <div>
            <button onClick={sortir}>Supprimer</button>
             <button onClick={annuler}>Annuler</button>
        </div></>}
         {type===4 &&<><img src={question}/>
        <h3>Voulez-vous accepter ce stockage ?</h3>
        <div>
            <button onClick={sortir}>Accepter</button>
             <button onClick={annuler}>Annuler</button>
        </div></>}
         {type===5 &&<><img src={question}/>
        <h3>Êtes-vous sûr de prolonger la durée de stockage pour ce produit ?</h3>
        <div>
            <button onClick={sortir}>Envoyer</button>
             <button onClick={annuler}>Annuler</button>
        </div></>}
         {type===6 &&<><img src={question}/>
        <h3>Êtes-vous sûr de vouloir annuler le prolongement pour ce produit ?</h3>
        <div>
            <button onClick={sortir}>Confirmer</button>
             <button onClick={annuler}>Annuler</button>
        </div></>}
    </div>
    </>);

}
export default Ouinon;