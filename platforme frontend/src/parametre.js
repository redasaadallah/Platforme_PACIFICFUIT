import "./styles/parametre.css"
import Baradmin from "./composants/baradmin";
import Headeradmin from "./composants/headeradmin";
import react,{useState,useEffect} from "react"
import axios from "axios"
import BoiteP from "./composants/boiteP";
import param1 from "./img/param1.png"
import param2 from "./img/param2.png"
import param3 from "./img/param3.png"
import param4 from "./img/param4.png"
import param5 from "./img/param5.png"
import pencil from "./img/pencil.png"
import cooldown from "./img/cooldown.png"
import product from "./img/product.png"
import life from "./img/product-life.png"
import Ouinon from "./composants/ouinon";
import {useNavigate} from "react-router-dom"
import api from "./api/axios";

export default function Parametre(){
    const navigate=useNavigate()
    const [out,setOut]=useState(false)
    const [change,setChange]=useState(false)
    const [genre,setGenre]=useState("")
     const [parametres, setParametres] = useState({});
  const [chambres, setChambres] = useState([]);
  const [admin,setadmin]=useState(JSON.parse(localStorage.getItem("admin")))
useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer tous les paramètres
        const paramResponse = await axios.get('http://localhost:8080/api/parametres');
        setParametres(paramResponse.data[0]);
        console.log(paramResponse.data)
        // Récupérer toutes les chambres
        const chambreResponse = await api.get('http://localhost:8080/api/chambres');
        setChambres(chambreResponse.data);
        console.log(chambreResponse.data)
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
    
  }, []);
    return(<>
     
    {change && <BoiteP onDelete={setChambres} admin={admin} onParamChange={setParametres} param={parametres} data={chambres} type={genre} icon={genre} closeWindow={()=>{setGenre("");setChange(false)}}/>}
    {out && <Ouinon type={1} sortir={()=>{localStorage.removeItem("admin");localStorage.removeItem("accessToken");localStorage.removeItem("refreshToken");localStorage.removeItem("type");navigate("/admin")}}  annuler={()=>setOut(false)}/>}
    
    <Baradmin page={5} closeWindow={()=>{setOut(true)}}/>
    <Headeradmin closeWindow={()=>{setOut(true)}}/>
    <h1 id="tparam">Paramètres</h1>
    <div id="param1">
        <div>
            <div>
                <div>
                    <p>L’espace frigorifique en tonne</p>
                    <img src={param1}/>
                </div>
                <div>
                    <p>
                    {chambres
                        .map(c => c.capacite)
                        .reduce((acc, val) => acc + val, 0)}
                    </p>
                    <button onClick={()=>{setChange(true);setGenre("espace")}}><img src={pencil}/></button>
                </div>
            </div>
            <div>
                <div>
                    <p> La durée d'une réservation</p>
                    <img src={param2}/>
                </div>
                <div>
            {parametres && (
                <p>
                    Min : {parametres.dureeMinReservation === -1
                    ? "Illimité"
                    : parametres.dureeMinReservation+" jours"},
                    Max : {parametres.dureeMaxReservation === -1
                    ? "Illimité"
                    : parametres.dureeMaxReservation+" jours"}
                </p>
                )}                
        <button onClick={()=>{setChange(true);setGenre("duree");}}><img src={pencil}/></button>
                </div>
            </div>
        </div>
        {/* ================================ */}
        <div>
            <div>
                 <div>
                    <p>Tarif de réservation par tonne / jour</p>
                    <img src={param3}/>
                </div>
                <div>
                    {parametres && 
                    <p>Réservation : {parametres.prixReservation} DH, Prolongation : {parametres.prixPrelangemant} DH</p>}
                    <button onClick={()=>{setChange(true);setGenre("price")}}><img src={pencil}/></button>
                </div>
            </div>
            <div>
                 <div>
                    <p>La durée d’une prolongation</p>
                    <img src={life}/>
                </div>
                <div>
                    {parametres && (
            <p>
                Min : {parametres.dureeMinProlongement === -1
                ? "Illimité"
                : parametres.dureeMinProlongement+" jours"},
                Max : {parametres.dureeMaxProlongement === -1
                ? "Illimité"
                : parametres.dureeMaxProlongement+" jours"}
            </p>
            )}      
                    <button onClick={()=>{setChange(true);setGenre("dureep")}}><img src={pencil}/></button>
                </div>
            </div>
        </div>
    
    {/* ====================================== */}
    <div>
            <div>
                 <div>
                    <p>Délai avant stockage</p>
                    <img src={cooldown}/>
                </div>
                <div>
                    {parametres && (
                <p>
                    Réservation : 
                    {parametres.delaiMaxEntreDemandeEtDebut === -1
                    ? "Pas de délai"
                    : parametres.delaiMaxEntreDemandeEtDebut+" jours"}{" "}
                    , prolongation : 
                    {parametres.delaiProlongement === -1
                    ? "Pas de délai"
                    :parametres.delaiProlongement === 0?" Après le début":" "+parametres.delaiProlongement+" jours avant la fin"}
                    
                </p>
                )}  
                    <button onClick={()=>{setChange(true);setGenre("delai")}}><img src={pencil}/></button>
                </div>
            </div>
            <div>
                 <div>
                    <p>Quantité à stocker en tonne</p>
                    <img src={product}/>
                </div>
                <div>
                     {parametres && (
            <p>
                Min : {parametres.quantiteMinProduit === -1
                ? "Illimité"
                : parametres.quantiteMinProduit+" tonnes"},
                Max : {parametres.quantiteMaxProduit === -1
                ? "Illimité"
                : parametres.quantiteMaxProduit+" tonnes"}
            </p>
            )}      
                    <button onClick={()=>{setChange(true);setGenre("quantite")}}><img src={pencil}/></button>
                </div>
            </div>
        </div>
        {/* ================================ */}
        <div >
            
            <div style={{backgroundColor:"rgb(221, 250, 221)"}}>
                 <div>
                    <p>Le mot de passe</p>
                    <img src={param4}/>
                </div>
                <div>
                    <p>********</p>
                    <button onClick={()=>{setChange(true);setGenre("passe")}}><img src={pencil}/></button>
                </div>
            </div>
        </div>
    </div>
       
    
    </>);
}