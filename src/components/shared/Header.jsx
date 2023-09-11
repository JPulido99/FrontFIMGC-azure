import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import { Navbar, NavDropdown, Figure } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';
import AuthContext from '../../Context/AuthProvider';


const Header = () => {
  const {user} = useContext(AuthContext)
  const navigate= useNavigate()
  const handleLogout = ()=>{
    localStorage.removeItem("user")    
    window.location.reload();
   }
  return (
    <Navbar expand='md'>
    <Container>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Brand>
        <img
          src="/bannerdoc.jpg"
          height="60"
          className="d-inline-block align-top"
          alt="Banner"
        />
      </Navbar.Brand>
      <Container className='customize-navbar-brand text-uppercase justify-content-center'>Sistema de gestión de grados y títulos</Container>
      <Navbar.Collapse className="justify-content-end customize-navbar-collapse">
        <NavDropdown
          title={
            <span>
              {user.nombre}{" "}
              <Figure>
                <Figure.Image className='margin-navar-icon'
                  width={33}
                  height={33}
                  src="/300px-UserIcon-FIMGC.png"
                />
              </Figure>
            </span>
          } id="basic-nav-dropdown" >
          <NavDropdown.Item href="/" onClick={handleLogout}>
            Cerrar sesión <i className="fi fi-br-address-card"></i>
          </NavDropdown.Item>
        </NavDropdown>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}

export default Header