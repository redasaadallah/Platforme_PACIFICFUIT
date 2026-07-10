import "../styles/repondre.css"
import close from "../img/close.png"
import send from "../img/send1.png"
import React,{useEffect,useState} from "react"
import { toast } from "react-toastify";

import axios from "axios";
function Repondre({msg,closeWindow,done}){
    const [formData, setFormData] = useState({
    email:msg.email,
    nom: msg.nom,
      prenom:msg.prenom,
      message:msg.contenu,
      telephone:msg.telephone,
    reponce:""
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  // ==========================================
  const envoyerReponse = async (data) => {

  const toastId = toast.loading("Envoi de la réponse en cours...");

  try {
    const response = await axios.post(
      "http://localhost:8080/api/messages/send",
      data,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    toast.update(toastId, {
      render: "Réponse envoyée avec succès",
      type: "success",
      isLoading: false,
      autoClose: 3000
    });

    return response.data;

  } catch (error) {

    toast.update(toastId, {
      render: "Erreur lors de l’envoi",
      type: "error",
      isLoading: false,
      autoClose: 3000
    });

    console.error(error);
  }
};
  // ========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!formData.reponce.trim()){
      toast.error("Écrire un message")
    }else{
    
    try {
      const response = await envoyerReponse(formData)
      console.log(response)
      
      

      setFormData({
        email: "",
        reponce: ""
      });
      closeWindow()
      done()
    } catch (err) {
      console.error("Erreur :", err);
    }
    try {
    await axios.delete(`http://localhost:8080/api/messages/${msg.id}`);


    console.log("Message supprimé");
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
}
  };
// =================================================filtrage du message suprimmer====================

    return(<>
    <div id="black"></div>
   
    <form onSubmit={handleSubmit} id="repondre">
        <div>
            <img onClick={closeWindow} src={close}/>
        </div>
        <h1>{msg.nom} {msg.prenom}</h1>
        <p>{msg.contenu}</p>
        <textarea onChange={handleChange} name="reponce" placeholder="Répondre"></textarea>
        <button  ><img src={send}/>Envoyer</button>
    </form>
   
    </>);
}
export default Repondre;
