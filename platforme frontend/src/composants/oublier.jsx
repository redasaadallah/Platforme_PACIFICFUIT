import "../styles/oublier.css"
import close from "../img/close.png"
import lock from "../img/forgot.png"
import send from "../img/send1.png"
import react,{useState,useEffect} from "react"
import axios from "axios"
import { toast } from "react-toastify";
function Oublier({onClose,type}){ 
    const [email,setEmail]=useState("")
    const sendEmailAdmin=async(email)=>{
        const response = await axios.post("http://localhost:8080/api/admin/forgot-password", {
    email:email,
  });

  return response.data;
    }
  
    const sendEmailClient=async(email)=>{
        const response = await axios.post("http://localhost:8080/api/clients/forgot-password", {
    email:email,
  });

  return response.data;
    }
    function isValidEmail(email) {
  // Regex simple pour valider l'email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
  
    const handleSubmit=async(e)=>{
        e.preventDefault();
      if(!email.trim()){
          toast.error("Veuillez saisir votre Email", {
          style: {
            width: "400px",
            textAlign: "center",
            fontWeight: "500"
          }
        })

      }else
      if(!isValidEmail(email)){
        toast.error("Veuillez saisir un email valide", {
          style: {
            width: "400px",
            textAlign: "center",
            fontWeight: "500"
          }
        })
      }else{
     //Affiche un toast de chargement
    const loadingToastId = toast.loading("Envoi du nouveau mot de passe...");

    try {
      
      const response =type===1? await sendEmailClient(email):await sendEmailAdmin(email);
      
      
      if (response.success) {
        toast.update(  loadingToastId , {
          render: response.message,
          type: "success",
          isLoading: false,
          autoClose: 2000,
           closeButton:true,
                  style: {
            textAlign: "center",
            width:"500px"
            
          }
        
        });
        onClose()
      } else {
        toast.update( loadingToastId , {
          render: response.message,
          type: "error",
          isLoading: false,
          autoClose: 2000,
          closeButton:true,
                  style: {
            textAlign: "center",
            width:"500px"
            
          }
        });
      }
    } catch (err) {
      toast.error("Erreur lors de l'opération", { id: loadingToastId });
    }
  
  }
    }
    return(<>
    <div id="black"></div>
    <div id="oublier">
        <div><img onClick={onClose} src={close}/></div>
        <img src={lock}/>
        <p>Entrez votre adresse email {type===2 && "administrateur"} afin de recevoir votre mot de passe.</p>
        <form onSubmit={handleSubmit}>
            <div style={{width:"70%",minWidth:"300px"}} className="wave-group">
        <input placeholder=" "  type="text" className="input" onChange={(e)=>{setEmail(e.target.value)}} name="email" value={email} />
        <span className="bar"></span>
        <label className="label">
        <span className="label-char" style={{ "--index": 0 }}>Email</span>
        </label>
        </div>
            <button><img src={send}/>Envoyer</button>
        </form>

    </div>
    
    </>);

}
export default Oublier;