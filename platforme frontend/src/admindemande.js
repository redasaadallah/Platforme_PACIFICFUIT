import Baradmin from "./composants/baradmin";
import Headeradmin from "./composants/headeradmin";
import "./styles/admindemande.css"
import openfile from "./img/open-file.png"
import React,{useEffect,useState} from "react"
import axios from "axios";
import Ouinon from "./composants/ouinon";
import {useNavigate} from "react-router-dom"
import FileReader from "./composants/fileReader";
import Refus from "./composants/refus";
import Success from "./composants/success";
import infopers from "./img/infopers.png"
import { toast } from "react-toastify";
import feature from "./img/features.png"
import arowdown from "./img/down-arrow (1).png"

function Admindemande(){
    const navigate=useNavigate()
    const [out,setOut]=useState(false)
    const rows = [];
    const [showdetails,setshowdetails]=useState(false);
    const [text,setText]=useState("")
// =============================================================================
const [reservations,setReservations]=useState([])
const [produits,setProduits]=useState([])
const [openRow, setOpenRow] = useState(null);
const [fileUrl,setFileUrl]=useState(null)
const [idpr,setidpr]=useState(null)
const [read,setRead]=useState(false)
const [refus,setRefus]=useState(false)
const [message,setMessage]=useState("")
const [rchoisi,setRchoisi]=useState({})
const [boite,setBoite]=useState(0)
const [typeFile,setTypeFile]=useState("")
const [filtredListe,setFiltredList]=useState([])
const [type,setType]=useState(false)
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
//******************************************************** */
const [demandes, setDemandes] = useState([]);
  const [error, setError] = useState(null);
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
useEffect(() => {

//  *********************************************************
  const fetchDemande=async()=>{
    // Requête GET vers l’endpoint Spring Boot
    await axios.get("http://localhost:8080/api/produits/demandes-en-attente")
      .then(response => {
        setReservations(response.data); // On stocke le tableau de DemandeCompletDTO
        setFiltredList(response.data)
        console.log("les dennes",response.data)
        
      })
      .catch(err => {
        console.error("Erreur lors du chargement des demandes :", err);
        setError("Impossible de charger les demandes.");
      });
  }
  fetchDemande();


}, []);


  const [active, setActive] = useState([]);

  const toggle = (id) => {
    setActive((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id) 
        : [...prev, id]               
    );
  };
  const handleText=(value)=>{
    setText(value)
    
  }
// =================================refuser la demande===========================
const envoieRefuserReservation=async(reserv,text)=>{
    const response = await axios.delete(
            `http://localhost:8080/api/produits/refuser/${reserv}/${encodeURIComponent(text)}`
        );
    return response
}
const envoieRefuserProlongation=async(reserv,text)=>{
    const response = await axios.delete(
            `http://localhost:8080/api/prolongements/refuser/${reserv}/${encodeURIComponent(text)}`
        );
    return response
}
const refuser=async()=>{
    // Affiche un toast de chargement
    const toastId = toast.loading("Refus de la demande en cours…");
     try {
            setRefus(false)
            if(rchoisi.type==="reservation"){
            const response = await envoieRefuserReservation(rchoisi.codeProduit,text)
            }else{
                const response = await envoieRefuserProlongation(rchoisi.idProlongement,text)

            }
            toast.update(toastId, {
        render: "La demande a été refusée avec succès.",
        type: "success",
        isLoading: false,
        autoClose: 3000
    }); 
            setOpenRow(null)
    if(rchoisi.type==="reservation"){
        setFiltredList(filtredListe.filter(r => r.codeProduit !== rchoisi.codeProduit));
        setReservations(reservations.filter(r => r.codeProduit !== rchoisi.codeProduit));
        }else{
            setFiltredList(filtredListe.filter(r => r.idProlongement !== rchoisi.idProlongement));
        setReservations(reservations.filter(r => r.idProlongement !== rchoisi.idProlongement)); 
        }

    // setBoite(2)

    } catch (error) {

        console.log(error);

    }
}

// =================================accepter la demande==========================
const envoieAccepterReservation=async(reserv)=>{
    const response = await axios.put(
            `http://localhost:8080/api/produits/accepter/${reserv}`
        );
    return response
}
const envoieAccepterProlongation=async(reserv)=>{
    const response = await axios.put(
            `http://localhost:8080/api/prolongements/accepter/${reserv}`
        );
    return response
}
const accepter=async()=>{
   // Affiche un toast de chargement
const toastId = toast.loading("Acceptation en cours...");
        try {
            setType(false)
            if(rchoisi.type==="reservation"){
            const response = await envoieAccepterReservation(rchoisi.codeProduit)
            }else{
                const response=await envoieAccepterProlongation(rchoisi.idProlongement)
            }
toast.update(toastId, {
        render: "La demande a été acceptée avec succès.",
        type: "success",
        isLoading: false,
        autoClose: 3000
    });        
        if(rchoisi.type==="reservation"){
        setFiltredList(filtredListe.filter(r => r.codeProduit !== rchoisi.codeProduit));
        setReservations(reservations.filter(r => r.codeProduit !== rchoisi.codeProduit));
        }else{
            setFiltredList(filtredListe.filter(r => r.idProlongement !== rchoisi.idProlongement));
        setReservations(reservations.filter(r => r.idProlongement !== rchoisi.idProlongement)); 
        }
        
        setOpenRow(null)

    } catch (error) {

        console.log(error);
    }  
}
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
// ==============================================================================
//   ---------------------la partie pour filtrer les listes
        const [filtre, setFiltre] = useState("all");
        const [open, setOpen] = useState(false);

        const options = [
        { value: "all", label: "Tous" },
        { value: "reservation", label: "Réservation" },
        { value: "prolongation", label: "Prolongation"},
        ];

        const optionSelectionnee = options.find(option => option.value === filtre);
        // ==================================================================
        const [filtresearch, setFiltresearch] = useState("CIN");
        const [opensearch, setOpensearch] = useState(false);
        const optionsearch = [
        { value: "CIN", label: "CIN" },
        { value: "NOM", label: "NOM"},
        ];

        const optionsearchSelectionnee = optionsearch.find(option => option.value === filtresearch);
    return(<>
    

     {refus && <Refus sendText={handleText}  refuser={refuser}  closeWindow={()=>setRefus(false)}/>}
    {out && <Ouinon type={1} sortir={()=>{localStorage.removeItem("admin");navigate("/admin")}}  annuler={()=>setOut(false)}/>}
    {type && <Ouinon type={4} sortir={()=>{accepter()}}  annuler={()=>setType(false)}/>}
    {read && <FileReader produit={idpr} type={typeFile} suivant={setfile}  close={()=>{setFileUrl(null);setRead(false)}} url={fileUrl}/>}
    <Baradmin page={2} closeWindow={()=>{setOut(true)}}/>
    <Headeradmin closeWindow={()=>{setOut(true)}}/>
    <div id="ademande1">
        <h1>Demandes de réservation/prolongation</h1>
        <p>{filtredListe.length} demandes</p>
        <div>
            {/* ============================= */}
           <div className="reda">
        <label className='option'>Chercher par :</label>
        {/* +++++++++++++++++++++++++++++++++++++++++++++++ */}
             <div className="select-filter">
  <div
    className="select-box-filter"
    onClick={() => setOpensearch(!opensearch)}
  >
    <span>{optionsearchSelectionnee.label}</span>
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
        </div>
        
        {/* =========================================== */}
         <div className="wave-group">
        <input placeholder=" " type="text" className="input" onChange={(e)=>{filterBySequentialLetters(e.target.value)}} />
        <span className="bar"></span>
        <label className="label">
        <span className="label-char" style={{ "--index": 0 }}>Rechercher...</span>
        </label>
        </div>
       {/* ___________________________________ */}
       <div>
       <label>Filtrer par : </label>
    <div className="select-filter">
  <div
    className="select-box-filter"
    onClick={() => setOpen(!open)}
  >
    <span>{optionSelectionnee.label}</span>
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
            if(option.value==="all"){
                setFiltredList(reservations)
            }
            else{
                
                setFiltredList(reservations.filter(r => r.type === option.value));
            }
            
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
</div>
       {/* ____________________________________ */}
        </div>
    </div>
    {/* ====================================== */}
   {filtredListe.length!==0 &&
    <div id="ademande2">
        <table>
            <tr>
                <th>CIN</th>
                <th>Nom du client</th>
                <th>Type de demande</th>
                <th>Statut</th>
                <th>Date de demande</th>
                <th></th>
            </tr>
            
                {/* ==================================== */}
               
                
                {/* =============================== */}
                 {filtredListe.map((res,index)=>(
                    <>
               <tr id="rowinfo" key={index} >
                <td >{res.cinClient}</td>
                <td>{res.nomClient}</td>
                <td>{res.type==="reservation"?"Réservation":"Prolongation"}</td>
                <td>En attente</td>
                <td>{new Date(res.dateDemande).toLocaleDateString("fr-FR")}</td>
                <td>{openRow!==index &&<button onClick={()=>{setshowdetails(true);setRchoisi(res);setOpenRow(index)}}>Voir les détails</button>}</td>
                </tr>
                {openRow ===index &&
        <tr ><td id="detailtest" colSpan={6}>
                    <div>
                    <div>
                        <div><img src={infopers}/></div>
                        <div>
                        <p>Nom complet : {res.nomClient}</p>
                        <p>CIN : {res.cinClient}</p>
                        <p>Téléphone : {res.telephoneClient}</p>
                        <p>Email : {res.emailClient}</p>
                        </div>
                    </div>
                    {/* ======== */}
                    <div>
                        <div><img src={feature}/></div>
                        <div>
                            <p>Produit : {res.nomProduit}</p>
                             <p> Quantité en tonne : {res.quantiteProduit}</p>
                            <p>Chambre : {res.nomChambre} ({res.capaciteDisponible})</p>
                            <p> Température : {res.temperatureStockage}°C</p>
                            <p> Date souhaitée : {new Date(res.dateDebutStockage).toLocaleDateString("fr-FR")}</p>
                            <p> Durée de stockage (jour) : {res.dureeStockage}</p>
                            <p>Prix : {res.prixProduit.toFixed(2)} DH</p>
                        </div>
                        <div>
                            <div ><label>Facture</label><button onClick={()=>{setFileUrl(res.facture);setTypeFile("Facture");setidpr(res);setRead(true)}}><img src={openfile}/></button></div>
                            <div ><label>Attestation ONSSA</label><button onClick={()=>{setFileUrl(res.onssa);setidpr(res);setTypeFile("ONSSA");setRead(true)}}><img src={openfile}/></button></div>
                            <div ><label>IRC</label><button onClick={()=>{setFileUrl(res.rc);setidpr(res);setTypeFile("IRC");setRead(true)}}><img src={openfile}/></button></div>
                        </div>
                        
                         <div>
                        <p style={{width:"auto",margin:"0px"}} className="errors">{message}</p>
                       <button onClick={()=>{setType(true)}}>Accepter la demande</button>
                        <button onClick={()=>setRefus(true)}>Refuser la demande</button>
                        <button onClick={()=>{setRchoisi("");setshowdetails(false);setOpenRow(null)}}>Masquer les détails</button>
                    </div>
                        
                    </div>
                    </div>
                </td></tr>
      
                
                }
                 </>))}
    
           
            
            
        </table>
    </div>}
    {filtredListe.length===0 && 
    <h1 id="aucun">Aucune demande trouvée.</h1>
    }
    </>);
}
export default Admindemande;