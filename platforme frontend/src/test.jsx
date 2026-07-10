import "./test.css"
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from "recharts";

const data = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 98 },
  { month: "Mar", value: 150 },
  { month: "Apr", value: 180 },
  { month: "May", value: 210 },
  { month: "Jun", value: 170 },
  { month: "Jul", value: 230 },
  { month: "Aug", value: 250 },
  { month: "Sep", value: 200 },
  { month: "Oct", value: 190 },
  { month: "Nov", value: 220 },
  { month: "Dec", value: 260 },
];

export default function MonthlyBarChart() {
  return (
    
//     <div style={{ width: "100%", height: 400 }}>
//   <ResponsiveContainer>
//     <BarChart data={data}>

//       <CartesianGrid strokeDasharray="3 3" />

//       <XAxis dataKey="month" />
      

//       <Tooltip />

//       <Bar 
//         dataKey="value" 
//         fill="#3B82F6"
//         radius={[6, 6, 0, 0]}
//       >

//         <LabelList 
//           dataKey="value"
//           position="top"
//         />

//       </Bar>

//     </BarChart>
//   </ResponsiveContainer>
// </div>
<div className="table-container">

  <table>

    <thead>
      <tr>
        <th>Client</th>
        <th>Produit</th>
        <th>Quantité</th>
        <th>Status</th>
      </tr>
    </thead>


    <tbody>
      {data.map((item,index)=>(
        <tr key={index}>
          <td>{item.client}</td>
          <td>{item.produit}</td>
          <td>{item.quantite}</td>
          <td>{item.status}</td>
        </tr>
      ))}
    </tbody>

  </table>

</div>
  );
}
// import "./styles/exportcsv.css"
// import React, { useState } from "react";

// export default function ExportDialog({ open, onClose }) {

//   const [type, setType] = useState("monthly");
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [month, setMonth] = useState(new Date().getMonth() + 1);

//   const months = [
//     "Janvier","Février","Mars","Avril","Mai","Juin",
//     "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
//   ];

//   const years = [2024, 2025, 2026];

//   if (!open) return null;

//   return (
//     <div className="overlay">
//       <div className="modal">

//         {/* HEADER */}
//         <div className="modal-header">
//           <h2>Exporter les données</h2>
//           <button onClick={onClose} className="close">✕</button>
//         </div>

//         <p className="subtitle">
//           Sélectionnez le type de données à exporter et la période correspondante.
//         </p>

//         {/* OPTION 1 */}
//         <div
//           className={`card ${type === "monthly" ? "active" : ""}`}
//           onClick={() => setType("monthly")}
//         >
//           <input type="radio" checked={type === "monthly"} readOnly />

//           <div className="card-content">
//             <h3>Exporter statistiques mensuelles</h3>
//             <p>Résumé mensuel des demandes, clients, stock et chiffre d’affaires.</p>

//             <label>Année</label>
//             <select value={year} onChange={(e) => setYear(e.target.value)}>
//               {years.map(y => (
//                 <option key={y}>{y}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* OPTION 2 */}
//         <div
//           className={`card ${type === "details" ? "active" : ""}`}
//           onClick={() => setType("details")}
//         >
//           <input type="radio" checked={type === "details"} readOnly />

//           <div className="card-content">
//             <h3>Exporter réservations détaillées</h3>
//             <p>Liste détaillée des réservations avec informations clients.</p>

//             <div className="row">
//               <div>
//                 <label>Année</label>
//                 <select value={year} onChange={(e) => setYear(e.target.value)}>
//                   {years.map(y => <option key={y}>{y}</option>)}
//                 </select>
//               </div>

//               <div>
//                 <label>Mois</label>
//                 <select value={month} onChange={(e) => setMonth(e.target.value)}>
//                   {months.map((m, i) => (
//                     <option key={m} value={i + 1}>{m}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* FOOTER */}
//         <div className="footer">
//           <button className="cancel" onClick={onClose}>Annuler</button>
//           <button className="export">Exporter en CSV</button>
//         </div>

//       </div>
//     </div>
//   );
// }
// import React, { useState } from "react";

// export default function MonthYearDropdown() {

//   // 🔥 GET CURRENT DATE
//   const today = new Date();
//   const currentYear = today.getFullYear();

//   const months = [
//     "January", "February", "March", "April",
//     "May", "June", "July", "August",
//     "September", "October", "November", "December"
//   ];

//   const currentMonth = months[today.getMonth()];

//   const years = [2024, 2025, 2026];

//   // 🔥 DEFAULT VALUE = CURRENT MONTH + YEAR
//   const [selected, setSelected] = useState(
//     `${currentMonth} ${currentYear}`
//   );

//   const [open, setOpen] = useState(false);

//   // 🔥 HANDLE SELECTION
//   const handleSelect = (year, month) => {
//     setSelected(`${month} ${year}`);
//     setOpen(false);
//   };

//   return (
//     <div style={{ position: "relative", width: "250px" }}>

//       {/* 🔥 CLICKABLE BOX */}
//       <div
//         onClick={() => setOpen(!open)}
//         style={{
//           padding: "10px",
//           border: "1px solid #ccc",
//           borderRadius: "8px",
//           cursor: "pointer",
//           background: "#fff"
//         }}
//       >
//         {selected}
//       </div>

//       {/* 🔥 DROPDOWN LIST */}
//       {open && (
//         <div
//           style={{
//             position: "absolute",
//             top: "45px",
//             left: 0,
//             width: "100%",
//             border: "1px solid #ddd",
//             background: "white",
//             borderRadius: "8px",
//             maxHeight: "250px",
//             overflowY: "auto",
//             zIndex: 1000
//           }}
//         >

//           {years.map(year =>
//             months.map(month => (
//               <div
//                 key={`${month}-${year}`}
//                 onClick={() => handleSelect(year, month)}
//                 style={{
//                   padding: "8px",
//                   cursor: "pointer",
//                   borderBottom: "1px solid #eee",

//                   // 🔥 GREEN HIGHLIGHT FOR SELECTED
//                   backgroundColor:
//                     selected === `${month} ${year}` ? "#d1f7d6" : "white",

//                   color:
//                     selected === `${month} ${year}` ? "#1a7f37" : "black",

//                   fontWeight:
//                     selected === `${month} ${year}` ? "bold" : "normal"
//                 }}
//               >
//                 {month} {year}
//               </div>
//             ))
//           )}

//         </div>
//       )}
//     </div>
//   );
// }


// // import React from "react";
// // import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// // const data = [
// //   { name: "Accepted", value: 40 },
// //   { name: "Pending", value: 30 },
// // ];

// // const COLORS = ["#4EABFD", "#89E75A"];

// // export default function CircleChart() {
// //    // 🔥 custom label function
// //   const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {

// //     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
// //     const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
// //     const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

// //     return (
// //       <text
// //         x={x}
// //         y={y}
// //         fill="white"
// //         textAnchor="middle"
// //         dominantBaseline="central"
// //         fontSize={16}   // 🔥 CONTROL FONT SIZE HERE
// //       fontWeight="bold"
// //       >
// //         {`${data[index].value}`}
// //       </text>
// //     );
// //   };
// //   return (
// //     <PieChart width={400} height={400}>
      
// //       <Pie
// //         data={data}
// //         cx="50%"
// //         cy="50%"
// //         outerRadius={120}
// //         dataKey="value"
// //         label={renderCustomizedLabel}
// //         labelLine={false}
// //         innerRadius={50} 
// //       >
// //         {data.map((entry, index) => (
// //           <Cell key={`cell-${index}`} fill={COLORS[index]} />
// //         ))}
// //       </Pie>

// //       <Tooltip />
// //       <Legend />
// //     </PieChart>
// //   );
// // }

// // import "./test.css"
// // import { useState } from "react";
// // import arowdown from "./img/down-arrow (1).png"
// // import { color } from "framer-motion";
// // function Test(){
// // const [filtre, setFiltre] = useState("all");
// // const [open, setOpen] = useState(false);

// // const options = [
// //   { value: "all", label: "Tous" ,color:"white"},
// //   { value: "a_venir", label: "Stockage à venir" ,color:"#4EABFD"},
// //   { value: "en_cours", label: "Stockage en cours" ,color:"#89E75A"},
// //   { value: "termine", label: "Stockage terminé" ,color:"#FB4124"},
// // ];

// // const optionSelectionnee = options.find(option => option.value === filtre);
// // // const reservationsFiltrees = reservations.filter((reservation) => {
// // //   if (filtre === "all") return true;
// // //   return reservation.statutStockage === filtre;
// // // });
// //     return(<>
// //     <div className="custom-select">
// //   <div
// //     className="select-box"
// //     onClick={() => setOpen(!open)}
// //   >
// //     <span>{optionSelectionnee.label}</span>
// //     <span><img width="30px"  src={arowdown}/></span>
// //   </div>

// //   {open && (
// //     <div className="select-options">
        
// //       {options.map((option) => (
// //         <div
// //           key={option.value}
// //           className={`select-option ${filtre === option.value ? "active" : ""}`}
// //           onClick={() => {
// //             setFiltre(option.value);
// //             setOpen(false);
// //           }}
// //         >
// //             <div style={{backgroundColor:option.color}}></div>
// //           {option.label}
// //         </div>
// //       ))}
// //     </div>
// //   )}
// // </div>

// //     </>)
// // }
// // export default Test;