import React, { useState } from "react";
import {
    Package,
    PackageX,
    CheckSquare,
    Info
} from "lucide-react";
import api from "../api/axios";
import { toast } from "react-toastify";


function StockStatusCard({
    onClose,
    reservation,
    onUpdate
}) {

const [status,setStatus]=useState(reservation.statutProduit)
const handleApply = async()=>{

if(reservation.type==="reservation"){
    try {

        
        const response =
            await api.put(
        `http://localhost:8080/api/produits/statutstockage/${reservation.codeProduit}`,
        {
            statut: status
        }
    
    );



        if(response.data.success){

            toast.success(
                response.data.message
            );
            setStatus(response.statut)
            // send new status to parent page
            onUpdate(
                response.data.statut
            );
            onClose()
        }


    } catch(error){


        toast.error(
            error.response?.data?.message
            ||
            "Erreur changement statut"
        );


    }
    }else{
         const response =
            await api.put(
        `http://localhost:8080/api/prolongements/statutstockage/${reservation.idProlongement}`,
        {
            statut: status
        }
    
    );
    if(response.data.success){

            toast.success(
                response.data.message
            );
            setStatus(response.statut)
            // send new status to parent page
            onUpdate(
                response.data.statut
            );
            onClose()
        }

    }
};
    


    return (<>
        <div id="black" style={{zIndex:"300"}}></div>
        <div
            style={{
                width:"430px",
                background:"#ffffff",
                borderRadius:"10px",
                padding:"35px",
                boxShadow:
                "0 15px 40px rgba(0,0,0,0.12)",
                
                fontFamily:"Arial, sans-serif",
                position:"absolute",
                zIndex:"301",
                left:"50%",
                top:"50%",
                transform:"translate(-50%,-50%)",
                borderBlock: "solid 5px #4caf50"

            }}
        >


            {/* ICON */}

            <div
                style={{
                    width:"50px",
                    height:"50px",
                    borderRadius:"50%",
                    background:"#E8F7EF",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    margin:"0 auto 20px"
                }}
            >

                <Package
                    size={30}
                    color="#0A8D47"
                />

            </div>




            {/* TITLE */}

            <h2
                style={{
                    textAlign:"center",
                    color:"#064E3B",
                    fontSize: "clamp(0.7rem,1.5vw,3rem)",
                    fontWeight: "lighter",
                    fontFamily: "'Playfair Display', serif",
                    marginBottom:"25px"
                }}
            >
                Modifier statut stockage
            </h2>




            <div
                style={{
                    width:"80px",
                    height:"4px",
                    background:"#0A8D47",
                    margin:"0 auto 35px",
                    borderRadius:"5px"
                }}
            />




            {/* CURRENT STATUS */}

            <div
                style={{
                    background:"#F7FAF8",
                    border:"1px solid #E2E8E5",
                    borderRadius:"12px",
                    padding:"20px",
                    textAlign:"center",
                    marginBottom:"35px"
                }}
            >

                <div
                    style={{
                        color:"#64748B",
                        fontSize: "clamp(0.7rem,1.5vw,3rem)",
                        fontWeight: "lighter",
                        fontFamily: "'Playfair Display', serif",
                        marginBottom:"8px"
                    }}
                >
                    Statut actuel
                </div>


                <div
                    style={{
                        color:"#0A8D47",
                        fontSize:"24px",
                        fontWeight:"700",
                        display:"flex",
                        justifyContent:"center",
                        alignItems:"center",
                        gap:"10px"
                    }}
                >

                    <span
                        style={{
                            width:"14px",
                            height:"14px",
                            borderRadius:"50%",
                            background:"#0A8D47"
                        }}
                    />

                    {reservation.statutProduit==="stocked"?"Stocké":"Non stocké"}

                </div>

            </div>





            {/* LABEL */}

            <h3
                style={{
                    color:"#1E293B",
                    fontSize: "clamp(0.7rem,1.5vw,3rem)",
                    
                    fontFamily: "'Playfair Display', serif",
                    marginBottom:"18px"
                }}
            >
                Sélectionner le nouveau statut
            </h3>




            {/* STOCKE */}

            <label
                style={{
                    display:"flex",
                    alignItems:"center",
                    gap:"20px",
                    padding:"20px",
                    borderRadius:"15px",
                    border:
                    status==="stocked"
                    ?
                    "2px solid #0A8D47"
                    :
                    "1px solid #DDE5E1",
                    background:
                    status==="stocked"
                    ?
                    "#F4FFF8"
                    :
                    "#fff",
                    cursor:"pointer",
                    marginBottom:"18px"
                }}
            >

                <input
                    type="radio"
                    checked={
                       status==="stocked"
                    }
                    onChange={()=>
                        setStatus("stocked")
                    }
                    style={{
                        width:"22px",
                        height:"22px",
                        accentColor:"#0A8D47"
                    }}
                />



                <div
                    style={{
                        width:"55px",
                        height:"55px",
                        borderRadius:"50%",
                        background:"#E8F7EF",
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center"
                    }}
                >

                    <Package
                        color="#0A8D47"
                        size={28}
                    />

                </div>



                <div>

                    <div
                        style={{
                            fontWeight:"700",
                            fontSize: "clamp(0.7rem,1.5vw,3rem)",
                            fontFamily: "'Playfair Display', serif",
                            color:"#1E293B"
                        }}
                    >
                        Produit stocké
                    </div>


                    <div
                        style={{
                            color:"#64748B",
                            marginTop:"5px",
                            fontSize: "clamp(0.7rem,0.8vw,3rem)",
                            fontWeight: "lighter",
                            fontFamily: "'Playfair Display', serif",
                        }}
                    >
                        Le produit est présent dans la chambre.
                    </div>

                </div>


            </label>






            {/* NON STOCKE */}


            <label
                style={{
                    display:"flex",
                    alignItems:"center",
                    gap:"20px",
                    padding:"20px",
                    borderRadius:"15px",
                    border:
                    status==="accepted"
                    ?
                    "2px solid #DC2626"
                    :
                    "1px solid #DDE5E1",
                    background:
                    status==="accepted"
                    ?
                    "#ffe4e4"
                    :
                    "#fff",
                    cursor:"pointer",
                    marginBottom:"30px"
                }}
            >

                <input
                    type="radio"
                    checked={
                        status==="accepted"
                    }
                    onChange={()=>
                        setStatus("accepted")
                    }
                    style={{
                        width:"22px",
                        height:"22px",
                        accentColor:"#DC2626"
                    }}
                />


                <div
                    style={{
                        width:"55px",
                        height:"55px",
                        borderRadius:"50%",
                        background:"#FEECEC",
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center"
                    }}
                >

                    <PackageX
                        color="#DC2626"
                        size={28}
                    />

                </div>



                <div>

                    <div
                        style={{
                            fontWeight:"700",
                            fontSize: "clamp(0.7rem,1.5vw,3rem)",
                            fontFamily: "'Playfair Display', serif",
                        }}
                    >
                        Produit non stocké
                    </div>


                    <div
                        style={{
                            color:"#64748B",
                            marginTop:"5px",
                            fontSize: "clamp(0.7rem,0.8vw,3rem)",
                            fontWeight: "lighter",
                            fontFamily: "'Playfair Display', serif",
                        }}
                    >
                        Le produit n'est pas présent dans la chambre.
                    </div>


                </div>


            </label>






            {/* BUTTON */}
            <div
            style={{
                width:"100%",
                display:"flex",
                justifyContent:"flex-end",
                gap:"5px"
            }}
            >
            <button 
            style={{
                    
                    padding:"10px",
                    borderRadius:"5px",
                    border:"solid 2px #13B35B",
                    background:"none",
                    
                    color:"#13B35B",
                    fontSize: "clamp(0.7rem,1vw,3rem)",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight:"700",
                    cursor:"pointer",
                    
                }}
            onClick={onClose}>Annuler</button>
            <button
                onClick={()=>
                    handleApply()
                }
                style={{
                    
                    padding:"10px",
                    borderRadius:"5px",
                    border:"none",
                    background:
                    "linear-gradient(135deg,#0A8D47,#13B35B)",
                    color:"#fff",
                    fontSize: "clamp(0.7rem,1vw,3rem)",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight:"700",
                    cursor:"pointer",
                    
                }}
            >


                Appliquer

            </button>
            </div>
        </div>
</>
    );

}


export default StockStatusCard;