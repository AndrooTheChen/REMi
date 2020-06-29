import React from 'react';
import logo from './logo.svg';
import './App.css';

//component imports
import Index from "../src/components/Index";

//firebase imports

//react + css

//router 
import {BrowserRouter as Router,Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Index} />
        
      </Switch>
    </Router>
  );
}

export default App;
