import "./styles/loginadmin.css"
import france from "./img/france.png"
import arow from "./img/up-down-arow.png"
import logo from "./img/logoo.png"
import img12 from './img/img12.png'
import login from "./img/login.png"
import {useNavigate} from "react-router-dom"
import react,{useState,useEffect} from "react"
import axios from "axios"
import Oublier from "./composants/oublier"
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginAdmin(){
    const [forgot,setForgot]=useState(false)
    const navigate=useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [errors,setErrors]=useState({})
    
    useEffect(()=>{
        const admin=sessionStorage.getItem("admin")
        if (admin) {
            navigate("/dashboard")
}

//  JWT Authentication
//  Spring Security config
//  Protected APIs
//  Token expiration
//  En résumé

// Ton plan initial couvre la base correcte pour une API sécurisée :

// JWT, expiration, Spring Security, endpoints protégés 

// Mais pour niveau production / PFE pro, ajoute :

// Refresh tokens
// Hash des mots de passe (BCrypt)
// Roles précis
// HTTPS obligatoire
// Audit/logging
// Optionnel : rate limiting et CSRF
    },[navigate])
// ==================================
 function isValidEmail(email) {
  // Regex simple pour valider l'email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
const validateStep1 = () => {
  let newErrors = {};

  if (!dataForm.email.trim()) {
    newErrors.email = "Veuillez saisir votre Email";
  }else if(!isValidEmail(dataForm.email)){
        newErrors.email = "Veuillez saisir un email valide";

  }
  if (!dataForm.motDePasse.trim()) {
    newErrors.motDePasse = "Veuillez saisir votre votre mot de passe";
  }
  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
    const connecter=()=>{
        navigate("/dashboard")
    }
    const [error,setError]=useState("")
    const [dataForm,setDataForm]=useState({
        email:"",
        motDePasse:""
    })
    const handleChange=(e)=>{
        setDataForm({
            ...dataForm,
            [e.target.name]:e.target.value
        })
    }
    // ==================================login pour le admin===========================
    const handleSubmit=async(e)=>{
        e.preventDefault();
    if(validateStep1()){
  try {
    const response = await axios.post(
      "/api/admin/login",
      dataForm
    );

    if (response.data.success) {
      // login OK
      // Remove all sessionStorage data
    sessionStorage.clear();
      sessionStorage.setItem("admin", JSON.stringify(response.data.admin));
      sessionStorage.setItem(
    "accessToken",
    response.data.accessToken
        );


        sessionStorage.setItem(
            "refreshToken",
            response.data.refreshToken
        );


        sessionStorage.setItem(
            "type",
            response.data.type
        );
      navigate("/dashboard")
    } else {
      setError(response.data.message);
    }

  } catch (error) {
    console.error(error);
    setError("Erreur serveur");
  }
    }}
 
    return(<>
    {forgot && <Oublier type={2} onClose={()=>setForgot(false)}/>}
    <div id="la1">
        <div>
            <img src={logo}/>
            <div>
                <hr/>
                <h1>Espace<span className="span"> administrateur</span></h1>
            </div>
        </div>
        <div>
            <button onClick={()=>{navigate("/home")}}>Espace Client</button>
        </div>
    </div>
    <h1 id="la2">Cet espace est réservé à l’administration de la plateforme.</h1>
    <div id="la3">
        <div><img src={img12}/></div>
        <form onSubmit={handleSubmit}>
            <div>
                <img src={login} />
                <h3>Veuillez vous connecter pour accéder au tableau de bord.</h3>
            </div>
            <div>
                <div className="wave-group">
        <input placeholder=" " type="text" className="input" name="email" onChange={handleChange} value={dataForm.email}
       onInvalid={(e) => {
            if (e.target.value === "") {
            e.target.setCustomValidity("Veuillez saisir votre email");
            } else {
            e.target.setCustomValidity(
                "Veuillez saisir un email valide (ex: exemple@gmail.com)"
            );
            }
        }}
        onInput={(e) => e.target.setCustomValidity("")}
        />
        <span className="bar"></span>
        <label className="label">
        <span className="label-char" style={{ "--index": 0 }}>Email administrateur</span>
        </label>
        </div>
        {errors.email && <p  style={{width:'90%'}} className="errors">{errors.email}</p>}

        <div className="wave-group">
        <input placeholder=" " type={showPassword ? "text" : "password"} className="input" name="motDePasse" onChange={handleChange} value={dataForm.motDePasse} />
        <span className="bar"
         onClick={() => setShowPassword(!showPassword)}
          style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer"
        }}
         >
        {showPassword ? <FaEyeSlash style={{ color: "#0A8D47", fontSize: "20px" }}/> : <FaEye style={{ color: "#0A8D47", fontSize: "20px" }} />}
            
         </span>
        <span className="bar"></span>
        <label className="label">
        <span className="label-char" style={{ "--index": 0 }}>Mot de passe</span>
        </label>
        </div>
        {errors.motDePasse && <p  style={{width:'90%'}} className="errors">{errors.motDePasse}</p>}

        <button type="button" onClick={()=>setForgot(true)}>Mot de passe oublié ?</button>
            </div>
             {error && <p className="errors" style={{marginBottom:"-3%"}}>{error}</p>}
            <button >Se connecter</button>
        </form>
    </div>
    </>);
}
export default LoginAdmin;