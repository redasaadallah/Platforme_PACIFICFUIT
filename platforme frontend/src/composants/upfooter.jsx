import img4 from "../img/img4.png"
import img5 from "../img/img5.jpg"
import "../styles/upfooter.css"
import {useNavigate} from "react-router-dom"
import { motion } from "framer-motion";

function Upfooter(){
        const navigate=useNavigate();

    return(<>
    <div id="home5">
            
            <motion.h3
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay:0 }}
                        viewport={{ once: true, amount: 0 }}
            >Réservez votre place dès maintenant et bénéficiez d’un service fiable et efficace.</motion.h3>
            
            <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay:0.3 }}
                        viewport={{ once: true, amount: 0 }}
            ><img src={img5} alt=""/><button onClick={()=>{navigate("/demander")}} className="buttonvide">Réserver votre place</button></motion.div>
            <motion.h3 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay:0.6 }}
                        viewport={{ once: true, amount: 0 }}
            >Notre équipe est à votre disposition pour toute information complémentaire.</motion.h3>
            <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay:0.9 }}
                        viewport={{ once: true, amount: 0 }}
            ><img src={img4} alt=""/><button onClick={()=>{navigate("/contact")}} className="buttonvide">Nous contacter</button></motion.div>
        </div>
        
    </>);
}
export default Upfooter;