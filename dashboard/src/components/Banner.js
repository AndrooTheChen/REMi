import React, { useState, useEffect, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/main.css";
import {Nav, Navbar, Button, Form, NavDropdown, FormControl} from "react-bootstrap";


const Banner = () => {
    const routes = ["http://localhost:3000/","http://localhost:3000/howto", "http://localhost:3000/leaderboard"];

    return (
        <div class="container navbar-container mt-3">
            {/* Navigation Bar */}
            <Navbar variant="dark" bg="dark"  expand="lg">
                <Navbar.Brand href="/">REMi</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/" className={routes[0]===window.location.href?"active":""}>Home</Nav.Link>
                        <Nav.Link href="howto" className={routes[1]===window.location.href?"active":""}>How To</Nav.Link>
                        <Nav.Link href="leaderboard" className={routes[2]===window.location.href?"active":""}>Leaderboard</Nav.Link>
                        <Nav.Link href="https://github.com/AndrooTheChen/REMi">Repository</Nav.Link>
                        </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="outline-success">Go!</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};
export default Banner;
