import logoo from "../img/logoo.png"
import leaf from "../img/leaf.png"
import leaf1 from "../img/leaf1.png"
import React,{useEffect,useState} from "react"
import {useNavigate} from "react-router-dom"
function Splash(){
        const navigate=useNavigate();
    
          useEffect(()=>{
              setTimeout(()=>{
                  navigate("/home");
              },4000);
          },[]);
    return(<>
    <h1 className="bien">
       <span style={{"--index": 0}}>B</span>
       <span style={{"--index": 1}}>i</span>
       <span style={{"--index": 2}}>e</span>
       <span style={{"--index": 3}}>n</span>
       <span style={{"--index": 4}}>v</span>
       <span style={{"--index": 5}}>e</span>
       <span style={{"--index": 6}}>n</span>
       <span style={{"--index": 7}}>u</span>
       <span style={{"--index": 8}}>e</span>
    </h1>
    <img  id="logo" src={logoo} alt=""/>
    <img id="l1" width="10%"  src={leaf} alt=""/>
    <img id="l2" width="15%" src={leaf1} alt=""/>
    <img id="l3"  width="10%" src={leaf} alt=""/>
    <img id="l4" width="15%" src={leaf1} alt=""/>
    <img id="l5" width="10%" src={leaf} alt=""/>
    <img id="l6" width="15%" src={leaf1} alt=""/>
    </>);
}
export default Splash;