const express = require("express");
const qrcode = require("qrcode-terminal");

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require("@whiskeysockets/baileys");


const app = express();


// Autoriser les gros fichiers PDF
app.use(express.json({
    limit: "20mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "20mb"
}));



let sock;
let isConnected = false;
let isStarting = false;



async function startWhatsApp(){


    if(isStarting){
        return;
    }


    isStarting = true;



    const {state, saveCreds} =
        await useMultiFileAuthState("./auth");



    sock = makeWASocket({

        auth: state

    });



    sock.ev.on(
        "creds.update",
        saveCreds
    );




    sock.ev.on(
        "connection.update",
        (update)=>{


            const {
                qr,
                connection,
                lastDisconnect
            } = update;




            // Afficher QR
            if(qr){

                console.log(
                    "Scanner le QR :"
                );


                qrcode.generate(
                    qr,
                    {
                        small:true
                    }
                );

            }





            // Connexion réussie
            if(connection === "open"){


                console.log(
                    "✅ WhatsApp connecté"
                );


                isConnected = true;
                isStarting = false;

            }





            // Déconnexion
            if(connection === "close"){


                isConnected = false;
                isStarting = false;



                const statusCode =
                    lastDisconnect
                    ?.error
                    ?.output
                    ?.statusCode;



                const shouldReconnect =
                    statusCode !== DisconnectReason.loggedOut;




                console.log(
                    "❌ WhatsApp déconnecté"
                );



                if(shouldReconnect){


                    console.log(
                        "🔄 Reconnexion dans 3 secondes..."
                    );



                    setTimeout(()=>{

                        startWhatsApp();

                    },3000);



                }
                else{


                    console.log(
                        "Compte déconnecté, refaire QR"
                    );

                }


            }



        }
    );



}







// ===============================
// Envoi WhatsApp
// Message + PDF
// ===============================

app.post(
"/send",
async(req,res)=>{


    try {


        if(!isConnected){


            return res.status(503).json({

                success:false,

                message:
                "WhatsApp non connecté"

            });


        }





        const {

            phone,

            message,

            pdf,

            fileName


        } = req.body;






        const jid =
            phone + "@s.whatsapp.net";







        // ===============================
        // Envoyer texte
        // ===============================

        await sock.sendMessage(

            jid,

            {

                text: message

            }

        );



        console.log(
            "✅ Message texte envoyé"
        );








        // ===============================
        // Envoyer PDF
        // ===============================

        if(pdf){



            const buffer =
                Buffer.from(
                    pdf,
                    "base64"
                );





            console.log(
                "PDF taille :",
                buffer.length,
                "bytes"
            );






            await sock.sendMessage(

                jid,

                {


                    document: buffer,


                    mimetype:
                    "application/pdf",


                    fileName:
                    fileName ||
                    "document.pdf"


                }

            );





            console.log(
                "✅ PDF envoyé"
            );



        }
        else{


            console.log(
                "⚠️ Aucun PDF reçu"
            );


        }






        res.json({

            success:true,

            message:
            "Message envoyé"

        });






    }
    catch(error){



        console.log(error);



        res.status(500).json({

            success:false,

            error:
            error.message

        });



    }



});








// Démarrage WhatsApp

startWhatsApp();





app.listen(

    3000

);
// 3000 docker
//3005 nginx