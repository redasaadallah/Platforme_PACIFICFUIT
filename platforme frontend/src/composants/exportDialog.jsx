import React, { useState } from "react";
import api from "../api/axios";

export default function ExportDialog({onClose}) {

  const [open, setOpen] = useState(false);
  const [type, setType] = useState("monthly");

  const years = [2024, 2025, 2026];

  const months = [
    "Janvier", "Février", "Mars", "Avril",
    "Mai", "Juin", "Juillet", "Août",
    "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [yearD, setYearD] = useState(today.getFullYear());
  const [month, setMonth] = useState(months[today.getMonth()]);
// ======================pour exporter le fichier csv==============
// ================================================================
const exportCSV = async (year) => {

   try {
      let url = "http://localhost:8080/api/admin/statistiques/export/monthly";
        const res = await api.get(url, {
        params: {
          year
        },
        responseType: "blob"
      });
    
      const fileUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", "Statistiques Annuelles "+year+".xlsx");
      document.body.appendChild(link);
      link.click();

    } catch (err) {
      console.error("Export error:", err);
    }
};
// ============================
const exportCSVD = async (year, month) => {
const monthIndex = months.indexOf(month) + 1;

   try {
      
     
        let url = "http://localhost:8080/api/admin/statistiques/export/details";
        const res = await api.get(url, {
        params: {
          year,
          monthIndex
        },
        responseType: "blob"
      });
      

      const fileUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", "Détails des Réservations "+month+","+yearD+".xlsx");
      document.body.appendChild(link);
      link.click();

    } catch (err) {
      console.error("Export error:", err);
    }
};
  return (
    
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,

          }}
        >

          {/*  BOX */}
          <div
            style={{
              width: "min(80%,600px)",
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              position:"fixed",
              top:"50%",
              left:"50%",
              transform:"translateX(-50%)",
              animation: "apear 1s 1 forwards",

            }}
          >

            {/* TITLE */}
            <h2>Exporter les données</h2>
            <p>Sélectionnez la période et le type de données à exporter.</p>

            
            {/* TYPE EXPORT */}
            <h4 style={{ marginTop: "20px" }}>Choisissez le type :</h4>

            {/* CARD 1 */}
            <div
              onClick={() => setType("monthly")}
              style={{
                border: type === "monthly" ? "2px solid green" : "1px solid #ddd",
                backgroundColor: type === "monthly" ? "#ddf5dd" : "#ffffff",

                padding: "10px",
                borderRadius: "8px",
                cursor: "pointer",
                marginBottom: "10px"
              }}
            >
               Exporter statistiques mensuelles
              <p style={{ fontSize: "12px", color: "#666" }}>
                Résumé des demandes, stock et chiffre d’affaires
              </p>
              {/* YEAR + MONTH */}
            <div style={{ display: "flex", gap: "20px" }}>

              {/* YEAR */}
              <div style={{ width:"50%"}}>
                <label>Année</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "5px"
                  }}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>


            </div>

            </div>

            {/* CARD 2 */}
            <div
              onClick={() => setType("details")}
              style={{
                border: type === "details" ? "2px solid green" : "1px solid #ddd",
                backgroundColor: type === "details" ? "#ddf5dd" : "#ffffff",
                padding: "10px",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
               Exporter réservations détaillées
              <p style={{ fontSize: "12px", color: "#666" }}>
                Liste complète des demandes avec clients
              </p>
              {/* YEAR */}
            <div style={{ display: "flex", gap: "20px" }}>

              {/* YEAR */}
              <div style={{ flex: 1 }}>
                <label>Année</label>
                <select
                  value={yearD}
                  onChange={(e) => setYearD(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "5px"
                  }}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* MONTH */}
              <div style={{ flex: 1 }}>
                <label>Mois</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "5px"
                  }}
                >
                  {months.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

            </div>

            </div>

            {/* BUTTONS */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>

              <button
                onClick={onClose}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  background: "white",
                  borderRadius: "6px"
                }}
              >
                Annuler
              </button>

              <button
                onClick={() => {
                  type==="monthly"?exportCSV(year):exportCSVD(yearD,month)
                  onClose()
                }}
                style={{
                  padding: "8px 12px",
                  background: "#1a7f37",
                  color: "white",
                  border: "none",
                  borderRadius: "6px"
                }}
              >
                Exporter
              </button>

            </div>

          </div>
        </div>
    
  );
}