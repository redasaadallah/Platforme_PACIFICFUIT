import React,{useEffect,useState} from "react"
import {useNavigate} from "react-router-dom"
import Loader from "./composants/loader";
import Header from "./composants/header";
import Main from "./composants/main";
import Upfooter from "./composants/upfooter";
import Footer from "./composants/footer";
import img5 from "./img/img5.jpg"
import "./styles/reservation.css"
import img8 from "./img/img8.jpg"
import login from "./img/login.png"
import img9 from "./img/img9.jpg"
import img10 from "./img/img10.jpg"
import img11 from "./img/home1.jpg"
import Oublier from "./composants/oublier";
import axios from "axios"
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
function Reservation(){
    const navigate=useNavigate();
    const [show,setshow]=useState(0);
    const [oublier,setoublier]=useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors,setErrors]=useState({})
    const forgot=()=>{
        setoublier(true)
    }
    useEffect(()=>{
                    setTimeout(()=>{
                        setshow(1);
                    },2000);
    const token = localStorage.getItem("client");

    if (token) {
      navigate("/espaceclient");
    }
                },[]);
// ==================================
const validateStep1 = () => {
  let newErrors = {};

  if (!dataForm.cin.trim()) {
    newErrors.cin = "Veuillez saisir votre CIN";
  }
  if (!dataForm.motDePasse.trim()) {
    newErrors.motDePasse = "Veuillez saisir votre votre mot de passe";
  }
  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
    //=====================================login==========================
    const [dataForm,setDataForm]=useState({
        cin:"",
        motDePasse:""
    })
    const handleChange=(e)=>{
        setDataForm({
            ...dataForm,
            [e.target.name]:e.target.value
        })
       
    }
    //==================================================
    
const handleSubmit=async(e)=>{
        e.preventDefault();
    if(validateStep1()){

    
  try {
    const response = await axios.post(
      "http://localhost:8080/api/client/login",
      dataForm
    );
    console.log(dataForm)
    console.log(response)
    if (response.data.success) {
      // login OK
    localStorage.setItem(
    "client",
    JSON.stringify(response.data.client)
);
localStorage.setItem(
    "accessToken",
    response.data.accessToken
);


localStorage.setItem(
    "refreshToken",
    response.data.refreshToken
);


localStorage.setItem(
    "type",
    response.data.type
);
            navigate("/espaceclient")
            
    } 
    else {
      toast.error(response.data.message);
      
    }

  } catch (error) {
    console.error(error);
  }}
    }

    return(<>
    {oublier  && <Oublier type={1} onClose={()=>{setoublier(false)}}/>}
        {show===0?<Loader/>:<>
    <Header at={2} atphone={2} at1={1}/>
    <Main back={img5}/>
    {/* ================================================ */}
    <div id="res1">
        <div>
            <hr></hr>
            <h1>Accéder à ma <span className="span">réservation</span></h1>
        </div>
        <h3>Si votre demande de réservation a déjà été acceptée, vous pouvez accéder à votre espace client pour consulter les détails de votre réservation.</h3>
    </div>
    <form onSubmit={handleSubmit} id="formres">
        <div>
            <img src={login}/>
            <h3>Connexion à votre espace</h3>
        </div>
        <div>
        <div className="wave-group">
        <input placeholder=" "  type="text" className="input" name="cin" onChange={handleChange} value={dataForm.cin} />
        <label className="label">
        <span className="label-char" style={{ "--index": 0 }}>CIN</span>
        </label>
        </div>
        {errors.cin && <p  style={{width:'90%',margin:"0"}} className="errors">{errors.cin}</p>}

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
        <label className="label">
        <span className="label-char" style={{ "--index": 0 }}>Mot de passe</span>
        </label>
       
        </div>
        {errors.motDePasse && <p  style={{width:'90%',margin:"0"}} className="errors">{errors.motDePasse}</p>}

        <button type="button" onClick={()=>{ forgot()}}>Mot de passe oublié ?</button>
        </div>
        <div>
            <button  >Accéder à ma réservation</button>
            <hr/>
            <button  type="button">Contactez-nous</button>
        </div>
    </form>
    {/* ================================================ */}
    <div id="res2">
        <div>
            <div>
            <h1>Pourquoi <span className="span">réserver</span> chez <span className="span">nous ?</span></h1>
            </div>
        </div>
        <div>
            <div>
                <img src={img8}/>
                <p>Processus simple et rapide</p>
            </div>
            <div>
                 <div>
                <img src={img9}/>
                <p>Confirmation rapide</p>
            </div>
             <div>
                <img src={img10}/>
                <p>Conditions optimales de conservation</p>
            </div>
            </div>
             <div>
                <img src={img11}/>
                <p>Espaces adaptés à vos besoins</p>
            </div>
        </div>
    </div>
    <Upfooter/>
    
    <Footer/>
    </>}
    </>);
}
export default Reservation;