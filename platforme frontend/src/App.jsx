import Splash from "./composants/splash"
import React,{useContext,useState,useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // ← make sure to import these
import ProtectedRoute from "./ProtectedRoute";
import Loader from "./composants/loader"
import "./App.css"
import Contact from "./contact";
import Home from "./home"
import Apropos from "./apropos"
import Reservation from "./reservation";
import Demander from "./demander";
import Baradmin from "./composants/baradmin";
import LoginAdmin from "./loginadmin";
import Dashboard from "./dashboard";
import Ouinon from "./composants/ouinon";
import Repondre from "./composants/repondre";
import Admindemande from "./admindemande";
import Adminreservation from "./adminreservation";
import Statistic from "./statistic";
import Espaceclient from "./espaceclient";
import Parametre from "./parametre";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRouteAdmin from "./composants/PrivateRouteAdmin";
import PrivateRouteClient from "./composants/PrivateRouteClient";
function App() {
  
  return (
    <>
   <div style={{position:"relative"}}>

  <ToastContainer
    position="top-center"
    autoClose={5000}
    newestOnTop
    closeOnClick
    pauseOnHover
    draggable
    closeButton
    style={{
        textAlign:"center"
        
    }}
/>
</div>
    <Routes>
    <Route path="/" element={<Splash/>} />
    <Route path="/home" element={<Home/>} />
    <Route path="/apropos" element={<Apropos/>} />
    <Route path="/contact" element={<Contact/>} />
    <Route path="/reservation" element={<Reservation/>}/>
    <Route path="/demander" element={<Demander/>}/>
    <Route path="/admin" element={<LoginAdmin/>}/>
    <Route path="/dashboard" element={
      <PrivateRouteAdmin>
        <Dashboard/>
        </PrivateRouteAdmin>
      }/>
    <Route path="/admindemande" element={
      <PrivateRouteAdmin>
      <Admindemande/>
      </PrivateRouteAdmin>
    }/>
    <Route path="/adminreservation" element={
      <PrivateRouteAdmin>
      <Adminreservation/>
      </PrivateRouteAdmin>
      }/>
    <Route path="/statistic" element={
      <PrivateRouteAdmin>
      <Statistic/>
     </PrivateRouteAdmin>
      }/>
    <Route path="/parametre" element={
      <PrivateRouteAdmin>
      <Parametre/>
      </PrivateRouteAdmin>
      }/>
    <Route path="/espaceclient" element={
      <PrivateRouteClient>
      <Espaceclient/>
      </PrivateRouteClient>
      }/>
    </Routes>
    
    </>
    //https://chatgpt.com/c/6a396f26-8854-83ea-b77c-4ece0ff4c168?mweb_fallback=1
    
  );
}

export default App;
