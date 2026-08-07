import React, { useState } from "react";
import {
    AlertTriangle,
    UserX,
    CalendarCheck
} from "lucide-react";
import api from "../api/axios";
import { toast } from "react-toastify";

import "../styles/DeleteReservation.css";


function DeleteReservation({
    reservation,
    onClose,
    onUpdate
}) {


    const [choice,setChoice] = useState(reservation.statutProduit);
const handleConfirmDelete = async()=>{
if(reservation.type==="reservation"){
    try{

        const response =
            await api.put(
                    `/produits/statut/${reservation.codeProduit}`,
                    {
                        statut: choice
                    }
                );


        if(response.data.success){

            toast.success(
                "Statut modifié avec succès"
            ,{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    });
            // send new status to parent page
            onUpdate(
                response.data.statut
            );
            onClose()
        }


    }catch(error){

        toast.error(
            "Erreur modification statut"
        ,{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    });

    }
}else{
    console.log(reservation.idProlongment)
    const response =
            await api.put(
                    `/prolongements/statut/${reservation.idProlongement}`,
                    {
                        statut: choice
                    }
                );


        if(response.data.success){

            toast.success(
                "Statut modifié avec succès"
            ,{
      style:{
        width: "auto",
            maxWidth: "90%",
            fontFamily: "'Playfair Display', serif",
            marginTop:"20px"
      }
    });
            // send new status to parent page
            onUpdate(
                response.data.statut
            );
            onClose()
        }
}
};
    


    return (

        <div className="delete-overlay">


            <div className="delete-modal">


                <div className="warning-icon">

                    <AlertTriangle
                        size={38}
                        color="#F59E0B"
                    />

                </div>



                <h1>
                    Supprimer la demande
                </h1>



               



                <hr/>


                <h3 className="choose-title">
                    Choisissez une option :
                </h3>



                {/* ABANDONNEE */}

                <label
                    className={
                        choice==="canceled"
                        ?
                        "option-card abandoned selected"
                        :
                        "option-card abandoned"
                    }
                >

                    <input
                        type="radio"
                        checked={
                            choice==="canceled"
                        }
                        onChange={()=>
                            setChoice("canceled")
                        }
                    />


                    <div className="option-icon red">

                        <UserX size={28}/>

                    </div>


                    <div className="option-content">


                        <h3>
                            Abandonner cette demande
                        </h3>


                        <p>
                            Le client n’est pas arrivé le jour du stockage.
                        </p>


                        


                    </div>


                </label>





                {/* ENDED */}

                <label
                    className={
                        choice==="ended"
                        ?
                        "option-card ended selected"
                        :
                        "option-card ended"
                    }
                >

                    <input
                        type="radio"
                        checked={
                            choice==="ended"
                        }
                        onChange={()=>
                            setChoice("ended")
                        }
                    />



                    <div className="option-icon green">

                        <CalendarCheck size={28}/>

                    </div>



                    <div className="option-content">


                        <h3>
                            Clôturer cette demande.
                        </h3>


                        <p>
                           Le processus de stockage est terminé.
                        </p>



                    </div>


                </label>






                <div className="modal-buttons">


                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Annuler
                    </button>



                    <button
                        className="confirm-btn"
                        onClick={()=>
                            handleConfirmDelete()
                        }
                    >
                        Confirmer
                    </button>


                </div>


            </div>


        </div>

    );

}


export default DeleteReservation;