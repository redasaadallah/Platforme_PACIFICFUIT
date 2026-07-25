import "../styles/boiteP.css"
import param1 from "../img/param1.png"
import param2 from "../img/param2.png"
import param3 from "../img/param3.png"
import param4 from "../img/param4.png"
import param5 from "../img/cooldown.png"
import param6 from "../img/product.png"
import pencil from "../img/pencil.png"
import close from "../img/close.png"
import trash from "../img/trash.png"
import add from "../img/add.png"
import concel from '../img/cancelwhite.png'
import save from "../img/diskette.png"
import { useState,useEffect } from "react"
import life from "../img/product-life.png"
import { toast } from "react-toastify";
import Ouinon from "./ouinon"
import axios from "axios";
import api from "../api/axios";
export default function BoiteP({admin,type,closeWindow,data,icon,param,onParamChange,onDelete}){
    const [typeP,setTypeP]=useState(type)
    const [chambres,setChambres]=useState(data)
    const [showSup,setShowSup]=useState(false)
    const [selectedId,setSelectedId]=useState("")
    const [selectedChambre,setSelectedChambre]=useState({})
        const [updatedParam,setUpdatedParam]=useState({})
    // =====================supprimer une chambre=================
    const supprimer=async()=>{
         try {
    await api.delete(`http://localhost:8080/api/chambres/${selectedId}`);
    const result = chambres.filter(item => item.id !== selectedId);
    setChambres(result);
    onDelete(result)
    toast.success("Chambre supprimée avec succès",{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    });

  } catch (error) {
    toast.error("Erreur lors de la suppression",{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    });
    console.error(error);
  }
  setShowSup(false)
    }
    // =========================modifier une chambre=====================
   const [updatedChambre, setUpdatedChambre] = useState({
  nomChambre: "",
  capacite: "",
  capaciteDisponible:"",
  temperature: "",
  visible: false,
});

useEffect(() => {
  if (selectedChambre) {
    setUpdatedChambre({
        id:selectedChambre.id,
      nomChambre:selectedChambre.nomChambre,
      capacite: selectedChambre.capacite,
      capaciteDisponible:selectedChambre.capaciteDisponible,
      temperature: selectedChambre.temperature,
      visible: selectedChambre.visible,
    });
  }
}, [selectedChambre]);
// ======================================
    const updateChambre=(e)=>{
        const { name, value } = e.target;
    if(name==="capacite"){
        if(value>selectedChambre.capacite){
        setUpdatedChambre({
      ...updatedChambre,
      [name]: value,
      capaciteDisponible: Number(selectedChambre.capaciteDisponible)+(Number(value)-Number(selectedChambre.capacite)),
    });}
    else if(value<selectedChambre.capacite){
        setUpdatedChambre({
      ...updatedChambre,
      [name]:value,
      capaciteDisponible: Number(selectedChambre.capaciteDisponible)-(Number(selectedChambre.capacite)-Number(value)),
    });
    }
    }else{
    setUpdatedChambre({
      ...updatedChambre,
      [name]: value === "true" ? true : value === "false" ? false : value,
    });}
    
    }
    // ===============================
    const update=async(e)=>{
        e.preventDefault();
const exists = chambres.some(
  c => c.nomChambre === updatedChambre.nomChambre && c.id !== selectedChambre.id
);
    
    if(updatedChambre.nomChambre===selectedChambre.nomChambre && updatedChambre.capacite===selectedChambre.capacite && updatedChambre.temperature===selectedChambre.temperature && updatedChambre.visible===selectedChambre.visible){
        toast.error("Aucune modification détectée",{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    })
    }else if(updatedChambre.capacite<selectedChambre.capacite-selectedChambre.capaciteDisponible){
        toast.error("La capacité ne peut pas être inférieure à la capacité disponible.",{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    })

    }else if(!exists){
        try {
      await api.put(
        `http://localhost:8080/api/chambres/${selectedChambre.id}`,
        updatedChambre
      );

      toast.success("Chambre modifiée avec succès",{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    });
       setChambres((prev) =>
        prev.map((c) =>
        c.nomChambre === selectedChambre.nomChambre ? updatedChambre : c
        )
    );
    setTypeP("espace")

    } catch (error) {
      toast.error("Erreur lors de la modification",{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    });
      console.error(error);
    }}else{
        toast.error("Ce nom de chambre existe déjà. Veuillez choisir un autre nom.",{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    })
    }
    }
    // pour garentir que les champs sont remplis
    const[errors,setErrors]=useState({})
    const [nomChambre,setNomChambre]=useState("")
    const [capacite,setCapacite]=useState("")
    const [temperature,setTemperature]=useState("")
  const validateStep=()=>{
    const newErrors={}
  if (!nomChambre.trim()) {
    newErrors.nom = "Veuillez saisir le nom de la chambre";
  }
  if (!capacite.trim()) {
    newErrors.capacite = "Veuillez saisir la capacité de la chambre";
  }
  if (!temperature.trim()) {
    newErrors.temperature = "Veuillez saisir la température de la chambre";}
  
  setErrors(newErrors)
return Object.keys(newErrors).length === 0;

}
    //==========================ajouter une chambre========
       const [addedChambre, setAddedChambre] = useState({
  nomChambre: "",
  capacite: "",
  temperature: "",
  visible: true,
});
    const addChambre=(e)=>{
        const { name, value } = e.target;

    setAddedChambre({
      ...addedChambre,
      [name]:value,
    });
    
    }
    const ajouter=async(e)=>{
        e.preventDefault();
        const exists = chambres.some(c => c.nomChambre === addedChambre.nomChambre);
        if(validateStep() && !exists){
  const payload = {
    ...addedChambre,
    capaciteDisponible: addedChambre.capacite, 
  };

  try {
    const response =await api.post("http://localhost:8080/api/chambres", payload);

    toast.success("Chambre ajoutée avec succès",{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    }); 
    setTypeP("espace")
    setChambres(response.data);
        
  } catch (error) {
    toast.error("Erreur lors de l'ajout",{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    });
  }
        }else if(exists){
            toast.error("Ce nom de chambre existe déjà. Veuillez choisir un autre nom.",{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    })
        }
    }
    //   ==========================================================
// ==============================pour la table paramettre=========
const [parametre, setParametre] = useState({
  prixReservation: param.prixReservation,
  prixPrelangemant: param.prixPrelangemant,
  dureeMinReservation: param.dureeMinReservation,
  dureeMaxReservation: param.dureeMaxReservation,
  dureeMinProlongement: param.dureeMinProlongement,
  dureeMaxProlongement: param.dureeMaxProlongement,
  delaiMaxEntreDemandeEtDebut: param.delaiMaxEntreDemandeEtDebut,
    delaiProlongement: param.delaiprolongement,
  quantiteMinProduit: param.quantiteMinProduit,
  quantiteMaxProduit: param. quantiteMaxProduit,
});
// ===============================la duree de reservation==========
const [isUnlimited, setIsUnlimited] = useState(true);
const [isUnlimited1, setIsUnlimited1] = useState(true);
const [value, setValue] = useState("");
const [value1, setValue1] = useState("");
const [choix,setChoix]=useState("")
const handleUnlimited = (val) => {
  setIsUnlimited(val);

  if (val) {
    setValue(""); // or 0
  }
};
const handleUnlimited1 = (val) => {
  setIsUnlimited1(val);

  if (val) {
    setValue1(""); // or 0
  }
};
// ===========================
const paramChange = (e) => {
     setParametre({
    ...parametre,
    ...param
});
  const { name, value } = e.target;

  setParametre((prev) => ({
    ...prev,
    [name]: Number(value), // important car backend = int
  }));

};
// ============================================================
const updateParametre = async (mode) => {
    
    if(choix===mode ){
        
  try {
    const res = await api.put(
      `http://localhost:8080/api/parametres/${param.idParametre}`,
      parametre
    );

    toast.success("Paramètres mis à jour avec succès",{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    });
    setParametre(res.data)
    onParamChange(res.data);
    setValue("")
    setValue1("")

  } catch (error) {
    toast.error("Erreur lors de la mise à jour",{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    });
    console.error(error);
  }}
};
// ===================pour le changement du mot de passe
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
// ====================================================
const modiferPassWord=async()=>{
    if(!passWord.trim() || !passWord1.trim() || !passWord2.trim()){
        toast.error("Veuillez remplir les trois champs.",{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    })
    }
    else if(passWord1!==passWord2){
        toast.error("Les nouveaux mots de passe saisis ne sont pas identiques",{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    })
    }
    else if(validatePassword(passWord1)!=="valide"){
        toast.error(validatePassword(passWord1),{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    })
    }else{
        try {
      const response = await api.post(
        "http://localhost:8080/api/admin/change-password",
        {
          email: admin.email,
          oldPassword: passWord,
          newPassword: passWord1,
        }
      );

      if (response.data.status === "success") {
        toast.success(response.data.message,{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    });
        closeWindow()
      } else {
        toast.error(response.data.message,{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    });
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la modification du mot de passe",{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    });
    }
    }
}
//   ==============================================================
    return(<>
    {showSup && <Ouinon sortir={()=>{supprimer()}} annuler={()=>setShowSup(false)} type={3}/>}
    <div id="black" style={{zIndex:"201"}}></div>
    <div id="espace">
        <div><img onClick={closeWindow} src={close}/></div>
        <div>
            <img src={icon==="espace"?param1:icon==="duree"?param2:icon==="dureep"?life:icon==="price"?param3:icon==="delai"?param5:icon==="quantite"?param6:param4}/>
            <h1> {icon==="espace"?" L’espace frigorifique":icon==="delai"?" Délai avant stockage":icon==="quantite"?" Quantité à stocker en tonne":icon==="duree"?"  La durée d’une réservation":icon==="dureep"?" La durée d’une prolongation":icon==="price"?"Le prix de réservation":"Le mot de passe"}</h1>
        </div>
        {/* ============================================= */}
        {typeP==="espace" &&
        <div id="capacite">
            
            <div>
                
            <table>
                <tr ><th>Nom de la chambre</th><th>Capacité totale en tonne</th><th>Capacité disponible en tonne</th><th>Température</th><th>Visible</th><th></th></tr>
                {chambres.map(ch => (
                <tr  style={{backgroundColor: ch.capaciteDisponible < 100 ? "#ffcbca" : "white"}}><td>{ch.nomChambre}</td><td>{ch.capacite}</td><td>{ch.capaciteDisponible}</td><td>{ch.temperature} °C </td><td>{ch.visible===true?"oui":"non"}</td><td><button onClick={()=>{setTypeP("espace1");setSelectedChambre(ch);}}><img src={pencil}/></button>{Number(ch.capacite)===Number(ch.capaciteDisponible) && <button className="delete" onClick={()=>{setShowSup(true);setSelectedId(ch.id)}}><img src={trash}/></button>}</td></tr>
                    ))}
            </table>
            </div>
            <div><p>Ajouter une chambre</p><button onClick={()=>{setTypeP("espace2");}}><img src={add}/></button></div>
        </div>}
        {typeP==="espace1" &&
        <div id="espace1">
            <section className="scrl">
            <table>
                <tr><th>Nom de la chambre</th><th>Capacité totale en tonne</th><th>Capacité disponible en tonne</th><th>Température</th><th>visible</th></tr>
                <tr><td>{selectedChambre.nomChambre}</td><td>{selectedChambre.capacite}</td><td>{selectedChambre.capaciteDisponible}</td><td>{selectedChambre.temperature} °C </td><td>{selectedChambre.visible===true?"oui":"non"}</td></tr>
            </table>
            </section>
            <form onSubmit={update}>
                <input placeholder="Nouveau nom de la chambre" type="text" name="nomChambre" onChange={updateChambre}/>
                <input placeholder="Nouvelle capacite en tonne" type="number" name="capacite" onChange={updateChambre}/>
                { selectedChambre.capacite===selectedChambre.capaciteDisponible &&<input placeholder="Nouvelle Température en °C" type="number" name="temperature" onChange={updateChambre}/>}
                <div><label>Visible</label> <div><input type="radio" checked={updatedChambre.visible === true} value="true" name="visible" onChange={updateChambre}/><span>Oui</span><input type="radio" value="false"  checked={updatedChambre.visible === false} name="visible" onChange={updateChambre}/><span>Non</span></div></div>
                <div>
                    <button onClick={()=>{setTypeP("espace")}}><img src={concel}/></button>
                    <button><img src={save}/></button>
                </div>
            </form>
        </div>
    
        }
        {typeP==="espace2" &&
        <div id="espace2">
              <form onSubmit={ajouter}>
                <input placeholder="Nom de la chambre" type="text" value={nomChambre} onChange={(e) => {setErrors({...errors,[e.target.name]:""});addChambre(e);setNomChambre(e.target.value)}} name="nomChambre" />
                {errors.nom && <p  style={{width:'40%',marginTop:"0"}} className="errors">{errors.nom}</p>}
                <input placeholder="Capacite en tonne" type="number" value={capacite} onChange={(e) => {setErrors({...errors,[e.target.name]:""});addChambre(e);setCapacite(e.target.value)}} name="capacite" />
                {errors.capacite && <p  style={{width:'40%',marginTop:"0"}} className="errors">{errors.capacite}</p>}
                <input placeholder="Température en °C" type="number" name="temperature" value={temperature} onChange={(e) => {setErrors({...errors,[e.target.name]:""});addChambre(e);setTemperature(e.target.value)}} />
                {errors.temperature && <p  style={{width:'40%',marginTop:"0"}} className="errors">{errors.temperature}</p>}

                <div>
                    <button type="button" onClick={()=>{setTypeP("espace")}}><img src={concel}/></button>
                    <button><img src={save}/></button>
                </div>
            </form>
        </div>
        }
        {/* ===================================================== */}
        {type==="duree" &&
        <>
        <div id="duree">
            <h3>La durée minimale</h3>
            <div>
            <div >
                <div>
                    <input onChange={(e)=>{paramChange(e); handleUnlimited(true);setChoix("Rmin")}} value="-1" name="dureeMinReservation" type="radio"/>
                    <label>Aucune limite</label>
                </div>
                <div>
                    <input onChange={()=>{handleUnlimited(false);setChoix("Rmin")}}  name="dureeMinReservation" type="radio" />
                    <label>limitée</label>
                    <input style={{opacity:isUnlimited?"0":""}} value={value} disabled={isUnlimited} onChange={(e)=>{paramChange(e); setValue(e.target.value);setChoix("Rmin")}} name="dureeMinReservation"  type="number" />
                </div>
                <button onClick={()=>{updateParametre("Rmin")}}><img src={save}/></button>
            </div>
            <p>Durée minimale de réservation actuelle : {param.dureeMinReservation===-1?"Durée illimitée":param.dureeMinReservation+" jours"} </p>
            </div>
            <h3>La durée maximale</h3>
            <div>
            <div>
                <div>
                    <input onChange={(e)=>{paramChange(e); handleUnlimited1(true);setChoix("Rmax")}} value="-1" name="dureeMaxReservation" type="radio"/>
                    <label>Aucune limite</label>
                </div>
                <div>
                    <input onChange={()=>{handleUnlimited1(false);setChoix("Rmax")}} name="dureeMaxReservation" type="radio"/>
                    <label>limitée</label>
                    <input style={{opacity:isUnlimited1?"0":""}} value={value1} disabled={isUnlimited1} onChange={(e)=>{paramChange(e); setValue1(e.target.value);setChoix("Rmax")}} name="dureeMaxReservation"  type="number" />
                </div>
                <button onClick={()=>{updateParametre("Rmax")}}><img src={save}/></button>
            </div>
            <p>Durée maximale de réservation actuelle : {param.dureeMaxReservation===-1?"Durée illimitée":param.dureeMaxReservation+" jours"} </p>
            </div>
        </div>
        </>
        }
            {/* ===================================================== */}
        {type==="dureep" &&
        <>
        <div id="duree">
            <h3>La durée minimale</h3>
            <div>
            <div >
                <div>
                    <input onChange={(e)=>{paramChange(e); handleUnlimited(true);setChoix("Pmin")}} value="-1" name="dureeMinProlongement" type="radio"/>
                    <label>Aucune limite</label>
                </div>
                <div>
                    <input onChange={()=>{handleUnlimited(false);setChoix("Pmin")}} name="dureeMinProlongement" type="radio"/>
                    <label>limitée</label>
                    <input style={{opacity:isUnlimited?"0":""}} value={value} disabled={isUnlimited} onChange={(e)=>{paramChange(e); setValue(e.target.value);setChoix("Pmin")}} name="dureeMinProlongement" type="number" placeholder="Nombre de jours"/>
                </div>
                <button onClick={()=>{updateParametre("Pmin")}}><img src={save}/></button>
            </div>
            <p>Durée minimale de prolongation actuelle : {param.dureeMinProlongement===-1?"Durée illimitée":param.dureeMinProlongement+" jours"} </p>
            </div>
            <h3>La durée maximale</h3>
            <div>
            <div>
                <div>
                    <input onChange={(e)=>{paramChange(e); handleUnlimited1(true);setChoix("Pmax")}} value="-1" name="dureeMaxProlongement" type="radio"/>
                    <label>Aucune limite</label>
                </div>
                <div>
                    <input onChange={()=>{handleUnlimited1(false);setChoix("Pmax")}} name="dureeMaxProlongemet" type="radio"/>
                    <label>limitée</label>
                    <input style={{opacity:isUnlimited1?"0":""}} value={value1} disabled={isUnlimited1} onChange={(e)=>{paramChange(e); setValue1(e.target.value);setChoix("Pmax")}} name="dureeMaxProlongement"  type="number" placeholder="Nombre de jours"/>
                </div>
                <button onClick={()=>{updateParametre("Pmax")}}><img src={save}/></button>
            </div>
            <p>Durée minimale de prolongation actuelle : {param.dureeMaxProlongement===-1?"Durée illimitée":param.dureeMaxProlongement+" jours"} </p>
            </div>
        </div>
        </>
        }
        {/* ====================================================== */}
        {type==="price" &&
        <>
        <div style={{width:"80%"}} id="price">
            <div style={{width:"40%",marginLeft:"0px"}}>
                <div >
                <input value={value}  name="prixReservation" onChange={(e)=>{paramChange(e);setChoix("Rprix");setValue(e.target.value)}} type="number" placeholder="Prix de réservation"/>
                <button onClick={()=>{updateParametre("Rprix");setValue("")}}><img src={save}/></button>
                </div>
                <p>Le prix de réservation actuelle : {param.prixReservation} DH / tonne / jour</p>
            </div>
            <div>
                <div>
                <input value={value1} onChange={(e)=>{paramChange(e);setChoix("Pprix");setValue1(e.target.value)}} name="prixPrelangemant" type="number" placeholder="Prix de prolongement"/>
                <button onClick={()=>{updateParametre("Pprix");setValue1("")}}><img src={save}/></button>
                </div>
                <p>Le prix de prolongation actuelle : {param.prixPrelangemant} DH / tonne / jour</p>

            </div>
             </div>
        </>
        }
         {/* ====================================================== */}
        {type==="delai" &&
        <>
        <div id="delai">
            

                <div>
            <div >
                <h3>Délai de réservation</h3>
                <div>
                    <input onChange={(e)=>{paramChange(e); handleUnlimited(true);setChoix("Pmin")}} value="-1" name="delaiMaxEntreDemandeEtDebut" type="radio"/>
                    <label>Pas de délai</label>
                </div>
                <div>
                    <input onChange={()=>{handleUnlimited(false);setChoix("Pmin")}} name="delaiMaxEntreDemandeEtDebut" type="radio"/>
                    <label>limitée</label>
                    <input style={{opacity:isUnlimited?"0":""}} value={value} disabled={isUnlimited} onChange={(e)=>{paramChange(e); setValue(e.target.value);setChoix("Pmin")}} name="delaiMaxEntreDemandeEtDebut" type="number" />
                </div>
                <div>
                <button onClick={()=>{updateParametre("Pmin")}}><img src={save}/></button>
                <p>
                    Délai maximum de réservation :{" "}
                    {param.delaiMaxEntreDemandeEtDebut === -1
                        ? "Durée illimitée"
                        : param.delaiMaxEntreDemandeEtDebut + " jours"}
                    </p>
                </div>
            </div>
            </div>
             <div>
            <div >
                <h3>Délai de prolongation</h3>
                <div>
                    <input onChange={(e)=>{paramChange(e); handleUnlimited1(true);setChoix("Pmax")}} value="-1" name="delaiProlongement" type="radio"/>
                    <label>Pas de délai</label>
                </div>
                <div>
                    <input onChange={(e)=>{paramChange(e); handleUnlimited1(true);setChoix("Pmax")}} value="0" name="delaiProlongement" type="radio"/>
                    <label>Après que le prolongation commence</label>
                </div>
                <div>
                    <input onChange={()=>{handleUnlimited1(false);setChoix("Pmax")}} name="delaiProlongement" type="radio"/>
                    <label>Après des jours de la fin du prolongation actuel</label>
                    <input style={{opacity:isUnlimited1?"0":""}} value={value1} disabled={isUnlimited1} onChange={(e)=>{paramChange(e); setValue1(e.target.value);setChoix("Pmax")}} name="delaiProlongement" type="number" />
                </div>
                <div>
                <button onClick={()=>{updateParametre("Pmax")}}><img src={save}/></button>
<p>Délai de prolongation : {param.delaiProlongement === -1 ? "Aucune limite" : param.delaiProlongement === 0 ? "Après le début du prolongation" : param.delaiProlongement + " jours avant la fin du prolongation"}</p>
                </div>
            </div>
            </div>

        </div>
        </>
        }
           {/* ===================================================== */}
        {type==="quantite" &&
        <>
        <div id="duree">
            <h3>La Quantité minimale</h3>
            <div>
            <div >
                <div>
                    <input onChange={(e)=>{paramChange(e); handleUnlimited(true);setChoix("Qmin")}} value="-1" name="quantiteMinProduit" type="radio"/>
                    <label>Aucune limite</label>
                </div>
                <div>
                    <input onChange={()=>{handleUnlimited(false);setChoix("Qmin")}} name="quantiteMinProduit" type="radio"/>
                    <label>limitée</label>
                    <input style={{opacity:isUnlimited?"0":""}} value={value} disabled={isUnlimited} onChange={(e)=>{paramChange(e); setValue(e.target.value);setChoix("Qmin")}} name="quantiteMinProduit" type="number" placeholder="Quantité en tonne"/>
                </div>
                <button onClick={()=>{updateParametre("Qmin")}}><img src={save}/></button>
            </div>
            <p>Quantité à stocker minimale actuelle : {param.quantiteMinProduit===-1?"Durée illimitée":param.quantiteMinProduit} </p>
            </div>
            <h3>La Quantité maximale</h3>
            <div>
            <div>
                <div>
                    <input onChange={(e)=>{paramChange(e); handleUnlimited1(true);setChoix("Qmax")}} value="-1" name="quantiteMaxProduit" type="radio"/>
                    <label>Aucune limite</label>
                </div>
                <div>
                    <input onChange={()=>{handleUnlimited1(false);setChoix("Qmax")}} name="quantiteMaxProduit" type="radio"/>
                    <label>limitée</label>
                    <input style={{opacity:isUnlimited1?"0":""}} value={value1} disabled={isUnlimited1} onChange={(e)=>{paramChange(e); setValue1(e.target.value);setChoix("Qmax")}} name="quantiteMaxProduit" type="number" placeholder="Quantité en tonne"/>
                </div>
                <button onClick={()=>{updateParametre("Qmax")}}><img src={save}/></button>
            </div>
            <p>Quantité à stocker maximale actuelle : {param.quantiteMaxProduit===-1?"Durée illimitée":param.quantiteMaxProduit} </p>
            </div>
        </div>
        </>
        }
        {/* ====================================================== */}
        
         {type==="passe" &&
        
        <div id="passe">
            <div>
                <input name="password" value={passWord} onChange={(e)=>{setPassWord(e.target.value)}} type="text" placeholder="Mot de passe actuelle"/>
                <input type="text" name="password1" value={passWord1} onChange={(e)=>{setPassWord1(e.target.value)}} placeholder="nouveau mot de passe"/>
                <input type="text" name="password2" value={passWord2} onChange={(e)=>{setPassWord2(e.target.value)}} placeholder="nouveau mot de passe"/>
                <button onClick={modiferPassWord}><img src={save}/></button>
            </div>
            <small>Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un symbole.</small>
        </div>
        
        }
    </div>
    </>);
}