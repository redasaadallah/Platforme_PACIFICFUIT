import "./styles/statistic.css"
import Headeradmin from "./composants/headeradmin";
import Baradmin from "./composants/baradmin";
import csv from "./img/csv.png"
import garage from "./img/garage.png"
import {useNavigate} from "react-router-dom"
import Ouinon from "./composants/ouinon";
import React,{useEffect,useState} from "react"
import outofstock from "./img/out-of-stock.png"
import readystock from "./img/ready-stock (1).png"
import { PieChart, Pie, Cell, Legend } from "recharts";
import ExportDialog from "./composants/exportDialog";
import refresh from "./img/refresh.png"
import api from "./api/axios";

import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from "recharts";
// ==============pour le graphe cercle==============
// =================================================
function Statistic(){
    const navigate=useNavigate()
    const [out,setOut]=useState(false)
    const [openDialog,setOpenDialog]=useState(false)

// ============================info pour la capaite des chambre=======================

// ===================================================================================
const [capchambres,setcapchambres]=useState({})
const getChambreStats = async () => {
  try {
    const response = await api.get(
      "http://localhost:8080/api/admin/statistiques/chambres"
    );

    return response.data;
  } catch (error) {
    console.log("Error fetching stats:", error);
    throw error;
  }
};
useEffect(() => {
  const fetchStats = async () => {
    const data = await getChambreStats();
    console.log(data);
    setcapchambres(data)
  };

  fetchStats();
}, []);
// ==============pour les chambres=====================
const data = [
  {  value: capchambres?.tauxDisponible },
  {  value: capchambres?.tauxOccupee },
];

const COLORS = ["#44C93B", "#EC8A00"];
// ====================pour le chart cercle=====================
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={13}   //  CONTROL FONT SIZE HERE
      fontWeight="bold"
      >
        {`${data[index].value.toFixed(2)} %`}
        
      </text>
    );
  };
// =================pour les statistique des demandes========================
//===========================================================================
 //  GET CURRENT DATE
  const today = new Date();
  const currentYear = today.getFullYear();
  
  const months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre"
];

  const currentMonth = months[today.getMonth()];

  const years = [ 2026,2027, 2028,2029, 2030];

  //  DEFAULT VALUE = CURRENT MONTH + YEAR
  const [selected, setSelected] = useState(
    `${currentMonth} ${currentYear}`
  );
 
  const [selectedYear,setSelectedYear]=useState(
    currentYear
  )

  const [open, setOpen] = useState(false);
    const [stats, setStats] = useState(null);
useEffect(() => {
    const fetchData=async()=>{
        try {
             const monthIndex = months.indexOf(currentMonth) + 1;
      const res = await api.get(`http://localhost:8080/api/admin/statistiques/${currentYear}/${monthIndex}`);
      console.log("demandes",res.data);
      setStats(res.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
    }
    fetchData()
  }, []);
 const getStatsByMonth = async (year, month) => {
    const monthIndex = months.indexOf(month) + 1;
  return await api.get(`http://localhost:8080/api/admin/statistiques/${year}/${monthIndex}`);
};

  //  HANDLE SELECTION
  const handleSelect = async(year, month) => {
    setSelected(`${month} ${year}`);
    try {
      const res = await getStatsByMonth(year, month);
      setStats(res.data);
      console.log("demandes bar orizentales",res.data)
    } catch (error) {
      console.error("Error loading stats:", error);
    }
    setOpen(false);
  };
//=============================================================================
// =================================pour les statistiques chartbar===============
const [dataBar, setDataBar] = useState([]);
 const [openBar, setOpenBar] = useState(false);
 const [openBarType, setOpenBarType] = useState(false);
  const types = [
    { label: "Total demandes", value: "total" },
    { label: "Demandes acceptées", value: "accepted" },
    { label: "Demandes refusées", value: "refused" }
  ];
   const [selectedType,setSelectedType]=useState(
    "total"
  )
  useEffect(() => {
    const fetchDataBar=async()=>{
    try {
      const res = await getStatsByType(currentYear, "total");
      setDataBar(res.data);
      console.log("databarrrrrrrrrrrrrrrrr",res.data)
    } catch (error) {
      console.error("Error loading stats:", error);
    }
    }
    fetchDataBar()
  }, []);

  const loadStats = async (year,type) => {
    setSelectedYear(year);
    try {
      const res = await getStatsByType(year, type);
      setDataBar(res.data);
      console.log("barrbarr",res.data)
      setOpenBar(false)
        setOpenBarType(false)
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };
const getStatsByType = (year, type) => {
  return api.get(`http://localhost:8080/api/admin/statistiques/bar/${year}/${type}`);
  
  
};
const getLabel = (value) => {
  const item = types.find(t => t.value === value);
  return item ? item.label : value;
};
// ==================pour le tableau des produits 
const [produits,setProduits]=useState([])
useEffect(() => {

    const fetchStock = async () => {
      try {
        const res = await api.get("http://localhost:8080/api/admin/statistiques/stock");

        setProduits(res.data);
        console.log("produits",res.data)
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStock();

  }, []);

    return(<>
    {openDialog && <ExportDialog onClose={()=>setOpenDialog(false)}/>}
    {out && <Ouinon type={1} sortir={()=>{localStorage.removeItem("admin");localStorage.removeItem("accessToken");localStorage.removeItem("refreshToken");localStorage.removeItem("type");navigate("/admin")}}  annuler={()=>setOut(false)}/>}
    <Baradmin page={4} closeWindow={()=>{setOut(true)}}/>
    <Headeradmin closeWindow={()=>{setOut(true)}}/>
    <div id="statistic1">
        <h1>Statistiques et rapports</h1>
        <button onClick={()=>{setOpenDialog(true)}}><img src={csv}/>Exporter en CSV</button>
        </div>
        <div id="statistic2">
            <div>
                <div>
                <div>
                    <div>
                        <p>Espace total</p>
                        <img src={garage}/>
                    </div>
                    <h1>{capchambres.capaciteTotale} tonnes</h1>
                    <div>
                        <h1>100%</h1>
                        <div></div>
                    </div>
                </div>
                <div>
                     <PieChart width={400} height={200}>
                          
                          <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            dataKey="value"
                            label={renderCustomizedLabel}
                            labelLine={false}
                            innerRadius={35} 
                          >
                            {data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                          </Pie>
                    
                          <Tooltip />
                          {/* <Legend  /> */}
                        </PieChart>
                    
                </div>
                </div>
                <div>
                <div>
                    <div>
                        <p>Espace disponible</p>
                        <img src={readystock}/>
                    </div>
                    <h1>{capchambres.capaciteDisponible?.toFixed(2)} tonnes</h1>
                    <div>
                        <h1>{capchambres?.tauxDisponible?.toFixed(2)} %</h1>
                        <div></div>
                    </div>
                </div>
                <div>
                    <div>
                        <p>Espace occupé</p>
                        <img src={outofstock}/>
                    </div>
                    <h1>{capchambres.capaciteOccupee?.toFixed(2)} tonnes</h1>
                    <div>
                        <h1>{capchambres?.tauxOccupee?.toFixed(2)} %</h1>
                        <div></div>
                    </div>
                </div>
                </div>
            </div>
            {/* statistic des demande progress bar */}
            <div>
            <div>
                <h1>Statistiques des demandes clients</h1>
                <div>
                <div>
                    <div>
                        <h3>Nombre total de demandes</h3>
                        <hr
                       
                        />
                    </div>
                    <h3>{stats?.totalDemandes} (100 %)</h3>
                </div>
                <div>
                    <div>
                        <h3>Nombre de demandes de réservation</h3>
                        <hr style={{
                            
                                    background: `
                                        linear-gradient(
                                        to right,
                                        green 0%,
                                        green ${stats?.pctReservationsAccepted}%,
                                        red ${stats?.pctReservationsAccepted}%,
                                        red ${stats?.pctReservationsAccepted + stats?.pctReservationsRefused}%,
                                        #E8E8E8 ${stats?.pctReservationsAccepted + stats?.pctReservationsRefused}%,
                                        #E8E8E8 100%
                                        )`,
                            height: "6px",
                            width: "100%",
                            borderRadius: "5px"
                        }}/>
                    </div>
                    <h3>{stats?.reservationsAccepted+stats?.reservationsRefused} ({(stats?.pctReservationsAccepted+stats?.pctReservationsRefused).toFixed(2)} %)</h3>
                </div>
                <div>
                    <div>
                        <h3>Nombre de demandes de prolongation</h3>
                        <hr
                        style={{
                             
                            background: `
                                linear-gradient(
                                to right,
                                green 0%,
                                green ${stats?.pctProlongationsAccepted}%,
                                red ${stats?.pctProlongationsAccepted}%,
                                red ${stats?.pctProlongationsAccepted + stats?.pctProlongationsRefused}%,
                                #E8E8E8 ${stats?.pctProlongationsAccepted + stats?.pctProlongationsRefused}%,
                                #E8E8E8 100%
                                )`,
                            height: "6px",
                            width: "100%",
                            borderRadius: "5px"
                        }}
                        />
                    </div>
                    <h3>{stats?.prolongationsAccepted+stats?.prolongationsRefused} ({(stats?.pctProlongationsAccepted+stats?.pctProlongationsRefused).toFixed(2)} %)</h3>
                </div>
                </div>
                {/* ------------------------- */}
                <div>
                    <table>
                        <tr>
                            <td>
                                <div></div><h3>Demandes acceptées</h3>
                            </td>
                            <td>R {stats?.reservationsAccepted} ({stats?.pctReservationsAccepted.toFixed(2)} %)</td>
                            <td>P {stats?.prolongationsAccepted} ({stats?.pctProlongationsAccepted.toFixed(2)} %)</td>
                        </tr>
                        <tr>
                            <td>
                                <div></div><h3>Demandes refusées</h3>
                            </td>
                            <td>R {stats?.reservationsRefused} ({stats?.pctReservationsRefused.toFixed(2)} %)</td>
                            <td>P {stats?.prolongationsRefused} ({stats?.pctProlongationsRefused.toFixed(2)} %)</td>
                        </tr>
                    </table>
                    <div>
                       <div style={{ position: "relative", width: "250px",zIndex:1000}}>

      {/*  CLICKABLE BOX */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "10px",
          border: "solid 2px #0A8D47",
          borderRadius: "8px",
          cursor: "pointer",
          background: "#fff",
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between"
        }}
      >
        {selected}
        <img style={{width:"20px",height:"20px"}} src={refresh}/>
      </div>
        
      {/*  DROPDOWN LIST */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "45px",
            left: 0,
            width: "100%",
            border: "1px solid #ddd",
            background: "white",
            borderRadius: "8px",
            maxHeight: "250px",
            overflowY: "auto",
            
            
            zIndex: 1000
          }}
        >

          {years.map(year =>
            months.map(month => (
              <div
                key={`${month}-${year}`}
                onClick={() => handleSelect(year, month)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",

                  //  GREEN HIGHLIGHT FOR SELECTED
                  backgroundColor:
                    selected === `${month} ${year}` ? "#d1f7d6" : "white",

                  color:
                    selected === `${month} ${year}` ? "#1a7f37" : "black",

                  fontWeight:
                    selected === `${month} ${year}` ? "bold" : "normal"
                }}
              >
                {month} {year}
              </div>
            ))
          )}

        </div>
      )}
    </div>
                        
                    </div>
                </div>
            </div>
            </div>
        </div>

        <div id="statistic3">
            <div>
                <div>
                    <h3>Évolution {getLabel(selectedType)} en {selectedYear}</h3>
                    <div>
                          <div style={{ position: "relative", width: "150px" }}>

      {/*  CLICKABLE BOX */}
      <div
        
        onClick={() => setOpenBar(!openBar)}
        style={{
          padding: "10px",
          border: "solid 2px #0A8D47",
          borderRadius: "8px",
          cursor: "pointer",
          background: "#fff",
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between"
        }}
      >
        {selectedYear}
        <img style={{width:"20px",height:"20px"}} src={refresh}/>
      </div>
        
      {/*  DROPDOWN LIST */}
      {openBar && (
        <div
          style={{
            position: "absolute",
            top: "45px",
            left: 0,
            width: "100%",
            border: "1px solid #ddd",
            background: "white",
            borderRadius: "8px",
            maxHeight: "250px",
            overflowY: "auto",
            
            zIndex: 1000
          }}
        >

          {years.map(year =>(
           
              <div
                key={year}
                onClick={() => {loadStats(year,selectedType)}}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",

                  //  GREEN HIGHLIGHT FOR SELECTED
                  backgroundColor:
                    selectedYear === year ? "#d1f7d6" : "white",

                  color:
                    selectedYear === year ? "#1a7f37" : "black",

                  fontWeight:
                    selectedYear === year ? "bold" : "normal"
                }}
              >
                {year}
              </div>
            )
          )}

        </div>
      )}
    </div>
    {/* ============================================= */}
     <div style={{ position: "relative", width: "190px" }}>

      {/*  CLICKABLE BOX */}
      <div
        onClick={() => setOpenBarType(!openBarType)}
        style={{
          padding: "10px",
          border: "solid 2px #0A8D47",
          borderRadius: "8px",
          cursor: "pointer",
          background: "#fff",
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between"
        }}
      >
        {getLabel(selectedType)}
        <img style={{width:"20px",height:"20px"}} src={refresh}/>
      </div>
        
      {/*  DROPDOWN LIST */}
      {openBarType && (
        <div
          style={{
            position: "absolute",
            top: "45px",
            left: 0,
            width: "100%",
            border: "1px solid #ddd",
            background: "white",
            borderRadius: "8px",
            maxHeight: "250px",
            overflowY: "auto",
            
            zIndex: 1000
          }}
        >

          {types.map(type =>(
           
              <div
                key={`${type.value}`}
                onClick={() => {setSelectedType(type.value);loadStats(selectedYear,type.value)}}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",

                  //  GREEN HIGHLIGHT FOR SELECTED
                  backgroundColor:
                    selectedType === type.value ? "#d1f7d6" : "white",

                  color:
                    selectedType === type.value ? "#1a7f37" : "black",

                  fontWeight:
                    selectedType === type.value ? "bold" : "normal"
                }}
              >
                {type.label}
              </div>
            )
          )}

        </div>
      )}
    </div>
    {/* ============================================================= */}
                    </div>
                </div>
                <div>
                  <div style={{ width: "95%", height: 320 }}>
                   <ResponsiveContainer>
                     <BarChart data={dataBar}>
                 
                       <CartesianGrid strokeDasharray="3 3" />
                 
                       <XAxis dataKey="month" />
                       
                 
                       <Tooltip />
                 
                       <Bar 
                         dataKey="value" 
                         fill="#3B82F6"
                         radius={[6, 6, 0, 0]}
                       >
                 
                         <LabelList 
                           dataKey="value"
                            position="insideTop"
                            fill="#fff"
                            fontSize={14}
                            fontWeight="bold"
                         />
                 
                       </Bar>
                 
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
                        
                    
                </div>
            </div>
            {/* ========================================= */}
            <div>
                <h3>Répartition des produits stockés dans le frigo</h3>
               <div className="table-containerp">
                {/* HEADER FIXED */}
                <div className="table-headerp">
                 <div>Rang</div>
                <div>Produit</div>
                <div>Quantité en tonne</div>
                <div>Pourcentage</div>
                </div>
                {/* BODY SCROLL */}
                <div className="table-bodyp">
                    
                    {produits.map((product,index) => (
                            <div className="table-rowp" key={index}>

                                <div>{product.rang}</div>

                                <div>
                                {product.produit}
                                </div>

                                <div>
                                {product.quantite}
                                </div>

                                <div>
                                {product.pourcentage.toFixed(2)} %
                                </div>

                            </div>
                            ))}
                    </div>  
                    </div>
            </div>
        </div>
    

    </>);
}
export default Statistic;