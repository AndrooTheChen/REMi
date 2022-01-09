import React, { useState, useEffect, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/main.css";

const HowTo = () => {
    
  return (
    <>
        <div class="welcome-title">
            <h1>How To</h1>
            <h4>All you need to know to use REMi!</h4>
            
        </div>
        
        <div class = "MainContent">
            <h2>Commands</h2>
            <hr/>
            <p>%roll - roll for a monster!  </p>
            <p>%monbox - print monster box of collected monsters </p>
            <p>%myrolls - see how many rolls you have left  </p>
            <p>%myclaims - see how many claims you have left </p>
            <p>%help - list all commands  </p>
            <br/>
            <h2>Examples</h2>
            <hr/>
        </div>
    </>
  );
};
export default HowTo;
