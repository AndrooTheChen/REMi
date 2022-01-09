import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/main.css";
import { Nav, Navbar, Button, Form, NavDropdown, FormControl } from "react-bootstrap";

const ROUTES = ["/", "/howto", "/leaderboard", "https://github.com/AndrooTheChen/REMi"];
const TEXTS = ["Home", "How To", "Leaderboard", "Repository"];

const Banner = () => (
    <div class="container navbar-container mt-3">
        {/* Navigation Bar */}
        <Navbar variant="dark" bg="dark" expand="lg">
            <Navbar.Brand href="/">REMi</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {
                        ROUTES.map((route, index) => <Nav.Link href={route} className={route === window.location.pathname ? 'active' : ""}>{TEXTS[index]}</Nav.Link>)
                    }
                </Nav>
                <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <Button variant="outline-success">Go!</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    </div>
);
export default Banner;
