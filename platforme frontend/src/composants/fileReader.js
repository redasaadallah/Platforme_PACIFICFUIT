import { Worker, Viewer } from '@react-pdf-viewer/core';
import "../styles/fileReader.css"
import nextfile from '../img/nextfile.png'
export default function FileReader({url,close,suivant,type,produit}){

    return(<>
         <div id="black"  className="black"></div>

        <div id="pdfopened"     >
            <h1>{produit.nomProduit} ({produit.quantite} tonnes)</h1>
            <div><h3>{type}</h3><button onClick={suivant}><img src={nextfile}/></button></div>
            
            <div className="myDiv" >
                
          <Worker  workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
            <Viewer
            
              fileUrl={`${url}`}
              defaultScale={1.0}
              showToolbar={false} //  pas de barre d’outils
            />
          </Worker>
          
        </div> 
            
            <div id="confirmerbuttons">
                <a href={url} target="_blank" download={`${type}.pdf`}>Télécharger</a>
                <button onClick={close}>Fermer</button>
            </div>
        </div>
    </>);
}