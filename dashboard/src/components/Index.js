import React, { useState, useEffect, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/main.css";
import remImage from "../REMi-Image2.png";

const Index = () => {
  return (
    <div>
        <div class="container navbar-container">
            {/* Navigation Bar */}
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <div id="topleft">
                    {/* REMi brand and Toggle Button*/}
                    <div class="floatl">
                        <button class="navbar-toggler navbar-toggler-left mx-2 mb-auto mt-3 floatl" type="button" data-toggle="collapse" data-target="#navbarLinks" aria-controls="navbarLinks" aria-expanded="false" aria-label="toggle navigation">
                            <span class="navbar-toggler-icon"></span>  
                        </button>
                    
                        <a class="navbar-brand mt-3 mb-1" href="#">REMi</a>
                        {/* to replace REMi brand with an image of REMi in Puzzles and Dragons Font in the future*/}
                        {/* Content within collapsible NavBar*/}
                    </div>
                    <div class="collapse navbar-collapse ml-2 floatl" id="navbarLinks">
                        <ul class="navbar-nav mt-sm-3 mr-auto mb-auto">
                            <li class="nav-item active">
                                <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>  
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">How To</a>
                            </li>  
                            <li class="nav-item">
                                <a class="nav-link" href="#">Leaderboard</a>  
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="https://github.com/AndrooTheChen/REMi">Repository</a>  
                            </li>
                        </ul>  
                    </div>
                </div>
                <form class="form-inline mb-auto mt-2 my-lg-0" id= "topright">
                    <input class="form-control mr-sm-2 floatl" type="search" placeholder="Search" aria-label="Go!" />
                    <button class="btn btn-outline-success my-2 my-sm-0 floatl" type="submit">Go!</button>
                </form>
            </nav>
        </div>
        <div class="welcome-title">
            <h1 class="textcenter">Welcome to REMi!</h1>
            <h4 class="textcenter">Rare Egg Machine Bot</h4>
        </div>
        <div>
            <div id = "About">
                <h3 class = "textcenter">What is REMi?</h3>
                <p class= "textcenter">REMi is a bot for the platform Discord which allows users to simulate rolling on the Rare Egg Machine from the popular mobile game <a href= "https://www.puzzleanddragons.us/news">Puzzles and Dragons (PAD)</a>. The game has added many new monster series throughout the years including several collaboration with other popular games or shows, but has lost some of its original charm. REMi is made to relive the days of nostalagia before the huge power creeps and confusing evolution trees. Remember when the Chinese God series were viable leads, or when DQXQ was meta? Pull on the Rare Egg Machine filled with original Godfest line-ups like Odin or Sonia or disappointments like the Golem series!</p>
            </div>
            <div id="Remi-Image">
                <img src={remImage} alt="Rare Egg Machine" />
            </div>
        </div>
        {/*Optional JavaScript*/}
        {/*jQuery first, then Popper.js, then Bootstrap JS*/}
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    </div>
  );
};
export default Index;
