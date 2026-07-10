import phone from "../img/phone.png"
import location from "../img/location.png"
import av from "../img/availability.png"
import arroba from "../img/arroba.png"
import logo from "../img/logo.png"
import "../styles/footer.css"
function Footer(){
    return(<>
    <div class="bottom">
        <div class="bottom1">
            <div>
                <img width="20px" src={phone}/><h1 class="info">Appelez-nous 24h/24 et 7j/7<br/><u>
+208-555-0112</u></h1>
            </div>
            <div>
                <img width="20" src={arroba}/><h1 class="info">Demander un devis<br/>
<u>example@gmail.com</u></h1>
            </div>
            <div>
                <img width="20" src={av}/><h1 class="info">Heures d’ouverture<br/>
Lundi - Vendredi : 9h00 - 18h00</h1>
            </div>
            <div>
                <img width="20" src={location}/><h1 class="info">Adresse<br/>
Faculté des Sciences et <br/>Techniques de Fès</h1>
            </div>
        </div>
        <div class="bottom2">
            <img  id="logobottom" src={logo}/>
            <h1 class="rights">© Tous droits réservés 2026 par PACIFIC FRUITS.</h1>
        </div>
    </div>
    </>);
}
export default Footer;