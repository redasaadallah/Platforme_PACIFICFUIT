import React, {useState} from "react";
import "../styles/VerificationModal.css";
import { ShieldCheck, Mail, Phone, RefreshCw } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";


function VerificationModal({
    open,
    onClose,
    email,
    telephone,
    onVerified
}){


    const [emailCode,setEmailCode]=useState("");
    const [whatsappCode,setWhatsappCode]=useState("");



    if(!open) return null;



    const verifyCodes = async()=>{

    if(!emailCode.trim() || !whatsappCode.trim()){
    
        toast.error("Veuillez saisir les deux codes.")
            
    }else{
        try{


            const response =
            await axios.post(
                "/api/client/verify",
                {

                    email:email,

                    telephone:telephone,

                    emailCode:emailCode,

                    whatsappCode:whatsappCode

                }
            );



            if(response.data.success){


                onVerified();
                onClose();
                toast.success("Vos coordonnées ont été vérifiées avec succès.")

            }


        }
        catch(error){

            toast.error(
                error.response.data.message
            );

        }

    }
    }




    const resendCodes=async()=>{


        await axios.post(
            "/api/client/sendCode",
            {
                email,
                telephone
            }
        );


        toast.success("Codes renvoyés");

    }



    return(

        <div className="verification-overlay">


            <div className="verification-box">


                <div className="verify-icon">

                    <ShieldCheck size={45}/>

                </div>



                <h1>
                    Vérification de vos coordonnées
                </h1>


                <p className="verify-description">

                    Nous avons envoyé un code de vérification
                    à votre email et sur WhatsApp.

                </p>



                <div className="info-box">

                   

                    Les deux codes sont valables 5 minutes.

                </div>





                <div className="input-group">


                    <label>
                        <Mail size={22}/>
                        Code reçu par Email
                    </label>


                    <input

                        placeholder="Saisissez le code à 6 chiffres"

                        value={emailCode}

                        onChange={
                            e=>setEmailCode(e.target.value)
                        }

                    />

                    <small>
                        Vérifiez votre boîte de réception.
                    </small>


                </div>





                <div className="input-group">


                    <label>

                        <Phone size={22}/>

                        Code reçu par WhatsApp

                    </label>


                    <input

                        placeholder="Saisissez le code à 6 chiffres"

                        value={whatsappCode}

                        onChange={
                            e=>setWhatsappCode(e.target.value)
                        }

                    />


                    <small>
                        Vérifiez vos messages WhatsApp.
                    </small>


                </div>




                <div>
                    <button onClick={()=>{onClose()}}>Annuler</button>
                <button
                    className="verify-button"
                    onClick={verifyCodes}
                >

                    <ShieldCheck size={22}/>

                    Vérifier les codes

                </button>
                </div>




                <button
                    className="resend-button"
                    onClick={resendCodes}
                >

                    <RefreshCw size={15}/>

                    Renvoyer les codes

                </button>




            </div>


        </div>

    )

}


export default VerificationModal;