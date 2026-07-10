import img4 from "../img/img4.png"
import img5 from "../img/img5.jpg"
import "../styles/upfooter.css"
function Upfooter(){
    return(<>
    <div id="home5">
            <h3>Réservez votre place dès maintenant et bénéficiez d’un service fiable et efficace.</h3>
            <div><img src={img4} alt=""/><a href="">Réserver votre place</a></div>
            <h3>Notre équipe est à votre disposition pour toute information complémentaire.</h3>
            <div><img src={img5} alt=""/><a href="">Nous contacter</a></div>
        </div>
    </>);
}
export default Upfooter;