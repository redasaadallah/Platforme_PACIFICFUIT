import Header from "./composants/header";
import Main from "./composants/main";
import Upfooter from "./composants/upfooter";
import Footer from "./composants/footer";
import "./styles/apropos.css"
import entreprise from "./img/entreprise.jpg"
import vision from "./img/vision.jpg"
import mission from "./img/mission.png"
import logoo from "./img/logoo.png"
import plus from "./img/plus.png"
import minus from "./img/minus.png"
import polices from "./img/polices.png"
import { useState,useEffect } from "react";
import shield from "./img/shield.png"
import support from "./img/support.png"
import control from "./img/controle.png"
import img6 from "./img/img6.jpg"
import Loader from "./composants/loader";
function Apropos(){
    const [show,setshow]=useState(0);
    const [visible,setvisible]=useState(0)
    useEffect(()=>{
                  setTimeout(()=>{
                      setshow(1);
                  },2000);
              },[]);
    return(<>
    {show===0?<Loader/>:<>
    <Header at={1} atphone={1}/>
    <Main back={img6}/>
    <div className="apropos1">
        <img src={entreprise}/>
        <div>
            <div>
                <hr/>
                <h1>Notre <span className="span">entreprise</span></h1>
            </div>
            <p>PACIFIC FRUIT est spécialisée dans le stockage frigorifique professionnel</p>
            <p>Nous mettons à disposition de nos clients des espaces sécurisés et adaptés pour garantir la conservation optimale de leurs produits.</p>
        </div>
    </div>
    <div id="apropos1" className="apropos1">
        <img src={mission}/>
        <div>
            <div>
                <hr/>
                <h1>Notre <span className="span">mission</span></h1>
            </div>
            <p>Offrir une solution moderne, fiable et accessible pour permettre aux entreprises de gérer efficacement leurs besoins en stockage frigorifique.</p>
        </div>
    </div>
    <div className="apropos1">
        <img src={vision}/>
        <div>
            <div>
                <hr/>
                <h1>Notre <span className="span">vision</span></h1>
            </div>
            <p>Devenir une référence dans le domaine du stockage frigorifique grâce à l’innovation digitale et à la qualité de nos services.</p>
        </div>
    </div>
    {/* ======================================================= */}
    <div id="apropos2">
        <div>
            <hr/>
            <h1><span className="span">Nos</span> engagements</h1>
        </div>
        <div>
            <div className="title"><div><img src={polices}/><p>Respect strict des normes de conservation</p></div><img onClick={()=>{visible===1?setvisible(0):setvisible(1)}} src={visible===1?minus:plus}/></div>
            <div style={{display:visible===1?"flex":"none"}} className="detail"><p>Nous appliquons rigoureusement les normes et réglementations en vigueur dans le domaine du stockage frigorifique afin de garantir la qualité, l’hygiène et la sécurité de vos produits à chaque étape.</p></div>
            
            <div className="title"><div><img src={control}/><p>Température contrôlée et surveillée en continu</p></div><img onClick={()=>{visible===2?setvisible(0):setvisible(2)}} src={visible===2?minus:plus}/></div>
            <div style={{display:visible===2?"flex":"none"}} className="detail"><p>Nos installations sont équipées de systèmes modernes de contrôle et de surveillance permettant de maintenir une température stable et adaptée à chaque type de produit, 24h/24 et 7j/7.</p></div>
            
            <div className="title"><div><img src={shield}/><p>Sécurité des installations 24h/24</p></div><img onClick={()=>{visible===3?setvisible(0):setvisible(3)}} src={visible===3?minus:plus}/></div>
            <div style={{display:visible===3?"flex":"none"}} className="detail"><p>Nos espaces sont sécurisés grâce à des dispositifs de surveillance et de contrôle d’accès permanents, assurant la protection optimale de vos marchandises contre tout risque.</p></div>
            
            <div className="title"><div><img src={support}/><p>Service client réactif et professionnel</p></div><img onClick={()=>{visible===4?setvisible(0):setvisible(4)}} src={visible===4?minus:plus}/></div>
            <div style={{display:visible===4?"flex":"none"}} className="detail"><p>Notre équipe est disponible pour répondre à vos demandes et vous accompagner à chaque étape, avec professionnalisme, rapidité et transparence.</p></div>
        
        </div>
    </div>
    <Upfooter/>
    <Footer/>
    </>}
    </>);
}
export default Apropos;