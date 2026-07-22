import "../styles/prolongement.css"
import clos from "../img/close.png"
import extention from "../img/extension.png"
import editProfil from "../img/edit-profile.png"
import add6 from "../img/add6.png"
import lock from "../img/lock.png"
import add from "../img/add.png"
import addproduct from "../img/add-product.png"
import { useState,useEffect,useRef } from "react"
import { toast } from "react-toastify";
import axios from "axios";
import change1 from "../img/exchange1.png"
import Ouinon from "./ouinon"
import arowdown from "../img/down-arrow (1).png"
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import api from "../api/axios";
  const chambres = [
  { nom: "A", temperature: -5},
  { nom: "B", temperature: -10},
  { nom: "C", temperature: -14},
];
function Prolongement({close,type,idpro,client,onClientChange,onDemandeSent,produit}){
    // =================les parametres et les chambres===========================
    const [parametres,setParametres]=useState({})
    const [chambres,setChambres]=useState([])
    const [errors1, setErrors1] = useState({});
    const [nomProduit, setNomProduit] = useState("");
    const [quantite, setQuantite] = useState("");
    const [temperature,setTemperature]=useState("")
    const [dateDebut,setDateDebut]=useState("")
    const [duree,setDuree]=useState("")
    const fileInputRef = useRef(null);
    const fileInputRef1 = useRef(null);
    const fileInputRef2 = useRef(null);
    const [fileName, setFileName] = useState("");
    const [fileName1, setFileName1] = useState("");
    const [fileName2, setFileName2] = useState("");
    const [fileURL,setfileURL]=useState(null);
    const [fileURL1,setfileURL1]=useState(null);
    const [fileURL2,setfileURL2]=useState(null);
    const [produits, setProduits] = useState([]);
       const [boite,setBoite]=useState(false)
       const [boite1,setBoite1]=useState(false)
    const [files, setFiles]=useState([])
    const [error,setError]=useState("")
      const [open, setOpen] = useState(false);
      const [filtre, setFiltre] = useState(null);
      
      
      const optionSelectionnee = chambres.find(option => option.id === filtre);
    
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
    const [minDate,setMinDate]=useState()
    
    useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer tous les paramètres
        const paramResponse = await axios.get('http://localhost:8080/api/parametres');
        setParametres(paramResponse.data[0]);
        console.log(paramResponse.data)
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
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split("T")[0]; // format YYYY-MM-DD
  setMinDate(minDate)
  }, []);
//===================changer les information pour le client
// ===========================
const [clientCh,setClientCh]=useState({
    email:client.email,
    telephone:client.telephone
})
const [value, setValue] = useState("");

const clientChange = (e) => {
     setClientCh({
    ...clientCh,
    ...client
});
  const { name, value } = e.target;

  setClientCh((prev) => ({
    ...prev,
    [name]: value, // important car backend = int
  }));
  
};
//=====================fonction pour modifier les information du client
// ============================================================
const updateClient = async (e) => {
    e.preventDefault();
   if(!value.trim()){
    toast.error("Veuillez remplir le champs")
   }else if(!isValidPhone(value) && type===3){
    toast.error("Veuillez saisir un numéro de téléphone valide")
   }else if(!isValidEmail(value) && type===4){
        toast.error("Veuillez saisir un email valide")
   }else if(value===client.telephone && type===3){
          toast.error("Le numéro de téléphone saisi est identique à celui déjà enregistré")
   }
   else if(value===client.email && type===4){
          toast.error("L’adresse email saisie est identique à celle déjà enregistrée")
   }
   else{
  try {
    const res = await api.put(
      `http://localhost:8080/api/client/${client.cin}`,
      clientCh
    );
    if(res.success==="true"){
    if(type===3){
    toast.success("Le numéro de téléphone a été mis à jour avec succès");}
    else if(type===4){
    toast.success("L’adresse email a été mise à jour avec succès");}
    onClientChange(res.data);
    setValue("")
    localStorage.setItem(
    "client",
    JSON.stringify(res.data)
);}else{

  toast.error(res.message)
}
    

  } catch (error) {
    toast.error("Erreur lors de la mise à jour");
    console.error(error);
  }}
};
// ===================pour le changement du mot de passe la verification
const [passWord,setPassWord]=useState("")
const [passWord1,setPassWord1]=useState("")
const [passWord2,setPassWord2]=useState("")
const validatePassword=(password)=> {
    if (password.length < 8) {
        return "Le mot de passe doit contenir au moins 8 caractères";
    }

    if (!/[A-Z]/.test(password)) {
        return "Le mot de passe doit contenir au moins une lettre majuscule";
    }

    if (!/[0-9]/.test(password)) {
        return "Le mot de passe doit contenir au moins un chiffre";
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;/]/.test(password)) {
        return "Le mot de passe doit contenir au moins un symbole";
    }

    return "valide";
}
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
//===========================la fonction pour changer le mot de passe
const modifierPassWord=async(e)=>{
    e.preventDefault();
    if(!passWord.trim() || !passWord1.trim() || !passWord2.trim()){
        toast.error("Veuillez remplir les trois champs.")
    }
    else if(passWord1!==passWord2){
        toast.error("Les nouveaux mots de passe saisis ne sont pas identiques")
    }
    else if(validatePassword(passWord1)!=="valide"){
        toast.error(validatePassword(passWord1))
    }else if(passWord===passWord1){
      toast.error("Le mot de passe saisi est identique à celui déjà enregistré")
    }
    
    else{
        try {
      const response = await api.post(
        "http://localhost:8080/api/client/change-password",
        {
          cin: client.cin,
          oldPassword: passWord,
          newPassword: passWord1,
        }
      );

      if (response.data.status === "success") {
        toast.success(response.data.message);
        close()
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la modification du mot de passe");
    }
    }
}
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


  //============================pour afficher la boite pour envoyer la demande
  const handleSubmit=async(e)=>{
    
            e.preventDefault();
            
    if(validateStep()){
        
      setBoite(true)
    }
  
  };
   // ====================================envoyer les donnees==========
  const envoyerDemande=async()=>{
    setBoite(false)
    const formData = new FormData();
    //====================================
    //====================================
    const nouveauProduit = [{
      nomProduit: nomProduit,
      quantite: quantite,
      chambre:optionSelectionnee,
      dateDebutStockage:dateDebut,
      dateFinStockage:dateFin.finReservation,
      dureeStockage:duree,
      prix:parametres.prixReservation*quantite*duree
    }];
    
    const nouveauDocument=[{
      facture:fileURL,
      onssa:fileURL1,
      rc:fileURL2
    }]
    setDateFin({
      ...dateFin,
    dateDebutStockage: "",
    dureeStockage: "",
    finReservation:""
    })

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
    //======================================
    //=========================================
  const requestData = {
    client: {
      cin: client.cin,
      nom: client.nom,
      email: client.email,
      telephone: client.telephone
    },

    produits: nouveauProduit.map((produit) => ({
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
  formData.append("data", JSON.stringify(requestData));

  nouveauDocument.forEach((file, index) => {
    formData.append(`facture_${index}`, file.facture);
    formData.append(`onca_${index}`, file.onssa);
    formData.append(`rc_${index}`, file.rc);
  });
  for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
  }
  
 
  try {
    const response = await api.post(
      "http://localhost:8080/api/produits/add",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    close()
     onDemandeSent(true,true,false)
    setClientData({
        ...clientData,
        cin:"",
        nom:"",
        email:"",
        telephone:""
    })
    
    setDateFin({
      ...dateFin,
    dateDebutStockage: "",
    dureeStockage: "",
    finReservation:""
    })
   
  } catch (error) {
    console.error("Erreur :", error);
  }
  }
//=======faire le prolongement====================
const afficherBoiteProlongement=(e)=>{
    e.preventDefault()
    if(!value.trim()){
        setError("Veuillez remplir le champ")
    }else if(value<=0){
        setError(" Le nombre de jours doit être supérieur à 0.")
    }
    else{
        if(parametres.dureeMinProlongement>value && parametres.dureeMinProlongement>0){
            setError("La durée minimale de prolongement est de "+parametres.dureeMinProlongement+" jours")
        }else if(parametres.dureeMaxProlongement<value && parametres.dureeMaxProlongement>0){
            setError("La durée maximale de prolongement est de "+parametres.dureeMaxProlongement+" jours")          
    }else{
        setBoite1(true)
    }}
}
const envoyerProlongement = async () => {
    
    
  try {
    const response = await api.post(
      "http://localhost:8080/api/prolongements/demande",
      {
        codeProduit: produit.idProduit,
        dateFinStockage:produit.dateFinStockage,
        nbJours: Number(value),
        prixProlongement:parseFloat(Number(parametres.prixPrelangemant)*Number(value)*Number(produit.quantite))
      }
    );
    console.log("++++++++++++++++++++++++",produit)
    setBoite1(false)
    close()
    onDemandeSent(false,true,false)
    toast.success("Votre prolongement de 20 jours a été enregistré avec succès et est en attente de validation.")
    console.log("Prolongement créé :", response.data);
  } catch (error) {
    console.error("Erreur lors de l'envoi du prolongement :", error);
  }
};
//=============================pour calculer la date prolongement
const [newDateFin, setNewDateFin] = useState(new Date(produit.dateFinStockage));

const calculerDateFinpro = (dateDebut, nbJours) => {
  const debut = dateDebut instanceof Date ? dateDebut : new Date(dateDebut);
  const fin = new Date(debut);
  fin.setDate(fin.getDate() + nbJours);
  return fin;
};

const changeDateFin = (vfin) => {
  if (!vfin || vfin.trim() === "") {
    setNewDateFin(new Date(produit.dateFinStockage));
  } else {
    const nbJours = parseInt(vfin, 10); // convertir en nombre
    
    setNewDateFin(calculerDateFinpro(produit.dateFinStockage, nbJours));
  }
};
//========================modifier un prolangement
const modifierProlongement = async (e) => {
  e.preventDefault()
    if(!value.trim()){
        setError("Veuillez remplir le champ")
    }else if(value<=0){
        setError(" Le nombre de jours doit être supérieur à 0.")
    }
    else{
        if(parametres.dureeMinProlongement>value && parametres.dureeMinProlongement>0){
            setError("La durée minimale de prolongement est de "+parametres.dureeMinProlongement+" jours")
        }else if(parametres.dureeMaxProlongement<value && parametres.dureeMaxProlongement>0){
            setError("La durée maximale de prolongement est de "+parametres.dureeMaxProlongement+" jours")          
    }else{
        try {
        
    const response = await api.put(
      `http://localhost:8080/api/prolongements/modifier/${idpro}`,
      { nbJours : Number(value),
        prix:parseFloat(Number(parametres.prixPrelangemant)*Number(value)*Number(produit.quantite))
       }
    );
    close()
    onDemandeSent(false,true,false)


    toast.success("Prolongement modifié avec succès");
    
  } catch (error) {
    console.error("Erreur lors de la modification :", error.response?.data || error.message);
    toast.error("Impossible de modifier ce prolongement");
  }
    }}
  
};


    return(<>

    {boite && <Ouinon type={0} sortir={()=>envoyerDemande()} annuler={()=>setBoite(false)} />}
    {boite1 && <Ouinon type={5} sortir={()=>envoyerProlongement()} annuler={()=>setBoite1(false)} />}

    <div id="black"></div>

    <div id="pro">
        <div>
            <img onClick={close} src={clos}/>
        </div>
        <div>
            <img src={type===0?extention:type===1?extention:type===3?editProfil:type===4?editProfil:type===2?add6:lock}/>
            <h1>{type===0?"Modification de prolongement":type===1?"Demande de prolongation":type===3?"Modifier mes informations personnelles":type===4?"Modifier mes informations personnelles":type===2?"Nouvelle demande de stockage":"Modification du mot de passe"}</h1>
        </div>
        {type===1 && 
        <div id="prelengement">
        <div><p>Produit : {produit.nomProduit}</p><p>Code : {produit.idProduit}</p></div>
        <form onSubmit={afficherBoiteProlongement}>
            <label>Entrez le nombre de jours</label>
            <input  min={0}
                    value={value}
                    type="number"
                    onChange={(e)=>{setValue(e.target.value);changeDateFin(e.target.value)}}
                    />
            <button>Envoyer</button>
        </form>
        {error && <p style={{marginTop:"0px"}} className="errors">{error}</p>}

        <p>Date de fin de votre réservation après prolongation : {newDateFin ? newDateFin.toLocaleDateString("fr-FR") : "–"}</p>
        </div>
            }
            {type===0 && 
        <div id="prelengement">
        <div><p>Produit : {produit.nomProduit}</p><p>Code : {produit.idProduit}</p></div>
        <form onSubmit={modifierProlongement}>
            <label>Entrez le nombre de jours</label>
            <input  min={0}
                    value={value}
                    type="number"
                    onChange={(e)=>{setValue(e.target.value);changeDateFin(e.target.value)}}
                    />
            <button>Envoyer</button>
        </form>
        {error && <p style={{marginTop:"0px"}} className="errors">{error}</p>}

        <p>Date de fin de votre réservation après prolongation : {newDateFin ? newDateFin.toLocaleDateString("fr-FR") : "–"}</p>
        </div>
            }
        {type===2 &&
    <form onSubmit={handleSubmit} id="addProduct">
        <div>
         <div className="wave-group">
        <input  placeholder=" "  type="text" className="input" name="nomProduit" value={nomProduit} onChange={(e) => {setErrors1({...errors1,[e.target.name]:""});setNomProduit(e.target.value)}} />
        <span className="bar"></span>
        <label className="label">
        <span className="label-char" style={{ "--index": 0 }}> Nom du produit</span>
        </label>
        </div>
        {errors1.nomProduit && <p  style={{width:'90%',marginTop:"-10px"}} className="errors">{errors1.nomProduit}</p>}
        {/* ============================================================= */}
         <div className="wave-group">
        <input placeholder=" "  type="number" min="0" step="0.01" className="input" name="quantite" value={quantite} onChange={(e) => {setErrors1({...errors1,[e.target.name]:""});setQuantite(e.target.value)}} />
        <span className="bar"></span>
        <label className="label">
        <span className="label-char" style={{ "--index": 0 }}> Quantité en tonne</span>
        </label>
        </div>
          {errors1.quantite && <p style={{width:'90%',marginTop:"-10px"}} className="errors">{errors1.quantite}</p>}
        
        {/* ++++++++++++++++++++++++++++++++++++++++ */}
          <div style={{width:"90%"}} id="selectChambre">
  <label>Température de stockage : </label>

  <div style={{width:"48%",height:"40px"}} className="select-filter">
    <div
      style={{height:"40px"}}
      className="select-box-filter"
      onClick={() => setOpen(!open)}
    >
      <span>
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
{errors1.temperature && <p style={{width:'90%',marginTop:"-10px"}} className="errors">{errors1.temperature}</p>}
        {/* ++++++++++++++++++++++++++++++++++++++++++++ */}
        <div  className="reda">
        <label className='option'>Date de Stockage :</label>
        <input  className="typeemprunt" min={minDate} className="typeemprunt" type="date"  name="dateDebutStockage" value={dateDebut} onChange={(e)=>{setErrors1({...errors1,[e.target.name]:""});setDateDebut(e.target.value);calculateDateFin(e)}}/>
        </div>
        {errors1.dateReservation && <p className="errors" style={{marginTop:"-10px"}}>{errors1.dateReservation}</p>}
        {/* ======================================== */}
        <div className="wave-group">
        <input  placeholder=" "  type="number"  className="input" name="dureeStockage" value={duree} onChange={(e)=>{setErrors1({...errors1,[e.target.name]:""});setDuree(e.target.value);calculateDateFin(e)}}  />
        <span className="bar"></span>
        <label className="label">
        <span className="label-char" style={{ "--index": 0 }}>Durée de stockage en jour</span>
        </label>
        </div>
        {errors1.dureeReservation && <p style={{marginTop:"-10px"}} className="errors">{errors1.dureeReservation}</p>}
        <div style={{width:"90%"}}>
        {dateFin.finReservation && <p   id="datefin">Date de fin de votre stockage est : {dateFin.finReservation}</p>}

        </div>
        </div>
        <h3>Veuillez joindre les documents suivants au format PDF</h3>
         <div style={{width:"90%",marginInline:"auto"}} >
         <div  className="reda">
        <label className='option'>Facture :</label>
        <button type="button" onClick={handleButtonClick}   id="atphone"><img src={fileName===""?add:change1}/></button>
        <input onChange={handleFileChange} ref={fileInputRef} accept="application/pdf" style={{ display: "none" }}  type="file"  />
        </div>
        {errors1.filename && <p className="errors" style={{marginTop:"-10px"}}>{errors1.filename}</p>}
        {fileName && <p className="nomfile">{fileName}</p>}
         <div className="reda">
        <label className='option'>Attestation ONSSA :</label>
        <button type="button" onClick={handleButtonClick1}   id="atphone"><img src={fileName1===""?add:change1}/></button>
        <input onChange={handleFileChange1} ref={fileInputRef1} accept="application/pdf" style={{ display: "none" }}  type="file"  />
        </div>
        {errors1.filename1 && <p className="errors" style={{marginTop:"-10px"}}>{errors1.filename1}</p>}
        {fileName1 && <p className="nomfile" >{fileName1}</p>}
         <div className="reda">
         <label className='option'>IRC :</label>
        <button type="button" onClick={handleButtonClick2}   id="atphone"><img src={fileName2===""?add:change1}/></button>
        <input onChange={handleFileChange2} ref={fileInputRef2} accept="application/pdf" style={{ display: "none" }}  type="file"  />
        </div>
        {errors1.filename2 && <p className="errors" style={{marginTop:"-10px"}}>{errors1.filename2}</p>}
        {fileName2 && <p className="nomfile" >{fileName2}</p>}
        <div>
        <button style={{gap:"5px",width:"auto"}}><img src={addproduct}/>Envoyer</button>

        </div>
        </div>
    </form>
    }
    {type===3 &&
    <div id="changerinfo">
        <form onSubmit={updateClient}>
            <label>Entrez le nouveau numéro de téléphone</label>
            <input name="telephone" value={value} onChange={(e)=>{clientChange(e);setValue(e.target.value)}} type="text"/>
            <button>Modifier</button>
        </form>
        <p>Votre numéro de téléphone actuel est : {client.telephone}</p>
    </div>
    }
    {type===4 &&
    <div id="changerinfo">
        <form onSubmit={updateClient}>
            <label>Entrez la nouvelle adresse email</label>
            <input name="email" value={value} onChange={(e)=>{clientChange(e);setValue(e.target.value)}} type="email"/>
            <button>Modifier</button>
        </form>
        <p>Votre adresse email actuelle : {client.email}</p>
    </div>
    }
    {type===5 &&
    <div id="changerpasse">
        <form onSubmit={modifierPassWord}>
            <input name="password" value={passWord} onChange={(e)=>{setPassWord(e.target.value)}} type="text" placeholder="Mot de passe actuelle"/>
                <input type="text" name="password1" value={passWord1} onChange={(e)=>{setPassWord1(e.target.value)}} placeholder="nouveau mot de passe"/>
                <input type="text" name="password2" value={passWord2} onChange={(e)=>{setPassWord2(e.target.value)}} placeholder="nouveau mot de passe"/>
            <button>Modifier</button>
        </form>
        <small>Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un symbole.</small>

    </div>
    }
    </div>
    
    </>)

}
export default Prolongement;