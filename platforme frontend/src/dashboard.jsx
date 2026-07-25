import "./styles/dashboard.css"
import Baradmin from "./composants/baradmin";
import Headeradmin from "./composants/headeradmin";
import clipboard from "./img/clipboard.png"
import {useNavigate} from "react-router-dom"
import React,{useEffect,useState} from "react"
import Repondre from "./composants/repondre";
import Ouinon from "./composants/ouinon";
import coment from "./img/comment.png"
import { toast } from "react-toastify";
import api from "./api/axios";
import { motion } from "framer-motion";

function Dashboard(){
    const navigate=useNavigate();
    const [message,setMessage]=useState([])
    const [repondre,setRepondre]=useState(false)
    const [don,setDon]=useState(0)
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [out,setOut]=useState(false)
// ==================pour recuperer le moi acctuelle==================
const months = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
];

const date = new Date();
const currentMonth = months[date.getMonth()];
const currentYear = date.getFullYear();
    // =======================================================================
    // =====================================la partie pour les messages==========
  useEffect(() => {
  const getMessages = async () => {
    try {
      const response = await api.get("http://localhost:8080/api/messages");

      setMessage(response.data);

    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  getMessages();
}, [don]);

// ================================repondre=================================
const repondreMessage=()=>{
    setRepondre(true)
}
// ============================filtrer le message suprimer===================
const deleteMessage = async (id) => {
  try {
    await api.delete(`http://localhost:8080/api/messages/${id}`);
    toast.success("Le message a été supprimé avec succès",{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    })
    setMessage(message.filter((msg) => msg.id !== id));


  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
};
// =============================================================================
// =============================================================================
// =============================================================================
// ============================les demandes======================================
const [reservations,setReservations]=useState([])
const [stats, setStats] = useState({
  reservations: 0,
  prolongations: 0,
  accepted: 0,
  refused: 0
});

useEffect(() => {

const fetchStats = async () => {
    try {
      const res = await api.get(
        "http://localhost:8080/api/admin/statistiques/dashboard/current-month/simple"
      );

      setStats(res.data);

    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  fetchStats();
const fetchDemande=async()=>{
    // Requête GET vers l’endpoint Spring Boot
    await api.get("http://localhost:8080/api/produits/demandes-en-attente")
      .then(response => {
        setReservations(response.data); // On stocke le tableau de DemandeCompletDTO
        
      })
      .catch(err => {
        console.error("Erreur lors du chargement des demandes :", err);
      });
  }
  fetchDemande();

 
}, []);


// =============================================================================
// =============================================================================

    return(<>
     
    {out && <Ouinon type={1} sortir={()=>{localStorage.removeItem("admin");localStorage.removeItem("accessToken");localStorage.removeItem("refreshToken");localStorage.removeItem("type");navigate("/admin")}}  annuler={()=>setOut(false)}/>}
    {repondre && <Repondre type={0} done={()=>{don===0?setDon(1):setDon(0)}} closeWindow={()=>{setRepondre(false)}} msg={selectedMessage}/>}
    <Baradmin page={1} closeWindow={()=>{setOut(true)}}/>
    <Headeradmin closeWindow={()=>{setOut(true)}}/>
        
    <div id="s1">
        <div>
        <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0 }}
        viewport={{ once: true, amount: 0 }}
        >
            <h1>Nombre total de réservations</h1>
            <div>
                <h3>{currentMonth} {currentYear}</h3>
                <h1>{stats.reservations}</h1>
            </div>
            
        </motion.div>
        <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0.2 }}
        viewport={{ once: true, amount: 0 }}
        >
            <h1>Nombre total de prolongations</h1>
            <div>
                <h3>{currentMonth} {currentYear}</h3>
                <h1>{stats.prolongations}</h1>
            </div>
            
        </motion.div>
        <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0.6 }}
        viewport={{ once: true, amount: 0 }}
>
            <h1>Demandes acceptées</h1>
            <div>
                <h3>{currentMonth} {currentYear}</h3>
                <h1>{stats.accepted}</h1>
            </div>
            
        </motion.div>
        <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0.8 }}
        viewport={{ once: true, amount: 0 }}
        >
            <h1>Demandes  refusées</h1>
            <div>
                <h3>{currentMonth} {currentYear}</h3>
                <h1>{stats.refused}</h1>
            </div>
            
        </motion.div>
        
        </div>
        <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0.6 }}
        viewport={{ once: true, amount: 0 }}
        >
            <button onClick={()=>navigate("/statistic")}>Voir les détails</button>
        </motion.div>
    </div>
  {/*+++++++++++++++++++++++++++++++++++++++++++++++++  */}
    <div id="s2">
        <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0.6 }}
        viewport={{ once: true, amount: 0 }}
        >
            <div>
                <div
               
                >
                    <h3>les nouvelles demandes à traiter</h3>
                    <p>{reservations.length} demandes</p>
                </div>
                <img 
                
                src={clipboard}/>
            </div>
            <div id="s2div">
        <div className="table-containerd">
                {/* HEADER FIXED */}
      <div
      className="table-headerd">
        <div>Nom</div>
        <div>CIN</div>
        <div>Statut</div>
        <div>Type</div>
        <div>Date de demande</div>
      </div>
      {/* BODY SCROLL */}
      <div className="table-bodyd">
                {reservations.map((res,index)=>(
                <div
                className="table-rowd" key={index}>
                    <div>{res.nomClient}</div>
                    <div>{res.cinClient}</div>
                    <div><div className="status">en attente</div></div>
                    <div><div className="type">{res.type==="reservation"?"Réservation":"Prolongation"}</div></div>
                    <div>{new Date(res.dateDemande).toLocaleDateString("fr-FR")}</div>
                </div>
                ))}
                </div>
               
                </div>
               
            </div>
            <div>
                <button
                onClick={()=>navigate("/admindemande")}>Voir les détails</button>
            </div>
            </motion.div>
        
        {/* ============================================================== */}
        <motion.div
         initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0.8 }}
        viewport={{ once: true, amount: 0 }}
        >
            <div>
                <div
               
                >
                    <h3>les nouvelles messages a repondre</h3>
                    <p>{message.length} message</p>
                </div>
                <img
                
                src={coment}/>
            </div>
            <div id="s2div">
              <div className="table-containerm">
                {/* HEADER FIXED */}
      <div
      className="table-headerm">
        <div>Nom</div>
        <div>Afficher</div>
        <div>Supprimer</div>
        <div>Date d’envoi</div>
      </div>
      {/* BODY SCROLL */}
      <div className="table-bodym">

                {message.map((msg,index)=>(
                    <div 
                   
                    className="table-rowm" key={index}>
                    <div>{msg.nom} {msg.prenom}</div>
                    <div><button type="button" onClick={()=>{setSelectedMessage(msg);repondreMessage()}} className="afficher">Afficher</button></div>
                    <div><button type="button" onClick={() => deleteMessage(msg.id)}  className="supprimer">Supprimer</button></div>
                    <div>{new Date(msg.dateEnvoi).toLocaleDateString("fr-FR")}</div>
                    
                </div>
                ))}
             </div>   
               
            </div>
            </div>
        </motion.div>
        </div>
    
    </>);
}
export default Dashboard;