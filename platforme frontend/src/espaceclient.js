import "./styles/espaceclient.css"
import account from "./img/account.png"
import logout from "./img/log-out.png"
import france from "./img/france.png"
import arow from "./img/up-down-arow.png"
import infopers from "./img/infopers.png"
import pencil from "./img/pencil.png"
import about from "./img/about.png"
import Footer from "./composants/footer"
import updates from "./img/updates.png"
import openfile from "./img/open-file.png"
import React,{useEffect,useState} from "react"
import {useNavigate} from "react-router-dom"
import Ouinon from "./composants/ouinon"
import Prolongement from "./composants/prolongement"
import Message from "./composants/message"
import ad5 from "./img/add5.png"
import warningrecu from "./img/warningrecu.png"
import FileReader from "./composants/fileReader"
import axios from "axios";
import arowdown from "./img/down-arrow (1).png"
import { RotateDirection } from "@react-pdf-viewer/core"
import { toast } from "react-toastify";
import loading from "./img/loading.gif"
function Espaceclient(){
    const [client, setClient] = useState( JSON.parse(localStorage.getItem("client")));
    const [produits,setProduits]=useState([])
    const [annule,setAnnule]=useState(false)
    const [parametres,setParametres]=useState({})

    useEffect(() => {
    // Fonction async à l'intérieur du useEffect
    const fetchProduits = async () => {
      if (!client?.cin) return;

      try {
        const response = await axios.get(`http://localhost:8080/api/clients/after-login/${client.cin}`);
        setProduits(response.data);
        console.log(response.data)
        setAnnule(false)
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
      try {
        // Récupérer tous les paramètres
        const paramResponse = await axios.get('http://localhost:8080/api/parametres');
        setParametres(paramResponse.data[0]);
        console.log(paramResponse.data)
        
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchProduits();

    

  }, [client?.cin,annule]); 

    const [openRow, setOpenRow] = useState(null);
    const [fileUrl,setFileUrl]=useState(null)
    const [idpr,setidpr]=useState(null)
    const [read,setRead]=useState(false)
    const [typeFile,setTypeFile]=useState("")
    const [out,setout]=useState(false);
    const [prol,setprol]=useState(false);
    const [msg,setMsg]=useState(false);
    const [message,setMessage]=useState(false)
    const [type,setType]=useState(0)
    const [info,setInfo]=useState("")
    const [selectedProduit,setSelectedProduit]=useState({})
    const [showpro,setshowpro]=useState(false)
    const navigate=useNavigate();
    const [annuleBoite,setAnnuleBoite]=useState(false)
    const [selectedPro,setselectedPro]=useState("")
    const onhundle=()=>{
        setprol(false);
        setMsg(true);
        setTimeout(()=>{
            setMsg(false)
        },4000)
    }
  
  
//   ==================affichage pour la date
 const [date, setDate] = useState(new Date());

  useEffect(() => {

    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);

  }, []);
// ========================================calcule pour la date de fin=========================
const getDateFin = (dateDebut, duree) => {
  const date = new Date(dateDebut);
  date.setDate(date.getDate() + duree);
  return date;
};

const formatDate = (date) => {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();

  return `${d}-${m}-${y}`;
};
//====================pour le type de fichier
const setfile=()=>{
    if(idpr.factureUrl===fileUrl){
        setFileUrl(idpr.onssaUrl)
        setTypeFile("ONSSA")
    }
    if(idpr.onssaUrl===fileUrl){
        setFileUrl(idpr.rcUrl)
        setTypeFile("IRC")
    }
    if(idpr.rcUrl===fileUrl){
        setFileUrl(idpr.factureUrl)
        setTypeFile("Facture")
    }
}
// ----------------calcule le couleur pour letat=================================
const etat=(dateDebut,dateFin)=>{
    const today = new Date();
  const dateD = new Date(dateDebut);
    const dateF = new Date(dateFin);
  // enlever l'heure pour comparer فقط les dates
  today.setHours(0, 0, 0, 0);
  dateD.setHours(0, 0, 0, 0);
dateF.setHours(0, 0, 0, 0);
  if (dateD > today) {
    return 1;
  }

  if (dateF < today) {
    return -1;
  }

  if (dateD<=today && dateF>=today){
    return 0;
  }
};
//===========================pour afficher la phrase
function messageReservation(dateDebut, dateFin) {
    const aujourdhui = new Date();
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    // Supprimer l’heure pour comparer uniquement les dates
    aujourdhui.setHours(0,0,0,0);
    debut.setHours(0,0,0,0);
    fin.setHours(0,0,0,0);

    if (debut > aujourdhui) {
        const diffJours = Math.ceil((debut - aujourdhui) / (1000 * 60 * 60 * 24));
        return `Votre réservation commencera dans ${diffJours} jour${diffJours > 1 ? 's' : ''}.`;
    } else if (aujourdhui >= debut && aujourdhui <= fin) {
        const diffJours = Math.ceil((fin - aujourdhui) / (1000 * 60 * 60 * 24));
        return `Votre réservation prendra fin dans ${diffJours} jour${diffJours > 1 ? 's' : ''}.`;
    } else if (fin < aujourdhui) {
        return "Votre réservation est terminée.";
    } else {
        return "Dates invalides pour la réservation.";
    }
}
//==============pour telecharger le recu
const telechargerRecu = (codeProduit) => {
  window.open(`http://localhost:8080/api/produits/download/${codeProduit}`, "_blank");
};
//==================lannulation d'une demande en atente
const supprimerProlongement = async (prolongementId) => {
  try {
    const response = await axios.delete(`http://localhost:8080/api/prolongements/${prolongementId}`);
    toast.success(response.data.message); // "Prolongement supprimé avec succès"
    setshowpro(null)
    setAnnule(true)
    setAnnuleBoite(false)
    setselectedPro("")
  } catch (error) {
    console.error("Erreur lors de la suppression du prolongement :", error.response?.data || error.message);
  }
};
const changes=(message,annule,showpro)=>{
    setAnnule(annule)
    setMessage(message)
    setshowpro(showpro)
}
// ===================fonction pour calculer le delai pour faire une prolongation
function canRequestExtension(dateDebut, dateFin, delai) {

    const today = new Date();
    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);


    // ===============================
    // Cas 1 : délai -1
    // Liberté totale
    // ===============================
    if (delai === -1) {
        return true;
    }


    // ===============================
    // Cas 2 : délai 0
    // Après le début du prolongement
    // ===============================
    if (delai === 0) {

        return today >= startDate;
    }


    // ===============================
    // Cas 3 : délai positif
    // Exemple:
    // delai = 2
    // autorisé quand il reste 2 jours
    // avant la fin
    // ===============================

    if (delai > 0) {

        const limitDate = new Date(endDate);

        limitDate.setDate(
            limitDate.getDate() - delai
        );


        return today >= limitDate;
    }


    return false;
}
    
    return(<>
    {read && <FileReader produit={idpr} type={typeFile} suivant={setfile}  close={()=>{setFileUrl(null);setRead(false)}} url={fileUrl}/>}
     {message && <Message closeWindow={()=>setMessage(false)}/>}
    {prol && <Prolongement idpro={selectedPro}  onDemandeSent={changes}  onClientChange={setClient} produit={selectedProduit} client={client} type={type} close={()=>{setprol(false)}} />}
    {out && <Ouinon type={1} sortir={()=>{localStorage.removeItem("client");navigate("/reservation")}} annuler={()=>{setout(false)}}/>}
    {annuleBoite && <Ouinon type={6} sortir={()=>{supprimerProlongement(selectedPro)}} annuler={()=>{setAnnuleBoite(false)}}/>}

    <div id="cheader">
        <div>
            <img src={account}/>
            <div>
                <hr/>
                <h1>Espace <span className="span">Client</span></h1>
                <p> {date.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })}</p>
            </div>
        </div>
        <div>
            <button onClick={()=>{setout(true)}}><img src={logout}/>Se déconnecter</button>
            <button><img src={france}/>Français<img src={arow}/></button>
        </div>
    </div>

    <div id="cbien">
        <h1>Bienvenue {client?.nom}, dans votre espace client.</h1>
        <h3>Depuis cet espace, vous pouvez consulter les informations relatives à votre réservation, suivre son état, accéder à vos documents et effectuer certaines demandes complémentaires.</h3>
    </div>
    <div id="client">
    <div id="client1">
        <div>
            <div>
                <h1>Mes informations</h1>
                <img src={infopers}/>
            </div>
            <div>
                <h3>Nom complet : {client?.nom}</h3>
                <h3>CIN : {client?.cin}</h3>
                <div><h3>Téléphone : {client?.telephone}</h3><button onClick={()=>{setprol(true);setType(3);setInfo(client.telephone)}}><img src={pencil}/></button></div>
                <div><h3>Email : {client?.email}</h3><button onClick={()=>{setprol(true);setType(4);setInfo(client.email)}}><img src={pencil}/></button></div>
                <div><h3>Mot de passe : ********</h3><button onClick={()=>{setprol(true);setType(5);setInfo(client.motDePasse)}}><img src={pencil}/></button></div>

            </div>
        </div>
        {/* ================================ */}
        <div>
            <div>
                <img src={ad5}/><p>Ajouter une nouvelle demande de stockage</p>  
            </div>
                <button onClick={()=>{setprol(true);setType(2)}}>Ajouter un produit</button>
            
        </div>
    </div>
    <div id="client2">
        <div>
                <h1>Mes produits ({produits.length})</h1>
                <img src={about}/>
        </div>
        {/* ============================== */}
        {/* ============================== */}
        {/* ===================le debut pour les produit==== */}
        {produits.map((produit)=>{ 
            const prolongements = produit.prolongements || [];
            const lastIndex = prolongements.length - 1;
            const last = prolongements[lastIndex];
            const isLastPending = last?.statut === "enAtente";
            return(<>
        <div className="rowproduit">
            <div><p >Produit : {produit.nomProduit}</p>{produit.statut==="enAtente"?<><p>(En attente)</p><img src={loading}></img></>:<p>Code : {produit.idProduit}</p>}</div>
            <div>
            {produit.statut!=="enAtente" && openRow===null &&<button onClick={() => telechargerRecu(produit.idProduit)}>Télécharger le reçu</button>}
            <button onClick={()=>{openRow===produit.idProduit?setOpenRow(null):setOpenRow(produit.idProduit);}}>{openRow===produit.idProduit?"Masquer details":"Voir details"}</button>
            </div>
        </div>
        {/* ==================================== */}
        {/* ===================les details pour les produit======= */}
        {openRow ===produit.idProduit &&<>
         <div className="rowproduitdetail">
            
            <div>
                <p> Quantité en tonne : {produit.quantite}</p>
                <p>Chambre : {produit.chambreNom}</p>
                <p> Température : {produit.temperatureStockage}°C</p>
                <p> Date de début de stockage : {new Date(produit.dateDebutStockage).toLocaleDateString("fr-FR")}</p>
                <p> Date de fin de stockage : {new Date(produit.dateFinStockage).toLocaleDateString("fr-FR")}</p>
                <p> Durée de stockage (jour) : {produit.dureeStockage}</p>
                <p>Prix : {produit.prix.toFixed(2)} DH</p>
            </div>
            <div>
                <div ><label>Facture</label><button onClick={()=>{setFileUrl(produit.factureUrl);setTypeFile("Facture");setidpr(produit);setRead(true)}}><img src={openfile}/></button></div>
                <div ><label>Attestation ONSSA</label><button onClick={()=>{setFileUrl(produit.onssaUrl);setidpr(produit);setTypeFile("ONSSA");setRead(true)}}><img src={openfile}/></button></div>
                <div ><label>IRC</label><button onClick={()=>{setFileUrl(produit.rcUrl);setidpr(produit);setTypeFile("IRC");setRead(true)}}><img src={openfile}/></button></div>
            </div>
            {/* ===========================condition pour afficher pour les produits en atente ou accepted========== */}
         {produit.statut!=="enAtente"?   
        <div id="acceptedaction">
            <div>
                <div>
                    <div style={{backgroundColor:etat(produit.dateDebutStockage,produit.dateFinStockage)===1?"#4EABFD":etat(produit.dateDebutStockage,produit.dateFinStockage)===-1?"#FB4124":"#89E75A"}}></div>
                    <h3>{etat(produit.dateDebutStockage,produit.dateFinStockage)===1?"Stockage à venir":etat(produit.dateDebutStockage,produit.dateFinStockage)===-1?"Stockage terminé":"Stockage en cours"}</h3>
                </div>
                <p>{messageReservation(produit.dateDebutStockage,produit.dateFinStockage)}</p>
            </div>
            <div>
            {(!produit.prolongements || produit.prolongements.length === 0)?( canRequestExtension(produit.dateDebutStockage, produit.dateFinStockage, parametres.delaiProlongement) &&<button onClick={()=>{setprol(true);setType(1);setSelectedProduit(produit)}} >Demander une prolongation</button>):
            (produit.prolongements?.length===1 && produit.prolongements[0]?.statut==="enAtente" &&
            <div id="showpro">
                <div id="showpro1" onClick={()=>showpro===false?setshowpro(true):setshowpro(false)}><p >Prolongement en attente de {produit.prolongements[0]?.nbJoursAjoutes} jours</p><img style={{ transform: showpro === true ? "rotate(0deg)" : "rotate(-90deg)",transition: "transform 0.3s ease" }} width="30px"  src={arowdown}/></div>
                {showpro && <div id="showpro2"><button onClick={()=>{setprol(true);setType(0);setSelectedProduit(produit);setselectedPro(produit.prolongements[0]?.id)}} style={{backgroundColor:"#4EABFD"}}>Modifier</button><button onClick={()=>{setselectedPro(produit.prolongements[0]?.id);setAnnuleBoite(true)}}>Annuler</button></div>}
            </div>)
            
            }
            {openRow===produit.idProduit &&<button onClick={() => telechargerRecu(produit.idProduit)}>Télécharger le reçu</button>}</div>
        </div>:
        // =====================la condition pour attente============================
        <div id="enatenteaction">
            <p style={{fontSize:"clamp(0.8rem,1.2vw,2rem)"}}>Votre produit est en attente de validation par l’administration</p>
            <p style={{fontSize:"clamp(0.8rem,1.2vw,2rem)"}}>Merci de patienter, nous traitons votre demande</p>
        </div>}
         {/* ============================================================= */}
        </div>
        {/* ================================================ */}
        {/* ====================pour les prolongations========================== */}
        {produit.prolongements?.some(p => p.statut === "accepted") && (<>
        {produit.prolongements?.slice(0, -1).map((p, index) => (
       
        <div id="proaccepted">
            <div>
                <p> Durée de stockage (jour) : {p.nbJoursAjoutes}</p>
                <p>Date de début : {new Date(p.ancienneDateFin).toLocaleDateString("fr-FR")}</p>
                <p>Date de fin : {new Date (p.nouvelleDateFinDemandee).toLocaleDateString("fr-FR")}</p>
                <p>Prix totale : {p.prix.toFixed(2)} DH</p>
            </div>
            <div id="acceptedaction">
            <div>
                <div>
                    <div style={{backgroundColor:etat(p.ancienneDateFin,p.nouvelleDateFinDemandee)===1?"#4EABFD":etat(p.ancienneDateFin,p.nouvelleDateFinDemandee)===-1?"#FB4124":"#89E75A"}}></div>
                    <h3>{etat(p.ancienneDateFin,p.nouvelleDateFinDemandee)===1?"Stockage à venir":etat(p.ancienneDateFin,p.nouvelleDateFinDemandee)===-1?"Stockage terminé":"Stockage en cours"}</h3>
                </div>
                <p>{messageReservation(p.ancienneDateFin,p.nouvelleDateFinDemandee)}</p>
            </div>
            {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
            {/* <div>
    <div>
        <div
            style={{
                backgroundColor:
                    etat(
                        produit.prolongements?.at(-1)?.statut === "enAtente" 
                            ? produit.prolongements.at(-1).ancienneDateFin
                            : p.ancienneDateFin,

                        produit.prolongements?.at(-1)?.statut === "enAtente"
                            ? produit.prolongements.at(-1).nouvelleDateFinDemandee
                            : p.nouvelleDateFinDemandee
                    ) === 1
                        ? "#4EABFD"
                        : etat(
                            produit.prolongements?.at(-1)?.statut === "enAtente"
                                ? produit.prolongements.at(-1).ancienneDateFin
                                : p.ancienneDateFin,

                            produit.prolongements?.at(-1)?.statut === "enAtente"
                                ? produit.prolongements.at(-1).nouvelleDateFinDemandee
                                : p.nouvelleDateFinDemandee
                        ) === -1
                            ? "#FB4124"
                            : "#89E75A"
            }}
        >
        </div>

        <h3>
            {
                etat(
                    produit.prolongements?.at(-1)?.statut === "enAtente"
                        ? produit.prolongements.at(-1).ancienneDateFin
                        : p.ancienneDateFin,

                    produit.prolongements?.at(-1)?.statut === "enAtente"
                        ? produit.prolongements.at(-1).nouvelleDateFinDemandee
                        : p.nouvelleDateFinDemandee
                ) === 1
                    ? "Stockage à venir"
                    : etat(
                        produit.prolongements?.at(-1)?.statut === "enAtente"
                            ? produit.prolongements.at(-1).ancienneDateFin
                            : p.ancienneDateFin,

                        produit.prolongements?.at(-1)?.statut === "enAtente"
                            ? produit.prolongements.at(-1).nouvelleDateFinDemandee
                            : p.nouvelleDateFinDemandee
                    ) === -1
                        ? "Stockage terminé"
                        : "Stockage en cours"
            }
        </h3>
    </div>


    <p>
        {
            messageReservation(
                produit.prolongements?.at(-1)?.statut === "enAtente" && p.id === produit.prolongements?.at(-2)?.id
                    ? produit.prolongements.at(-1).ancienneDateFin
                    : p.ancienneDateFin,

                produit.prolongements?.at(-1)?.statut === "enAtente" && p.id === produit.prolongements?.at(-2)?.id
                    ? produit.prolongements.at(-1).nouvelleDateFinDemandee
                    : p.nouvelleDateFinDemandee
            )
        }
    </p>
</div> */}
            {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
            <div>
            {produit.prolongements[produit.prolongements.length-1].statut==="enAtente" && p.id===produit.prolongements.at(-2).id && (
            <div id="showpro">
                <div id="showpro1" onClick={()=>showpro===false?setshowpro(true):setshowpro(false)}><p >Prolongation en attente de {produit.prolongements[produit.prolongements.length-1]?.nbJoursAjoutes} jours</p><img style={{ transform: showpro === true ? "rotate(0deg)" : "rotate(-90deg)",transition: "transform 0.3s ease" }} width="30px"  src={arowdown}/></div>
                {showpro && <div id="showpro2"><button onClick={()=>{setprol(true);setType(0);setSelectedProduit(produit);setselectedPro(produit.prolongements[produit.prolongements.length-1].id)}} style={{backgroundColor:"#4EABFD"}}>Modifier</button><button onClick={()=>{setselectedPro(produit.prolongements[produit.prolongements.length-1].id);setAnnuleBoite(true)}}>Annuler</button></div>}
            </div>)
        }
            
            {openRow===produit.idProduit &&<button onClick={() => telechargerRecu(produit.idProduit)}>Télécharger le reçu</button>}</div>
        </div>
        </div>
             
        ))}
{/* ========================================================if the last prolongement is accepted========================================================== */}
    {produit.prolongements[produit.prolongements.length-1].statut==="accepted" &&
    <div id="proaccepted">
            <div>
                <p> Durée de stockage (jour) : {produit.prolongements[produit.prolongements.length-1].nbJoursAjoutes}</p>
                <p>Date de début : {new Date(produit.prolongements[produit.prolongements.length-1].ancienneDateFin).toLocaleDateString("fr-FR")}</p>
                <p>Date de fin : {new Date(produit.prolongements[produit.prolongements.length-1].nouvelleDateFinDemandee).toLocaleDateString("fr-FR")}</p>
                <p>Prix totale : {produit.prolongements[produit.prolongements.length-1].prix.toFixed(2)} DH</p>
            </div>
            <div id="acceptedaction">
            <div>
                <div>
                    <div style={{backgroundColor:etat(produit.prolongements[produit.prolongements.length-1].ancienneDateFin,produit.prolongements[produit.prolongements.length-1].nouvelleDateFinDemandee)===1?"#4EABFD":etat(produit.prolongements[produit.prolongements.length-1].ancienneDateFin,produit.prolongements[produit.prolongements.length-1].nouvelleDateFinDemandee)===-1?"#FB4124":"#89E75A"}}></div>
                    <h3>{etat(produit.prolongements[produit.prolongements.length-1].ancienneDateFin,produit.prolongements[produit.prolongements.length-1].nouvelleDateFinDemandee)===1?"Stockage à venir":etat(produit.prolongements[produit.prolongements.length-1].ancienneDateFin,produit.prolongements[produit.prolongements.length-1].nouvelleDateFinDemandee)===-1?"Stockage terminé":"Stockage en cours"}</h3>
                </div>
                <p>{messageReservation(produit.prolongements[produit.prolongements.length-1].ancienneDateFin,produit.prolongements[produit.prolongements.length-1].nouvelleDateFinDemandee)}</p>
            </div>
            <div>
             <button onClick={()=>{setprol(true);setType(1);setSelectedProduit({...produit,dateDebutStockage:produit.prolongements[produit.prolongements.length-1].ancienneDateFin,dateFinStockage:produit.prolongements[produit.prolongements.length-1].nouvelleDateFinDemandee})}} >Demander une prolongation</button>
           
            
            {openRow===produit.idProduit &&<button onClick={() => telechargerRecu(produit.idProduit)}>Télécharger le reçu</button>}</div>
        </div>
        </div>}
</>
        )}
        </>
        }
        
        </>)})}
    </div>
    </div>
    <div id="recu">
        <img src={warningrecu}/>
        <p>Pour déposer vos produits, veuillez présenter votre reçu de réservation.</p>
    </div>
    <Footer/>
    </>)
}
export default Espaceclient;