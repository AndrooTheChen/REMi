import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

/*
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items = []
    }
  }

  render() {
    const { items } = this.state;
    return <>
      <input> </input>
      <h1> gg </h1>
      <ul>
        {items.map(item => <li>{item} </li>)}
      </ul>
    </>
  }
}*/

//component imports
import MainPage from "./components/MainPage";
import Banner from "./components/Banner";
import HowTo from "./components/HowTo";
import Leaderboard from "./components/Leaderboard";
//firebase imports

//react + css

//router 
import {BrowserRouter as Router,Switch, Route } from "react-router-dom";

const App = () => {

  return (
    <div class="content">
    <Router>
      <Banner></Banner>
      <Switch>
        <Route path="/" exact component={MainPage} />
        <Route path="/howto" exact component={HowTo} />
        <Route path="/leaderboard" exact component={Leaderboard} />
        {/*
        more routes
        <Route path="/" exact component={} />
        <Route path="/" exact component={} />
        <Route path="/" exact component={} />
        */}

      </Switch>
    </Router>
    </div>
  );
}

export default App;



