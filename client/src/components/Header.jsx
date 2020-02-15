import React, { useContext } from 'react'
import { Navbar, Nav, Form, Button } from 'react-bootstrap'
import { NavLink, useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Header = () => {

  const history = useHistory()
  const auth = useContext(AuthContext)

  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
    history.push('/')
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">Logo</Navbar.Brand>
      <Nav className="mr-auto">
        <NavLink to='/create'>Create</NavLink>
        <NavLink to='/links'>Links</NavLink>
      </Nav>
      <Form inline>
        <Button onClick={logoutHandler} variant="outline-info">Exit</Button>
      </Form>
    </Navbar>
  )
}

export default Header
