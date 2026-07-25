import React,{useEffect,useState} from "react"
import {useNavigate} from "react-router-dom"
import Loader from "./composants/loader";
import Header from "./composants/header";
import Main from "./composants/main";
import Upfooter from "./composants/upfooter";
import Footer from "./composants/footer";
import img7 from "./img/img7.jpg"
import "./styles/contact.css"
import imgco1 from "./img/imgcontact1.png"
import call from "./img/imgcon2.png"
import mail from "./img/imgcon3.png"
import location from "./img/imgcon4.png"
import linkedin from "./img/imgcon5.png"
import web from "./img/imgcon6.png"
import imgcon7 from "./img/imgcon7.png"
import Message from "./composants/message";
import toast from 'react-hot-toast';
import axios from "axios";
import { motion } from "framer-motion";

function Contact(){
    const navigate=useNavigate();
    const [show,setshow]=useState(0);
    const [error,setError]=useState("")
    
        useEffect(()=>{
                      setTimeout(()=>{
                          setshow(1);
                      },2000);
                  },[]);
    // ==================================================
    const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    contenu: ""
  });
  const [success, setSuccess] = useState(false);
  
   const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("")
  };
   const handleSubmit = async (e) => {
    e.preventDefault();
    if( Object.values(formData).some(value => typeof value === "string" && value.trim() === "")){
            setError(" Veuillez remplir tous les champs. ")
    }else{
    try {
      const response = await axios.post(
        "http://localhost:8080/api/messages",
        formData,
         {
    headers: {
      "Content-Type": "application/json"
    }
  }
      );

      setSuccess(true)
      setTimeout(()=>{
        setSuccess(false)
      },10000)
      
      

      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        contenu: ""
      });
      setError("")
    } catch (err) {
      console.error(err);
      
    }}
  };
  
    return(<>
    {success && <Message type={0} closeWindow={()=>{setSuccess(false)}}/>}
    {show===0?<Loader/>:<>
    <Header at={4} atphone={4}/>
    <Main back={img7} at={5}/>
    {/* -------------------------------- */}
    <div id="contact1">
        <div>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay:0 }}
            viewport={{ once: true, amount: 0 }}
            >
            <hr/>
            <h1><span className="span">Nos</span> coordonnées</h1>
            </motion.div>
            <motion.h3
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay:0.3 }}
            viewport={{ once: true, amount: 0 }}
            >Pour toute information ou demande concernant nos services, vous pouvez nous contacter via les coordonnées suivantes</motion.h3>
            
        </div>
        <div>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay:0.6 }}
            viewport={{ once: true, amount: 0 }}
            >
                <img src={imgco1}/>
            </motion.div>
            
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay:0.8 }}
            viewport={{ once: true, amount: 0 }}
            >
                <div>
                    <img src={call}/><p>+212 562030301</p>
                </div>
                <div>
                    <img src={mail}/><p>info.PACIFICFRUIT@gmail.com</p>
                </div>
                <div>
                    <img src={location}/><p>SIDI BARNOUSSI-CASABLANCA</p>
                </div>
                <div>
                    <img src={linkedin}/><p>PACIFIC FRUIT</p>
                </div>
                <div>
                    <img src={web}/><p>www.pacificfruit.ma</p>
                </div>
                
            </motion.div>
        </div>
    </div>
    {/* ======================================= */}
    <div id="contact2">
        <div>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay:0 }}
            viewport={{ once: true, amount: 0 }}
            >
                <hr/>
                <h1>Formulaire de <span className="span">contact</span></h1>
                </motion.div>
                <motion.h3
                initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay:0.3 }}
            viewport={{ once: true, amount: 0 }}
                >Pour toute demande d’information, veuillez remplir le formulaire ci-dessous.<br/>Notre équipe vous répondra dans les plus brefs délais.</motion.h3>
        </div>
        <div>
            <motion.form
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay:0.4 }}
            viewport={{ once: true, amount: 0 }}
            onSubmit={handleSubmit}>
                <h1>Veuillez remplir ce formulaire.</h1>
                <div>
                <div>
                <div className="wave-group">
                <input placeholder=" "  value={formData.nom} onChange={handleChange} name="nom" type="text" className="input" />
                <span className="bar"></span>
                <label className="label">
                    <span className="label-char" style={{ "--index": 0 }}>Nom</span>
                </label>
                </div>
                <div className="wave-group">
                <input placeholder=" " value={formData.prenom} onChange={handleChange} name="prenom" type="text" className="input" />
                <span className="bar"></span>
                <label className="label">
                    <span className="label-char" style={{ "--index": 0 }}>Prenom</span>
                </label>
                </div>
                </div>
                <div>
                <div className="wave-group">
                <input placeholder=" " value={formData.email} onChange={handleChange} name="email" type="text" className="input" />
                <span className="bar"></span>
                <label className="label">
                    <span className="label-char" style={{ "--index": 0 }}>Email</span>
                </label>
                </div>
                <div className="wave-group">
                <input placeholder=" " value={formData.telephone} onChange={handleChange} name="telephone" type="text" className="input" />
                <span className="bar"></span>
                <label className="label">
                    <span className="label-char" style={{ "--index": 0 }}>Téléphone</span>
                </label>
                </div>
                </div>
                
                <div className="wave-group">
                <textarea placeholder=" " value={formData.contenu} onChange={handleChange} name="contenu" type="text" className="input" ></textarea>
                <span className="bar"></span>
                <label className="label">
                    <span className="label-erea" style={{ "--index": 0 }}>Message</span>
                </label>
                </div>
                </div>
                {error && <p className="errors">{error}</p>}
                <button id="atphone" ><img/>Envoyer le message</button>
            </motion.form>

            <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay:0.6 }}
            viewport={{ once: true, amount: 0 }}
            >
                <img src={imgcon7}/>
            </motion.div>
        </div>
    </div>
    {/* ======================================= */}
    <div id="contact3">
        <div>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay:0 }}
            viewport={{ once: true, amount: 0 }}
            
            >
                <hr/>
                <h1><span className="span">Notre </span>localisation</h1>
            </motion.div>
            <motion.h3
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay:0.3 }}
            viewport={{ once: true, amount: 0 }}
            >Consultez la carte ci-dessous pour trouver facilement l’emplacement de notre entreprise.</motion.h3>
        </div>
        <motion.div
        initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay:0.6 }}
            viewport={{ once: true, amount: 0 }}
        >
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1576.43884863077!2d-5.820807735118711!3d35.77097321373828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0b87c3fdfa3b87%3A0x3bec5c71044f3725!2sSoufiane%20foods!5e1!3m2!1sfr!2sma!4v1775745571727!5m2!1sfr!2sma" 
        width="100%" height="450"  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </motion.div>
    </div>
    <Footer/>
    </>}
    </>);
}
export default Contact;