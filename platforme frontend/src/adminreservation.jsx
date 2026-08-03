import Baradmin from "./composants/baradmin";
import Headeradmin from "./composants/headeradmin";
import "./styles/adminreservation.css"
import openfile from "./img/open-file.png"
import React,{useEffect,useState} from "react"
import trash from "./img/trash.png"
import ares1 from "./img/ares1.png"
import ares2 from "./img/ares2.png"
import ares3 from "./img/ares3.png"
import api from "./api/axios";
import Ouinon from "./composants/ouinon";
import Success from "./composants/success";
import FileReader from "./composants/fileReader";
import {useNavigate} from "react-router-dom"
import { toast } from "react-toastify";
import arowdown from "./img/down-arrow (1).png"
import invoice from "./img/invoice.png"
import StockStatusCard from "./composants/StockStatusCard";
import DeleteReservation from "./composants/DeleteReservation";
import { motion } from "framer-motion";

import {
    Package,
    PackageX,
    CheckSquare,
    Info
} from "lucide-react";
function Adminreservation(){
    const navigate=useNavigate()
    const [showdetails,setshowdetails]=useState(false);
    const [reservations,setReservations]=useState([])
    const [rchoisi,setRchoisi]=useState({})
    const [succ,setSucc]=useState(false)
    const [produits,setProduits]=useState([])
    const [reservation,setReservation]=useState({})
    const [quantite,setQuantite]=useState(0)
    const [prix,setPrix]=useState(0)
    const [read,setRead]=useState(false)
    const [fileUrl,setFileUrl]=useState(null)
    const [out,setOut]=useState(false)
    const [filtredListe,setFiltredList]=useState([])
    const [typeFile,setTypeFile]=useState("")
     const [error, setError] = useState(null);
     const [status,setStatus] = useState(false);
     const [deleted,setDeleted]=useState(false)
     
     
     
    
  useEffect(() => {

//  *********************************************************
  const fetchDemande=async()=>{
    // Requête GET vers l’endpoint Spring Boot
    await api.get("/produits/demandes-accepted")
      .then(response => {
        setReservations(response.data); // On stocke le tableau de DemandeCompletDTO
        setFiltredList(response.data)
      })
      .catch(err => {
        console.error("Erreur lors du chargement des demandes :", err);
        setError("Impossible de charger les demandes.");
      });
  }
  fetchDemande();
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


}, []);



// ----------------calcule le couleur pour letat=================================
const etat = (dateDebut, dateFin) => {

  const today = new Date();
  const dateD = new Date(dateDebut);
  const dateF = new Date(dateFin);

  // remove time part
  today.setHours(0, 0, 0, 0);
  dateD.setHours(0, 0, 0, 0);
  dateF.setHours(0, 0, 0, 0);

  //  future (not started)
  if (dateD > today) {
    return "#4EABFD";
  }

  //  finished
  if (dateF < today) {
    return "#FB4124";
  }

  //  ongoing
  if (dateD <= today && dateF >= today) {
    return "#89E75A";
  }

  // fallback (important)
  return "#000000";
};


//===========================changer le fichier================================
const [idpr,setidpr]=useState(null)

const setfile=()=>{
    if(idpr.facture===fileUrl){
        setFileUrl(idpr.onssa)
        setTypeFile("ONSSA")
    }
    if(idpr.onssa===fileUrl){
        setFileUrl(idpr.rc)
        setTypeFile("IRC")
    }
    if(idpr.rc===fileUrl){
        setFileUrl(idpr.facture)
        setTypeFile("Facture")
    }
}
// ---------------------cherchement ====================

// ---------------------cherchement ====================
// Fonction de filtrage
  const filterBySequentialLetters = (searchTerm) => {
    if (!searchTerm.trim()){setFiltredList(reservations);}
    else{
        setFiltredList(reservations)
    const term = searchTerm.toLowerCase();
        
    setFiltredList(reservations.filter(obj => {
            const name = ((optionsearchSelectionnee.value === "CIN" ? obj.cinClient : obj.nomClient) || "").toLowerCase();
            let i = 0;
            for (let char of name) {
                if (char === term[i]) i++;
                if (i === term.length) break;
            }
            return i === term.length;
            }));}
  };
//   ---------------------la partie pour filtrer les listes
        const [filtre, setFiltre] = useState("all");
        const [open, setOpen] = useState(false);

        const options = [
          { value: "all", label: "Toutes les réservations",color:"white" },
          { value: "upcoming", label: "Stockage à venir" ,color:"#4EABFD"},
          { value: "ongoing", label: "Stockage en cours" ,color:"#89E75A"},
          { value: "finished", label: "Stockage terminé",color:"#FB4124" },
          { value: "today", label: "Réservations du jour",color:"white" },

        ]

        const optionSelectionnee = options.find(option => option.value === filtre);
//===================telecharger le recu
const telechargerRecu = (reserv) => {
  if(reserv.type==="reservation"){
  window.open(`/api/produits/download/${reserv.codeProduit}`, "_blank");}
  else{
    window.open(`/api/prolongements/download/${reserv.idProlongement}`, "_blank");
  }
};
// ==================================================================
        const [filtresearch, setFiltresearch] = useState("CIN");
        const [opensearch, setOpensearch] = useState(false);
        const optionsearch = [
        { value: "CIN", label: "CIN" },
        { value: "NOM", label: "NOM"},
        ];

        const optionsearchSelectionnee = optionsearch.find(option => option.value === filtresearch);

    return(<>
    {status && <StockStatusCard onClose={()=>setStatus(false)} reservation={reservation}
      onUpdate={(newStatus)=>{
        if(reservation.type==="reservation"){
    // update filtered list
    setFiltredList(
        filtredListe.map(r =>

            r.codeProduit === reservation.codeProduit

            ?
            {
                ...r,
                statutProduit: newStatus
            }

            :
            r

        )
    );


    // update original list
    setReservations(
        reservations.map(r =>

            r.codeProduit === reservation.codeProduit

            ?
            {
                ...r,
                statutProduit: newStatus
            }

            :
            r

        )
    );}
    else{
      setFiltredList(
        filtredListe.map(p =>

            p.idProlongement === reservation.idProlongement
            ?
            {
                ...p,
                statutProduit:newStatus
            }
            :
            p

        )
    );


    setReservations(
        reservations.map(p =>

            p.idProlongement === reservation.idProlongement
            ?
            {
                ...p,
                statutProduit:newStatus
            }
            :
            p

        )
    );
    }


}}
      />}
      {deleted &&  <DeleteReservation onClose={()=>setDeleted(false)} reservation={rchoisi}
        onUpdate={(newStatus)=>{
        // supprimer seulement si terminé ou annulé

             if(
    newStatus === "ended" || 
    newStatus === "canceled"
){

    if(rchoisi.type === "reservation"){


        setFiltredList(prev =>
            prev.filter(
                r => r.codeProduit !== rchoisi.codeProduit
            )
        );


        setReservations(prev =>
            prev.filter(
                r => r.codeProduit !== rchoisi.codeProduit
            )
        );


    }
    else if(rchoisi.type === "prolongement"){


        setFiltredList(prev =>
            prev.filter(
                r => r.idProlongement !== rchoisi.idProlongement
            )
        );


        setReservations(prev =>
            prev.filter(
                r => r.idProlongement !== rchoisi.idProlongement
            )
        );


    }

}
setRchoisi({})
        }}
        />}
    {read && <FileReader type={typeFile} produit={idpr} suivant={setfile}  close={()=>{setFileUrl(null);setRead(false);setshowdetails(true)}} url={fileUrl}/>}
    {out && <Ouinon type={1} sortir={()=>{sessionStorage.removeItem("admin");sessionStorage.removeItem("accessToken");sessionStorage.removeItem("refreshToken");sessionStorage.removeItem("type");navigate("/admin")}}  annuler={()=>setOut(false)}/>}
    <Baradmin page={3} closeWindow={()=>{setOut(true)}}/>
    <Headeradmin closeWindow={()=>{setOut(true)}}/>
    <div id="areservation1">
        <motion.h1
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0 }}
        viewport={{ once: true, amount: 0 }}
        >Gestion des réservations</motion.h1>
        <motion.p
         initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0.2 }}
        viewport={{ once: true, amount: 0 }}
        >{filtredListe.length} réservations</motion.p>
        <motion.div
         initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0.4 }}
        viewport={{ once: true, amount: 0 }}
        >
            <div>
                <div></div>
                <h3>Stockage à venir</h3>
            </div>
            <div>
                <div></div>
                <h3>Stockage en cours</h3>
            </div>
            <div>
                <div></div>
                <h3>Stockage terminées</h3>
            </div>
        </motion.div>
        <div>
           {/* ============================= */}
           <motion.div
            initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0.6 }}
        viewport={{ once: true, amount: 0 }}
           className="reda">
        <label style={{fontSize:"clamp(1rem,1vw,3rem)",flex:"1"}} className='option'>Chercher par :</label>
        {/* +++++++++++++++++++++++++++++++++++++++++++++++ */}
             <div style={{height:"40px",flex:"1"}} className="select-filter">
  <div
  style={{height:"40px"}}
    className="select-box-filter"
    onClick={() => setOpensearch(!opensearch)}
  >
    <span style={{fontSize:"clamp(0.8rem,0.8vw,3rem)"}}>{optionsearchSelectionnee.label}</span>
    <span><img width="30px"  src={arowdown}/></span>
  </div>

  {opensearch && (
    <div className="select-options-filter">
        
      {optionsearch.map((option) => (
        <div
          key={option.value}
          className={`select-option-filter ${filtresearch === option.value ? "active" : ""}`}
          onClick={() => {
            setFiltresearch(option.value);
            setOpensearch(false);
          }}
        >
            <div style={{backgroundColor:option.color}}></div>
          {option.label}
        </div>
      ))}
    </div>
  )}
</div>

        {/* +++++++++++++++++++++++++++++++++++++++++++++++ */}
        </motion.div>
         <motion.div
          initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0.8 }}
        viewport={{ once: true, amount: 0 }}
         className="wave-group">
        <input placeholder=" "  type="text" className="input" onChange={(e)=>{filterBySequentialLetters(e.target.value)}}  />
        <span className="bar"></span>
        <label className="label">
        <span className="label-char" style={{ "--index": 0 }}>Rechercher...</span>
        </label>
        </motion.div>
       {/* =============================la section pour filtrer les listes */}
    <motion.div
     initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:1 }}
        viewport={{ once: true, amount: 0 }}
    style={{width:"360px",marginLeft:"0"}}>
       <label style={{fontSize:"clamp(1rem,1vw,3rem)"}}>Filtrer par : </label>
    <div style={{height:"40px",width:"70%"}} className="select-filter">
  <div
  style={{height:"40px"}}
    className="select-box-filter"
    onClick={() => setOpen(!open)}
  >
    <span style={{fontSize:"clamp(0.8rem,0.8vw,3rem)"}}>{optionSelectionnee.label}</span>
    <span><img width="30px"  src={arowdown}/></span>
  </div>

  {open && (
    <div className="select-options-filter">
        
      {options.map((option) => (
        <div
          key={option.value}
          className={`select-option-filter ${filtre === option.value ? "active" : ""}`}
          onClick={() => {
  setFiltre(option.value);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = reservations.filter((r) => {
    const start = new Date(r.dateDebutStockage);
    const end = new Date(r.dateFinStockage);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    switch (option.value) {
      // commence aujourd’hui
      case "today":
        return start.getTime() === today.getTime();

      // à venir (pas encore commencé)
      case "upcoming":
        return start.getTime() > today.getTime();

      // en cours
      case "ongoing":
        return start.getTime() <= today.getTime() && end.getTime() >= today.getTime();

      // terminé
      case "finished":
        return end.getTime() < today.getTime();

      // tous
      case "all":
      default:
        return true;
    }
  });

  setFiltredList(filtered);
  setOpen(false);
}}
        >
            <div style={{backgroundColor:option.color}}></div>
          {option.label}
        </div>
      ))}
    </div>
  )}
</div>
</motion.div>
        </div>
    </div>
    {/* ====================================== */}
   {filtredListe.length!==0 &&

    <div id="areservation2">
        
        <motion.table
          initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0.6 }}
        viewport={{ once: true, amount: 0 }}
        >
           
            <tr
       
            >
                <th>CIN</th>
                <th>Nom du client</th>
                <th>État</th>
                <th>Date de début</th>
                <th>Date de fin</th>
                <th></th>
            </tr>
           
    
    {filtredListe.map((res,index)=>(
        <>
        
        <motion.tr
         initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0 }}
        viewport={{ once: true, amount: 0 }}
        id="rowreservation" key={index} >
      <td>{res.cinClient} ({res.type==="reservation"?"R":"P"})</td>
      <td>{res.nomClient}</td>
      <td><div style={{backgroundColor:etat(res.dateDebutStockage,res.dateFinStockage)}}></div></td>
      <td>{new Date(res.dateDebutStockage).toLocaleDateString("fr-FR")}</td>
      <td>{new Date(res.dateFinStockage).toLocaleDateString("fr-FR")}</td>
      <td><div>
        <button onClick={()=>{setDeleted(true);setRchoisi(res)}}><img src={trash}/></button>
        <button onClick={() => telechargerRecu(res)}><img src={invoice}/></button>
        <button onClick={()=>{setshowdetails(true);setReservation(res)}}>Voir les détails</button>
        <button disabled={true} style={{backgroundColor:res.statutProduit==="stocked"?"#35D6FA":"#FFAD61"}} id="btnstock">{res.statutProduit==="stocked"?"Stocké":"Non stocké"}</button>
        
        </div></td>
    </motion.tr>
        </>
))}
  
 
        </motion.table>
    </div>}
    {filtredListe.length===0 && 
    <h1 id="aucun">Aucune réservation trouvée.</h1>
    }
    {/* ========================boite de details======================================== */}
    {showdetails &&<>
    <div id="black"></div>
    <div id="resdetail">
        <div>
            <div>
                <img src={ares1}/>
                <h1>Informations du client</h1>
            </div>
            <div>
                <div>
                    <p>Nom complet : {reservation.nomClient}</p>
                    <p>CIN : {reservation.cinClient}</p>
                </div>
                <div>
                    <p>Email : {reservation.emailClient}</p>
                    <p>Téléphone : {reservation.telephoneClient}</p>
                </div>
            </div>
        </div>
        <div>
            <div>
                <img src={ares2}/>
                <h1>Informations sur le stockage </h1>
            </div>
            <div>
                <div>
                    <p> Code : {reservation.codeProduit}</p>
                    <p> Produit : {reservation.nomProduit}</p>

                </div>
                <div>
                    
                    <p> Quantité en tonne : {reservation.quantiteProduit}</p>
                    <p>Prix : {reservation.prixProduit.toFixed(2)} DH</p>
                </div>
                <div>
                    <p> Chambre : {reservation.nomChambre}</p>
                    <p> Température : {reservation.temperatureStockage}°C</p>
                </div>
                <div>
                    <p>Date de début : {new Date(reservation.dateDebutStockage).toLocaleDateString("fr-FR")}</p>
                    <p>durée en jour : {reservation.dureeStockage}</p>
                </div>
                <div>
                    <p>Date de fin : {new Date(reservation.dateFinStockage).toLocaleDateString("fr-FR")}</p>
                </div>
                
            </div>
        </div>
        <div>
            <div>
                <img src={ares3}/>
                <h1>Documents du produit</h1>
            </div>
            
                <div>
                   <div>
                    <div><label>Facture</label><button onClick={()=>{setFileUrl(reservation.facture);setTypeFile("Facture");setidpr(reservation);setRead(true);setshowdetails(false)}}><img src={openfile}/></button></div>
                    <div><label>Attestation ONSSA</label><button onClick={()=>{setFileUrl(reservation.onssa);setTypeFile("ONSSA");setidpr(reservation);setRead(true);setshowdetails(false)}}><img src={openfile}/></button></div>
                    
                  <div><label>IRC</label><button onClick={()=>{setFileUrl(reservation.rc);setTypeFile("IRC");setidpr(reservation);setRead(true);setshowdetails(false)}}><img src={openfile}/></button></div>
               </div>
               {/* ************************************ */}
                    <div>
                      <p>Le statut actuel de stockage est : {reservation.statutProduit==="accepted"?"non stocké":"stocké"}.</p>
                      <button onClick={()=>{setStatus(true)}}>Changer le statut</button>
                    </div>
                {/* ****************************************** */}
           
            </div>
        </div>
        <div>
            <button onClick={()=>{setshowdetails(false)}}>Masquer les détails</button>
        </div>
    </div></>}
    </>);
}
export default Adminreservation;