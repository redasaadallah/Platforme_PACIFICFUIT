
import Header from "./composants/header";
import Main from "./composants/main";
import Upfooter from "./composants/upfooter";
import Footer from "./composants/footer";
import "./styles/home.css"
import img2 from "./img/img2.png"
import img3 from "./img/img3.jpg"
import boking from "./img/boking.png"
import ready from "./img/ready-stock.png"
import send from "./img/send.png"
import ver from "./img/verified.png"
import logoo from "./img/logoo.png"
import Splash from "./composants/splash"
import back from "./img/home1.jpg"
import React,{useEffect,useState} from "react"
import {useNavigate} from "react-router-dom"
import Loader from "./composants/loader";
import FadeIn from "./composants/fadein";
import { motion } from "framer-motion";

function Home(){
    const navigate=useNavigate();
    const [show,setshow]=useState(0);
    useEffect(()=>{
                  setTimeout(()=>{
                      setshow(1);
                  },2000);
              },[]);
   return(
   <>
   {show===0?<Loader/>:<>
    <Header at={0} atphone={0}/>
    <Main back={back}/>
   
    <div id="home2">
        
        <div>
            
            <motion.div initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay:0.3 }}
                        viewport={{ once: true, amount: 0 }}></motion.div>
           
            
            <motion.div initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay:0.6 }}
                        viewport={{ once: true, amount: 0 }}><img src={img2} alt=""/><img src={img3} alt=""/></motion.div>
        </div>
        
        <div>
            <div>
            <FadeIn delay={0.3}> 
            <hr/>
            </FadeIn>
            <FadeIn delay={0.3}>            
                <h1>Qui sommes<span className="span">-nous ?</span></h1>
            </FadeIn>
            </div>
            <FadeIn delay={0.4}>
            <h3>Votre partenaire en stockage frigorifique</h3>
            </FadeIn>
            <FadeIn delay={0.5}>
            <p>PACIFIC FRUIT met à votre disposition des espaces de stockage frigorifique sécurisés et adaptés aux professionnels.</p>
            </FadeIn>
            <FadeIn delay={0.6}>
            <p>Nous garantissons des conditions optimales de conservation pour préserver la qualité et la fraîcheur de vos produits.</p>
            </FadeIn>
        </div>
     </div>
     
     
{/* ---------------------------------------------------------------- */}
<div id="home3">
        <div>
            <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay:0 }}
                        viewport={{ once: true, amount: 0 }}
            >
            <hr/>
            <h1> Comment <span className="span">ça</span> marche <span className="span">?</span></h1>
            </motion.div>
            <motion.h3
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay:0.3 }}
                        viewport={{ once: true, amount: 0 }}
            >Un processus simple et rapide</motion.h3>
        </div>
        <div>
            <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay:0 }}
                        viewport={{ once: true, amount: 0 }}
            >
            <img src={boking} alt=""/>
            <h3>Choisissez l’espace adapté à vos besoins</h3>
            <p>Sélectionnez la capacité de stockage et la durée qui correspondent à votre activité. Nos solutions sont flexibles et conçues pour s’adapter à différents volumes et types de produits frigorifiés.</p>
        </motion.div>
            <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay:0.3 }}
                        viewport={{ once: true, amount: 0 }}
            >
            <img src={send} alt=""/>
            <h3>Envoyez votre demande de réservation</h3>
            <p>Remplissez le formulaire en ligne en quelques clics. Indiquez les informations nécessaires concernant vos produits et vos besoins afin que nous puissions traiter votre demande rapidement.</p>
        
            </motion.div>
            <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay:0.6 }}
                        viewport={{ once: true, amount: 0 }}
            >
            <img src={ver} alt=""/>
            <h3>Recevez la confirmation</h3>
            <p>Notre équipe examine votre demande et vous envoie une confirmation dans les plus brefs délais. Vous recevez tous les détails relatifs à votre réservation et aux conditions de stockage.</p>
    
            </motion.div>
            <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay:0.9 }}
                        viewport={{ once: true, amount: 0 }}
            >
             <img src={ready} alt=""/>
            <h3>Stockez vos produits en toute sécurité</h3>
            <p>Déposez vos produits dans nos installations frigorifiques sécurisées, bénéficiant d’un contrôle rigoureux de la température et d’une surveillance continue pour garantir une conservation optimale.</p>
        
            </motion.div>
        </div>
        <motion.button
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -6 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0, delay: 0 }}
                        viewport={{ once: true }}
                        onClick={() => navigate("/demander")}
                        id="btnf">Commencer votre réservation</motion.button>
      </div>
      {/* -------------------------------------------------------------- */}
      <div id="home4">
        <div>
            <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay:0 }}
                        viewport={{ once: true, amount: 0 }}
            >
            <hr/>
            <h1>Pourquoi <span className="span">nous</span> choisir <span className="span">?</span></h1>
            </motion.div>
        </div>
        <div>
            <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay:0.3 }}
                        viewport={{ once: true, amount: 0 }}
            >
                <h3>Nos Avantages</h3>
                <img src={logoo} alt=""/>
                <p>Température contrôlée et surveillée</p>
                <p>Sécurité 24h/24</p>
                <p>Réservation simple en ligne</p>
                <p>Flexibilité selon vos besoins</p>
                <p>Service professionnel et réactif</p>
            </motion.div>
            <motion.img
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay:0.6 }}
                        viewport={{ once: true, amount: 0 }}
            src={img3} alt=""/>
        </div>
       </div>
        <Upfooter/>
        <Footer/></>}
    </>
    
    );
}
export default Home;