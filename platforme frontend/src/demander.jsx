import React,{useEffect,useRef,useState} from "react"
import {useNavigate} from "react-router-dom"
import Loader from "./composants/loader";
import Header from "./composants/header";
import Main from "./composants/main";
import Upfooter from "./composants/upfooter";
import Footer from "./composants/footer";
import img3 from "./img/img3.jpg"
import "./styles/demander.css"
import add from "./img/add.png"
import addproduct from "./img/add-product.png"
import remove from "./img/close.png"
import img8 from "./img/img8.jpg"
import img9 from "./img/img9.jpg"
import img10 from "./img/img10.jpg"
import img11 from "./img/img11.jpg"
import axios from "axios"
import del from "./img/delete.png"
import pencil from "./img/whitepen.png"
import warning from "./img/warning.png"
import change1 from "./img/exchange1.png"
import Ouinon from "./composants/ouinon"
import Message from "./composants/message";
import product from "./img/product.png"
import { toast } from "react-toastify";
import arowdown from "./img/down-arrow (1).png"
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import api from "./api/axios";
import VerificationModal from "./composants/VerificationModal";
import { motion } from "framer-motion";

function Demander(){
    const navigate=useNavigate();
    const [parametres,setParametres]=useState({})
    const [chambres,setChambres]=useState([])
    const [minDate,setMinDate]=useState()
    const [open, setOpen] = useState(false);
    const [openVerification,setOpenVerification]=useState(false)
   
    const [filtre, setFiltre] = useState(null);


const optionSelectionnee = chambres.find(option => option.id === filtre);
    // =================les parametres et les chambres===========================
    useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer tous les paramètres
        const paramResponse = await axios.get('http://localhost:8080/api/parametres');
        setParametres(paramResponse.data[0]);
        // Récupérer toutes les chambres
        const chambreResponse = await axios.get('http://localhost:8080/api/chambres/visible');
        setChambres(chambreResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
    // 2. WebSocket connection
    const socket = new SockJS("http://localhost:8080/ws");

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
        console.log("WebSocket connected");
      //  Listen for new chambres
      stompClient.subscribe("/topic/chambres", () => {

        //  Auto refresh when admin adds chambre
        fetchData();
      });
    };

    stompClient.activate();
     // Calculer la date minimale (demain)
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split("T")[0]; // format YYYY-MM-DD
  setMinDate(minDate)
  }, []);

  // ====================le client ===============================
    const [clientData,setClientData]=useState({
        cin:"",
        nom:"",
        email:"",
        telephone:""
    })
    
    const [dateFin,setDateFin]=useState({
    dateReservation: "",
    dureeReservation: "",
    finReservation:""
    })
   
    const [nomProduit, setNomProduit] = useState("");
    const [quantite, setQuantite] = useState("");
    const [temperature,setTemperature]=useState("")
    const [dateDebut,setDateDebut]=useState("")
    const [duree,setDuree]=useState("")
    const [produits, setProduits] = useState([]);
    const [files, setFiles]=useState([])
    // ===============================pour les fichiers=============
        const [errors, setErrors] = useState({});
        const [errors1, setErrors1] = useState({});
        const [done,setDone]=useState(false)
        const [done1,setDone1]=useState(false)
    const fileInputRef = useRef(null);
const fileInputRef1 = useRef(null);
const fileInputRef2 = useRef(null);

  const [fileName, setFileName] = useState("");
    const [fileName1, setFileName1] = useState("");
  const [fileName2, setFileName2] = useState("");

  const [fileURL,setfileURL]=useState(null);
  const [fileURL1,setfileURL1]=useState(null);
  const [fileURL2,setfileURL2]=useState(null);
  // ========pour comparer le delai entre reservation et date de demande
  function isWithinDuration(selectedDate, maxDays) {
    if(maxDays<0){
      return true
    }
    else{
    // Récupérer la date d'aujourd'hui (sans l'heure)
    const today = new Date();
    today.setHours(0,0,0,0);

    // Convertir la date sélectionnée en objet Date
    const dateSelected = new Date(selectedDate);
    dateSelected.setHours(0,0,0,0);

    // Calculer la différence en millisecondes
    const diffMs = Math.abs(today - dateSelected);

    // Convertir la différence en jours
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    // Comparer avec la durée donnée
    return diffDays <= maxDays;
}}
//+++++++++++pour verifier le format du telephone
function isValidPhone(phone) {
  // Regex : commence par +212, 0, ou 07, suivi d'un indicatif valide et de 8 chiffres
  const regex = /^(?:\+212|0)([5-7])\d{8}$/;
  return regex.test(phone);
}
// ======================pour verifier le format du email=====
function isValidEmail(email) {
  // Regex simple pour valider l'email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
  //=============================== pour garentir que les champs sont remplis
  const validateStep=()=>{
    const newErrors={}
  if (!nomProduit.trim()) {
    newErrors.nomProduit = "Veuillez saisir le nom du produit";
  }
  if (!quantite.trim()) {
    newErrors.quantite = "Veuillez choisir la quantite a stocker";
  }else if (Number(quantite) < parametres.quantiteMinProduit && parametres.quantiteMinProduit!==-1) {
    newErrors.quantite = "La quantité minimale est de "+parametres.quantiteMinProduit+" tonne";
  }else if (Number(quantite) > parametres.quantiteMaxProduit && parametres.quantiteMaxProduit!==-1) {
    newErrors.quantite = "La quantité minimale est de "+parametres.quantiteMaxProduit+" tonne";
  }

  if (!temperature.trim()) {
    newErrors.temperature = "Veuillez choisir une température de stockage";
  }
  
  if (!fileName.trim()) {
    newErrors.filename = "Veuillez importer la facture";
  }
  if (!fileName1.trim()) {
    newErrors.filename1 = "Veuillez importer l'attestation ONSSA";
  }
  if (!fileName2.trim()) {
    newErrors.filename2 = "Veuillez importer le Registre de commerce (RC)";
  }
  if (!dateDebut.trim()) {
    newErrors.dateReservation = "Veuillez saisir la date de votre réservation";
  }else if(!isWithinDuration(dateDebut,parametres.delaiMaxEntreDemandeEtDebut)){
        newErrors.dateReservation = "La date dépasse la limite ("+parametres.delaiMaxEntreDemandeEtDebut+" jours). Veuillez choisir une autre date.";
  }
  if (!duree.trim()) {
    newErrors.dureeReservation = "Veuillez saisir la durée de votre réservation";
  }else if (Number(duree) < parametres.dureeMinReservation && parametres.dureeMinReservation!==-1) {
    newErrors.dureeReservation = "La durée minimale de réservation est de "+parametres.dureeMinReservation+" jours";
  }else if (Number(duree) > parametres.dureeMaxReservation && parametres.dureeMaxReservation!==-1) {
    newErrors.dureeReservation = "La durée maximale de réservation est de "+parametres.dureeMaxReservation+" jours";
  }
  setErrors1(newErrors)
return Object.keys(newErrors).length === 0;

}
// ========================pour les chemps information et reservation==============
  const validateStep1 = () => {
  let newErrors = {};

  if (!clientData.nom.trim()) {
    newErrors.nom = "Veuillez saisir votre nom complet";
  }
  
  if (!clientData.cin.trim()) {
    newErrors.cin = "Veuillez saisir votre CIN";
  }
  if (!clientData.email.trim()) {
    newErrors.email = "Veuillez saisir votre email";
  }else if(!isValidEmail(clientData.email)){
    newErrors.telephone = "Veuillez saisir un email valide";
  }
  if (!clientData.telephone.trim()) {
    newErrors.telephone = "Veuillez saisir votre numéro de téléphone ";
  }else if(!isValidPhone(clientData.telephone)){
    newErrors.telephone = "Veuillez saisir un numéro de téléphone valide";
  }
  
  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
  //  When button clicked, open the hidden file input
  const handleButtonClick = () => {
    fileInputRef.current.click();  
    
  };
  const handleButtonClick1 = () => {
    fileInputRef1.current.click();  
  };
  const handleButtonClick2 = () => {
    fileInputRef2.current.click();  
  };
  // //  When user selects a file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        setErrors1({
        ...errors1,
        filename: ""
      });
        setfileURL(file)
      setFileName(file.name);
   
    }
   
  };
  const handleFileChange1 = (event) => {
    const file = event.target.files[0];
    if (file) {
        setErrors1({
        ...errors1,
        filename1: ""
      });
      setfileURL1(file)
      setFileName1(file.name);
    }
   
  };
  const handleFileChange2 = (event) => {
    const file = event.target.files[0];
    if (file) {
        setErrors1({
        ...errors1,
        filename2: ""
      });
      setfileURL2(file)
      setFileName2(file.name);
      
    }
    
  };
   
    // =====================pour les produits==============
    
    const ajouterProduit = (e) => {
    e.preventDefault();
    if(validateStep() && validateStep1()){
    const nouveauProduit = {
      nomProduit: nomProduit,
      quantite: quantite,
      dateDebutStockage:dateDebut,
      chambre:optionSelectionnee,
      dateFinStockage:dateFin.finReservation,
      dureeStockage:duree,
      prix:parametres.prixReservation*quantite*duree
    };
    console.log("voici le nauveau produit",nouveauProduit)
    const nouveauDocument={
      facture:fileURL,
      onssa:fileURL1,
      rc:fileURL2
    }
    setDateFin({
      ...dateFin,
    dateDebutStockage: "",
    dureeStockage: "",
    finReservation:""
    })

    setProduits([...produits, nouveauProduit]);
    setFiles([...files,nouveauDocument])
    setDone1(false)
    // vider les inputs après l'ajout
    setNomProduit("");
    setQuantite("");
    setDuree("")
    setDateDebut("")
    setTemperature("")
    setfileURL(null);
    setfileURL1(null);
    setfileURL2(null);
    setFileName("")
    setFileName1("")
    setFileName2("")
    setFiltre(null)
  }
  };

//   ===============suprime un produit ajoute=========
const supprimerProduit = (indexProduit) => {
   const produitSupprime = produits[indexProduit];
   const fileSuprime=files[indexProduit]
    
  setProduits(produits.filter((_, index) => index !== indexProduit));
  setFiles(files.filter((_, index) => index !== indexProduit));
  
};
    // =====================================================================
    const [show,setshow]=useState(0);
    useEffect(()=>{
                    setTimeout(()=>{
                        setshow(1);
                    },2000);
                },[]);
    const onClientChange=(e)=>{
      
        setClientData({
      ...clientData,
      [e.target.name]: e.target.value
    });
    setErrors({
      ...errors,
      [e.target.name]:""
    })
 
  }
 
    //================================calculer la date de fin de la reservation
   const calculateDateFin = (e) => {
  const { name, value } = e.target;
    console.log(dateDebut)
    console.log(duree)
  let updatedDateFin = {
    ...dateFin,
    [name]: value
  };

  if (updatedDateFin.dateDebutStockage && updatedDateFin.dureeStockage) {
    const dateDebut = new Date(updatedDateFin.dateDebutStockage);

    dateDebut.setDate(
      dateDebut.getDate() + Number(updatedDateFin.dureeStockage)
    );

    updatedDateFin = {
      ...updatedDateFin,
      finReservation: dateDebut.toISOString().split("T")[0]
    };
  } else {
    updatedDateFin = {
      ...updatedDateFin,
      finReservation: ""
    };
  }

  setDateFin(updatedDateFin);

};

// ======================================================================
   const [boite,setBoite]=useState(false)
   const [message,setMessage]=useState(false)
    const handleSubmit=async(e)=>{
    
            e.preventDefault();
      console.log(produits.length)
      console.log(done)
      console.log(done1)
    if(validateStep1() && produits.length>0){
      if(!verified){
          toast.error("Veuillez vérifier vos coordonnées.")
      }else{
        setBoite(true)
      }
      
  

    }
    else{
      if(validateStep1()){
        setDone(false)
      }else{
      setDone(true)}
      if(produits.length===0){
        setDone1(true)
      }
    }
  };
   // ====================================envoyer les donnees==========
  const envoyerDemande=async()=>{
    setBoite(false)
    const formData = new FormData();

  const requestData = {
    client: {
      cin: clientData.cin,
      nom: clientData.nom,
      email: clientData.email,
      telephone: clientData.telephone
    },

    produits: produits.map((produit) => ({
      nom: produit.nomProduit,
      quantite: produit.quantite,
      id:produit.chambre.id,
      temperatureStockage:produit.chambre.temperature,
      nomChambre:produit.chambre.nomChambre,
      dateDebutStockage:produit.dateDebutStockage,
      dateFinStockage:produit.dateFinStockage,
      dureeStockage:produit.dureeStockage,
      prix:Number(parseFloat(produit.prix).toFixed(2)),
      statut:"enAtente"
    }))
  };
  console.log("les produits envoye",requestData )
  formData.append("data", JSON.stringify(requestData));

  files.forEach((file, index) => {
    formData.append(`facture_${index}`, file.facture);
    formData.append(`onca_${index}`, file.onssa);
    formData.append(`rc_${index}`, file.rc);
  });
  for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
  }
  
  console.log(requestData)
  try {
    const response = await axios.post(
      "http://localhost:8080/api/produits/add",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    if(response.data.success===false){
      toast.error(response.data.message)
    }
    else{
    setProduits([])
    setFiles([])
    setClientData({
        ...clientData,
        cin:"",
        nom:"",
        email:"",
        telephone:""
    })
    setVerified(false)
    setDateFin({
      ...dateFin,
    dateDebutStockage: "",
    dureeStockage: "",
    finReservation:""
    })
    setMessage(true)
    }
  } catch (error) {
    console.error("Erreur :", error);
  }
  }
  // ==================pour varifier le email et le phone
  const [verified,setVerified]=useState(false);



const verifierCoordonnees=()=>{


  if( validateStep1()){
     axios.post(
        "http://localhost:8080/api/client/sendCode",
        {
            email:clientData.email,
            telephone:clientData.telephone
        }
    );


     setOpenVerification(true);

}}
 

    // ============================
    return(<>
    {message && <Message closeWindow={()=>setMessage(false)}/>}
      <VerificationModal

    open={openVerification}

    onClose={()=>
        setOpenVerification(false)
    }

    email={clientData.email}

    telephone={clientData.telephone}


    onVerified={()=>{

        setVerified(true);

    }}

/>
    {boite && <Ouinon type={0} sortir={()=>envoyerDemande()} annuler={()=>setBoite(false)} />}
    {show===0?<Loader />:<>
    <Header at={2} atphone={3} at1={2}/>
    <Main back={img3} at={4}/>
    {/* =================================== */}
    <div id="dem1">
        <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0 }}
        viewport={{ once: true, amount: 0 }}
        >
        <hr/>
        <h1>Réservez <span className="span">votre</span> espace <span className="span">frigorifique</span></h1>
        </motion.div>
        <motion.h3
       initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0.2 }}
        viewport={{ once: true, amount: 0 }} 
       >Remplissez le formulaire ci-dessous pour demander votre réservation.</motion.h3>
        <motion.h3
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0.4 }}
        viewport={{ once: true, amount: 0 }}
        >Notre équipe vous contactera rapidement pour confirmer la disponibilité.</motion.h3>
    </div>
    <motion.form
    initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0.5 }}
        viewport={{ once: true, amount: 0 }}
    onSubmit={handleSubmit} id="dem2">
        <h1>Veuillez saisir les informations demandées.</h1>
        <div>
        <div className="wave-group">
        <input  placeholder=" "  type="text" className="input" name="nom" value={clientData.nom} onChange={onClientChange}/>
        <span className="bar"></span>
        <label className="label">
        <span className="label-char" style={{ "--index": 0 }}>Nom complet</span>
        </label>
        </div>
        {errors.nom && <p className="errors">{errors.nom}</p>}
         <div className="wave-group">
        <input  placeholder=" "  type="text" className="input" name="cin" value={clientData.cin} onChange={onClientChange} />
        <span className="bar"></span>
        <label className="label">
        <span className="label-char" style={{ "--index": 0 }}>CIN</span>
        </label>
        </div>
        {errors.cin && <p className="errors">{errors.cin}</p>}
         <div style={{opacity:verified?"0.3":"1"}} className="wave-group">
        <input disabled={verified?true:false}   placeholder=" "  type="text" className="input" name="email" value={clientData.email} onChange={onClientChange} />
        <span className="bar"></span>
        <label className="label">
        <span className="label-char" style={{ "--index": 0 }}>Email</span>
        </label>
        </div>
        {errors.email && <p className="errors">{errors.email}</p>}
         <div style={{opacity:verified?"0.3":"1"}} className="wave-group">
        <input disabled={verified?true:false}  placeholder=" "  type="text" className="input" name="telephone" value={clientData.telephone} onChange={onClientChange} />
        <span className="bar"></span>
        <label className="label">
        <span className="label-char" style={{ "--index": 0 }}>Téléphone</span>
        </label>
        </div>
        {errors.telephone && <p className="errors">{errors.telephone}</p>}
         <div style={{display:"flex",gap:"10px",justifyContent:"flex-end",width:"90%"}}>
        { verified && <button onClick={()=>setVerified(false)} type="button" id="modifierverification">Modifer</button>}
        <button
            id="verifier"
            type="button"
            onClick={verifierCoordonnees}
        >
            Vérifier mes coordonnées
        </button>
        
        </div>
        </div>
        {/* ========================================================== */}
        {/* ########################################################### */}
        <div>
          <div><img src={product}/><h3>Veuillez ajouter les produits que vous souhaitez stocker </h3></div>
        {/* ============================================================= */}
         <div className="wave-group">
        <input placeholder=" "  type="text" className="input" name="nomProduit" value={nomProduit} onChange={(e) => {setErrors1({...errors1,[e.target.name]:""});setNomProduit(e.target.value)}}/>
        <span className="bar"></span>
        <label className="label">
        <span className="label-char" style={{ "--index": 0 }}> Nom du produit</span>
        </label>
        </div>
        {errors1.nomProduit && <p  style={{width:'100%'}} className="errors">{errors1.nomProduit}</p>}
        {/* ============================================================= */}
         <div className="wave-group">
        <input placeholder=" "  type="number" min="0"  className="input" name="quantite" value={quantite} onChange={(e) => {setErrors1({...errors1,[e.target.name]:""});setQuantite(e.target.value)}}/>
        <span className="bar"></span>
        <label className="label">
        <span className="label-char" style={{ "--index": 0 }}> Quantité en tonne</span>
        </label>
        </div>
          {errors1.quantite && <p style={{width:'100%'}} className="errors">{errors1.quantite}</p>}
        
        {/* ++++++++++++++++++++++++++++++++++++++++++ */}
       <div style={{height:"40px",padding:"0"}} id="selectChambre">
  <label style={{fontSize:"clamp(0.8rem,1vw,3rem)",marginBottom:"1%"}}>Température de stockage : </label>

  <div style={{width:"60%"}} className="select-filter">
    <div
      style={{height:"39px"}}
      className="select-box-filter"
      onClick={() => setOpen(!open)}
    >
      <span style={{fontSize:"clamp(0.8rem,1vw,3rem)",fontFamily: "'Playfair Display', serif"}}>
        {optionSelectionnee
          ? `${optionSelectionnee.nomChambre} (${optionSelectionnee.temperature} °C)`
          : "Choisir une température"}
      </span>

      <span>
        <img width="30px" src={arowdown} />
      </span>
    </div>

    {open && (
      <div className="select-options-filter">
        {chambres.map((option) => (
          <div
            key={option.id}
            className={`select-option-filter ${filtre === option.id ? "active" : ""}`}
            onClick={() => {
              setFiltre(option.id);
              setOpen(false);
              setErrors1({...errors1,temperature:""});setTemperature(option.nomChambre)
            }}
          >
            {option.nomChambre} ({option.temperature} °C)
          </div>
        ))}
      </div>
    )}
  </div>
</div>
{errors1.temperature && <p style={{width:'100%'}} className="errors">{errors1.temperature}</p>}

        {/* +++++++++++++++++++++++++++++++++++++++++++ */}
        <div  className="reda">
        <label style={{width:"40%"}} className='option'>Date de Stockage :</label>
        <input style={{width:"60%"}} min={minDate} className="typeemprunt" type="date"  name="dateDebutStockage" value={dateDebut} onChange={(e)=>{setErrors1({...errors1,[e.target.name]:""});setDateDebut(e.target.value);calculateDateFin(e)}}  />
        </div>
        {errors1.dateReservation && <p style={{width:"100%"}} className="errors">{errors1.dateReservation}</p>}
        {/* ======================================== */}
        <div className="wave-group">
        <input  placeholder=" "  type="number"  className="input" name="dureeStockage" value={duree} onChange={(e)=>{setErrors1({...errors1,[e.target.name]:""});setDuree(e.target.value);calculateDateFin(e)}} />
        <span className="bar"></span>
        <label className="label">
        <span className="label-char" style={{ "--index": 0 }}>Durée de stockage en jour</span>
        </label>
        </div>
        {errors1.dureeReservation && <p style={{width:"100%"}} className="errors">{errors1.dureeReservation}</p>}
        <div>
        {dateFin.finReservation && <p id="datefin">Date de fin de votre stockage est : {dateFin.finReservation}</p>}

        </div>
        {/* ============================================================ */}
        {/* ============================================================ */}
        <h3>Veuillez joindre les documents suivants au format PDF</h3>
         <div>
         <div className="reda">
        <label className='option'>Facture :</label>
        <button type="button" onClick={handleButtonClick}   id="atphone"><img src={fileName===""?add:change1}/></button>
        <input onChange={handleFileChange} ref={fileInputRef} accept="application/pdf" style={{ display: "none" }}  type="file"  />
        </div>
        {errors1.filename && <p className="errors">{errors1.filename}</p>}
        {fileName && <p className="nomfile">{fileName}</p>}
         <div className="reda">
        <label className='option'>Attestation ONSSA :</label>
        <button type="button" onClick={handleButtonClick1}   id="atphone"><img src={fileName1===""?add:change1}/></button>
        <input onChange={handleFileChange1} ref={fileInputRef1} accept="application/pdf" style={{ display: "none" }}  type="file"  />
        </div>
        {errors1.filename1 && <p className="errors">{errors1.filename1}</p>}
        {fileName1 && <p className="nomfile">{fileName1}</p>}
         <div className="reda">
        <label className='option'>IRC :</label>
        <button type="button" onClick={handleButtonClick2}   id="atphone"><img src={fileName2===""?add:change1}/></button>
        <input onChange={handleFileChange2} ref={fileInputRef2} accept="application/pdf" style={{ display: "none" }}  type="file"  />
        </div>
        {errors1.filename2 && <p className="errors">{errors1.filename2}</p>}
        {fileName2 && <p className="nomfile">{fileName2}</p>}
        </div>
        <div>
        <button type="button" onClick={ajouterProduit}><img src={addproduct}/>Ajouter</button>

        </div>
        </div>
        <div>
        {produits.map((produit,index)=>(
            
            <div key={index} id="produit"><p>{produit.nomProduit}<br/> ({produit.quantite} tonnes, {produit.chambre.temperature} °C, {produit.dateDebutStockage}, {produit.dureeStockage} jours, {produit.prix.toFixed(2)} DH)</p><button type="button" onClick={()=>supprimerProduit(index)} ><img src={del}/></button></div>
        
        ))}
        </div>
       
        <div id="warning"><img src={warning}/><p>Veuillez vérifier les informations que vous avez saisies avant l’envoi de la demande.</p></div>

        <button>Envoyer la demande</button>
        {done && <p style={{textAlign:"center",marginTop:"-5%"}} className="errors">Vous devez remplir tous les champs.</p>}
        {!done &&(done1 && <p style={{textAlign:"center",marginTop:"-5%"}} className="errors">Vous devez ajouter au moins un produit.</p>)}

    </motion.form>
    {/* ============================================ */}
    <div id="dem3">
        <motion.h1
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0 }}
        viewport={{ once: true, amount: 0 }}
        >Pourquoi réserver chez nous ?</motion.h1>
        <div>
            <div>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0.2 }}
        viewport={{ once: true, amount: 0 }}
            >
            <div></div>
            <p>Processus simple et rapide</p>
            <img src={img8}/>
            
            </motion.div>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0.4 }}
        viewport={{ once: true, amount: 0 }}
            >
            <div></div>
            <p>Confirmation rapide</p>
            <img src={img9}/>
            
            </motion.div>
            </div>
            <div>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0.6 }}
        viewport={{ once: true, amount: 0 }}
            >
            <div></div>
            <p>Conditions optimales de conservation</p>
            <img src={img10}/>
            
            </motion.div>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay:0.8 }}
        viewport={{ once: true, amount: 0 }}
            >
            <div></div>
            <p>Espaces adaptés à vos besoins</p>
            <img src={img11}/>
            
            </motion.div>
            </div>
        </div>
    </div>
    <Upfooter/>
    <Footer/>
    </>}
    </>);
}
export default Demander;