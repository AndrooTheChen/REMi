import React, { useState, useEffect, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/main.css";
import remImage from "../REMi-Image2.png";

const MainPage = () => {
  return (
    <>
        <div class="welcome-title">
            <h1>Welcome to REMi!</h1>
            <h4>Rare Egg Machine Bot</h4>
        </div>
        <div id = "About">
            <div id = "AboutText">
                <h3>What is REMi?</h3>
                <p>REMi is a bot for the platform Discord which allows users to simulate rolling on the Rare Egg Machine from the popular mobile game <a href= "https://www.puzzleanddragons.us/news">Puzzles and Dragons (PAD)</a>. The game has added many new monster series throughout the years including several collaboration with other popular games or shows, but has lost some of its original charm. REMi is made to relive the days of nostalgia before the huge power creeps and confusing evolution trees. Remember when the Chinese God series were viable leads, or when DQXQ was meta? Pull on the Rare Egg Machine filled with original Godfest line-ups like Odin or Sonia or disappointments like the Golem series!</p>
            </div>
            <div id="Remi-Image">
                <img src={remImage} alt="Rare Egg Machine" />
            </div>
        </div>
    </>
  );
};
export default MainPage;
