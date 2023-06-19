import React from 'react';
import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

const Navigation = ({ account }) => {
    return (
        <Navbar expand="lg" bg="dark" variant="dark">
            <Container>
                {/* <Navbar.Brand href="https://judmas.com">
                    &nbsp; DiceBet
                </Navbar.Brand> */}

                <Navbar.Brand as={Link} to="/">
                    &nbsp; DiceBet
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbar navbar-dark bg-primary" />
                <Navbar.Collapse id="navbar navbar-dark bg-primary">
                    <Nav className="me-auto">                     
                        <Nav.Link as={Link} to="/buy&selltokens">Buy & Sell Tokens</Nav.Link>
                        <Nav.Link as={Link} to="/dice">Dice</Nav.Link>
                        <Nav.Link as={Link} to="/smartcontractinfo">Smart Contract Info</Nav.Link>
                        <Nav.Link as={Link} to="/contact"> Contact</Nav.Link>
                    </Nav>
                    <h1>&nbsp;</h1><h1>&nbsp;</h1><h1>&nbsp;</h1><h1>&nbsp;</h1><h1>&nbsp;</h1><h1>&nbsp;</h1><h1>&nbsp;</h1><h1>&nbsp;</h1>
                    <h1>&nbsp;</h1><h1>&nbsp;</h1><h1>&nbsp;</h1><h1>&nbsp;</h1><h1>&nbsp;</h1><h1>&nbsp;</h1><h1>&nbsp;</h1><h1>&nbsp;</h1>
                    <h1>&nbsp;</h1><h1>&nbsp;</h1><h1>&nbsp;</h1><h1>&nbsp;</h1><h1>&nbsp;</h1><h1>&nbsp;</h1>
                    <h1>&nbsp;</h1><h1>&nbsp;</h1>
                    <h1>&nbsp;</h1><h1>&nbsp;</h1><h1>&nbsp;</h1><h1>&nbsp;</h1>
                    <Nav>
                        <Nav.Link
                            href={`https://etherscan.io/address/${account}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button nav-button btn-sm mx-4">
                            <Button variant="outline-light">
                                {account.slice(0, 3) + '...' + account.slice(35, 42)}
                            </Button>
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        <h1>&nbsp;</h1><h1>&nbsp;</h1>
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;